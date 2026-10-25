import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const title = (data.title || "Untitled Smokehouse Note").trim();
    const category = data.category || "general";
    const categoryLabel = data.categoryLabel || "General Note";
    const priority = (data.priority || "normal").toUpperCase();
    const whatAndWhy = data.whatAndWhy || "";
    const attachmentCount = Number(data.attachmentCount) || 0;
    const createdAt = data.createdAt || new Date().toISOString();

    const brevoApiKey =
      process.env.BREVO_API_KEY ||
      process.env.BREVO_KEY ||
      process.env.BREVO_TOKEN ||
      process.env.SENDINBLUE_API_KEY;

    if (brevoApiKey) {
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

              <h2 style="color: #FFFFFF; font-size: 18px; margin: 0 0 12px 0;">${title}</h2>
              <p style="color: #A1A1AA; font-size: 12px; margin: 0 0 16px 0;">Logged on ${formattedDate} (CT)</p>

              <div style="background: #1C1C21; border-left: 4px solid #EA580C; padding: 16px; border-radius: 4px; margin-bottom: 20px;">
                <p style="color: #FF8C38; font-size: 11px; font-weight: bold; text-transform: uppercase; margin: 0 0 6px 0;">
                  What Was Sent &amp; Why:
                </p>
                <p style="color: #E4E4E7; font-size: 14px; line-height: 1.6; margin: 0; white-space: pre-wrap;">${whatAndWhy}</p>
              </div>

              ${
                attachmentCount > 0
                  ? `<div style="background: #27272A; padding: 12px 16px; border-radius: 6px; font-size: 13px; color: #F4EFEA; margin-bottom: 20px;">
                      📸 <strong>${attachmentCount} photo(s) / document(s)</strong> attached to this note. View full resolution in your Pitmaster Portal.
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

      await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "api-key": brevoApiKey,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          sender: {
            name: "ATS Pitmaster Notes",
            email: process.env.BREVO_SENDER_EMAIL || "info@allthesmokecatering.com",
          },
          to: [{ email: "boldenmarion83@gmail.com", name: "Marion Bolden" }],
          cc: [{ email: "bbqcateringking83@gmail.com", name: "ATS Operations" }],
          subject: `🔥 [ATS Note - ${priority}] ${title}`,
          htmlContent: noteHtml,
        }),
      });
    }

    return NextResponse.json({ success: true, message: "Note processed" });
  } catch (err: any) {
    console.error("Error in Next /api/admin/notes:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
