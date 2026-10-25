// Cloudflare Pages Function: /api/orders
export async function onRequestPost(context) {
  try {
    const req = context.request;
    const env = context.env || {};

    const rawData = await req.json();

    const customerName = (rawData.customerName || '').trim();
    const email = (rawData.email || '').trim();
    const phone = (rawData.phone || '').trim();
    const fulfillmentType = rawData.fulfillmentType === 'delivery' ? 'delivery' : 'pickup';
    const targetDate = rawData.targetDate || 'TBD';
    const timeSlot = rawData.timeSlot || '12:00 PM - 2:00 PM';
    const deliveryAddress = rawData.deliveryAddress || '';
    const items = Array.isArray(rawData.items) ? rawData.items : [];
    const subtotal = Number(rawData.subtotal) || 0;
    const deliveryFee = Number(rawData.deliveryFee) || 0;
    const total = Number(rawData.total) || (subtotal + deliveryFee);

    if (!customerName || !phone) {
      return new Response(JSON.stringify({ error: 'Customer name and phone are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const orderNumber = '#ATS-' + Math.floor(1000 + Math.random() * 9000);
    const createdAt = new Date().toISOString();

    const zelleInstructions = {
      method: 'Zelle Instant Transfer',
      phone: '(773) 707-9988',
      recipient: 'Marion Bolden',
      memo: orderNumber,
      instructions: `Open your bank app, select Zelle, and send payment of $${total.toFixed(2)} to (773) 707-9988 (Marion Bolden). In the memo/note field, enter order number: ${orderNumber}.`,
    };

    const stripePaymentUrl = env.STRIPE_PAYMENT_LINK || `https://buy.stripe.com/allthesmoke-preorder?client_reference_id=${encodeURIComponent(orderNumber)}`;

    const ticket = {
      orderNumber,
      createdAt,
      customer: { name: customerName, email, phone },
      fulfillment: {
        type: fulfillmentType,
        date: targetDate,
        timeSlot,
        location: fulfillmentType === 'pickup' ? '3401 N Orange Ave, Chicago, IL 60634' : deliveryAddress,
      },
      items,
      total: `$${total.toFixed(2)}`,
      zelle: zelleInstructions,
      stripeUrl: stripePaymentUrl,
    };

    const brevoApiKey = env.BREVO_API_KEY || env.BREVO_KEY || env.BREVO_TOKEN || env.SENDINBLUE_API_KEY;
    if (brevoApiKey) {
      try {
        await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'api-key': brevoApiKey,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            sender: {
              name: 'ATS Order Dispatch',
              email: env.BREVO_SENDER_EMAIL || 'info@allthesmokecatering.com',
            },
            replyTo: email ? { email: email, name: customerName } : undefined,
            to: [{ email: 'boldenmarion83@gmail.com', name: 'Marion Bolden' }],
            cc: [{ email: 'bbqcateringking83@gmail.com', name: 'ATS Kitchen' }],
            subject: `🥩 NEW TURNKEY ORDER ${orderNumber} - ${customerName} ($${total.toFixed(2)})`,
            htmlContent: `
              <h2>NEW PRE-ORDER TICKET: ${orderNumber}</h2>
              <p><strong>Customer:</strong> ${customerName} (${phone})</p>
              <p><strong>Email:</strong> ${email || 'N/A'}</p>
              <p><strong>Fulfillment:</strong> ${fulfillmentType.toUpperCase()} on ${targetDate} (${timeSlot})</p>
              <p><strong>Total:</strong> $${total.toFixed(2)}</p>
            `,
          }),
        });
      } catch (err) {
        console.warn('Brevo order alert failed:', err);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        orderNumber,
        ticket,
        zelle: zelleInstructions,
        stripeUrl: stripePaymentUrl,
        message: `Order ticket ${orderNumber} generated successfully. Complete payment via Zelle or Stripe to lock in your smoke schedule.`,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message || 'Internal order error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
