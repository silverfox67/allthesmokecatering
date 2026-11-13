"use client";

import React, { useState, useEffect } from "react";
import { PitmasterLead, LeadStatus } from "./AdminLeadsPipeline";
import { AdminGuide } from "./AdminGuide";

export interface SentMessage {
  id: string;
  leadId: string;
  sender: string;
  recipient: string;
  subject: string;
  body: string;
  status: string;
  createdAt: string;
}

export interface InboundEmail {
  id: string;
  senderEmail: string;
  senderName: string;
  recipientEmail: string;
  subject: string;
  body: string;
  isRead: boolean;
  createdAt: string;
}

export interface AdminEmailHubProps {
  theme?: "day" | "night" | "dark" | "butcher-paper";
  prefilledLead?: PitmasterLead;
  subTab?: string;
}

// 5 1-Tap Quick-Reply Catering Lifecycle Templates for Live-Fire Texas BBQ
const QUICK_REPLY_TEMPLATES = [
  {
    id: "quote-followup",
    name: "Quote Follow-Up",
    badge: "1. Follow-Up",
    generateSubject: (lead: PitmasterLead) =>
      `Following up on your ${lead.eventType || "Catering"} Quote | All The Smoke BBQ`,
    generateBody: (lead: PitmasterLead) =>
      `Hi ${lead.name || "there"},\n\nThank you again for considering All The Smoke BBQ & Catering for your ${
        lead.eventType || "upcoming event"
      }${lead.eventDate ? ` on ${lead.eventDate}` : ""}!\n\nI wanted to quickly check in on your plans for your party of ${
        lead.guestCount || "approximate"
      } guests. Weekend pit trailer bookings fill up quickly on our commissary calendar, and I want to make sure you have first priority for your date.\n\nWhether you'd like to adjust meats (14-hour Texas brisket, St. Louis ribs, smoked turkey, or wings) or need a customized package, I'm happy to help.\n\nWhenever you're ready to secure your date, we can generate your catering agreement and 50% deposit link.\n\nFeel free to reply directly to this email or call/text me at (773) 707-9988.\n\nWarm regards,\nMarion Bolden | Pitmaster & Owner\nAll The Smoke BBQ & Catering\n(773) 707-9988 | allthesmokecatering.com`,
  },
  {
    id: "deposit-confirmed",
    name: "Deposit & Date Locked",
    badge: "2. Confirmed",
    generateSubject: (lead: PitmasterLead) =>
      `Deposit Confirmed — ${lead.eventDate || "Your Date"} is Officially Locked! | All The Smoke BBQ`,
    generateBody: (lead: PitmasterLead) =>
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
    name: "1-Week Rig Logistics",
    badge: "3. Logistics",
    generateSubject: (lead: PitmasterLead) =>
      `1-Week Countdown & Smoker Rig Logistics for ${lead.eventDate || "Your Event"} | All The Smoke BBQ`,
    generateBody: (lead: PitmasterLead) =>
      `Hi ${lead.name || "there"},\n\nWe are exactly one week away from firing up the pits for your ${
        lead.eventType || "event"
      }${lead.eventDate ? ` on ${lead.eventDate}` : ""}!\n\nTo ensure flawless execution, please take a quick minute to verify these key details:\n\n1. Final Headcount: Currently marked for ${
        lead.guestCount || 0
      } guests. Please let us know if there are any final adjustments today so our butcher orders are exact.\n2. Serving Time: What time should we have hot-boxes unsealed and food ready for your guests? (We recommend arriving 45-60 mins prior for staging).\n3. Smoker Trailer & Vehicle Clearance: Please confirm flat driveway, alleyway, or parking lot clearance with approximately 25-30 ft of clearance for the pit rig.\n4. Remaining Balance: Any remaining balance is due prior to or at time of delivery.\n\nPlease reply to this email or call/text me at (773) 707-9988 so we can lock in the final schedule.\n\nCan't wait to bring the smoke!\n\nMarion Bolden & The Pitmaster Crew\nAll The Smoke BBQ & Catering`,
  },
  {
    id: "day-of-fired-up",
    name: "Day-Of: Pit Fired Up",
    badge: "4. Day-Of",
    generateSubject: (lead: PitmasterLead) =>
      `Smoker Fired Up & Delivery on Schedule for Today (${lead.eventDate || "Event Day"}) | All The Smoke BBQ`,
    generateBody: (lead: PitmasterLead) =>
      `Good morning ${lead.name || "there"},\n\nThe smokehouse pits are running at full temp, hardwood oak logs are rolling, and your catering order is in the chamber developing that signature deep mahogany bark!\n\nWe are right on schedule for your ${
        lead.eventType || "event"
      } today. Our commercial hot-boxes are preheated to 165°F to ensure your food arrives piping hot and fresh.\n\nIf you have any last-minute gate codes, parking instructions, or day-of updates, please text or call my cell directly at (773) 707-9988.\n\nSee you shortly!\n\nPitmaster Marion Bolden\nAll The Smoke BBQ & Catering\n(773) 707-9988`,
  },
  {
    id: "review-request",
    name: "5-Star Review Request",
    badge: "5. Review",
    generateSubject: (lead: PitmasterLead) =>
      `Thank You from All The Smoke BBQ (+ A Quick 30-Sec Favor) | Pitmaster Marion`,
    generateBody: (lead: PitmasterLead) =>
      `Hi ${lead.name || "there"},\n\nOn behalf of the entire crew at All The Smoke BBQ & Catering, thank you so much for trusting us to feed your guests at your ${
        lead.eventType || "event"
      }!\n\nSmoking authentic, live-fire craft barbecue for Chicago events is our passion, and we hope every guest left full and happy.\n\nIf you enjoyed the barbecue and our service, would you take 30 seconds to leave us a quick 5-star Google review?\n\n👉 https://g.page/r/allthesmokecatering/review\n\nAs an independent Chicago smokehouse, word of mouth and Google reviews mean the world to us.\n\nThank you again for your business, and we hope to see you at your next celebration!\n\nWarmly,\nMarion Bolden | Pitmaster & Owner\nAll The Smoke BBQ & Catering\n(773) 707-9988 | allthesmokecatering.com`,
  },
];

// Lead status styling in All The Smoke live-fire palette
const getStatusBadge = (status: LeadStatus, isDay: boolean) => {
  switch (status) {
    case "new":
      return {
        label: "new",
        badgeClass: isDay
          ? "bg-blue-100 border-blue-300 text-blue-950 font-black"
          : "bg-blue-950/60 border-blue-500/30 text-blue-300 font-bold",
      };
    case "contacted":
      return {
        label: "contacted",
        badgeClass: isDay
          ? "bg-amber-100 border-amber-300 text-amber-950 font-black"
          : "bg-amber-950/60 border-amber-500/30 text-amber-300 font-bold",
      };
    case "quoted":
      return {
        label: "quoted",
        badgeClass: isDay
          ? "bg-orange-100 border-orange-300 text-[#C84A0A] font-black"
          : "bg-[#FF7A00]/20 border-[#FF7A00]/40 text-[#FF7A00] font-bold",
      };
    case "booked":
      return {
        label: "booked",
        badgeClass: isDay
          ? "bg-emerald-100 border-emerald-300 text-emerald-950 font-black"
          : "bg-emerald-950/60 border-emerald-500/30 text-emerald-300 font-bold",
      };
    case "completed":
      return {
        label: "completed",
        badgeClass: isDay
          ? "bg-purple-100 border-purple-300 text-purple-950 font-black"
          : "bg-purple-950/60 border-purple-500/30 text-purple-300 font-bold",
      };
    case "ghosted":
    default:
      return {
        label: "ghosted",
        badgeClass: isDay
          ? "bg-stone-200 border-stone-400 text-black font-black"
          : "bg-zinc-800 border-zinc-700 text-zinc-300 font-bold",
      };
  }
};

export function AdminEmailHub({ theme = "night", prefilledLead, subTab }: AdminEmailHubProps) {
  const isDay = theme === "day" || theme === "butcher-paper";
  const [localTabOverride, setLocalTabOverride] = useState<"inbox" | "sent" | "compose" | null>(null);
  const activeTab: "inbox" | "sent" | "compose" =
    subTab === "compose" || subTab === "inbox" || subTab === "sent"
      ? (localTabOverride || subTab)
      : localTabOverride || (prefilledLead ? "compose" : "inbox");

  useEffect(() => {
    setLocalTabOverride(null);
  }, [subTab]);

  const [leads, setLeads] = useState<PitmasterLead[]>([]);
  const [messages, setMessages] = useState<SentMessage[]>([]);
  const [inboundEmails, setInboundEmails] = useState<InboundEmail[]>([]);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTab, setFilterTab] = useState<"all" | "needs-reply" | "replied">("all");

  // Reply / Standalone Compose State
  const [customRecipientEmail, setCustomRecipientEmail] = useState("");
  const [customRecipientName, setCustomRecipientName] = useState("");
  const [senderAlias, setSenderAlias] = useState<"info@allthesmokecatering.com" | "marion@allthesmokecatering.com">("info@allthesmokecatering.com");
  const [replySubject, setReplySubject] = useState("");
  const [replyBody, setReplyBody] = useState(""); // Starts empty so Marion can type his own response!
  const [isSending, setIsSending] = useState(false);
  const [successAlert, setSuccessAlert] = useState<string | null>(null);
  const [errorAlert, setErrorAlert] = useState<string | null>(null);

  // Full Lead Blow-Up Modal
  const [fullLeadModalOpen, setFullLeadModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Load leads and message history from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const rawLeads = localStorage.getItem("ats_pitmaster_leads");
        if (rawLeads) {
          const parsed: PitmasterLead[] = JSON.parse(rawLeads);
          setLeads(parsed);
          if (prefilledLead) {
            handleSelectLead(prefilledLead);
          } else if (parsed.length > 0 && !selectedLeadId) {
            handleSelectLead(parsed[0]);
          }
        } else if (prefilledLead) {
          handleSelectLead(prefilledLead);
        }

        const rawMsgs = localStorage.getItem("ats_admin_sent_messages");
        if (rawMsgs) {
          setMessages(JSON.parse(rawMsgs));
        }
      } catch (err) {
        console.error("Failed to load email hub data:", err);
      }

      fetch("/api/admin/messages")
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data && data.success && Array.isArray(data.messages) && data.messages.length > 0) {
            setMessages(data.messages);
            try {
              localStorage.setItem("ats_admin_sent_messages", JSON.stringify(data.messages));
            } catch {
              // ignore storage quota errors
            }
          }
        })
        .catch((err) => {
          console.warn("Supabase messages sync fallback to localStorage:", err);
        });

      fetch("/api/admin/inbound-email")
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data && data.success && Array.isArray(data.inboundEmails)) {
            setInboundEmails(data.inboundEmails);
          }
        })
        .catch((err) => {
          console.warn("Inbound email sync warning:", err);
        });
    }
  }, [prefilledLead]);

  const handleSelectLead = (lead: PitmasterLead) => {
    setSelectedLeadId(lead.id);
    setReplySubject(`Re: Catering Inquiry for ${lead.name} — All The Smoke BBQ`);
    setReplyBody(""); // Empty by default so Marion can write freely!
    setErrorAlert(null);
  };

  const handleSendReply = async () => {
    const currentLead = leads.find((l) => l.id === selectedLeadId) || prefilledLead;
    const targetEmail = (customRecipientEmail.trim() || currentLead?.email || "").trim();
    const targetName = (customRecipientName.trim() || currentLead?.name || targetEmail).trim();
    if (!targetEmail || !replyBody.trim()) return;

    setIsSending(true);
    setErrorAlert(null);
    setSuccessAlert(null);

    const subjectToSend =
      replySubject.trim() || `Message from All The Smoke BBQ & Catering`;
    const bodyToSend = replyBody.trim();

    try {
      const res = await fetch("/api/admin/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId: customRecipientEmail.trim() ? "" : (currentLead?.id || ""),
          recipientEmail: targetEmail,
          clientName: targetName,
          subject: subjectToSend,
          messageContent: bodyToSend,
          senderEmail: senderAlias,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to dispatch email via Brevo");
      }

      const newMsg: SentMessage = data.message || {
        id: "msg-" + Date.now(),
        leadId: customRecipientEmail.trim() ? "" : (currentLead?.id || ""),
        sender: senderAlias,
        recipient: targetEmail,
        subject: subjectToSend,
        body: bodyToSend,
        status: "sent",
        createdAt: new Date().toISOString(),
      };

      const updatedMsgs = [newMsg, ...messages];
      setMessages(updatedMsgs);

      // Auto update lead status to "quoted" if replying to an existing lead
      const updatedLeads = leads.map((l) => {
        if (!customRecipientEmail.trim() && currentLead && l.id === currentLead.id && l.status === "new") {
          return { ...l, status: "quoted" as LeadStatus };
        }
        return l;
      });
      setLeads(updatedLeads);

      if (typeof window !== "undefined") {
        localStorage.setItem("ats_admin_sent_messages", JSON.stringify(updatedMsgs));
        localStorage.setItem("ats_pitmaster_leads", JSON.stringify(updatedLeads));
        window.dispatchEvent(new Event("storage"));
      }

      setSuccessAlert(`Email sent to ${targetName} (${targetEmail}) from ${senderAlias}!`);
      setReplyBody(""); // Reset composer after sending
      if (customRecipientEmail.trim()) {
        setCustomRecipientEmail("");
        setCustomRecipientName("");
      }
    } catch (err: any) {
      setErrorAlert(err.message || "Failed to send email. Check Brevo API status.");
    } finally {
      setIsSending(false);
    }
  };

  const handleCopyLeadSpecs = (lead: PitmasterLead) => {
    const specs = `Client: ${lead.name}\nEmail: ${lead.email}\nPhone: ${lead.phone}\nEvent: ${lead.eventType}\nDate: ${lead.eventDate}\nGuests: ${lead.guestCount}\nPackage: ${lead.packageName}\nNotes: ${lead.notes || "None"}`;
    navigator.clipboard.writeText(specs);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Active Lead Object
  const currentLead =
    leads.find((l) => l.id === selectedLeadId) || (leads.length > 0 ? leads[0] : null);

  const currentLeadMessages = currentLead
    ? messages.filter((m) => m.leadId === currentLead.id || m.recipient === currentLead.email)
    : [];

  const currentLeadInbound = currentLead
    ? inboundEmails.filter(
        (inb) => inb.senderEmail.toLowerCase() === (currentLead.email || "").toLowerCase()
      )
    : [];

  const unreadInboundCount = inboundEmails.filter((inb) => !inb.isRead).length;

  const handleMarkInboundRead = async (emailId: string, isRead = true) => {
    setInboundEmails((prev) =>
      prev.map((item) => (item.id === emailId ? { ...item, isRead } : item))
    );
    try {
      await fetch("/api/admin/inbound-email", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: emailId, isRead }),
      });
    } catch (err) {
      console.warn("Mark inbound read failed:", err);
    }
  };

  const handleReplyToInbound = (inb: InboundEmail) => {
    const matched = leads.find(
      (l) => (l.email || "").toLowerCase() === inb.senderEmail.toLowerCase()
    );
    if (matched) {
      setSelectedLeadId(matched.id);
    } else {
      const tempLead: PitmasterLead = {
        id: `inb-${inb.id}`,
        ticketId: "INBOX-REPLY",
        name: inb.senderName || inb.senderEmail,
        email: inb.senderEmail,
        phone: "",
        eventType: "Email Inquiry",
        guestCount: 0,
        eventDate: "Pending",
        packageName: "Direct Email Reply",
        serviceStyle: "Direct Email",
        deliveryAddress: "",
        notes: inb.body,
        status: "new",
        createdAt: inb.createdAt,
        source: "Inbound Email",
        estimatedTotal: 0,
      };
      setLeads((prev) => [tempLead, ...prev]);
      setSelectedLeadId(tempLead.id);
    }
    setCustomRecipientEmail(inb.senderEmail);
    setCustomRecipientName(inb.senderName || inb.senderEmail);
    setReplySubject(inb.subject.startsWith("Re:") ? inb.subject : `Re: ${inb.subject}`);
    setReplyBody("");
    setLocalTabOverride("compose");
    if (!inb.isRead) {
      handleMarkInboundRead(inb.id, true);
    }
  };

  // Filtered Leads
  const filteredLeads = leads.filter((l) => {
    const q = searchQuery.toLowerCase();
    const matchQuery =
      !q ||
      l.name.toLowerCase().includes(q) ||
      l.email.toLowerCase().includes(q) ||
      (l.eventType && l.eventType.toLowerCase().includes(q)) ||
      (l.ticketId && l.ticketId.toLowerCase().includes(q));

    if (!matchQuery) return false;

    const hasReplies = messages.some((m) => m.leadId === l.id || m.recipient === l.email);

    if (filterTab === "needs-reply") return !hasReplies;
    if (filterTab === "replied") return hasReplies;
    return true;
  });

  const needsReplyCount = leads.filter(
    (l) => !messages.some((m) => m.leadId === l.id || m.recipient === l.email)
  ).length;

  const repliedCount = leads.filter((l) =>
    messages.some((m) => m.leadId === l.id || m.recipient === l.email)
  ).length;

  return (
    <div className="space-y-4">
      {activeTab === "inbox" ? (
        <AdminGuide
          guideId="email-inbox"
          theme={isDay ? "day" : "night"}
          title="How your customer inbox works"
          summary="Every catering inquiry and what you've already said back."
          steps={[
            { title: "Find the customer", desc: "Scroll the list or search by name. Use the filters to see who still needs a reply." },
            { title: "Tap their name", desc: "Their original request and any replies you've sent show up on the right." },
            { title: "Need the whole picture?", desc: "Tap View Full Lead to see the date, guest count and their notes." },
            { title: "Ready to answer", desc: "Open the Compose tab on the left to write back to the same person." },
          ]}
          tip="Needs Reply shows everyone you haven't written back to yet."
        />
      ) : (
        <AdminGuide
          guideId="email-compose"
          theme={isDay ? "day" : "night"}
          title="Writing a reply"
          summary="Pick a quick template or write your own."
          steps={[
            { title: "Pick the customer", desc: "Make sure the right name is showing at the top of the composer." },
            { title: "Start with a template", desc: "Tap one of the 1-tap buttons for a ready-made reply, then change anything you like." },
            { title: "Check the subject and message", desc: "Read it over once. Add a personal line about their event." },
            { title: "Send it", desc: "Tap Send Direct Reply. It goes out from your business email and replies come right back to you." },
          ]}
          tip="A quick reply, even just a hello, is the best way to lock in a booking."
        />
      )}
      {/* INBOUND CUSTOMER REPLIES BANNER (Live Zoho/Webhook Inbox) */}
      {inboundEmails.length > 0 && (
        <div
          className={`p-3.5 rounded-2xl border space-y-2.5 ${
            isDay
              ? "bg-amber-50/80 border-amber-300 text-black"
              : "bg-zinc-900/90 border-[#FF7A00]/40 text-stone-100"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-black">📩 Incoming Customer Replies</span>
              {unreadInboundCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#EA580C] text-white">
                  {unreadInboundCount} Unread
                </span>
              )}
            </div>
            <span className={`text-[11px] font-bold ${isDay ? "text-stone-600" : "text-stone-400"}`}>
              Synced via Supabase Inbox
            </span>
          </div>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {inboundEmails.slice(0, 8).map((inb) => (
              <div
                key={inb.id}
                className={`p-2.5 rounded-xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                  !inb.isRead
                    ? isDay
                      ? "bg-white border-amber-400 shadow-2xs"
                      : "bg-zinc-800/90 border-[#FF7A00]/60"
                    : isDay
                    ? "bg-stone-50 border-stone-200 opacity-85"
                    : "bg-zinc-950/60 border-zinc-800 opacity-85"
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    {!inb.isRead && (
                      <span className="w-2 h-2 rounded-full bg-[#EA580C] shrink-0" />
                    )}
                    <span className="font-black truncate">{inb.senderName}</span>
                    <span className={`text-[10px] truncate ${isDay ? "text-stone-600" : "text-stone-400"}`}>
                      &lt;{inb.senderEmail}&gt;
                    </span>
                    <span className={`text-[10px] font-bold ${isDay ? "text-stone-500" : "text-stone-500"}`}>
                      • {new Date(inb.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className={`font-bold text-[11px] mt-0.5 truncate ${isDay ? "text-[#C84A0A]" : "text-[#FF8C38]"}`}>
                    {inb.subject}
                  </p>
                  <p className={`text-[11px] line-clamp-2 mt-0.5 ${isDay ? "text-stone-700" : "text-stone-300"}`}>
                    {inb.body}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {!inb.isRead && (
                    <button
                      type="button"
                      onClick={() => handleMarkInboundRead(inb.id, true)}
                      className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold border cursor-pointer ${
                        isDay
                          ? "bg-stone-100 border-stone-300 text-black hover:bg-stone-200"
                          : "bg-zinc-800 border-zinc-700 text-stone-200 hover:bg-zinc-700"
                      }`}
                    >
                      Mark Read
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleReplyToInbound(inb)}
                    className="px-2.5 py-1.5 rounded-lg text-[10px] font-black bg-[#EA580C] hover:bg-[#C84A0A] text-white cursor-pointer"
                  >
                    Reply
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUCCESS & ERROR ALERTS */}
      {successAlert && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-600/70 text-emerald-200 text-xs flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-semibold">{successAlert}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessAlert(null)}
            className="text-emerald-400 hover:text-white font-bold text-sm ml-3"
          >
            ✕
          </button>
        </div>
      )}

      {errorAlert && (
        <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-700 text-red-200 text-xs flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-semibold">{errorAlert}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorAlert(null)}
            className="text-red-400 hover:text-white font-bold text-sm ml-3"
          >
            ✕
          </button>
        </div>
      )}

      {/* SENT EMAILS VIEW */}
      {activeTab === "sent" && (
        <div
          className={`p-4 sm:p-5 rounded-2xl border space-y-3 ${
            isDay
              ? "bg-white border-stone-300 text-black shadow-2xs"
              : "bg-zinc-900 border-zinc-800 text-stone-100"
          }`}
        >
          <div className="flex items-center justify-between border-b pb-3 border-stone-200 dark:border-zinc-800">
            <div>
              <h3 className="text-sm font-black">📤 Sent Emails ({messages.length})</h3>
              <p className={`text-[11px] font-bold ${isDay ? "text-stone-600" : "text-stone-400"}`}>
                Every outbound email sent from your Pitmaster Dashboard
              </p>
            </div>
            <button
              type="button"
              onClick={() => setLocalTabOverride("compose")}
              className="px-3 py-1.5 rounded-lg text-xs font-black bg-[#EA580C] hover:bg-[#C84A0A] text-white cursor-pointer"
            >
              + New Email
            </button>
          </div>
          {messages.length === 0 ? (
            <p className={`text-xs py-8 text-center font-bold ${isDay ? "text-stone-500" : "text-stone-400"}`}>
              No sent emails logged yet. Click &ldquo;+ New Email&rdquo; to send your first message.
            </p>
          ) : (
            <div className="space-y-2.5 max-h-[560px] overflow-y-auto">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                    isDay ? "bg-stone-50 border-stone-200" : "bg-zinc-950/70 border-zinc-800"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="font-black">To: {msg.recipient}</span>
                    <span className={`text-[10px] font-bold ${isDay ? "text-stone-600" : "text-stone-400"}`}>
                      From {msg.sender} • {new Date(msg.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className={`font-black text-[11px] ${isDay ? "text-[#C84A0A]" : "text-[#FF8C38]"}`}>
                    {msg.subject}
                  </p>
                  <p className={`whitespace-pre-wrap text-[11px] leading-relaxed ${isDay ? "text-stone-800" : "text-stone-300"}`}>
                    {msg.body}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2-COLUMN EMAIL CONSOLE (MATCHING BLIND COOK EXACT LAYOUT) */}
      {activeTab !== "sent" && (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* LEFT COLUMN: CLIENT ROSTER & FILTER TABS (lg:col-span-5) */}
        {activeTab === "inbox" && (
        <div className="lg:col-span-5 space-y-3">
          {/* Search Box */}
          <div className="relative">
            <svg
              className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search client name, email, or event..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs focus:outline-none border transition-colors ${
                isDay
                  ? "bg-white border-stone-400 text-black font-bold placeholder:text-stone-600 focus:border-[#FF7A00]"
                  : "bg-[#141210] border-zinc-800 text-white placeholder:text-zinc-500 focus:border-[#FF7A00]"
              }`}
            />
          </div>

          {/* Filter Pills (All, Needs Reply, Replied) */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setFilterTab("all")}
              className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                filterTab === "all"
                  ? "bg-[#EA580C] text-white shadow-xs"
                  : isDay
                  ? "bg-stone-200 text-black hover:bg-stone-300"
                  : "bg-zinc-850 text-stone-400 hover:text-white hover:bg-zinc-800"
              }`}
            >
              All ({leads.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterTab("needs-reply")}
              className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                filterTab === "needs-reply"
                  ? "bg-[#EA580C] text-white shadow-xs"
                  : isDay
                  ? "bg-stone-200 text-black hover:bg-stone-300"
                  : "bg-zinc-850 text-stone-400 hover:text-white hover:bg-zinc-800"
              }`}
            >
              Needs Reply ({needsReplyCount})
            </button>
            <button
              type="button"
              onClick={() => setFilterTab("replied")}
              className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                filterTab === "replied"
                  ? "bg-[#EA580C] text-white shadow-xs"
                  : isDay
                  ? "bg-stone-200 text-black hover:bg-stone-300"
                  : "bg-zinc-850 text-stone-400 hover:text-white hover:bg-zinc-800"
              }`}
            >
              Replied ({repliedCount})
            </button>
          </div>

          {/* Scrollable Client Cards List */}
          <div className="space-y-2 max-h-[660px] overflow-y-auto pr-1">
            {filteredLeads.length === 0 ? (
              <div
                className={`p-8 text-center rounded-2xl border ${
                  isDay ? "bg-white border-stone-300 text-black font-bold" : "bg-[#141210] border-zinc-800 text-stone-400"
                } text-xs`}
              >
                No client inquiries found.
              </div>
            ) : (
              filteredLeads.map((lead) => {
                const isSelected = lead.id === currentLead?.id;
                const statusStyle = getStatusBadge(lead.status, isDay);

                return (
                  <div
                    key={lead.id}
                    onClick={() => handleSelectLead(lead)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer text-xs space-y-1.5 ${
                      isSelected
                        ? isDay
                          ? "bg-[#FAF7F2] border-[#FF7A00] ring-2 ring-[#FF7A00]/25 shadow-md"
                          : "bg-[#1A1613] border-[#FF7A00] ring-2 ring-[#FF7A00]/30 shadow-md"
                        : isDay
                        ? "bg-white border-stone-300 hover:border-amber-400 shadow-2xs"
                        : "bg-[#141210] border-zinc-800/90 hover:border-zinc-700"
                    }`}
                  >
                    {/* Top row: Client name + status badge */}
                    <div className="flex items-center justify-between gap-2">
                      <span className={`font-black text-sm truncate ${isDay ? "text-black" : "text-white"}`}>
                        {lead.name}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold border uppercase tracking-wider shrink-0 ${statusStyle.badgeClass}`}
                      >
                        {statusStyle.label}
                      </span>
                    </div>

                    {/* Contact subline (crisp black in day mode) */}
                    <div className={`flex items-center justify-between text-[11px] font-extrabold ${isDay ? "text-black" : "text-stone-300"}`}>
                      <span className="truncate">{lead.email}</span>
                      <span className="shrink-0 ml-1 font-black">{lead.phone}</span>
                    </div>

                    {/* Event & Guests */}
                    <div className={`flex items-center justify-between text-[11px] font-black pt-1 border-t ${isDay ? "border-stone-200" : "border-zinc-800/80"}`}>
                      <span className="text-[#EA580C]">
                        {lead.eventType || "Catering"} • {lead.guestCount} guests
                      </span>
                      <span className={`font-black ${isDay ? "text-black" : "text-stone-300"}`}>
                        {lead.eventDate || "Date Pending"}
                      </span>
                    </div>

                    {/* Notes snippet */}
                    {lead.notes && (
                      <p className={`text-[11px] font-bold line-clamp-2 leading-relaxed ${isDay ? "text-black" : "text-stone-300"}`}>
                        {lead.notes}
                      </p>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
        )}

        {/* RIGHT COLUMN: ACTIVE THREAD & EMAIL COMPOSER */}
        <div className={activeTab === "inbox" ? "lg:col-span-7" : "lg:col-span-12"}>
          {activeTab === "compose" && leads.length > 0 && (
            <div className="mb-3">
              <label className={`text-[11px] font-black block mb-1 ${isDay ? "text-black" : "text-stone-200"}`}>
                Replying to:
              </label>
              <select
                value={currentLead?.id ?? ""}
                onChange={(e) => {
                  const picked = leads.find((l) => l.id === e.target.value);
                  if (picked) handleSelectLead(picked);
                }}
                className={`w-full text-sm h-12 px-3 rounded-xl border font-bold focus:outline-none ${
                  isDay
                    ? "bg-white border-stone-400 text-black focus:border-[#FF7A00]"
                    : "bg-zinc-900 border-zinc-700 text-white focus:border-[#FF7A00]"
                }`}
              >
                {!currentLead && <option value="">Choose a customer…</option>}
                {leads.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          {!currentLead && activeTab !== "compose" ? (
            <div
              className={`p-12 text-center rounded-2xl border ${
                isDay ? "bg-white border-stone-300" : "bg-[#141210] border-zinc-800"
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-[#FF7A00]/15 text-[#FF7A00] flex items-center justify-center mx-auto mb-3 text-xl">
                ✉️
              </div>
              <h3 className={`text-base font-extrabold ${isDay ? "text-black" : "text-white"}`}>
                No Inquiry Selected
              </h3>
              <p className={`text-xs mt-1 font-bold ${isDay ? "text-black" : "text-stone-400"}`}>
                Select an inquiry from the left column to view the thread and write a personalized reply.
              </p>
            </div>
          ) : (
            <div
              className={`rounded-2xl border shadow-sm overflow-hidden ${
                isDay ? "bg-white border-stone-300" : "bg-[#141210] border-zinc-800"
              }`}
            >
              {/* Header: Conversation with [Client] + View Full Lead */}
              <div
                className={`p-4 sm:p-5 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ${
                  isDay ? "bg-stone-50 border-stone-200" : "bg-[#181512] border-zinc-800"
                }`}
              >
                {currentLead ? (
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className={`text-base font-black ${isDay ? "text-black" : "text-white"}`}>
                      Conversation with {currentLead.name}
                    </h3>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold border uppercase tracking-wider ${
                        getStatusBadge(currentLead.status, isDay).badgeClass
                      }`}
                    >
                      {getStatusBadge(currentLead.status, isDay).label}
                    </span>
                  </div>

                  <div className={`flex items-center gap-3 text-xs mt-1 font-black flex-wrap ${isDay ? "text-black" : "text-stone-300"}`}>
                    <span>✉️ {currentLead.email}</span>
                    <a
                      href={`tel:${currentLead.phone}`}
                      className="text-[#EA580C] hover:underline font-black flex items-center gap-1"
                    >
                      📞 {currentLead.phone}
                    </a>
                    {currentLead.eventDate && (
                      <span className={`font-black ${isDay ? "text-black" : "text-stone-300"}`}>
                        📅 {currentLead.eventDate}
                      </span>
                    )}
                  </div>
                </div>
                ) : (
                <div>
                  <h3 className={`text-base font-black ${isDay ? "text-black" : "text-white"}`}>
                    ✉️ Compose New Email
                  </h3>
                  <p className={`text-xs mt-0.5 font-bold ${isDay ? "text-stone-600" : "text-stone-400"}`}>
                    Send directly from info@allthesmokecatering.com or marion@allthesmokecatering.com
                  </p>
                </div>
                )}

                {currentLead && (
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setFullLeadModalOpen(true)}
                    className={`h-7 px-2.5 rounded-lg border text-xs font-black flex items-center gap-1 transition-all cursor-pointer ${
                      isDay
                        ? "bg-white border-stone-400 text-black hover:bg-stone-100"
                        : "bg-zinc-800 border-zinc-700 text-stone-200 hover:bg-zinc-700"
                    }`}
                  >
                    <svg className="w-3.5 h-3.5 text-[#FF7A00]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                    <span>View Full Lead</span>
                  </button>
                </div>
                )}
              </div>

              {/* Main Body: Conversation Thread Container & Composer */}
              <div className="p-4 sm:p-5 space-y-4">
                
                {/* Scrollable Conversation Thread Container */}
                {activeTab === "inbox" && currentLead && (
                <div
                  className={`p-4 rounded-xl border space-y-3.5 max-h-[300px] overflow-y-auto ${
                    isDay ? "bg-stone-50 border-stone-200" : "bg-zinc-900/60 border-zinc-800"
                  }`}
                >
                  {/* 1. Client Inbound Inquiry Bubble */}
                  <div
                    className={`p-3.5 rounded-xl border text-xs space-y-2 shadow-2xs ${
                      isDay
                        ? "bg-white border-stone-300 text-black font-medium"
                        : "bg-[#181512] border-zinc-750 text-stone-200"
                    }`}
                  >
                    <div className={`flex items-center justify-between border-b pb-2 ${isDay ? "border-stone-200" : "border-zinc-800"}`}>
                      <span className={`font-black flex items-center gap-1.5 ${isDay ? "text-[#C84A0A]" : "text-[#FF7A00]"}`}>
                        📥 Customer Inquiry ({currentLead.name})
                      </span>
                      <span className={`text-[10px] font-black ${isDay ? "text-black" : "text-stone-400"}`}>
                        {currentLead.createdAt ? new Date(currentLead.createdAt).toLocaleDateString() : "New Lead"}
                      </span>
                    </div>

                    <div className={`grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] py-1 font-black ${isDay ? "text-black" : "text-stone-200"}`}>
                      <div>
                        <strong>Event:</strong> {currentLead.eventType || "Private Catering"}
                      </div>
                      <div>
                        <strong>Guests:</strong> {currentLead.guestCount}
                      </div>
                      <div>
                        <strong>Date:</strong> {currentLead.eventDate || "Pending"}
                      </div>
                    </div>

                    {currentLead.packageName && (
                      <div className={`text-[11px] font-black ${isDay ? "text-[#C84A0A]" : "text-[#FF7A00]"}`}>
                        Package: {currentLead.packageName}
                      </div>
                    )}

                    <div className={`whitespace-pre-wrap leading-relaxed text-[11px] pt-1 font-bold ${isDay ? "text-black" : "text-stone-300"}`}>
                      {currentLead.notes || "No message body included in intake."}
                    </div>
                  </div>

                  {/* 2. Inbound Customer Replies for This Lead */}
                  {currentLeadInbound.map((inb) => (
                    <div
                      key={`inb-${inb.id}`}
                      className={`p-3.5 rounded-xl border text-xs space-y-2 mr-4 sm:mr-8 ${
                        isDay
                          ? "bg-emerald-50/90 border-emerald-300 text-black shadow-2xs"
                          : "bg-emerald-950/30 border-emerald-500/40 text-stone-200"
                      }`}
                    >
                      <div className={`flex items-center justify-between border-b pb-2 ${isDay ? "border-emerald-200" : "border-zinc-800"}`}>
                        <span className={`font-black flex items-center gap-1.5 ${isDay ? "text-emerald-800" : "text-emerald-400"}`}>
                          📩 {inb.senderName} ({inb.senderEmail})
                        </span>
                        <span className={`text-[10px] font-black ${isDay ? "text-black" : "text-stone-400"}`}>
                          {new Date(inb.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className={`font-black text-[11px] ${isDay ? "text-emerald-900" : "text-emerald-300"}`}>
                        Subject: {inb.subject}
                      </p>
                      <div className={`whitespace-pre-wrap leading-relaxed text-[11px] font-bold ${isDay ? "text-black" : "text-stone-200"}`}>
                        {inb.body}
                      </div>
                    </div>
                  ))}

                  {/* 3. Outbound Pitmaster Marion Bolden Replies */}
                  {currentLeadMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-3.5 rounded-xl border text-xs space-y-2 ml-4 sm:ml-8 ${
                        isDay
                          ? "bg-amber-50/90 border-amber-300 text-black shadow-2xs"
                          : "bg-[#251C15] border-[#FF7A00]/40 text-stone-200"
                      }`}
                    >
                      <div className={`flex items-center justify-between border-b pb-2 ${isDay ? "border-amber-200" : "border-zinc-800"}`}>
                        <span className={`font-black flex items-center gap-1.5 ${isDay ? "text-[#C84A0A]" : "text-[#FF7A00]"}`}>
                          📤 Marion Bolden (info@allthesmokecatering.com)
                        </span>
                        <span className={`text-[10px] font-black ${isDay ? "text-black" : "text-stone-400"}`}>
                          {new Date(msg.createdAt).toLocaleString()}
                        </span>
                      </div>

                      {msg.subject && (
                        <p className={`font-black text-[11px] ${isDay ? "text-[#C84A0A]" : "text-[#FF7A00]"}`}>
                          Subject: {msg.subject}
                        </p>
                      )}

                      <div className={`whitespace-pre-wrap leading-relaxed text-[11px] font-bold ${isDay ? "text-black" : "text-stone-200"}`}>
                        {msg.body}
                      </div>

                      <div className={`pt-1 flex items-center justify-between text-[10px] font-black border-t ${isDay ? "text-black border-amber-200" : "text-stone-300 border-zinc-800"}`}>
                        <span className="font-black">Status: ✓ Dispatched via Brevo domain mail</span>
                        <span className="italic font-bold">Client replies arrive in inbox</span>
                      </div>
                    </div>
                  ))}

                  {currentLeadMessages.length === 0 && (
                    <p className={`text-[11px] text-center py-1.5 italic font-bold ${isDay ? "text-black" : "text-stone-300"}`}>
                      No replies sent yet to this client. Choose a 1-tap template below or compose your personalized reply.
                    </p>
                  )}
                </div>
                )}

                {activeTab === "compose" && (
                <>
                {/* Free-Form Recipient + Sender Selector (send to any email or current lead) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className={`text-[11px] font-black block mb-1 ${isDay ? "text-black" : "text-stone-200"}`}>
                      From Address:
                    </label>
                    <select
                      value={senderAlias}
                      onChange={(e) => setSenderAlias(e.target.value as any)}
                      className={`w-full text-xs h-8 px-2.5 rounded-lg border font-bold focus:outline-none ${
                        isDay
                          ? "bg-white border-stone-400 text-black focus:border-[#FF7A00]"
                          : "bg-zinc-900 border-zinc-700 text-white focus:border-[#FF7A00]"
                      }`}
                    >
                      <option value="info@allthesmokecatering.com">info@allthesmokecatering.com</option>
                      <option value="marion@allthesmokecatering.com">marion@allthesmokecatering.com</option>
                    </select>
                  </div>
                  <div>
                    <label className={`text-[11px] font-black block mb-1 ${isDay ? "text-black" : "text-stone-200"}`}>
                      To (Email Address):
                    </label>
                    <input
                      type="email"
                      value={customRecipientEmail}
                      onChange={(e) => setCustomRecipientEmail(e.target.value)}
                      placeholder={currentLead?.email || "customer@example.com"}
                      className={`w-full text-xs h-8 px-3 rounded-lg border font-bold focus:outline-none ${
                        isDay
                          ? "bg-white border-stone-400 text-black placeholder:text-stone-500 focus:border-[#FF7A00]"
                          : "bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-[#FF7A00]"
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`text-[11px] font-black block mb-1 ${isDay ? "text-black" : "text-stone-200"}`}>
                      Recipient Name (Optional):
                    </label>
                    <input
                      type="text"
                      value={customRecipientName}
                      onChange={(e) => setCustomRecipientName(e.target.value)}
                      placeholder={currentLead?.name || "Client or Vendor Name"}
                      className={`w-full text-xs h-8 px-3 rounded-lg border font-bold focus:outline-none ${
                        isDay
                          ? "bg-white border-stone-400 text-black placeholder:text-stone-500 focus:border-[#FF7A00]"
                          : "bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-[#FF7A00]"
                      }`}
                    />
                  </div>
                </div>

                {/* 1-Tap Catering Reply Templates */}
                <div className="space-y-1.5">
                  <label className={`text-[11px] font-black block ${isDay ? "text-black" : "text-stone-200"}`}>
                    ⚡ 1-Tap Catering Reply Templates:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                    {QUICK_REPLY_TEMPLATES.map((tmpl) => (
                      <button
                        key={tmpl.id}
                        type="button"
                        onClick={() => {
                          const targetLead: PitmasterLead = currentLead || {
                            id: "",
                            ticketId: "",
                            name: customRecipientName || "there",
                            email: customRecipientEmail,
                            phone: "",
                            eventType: "Catering",
                            guestCount: 0,
                            eventDate: "",
                            packageName: "",
                            serviceStyle: "",
                            deliveryAddress: "",
                            notes: "",
                            status: "new",
                            createdAt: "",
                            source: "",
                            estimatedTotal: 0,
                          };
                          setReplyBody(tmpl.generateBody(targetLead));
                          setReplySubject(tmpl.generateSubject(targetLead));
                        }}
                        className={`h-auto py-2 px-2 rounded-xl border text-[11px] flex flex-col items-center justify-center text-center font-bold leading-tight transition-all cursor-pointer ${
                          isDay
                            ? "bg-stone-50 border-stone-300 text-black hover:border-[#FF7A00] hover:bg-amber-50"
                            : "bg-zinc-850 border-zinc-700 text-stone-200 hover:border-[#FF7A00] hover:bg-zinc-800"
                        }`}
                        title={`Insert "${tmpl.name}" template`}
                      >
                        <span className={`font-black ${isDay ? "text-[#C84A0A]" : "text-[#FF7A00]"}`}>{tmpl.badge}</span>
                        <span className={`text-[10px] font-black ${isDay ? "text-black" : "text-stone-300"}`}>{tmpl.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Reply Composer Form */}
                <div className="space-y-2.5">
                  {/* Subject Line Input */}
                  <div>
                    <label className={`text-[11px] font-black block mb-1 ${isDay ? "text-black" : "text-stone-200"}`}>
                      Subject Line:
                    </label>
                    <input
                      type="text"
                      value={replySubject}
                      onChange={(e) => setReplySubject(e.target.value)}
                      placeholder={`Re: Catering Inquiry for ${customRecipientName || currentLead?.name || "Client"}`}
                      className={`w-full text-xs h-8 px-3 rounded-lg border font-bold focus:outline-none transition-colors ${
                        isDay
                          ? "bg-white border-stone-400 text-black placeholder:text-stone-600 focus:border-[#FF7A00]"
                          : "bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-[#FF7A00]"
                      }`}
                    />
                  </div>

                  {/* Message Body Textarea (Starts EMPTY so Marion can write freely!) */}
                  <div>
                    <label className={`text-[11px] font-black block mb-1 ${isDay ? "text-black" : "text-stone-200"}`}>
                      Message Body:
                    </label>
                    <textarea
                      rows={5}
                      value={replyBody}
                      onChange={(e) => setReplyBody(e.target.value)}
                      placeholder={`Type your personalized email to ${customRecipientName || currentLead?.name || "recipient"} here...`}
                      className={`w-full p-3 rounded-xl border text-xs sm:text-sm font-sans font-semibold leading-relaxed focus:outline-none transition-colors ${
                        isDay
                          ? "bg-white border-stone-400 text-black placeholder:text-stone-600 focus:border-[#FF7A00]"
                          : "bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-[#FF7A00]"
                      }`}
                    />
                  </div>

                  {/* Dispatch Banner & Action Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 pt-1">
                    <div className={`flex items-center gap-1.5 text-[11px] font-bold ${isDay ? "text-black" : "text-stone-300"}`}>
                      <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <span>
                        Dispatches from <strong>info@allthesmokecatering.com</strong>. Client replies route directly to your inbox.
                      </span>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      {replyBody && (
                        <button
                          type="button"
                          onClick={() => setReplyBody("")}
                          className={`h-8 px-3 rounded-lg text-xs font-black transition-colors cursor-pointer ${
                            isDay ? "text-black hover:text-stone-700" : "text-stone-200 hover:text-white"
                          }`}
                        >
                          Clear
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={handleSendReply}
                        disabled={isSending || !replyBody.trim()}
                        className="bg-[#EA580C] hover:bg-[#C84A0A] disabled:opacity-50 text-white font-extrabold text-xs h-8 px-4 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
                      >
                        {isSending ? (
                          <>
                            <svg className="animate-spin h-3.5 w-3.5 text-white" viewBox="0 0 24 24" fill="none">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4} />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                            </svg>
                            <span>Sending Reply...</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-3.5 h-3.5 text-amber-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                            <span>Send Direct Reply</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                </div>
                </>
                )}

              </div>

            </div>
          )}
        </div>

      </div>
      )}

      {/* FULL LEAD BLOW-UP POPUP MODAL */}
      {fullLeadModalOpen && currentLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className={`w-full max-w-2xl rounded-3xl border shadow-2xl p-6 sm:p-7 space-y-5 max-h-[90vh] overflow-y-auto ${
              isDay ? "bg-white border-stone-300 text-black" : "bg-[#141210] border-zinc-800 text-white"
            }`}
          >
            {/* Header */}
            <div className={`flex items-start justify-between gap-3 border-b pb-4 ${isDay ? "border-stone-200" : "border-zinc-800"}`}>
              <div>
                <span className="text-[10px] uppercase font-black tracking-widest text-[#FF7A00]">
                  Ticket #{currentLead.ticketId} • Lead Specifications
                </span>
                <h3 className={`text-xl sm:text-2xl font-black mt-0.5 ${isDay ? "text-black" : "text-white"}`}>
                  {currentLead.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setFullLeadModalOpen(false)}
                className={`w-8 h-8 rounded-full font-bold flex items-center justify-center text-sm cursor-pointer transition-colors ${
                  isDay ? "bg-stone-200 hover:bg-stone-300 text-black" : "bg-zinc-800 hover:bg-zinc-700 text-white"
                }`}
              >
                ✕
              </button>
            </div>

            {/* Quick Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className={`p-3 rounded-xl border ${isDay ? "bg-stone-50 border-stone-300" : "bg-zinc-900 border-zinc-800"}`}>
                <span className={`text-[10px] uppercase font-black block ${isDay ? "text-black" : "text-stone-400"}`}>Status</span>
                <span className={`text-xs font-black capitalize mt-0.5 block ${isDay ? "text-black" : "text-white"}`}>
                  {currentLead.status}
                </span>
              </div>
              <div className={`p-3 rounded-xl border ${isDay ? "bg-stone-50 border-stone-300" : "bg-zinc-900 border-zinc-800"}`}>
                <span className={`text-[10px] uppercase font-black block ${isDay ? "text-black" : "text-stone-400"}`}>Guests</span>
                <span className={`text-xs font-black mt-0.5 block ${isDay ? "text-black" : "text-white"}`}>
                  {currentLead.guestCount} Guests
                </span>
              </div>
              <div className={`p-3 rounded-xl border ${isDay ? "bg-stone-50 border-stone-300" : "bg-zinc-900 border-zinc-800"}`}>
                <span className={`text-[10px] uppercase font-black block ${isDay ? "text-black" : "text-stone-400"}`}>Event Date</span>
                <span className={`text-xs font-black mt-0.5 block ${isDay ? "text-black" : "text-white"}`}>
                  {currentLead.eventDate || "TBD"}
                </span>
              </div>
              <div className={`p-3 rounded-xl border ${isDay ? "bg-stone-50 border-stone-300" : "bg-zinc-900 border-zinc-800"}`}>
                <span className={`text-[10px] uppercase font-black block ${isDay ? "text-black" : "text-stone-400"}`}>Event Type</span>
                <span className={`text-xs font-black capitalize mt-0.5 block ${isDay ? "text-black" : "text-white"}`}>
                  {currentLead.eventType || "Private"}
                </span>
              </div>
            </div>

            {/* Contact Information */}
            <div className={`p-4 rounded-xl border space-y-1.5 ${isDay ? "bg-stone-50 border-stone-300" : "bg-zinc-900 border-zinc-800"}`}>
              <div className={`text-xs font-black flex items-center justify-between ${isDay ? "text-black" : "text-white"}`}>
                <span>Contact Details</span>
                <span className="text-[#EA580C] text-[11px] font-mono font-bold">ID: {currentLead.id}</span>
              </div>
              <div className={`text-xs font-bold ${isDay ? "text-black" : "text-stone-200"}`}>
                <strong className={isDay ? "text-black font-black" : "text-white font-bold"}>Email:</strong> {currentLead.email}
              </div>
              <div className={`text-xs font-bold ${isDay ? "text-black" : "text-stone-200"}`}>
                <strong className={isDay ? "text-black font-black" : "text-white font-bold"}>Phone:</strong> {currentLead.phone}
              </div>
              {currentLead.deliveryAddress && (
                <div className={`text-xs font-bold ${isDay ? "text-black" : "text-stone-200"}`}>
                  <strong className={isDay ? "text-black font-black" : "text-white font-bold"}>Venue / Location:</strong> {currentLead.deliveryAddress}
                </div>
              )}
              {currentLead.packageName && (
                <div className={`text-xs font-bold ${isDay ? "text-black" : "text-stone-200"}`}>
                  <strong className={isDay ? "text-black font-black" : "text-white font-bold"}>Smoker Package:</strong> {currentLead.packageName}
                </div>
              )}
            </div>

            {/* Event Vision / Notes */}
            <div className="space-y-1.5">
              <span className={`text-[11px] font-black uppercase tracking-wider block ${isDay ? "text-black" : "text-stone-300"}`}>
                Quote &amp; Event Intake Specifications:
              </span>
              <div
                className={`p-4 rounded-xl border max-h-[200px] overflow-y-auto leading-relaxed text-xs whitespace-pre-wrap font-sans font-bold ${
                  isDay ? "bg-white border-stone-400 text-black" : "bg-zinc-900 border-zinc-800 text-stone-200"
                }`}
              >
                {currentLead.notes || "No special notes recorded."}
              </div>
            </div>

            {/* Modal Bottom Buttons */}
            <div className={`flex items-center justify-between gap-3 pt-3 border-t ${isDay ? "border-stone-200" : "border-zinc-800"}`}>
              <button
                type="button"
                onClick={() => handleCopyLeadSpecs(currentLead)}
                className={`h-8 px-3 rounded-lg border text-xs font-black transition-all cursor-pointer ${
                  isDay ? "bg-stone-100 hover:bg-stone-200 border-stone-400 text-black" : "bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-white"
                }`}
              >
                {copiedLink ? "✓ Copied Details!" : "📋 Copy Details"}
              </button>

              <button
                type="button"
                onClick={() => setFullLeadModalOpen(false)}
                className="h-8 px-4 rounded-lg bg-[#EA580C] hover:bg-[#C84A0A] text-white text-xs font-black cursor-pointer shadow-xs"
              >
                Close Full Slip
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
