// Cloudflare Pages Function: /api/lead
export async function onRequestPost(context) {
  try {
    const req = context.request;
    const env = context.env || {};

    let rawData = {};
    const contentType = req.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      rawData = await req.json();
    } else {
      const formData = await req.formData();
      const obj = {};
      formData.forEach((val, key) => {
        if (key === 'selectedProteins' || key === 'selectedSides') {
          if (!obj[key]) obj[key] = [];
          obj[key].push(val.toString());
        } else {
          obj[key] = val.toString();
        }
      });
      rawData = obj;
    }

    // 1. Anti-spam honeypot & speed gate
    if (rawData.honey) {
      return new Response(JSON.stringify({ success: true, message: 'Inquiry received' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    if (rawData.formLoadedAt && Date.now() - Number(rawData.formLoadedAt) < 2000) {
      return new Response(JSON.stringify({ success: true, message: 'Inquiry received' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 2. Validate essential fields
    const name = (rawData.name || '').trim();
    const email = (rawData.email || '').trim();
    const phone = (rawData.phone || '').trim();

    if (!name || name.length < 2) {
      return new Response(JSON.stringify({ error: 'Name must be at least 2 characters' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    if (!email || !email.includes('@')) {
      return new Response(JSON.stringify({ error: 'Please provide a valid email address' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    if (!phone || phone.length < 7) {
      return new Response(JSON.stringify({ error: 'Please provide a valid phone number' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const eventDate = rawData.eventDate || 'Date Pending';
    const guestCount = Number(rawData.guestCount) || 25;
    const packageName = rawData.packageName || 'The Pitmaster Feast';
    const packageId = rawData.packageId || 'pitmaster-feast';
    const serviceStyle = rawData.serviceStyle || 'Heated Drop-Off Delivery';
    const deliveryAddress = rawData.deliveryAddress || 'Venue TBD';
    const notes = rawData.notes || '';
    const selectedProteins = Array.isArray(rawData.selectedProteins) ? rawData.selectedProteins : [];
    const selectedSides = Array.isArray(rawData.selectedSides) ? rawData.selectedSides : [];

    const ticketId = 'ATS-QUOTE-' + Math.floor(1000 + Math.random() * 9000);

    // 3. Dispatch Emails via Brevo REST API if configured
    const brevoApiKey = env.BREVO_API_KEY;
    if (brevoApiKey) {
      try {
        const adminHtml = `
          <div style="font-family: monospace; background: #0A0A0A; color: #FAFAFA; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background: #121212; border: 2px dashed #F59E0B; padding: 24px; border-radius: 8px;">
              <h1 style="color: #F59E0B; margin: 0;">ALL THE SMOKE BBQ &amp; CATERING</h1>
              <p style="color: #888;">COMMISSARY KITCHEN DISPATCH SLIP • TICKET #${ticketId}</p>
              <hr style="border-color: #333;" />
              <p><strong>Client:</strong> ${name} | <a href="tel:${phone}" style="color:#F59E0B;">${phone}</a> | ${email}</p>
              <p><strong>Date:</strong> ${eventDate} | <strong>Guests:</strong> ${guestCount}</p>
              <p><strong>Package:</strong> ${packageName} (${packageId})</p>
              <p><strong>Service:</strong> ${serviceStyle}</p>
              <p><strong>Venue/Address:</strong> ${deliveryAddress}</p>
              ${selectedProteins.length ? `<p><strong>Meats:</strong> ${selectedProteins.join(', ')}</p>` : ''}
              ${selectedSides.length ? `<p><strong>Sides:</strong> ${selectedSides.join(', ')}</p>` : ''}
              ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ''}
            </div>
          </div>
        `;

        const clientHtml = `
          <div style="font-family: sans-serif; background: #0A0A0A; color: #FAFAFA; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background: #121212; border: 1px solid rgba(255,255,255,0.15); padding: 32px; border-radius: 16px;">
              <h1 style="color: #F59E0B;">All The Smoke BBQ &amp; Catering</h1>
              <h2>We Received Your Inquiry, ${name}!</h2>
              <p>Ticket: <strong>#${ticketId}</strong> for <strong>${eventDate}</strong> (${guestCount} Guests).</p>
              <p>Marion Bolden and the crew are reviewing pitmaster capacity and will follow up with your customized proposal within 12 business hours.</p>
              <p>Direct line: <strong>(773) 707-9988</strong> | Hub: 3401 N Orange Ave, Chicago 60634</p>
            </div>
          </div>
        `;

        await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'api-key': brevoApiKey,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            sender: { name: 'ATS Smokehouse Dispatch', email: env.BREVO_SENDER_EMAIL || 'dispatch@allthesmokecatering.com' },
            to: [{ email: 'boldenmarion83@gmail.com', name: 'Marion Bolden' }],
            cc: [{ email: 'bbqcateringking83@gmail.com', name: 'ATS Kitchen' }],
            subject: `🔥 NEW CATERING QUOTE #${ticketId}: ${name} (${guestCount} Guests) - ${eventDate}`,
            htmlContent: adminHtml,
          }),
        });

        await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'api-key': brevoApiKey,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            sender: { name: 'Marion Bolden | All The Smoke', email: env.BREVO_SENDER_EMAIL || 'marion@allthesmokecatering.com' },
            to: [{ email: email, name: name }],
            subject: `Smokehouse Inquiry Received #${ticketId} | All The Smoke BBQ & Catering`,
            htmlContent: clientHtml,
          }),
        });
      } catch (e) {
        console.warn('Brevo dispatch error:', e);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        ticketId,
        message: 'Catering quote submitted successfully. Marion Bolden will contact you within 12 business hours.',
        orderSummary: {
          client: name,
          email,
          phone,
          eventDate,
          guestCount,
          package: packageName,
          serviceStyle,
        },
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message || 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
