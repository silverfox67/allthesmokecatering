// Cloudflare Pages Function: /api/admin/messages
// Dispatches outbound email replies via Brevo REST API and syncs email logs to Supabase `allthesmoke.email_logs`
import { supabaseRequest } from "../_supabase.js";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function mapRowToMessage(row) {
  return {
    id: String(row.id),
    leadId: row.lead_id || "",
    sender: row.sender_email || "info@allthesmokecatering.com",
    recipient: row.recipient_email || "",
    clientName: row.client_name || "",
    subject: row.subject || "",
    body: row.body || "",
    sentBy: row.sent_by || "Admin",
    status: "sent",
    createdAt: row.created_at || new Date().toISOString(),
    error: null,
  };
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: cors });
}

export async function onRequestGet(context) {
  const { env = {} } = context;
  const res = await supabaseRequest(env, "email_logs", {
    method: "GET",
    query: "select=*&order=created_at.desc",
  });

  if (!res.ok) {
    return new Response(
      JSON.stringify({
        success: false,
        messages: [],
        error: res.error,
        code: res.code,
      }),
      { status: res.status || 500, headers: { "Content-Type": "application/json", ...cors } }
    );
  }

  const messages = Array.isArray(res.data) ? res.data.map(mapRowToMessage) : [];
  return new Response(
    JSON.stringify({ success: true, messages }),
    { status: 200, headers: { "Content-Type": "application/json", ...cors } }
  );
}

export async function onRequestPost(context) {
  const { request, env = {} } = context;

  try {
    const data = await request.json();
    const {
      leadId,
      recipientEmail,
      subject,
      messageContent,
      clientName,
      sentBy = "Admin",
      senderEmail = "info@allthesmokecatering.com",
    } = data;

    if (!recipientEmail || !messageContent) {
      return new Response(
        JSON.stringify({ success: false, error: "Recipient email and message content are required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...cors } }
      );
    }

    const cleanSenderEmail = senderEmail.includes("@allthesmokecatering.com")
      ? senderEmail
      : env.BREVO_SENDER_EMAIL || "info@allthesmokecatering.com";

    const senderName = cleanSenderEmail.startsWith("marion")
      ? "Pitmaster Marion Bolden | All The Smoke"
      : cleanSenderEmail.startsWith("support")
      ? "Pitmaster Support | All The Smoke"
      : "All The Smoke BBQ & Catering";

    const emailSubject = subject || "Regarding Your Catering Inquiry | All The Smoke BBQ";
    const apiKey = env.BREVO_API_KEY || env.BREVO_KEY || env.BREVO_TOKEN || env.SENDINBLUE_API_KEY;

    let emailSent = false;
    let dispatchError = null;

    if (apiKey) {
      try {
        const brevoRes = await fetch("https://api.brevo.com/v3/smtp/email", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "api-key": apiKey,
          },
          body: JSON.stringify({
            sender: { name: senderName, email: cleanSenderEmail },
            to: [{ email: recipientEmail, name: clientName || recipientEmail }],
            replyTo: { email: cleanSenderEmail, name: senderName },
            bcc: [
              { email: "boldenmarion83@gmail.com", name: "Marion Bolden" },
              { email: "todddavis923@gmail.com", name: "Todd Davis" },
            ],
            subject: emailSubject,
            htmlContent: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #222; border: 1px solid #332B25; border-radius: 12px; overflow: hidden; background: #0A0A0A;">
                <div style="background: radial-gradient(ellipse at center, #C84A0A 0%, #7E2605 60%, #2A0D02 100%); padding: 26px 30px; text-align: center; border-bottom: 2px solid #FF7A00;">
                  <h1 style="color: #FFFFFF; margin: 0; font-size: 22px; font-weight: bold; letter-spacing: 1px; text-transform: uppercase;">All The Smoke BBQ &amp; Catering</h1>
                  <p style="color: #FFD2A8; margin: 6px 0 0 0; font-size: 13px; font-weight: bold; text-transform: uppercase;">★ Live-Fire Texas Smokehouse Dispatch ★</p>
                </div>
                <div style="padding: 30px 24px; background: #FAF8F5;">
                  <div style="font-size: 15px; line-height: 1.6; color: #292524; margin: 0 0 16px 0;">
                    ${messageContent.replace(/\n/g, "<br>")}
                  </div>
                  <div style="margin-top: 28px; padding-top: 20px; border-top: 1px solid #E2DACF; color: #57534E; font-size: 13px;">
                    <p style="margin: 0; font-weight: bold; color: #1C1917; font-size: 14px;">Marion Bolden &amp; The All The Smoke Pitmaster Team</p>
                    <p style="margin: 4px 0 0 0;">📞 Direct Line: (773) 707-9988</p>
                    <p style="margin: 2px 0 0 0;">✉️ ${cleanSenderEmail}</p>
                    <p style="margin: 2px 0 0 0;">🌐 <a href="https://allthesmokecatering.com" style="color: #EA580C; text-decoration: none; font-weight: bold;">allthesmokecatering.com</a></p>
                  </div>
                </div>
                <div style="background: #141210; padding: 14px; text-align: center; font-size: 11px; color: #A8A29E; border-top: 1px solid #292524;">
                  Commercial Smokehouse Commissary • Chicago’s Northwest Side • Greater Chicagoland Catering
                </div>
              </div>
            `,
          }),
        });

        if (brevoRes.ok) {
          emailSent = true;
        } else {
          const errData = await brevoRes.json();
          dispatchError = errData.message || "Brevo dispatch failed";
        }
      } catch (e) {
        dispatchError = e.message;
      }
    } else {
      // Mock sent in dev environment
      emailSent = true;
    }

    const dbRes = await supabaseRequest(env, "email_logs", {
      method: "POST",
      body: {
        id: crypto.randomUUID(),
        lead_id: leadId ? String(leadId) : null,
        recipient_email: recipientEmail,
        client_name: clientName || recipientEmail,
        sender_email: cleanSenderEmail,
        subject: emailSubject,
        body: messageContent,
        sent_by: sentBy,
      },
    });

    const savedRow =
      dbRes.ok && Array.isArray(dbRes.data) && dbRes.data[0]
        ? mapRowToMessage(dbRes.data[0])
        : null;

    const messageRecord = savedRow || {
      id: "msg-" + Date.now(),
      leadId: String(leadId || ""),
      sender: cleanSenderEmail,
      recipient: recipientEmail,
      clientName: clientName || recipientEmail,
      subject: emailSubject,
      body: messageContent,
      sentBy,
      status: emailSent ? "sent" : "queued",
      createdAt: new Date().toISOString(),
      error: dispatchError,
    };

    return new Response(
      JSON.stringify({
        success: true,
        emailSent,
        dbSaved: dbRes.ok,
        dbError: dbRes.ok ? null : dbRes.error,
        message: messageRecord,
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...cors } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: err.message || "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json", ...cors } }
    );
  }
}
