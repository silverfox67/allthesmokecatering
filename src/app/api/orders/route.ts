import { NextResponse } from "next/server";
import { z } from "zod";
import { SITE_CONFIG } from "@/config/site-config";

const orderItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  quantity: z.number().min(1).default(1),
  specialInstructions: z.string().optional(),
});

const turnkeyOrderSchema = z.object({
  customerName: z.string().min(2, "Customer name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(7, "Valid phone number is required"),
  fulfillmentType: z.enum(["pickup", "delivery"]).default("pickup"),
  targetDate: z.string().min(1, "Target fulfillment date is required"),
  timeSlot: z.string().optional().default("12:00 PM - 2:00 PM"),
  deliveryAddress: z.string().optional(),
  deliveryZone: z.number().optional(),
  items: z.array(orderItemSchema).min(1, "At least one item must be ordered"),
  subtotal: z.number().min(0),
  deliveryFee: z.number().min(0).default(0),
  total: z.number().min(0),
  notes: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const rawData = await req.json();
    const validated = turnkeyOrderSchema.safeParse(rawData);

    if (!validated.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validated.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = validated.data;
    const orderNumber = `#ATS-${Math.floor(1000 + Math.random() * 9000)}`;
    const createdAt = new Date().toISOString();

    // 1. Zelle & Stripe Payment Instructions
    const zelleInstructions = {
      method: "Zelle Instant Transfer",
      phone: SITE_CONFIG.phone,
      recipient: SITE_CONFIG.legalName,
      memo: orderNumber,
      instructions: `Open your bank app (Chase, BoA, Wells Fargo, etc.), select Zelle, and send payment of $${data.total.toFixed(2)} to ${SITE_CONFIG.phone} (${SITE_CONFIG.legalName}). In the memo / note field, enter your order number: ${orderNumber}.`,
    };

    const stripePaymentUrl = process.env.STRIPE_PAYMENT_LINK || `https://buy.stripe.com/allthesmoke-preorder?client_reference_id=${encodeURIComponent(orderNumber)}`;

    // 2. Formatted Pre-Order Kitchen Ticket
    const ticket = {
      orderNumber,
      createdAt,
      customer: {
        name: data.customerName,
        email: data.email,
        phone: data.phone,
      },
      fulfillment: {
        type: data.fulfillmentType,
        date: data.targetDate,
        timeSlot: data.timeSlot,
        location:
          data.fulfillmentType === "pickup"
            ? `${SITE_CONFIG.hubAddress.street}, Chicago, IL ${SITE_CONFIG.hubAddress.zip} (Commercial Kitchen Hub)`
            : (data.deliveryAddress || "Address provided during confirmation"),
        instructions:
          data.fulfillmentType === "pickup"
            ? "Pre-order curbside / commissary pickup. Please arrive during your selected window and call (773) 707-9988 upon arrival."
            : "Direct Cambro heated carrier drop. Order will arrive at 150°F+ ready for chafer service.",
      },
      lineItems: data.items.map((item) => ({
        id: item.id,
        name: item.name,
        qty: item.quantity,
        unitPrice: `$${item.price.toFixed(2)}`,
        itemTotal: `$${(item.price * item.quantity).toFixed(2)}`,
      })),
      pricing: {
        subtotal: `$${data.subtotal.toFixed(2)}`,
        deliveryFee: `$${data.deliveryFee.toFixed(2)}`,
        total: `$${data.total.toFixed(2)}`,
      },
      payment: {
        zelle: zelleInstructions,
        stripeUrl: stripePaymentUrl,
      },
    };

    // 3. Optional Brevo email notification to Marion Bolden
    const brevoApiKey = process.env.BREVO_API_KEY;
    if (brevoApiKey) {
      try {
        await fetch("https://api.brevo.com/v3/smtp/email", {
          method: "POST",
          headers: {
            "api-key": brevoApiKey,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            sender: {
              name: "ATS Order Dispatch",
              email: process.env.BREVO_SENDER_EMAIL || "orders@allthesmokecatering.com",
            },
            to: [{ email: SITE_CONFIG.primaryAdminEmail, name: "Marion Bolden" }],
            cc: [{ email: SITE_CONFIG.secondaryAdminEmail, name: "ATS Kitchen" }],
            subject: `🥩 NEW TURNKEY ORDER ${orderNumber} - ${data.customerName} ($${data.total.toFixed(2)})`,
            htmlContent: `
              <h2>NEW PRE-ORDER TICKET: ${orderNumber}</h2>
              <p><strong>Customer:</strong> ${data.customerName} (${data.phone})</p>
              <p><strong>Email:</strong> ${data.email}</p>
              <p><strong>Fulfillment:</strong> ${data.fulfillmentType.toUpperCase()} on ${data.targetDate} (${data.timeSlot})</p>
              <p><strong>Total:</strong> $${data.total.toFixed(2)}</p>
              <h3>Items:</h3>
              <ul>
                ${data.items.map((i) => `<li>${i.quantity}x ${i.name} ($${(i.price * i.quantity).toFixed(2)})</li>`).join("")}
              </ul>
            `,
          }),
        });
      } catch (err) {
        console.warn("Brevo order alert failed:", err);
      }
    }

    return NextResponse.json(
      {
        success: true,
        orderNumber,
        ticket,
        zelle: zelleInstructions,
        stripeUrl: stripePaymentUrl,
        message: `Order ticket ${orderNumber} generated successfully. Complete payment via Zelle or Stripe to lock in your smoke schedule.`,
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal order error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
