import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { SITE_CONFIG } from "@/config/site-config";

// Zod Schema for Catering Quote Inquiries
const quoteSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please provide a valid email address"),
  phone: z.string().min(7, "Please provide a valid phone number"),
  eventDate: z.string().optional().default("Date Pending"),
  guestCount: z.coerce.number().min(1, "Guest count must be at least 1").default(25),
  packageId: z.string().optional().default("pitmaster-feast"),
  packageName: z.string().optional().default("The Pitmaster Feast"),
  deliveryAddress: z.string().optional().default("Venue TBD"),
  serviceStyle: z.string().optional().default("Heated Drop-Off Delivery"),
  selectedProteins: z.array(z.string()).optional().default([]),
  selectedSides: z.array(z.string()).optional().default([]),
  notes: z.string().optional().default(""),
  // Anti-spam honeypot & speed gate
  honey: z.string().optional(),
  formLoadedAt: z.union([z.string(), z.number()]).optional(),
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-key"
);

export async function POST(req: Request) {
  try {
    let rawData: Record<string, unknown> = {};

    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      rawData = await req.json();
    } else {
      const formData = await req.formData();
      const obj: Record<string, unknown> = {};
      formData.forEach((val, key) => {
        if (key === "selectedProteins" || key === "selectedSides") {
          if (!obj[key]) obj[key] = [];
          (obj[key] as string[]).push(val.toString());
        } else {
          obj[key] = val.toString();
        }
      });
      rawData = obj;
    }

    // 1. Zero-JS Honeypot & 2-Second Speed Gate
    if (rawData.honey) {
      return NextResponse.json({ success: true, message: "Inquiry received" }, { status: 200 });
    }
    if (rawData.formLoadedAt && Date.now() - Number(rawData.formLoadedAt) < 2000) {
      return NextResponse.json({ success: true, message: "Inquiry received" }, { status: 200 });
    }

    // 2. Validate payload with Zod
    const validated = quoteSchema.safeParse(rawData);
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
    const ticketId = `ATS-QUOTE-${Math.floor(1000 + Math.random() * 9000)}`;

    // 3. Optional write to Supabase (graceful fallback if not configured)
    try {
      if (
        process.env.NEXT_PUBLIC_SUPABASE_URL &&
        !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")
      ) {
        await supabase.from("catering_inquiries").insert([
          {
            ticket_id: ticketId,
            name: data.name,
            email: data.email,
            phone: data.phone,
            event_date: data.eventDate,
            guest_count: data.guestCount,
            package_id: data.packageId,
            delivery_address: data.deliveryAddress,
            service_style: data.serviceStyle,
            notes: data.notes,
            status: "new",
          },
        ]);
      }
    } catch (dbErr) {
      console.warn("Supabase insert skipped or failed:", dbErr);
    }

    // 4. Clean Kitchen Slip HTML for Admin Dispatch
    const adminKitchenSlipHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: monospace, sans-serif; background-color: #0A0A0A; color: #FAFAFA; padding: 20px; }
          .ticket { max-width: 600px; margin: 0 auto; background: #121212; border: 2px dashed #F59E0B; padding: 24px; border-radius: 8px; }
          .header { text-align: center; border-bottom: 2px solid #F59E0B; padding-bottom: 12px; margin-bottom: 16px; }
          .header h1 { color: #F59E0B; margin: 0; font-size: 22px; letter-spacing: 2px; }
          .section { margin-bottom: 14px; padding-bottom: 10px; border-bottom: 1px solid #333; }
          .label { color: #F59E0B; font-weight: bold; text-transform: uppercase; font-size: 11px; }
          .val { font-size: 14px; color: #FFF; margin-top: 3px; }
          .highlight { background: #332200; padding: 4px 8px; border-radius: 4px; border: 1px solid #F59E0B; }
          .footer { text-align: center; font-size: 11px; color: #888; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="ticket">
          <div class="header">
            <h1>ALL THE SMOKE BBQ &amp; CATERING</h1>
            <p style="margin: 4px 0; color: #888; font-size: 12px;">COMMISSARY KITCHEN DISPATCH SLIP</p>
            <p style="margin: 0; color: #F59E0B; font-size: 13px;">TICKET #${ticketId}</p>
          </div>

          <div class="section">
            <div class="label">Client &amp; Contact</div>
            <div class="val"><strong>Name:</strong> ${data.name}</div>
            <div class="val"><strong>Phone:</strong> <a href="tel:${data.phone}" style="color: #F59E0B;">${data.phone}</a></div>
            <div class="val"><strong>Email:</strong> <a href="mailto:${data.email}" style="color: #FFF;">${data.email}</a></div>
          </div>

          <div class="section">
            <div class="label">Event Logistics</div>
            <div class="val highlight"><strong>Target Event Date:</strong> ${data.eventDate}</div>
            <div class="val"><strong>Guest Count:</strong> ${data.guestCount} Guests</div>
            <div class="val"><strong>Service Style:</strong> ${data.serviceStyle}</div>
            <div class="val"><strong>Venue / Delivery Address:</strong> ${data.deliveryAddress}</div>
          </div>

          <div class="section">
            <div class="label">Menu &amp; Package Spec</div>
            <div class="val"><strong>Package:</strong> ${data.packageName} (${data.packageId})</div>
            ${data.selectedProteins && data.selectedProteins.length > 0 ? `<div class="val"><strong>Meats Requested:</strong> ${data.selectedProteins.join(", ")}</div>` : ""}
            ${data.selectedSides && data.selectedSides.length > 0 ? `<div class="val"><strong>Sides Requested:</strong> ${data.selectedSides.join(", ")}</div>` : ""}
          </div>

          ${data.notes ? `
          <div class="section">
            <div class="label">Pitmaster &amp; Event Notes</div>
            <div class="val" style="white-space: pre-wrap; color: #DDD;">${data.notes}</div>
          </div>
          ` : ""}

          <div class="footer">
            Operations Hub: 3401 N Orange Ave, Chicago, IL 60634<br>
            Direct Dispatch Phone: (773) 707-9988
          </div>
        </div>
      </body>
      </html>
    `;

    // 5. Branded Auto-responder HTML for the Client
    const clientAutoResponderHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0A0A0A; color: #FAFAFA; padding: 20px; }
          .card { max-width: 600px; margin: 0 auto; background: #121212; border: 1px solid rgba(255,255,255,0.15); padding: 32px; border-radius: 16px; }
          .gold { color: #F59E0B; }
          .btn { display: inline-block; background: #F59E0B; color: #0A0A0A; font-weight: bold; text-decoration: none; padding: 12px 24px; border-radius: 8px; margin-top: 16px; }
          .box { background: #1c1c1c; border-left: 4px solid #F59E0B; padding: 16px; margin: 20px 0; border-radius: 4px; }
          .footer { font-size: 12px; color: #777; margin-top: 24px; border-top: 1px solid #222; padding-top: 16px; text-align: center; }
        </style>
      </head>
      <body>
        <div class="card">
          <div style="text-align: center; margin-bottom: 24px;">
            <h1 style="margin: 0; color: #FFF; font-size: 26px; letter-spacing: 1px;">ALL THE SMOKE</h1>
            <p style="margin: 4px 0 0; color: #F59E0B; font-weight: bold; font-size: 12px; letter-spacing: 2px;">BBQ &amp; CATERING • CHICAGO</p>
          </div>

          <h2 style="color: #FFF; font-size: 20px;">We Received Your Catering Inquiry, ${data.name}!</h2>
          <p style="color: #CCC; line-height: 1.6;">
            Marion Bolden and the All The Smoke crew have logged your event inquiry (Ticket <strong>#${ticketId}</strong>).
            We are reviewing smoker capacity and hardwood curing schedules for your event on <strong>${data.eventDate}</strong>.
          </p>

          <div class="box">
            <p style="margin: 0 0 8px; font-weight: bold; color: #F59E0B;">Summary of Your Request:</p>
            <p style="margin: 4px 0; color: #EEE;">• <strong>Guest Count:</strong> ${data.guestCount} Guests</p>
            <p style="margin: 4px 0; color: #EEE;">• <strong>Package:</strong> ${data.packageName}</p>
            <p style="margin: 4px 0; color: #EEE;">• <strong>Service Style:</strong> ${data.serviceStyle}</p>
            <p style="margin: 4px 0; color: #EEE;">• <strong>Delivery/Venue:</strong> ${data.deliveryAddress}</p>
          </div>

          <h3 style="color: #FFF; font-size: 16px; margin-top: 24px;">What Happens Next:</h3>
          <ol style="color: #BBB; line-height: 1.6; padding-left: 20px;">
            <li><strong>Capacity Verification:</strong> We confirm pitmaster and smoker rig availability for your date.</li>
            <li><strong>Itemized Quote &amp; Tasting Plan:</strong> Marion sends you a customized proposal within 12 business hours.</li>
            <li><strong>Deposit &amp; Date Lock:</strong> A 25% deposit secures your date on our live-fire pit schedule.</li>
          </ol>

          <p style="color: #CCC; margin-top: 20px;">
            Need urgent confirmation or have custom meat requests (Whole Brisket, Oxtails, Turkey Chops)?
            Reach Marion Bolden directly:
          </p>

          <div style="text-align: center; margin: 24px 0;">
            <a href="tel:${SITE_CONFIG.phoneFormatted}" class="btn">CALL MARION: ${SITE_CONFIG.phone}</a>
          </div>

          <div class="footer">
            All The Smoke BBQ &amp; Catering<br>
            Commercial Operations Hub: 3401 N Orange Ave, Chicago, IL 60634<br>
            Direct: ${SITE_CONFIG.brandEmail} | TikTok: @allthesmokebbq_catering
          </div>
        </div>
      </body>
      </html>
    `;

    // 6. Dispatch Dual Emails via Brevo REST API
    const brevoApiKey = process.env.BREVO_API_KEY;
    if (brevoApiKey) {
      try {
        // Dispatch A: Admin Kitchen Slip to boldenmarion83@gmail.com + fallback bbqcateringking83@gmail.com
        await fetch("https://api.brevo.com/v3/smtp/email", {
          method: "POST",
          headers: {
            "api-key": brevoApiKey,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            sender: {
              name: "ATS Smokehouse Dispatch",
              email: process.env.BREVO_SENDER_EMAIL || "dispatch@allthesmokecatering.com",
            },
            to: [{ email: SITE_CONFIG.primaryAdminEmail, name: "Marion Bolden" }],
            cc: [{ email: SITE_CONFIG.secondaryAdminEmail, name: "ATS Kitchen Admin" }],
            subject: `🔥 NEW CATERING QUOTE #${ticketId}: ${data.name} (${data.guestCount} Guests) - ${data.eventDate}`,
            htmlContent: adminKitchenSlipHtml,
          }),
        });

        // Dispatch B: Branded Auto-responder to Client
        await fetch("https://api.brevo.com/v3/smtp/email", {
          method: "POST",
          headers: {
            "api-key": brevoApiKey,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            sender: {
              name: "Marion Bolden | All The Smoke",
              email: process.env.BREVO_SENDER_EMAIL || "marion@allthesmokecatering.com",
            },
            to: [{ email: data.email, name: data.name }],
            subject: `Smokehouse Inquiry Received #${ticketId} | All The Smoke BBQ & Catering`,
            htmlContent: clientAutoResponderHtml,
          }),
        });
      } catch (brevoErr) {
        console.warn("Brevo API call failed:", brevoErr);
      }
    } else {
      console.log(`[DEV MODE] Brevo API Key not configured. Dual emails generated for Ticket #${ticketId}`);
    }

    return NextResponse.json(
      {
        success: true,
        ticketId,
        message: "Catering quote submitted successfully. Marion Bolden will contact you within 12 business hours.",
        orderSummary: {
          client: data.name,
          email: data.email,
          phone: data.phone,
          eventDate: data.eventDate,
          guestCount: data.guestCount,
          package: data.packageName,
          serviceStyle: data.serviceStyle,
        },
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
