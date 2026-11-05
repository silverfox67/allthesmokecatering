import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const {
      clientName,
      clientEmail,
      clientPhone,
      eventType = "Catering Event",
      eventDate,
      rating = 5,
      reviewText,
      favoriteHighlights = [],
      permissionToFeature = true,
      source = "web-direct",
    } = data;

    if (!clientName || !reviewText) {
      return NextResponse.json(
        { success: false, error: "Client name and review comments are required" },
        { status: 400 }
      );
    }

    const isCritical = Number(rating) <= 3;
    const apiKey =
      process.env.BREVO_API_KEY ||
      process.env.BREVO_KEY ||
      process.env.SENDINBLUE_API_KEY;

    let emailAlertSent = false;

    // Send email alert to Marion & Todd if Brevo is configured
    if (apiKey) {
      try {
        const subject = isCritical
          ? `⚠️ URGENT: Private Catering Feedback (${rating}★) from ${clientName}`
          : `⭐ New ${rating}-Star Catering Review from ${clientName} (${eventType})`;

        const htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #222; border: 1px solid #332B25; border-radius: 12px; overflow: hidden; background: #0A0A0A;">
            <div style="background: ${
              isCritical
                ? "linear-gradient(135deg, #7F1D1D 0%, #450A0A 100%)"
                : "radial-gradient(ellipse at center, #C84A0A 0%, #7E2605 60%, #2A0D02 100%)"
            }; padding: 24px; text-align: center; border-bottom: 2px solid #FF7A00;">
              <h1 style="color: #FFFFFF; margin: 0; font-size: 20px; font-weight: bold; text-transform: uppercase;">
                ${isCritical ? "⚠️ Private Feedback Alert" : "★ New Customer Review ★"}
              </h1>
              <p style="color: #FFD2A8; margin: 6px 0 0 0; font-size: 13px; font-weight: bold;">
                All The Smoke BBQ &amp; Catering Client Intake
              </p>
            </div>
            
            <div style="padding: 24px; background: #FAF8F5;">
              <div style="font-size: 18px; font-weight: bold; color: ${
                isCritical ? "#DC2626" : "#EA580C"
              }; margin-bottom: 12px;">
                Rating: ${"★".repeat(Number(rating))}${"☆".repeat(5 - Number(rating))} (${rating} / 5 Stars)
              </div>
              
              <div style="background: #FFFFFF; border: 1px solid #E2DACF; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
                <p style="margin: 0; font-size: 14px; font-style: italic; color: #292524; line-height: 1.6;">
                  &ldquo;${reviewText.replace(/\n/g, "<br>")}&rdquo;
                </p>
              </div>

              ${
                favoriteHighlights && favoriteHighlights.length > 0
                  ? `<div style="margin-bottom: 16px;">
                      <strong>Highlights Selected:</strong>
                      <ul style="margin: 6px 0 0 0; padding-left: 20px; color: #44403C; font-size: 13px;">
                        ${favoriteHighlights.map((h: string) => `<li>${h}</li>`).join("")}
                      </ul>
                    </div>`
                  : ""
              }

              <div style="background: #F5EFEB; border-radius: 8px; padding: 12px 16px; font-size: 13px; color: #44403C; line-height: 1.6;">
                <div><strong>Client:</strong> ${clientName}</div>
                <div><strong>Phone:</strong> ${clientPhone || "Not provided"}</div>
                <div><strong>Email:</strong> ${clientEmail || "Not provided"}</div>
                <div><strong>Event:</strong> ${eventType}${eventDate ? ` on ${eventDate}` : ""}</div>
                <div><strong>Permission to Feature:</strong> ${permissionToFeature ? "Yes ✓" : "No"}</div>
                <div><strong>Source:</strong> ${source}</div>
              </div>

              ${
                isCritical
                  ? `<div style="margin-top: 18px; padding: 12px; background: #FEF2F2; border: 1px solid #FCA5A5; border-radius: 8px; color: #991B1B; font-size: 12px; font-weight: bold;">
                      🚨 ACTION REQUIRED: Client had constructive feedback. Please reach out to ${clientName} at ${
                      clientPhone || clientEmail || "their contact"
                    } to resolve their experience.
                    </div>`
                  : ""
              }
            </div>

            <div style="background: #141210; padding: 12px; text-align: center; font-size: 11px; color: #A8A29E; border-top: 1px solid #292524;">
              All The Smoke Smokehouse Management System • Chicago, IL
            </div>
          </div>
        `;

        await fetch("https://api.brevo.com/v3/smtp/email", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "api-key": apiKey,
          },
          body: JSON.stringify({
            sender: {
              name: "All The Smoke Review Engine",
              email: "info@allthesmokecatering.com",
            },
            to: [
              { email: "boldenmarion83@gmail.com", name: "Marion Bolden" },
              { email: "todddavis923@gmail.com", name: "Todd Davis" },
            ],
            subject,
            htmlContent,
          }),
        });
        emailAlertSent = true;
      } catch (mailErr) {
        console.warn("Could not dispatch review email alert:", mailErr);
      }
    }

    const reviewRecord = {
      id: "rev-" + Date.now(),
      clientName,
      clientEmail,
      clientPhone,
      eventType,
      eventDate,
      rating: Number(rating),
      reviewText,
      favoriteHighlights,
      permissionToFeature: Boolean(permissionToFeature),
      isFeatured: Number(rating) >= 5,
      submittedAt: new Date().toISOString(),
      source,
      status: isCritical ? "private-feedback" : "published",
    };

    return NextResponse.json({
      success: true,
      emailAlertSent,
      review: reviewRecord,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to process review" },
      { status: 500 }
    );
  }
}

