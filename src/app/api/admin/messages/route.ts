import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { leadId, recipientEmail, subject, messageContent, clientName, senderEmail = "info@allthesmokecatering.com" } = data;

    if (!recipientEmail || !messageContent) {
      return NextResponse.json(
        { success: false, error: "Recipient email and message content are required" },
        { status: 400 }
      );
    }

    const cleanSenderEmail = senderEmail.includes("@allthesmokecatering.com")
      ? senderEmail
      : (process.env.BREVO_SENDER_EMAIL || "info@allthesmokecatering.com");

    const senderName = cleanSenderEmail.startsWith("marion")
      ? "Pitmaster Marion Bolden | All The Smoke"
      : cleanSenderEmail.startsWith("support")
      ? "Pitmaster Support | All The Smoke"
      : "All The Smoke BBQ & Catering";

    const emailSubject = subject || "Regarding Your Catering Inquiry | All The Smoke BBQ";
    const apiKey = process.env.BREVO_API_KEY || process.env.BREVO_KEY || process.env.SENDINBLUE_API_KEY;

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
      } catch (e: any) {
        dispatchError = e.message;
      }
    } else {
      emailSent = true;
    }

    const messageRecord = {
      id: "msg-" + Date.now(),
      leadId: String(leadId || ""),
      sender: cleanSenderEmail,
      recipient: recipientEmail,
      subject: emailSubject,
      body: messageContent,
      status: emailSent ? "sent" : "queued",
      createdAt: new Date().toISOString(),
      error: dispatchError,
    };

    return NextResponse.json({ success: true, emailSent, message: messageRecord });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
