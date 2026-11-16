// Cloudflare Pages Function: /api/admin/review-sequence
// Blueprint Q: 24h Guided Review Request (+ 4-day bump) & VIP Thank-You for completed reviewers

const GOOGLE_REVIEW_URL = "https://g.page/r/CfFd-sBgX_THECE/review";

function buildGuidedAskHtml(firstName, eventType) {
  return `
    <div style="font-family: Arial, sans-serif; color: #1C1917; max-width: 580px; line-height: 1.6;">
      <p>Hey ${firstName},</p>
      <p>Thanks again for letting All The Smoke handle the food for ${eventType || "your event"}. Hope everyone went home full!</p>
      <p>Since we're growing our local Google profile in Chicago, honest reviews from folks who actually ate the food make a huge difference for a small crew like ours. If you've got 30 seconds, we'd love a quick review here:</p>
      <p style="margin: 20px 0;">
        <a href="${GOOGLE_REVIEW_URL}" style="background: #C84A0A; color: #FFFFFF; padding: 12px 20px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
          ★ Leave a Quick Google Review
        </a>
      </p>
      <p><strong>Not sure what to write?</strong> Even one quick sentence on any of these helps a ton:</p>
      <ul>
        <li>What dish or meat stood out? (Brisket, ribs, mac &amp; cheese?)</li>
        <li>How did the smoker setup or delivery go?</li>
        <li>Would you recommend us to friends or event planners?</li>
      </ul>
      <p>Appreciate you supporting local BBQ,<br/><strong>Marion Bolden</strong><br/>All The Smoke BBQ &amp; Catering</p>
    </div>
  `;
}

function buildFourDayBumpHtml(firstName) {
  return `
    <div style="font-family: Arial, sans-serif; color: #1C1917; max-width: 580px; line-height: 1.6;">
      <p>Hey ${firstName},</p>
      <p>Quick follow-up from the pit—if you had a minute to share a sentence or two about the food on Google, it helps our Chicago crew more than you know:</p>
      <p style="margin: 18px 0;">
        <a href="${GOOGLE_REVIEW_URL}" style="background: #C84A0A; color: #FFFFFF; padding: 12px 20px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
          ★ Drop a 30-Second Review
        </a>
      </p>
      <p>No pressure at all, and thanks again for rocking with us.<br/><strong>– Marion, All The Smoke BBQ &amp; Catering</strong></p>
    </div>
  `;
}

function buildVipThankYouHtml(firstName) {
  return `
    <div style="font-family: Arial, sans-serif; color: #1C1917; max-width: 580px; line-height: 1.6;">
      <p>Hey ${firstName},</p>
      <p>Just wanted to personally say thank you for taking the time to drop us a review on Google—that kind of support goes a long way for our crew here in Chicago.</p>
      <p>Whenever you've got another event, office lunch, or family cookout coming up, hit us up early so we can lock your date on the smoker calendar.</p>
      <p>Thanks again for rocking with All The Smoke,<br/><strong>Marion Bolden</strong><br/>All The Smoke BBQ &amp; Catering • (773) 707-9988</p>
    </div>
  `;
}

async function sendBrevoEmail(apiKey, payload) {
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

export async function onRequestPost(context) {
  try {
    const env = context.env || {};
    const body = await context.request.json();
    const {
      clientName = "",
      clientEmail = "",
      eventType = "your catering event",
      reviewStatus = "pending",
      mode = "guided-ask",
      sendNow = false,
    } = body || {};

    if (!clientName.trim() || !clientEmail.trim()) {
      return new Response(
        JSON.stringify({ ok: false, error: "Client name and email are required." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Hard Guardrail: never double-ask someone whose review_status is already completed
    if (reviewStatus === "completed" && mode === "guided-ask") {
      return new Response(
        JSON.stringify({
          ok: false,
          error: "This client is already marked completed. Send a VIP Thank-You instead.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const firstName = clientName.trim().split(/\s+/)[0] || "there";
    const sender = {
      name: "Marion Bolden | All The Smoke BBQ & Catering",
      email: "marion@allthesmokecatering.com",
    };
    const to = [{ email: clientEmail.trim(), name: clientName.trim() }];
    const replyTo = { email: "marion@allthesmokecatering.com", name: "Marion Bolden" };

    const brevoKey = env.BREVO_API_KEY || "";
    if (!brevoKey) {
      return new Response(
        JSON.stringify({
          ok: true,
          demoMode: true,
          mode,
          message:
            mode === "vip-thankyou"
              ? `Demo mode: VIP Thank-You queued for ${clientName}.`
              : `Demo mode: 24h Guided Review Request + 4-day bump queued for ${clientName}.`,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    if (mode === "vip-thankyou") {
      const result = await sendBrevoEmail(brevoKey, {
        sender,
        to,
        replyTo,
        subject: `Appreciate the love on Google, ${firstName}`,
        htmlContent: buildVipThankYouHtml(firstName),
      });
      return new Response(JSON.stringify({ ok: result.ok, mode, result }), {
        status: result.ok ? 200 : 502,
        headers: { "Content-Type": "application/json" },
      });
    }

    const now = Date.now();
    const email1Payload = {
      sender,
      to,
      replyTo,
      subject: "Quick question about yesterday's spread",
      htmlContent: buildGuidedAskHtml(firstName, eventType),
      ...(sendNow ? {} : { scheduledAt: new Date(now + 24 * 60 * 60 * 1000).toISOString() }),
    };

    const email2Payload = {
      sender,
      to,
      replyTo,
      subject: `Quick follow-up from All The Smoke BBQ, ${firstName}`,
      htmlContent: buildFourDayBumpHtml(firstName),
      scheduledAt: new Date(now + 4 * 24 * 60 * 60 * 1000).toISOString(),
    };

    const [res1, res2] = await Promise.all([
      sendBrevoEmail(brevoKey, email1Payload),
      sendBrevoEmail(brevoKey, email2Payload),
    ]);

    return new Response(
      JSON.stringify({
        ok: res1.ok && res2.ok,
        mode,
        email1: res1,
        email2: res2,
      }),
      {
        status: res1.ok ? 200 : 502,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ ok: false, error: err?.message || "Server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
