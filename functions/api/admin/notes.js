// Cloudflare Pages Function: /api/admin/notes
// Supports GET, POST, PATCH, DELETE synced to Supabase schema `allthesmoke.notes` + Brevo dispatch
import { supabaseRequest } from "../_supabase.js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function mapRowToNote(row) {
  return {
    id: String(row.id),
    title: row.title || "Untitled Smokehouse Note",
    category: row.category || "general",
    priority: (row.priority || "normal").toLowerCase(),
    author: row.author || "Todd",
    whatAndWhy: row.what_and_why || "",
    attachments: Array.isArray(row.attachments) ? row.attachments : [],
    isCompleted: Boolean(row.is_completed),
    emailNotified: Boolean(row.email_notified),
    createdAt: row.created_at || new Date().toISOString(),
  };
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

export async function onRequestGet(context) {
  const env = context.env || {};
  const res = await supabaseRequest(env, "notes", {
    method: "GET",
    query: "select=*&order=created_at.desc",
  });

  if (!res.ok) {
    return new Response(
      JSON.stringify({
        success: false,
        notes: [],
        error: res.error,
        code: res.code,
      }),
      { status: res.status || 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }

  const notes = Array.isArray(res.data) ? res.data.map(mapRowToNote) : [];
  return new Response(
    JSON.stringify({ success: true, notes }),
    { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
  );
}

export async function onRequestPost(context) {
  try {
    const req = context.request;
    const env = context.env || {};

    const data = await req.json();
    const title = (data.title || "Untitled Smokehouse Note").trim();
    const author = (data.author || "Todd").trim();
    const category = data.category || "general";
    const categoryLabel = data.categoryLabel || "General Note";
    const priorityLower = (data.priority || "normal").toLowerCase();
    const priority = priorityLower.toUpperCase();
    const whatAndWhy = data.whatAndWhy || "";
    const attachments = Array.isArray(data.attachments) ? data.attachments : [];
    const attachmentCount = Number(data.attachmentCount) || attachments.length || 0;
    const createdAt = data.createdAt || new Date().toISOString();
    const sendEmail = data.sendEmail !== false;

    const recipient =
      author.toLowerCase().includes("todd")
        ? { email: "boldenmarion83@gmail.com", name: "Marion Bolden" }
        : { email: "todddavis923@gmail.com", name: "Todd Davis" };

    const brevoApiKey =
      env.BREVO_API_KEY || env.BREVO_KEY || env.BREVO_TOKEN || env.SENDINBLUE_API_KEY;

    let emailNotified = false;

    if (sendEmail && brevoApiKey) {
      const formattedDate = new Date(createdAt).toLocaleString("en-US", {
        timeZone: "America/Chicago",
        dateStyle: "full",
        timeStyle: "short",
      });

      const noteHtml = `
        <div style="font-family: Arial, sans-serif; background: #0A0A0A; color: #FAFAFA; padding: 24px;">
          <div style="max-width: 600px; margin: 0 auto; background: #141417; border: 2px solid #EA580C; border-radius: 12px; overflow: hidden;">
            <div style="background: linear-gradient(135deg, #C84A0A, #7E2605); padding: 20px; text-align: center;">
              <h1 style="color: #FFFFFF; margin: 0; font-size: 20px; letter-spacing: 1px;">ALL THE SMOKE BBQ &amp; CATERING</h1>
              <p style="color: #FFD2A8; margin: 6px 0 0 0; font-size: 13px; font-weight: bold; text-transform: uppercase;">
                ★ Pitmaster Note &amp; Media Dispatch ★
              </p>
            </div>

            <div style="padding: 24px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 16px;">
                <span style="background: #27272A; color: #F4EFEA; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: bold;">
                  ${categoryLabel}
                </span>
                <span style="background: ${priority === 'URGENT' ? '#7F1D1D' : '#3F2C0B'}; color: ${priority === 'URGENT' ? '#FCA5A5' : '#FCD34D'}; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: bold;">
                  PRIORITY: ${priority}
                </span>
              </div>

              <h2 style="color: #FFFFFF; font-size: 18px; margin: 0 0 8px 0;">${title}</h2>
              <p style="color: #D4D4D8; font-size: 13px; margin: 0 0 16px 0;">
                Posted by <strong style="color: #FF8C38;">${author}</strong> on ${formattedDate} (CT)
              </p>

              <div style="background: #1C1C21; border-left: 4px solid #EA580C; padding: 16px; border-radius: 4px; margin-bottom: 20px;">
                <p style="color: #FF8C38; font-size: 11px; font-weight: bold; text-transform: uppercase; margin: 0 0 6px 0;">
                  What Was Sent &amp; Why:
                </p>
                <p style="color: #E4E4E7; font-size: 14px; line-height: 1.6; margin: 0; white-space: pre-wrap;">${whatAndWhy}</p>
              </div>

              ${
                attachmentCount > 0
                  ? `<div style="background: #27272A; padding: 12px 16px; border-radius: 6px; font-size: 13px; color: #F4EFEA; margin-bottom: 20px;">
                      <strong>${attachmentCount} photo(s) / document(s)</strong> attached to this note. View full resolution in your Pitmaster Portal.
                    </div>`
                  : ""
              }

              <div style="text-align: center; margin-top: 24px; padding-top: 20px; border-top: 1px solid #27272A;">
                <a href="https://allthesmokecatering.com/admin" style="background: #EA580C; color: #FFFFFF; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px; display: inline-block;">
                  Open Pitmaster Portal →
                </a>
              </div>
            </div>
          </div>
        </div>
      `;

      const brevoRes = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "api-key": brevoApiKey,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          sender: {
            name: `ATS Note (${author})`,
            email: env.BREVO_SENDER_EMAIL || "info@allthesmokecatering.com",
          },
          to: [recipient],
          cc: [{ email: "bbqcateringking83@gmail.com", name: "ATS Operations" }],
          subject: `[ATS Note from ${author} - ${priority}] ${title}`,
          htmlContent: noteHtml,
        }),
      });
      emailNotified = brevoRes.ok;
    }

    const dbRes = await supabaseRequest(env, "notes", {
      method: "POST",
      body: {
        title,
        category,
        priority: priorityLower,
        author,
        what_and_why: whatAndWhy,
        attachments,
        is_completed: Boolean(data.isCompleted),
        email_notified: emailNotified || Boolean(data.emailNotified),
      },
    });

    const savedNote =
      dbRes.ok && Array.isArray(dbRes.data) && dbRes.data[0]
        ? mapRowToNote(dbRes.data[0])
        : null;

    return new Response(
      JSON.stringify({
        success: true,
        message: "Note processed",
        dbSaved: dbRes.ok,
        dbError: dbRes.ok ? null : dbRes.error,
        note: savedNote,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (err) {
    console.error("Error in /api/admin/notes:", err);
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
}

export async function onRequestPatch(context) {
  try {
    const env = context.env || {};
    const data = await context.request.json();
    const id = data.id ? String(data.id).trim() : "";

    if (!id) {
      return new Response(
        JSON.stringify({ success: false, error: "Note id is required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const updates = {};
    if (typeof data.isCompleted === "boolean") {
      updates.is_completed = data.isCompleted;
    }
    if (typeof data.title === "string") {
      updates.title = data.title.trim();
    }
    if (typeof data.whatAndWhy === "string") {
      updates.what_and_why = data.whatAndWhy;
    }

    const dbRes = await supabaseRequest(env, "notes", {
      method: "PATCH",
      query: `id=eq.${encodeURIComponent(id)}`,
      body: updates,
    });

    if (!dbRes.ok) {
      return new Response(
        JSON.stringify({ success: false, error: dbRes.error, code: dbRes.code }),
        { status: dbRes.status || 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const updatedNote =
      Array.isArray(dbRes.data) && dbRes.data[0] ? mapRowToNote(dbRes.data[0]) : null;

    return new Response(
      JSON.stringify({ success: true, note: updatedNote }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
}

export async function onRequestDelete(context) {
  try {
    const env = context.env || {};
    const url = new URL(context.request.url);
    const id = (url.searchParams.get("id") || "").trim();

    if (!id) {
      return new Response(
        JSON.stringify({ success: false, error: "Note id query parameter is required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const dbRes = await supabaseRequest(env, "notes", {
      method: "DELETE",
      query: `id=eq.${encodeURIComponent(id)}`,
    });

    if (!dbRes.ok) {
      return new Response(
        JSON.stringify({ success: false, error: dbRes.error, code: dbRes.code }),
        { status: dbRes.status || 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, id }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
}
