"use client";

import React, { useState, useEffect } from "react";
import { PitmasterLead, LeadStatus } from "./AdminLeadsPipeline";

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

export interface AdminEmailHubProps {
  theme?: "day" | "night" | "dark" | "butcher-paper";
  prefilledLead?: PitmasterLead;
}

// 4 1-Tap Quick-Reply Catering Templates for Live-Fire Texas BBQ
const QUICK_REPLY_TEMPLATES = [
  {
    id: "availability",
    name: "Availability & Call",
    badge: "Availability",
    generate: (lead: PitmasterLead) =>
      `Hi ${lead.name || "there"},\n\nThank you for considering All The Smoke BBQ & Catering! We received your catering inquiry for your ${lead.eventType || "event"}${lead.eventDate ? ` on ${lead.eventDate}` : ""}.\n\nMarion Bolden would love to connect with you for a brief consultation call to review your menu vision, smoker trailer rig clearance, timeline, and guest count (${lead.guestCount || 0} guests). What is the best time today or tomorrow to speak?\n\nYou can also reach us directly at (773) 707-9988.\n\nWarm regards,\nMarion Bolden | Pitmaster\nAll The Smoke BBQ & Catering\nallthesmokecatering.com`,
  },
  {
    id: "quote-prep",
    name: "Custom Proposal",
    badge: "Menu & Quote",
    generate: (lead: PitmasterLead) =>
      `Hi ${lead.name || "there"},\n\nThank you for reaching out to All The Smoke BBQ! For your party of ${lead.guestCount || "approximate"} guests, our pitmasters specialize in 14-hour post oak smoked Texas brisket, hardwood turkey chops, and scratch-made Southern sides.\n\nWe are currently drafting a customized proposal for your ${lead.eventType || "event"} (${lead.packageName || "Live-Fire BBQ Experience"}). In the meantime, please let us know if there are specific dietary preferences or must-have signature meats you'd like included.\n\nLooking forward to feeding your guests!\n\nMarion Bolden | Pitmaster\nAll The Smoke BBQ & Catering\n(773) 707-9988`,
  },
  {
    id: "rig-logistics",
    name: "Smoker Rig Clearance",
    badge: "Logistics",
    generate: (lead: PitmasterLead) =>
      `Hi ${lead.name || "there"},\n\nWe are reviewing logistics for your upcoming ${lead.eventType || "gathering"}${lead.eventDate ? ` on ${lead.eventDate}` : ""}.\n\nBecause our live-fire offset trailer rig requires dedicated space, could you confirm:\n1. Is there flat driveway, parking lot, or alleyway clearance for our pit trailer?\n2. Are there low-hanging tree branches or tight gates we should be mindful of?\n3. What is your preferred load-in and hot-box serving schedule for your guests?\n\nThank you, and we look forward to bringing the smoke!\n\nMarion Bolden & The Pitmaster Crew\n(773) 707-9988\ninfo@allthesmokecatering.com`,
  },
  {
    id: "lock-in-date",
    name: "Hold Date & Contract",
    badge: "Lock In Date",
    generate: (lead: PitmasterLead) =>
      `Hi ${lead.name || "there"},\n\nFollowing up regarding your catering inquiry for ${lead.eventDate || "your upcoming date"}.\n\nOur pitmaster smoke schedule fills up quickly, and we would love to secure your date exclusively on our commissary calendar. Please let us know if you are ready to review the contract and 25% deposit steps so we can hold your date.\n\nWe look forward to firing up the smoker for you and your guests!\n\nMarion Bolden\nAll The Smoke BBQ & Catering\n(773) 707-9988\ninfo@allthesmokecatering.com`,
  },
];

// Lead status styling in All The Smoke live-fire palette
const STATUS_STYLES: Record<LeadStatus, { label: string; badgeClass: string }> = {
  new: {
    label: "new",
    badgeClass: "bg-blue-600/15 text-blue-900 dark:text-blue-300 border-blue-500/30",
  },
  contacted: {
    label: "contacted",
    badgeClass: "bg-amber-600/15 text-amber-950 dark:text-amber-300 border-amber-500/30",
  },
  quoted: {
    label: "quoted",
    badgeClass: "bg-[#FF7A00]/15 text-[#C84A0A] dark:text-[#FF7A00] border-[#FF7A00]/40 font-bold",
  },
  booked: {
    label: "booked",
    badgeClass: "bg-emerald-600/15 text-emerald-950 dark:text-emerald-300 border-emerald-500/30 font-bold",
  },
  completed: {
    label: "completed",
    badgeClass: "bg-purple-600/15 text-purple-900 dark:text-purple-300 border-purple-500/30",
  },
  ghosted: {
    label: "ghosted",
    badgeClass: "bg-zinc-600/15 text-zinc-900 dark:text-zinc-400 border-zinc-500/30",
  },
};

export function AdminEmailHub({ theme = "night", prefilledLead }: AdminEmailHubProps) {
  const isDay = theme === "day" || theme === "butcher-paper";

  const [leads, setLeads] = useState<PitmasterLead[]>([]);
  const [messages, setMessages] = useState<SentMessage[]>([]);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTab, setFilterTab] = useState<"all" | "needs-reply" | "replied">("all");

  // Reply Composer State
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
    if (!currentLead || !replyBody.trim()) return;

    setIsSending(true);
    setErrorAlert(null);
    setSuccessAlert(null);

    const subjectToSend =
      replySubject.trim() || `Re: Catering Inquiry for ${currentLead.name} — All The Smoke BBQ`;
    const bodyToSend = replyBody.trim();

    try {
      const res = await fetch("/api/admin/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId: currentLead.id,
          recipientEmail: currentLead.email,
          clientName: currentLead.name,
          subject: subjectToSend,
          messageContent: bodyToSend,
          senderEmail: "info@allthesmokecatering.com",
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to dispatch email via Brevo");
      }

      const newMsg: SentMessage = data.message || {
        id: "msg-" + Date.now(),
        leadId: currentLead.id,
        sender: "info@allthesmokecatering.com",
        recipient: currentLead.email,
        subject: subjectToSend,
        body: bodyToSend,
        status: "sent",
        createdAt: new Date().toISOString(),
      };

      const updatedMsgs = [newMsg, ...messages];
      setMessages(updatedMsgs);

      // Auto update lead status to "quoted" or "contacted" if previously "new"
      const updatedLeads = leads.map((l) => {
        if (l.id === currentLead.id && l.status === "new") {
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

      setSuccessAlert(`Reply sent to ${currentLead.name} (${currentLead.email})! BCC delivered to Marion & Todd.`);
      setReplyBody(""); // Reset composer after sending
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

      {/* 2-COLUMN EMAIL CONSOLE (MATCHING BLIND COOK EXACT LAYOUT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* LEFT COLUMN: CLIENT ROSTER & FILTER TABS (lg:col-span-5) */}
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
                const statusStyle = STATUS_STYLES[lead.status] || STATUS_STYLES.new;

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
                      <span className="font-extrabold text-sm text-black dark:text-white truncate">
                        {lead.name}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold border uppercase tracking-wider shrink-0 ${statusStyle.badgeClass}`}
                      >
                        {statusStyle.label}
                      </span>
                    </div>

                    {/* Contact subline (crisp black in day mode) */}
                    <div className="flex items-center justify-between text-[11px] text-black dark:text-stone-300 font-bold">
                      <span className="truncate">{lead.email}</span>
                      <span className="shrink-0 ml-1 font-extrabold">{lead.phone}</span>
                    </div>

                    {/* Event & Guests */}
                    <div className="flex items-center justify-between text-[11px] font-extrabold pt-1 border-t border-stone-200 dark:border-zinc-800/80">
                      <span className="text-[#EA580C] dark:text-[#FF7A00]">
                        {lead.eventType || "Catering"} • {lead.guestCount} guests
                      </span>
                      <span className="text-black dark:text-stone-300 font-extrabold">
                        {lead.eventDate || "Date Pending"}
                      </span>
                    </div>

                    {/* Notes snippet */}
                    {lead.notes && (
                      <p className="text-[11px] text-black dark:text-stone-300 font-semibold line-clamp-2 leading-relaxed">
                        {lead.notes}
                      </p>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: ACTIVE THREAD & EMAIL COMPOSER (lg:col-span-7) */}
        <div className="lg:col-span-7">
          {!currentLead ? (
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
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className={`text-base font-black ${isDay ? "text-black" : "text-white"}`}>
                      Conversation with {currentLead.name}
                    </h3>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold border uppercase tracking-wider ${
                        (STATUS_STYLES[currentLead.status] || STATUS_STYLES.new).badgeClass
                      }`}
                    >
                      {(STATUS_STYLES[currentLead.status] || STATUS_STYLES.new).label}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs mt-1 text-black dark:text-stone-300 font-extrabold flex-wrap">
                    <span>✉️ {currentLead.email}</span>
                    <a
                      href={`tel:${currentLead.phone}`}
                      className="text-[#EA580C] hover:underline font-black flex items-center gap-1"
                    >
                      📞 {currentLead.phone}
                    </a>
                    {currentLead.eventDate && (
                      <span className="text-black dark:text-stone-300 font-extrabold">
                        📅 {currentLead.eventDate}
                      </span>
                    )}
                  </div>
                </div>

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
              </div>

              {/* Main Body: Conversation Thread Container & Composer */}
              <div className="p-4 sm:p-5 space-y-4">
                
                {/* Scrollable Conversation Thread Container */}
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
                    <div className="flex items-center justify-between border-b pb-2 border-stone-200 dark:border-zinc-800">
                      <span className="font-black flex items-center gap-1.5 text-[#EA580C] dark:text-[#FF7A00]">
                        📥 Customer Inquiry ({currentLead.name})
                      </span>
                      <span className={`text-[10px] font-extrabold ${isDay ? "text-black" : "text-stone-400"}`}>
                        {currentLead.createdAt ? new Date(currentLead.createdAt).toLocaleDateString() : "New Lead"}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] py-1 text-black dark:text-stone-200 font-extrabold">
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
                      <div className="text-[11px] font-black text-[#EA580C]">
                        Package: {currentLead.packageName}
                      </div>
                    )}

                    <div className="whitespace-pre-wrap leading-relaxed text-[11px] pt-1 text-black dark:text-stone-300 font-semibold">
                      {currentLead.notes || "No message body included in intake."}
                    </div>
                  </div>

                  {/* 2. Outbound Pitmaster Marion Bolden Replies */}
                  {currentLeadMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-3.5 rounded-xl border text-xs space-y-2 ml-4 sm:ml-8 ${
                        isDay
                          ? "bg-amber-50/70 border-amber-300 text-black shadow-2xs"
                          : "bg-[#251C15] border-[#FF7A00]/40 text-stone-200"
                      }`}
                    >
                      <div className="flex items-center justify-between border-b pb-2 border-amber-200 dark:border-zinc-800">
                        <span className="font-black flex items-center gap-1.5 text-[#EA580C] dark:text-[#FF7A00]">
                          📤 Marion Bolden (info@allthesmokecatering.com)
                        </span>
                        <span className={`text-[10px] font-extrabold ${isDay ? "text-black" : "text-stone-400"}`}>
                          {new Date(msg.createdAt).toLocaleString()}
                        </span>
                      </div>

                      {msg.subject && (
                        <p className="font-extrabold text-[11px] text-[#EA580C] dark:text-[#FF7A00]">
                          Subject: {msg.subject}
                        </p>
                      )}

                      <div className="whitespace-pre-wrap leading-relaxed text-[11px] text-black dark:text-stone-200 font-semibold">
                        {msg.body}
                      </div>

                      <div className="pt-1 flex items-center justify-between text-[10px] text-black dark:text-stone-300 font-bold border-t border-amber-200 dark:border-zinc-800">
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

                {/* 1-Tap Catering Reply Templates */}
                <div className="space-y-1.5">
                  <label className={`text-[11px] font-black block ${isDay ? "text-black" : "text-stone-200"}`}>
                    ⚡ 1-Tap Catering Reply Templates:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    {QUICK_REPLY_TEMPLATES.map((tmpl) => (
                      <button
                        key={tmpl.id}
                        type="button"
                        onClick={() => setReplyBody(tmpl.generate(currentLead))}
                        className={`h-auto py-2 px-2 rounded-xl border text-[11px] flex flex-col items-center justify-center text-center font-bold leading-tight transition-all cursor-pointer ${
                          isDay
                            ? "bg-stone-50 border-stone-300 text-black hover:border-[#FF7A00] hover:bg-amber-50"
                            : "bg-zinc-850 border-zinc-700 text-stone-200 hover:border-[#FF7A00] hover:bg-zinc-800"
                        }`}
                        title={`Insert "${tmpl.name}" template`}
                      >
                        <span className="text-[#EA580C] dark:text-[#FF7A00] font-black">{tmpl.badge}</span>
                        <span className={`text-[10px] font-extrabold ${isDay ? "text-black" : "text-stone-300"}`}>{tmpl.name}</span>
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
                      placeholder={`Re: Catering Inquiry for ${currentLead.name}`}
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
                      placeholder={`Type your personalized reply to ${currentLead.name} here...`}
                      className={`w-full p-3 rounded-xl border text-xs sm:text-sm font-sans font-semibold leading-relaxed focus:outline-none transition-colors ${
                        isDay
                          ? "bg-white border-stone-400 text-black placeholder:text-stone-600 focus:border-[#FF7A00]"
                          : "bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-[#FF7A00]"
                      }`}
                    />
                  </div>

                  {/* Dispatch Banner & Action Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 pt-1">
                    <div className="flex items-center gap-1.5 text-[11px] text-black dark:text-stone-300 font-bold">
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
                          className="h-8 px-3 rounded-lg text-xs font-black text-black hover:text-stone-700 dark:text-stone-200 transition-colors cursor-pointer"
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

              </div>

            </div>
          )}
        </div>

      </div>

      {/* FULL LEAD BLOW-UP POPUP MODAL */}
      {fullLeadModalOpen && currentLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className={`w-full max-w-2xl rounded-3xl border shadow-2xl p-6 sm:p-7 space-y-5 max-h-[90vh] overflow-y-auto ${
              isDay ? "bg-white border-stone-300 text-black" : "bg-[#141210] border-zinc-800 text-white"
            }`}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 border-b pb-4 border-stone-200 dark:border-zinc-800">
              <div>
                <span className="text-[10px] uppercase font-black tracking-widest text-[#FF7A00]">
                  Ticket #{currentLead.ticketId} • Lead Specifications
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-black dark:text-white mt-0.5">
                  {currentLead.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setFullLeadModalOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-black dark:text-white font-bold flex items-center justify-center text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Quick Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className={`p-3 rounded-xl border ${isDay ? "bg-stone-50 border-stone-300" : "bg-zinc-900 border-zinc-800"}`}>
                <span className={`text-[10px] uppercase font-black block ${isDay ? "text-black" : "text-stone-400"}`}>Status</span>
                <span className="text-xs font-black capitalize text-black dark:text-white mt-0.5 block">
                  {currentLead.status}
                </span>
              </div>
              <div className={`p-3 rounded-xl border ${isDay ? "bg-stone-50 border-stone-300" : "bg-zinc-900 border-zinc-800"}`}>
                <span className={`text-[10px] uppercase font-black block ${isDay ? "text-black" : "text-stone-400"}`}>Guests</span>
                <span className="text-xs font-black text-black dark:text-white mt-0.5 block">
                  {currentLead.guestCount} Guests
                </span>
              </div>
              <div className={`p-3 rounded-xl border ${isDay ? "bg-stone-50 border-stone-300" : "bg-zinc-900 border-zinc-800"}`}>
                <span className={`text-[10px] uppercase font-black block ${isDay ? "text-black" : "text-stone-400"}`}>Event Date</span>
                <span className="text-xs font-black text-black dark:text-white mt-0.5 block">
                  {currentLead.eventDate || "TBD"}
                </span>
              </div>
              <div className={`p-3 rounded-xl border ${isDay ? "bg-stone-50 border-stone-300" : "bg-zinc-900 border-zinc-800"}`}>
                <span className={`text-[10px] uppercase font-black block ${isDay ? "text-black" : "text-stone-400"}`}>Event Type</span>
                <span className="text-xs font-black capitalize text-black dark:text-white mt-0.5 block">
                  {currentLead.eventType || "Private"}
                </span>
              </div>
            </div>

            {/* Contact Information */}
            <div className={`p-4 rounded-xl border space-y-1.5 ${isDay ? "bg-stone-50 border-stone-300" : "bg-zinc-900 border-zinc-800"}`}>
              <div className="text-xs font-black text-black dark:text-white flex items-center justify-between">
                <span>Contact Details</span>
                <span className="text-[#EA580C] text-[11px] font-mono font-bold">ID: {currentLead.id}</span>
              </div>
              <div className="text-xs text-black dark:text-stone-200 font-bold">
                <strong>Email:</strong> {currentLead.email}
              </div>
              <div className="text-xs text-black dark:text-stone-200 font-bold">
                <strong>Phone:</strong> {currentLead.phone}
              </div>
              {currentLead.deliveryAddress && (
                <div className="text-xs text-black dark:text-stone-200 font-bold">
                  <strong>Venue / Location:</strong> {currentLead.deliveryAddress}
                </div>
              )}
              {currentLead.packageName && (
                <div className="text-xs text-black dark:text-stone-200 font-bold">
                  <strong>Smoker Package:</strong> {currentLead.packageName}
                </div>
              )}
            </div>

            {/* Event Vision / Notes */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-black uppercase tracking-wider text-black dark:text-stone-300 block">
                Quote &amp; Event Intake Specifications:
              </span>
              <div
                className={`p-4 rounded-xl border max-h-[200px] overflow-y-auto leading-relaxed text-xs whitespace-pre-wrap font-sans font-semibold ${
                  isDay ? "bg-white border-stone-300 text-black" : "bg-zinc-900 border-zinc-800 text-stone-200"
                }`}
              >
                {currentLead.notes || "No special notes recorded."}
              </div>
            </div>

            {/* Modal Bottom Buttons */}
            <div className="flex items-center justify-between gap-3 pt-3 border-t border-stone-200 dark:border-zinc-800">
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
                className="h-8 px-4 rounded-lg bg-[#EA580C] hover:bg-[#C84A0A] text-white text-xs font-black cursor-pointer"
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
