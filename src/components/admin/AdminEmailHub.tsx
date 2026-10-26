"use client";

import React, { useState, useEffect } from "react";
import { PitmasterLead } from "./AdminLeadsPipeline";

interface SentMessage {
  id: string;
  leadId: string;
  sender: string;
  recipient: string;
  subject: string;
  body: string;
  status: string;
  createdAt: string;
}

interface AdminEmailHubProps {
  theme?: "day" | "night" | "dark" | "butcher-paper";
}

const EMAIL_TEMPLATES = [
  {
    id: "quote-proposal",
    name: "1. Initial Smokehouse Quote & Menu Proposal",
    subject: "Your Live-Fire BBQ Catering Proposal | All The Smoke",
    body: `Thank you for considering All The Smoke BBQ & Catering for your upcoming event!

We reviewed your requested guest count and menu preferences. Attached is your customized proposal featuring our signature slow-smoked hardwood meats, scratch-made sides, and heated commissary dispatch.

Please let us know if you would like to adjust the meat selections (such as our prime brisket or hardwood turkey chops) or if you would like to reserve this smoke date.

Warm regards,
Marion Bolden | Pitmaster`,
  },
  {
    id: "deposit-request",
    name: "2. Smoke Schedule Availability & Deposit Request",
    subject: "Locking In Your Date on the Smoke Schedule | All The Smoke",
    body: `Great news! Our pitmaster trailer rig has availability for your requested date.

To officially lock in your date on our commissary smoke schedule and guarantee whole-wood supply, we require a 25% deposit. We accept instant transfer via Zelle or secure card payment.

Let us know when you are ready to proceed and we will send your official invoice.

Respectfully,
Marion Bolden | (773) 707-9988`,
  },
  {
    id: "rig-clearance",
    name: "3. Venue Smoker Rig Parking & Access Check",
    subject: "Venue Logistics & Smoker Rig Clearance Check | All The Smoke",
    body: `We are finalizing logistics for your event date.

Because our live-fire offset trailer rig is large, we want to confirm:
1. Is there flat driveway or alleyway clearance for our trailer rig?
2. Are there any low-hanging trees or tight gates we should be mindful of?
3. What is the preferred load-in and serving schedule for your guests?

Looking forward to bringing the smoke!

All The Smoke Pitmaster Team`,
  },
  {
    id: "google-review",
    name: "4. Post-Event Google Review & Feedback",
    subject: "Thank You from All The Smoke BBQ! How was the brisket?",
    body: `Thank you for having All The Smoke cater your special event! It was an absolute honor feeding your guests.

If you enjoyed the live-fire smokehouse experience, would you take 60 seconds to leave us a quick 5-star Google review? As an independent Chicago smokehouse, your feedback means the world to our crew.

Thank you again, and we hope to smoke for you again soon!

Marion Bolden & The All The Smoke Crew`,
  },
];

export function AdminEmailHub({ theme = "night" }: AdminEmailHubProps) {
  const isDay = theme === "day" || theme === "butcher-paper";

  const [leads, setLeads] = useState<PitmasterLead[]>([]);
  const [messages, setMessages] = useState<SentMessage[]>([]);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "unreplied" | "replied">("all");

  // Composer Form
  const [senderEmail, setSenderEmail] = useState<string>("info@allthesmokecatering.com");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [clientName, setClientName] = useState("");
  const [subject, setSubject] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [successAlert, setSuccessAlert] = useState<string | null>(null);
  const [errorAlert, setErrorAlert] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Load leads and sent messages from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const rawLeads = localStorage.getItem("ats_pitmaster_leads");
        if (rawLeads) {
          const parsed = JSON.parse(rawLeads);
          setLeads(parsed);
          if (parsed.length > 0 && !selectedLeadId) {
            handleSelectLead(parsed[0]);
          }
        }

        const rawMsgs = localStorage.getItem("ats_admin_sent_messages");
        if (rawMsgs) {
          setMessages(JSON.parse(rawMsgs));
        }
      } catch (err) {
        console.error("Failed to load email hub data:", err);
      }
    }
  }, []);

  const handleSelectLead = (lead: PitmasterLead) => {
    setSelectedLeadId(lead.id);
    setRecipientEmail(lead.email || "");
    setClientName(lead.name || "");
    setSubject(`Regarding Your Catering Inquiry #${lead.ticketId} | All The Smoke`);
    setMessageContent(`Hi ${lead.name},\n\nThank you for reaching out to All The Smoke BBQ regarding your event for ${lead.guestCount} guests on ${lead.eventDate}.\n\nMarion Bolden has reviewed your inquiry for ${lead.packageName} and we are ready to assist with your live-fire menu.\n\nWarm regards,\nMarion Bolden | All The Smoke BBQ`);
  };

  const handleApplyTemplate = (templateId: string) => {
    const tmpl = EMAIL_TEMPLATES.find((t) => t.id === templateId);
    if (!tmpl) return;
    setSubject(tmpl.subject);
    setMessageContent(tmpl.body);
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientEmail || !messageContent) return;

    setIsSending(true);
    setErrorAlert(null);
    setSuccessAlert(null);

    try {
      const res = await fetch("/api/admin/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId: selectedLeadId,
          recipientEmail,
          clientName,
          subject,
          messageContent,
          senderEmail,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to dispatch email via Brevo");
      }

      const newMsg: SentMessage = data.message || {
        id: "msg-" + Date.now(),
        leadId: selectedLeadId || "",
        sender: senderEmail,
        recipient: recipientEmail,
        subject,
        body: messageContent,
        status: "sent",
        createdAt: new Date().toISOString(),
      };

      const updated = [newMsg, ...messages];
      setMessages(updated);
      if (typeof window !== "undefined") {
        localStorage.setItem("ats_admin_sent_messages", JSON.stringify(updated));
      }

      setSuccessAlert(`Email successfully dispatched via Brevo from ${senderEmail} to ${recipientEmail}!`);
    } catch (err: any) {
      setErrorAlert(err.message || "Failed to send email. Check Brevo API status.");
    } finally {
      setIsSending(false);
    }
  };

  // Selected lead object
  const activeLead = leads.find((l) => l.id === selectedLeadId);
  const activeLeadReplies = messages.filter(
    (m) => m.leadId === selectedLeadId || (activeLead && m.recipient === activeLead.email)
  );

  // Filtered leads for inbox list
  const filteredLeads = leads.filter((l) => {
    const q = searchQuery.toLowerCase();
    const matchQuery =
      !q ||
      l.name.toLowerCase().includes(q) ||
      l.email.toLowerCase().includes(q) ||
      l.ticketId.toLowerCase().includes(q);
    if (!matchQuery) return false;

    const repliesCount = messages.filter(
      (m) => m.leadId === l.id || m.recipient === l.email
    ).length;

    if (statusFilter === "unreplied") return repliesCount === 0;
    if (statusFilter === "replied") return repliesCount > 0;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* 1. TAB HEADER BANNER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase font-extrabold tracking-widest text-[#FF7A00]">
              Direct Client Messaging
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              Brevo API Connected
            </span>
          </div>
          <h2
            className={`font-display text-2xl sm:text-3xl font-bold tracking-tight ${
              isDay ? "text-[#1C1917]" : "text-white"
            }`}
          >
            Client Email Inbox &amp; Brevo Dispatch
          </h2>
          <p className={`text-xs sm:text-sm mt-0.5 ${isDay ? "text-stone-600" : "text-zinc-400"}`}>
            Send branded emails from <strong>info@</strong>, <strong>marion@</strong>, or <strong>support@allthesmokecatering.com</strong>. Client replies route directly to your inbox.
          </p>
        </div>

        {/* Sender Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`px-3 py-1 rounded-xl text-xs font-mono font-bold border ${
              isDay
                ? "bg-[#FAF8F5] border-[#D8CEC1] text-stone-800"
                : "bg-zinc-900 border-zinc-800 text-stone-300"
            }`}
          >
            {leads.length} Inquiries • {messages.length} Sent
          </span>
        </div>
      </div>

      {/* 2. SUCCESS / ERROR ALERTS */}
      {successAlert && (
        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-600/70 text-emerald-200 text-xs sm:text-sm flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2.5">
            <svg className="w-5 h-5 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span>{successAlert}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessAlert(null)}
            className="text-emerald-400 hover:text-white font-bold ml-4"
          >
            ✕
          </button>
        </div>
      )}

      {errorAlert && (
        <div className="p-4 rounded-2xl bg-red-950/80 border border-red-700 text-red-200 text-xs sm:text-sm flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2.5">
            <svg className="w-5 h-5 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{errorAlert}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorAlert(null)}
            className="text-red-400 hover:text-white font-bold ml-4"
          >
            ✕
          </button>
        </div>
      )}

      {/* 3. MAIN 2-COLUMN RESPONSIVE MESSAGES CONSOLE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: CLIENT INQUIRY THREADS LIST (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          {/* Search & Filter Header */}
          <div
            className={`p-3.5 rounded-2xl border space-y-3 ${
              isDay ? "bg-[#FFFFFF] border-[#E2DACF] shadow-sm" : "bg-[#141417] border-zinc-800"
            }`}
          >
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
                placeholder="Search client name, email, or ticket..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-9 pr-3 py-1.5 rounded-xl text-xs focus:outline-none border transition-colors ${
                  isDay
                    ? "bg-[#FAF8F5] border-[#D8CEC1] text-stone-900 placeholder:text-stone-400 focus:border-[#EA580C]"
                    : "bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-[#EA580C]"
                }`}
              />
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                { key: "all", label: `All (${leads.length})` },
                {
                  key: "unreplied",
                  label: `Needs Reply (${
                    leads.filter(
                      (l) => messages.filter((m) => m.leadId === l.id || m.recipient === l.email).length === 0
                    ).length
                  })`,
                },
                {
                  key: "replied",
                  label: `Replied (${
                    leads.filter(
                      (l) => messages.filter((m) => m.leadId === l.id || m.recipient === l.email).length > 0
                    ).length
                  })`,
                },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setStatusFilter(tab.key as any)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    statusFilter === tab.key
                      ? "bg-[#EA580C] text-white shadow-xs"
                      : isDay
                      ? "bg-[#F4EFEA] text-stone-700 hover:bg-[#EAE3D9]"
                      : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Inquiry Thread Cards List */}
          <div className="space-y-2 max-h-[640px] overflow-y-auto pr-1">
            {filteredLeads.length === 0 ? (
              <div
                className={`p-8 text-center rounded-2xl border ${
                  isDay ? "bg-white border-[#E2DACF] text-stone-500" : "bg-[#141417] border-zinc-800 text-zinc-400"
                } text-xs`}
              >
                No inquiry threads match your filter.
              </div>
            ) : (
              filteredLeads.map((lead) => {
                const isSelected = lead.id === selectedLeadId;
                const replyCount = messages.filter(
                  (m) => m.leadId === lead.id || m.recipient === lead.email
                ).length;

                return (
                  <div
                    key={lead.id}
                    onClick={() => handleSelectLead(lead)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer text-xs space-y-2 ${
                      isSelected
                        ? isDay
                          ? "bg-[#FAF5EF] border-[#EA580C] ring-2 ring-[#EA580C]/20 shadow-md"
                          : "bg-[#1C1815] border-[#FF7A00] ring-2 ring-[#FF7A00]/25 shadow-md"
                        : isDay
                        ? "bg-white border-[#E2DACF] hover:border-amber-400 shadow-sm"
                        : "bg-[#141417] border-zinc-800 hover:border-zinc-700"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-sm text-stone-900 dark:text-white truncate">
                        {lead.name}
                      </span>
                      <span className="font-mono text-[10px] font-bold text-amber-500">
                        #{lead.ticketId}
                      </span>
                    </div>

                    <div className="text-[11px] text-stone-500 dark:text-stone-400 truncate">
                      {lead.email} • {lead.phone}
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-stone-200/60 dark:border-zinc-800/80">
                      <span className="text-[11px] text-stone-500 font-medium">
                        {lead.guestCount} guests • {lead.eventDate}
                      </span>

                      {replyCount > 0 ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                          ✓ Replied ({replyCount})
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
                          ● Needs Reply
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: FAST EMAIL COMPOSER & THREAD HISTORY (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div
            className={`p-6 sm:p-7 rounded-3xl border shadow-xl space-y-5 ${
              isDay ? "bg-[#FFFFFF] border-[#E2DACF]" : "bg-[#141417] border-zinc-800"
            }`}
          >
            {/* Header info about the recipient */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-200 dark:border-zinc-800">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#FF7A00] block">
                  Compose Email
                </span>
                <h3 className={`font-display text-xl font-bold ${isDay ? "text-stone-900" : "text-white"}`}>
                  {clientName ? `Reply to ${clientName}` : "New Client Email"}
                </h3>
                {activeLead && (
                  <p className="text-xs text-stone-400 mt-0.5">
                    Ticket #{activeLead.ticketId} • {activeLead.packageName} ({activeLead.guestCount} guests)
                  </p>
                )}
              </div>

              {/* Template Picker */}
              <div className="space-y-1">
                <label className={`text-[10px] font-bold uppercase tracking-wider block ${isDay ? "text-stone-500" : "text-zinc-400"}`}>
                  1-Tap Templates:
                </label>
                <select
                  onChange={(e) => handleApplyTemplate(e.target.value)}
                  defaultValue=""
                  aria-label="Select pre-built email template"
                  className={`text-xs font-bold rounded-xl px-3 py-1.5 border focus:outline-none transition-colors cursor-pointer ${
                    isDay
                      ? "bg-[#FAF8F5] border-[#D8CEC1] text-stone-900 focus:border-[#EA580C]"
                      : "bg-zinc-900 border-zinc-700 text-white focus:border-[#EA580C]"
                  }`}
                >
                  <option value="" disabled>Select Template...</option>
                  {EMAIL_TEMPLATES.map((tmpl) => (
                    <option key={tmpl.id} value={tmpl.id}>
                      {tmpl.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSendEmail} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Sender */}
                <div className="space-y-1">
                  <label className={`font-bold uppercase tracking-wider text-[11px] block ${isDay ? "text-stone-600" : "text-stone-300"}`}>
                    From (Brevo Sender)
                  </label>
                  <select
                    value={senderEmail}
                    onChange={(e) => setSenderEmail(e.target.value)}
                    className={`w-full h-10 px-3 rounded-xl border text-xs font-semibold focus:outline-none transition-colors cursor-pointer ${
                      isDay
                        ? "bg-[#FAF8F5] border-[#D8CEC1] text-stone-900 focus:border-[#EA580C]"
                        : "bg-zinc-900 border-zinc-700 text-white focus:border-[#EA580C]"
                    }`}
                  >
                    <option value="marion@allthesmokecatering.com">Marion Bolden &lt;marion@allthesmokecatering.com&gt;</option>
                    <option value="info@allthesmokecatering.com">All The Smoke Dispatch &lt;info@allthesmokecatering.com&gt;</option>
                    <option value="support@allthesmokecatering.com">Pitmaster Support &lt;support@allthesmokecatering.com&gt;</option>
                  </select>
                </div>

                {/* Recipient */}
                <div className="space-y-1">
                  <label className={`font-bold uppercase tracking-wider text-[11px] block ${isDay ? "text-stone-600" : "text-stone-300"}`}>
                    To (Client Email) *
                  </label>
                  <input
                    type="email"
                    required
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    placeholder="client@example.com"
                    className={`w-full h-10 px-3 rounded-xl border text-xs focus:outline-none transition-colors ${
                      isDay
                        ? "bg-[#FAF8F5] border-[#D8CEC1] text-stone-900 focus:border-[#EA580C]"
                        : "bg-zinc-900 border-zinc-700 text-white focus:border-[#EA580C]"
                    }`}
                  />
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-1">
                <label className={`font-bold uppercase tracking-wider text-[11px] block ${isDay ? "text-stone-600" : "text-stone-300"}`}>
                  Subject Line *
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Subject line..."
                  className={`w-full h-10 px-3 rounded-xl border text-xs font-medium focus:outline-none transition-colors ${
                    isDay
                      ? "bg-[#FAF8F5] border-[#D8CEC1] text-stone-900 focus:border-[#EA580C]"
                      : "bg-zinc-900 border-zinc-700 text-white focus:border-[#EA580C]"
                  }`}
                />
              </div>

              {/* Message Content */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className={`font-bold uppercase tracking-wider text-[11px] block ${isDay ? "text-stone-600" : "text-stone-300"}`}>
                    Message Body *
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPreview(!showPreview)}
                    className="text-xs text-[#EA580C] hover:underline font-bold"
                  >
                    {showPreview ? "Hide Live Preview" : "Show Client Preview"}
                  </button>
                </div>
                <textarea
                  rows={8}
                  required
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  placeholder="Write your email reply to the client..."
                  className={`w-full p-3.5 rounded-xl border text-xs sm:text-sm focus:outline-none font-sans leading-relaxed resize-none transition-colors ${
                    isDay
                      ? "bg-[#FAF8F5] border-[#D8CEC1] text-stone-900 focus:border-[#EA580C]"
                      : "bg-zinc-900 border-zinc-700 text-white focus:border-[#EA580C]"
                  }`}
                />
              </div>

              {/* Live Preview Box */}
              {showPreview && (
                <div className="p-4 rounded-2xl border border-stone-700 bg-[#0A0A0A] text-stone-200 text-xs space-y-3">
                  <div className="text-[10px] uppercase font-bold text-amber-500 tracking-wider">
                    ★ Live Branded Email Preview ★
                  </div>
                  <div className="p-3 rounded-xl bg-white text-stone-900 font-sans space-y-2">
                    <div className="font-bold border-b pb-1 text-sm text-[#C84A0A]">
                      ALL THE SMOKE BBQ &amp; CATERING
                    </div>
                    {clientName && <p className="font-semibold">Hello {clientName},</p>}
                    <div className="whitespace-pre-line text-stone-700 leading-relaxed text-xs">
                      {messageContent}
                    </div>
                    <div className="pt-2 border-t text-[11px] text-stone-500">
                      Marion Bolden • (773) 707-9988 • {senderEmail}
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-stone-500">
                  Replies CC/BCC Marion &amp; Todd automatically.
                </span>

                <button
                  type="submit"
                  disabled={isSending}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[radial-gradient(ellipse_at_center,_#C84A0A_0%,_#7E2605_60%,_#2A0D02_100%)] border border-[#FF7A00] shadow-[0_0_14px_rgba(255,122,0,0.4)] text-white text-xs font-bold uppercase tracking-wider transition-all hover:scale-105 active:scale-95 disabled:opacity-60 cursor-pointer"
                >
                  {isSending ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      <span>Transmitting...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      <span>Send Reply via Brevo</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Thread History for Active Lead */}
          {activeLeadReplies.length > 0 && (
            <div
              className={`p-5 rounded-3xl border space-y-3 ${
                isDay ? "bg-white border-[#E2DACF]" : "bg-[#141417] border-zinc-800"
              }`}
            >
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                Email History for {clientName || recipientEmail} ({activeLeadReplies.length})
              </h4>
              <div className="space-y-2">
                {activeLeadReplies.map((m) => (
                  <div
                    key={m.id}
                    className="p-3 rounded-xl border border-stone-200 dark:border-zinc-800 bg-stone-50 dark:bg-zinc-900/60 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between text-stone-500 text-[10px]">
                      <span>From: <strong className="text-[#FF7A00]">{m.sender}</strong></span>
                      <span>{new Date(m.createdAt).toLocaleString()}</span>
                    </div>
                    <div className="font-semibold text-stone-900 dark:text-stone-200">{m.subject}</div>
                    <div className="text-stone-600 dark:text-stone-400 whitespace-pre-line text-[11px] max-h-24 overflow-y-auto">
                      {m.body}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
