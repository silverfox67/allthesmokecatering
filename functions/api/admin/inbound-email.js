// Cloudflare Pages Function: /api/admin/inbound-email
// Receives inbound customer email replies (e.g., via Zoho Mail Outgoing Webhook),
// stores them in Supabase `allthesmoke.inbound_emails`, and notifies Marion via Brevo.
import { supabaseRequest } from "../_supabase.js";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, X-Webhook-Secret",
};

function stripHtml(html) {
  if (!html) return "";
  return String(html)
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function parseEmailAddress(raw) {
  if (!raw) return { email: "", name: "" };
  const str = String(raw).trim();
  const match = str.match(/^(?:"?([^"<]+)"?\s*)?<([^>]+@[^>]+)>$/);
  if (match) {
    return { name: (match[1] || "").trim(), email: match[2].trim().toLowerCase() };
  }
  return { name: "", email: str.toLowerCase() };
}

function mapRowToInbound(row) {
  return {
    id: String(row.id),
    senderEmail: row.sender_email || "",
    senderName: row.sender_name || row.sender_email || "",
    recipientEmail: row.recipient_email || "info@allthesmokecatering.com",
    subject: row.subject || "(No Subject)",
    body: row.body_text || "",
    isRead: Boolean(row.is_read),
    createdAt: row.created_at || new Date().toISOString(),
  };
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: cors });
}

export async function onRequestGet(context) {
  const { env = {} } = context;
  const res = await supabaseRequest(env, "inbound_emails", {
    method: "GET",
    query: "select=*&order=created_at.desc",
  });

  if (!res.ok) {
    return new Response(
      JSON.stringify({
        success: false,
        inboundEmails: [],
        error: res.error,
        code: res.code,
      }),
      { status: res.status || 500, headers: { "Content-Type": "application/json", ...cors } }
    );
  }

  const inboundEmails = Array.isArray(res.data) ? res.data.map(mapRowToInbound) : [];
  return new Response(
    JSON.stringify({ success: true, inboundEmails }),
    { status: 200, headers: { "Content-Type": "application/json", ...cors } }
  );
}

export async function onRequestPost(context) {
  const { request, env = {} } = context;

  try {
    if (env.INBOUND_EMAIL_SECRET) {
      const provided =
        request.headers.get("x-webhook-secret") ||
        new URL(request.request?.url || request.url).searchParams.get("secret") ||
        "";
      if (provided !== env.INBOUND_EMAIL_SECRET) {
        return new Response(
          JSON.stringify({ success: false, error: "Unauthorized webhook secret" }),
          { status: 401, headers: { "Content-Type": "application/json", ...cors } }
        );
      }
    }

    const payload = await request.json();

    // Support Zoho Mail Outgoing Webhook fields + generic JSON webhook fields
    const rawFrom =
      payload.fromAddress || payload.from || payload.sender || payload.senderEmail || "";
    const parsedFrom = parseEmailAddress(rawFrom);
    const senderEmail = parsedFrom.email;
    const senderName =
      (payload.fromName || payload.senderName || parsedFrom.name || senderEmail).trim();

    const recipientEmail = parseEmailAddress(
      payload.toAddress || payload.to || payload.recipient || "info@allthesmokecatering.com"
    ).email || "info@allthesmokecatering.com";

    const subject = (payload.subject || "(No Subject)").trim();
    const rawText =
      payload.text ||
      payload.body_text ||
      payload.body ||
      payload.summary ||
      stripHtml(payload.content || payload.html || "");
    const bodyText = String(rawText || "").trim();

    if (!senderEmail) {
      return new Response(
        JSON.stringify({ success: false, error: "Sender email is required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...cors } }
      );
    }

    const dbRes = await supabaseRequest(env, "inbound_emails", {
      method: "POST",
      body: {
        id: crypto.randomUUID(),
        sender_email: senderEmail,
        sender_name: senderName,
        recipient_email: recipientEmail,
        subject,
        body_text: bodyText,
        is_read: false,
      },
    });

    const saved =
      dbRes.ok && Array.isArray(dbRes.data) && dbRes.data[0]
        ? mapRowToInbound(dbRes.data[0])
        : null;

    // Notify Marion via Brevo if incoming email is from an external sender
    const brevoKey =
      env.BREVO_API_KEY || env.BREVO_KEY || env.BREVO_TOKEN || env.SENDINBLUE_API_KEY;
    const isInternal =
      senderEmail.endsWith("@allthesmokecatering.com") ||
      senderEmail === "boldenmarion83@gmail.com";

    if (brevoKey && !isInternal) {
      try {
        await fetch("https://api.brevo.com/v3/smtp/email", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "api-key": brevoKey,
          },
          body: JSON.stringify({
            sender: {
              name: "ATS Smokehouse Inbox",
              email: env.BREVO_SENDER_EMAIL || "info@allthesmokecatering.com",
            },
            to: [{ email: "boldenmarion83@gmail.com", name: "Marion Bolden" }],
            replyTo: { email: senderEmail, name: senderName },
            subject: `📩 Customer Reply from ${senderName}: ${subject}`,
            htmlContent: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0A0A0A; color: #FAFAFA; padding: 24px; border-radius: 12px; border: 2px solid #EA580C;">
                <h2 style="color: #FF8C38; margin: 0 0 8px 0;">New Customer Email Reply</h2>
                <p style="color: #D4D4D8; font-size: 13px; margin: 0 0 16px 0;">
                  <strong>From:</strong> ${senderName} (${senderEmail})<br/>
                  <strong>Subject:</strong> ${subject}
                </p>
                <div style="background: #1C1C21; border-left: 4px solid #EA580C; padding: 16px; border-radius: 6px; color: #E4E4E7; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${bodyText}</div>
                <div style="text-align: center; margin-top: 20px;">
                  <a href="https://allthesmokecatering.com/admin" style="background: #EA580C; color: #FFFFFF; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px; display: inline-block;">
                    Open Pitmaster Inbox →
                  </a>
                </div>
              </div>
            `,
          }),
        });
      } catch (notifyErr) {
        console.warn("Inbound email Brevo notify warning:", notifyErr);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        dbSaved: dbRes.ok,
        dbError: dbRes.ok ? null : dbRes.error,
        inboundEmail: saved,
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

export async function onRequestPatch(context) {
  try {
    const env = context.env || {};
    const data = await context.request.json();
    const id = data.id ? String(data.id).trim() : "";

    if (!id) {
      return new Response(
        JSON.stringify({ success: false, error: "Inbound email id is required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...cors } }
      );
    }

    const dbRes = await supabaseRequest(env, "inbound_emails", {
      method: "PATCH",
      query: `id=eq.${encodeURIComponent(id)}`,
      body: { is_read: Boolean(data.isRead) },
    });

    if (!dbRes.ok) {
      return new Response(
        JSON.stringify({ success: false, error: dbRes.error, code: dbRes.code }),
        { status: dbRes.status || 500, headers: { "Content-Type": "application/json", ...cors } }
      );
    }

    const updated =
      Array.isArray(dbRes.data) && dbRes.data[0] ? mapRowToInbound(dbRes.data[0]) : null;
    return new Response(
      JSON.stringify({ success: true, inboundEmail: updated }),
      { status: 200, headers: { "Content-Type": "application/json", ...cors } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...cors } }
    );
  }
}

export async function onRequestDelete(context) {
  try {
    const env = context.env || {};
    const id = (new URL(context.request.url).searchParams.get("id") || "").trim();
    if (!id) {
      return new Response(
        JSON.stringify({ success: false, error: "Inbound email id is required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...cors } }
      );
    }

    const dbRes = await supabaseRequest(env, "inbound_emails", {
      method: "DELETE",
      query: `id=eq.${encodeURIComponent(id)}`,
    });

    if (!dbRes.ok) {
      return new Response(
        JSON.stringify({ success: false, error: dbRes.error, code: dbRes.code }),
        { status: dbRes.status || 500, headers: { "Content-Type": "application/json", ...cors } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, id }),
      { status: 200, headers: { "Content-Type": "application/json", ...cors } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...cors } }
    );
  }
}

