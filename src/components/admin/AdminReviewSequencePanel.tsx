"use client";

import React, { useEffect, useState } from "react";

export type ReviewSequenceStatus = "pending" | "sent" | "completed";

export interface ReviewSequenceContact {
  id: string;
  clientName: string;
  clientEmail: string;
  eventType: string;
  reviewStatus: ReviewSequenceStatus;
  vipThankYouSent?: boolean;
  lastUpdated: string;
}

const STORAGE_KEY_SEQUENCE = "ats_review_sequence_contacts_v1";

const INITIAL_CONTACTS: ReviewSequenceContact[] = [
  { id: "gbp-cordel", clientName: "Cordel Summers", clientEmail: "", eventType: "Google Review (Nov 15)", reviewStatus: "completed", lastUpdated: "Nov 15, 2026" },
  { id: "gbp-jeanette", clientName: "Jeanette Allen", clientEmail: "", eventType: "Google Review (Nov 15)", reviewStatus: "completed", lastUpdated: "Nov 15, 2026" },
  { id: "gbp-drobinson", clientName: "D. Robinson", clientEmail: "", eventType: "Google Review (Nov 15)", reviewStatus: "completed", lastUpdated: "Nov 15, 2026" },
  { id: "gbp-marcus", clientName: "Marcus Fuller", clientEmail: "", eventType: "Google Review (Nov 15)", reviewStatus: "completed", lastUpdated: "Nov 15, 2026" },
  { id: "gbp-chris", clientName: "Chris Hackett", clientEmail: "", eventType: "Google Review (Nov 15)", reviewStatus: "completed", lastUpdated: "Nov 15, 2026" },
  { id: "gbp-nel", clientName: "Nel C", clientEmail: "", eventType: "Google Review (Nov 15)", reviewStatus: "completed", lastUpdated: "Nov 15, 2026" },
  { id: "gbp-justin", clientName: "Justin Raglin", clientEmail: "", eventType: "Google Review (Nov 15)", reviewStatus: "completed", lastUpdated: "Nov 15, 2026" },
  { id: "gbp-adrienne", clientName: "Adrienne Bolden", clientEmail: "", eventType: "Google Review (Nov 15)", reviewStatus: "completed", lastUpdated: "Nov 15, 2026" },
  { id: "gbp-latrina", clientName: "Latrina Harrington", clientEmail: "", eventType: "Google Review (Nov 15)", reviewStatus: "completed", lastUpdated: "Nov 15, 2026" },
];

export interface AdminReviewSequencePanelProps {
  isDay: boolean;
}

export function AdminReviewSequencePanel({ isDay }: AdminReviewSequencePanelProps) {
  const [contacts, setContacts] = useState<ReviewSequenceContact[]>(INITIAL_CONTACTS);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [eventType, setEventType] = useState("Catering Event");
  const [sendNow, setSendNow] = useState(false);
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_SEQUENCE);
      if (raw) {
        const parsed: ReviewSequenceContact[] = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Never allow a false "VIP Thank-You Sent" checkmark if no email was entered
          const sanitized = parsed.map((c) =>
            !c.clientEmail?.trim() && c.vipThankYouSent
              ? { ...c, vipThankYouSent: false }
              : c
          );
          const existingIds = new Set(sanitized.map((c) => c.id));
          const missing = INITIAL_CONTACTS.filter((c) => !existingIds.has(c.id));
          setContacts(missing.length > 0 ? [...missing, ...sanitized] : sanitized);
        }
      }
    } catch {}
  }, []);

  const persist = (next: ReviewSequenceContact[]) => {
    setContacts(next);
    try {
      localStorage.setItem(STORAGE_KEY_SEQUENCE, JSON.stringify(next));
    } catch {}
  };

  const triggerSequence = async (
    contact: ReviewSequenceContact,
    mode: "guided-ask" | "vip-thankyou"
  ) => {
    if (!contact.clientEmail.trim()) {
      setFeedback(`Add an email address for ${contact.clientName} before sending.`);
      return;
    }
    setSendingId(contact.id);
    setFeedback(null);
    try {
      const res = await fetch("/api/admin/review-sequence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: contact.clientName,
          clientEmail: contact.clientEmail,
          eventType: contact.eventType,
          reviewStatus: contact.reviewStatus,
          mode,
          sendNow,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        setFeedback(data.error || "Could not queue email.");
      } else {
        const updated = contacts.map((c) =>
          c.id === contact.id
            ? {
                ...c,
                reviewStatus: mode === "guided-ask" ? ("sent" as const) : c.reviewStatus,
                vipThankYouSent: mode === "vip-thankyou" ? true : c.vipThankYouSent,
                lastUpdated: new Date().toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                }),
              }
            : c
        );
        persist(updated);
        setFeedback(
          data.message ||
            (mode === "vip-thankyou"
              ? `VIP Thank-You sent to ${contact.clientName}.`
              : `24h Guided Review Sequence + 4-day bump queued for ${contact.clientName}.`)
        );
      }
    } catch {
      setFeedback("Network error reaching /api/admin/review-sequence.");
    } finally {
      setSendingId(null);
    }
  };

  const handleQueueNewClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    const newContact: ReviewSequenceContact = {
      id: "seq-" + Date.now(),
      clientName: name.trim(),
      clientEmail: email.trim(),
      eventType: eventType.trim() || "Catering Event",
      reviewStatus: "pending",
      lastUpdated: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    };
    const next = [newContact, ...contacts];
    persist(next);
    setName("");
    setEmail("");
    await triggerSequence(newContact, "guided-ask");
  };

  const updateStatus = (id: string, reviewStatus: ReviewSequenceStatus) => {
    persist(contacts.map((c) => (c.id === id ? { ...c, reviewStatus } : c)));
  };

  const updateEmail = (id: string, clientEmail: string) => {
    persist(contacts.map((c) => (c.id === id ? { ...c, clientEmail } : c)));
  };

  const handleCopyVipText = (contact: ReviewSequenceContact) => {
    const firstName = contact.clientName.trim().split(/\s+/)[0] || "there";
    const msg = `Hey ${firstName}, just wanted to personally say thank you for taking the time to drop us a 5-star review on Google! Whenever you've got another event, office lunch, or family cookout coming up, hit us up early so we can lock your date on the smoker calendar. – Marion, All The Smoke BBQ & Catering (773) 707-9988`;
    navigator.clipboard.writeText(msg);
    setCopiedId(contact.id);
    setTimeout(() => setCopiedId((prev) => (prev === contact.id ? null : prev)), 3500);
    setFeedback(`Copied for ${contact.clientName} — paste it into your Text/DM: "${msg}"`);
  };

  const pendingVipCount = contacts.filter(
    (c) => c.reviewStatus === "completed" && !c.vipThankYouSent
  ).length;

  const cardCls = isDay
    ? "bg-[#FAF8F5] border border-[#D8CEC1] text-[#1C1917]"
    : "bg-zinc-900/80 border border-zinc-800 text-zinc-100";
  const inputCls = isDay
    ? "bg-white border border-[#C8A97E] text-[#1C1917]"
    : "bg-zinc-950 border border-zinc-700 text-white";

  return (
    <section className={`rounded-2xl p-5 space-y-4 ${cardCls}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#EA580C]">
            Blueprint Q • Brevo Review Sequence
          </span>
          <h3 className="font-display text-lg font-bold">
            Guided 24h Review Ask &amp; Completed VIP Split
          </h3>
          <p className={`text-xs ${isDay ? "text-stone-600" : "text-zinc-400"}`}>
            Sends 3 light prompts (+24h &amp; 4-day bump). Clients marked <strong>completed</strong> (including our 6 Google reviewers) never get double-asked—send a VIP Thank-You instead.
          </p>
        </div>
      </div>

      {pendingVipCount > 0 && (
        <div className="p-3.5 rounded-xl bg-[#EA580C]/15 border border-[#FF7A00]/50 text-xs space-y-1">
          <p className="font-black text-[#FF7A00]">
            ⏰ Action Needed: {pendingVipCount} Google {pendingVipCount === 1 ? "Reviewer Needs" : "Reviewers Need"} a VIP Thank-You
          </p>
          <p className={isDay ? "text-stone-800" : "text-stone-200"}>
            These folks left Google reviews before being added to Leads, so their emails aren&apos;t on file yet. Grab their email from your texts/contacts, paste it below, and click <strong>Send VIP Thank-You</strong>—or tap <strong>Copy Text</strong> if you only have their phone number.
          </p>
        </div>
      )}

      {feedback && (
        <div className="px-3.5 py-2.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-500 text-xs font-bold">
          {feedback}
        </div>
      )}

      {/* Queue New Client Form */}
      <form onSubmit={handleQueueNewClient} className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
        <input
          type="text"
          required
          placeholder="Client Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={`min-h-[48px] px-3 rounded-xl text-xs ${inputCls}`}
        />
        <input
          type="email"
          required
          placeholder="Client Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`min-h-[48px] px-3 rounded-xl text-xs ${inputCls}`}
        />
        <input
          type="text"
          placeholder="Event / Order (e.g. Corporate Lunch)"
          value={eventType}
          onChange={(e) => setEventType(e.target.value)}
          className={`min-h-[48px] px-3 rounded-xl text-xs ${inputCls}`}
        />
        <button
          type="submit"
          disabled={sendingId !== null}
          className="min-h-[48px] px-4 rounded-xl bg-[radial-gradient(ellipse_at_center,_#C84A0A_0%,_#7E2605_60%,_#2A0D02_100%)] border border-[#FF7A00] text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
        >
          {sendNow ? "Send Guided Ask Now" : "Queue +24h Sequence"}
        </button>
      </form>

      <label className={`inline-flex items-center gap-2 text-xs cursor-pointer ${isDay ? "text-stone-700" : "text-zinc-300"}`}>
        <input
          type="checkbox"
          checked={sendNow}
          onChange={(e) => setSendNow(e.target.checked)}
          className="rounded"
        />
        <span>Send Email 1 immediately instead of +24h delay (4-day bump still schedules automatically)</span>
      </label>

      {/* Tracked Contacts List */}
      <div className="space-y-2 pt-1">
        {contacts.map((c) => (
          <div
            key={c.id}
            className={`p-3 rounded-xl border flex flex-col lg:flex-row lg:items-center justify-between gap-2.5 ${
              isDay ? "bg-white border-[#E4DDD2]" : "bg-zinc-950/60 border-zinc-800"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 min-w-0 flex-1">
              <span className="font-bold text-sm truncate">{c.clientName}</span>
              <span className={`text-xs ${isDay ? "text-stone-500" : "text-zinc-400"}`}>
                {c.eventType}
              </span>
              <input
                type="email"
                placeholder="Add email to send VIP Thank-You..."
                value={c.clientEmail}
                onChange={(e) => updateEmail(c.id, e.target.value)}
                className={`min-h-[40px] px-2.5 rounded-lg text-xs flex-1 max-w-xs ${inputCls}`}
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                aria-label={`Review status for ${c.clientName}`}
                value={c.reviewStatus}
                onChange={(e) => updateStatus(c.id, e.target.value as ReviewSequenceStatus)}
                className={`min-h-[40px] px-2.5 rounded-lg text-xs font-bold ${inputCls}`}
              >
                <option value="pending">pending</option>
                <option value="sent">sent</option>
                <option value="completed">completed</option>
              </select>

              {c.reviewStatus === "completed" ? (
                <>
                  <button
                    type="button"
                    disabled={sendingId === c.id || !c.clientEmail.trim()}
                    onClick={() => triggerSequence(c, "vip-thankyou")}
                    className={`min-h-[40px] px-3 rounded-lg text-xs font-bold ${
                      !c.clientEmail.trim()
                        ? "bg-zinc-800 text-zinc-400 border border-zinc-700 cursor-not-allowed"
                        : "bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer"
                    }`}
                  >
                    {!c.clientEmail.trim()
                      ? "Add Email to Send"
                      : c.vipThankYouSent
                      ? "✓ VIP Email Sent"
                      : "Send VIP Email"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCopyVipText(c)}
                    className={`min-h-[40px] px-3 rounded-lg border text-xs font-bold cursor-pointer ${
                      copiedId === c.id
                        ? "bg-amber-500/20 border-amber-500 text-amber-400"
                        : isDay
                        ? "bg-stone-100 border-stone-300 text-stone-800 hover:bg-stone-200"
                        : "bg-zinc-900 border-zinc-700 text-stone-200 hover:bg-zinc-800"
                    }`}
                  >
                    {copiedId === c.id ? "✓ Copied! Paste in Text/DM" : "📋 Copy Text"}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  disabled={sendingId === c.id}
                  onClick={() => triggerSequence(c, "guided-ask")}
                  className="min-h-[40px] px-3 rounded-lg bg-[#EA580C] hover:bg-[#C84A0A] text-white text-xs font-bold cursor-pointer"
                >
                  {c.reviewStatus === "sent" ? "Resend Guided Ask" : "Send Guided Ask"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
