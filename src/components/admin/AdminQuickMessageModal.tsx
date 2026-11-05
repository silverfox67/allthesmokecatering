"use client";

import React, { useState, useEffect } from "react";
import { PitmasterLead, LeadStatus } from "./AdminLeadsPipeline";

export interface AdminQuickMessageModalProps {
  lead: PitmasterLead | null;
  isOpen: boolean;
  onClose: () => void;
  theme?: "day" | "night" | "dark" | "butcher-paper";
  onLeadUpdated?: (updatedLead: PitmasterLead) => void;
}

export interface QuickMessageTemplate {
  id: string;
  name: string;
  stageBadge: string;
  icon: string;
  description: string;
  sms: (lead: PitmasterLead) => string;
  emailSubject: (lead: PitmasterLead) => string;
  emailBody: (lead: PitmasterLead) => string;
  suggestedStatus?: LeadStatus;
}

export const CATERING_TEMPLATES: QuickMessageTemplate[] = [
  {
    id: "quote-followup",
    name: "Quote Follow-Up",
    stageBadge: "1. Follow-Up",
    icon: "💬",
    description: "Touch base on an active catering inquiry before smoker booking dates fill up.",
    suggestedStatus: "quoted",
    sms: (lead) =>
      `Hi ${lead.name || "there"}! Pitmaster Marion from All The Smoke BBQ checking in on your ${
        lead.eventType || "event"
      }${lead.eventDate ? ` for ${lead.eventDate}` : ""}. We have smoker chamber space reserved for your ${
        lead.guestCount || 0
      } guests. Any menu questions, or would you like us to lock your date on the calendar? Text or call me at (773) 707-9988! 🔥`,
    emailSubject: (lead) =>
      `Following up on your ${lead.eventType || "Catering"} Quote | All The Smoke BBQ`,
    emailBody: (lead) =>
      `Hi ${lead.name || "there"},\n\nThank you again for considering All The Smoke BBQ & Catering for your ${
        lead.eventType || "upcoming event"
      }${lead.eventDate ? ` on ${lead.eventDate}` : ""}!\n\nI wanted to quickly check in on your plans for your party of ${
        lead.guestCount || "approximate"
      } guests. Weekend pit trailer bookings fill up quickly on our commissary calendar, and I want to make sure you have priority for your preferred date.\n\nWhether you'd like to adjust meats (14-hour Texas brisket, St. Louis ribs, smoked turkey, or wings) or need a customized package, I'm happy to help.\n\nWhenever you're ready to secure your date, we can generate your agreement and 50% deposit link.\n\nFeel free to reply directly to this email or call/text me at (773) 707-9988.\n\nWarm regards,\nMarion Bolden | Pitmaster & Owner\nAll The Smoke BBQ & Catering\n(773) 707-9988 | allthesmokecatering.com`,
  },
  {
    id: "deposit-confirmed",
    name: "Deposit & Date Locked",
    stageBadge: "2. Confirmed",
    icon: "🔒",
    description: "Send immediately when 50% deposit is received to confirm locked date.",
    suggestedStatus: "booked",
    sms: (lead) =>
      `Boom! ${lead.name || "friend"}, your 50% deposit is confirmed & ${
        lead.eventDate || "your date"
      } is officially LOCKED on our smoker calendar! We can't wait to feed your ${
        lead.guestCount || 0
      } guests. Full receipt sent to ${lead.email || "your email"}. - Pitmaster Marion (773) 707-9988 🔥`,
    emailSubject: (lead) =>
      `Deposit Confirmed — ${lead.eventDate || "Your Date"} is Officially Locked! | All The Smoke BBQ`,
    emailBody: (lead) =>
      `Hi ${lead.name || "there"},\n\nGreat news! We have received your 50% deposit, and your date (${
        lead.eventDate || "Confirmed Date"
      }) is officially LOCKED onto the All The Smoke commercial smoker calendar!\n\nConfirmed Reservation Summary:\n• Event: ${
        lead.eventType || "Private Catering"
      }\n• Confirmed Date: ${lead.eventDate || "Pending"}\n• Headcount: ${
        lead.guestCount || 0
      } Guests\n• Menu Package: ${lead.packageName || "Live-Fire BBQ Experience"}\n• Service Location: ${
        lead.deliveryAddress || "Chicago, IL"
      }\n\nWhat happens next:\n1. Two Weeks Out: We'll touch base to verify any minor adjustments to headcount or sides.\n2. One Week Out: We'll confirm load-in timing, rig parking clearance, and final balance payment.\n3. Day-Of: We fire up our post oak & hickory smoker 14 hours in advance so your meats arrive mahogany-bark tender in insulated hot-boxes right on schedule.\n\nThank you for choosing All The Smoke to feed your crew. If you need anything before then, call or text me at (773) 707-9988.\n\nBest regards,\nMarion Bolden | Pitmaster & Owner\nAll The Smoke BBQ & Catering`,
  },
  {
    id: "week-countdown",
    name: "1-Week Countdown & Rig Clearance",
    stageBadge: "3. Logistics",
    icon: "⏳",
    description: "Verify final headcount, hot-box serving time, and pit trailer parking space.",
    suggestedStatus: "booked",
    sms: (lead) =>
      `Hey ${lead.name || "there"}! 1-week countdown to your ${lead.eventType || "event"}${
        lead.eventDate ? ` on ${lead.eventDate}` : ""
      }! Quick logistics check: final headcount (${lead.guestCount || 0}?), serving time, and flat driveway/alley space for our smoker trailer? Call or text me at (773) 707-9988. - Marion`,
    emailSubject: (lead) =>
      `1-Week Countdown & Smoker Rig Logistics for ${lead.eventDate || "Your Event"} | All The Smoke BBQ`,
    emailBody: (lead) =>
      `Hi ${lead.name || "there"},\n\nWe are exactly one week away from firing up the pits for your ${
        lead.eventType || "event"
      }${lead.eventDate ? ` on ${lead.eventDate}` : ""}!\n\nTo ensure flawless execution, please take a quick minute to verify these key details:\n\n1. Final Headcount: Currently marked for ${
        lead.guestCount || 0
      } guests. Please let us know if there are any final adjustments today so our butcher orders are exact.\n2. Serving Time: What time should we have hot-boxes unsealed and food ready for your guests? (We recommend arriving 45-60 mins prior for staging).\n3. Smoker Trailer & Vehicle Clearance: Please confirm flat driveway, alleyway, or parking lot clearance with approximately 25-30 ft of clearance for the pit rig.\n4. Remaining Balance: Any remaining balance is due prior to or at time of delivery.\n\nPlease reply to this email or call/text me at (773) 707-9988 so we can lock in the final schedule.\n\nCan't wait to bring the smoke!\n\nMarion Bolden & The Pitmaster Crew\nAll The Smoke BBQ & Catering`,
  },
  {
    id: "day-of-fired-up",
    name: "Day-Of: Smoker Fired Up",
    stageBadge: "4. Day-Of",
    icon: "🔥",
    description: "Morning-of reassurance that hardwood oak logs are lit and hot-box delivery is on time.",
    suggestedStatus: "booked",
    sms: (lead) =>
      `Morning ${lead.name || "there"}! Post oak logs are rolling at the smokehouse and your brisket & ribs are in the pit chamber! Right on schedule for delivery today. Any last-minute updates, text or call me at (773) 707-9988. - Marion`,
    emailSubject: (lead) =>
      `Smoker Fired Up & Delivery on Schedule for Today (${lead.eventDate || "Event Day"}) | All The Smoke BBQ`,
    emailBody: (lead) =>
      `Good morning ${lead.name || "there"},\n\nThe smokehouse pits are running at full temp, hardwood oak logs are rolling, and your catering order is in the chamber developing that signature deep mahogany bark!\n\nWe are right on schedule for your ${
        lead.eventType || "event"
      } today. Our commercial hot-boxes are preheated to 165°F to ensure your food arrives piping hot and fresh.\n\nIf you have any last-minute gate codes, parking instructions, or day-of updates, please text or call my cell directly at (773) 707-9988.\n\nSee you shortly!\n\nPitmaster Marion Bolden\nAll The Smoke BBQ & Catering\n(773) 707-9988`,
  },
  {
    id: "review-request",
    name: "Post-Event Review & Thanks",
    stageBadge: "5. Review",
    icon: "⭐",
    description: "Send 24-48 hours post-event to harvest verified 5-star Google reviews.",
    suggestedStatus: "completed",
    sms: (lead) =>
      `Hey ${lead.name || "there"}! Thank you so much for having All The Smoke out for your ${
        lead.eventType || "event"
      }! Hope everyone loved the BBQ. If you have 30 seconds, could you leave Marion a 5-star Google review? It helps our local smokehouse immensely: https://g.page/r/allthesmokecatering/review Thank you! 🔥`,
    emailSubject: (lead) =>
      `Thank You from All The Smoke BBQ (+ A Quick 30-Sec Favor) | Pitmaster Marion`,
    emailBody: (lead) =>
      `Hi ${lead.name || "there"},\n\nOn behalf of the entire crew at All The Smoke BBQ & Catering, thank you so much for trusting us to feed your guests at your ${
        lead.eventType || "event"
      }!\n\nSmoking authentic, live-fire craft barbecue for Chicago events is our passion, and we hope every guest left full and happy.\n\nIf you enjoyed the barbecue and our service, would you take 30 seconds to leave us a quick 5-star Google review?\n\n👉 https://g.page/r/allthesmokecatering/review\n\nAs an independent Chicago smokehouse, word of mouth and Google reviews mean the world to us.\n\nThank you again for your business, and we hope to see you at your next celebration!\n\nWarmly,\nMarion Bolden | Pitmaster & Owner\nAll The Smoke BBQ & Catering\n(773) 707-9988 | allthesmokecatering.com`,
  },
];

export function AdminQuickMessageModal({
  lead,
  isOpen,
  onClose,
  theme = "night",
  onLeadUpdated,
}: AdminQuickMessageModalProps) {
  const isDay = theme === "day" || theme === "butcher-paper";

  // Tab: 'sms' or 'email'
  const [activeChannel, setActiveChannel] = useState<"sms" | "email">("sms");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("quote-followup");

  // Editable fields
  const [currentSmsText, setCurrentSmsText] = useState("");
  const [currentEmailSubject, setCurrentEmailSubject] = useState("");
  const [currentEmailBody, setCurrentEmailBody] = useState("");

  // Action status states
  const [copied, setCopied] = useState(false);
  const [isSendingBrevo, setIsSendingBrevo] = useState(false);
  const [sendSuccessNotice, setSendSuccessNotice] = useState<string | null>(null);
  const [sendErrorNotice, setSendErrorNotice] = useState<string | null>(null);
  const [autoUpdateStatus, setAutoUpdateStatus] = useState(true);

  // Load template contents when lead or selected template changes
  useEffect(() => {
    if (!lead) return;
    const tmpl = CATERING_TEMPLATES.find((t) => t.id === selectedTemplateId) || CATERING_TEMPLATES[0];
    setCurrentSmsText(tmpl.sms(lead));
    setCurrentEmailSubject(tmpl.emailSubject(lead));
    setCurrentEmailBody(tmpl.emailBody(lead));
    setSendSuccessNotice(null);
    setSendErrorNotice(null);
  }, [lead, selectedTemplateId]);

  if (!isOpen || !lead) return null;

  const currentTemplate =
    CATERING_TEMPLATES.find((t) => t.id === selectedTemplateId) || CATERING_TEMPLATES[0];

  // Helper: append note to lead and sync localStorage
  const logMessageToLeadNotes = (channel: "SMS" | "Email", contentSummary: string) => {
    try {
      const dateStr = new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
      const noteEntry = `[${dateStr} - ${channel} Sent (${currentTemplate.name})]: "${contentSummary.slice(0, 80)}..."`;
      const updatedNotes = lead.notes ? `${lead.notes}\n${noteEntry}` : noteEntry;

      let nextStatus = lead.status;
      if (autoUpdateStatus && currentTemplate.suggestedStatus) {
        // Only advance forward (e.g., new -> quoted or new -> booked)
        nextStatus = currentTemplate.suggestedStatus;
      }

      const updatedLead: PitmasterLead = {
        ...lead,
        notes: updatedNotes,
        status: nextStatus,
      };

      const rawLeads = localStorage.getItem("ats_pitmaster_leads");
      if (rawLeads) {
        const parsed: PitmasterLead[] = JSON.parse(rawLeads);
        const nextList = parsed.map((l) => (l.id === lead.id ? updatedLead : l));
        localStorage.setItem("ats_pitmaster_leads", JSON.stringify(nextList));
        window.dispatchEvent(new Event("storage"));
      }

      if (onLeadUpdated) {
        onLeadUpdated(updatedLead);
      }
    } catch (e) {
      console.error("Failed to log communication note:", e);
    }
  };

  // 1. Copy SMS / Text
  const handleCopySms = () => {
    navigator.clipboard.writeText(currentSmsText);
    setCopied(true);
    logMessageToLeadNotes("SMS", currentSmsText);
    setTimeout(() => setCopied(false), 2200);
  };

  // 2. Open Native SMS on Phone
  const handleOpenPhoneSms = () => {
    logMessageToLeadNotes("SMS", currentSmsText);
    const cleanPhone = lead.phone ? lead.phone.replace(/[^0-9]/g, "") : "";
    const encodedBody = encodeURIComponent(currentSmsText);
    // iOS and Android support sms:phone?body=...
    window.location.href = `sms:${cleanPhone}?body=${encodedBody}`;
  };

  // 3. Open Native Mail App
  const handleOpenNativeMail = () => {
    logMessageToLeadNotes("Email", currentEmailSubject);
    const cleanEmail = lead.email || "";
    const encodedSub = encodeURIComponent(currentEmailSubject);
    const encodedBody = encodeURIComponent(currentEmailBody);
    window.location.href = `mailto:${cleanEmail}?subject=${encodedSub}&body=${encodedBody}`;
  };

  // 4. Send via Brevo API Directly from info@allthesmokecatering.com
  const handleSendBrevoEmail = async () => {
    if (!lead.email || !lead.email.includes("@")) {
      setSendErrorNotice("Customer does not have a valid email address on file.");
      return;
    }

    setIsSendingBrevo(true);
    setSendSuccessNotice(null);
    setSendErrorNotice(null);

    try {
      const res = await fetch("/api/admin/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId: lead.id,
          recipientEmail: lead.email,
          clientName: lead.name,
          subject: currentEmailSubject.trim(),
          messageContent: currentEmailBody.trim(),
          senderEmail: "info@allthesmokecatering.com",
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to dispatch email via Brevo.");
      }

      // Record in sent messages storage
      try {
        const rawMsgs = localStorage.getItem("ats_admin_sent_messages");
        const prevMsgs = rawMsgs ? JSON.parse(rawMsgs) : [];
        const newMsg = data.message || {
          id: "msg-" + Date.now(),
          leadId: lead.id,
          sender: "info@allthesmokecatering.com",
          recipient: lead.email,
          subject: currentEmailSubject.trim(),
          body: currentEmailBody.trim(),
          status: "sent",
          createdAt: new Date().toISOString(),
        };
        localStorage.setItem("ats_admin_sent_messages", JSON.stringify([newMsg, ...prevMsgs]));
      } catch (err) {
        console.error("Failed saving to sent messages:", err);
      }

      logMessageToLeadNotes("Email", currentEmailSubject);
      setSendSuccessNotice(
        `Dispatched successfully to ${lead.email}! BCC delivered to Marion & Todd.`
      );
    } catch (err: any) {
      setSendErrorNotice(err.message || "Failed to dispatch email. Please check network/Brevo API.");
    } finally {
      setIsSendingBrevo(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div
        className={`w-full max-w-3xl rounded-3xl border shadow-2xl p-5 sm:p-7 space-y-5 my-auto max-h-[92vh] overflow-y-auto ${
          isDay ? "bg-white border-stone-300 text-stone-900" : "bg-[#141210] border-zinc-800 text-white"
        }`}
      >
        {/* HEADER BAR */}
        <div className="flex items-start justify-between gap-4 pb-3 border-b border-stone-200 dark:border-zinc-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-[#FF7A00] text-white shadow-xs">
                ⚡ Quick Outreach Hub
              </span>
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                  isDay
                    ? "bg-stone-100 border-stone-300 text-black"
                    : "bg-zinc-800 border-zinc-700 text-stone-300"
                }`}
              >
                Lead: <strong>{lead.name}</strong> ({lead.phone || "No phone"} • {lead.email})
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black font-display tracking-tight flex items-center gap-2">
              <span>One-Click Catering Notification Templates</span>
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold cursor-pointer transition-colors ${
              isDay ? "bg-stone-200 hover:bg-stone-300 text-black" : "text-stone-400 hover:text-white bg-zinc-800/80"
            }`}
            title="Close (Esc)"
          >
            ✕
          </button>
        </div>

        {/* NOTICES */}
        {sendSuccessNotice && (
          <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/80 text-emerald-200 text-xs flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-2">
              <span className="text-emerald-400 text-base">✓</span>
              <span className="font-semibold">{sendSuccessNotice}</span>
            </div>
            <button
              type="button"
              onClick={() => setSendSuccessNotice(null)}
              className="text-emerald-300 hover:text-white font-bold ml-2"
            >
              ✕
            </button>
          </div>
        )}

        {sendErrorNotice && (
          <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-700 text-red-200 text-xs flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-2">
              <span className="text-red-400 text-base">⚠️</span>
              <span className="font-semibold">{sendErrorNotice}</span>
            </div>
            <button
              type="button"
              onClick={() => setSendErrorNotice(null)}
              className="text-red-300 hover:text-white font-bold ml-2"
            >
              ✕
            </button>
          </div>
        )}

        {/* STEP 1: SELECT CATERING LIFECYCLE TEMPLATE (HORIZONTAL SCROLL/GRID) */}
        <div className="space-y-2">
          <label className={`text-xs font-black uppercase tracking-wider block ${isDay ? "text-stone-700" : "text-stone-300"}`}>
            1. Select Stage Template:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {CATERING_TEMPLATES.map((tmpl) => {
              const isSelected = tmpl.id === selectedTemplateId;
              return (
                <button
                  key={tmpl.id}
                  type="button"
                  onClick={() => setSelectedTemplateId(tmpl.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? isDay
                        ? "bg-amber-50 border-[#FF7A00] ring-2 ring-[#FF7A00]/30 shadow-md"
                        : "bg-[#251A0D] border-[#FF7A00] ring-2 ring-[#FF7A00]/40 shadow-md"
                      : isDay
                      ? "bg-stone-50 border-stone-300 hover:border-amber-400"
                      : "bg-[#181512] border-zinc-800 hover:border-zinc-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-lg">{tmpl.icon}</span>
                    <span
                      className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${
                        isSelected
                          ? "bg-[#FF7A00] text-white"
                          : isDay
                          ? "bg-stone-200 text-stone-700"
                          : "bg-zinc-800 text-stone-400"
                      }`}
                    >
                      {tmpl.stageBadge}
                    </span>
                  </div>
                  <div
                    className={`font-black text-xs leading-snug line-clamp-2 ${
                      isSelected ? (isDay ? "text-[#C84A0A]" : "text-[#FF7A00]") : isDay ? "text-black" : "text-stone-200"
                    }`}
                  >
                    {tmpl.name}
                  </div>
                </button>
              );
            })}
          </div>
          <p className={`text-[11px] italic font-medium ${isDay ? "text-stone-600" : "text-stone-400"}`}>
            ℹ️ {currentTemplate.description}
          </p>
        </div>

        {/* STEP 2: CHANNEL SELECTOR (SMS vs EMAIL) */}
        <div className="space-y-2 pt-1 border-t border-stone-200 dark:border-zinc-800">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <label className={`text-xs font-black uppercase tracking-wider ${isDay ? "text-stone-700" : "text-stone-300"}`}>
              2. Choose Channel &amp; Review Message:
            </label>
            <div className="flex items-center gap-1 p-1 rounded-xl border bg-stone-100 dark:bg-zinc-900 border-stone-300 dark:border-zinc-700">
              <button
                type="button"
                onClick={() => setActiveChannel("sms")}
                className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeChannel === "sms"
                    ? "bg-[#EA580C] text-white shadow-xs"
                    : isDay
                    ? "text-stone-700 hover:text-black"
                    : "text-stone-400 hover:text-white"
                }`}
              >
                <span>📱</span>
                <span>SMS / Text ({lead.phone || "No Phone"})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveChannel("email")}
                className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeChannel === "email"
                    ? "bg-[#EA580C] text-white shadow-xs"
                    : isDay
                    ? "text-stone-700 hover:text-black"
                    : "text-stone-400 hover:text-white"
                }`}
              >
                <span>✉️</span>
                <span>Email ({lead.email || "No Email"})</span>
              </button>
            </div>
          </div>

          {/* SMS EDITOR */}
          {activeChannel === "sms" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold">
                <span className={isDay ? "text-stone-700" : "text-stone-300"}>
                  To: <strong>{lead.name}</strong> • Cell: <strong>{lead.phone || "No phone number saved"}</strong>
                </span>
                <span className={currentSmsText.length > 160 ? "text-amber-500 font-black" : isDay ? "text-stone-600" : "text-stone-400"}>
                  {currentSmsText.length} characters {currentSmsText.length > 160 && "(Multi-part SMS)"}
                </span>
              </div>

              <textarea
                rows={4}
                value={currentSmsText}
                onChange={(e) => setCurrentSmsText(e.target.value)}
                className={`w-full p-3.5 rounded-xl border text-xs sm:text-sm font-sans font-medium leading-relaxed focus:outline-none transition-colors ${
                  isDay
                    ? "bg-white border-stone-400 text-black placeholder:text-stone-600 focus:border-[#FF7A00]"
                    : "bg-[#181512] border-zinc-700 text-white placeholder:text-zinc-500 focus:border-[#FF7A00]"
                }`}
              />

              {/* SMS ACTION BAR */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
                <div className={`text-[11px] font-medium ${isDay ? "text-stone-600" : "text-stone-400"}`}>
                  📱 <em>On phone? "Open in SMS" launches your Messages app ready to send. On PC? Use "Copy SMS Text".</em>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopySms}
                    className={`h-9 px-3.5 rounded-xl border text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                      copied
                        ? "bg-emerald-600 text-white border-emerald-500"
                        : isDay
                        ? "bg-white border-stone-400 text-black hover:bg-stone-100"
                        : "bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700"
                    }`}
                  >
                    <span>{copied ? "✓ Copied!" : "📋 Copy SMS Text"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleOpenPhoneSms}
                    disabled={!lead.phone}
                    className="h-9 px-4 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#E65100] text-white text-xs font-black flex items-center gap-1.5 shadow-md hover:scale-103 active:scale-97 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>💬</span>
                    <span>Open in SMS (Phone)</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* EMAIL EDITOR */}
          {activeChannel === "email" && (
            <div className="space-y-3">
              {/* Subject */}
              <div>
                <label className={`text-[11px] font-black uppercase tracking-wider block mb-1 ${isDay ? "text-stone-700" : "text-stone-300"}`}>
                  Subject Line:
                </label>
                <input
                  type="text"
                  value={currentEmailSubject}
                  onChange={(e) => setCurrentEmailSubject(e.target.value)}
                  className={`w-full text-xs sm:text-sm h-9 px-3 rounded-xl border font-bold focus:outline-none transition-colors ${
                    isDay
                      ? "bg-white border-stone-400 text-black placeholder:text-stone-600 focus:border-[#FF7A00]"
                      : "bg-[#181512] border-zinc-700 text-white placeholder:text-zinc-500 focus:border-[#FF7A00]"
                  }`}
                />
              </div>

              {/* Body */}
              <div>
                <label className={`text-[11px] font-black uppercase tracking-wider block mb-1 ${isDay ? "text-stone-700" : "text-stone-300"}`}>
                  Message Content:
                </label>
                <textarea
                  rows={6}
                  value={currentEmailBody}
                  onChange={(e) => setCurrentEmailBody(e.target.value)}
                  className={`w-full p-3.5 rounded-xl border text-xs sm:text-sm font-sans font-medium leading-relaxed focus:outline-none transition-colors ${
                    isDay
                      ? "bg-white border-stone-400 text-black placeholder:text-stone-600 focus:border-[#FF7A00]"
                      : "bg-[#181512] border-zinc-700 text-white placeholder:text-zinc-500 focus:border-[#FF7A00]"
                  }`}
                />
              </div>

              {/* EMAIL ACTION BAR */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1">
                <div className={`text-[11px] flex items-center gap-1.5 ${isDay ? "text-stone-600" : "text-stone-400"}`}>
                  <span className="text-emerald-500 text-sm">🛡️</span>
                  <span>
                    Dispatches from <strong>info@allthesmokecatering.com</strong> via Brevo. BCCs Marion &amp; Todd.
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleOpenNativeMail}
                    className={`h-9 px-3 rounded-xl border text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                      isDay
                        ? "bg-white border-stone-400 text-black hover:bg-stone-100"
                        : "bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700"
                    }`}
                    title="Open in Apple Mail, Outlook, or Thunderbird"
                  >
                    <span>📬 Mail App</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSendBrevoEmail}
                    disabled={isSendingBrevo || !lead.email}
                    className="h-9 px-4 rounded-xl bg-gradient-to-r from-[#EA580C] to-[#C84A0A] hover:from-[#C84A0A] hover:to-[#9E3406] text-white text-xs font-black flex items-center gap-1.5 shadow-md transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSendingBrevo ? (
                      <>
                        <svg className="animate-spin h-3.5 w-3.5 text-white" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4} />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        <span>Dispatching...</span>
                      </>
                    ) : (
                      <>
                        <span>🚀</span>
                        <span>Send Official Email</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER AUDIT SETTINGS */}
        <div className={`pt-3 border-t flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs ${
          isDay ? "border-stone-200 text-stone-700" : "border-zinc-800 text-stone-400"
        }`}>
          <label className="flex items-center gap-2 cursor-pointer font-bold select-none">
            <input
              type="checkbox"
              checked={autoUpdateStatus}
              onChange={(e) => setAutoUpdateStatus(e.target.checked)}
              className="accent-[#FF7A00] w-4 h-4 rounded cursor-pointer"
            />
            <span>
              Auto-advance lead status to <strong>{currentTemplate.suggestedStatus}</strong> &amp; log timestamp in notes
            </span>
          </label>

          <button
            type="button"
            onClick={onClose}
            className={`px-4 py-2 rounded-xl text-xs font-black cursor-pointer transition-colors ${
              isDay ? "bg-stone-200 hover:bg-stone-300 text-black" : "bg-zinc-800 hover:bg-zinc-700 text-white"
            }`}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

