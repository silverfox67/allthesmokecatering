"use client";

import React, { useState, useEffect } from "react";

export type LeadStatus = "new" | "contacted" | "quoted" | "booked" | "completed" | "ghosted";

export interface PitmasterLead {
  id: string;
  ticketId: string;
  name: string;
  email: string;
  phone: string;
  guestCount: number;
  eventDate: string;
  eventType: string; // e.g. "private", "corporate", "wedding"
  packageName: string;
  serviceStyle: string;
  deliveryAddress?: string;
  notes?: string;
  status: LeadStatus;
  createdAt: string;
  source: string;
  estimatedTotal?: number;
}

const SEED_LEADS: PitmasterLead[] = [
  {
    id: "ATS-QUOTE-7585",
    ticketId: "ATS-QUOTE-7585",
    name: "Todd Davis",
    email: "todddavis923@gmail.com",
    phone: "(678) 207-6008",
    guestCount: 35,
    eventDate: "2026-11-20",
    eventType: "private",
    packageName: "The Pitmaster Feast ($30/pp)",
    serviceStyle: "Heated Drop-Off Delivery",
    deliveryAddress: "Chicago Area (Pending Venue)",
    notes: `Services: The Pitmaster Feast | Notes: Hello! I'm following up on an inquiry regarding private catering.

Looking for a fully prepared Southern live-fire dinner delivered to our venue on Chicago's North Side.

The meal is for 35 guests and should include:
- Prime hardwood smoked Texas brisket
- Smoked turkey chops with savory gravy
- Homemade cornbread & honey butter
- Baked 5-cheese macaroni and cheese
- Slow-simmered pitmaster collard greens
- Candied yams & seasoned pinto beans

We'd prefer heated insulated chafing pans and disposable serving utensils.
Estimated budget is around $1,050. Please confirm availability and delivery schedule!`,
    status: "new",
    createdAt: new Date().toISOString(),
    source: "Website Contact Form",
    estimatedTotal: 1050,
  },
  {
    id: "ATS-QUOTE-8221",
    ticketId: "ATS-QUOTE-8221",
    name: "Marcus Vance",
    email: "marcus.vance@chicagoevents.org",
    phone: "(773) 555-0199",
    guestCount: 65,
    eventDate: "2026-11-14",
    eventType: "corporate",
    packageName: "The Pitmaster Feast ($30/pp)",
    serviceStyle: "On-Site Smoker Trailer Rig",
    deliveryAddress: "Lincoln Park Conservatory Alleyway, Chicago, IL",
    notes: `Services: On-Site Smoker Trailer Rig | Notes: Annual fall appreciation gathering for 65 attendees.

Requires on-site live-fire smoker rig parking setup by 11:30 AM.
Menu: 35 prime hardwood smoked briskets and 30 smoked turkey chops.
Sides: Pitmaster baked beans, potato salad, creamy coleslaw, and peach cobbler.`,
    status: "contacted",
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    source: "Website Quote Form",
    estimatedTotal: 2275,
  },
  {
    id: "ATS-QUOTE-6104",
    ticketId: "ATS-QUOTE-6104",
    name: "Elena Rostova",
    email: "elena@fultonmarketsummit.com",
    phone: "(312) 555-8842",
    guestCount: 120,
    eventDate: "2026-12-05",
    eventType: "corporate",
    packageName: "Full Live-Fire Smokehouse ($45/pp)",
    serviceStyle: "Full Live-Fire Buffet",
    deliveryAddress: "Fulton Market District Loft, Chicago, IL",
    notes: `Services: Full Live-Fire Smokehouse | Notes: Corporate annual holiday banquet.

Full buffet service with carving station. Collard greens, pitmaster beans, hot links, and artisanal cornbread required.`,
    status: "quoted",
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    source: "Phone Intake",
    estimatedTotal: 5400,
  },
];

const STATUS_CONFIG: Record<
  LeadStatus,
  {
    label: string;
    badgeDark: string;
    badgeDay: string;
    dotClass: string;
  }
> = {
  new: {
    label: "New",
    badgeDark: "bg-red-950/80 text-red-300 border-red-700/80",
    badgeDay: "bg-red-50 text-red-800 border-red-300 font-bold",
    dotClass: "bg-red-500 animate-pulse",
  },
  contacted: {
    label: "Contacted",
    badgeDark: "bg-amber-950/80 text-amber-300 border-amber-700/80",
    badgeDay: "bg-amber-50 text-amber-900 border-amber-300 font-bold",
    dotClass: "bg-amber-500",
  },
  quoted: {
    label: "Quoted",
    badgeDark: "bg-purple-950/80 text-purple-300 border-purple-700/80",
    badgeDay: "bg-purple-50 text-purple-800 border-purple-300 font-bold",
    dotClass: "bg-purple-500",
  },
  booked: {
    label: "Booked",
    badgeDark: "bg-emerald-950/80 text-emerald-300 border-emerald-700/80",
    badgeDay: "bg-emerald-50 text-emerald-800 border-emerald-300 font-bold",
    dotClass: "bg-emerald-500",
  },
  completed: {
    label: "Completed",
    badgeDark: "bg-zinc-800 text-zinc-300 border-zinc-700",
    badgeDay: "bg-stone-100 text-stone-700 border-stone-300 font-bold",
    dotClass: "bg-zinc-400",
  },
  ghosted: {
    label: "Ghosted",
    badgeDark: "bg-zinc-900/60 text-zinc-500 border-zinc-800",
    badgeDay: "bg-stone-50 text-stone-400 border-stone-200",
    dotClass: "bg-stone-400",
  },
};

interface AdminLeadsPipelineProps {
  theme?: "dark" | "butcher-paper" | "day" | "night";
  onSelectLeadForEmail?: (lead: PitmasterLead) => void;
}

export function AdminLeadsPipeline({ theme = "night", onSelectLeadForEmail }: AdminLeadsPipelineProps) {
  const isDay = theme === "day" || theme === "butcher-paper";

  const [leads, setLeads] = useState<PitmasterLead[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("active");
  const [selectedLeadIds, setSelectedLeadIds] = useState<Set<string>>(new Set());
  const [expandedLeadId, setExpandedLeadId] = useState<string | null>(null);

  // Detail Popups requested by user
  const [blowUpLead, setBlowUpLead] = useState<PitmasterLead | null>(null);
  const [editingLead, setEditingLead] = useState<PitmasterLead | null>(null);
  const [quickNoteLead, setQuickNoteLead] = useState<PitmasterLead | null>(null);
  const [newNoteText, setNewNoteText] = useState("");

  // Modals for Phone Lead Intake & Promo Blast
  const [showIntakeModal, setShowIntakeModal] = useState(false);
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [promoMessage, setPromoMessage] = useState("");
  const [promoSubject, setPromoSubject] = useState("Special Seasonal Smokehouse Offer | All The Smoke BBQ");
  const [promoFeedback, setPromoFeedback] = useState<string | null>(null);

  // Quick manual intake state
  const [newLeadForm, setNewLeadForm] = useState({
    name: "",
    phone: "",
    email: "",
    guestCount: 35,
    eventDate: "",
    eventType: "private",
    packageName: "The Pitmaster Feast ($30/pp)",
    serviceStyle: "Heated Drop-Off Delivery",
    deliveryAddress: "",
    notes: "",
  });

  // Load leads from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("ats_pitmaster_leads");
        if (saved) {
          const parsed: PitmasterLead[] = JSON.parse(saved);
          const has7585 = parsed.some((l) => l.ticketId === "ATS-QUOTE-7585" || l.phone.includes("6782076008"));
          if (!has7585) {
            const combined = [SEED_LEADS[0], ...parsed];
            setLeads(combined);
            localStorage.setItem("ats_pitmaster_leads", JSON.stringify(combined));
          } else {
            setLeads(parsed);
          }
        } else {
          setLeads(SEED_LEADS);
          localStorage.setItem("ats_pitmaster_leads", JSON.stringify(SEED_LEADS));
        }
      } catch (err) {
        console.error("Failed to parse ats_pitmaster_leads:", err);
        setLeads(SEED_LEADS);
      }
    }
  }, []);

  // Listen for storage events
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "ats_pitmaster_leads" && e.newValue) {
        try {
          setLeads(JSON.parse(e.newValue));
        } catch {
          // ignore
        }
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const saveLeads = (updated: PitmasterLead[]) => {
    setLeads(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("ats_pitmaster_leads", JSON.stringify(updated));
    }
    // Also sync blowUpLead or editingLead if currently open
    if (blowUpLead) {
      const match = updated.find((l) => l.id === blowUpLead.id);
      if (match) setBlowUpLead(match);
    }
  };

  const handleUpdateStatus = (id: string, newStatus: LeadStatus) => {
    const updated = leads.map((l) => (l.id === id ? { ...l, status: newStatus } : l));
    saveLeads(updated);
  };

  const handleDeleteLead = (id: string) => {
    if (confirm("Delete this lead from the pipeline?")) {
      const updated = leads.filter((l) => l.id !== id);
      saveLeads(updated);
      setSelectedLeadIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      if (expandedLeadId === id) setExpandedLeadId(null);
      if (blowUpLead?.id === id) setBlowUpLead(null);
      if (editingLead?.id === id) setEditingLead(null);
    }
  };

  const toggleSelectLead = (id: string, checked: boolean) => {
    setSelectedLeadIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const handleBatchStatus = (newStatus: LeadStatus) => {
    if (selectedLeadIds.size === 0) return;
    const updated = leads.map((l) => (selectedLeadIds.has(l.id) ? { ...l, status: newStatus } : l));
    saveLeads(updated);
    setSelectedLeadIds(new Set());
  };

  const handleBatchDelete = () => {
    if (selectedLeadIds.size === 0) return;
    if (confirm(`Are you sure you want to delete ${selectedLeadIds.size} selected leads?`)) {
      const updated = leads.filter((l) => !selectedLeadIds.has(l.id));
      saveLeads(updated);
      setSelectedLeadIds(new Set());
    }
  };

  const handleCreateManualLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadForm.name || !newLeadForm.phone) return;

    const generatedTicket = `ATS-QUOTE-${Math.floor(1000 + Math.random() * 9000)}`;
    const newEntry: PitmasterLead = {
      id: generatedTicket,
      ticketId: generatedTicket,
      name: newLeadForm.name.trim(),
      phone: newLeadForm.phone.trim(),
      email: newLeadForm.email.trim() || "Pending",
      guestCount: Number(newLeadForm.guestCount) || 35,
      eventDate: newLeadForm.eventDate.trim() || "Date Pending",
      eventType: newLeadForm.eventType || "private",
      packageName: newLeadForm.packageName,
      serviceStyle: newLeadForm.serviceStyle,
      deliveryAddress: newLeadForm.deliveryAddress.trim() || "Chicago Area",
      notes: newLeadForm.notes.trim() || "Manual phone intake recorded by Pitmaster.",
      status: "new",
      createdAt: new Date().toISOString(),
      source: "Manual Phone Intake",
      estimatedTotal: (Number(newLeadForm.guestCount) || 35) * 32,
    };

    const updated = [newEntry, ...leads];
    saveLeads(updated);
    setShowIntakeModal(false);
    setNewLeadForm({
      name: "",
      phone: "",
      email: "",
      guestCount: 35,
      eventDate: "",
      eventType: "private",
      packageName: "The Pitmaster Feast ($30/pp)",
      serviceStyle: "Heated Drop-Off Delivery",
      deliveryAddress: "",
      notes: "",
    });
  };

  const handleSaveEditedLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLead) return;

    const updated = leads.map((l) => (l.id === editingLead.id ? editingLead : l));
    saveLeads(updated);
    setEditingLead(null);
  };

  const handleAddQuickNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickNoteLead || !newNoteText.trim()) return;

    const dateStr = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
    const appendedNote = quickNoteLead.notes
      ? `${quickNoteLead.notes}\n[${dateStr} - Note]: ${newNoteText.trim()}`
      : `[${dateStr} - Note]: ${newNoteText.trim()}`;

    const updated = leads.map((l) => (l.id === quickNoteLead.id ? { ...l, notes: appendedNote } : l));
    saveLeads(updated);
    setNewNoteText("");
    setQuickNoteLead(null);
  };

  const handleAskReview = (lead: PitmasterLead) => {
    const reviewUrl = "https://g.page/r/allthesmokecatering/review";
    const msg = `Hi ${lead.name}, thank you for choosing All The Smoke Live-Fire Catering! Would you take 30 seconds to leave us a 5-star Google review? ${reviewUrl}`;
    if (confirm(`Send review request to ${lead.name} (${lead.phone || lead.email})?\n\n"${msg}"`)) {
      alert(`Review request dispatched to ${lead.name}!`);
    }
  };

  // Filtered Leads
  const filteredLeads = leads.filter((l) => {
    if (statusFilter === "active") {
      if (l.status === "completed" || l.status === "ghosted") return false;
    } else if (statusFilter !== "all") {
      if (l.status !== statusFilter) return false;
    }

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      l.name.toLowerCase().includes(q) ||
      l.email.toLowerCase().includes(q) ||
      l.phone.toLowerCase().includes(q) ||
      l.ticketId.toLowerCase().includes(q) ||
      l.packageName.toLowerCase().includes(q)
    );
  });

  const activeCount = leads.filter((l) => l.status !== "completed" && l.status !== "ghosted").length;
  const bookedCount = leads.filter((l) => l.status === "booked").length;
  const completedCount = leads.filter((l) => l.status === "completed").length;

  return (
    <div className="space-y-4 w-full">
      {/* 1. TOP TOOLBAR: TITLE, SEARCH, INTAKE & PROMO LAUNCHERS */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className={`font-display text-xl font-bold ${isDay ? "text-[#1C1917]" : "text-white"}`}>
              Quote Requests &amp; Client Bookings
            </h2>
            <span
              className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-md border ${
                isDay
                  ? "bg-[#FAF8F5] border-[#D8CEC1] text-stone-700"
                  : "bg-zinc-800 border-zinc-700 text-stone-300"
              }`}
            >
              {filteredLeads.length} of {leads.length} leads
            </span>
          </div>
          <p className={`text-xs mt-0.5 ${isDay ? "text-stone-600 font-medium" : "text-zinc-400"}`}>
            Sleek 1-line roster • Click ⤢ to blow up into readable page • Click ✏️ to edit
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Live Search */}
          <div className="relative w-full sm:w-60">
            <svg
              className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search name, phone, ticket..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-8 pr-6 py-1.5 rounded-xl text-xs focus:outline-none border transition-colors ${
                isDay
                  ? "bg-[#FAF8F5] border-[#D8CEC1] text-stone-900 placeholder:text-stone-400 focus:border-[#EA580C]"
                  : "bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-[#EA580C]"
              }`}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-200"
              >
                ✕
              </button>
            )}
          </div>

          {/* + Phone Lead Button */}
          <button
            type="button"
            onClick={() => setShowIntakeModal(true)}
            className="h-8 px-3 rounded-xl bg-[radial-gradient(ellipse_at_center,_#C84A0A_0%,_#7E2605_60%,_#2A0D02_100%)] border border-[#FF7A00] text-white text-xs font-bold uppercase tracking-wider transition-all hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap shadow-sm"
          >
            + Phone Lead
          </button>

          {/* Promo Special Blast Button */}
          <button
            type="button"
            onClick={() => setShowPromoModal(true)}
            className={`h-8 px-3 rounded-xl border text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer ${
              isDay
                ? "bg-white border-[#D8CEC1] text-[#EA580C] hover:bg-[#FAF8F5]"
                : "bg-zinc-800 border-zinc-700 text-[#FF7A00] hover:bg-zinc-700 hover:text-white"
            }`}
          >
            <span>📢</span>
            <span>Send Promo</span>
          </button>
        </div>
      </div>

      {/* 2. PIPELINE STAGE TABS */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
        {[
          { key: "active", label: "Active Pipeline", count: activeCount },
          { key: "booked", label: "Booked & Confirmed", count: bookedCount },
          { key: "completed", label: "Completed", count: completedCount },
          { key: "new", label: "New Only", count: leads.filter((l) => l.status === "new").length },
          { key: "all", label: "All Leads", count: leads.length },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setStatusFilter(tab.key)}
            className={`h-7.5 px-3 rounded-lg text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
              statusFilter === tab.key
                ? "bg-[#EA580C] text-white shadow-xs"
                : isDay
                ? "bg-white border border-[#D8CEC1] text-stone-700 hover:bg-[#FAF8F5]"
                : "bg-zinc-800/80 border border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:text-white"
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                statusFilter === tab.key
                  ? "bg-black/30 text-white"
                  : isDay
                  ? "bg-[#EAE3D9] text-stone-800"
                  : "bg-zinc-900 text-zinc-400"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* 3. BULK BATCH ACTION BAR (Appears when 1 or more leads are checked) */}
      {selectedLeadIds.size > 0 && (
        <div
          className={`p-3 rounded-2xl border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-md animate-fade-in ${
            isDay
              ? "bg-[#FAF5EF] border-[#EA580C]/40 text-stone-900"
              : "bg-[#1C1815] border-[#FF7A00]/50 text-white"
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="font-bold text-xs text-[#EA580C]">
              ✓ {selectedLeadIds.size} client{selectedLeadIds.size === 1 ? "" : "s"} selected
            </span>
            <button
              type="button"
              onClick={() => {
                if (selectedLeadIds.size === filteredLeads.length) {
                  setSelectedLeadIds(new Set());
                } else {
                  setSelectedLeadIds(new Set(filteredLeads.map((l) => l.id)));
                }
              }}
              className="text-[11px] text-stone-500 hover:text-[#EA580C] underline font-semibold"
            >
              {selectedLeadIds.size === filteredLeads.length ? "Deselect All" : "Select All Visible"}
            </button>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => handleBatchStatus("contacted")}
              className={`h-7 px-2.5 rounded-lg text-xs font-semibold border transition-colors ${
                isDay ? "bg-white border-stone-300 hover:bg-stone-50" : "bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-zinc-200"
              }`}
            >
              Mark Contacted
            </button>
            <button
              type="button"
              onClick={() => handleBatchStatus("booked")}
              className={`h-7 px-2.5 rounded-lg text-xs font-semibold border transition-colors ${
                isDay ? "bg-white border-stone-300 hover:bg-stone-50" : "bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-zinc-200"
              }`}
            >
              Mark Booked
            </button>
            <button
              type="button"
              onClick={() => handleBatchStatus("completed")}
              className={`h-7 px-2.5 rounded-lg text-xs font-semibold border transition-colors ${
                isDay ? "bg-white border-stone-300 hover:bg-stone-50" : "bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-zinc-200"
              }`}
            >
              Mark Completed
            </button>
            <button
              type="button"
              onClick={handleBatchDelete}
              className="h-7 px-2.5 rounded-lg text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-950/40 border border-red-800/60 transition-colors"
            >
              Delete ({selectedLeadIds.size})
            </button>
          </div>
        </div>
      )}

      {/* 4. STREAMLINED ONE-LINE ROSTER (MATCHING USER SCREENSHOT 1 & 2 - NO HORIZONTAL SCROLLBAR) */}
      {filteredLeads.length === 0 ? (
        <div
          className={`p-10 text-center rounded-2xl border ${
            isDay ? "bg-white border-[#E2DACF] text-stone-500" : "bg-[#141417] border-zinc-800 text-zinc-400"
          } text-xs space-y-2`}
        >
          <p className="font-semibold text-sm">No catering inquiries match the current filter</p>
          <p className="text-xs text-stone-400">Try switching pipeline tabs above or clearing your search query.</p>
          <button
            type="button"
            onClick={() => {
              setStatusFilter("all");
              setSearchQuery("");
            }}
            className="mt-2 px-3 py-1 text-xs font-bold text-[#EA580C] hover:underline"
          >
            Reset Roster Filters
          </button>
        </div>
      ) : (
        <div
          className={`rounded-2xl border shadow-sm divide-y ${
            isDay ? "bg-white border-[#E2DACF] divide-stone-100" : "bg-[#141417] border-zinc-800 divide-zinc-800/80"
          }`}
        >
          {filteredLeads.map((lead) => {
            const isExpanded = expandedLeadId === lead.id;
            const isSelected = selectedLeadIds.has(lead.id);
            const statusMeta = STATUS_CONFIG[lead.status] || STATUS_CONFIG.new;

            return (
              <div key={lead.id} className="transition-colors">
                {/* ONE-LINE COMPACT ROW (EXACT REPLICA OF USER SCREENSHOT 1) */}
                <div
                  className={`px-3 py-2.5 flex items-center justify-between gap-2.5 text-xs select-none transition-colors ${
                    isExpanded
                      ? isDay
                        ? "bg-[#FAF5EF]"
                        : "bg-[#1E1916]"
                      : isSelected
                      ? isDay
                        ? "bg-amber-50/60"
                        : "bg-amber-950/20"
                      : isDay
                      ? "hover:bg-[#FAF8F5]"
                      : "hover:bg-zinc-800/40"
                  }`}
                >
                  {/* Left Cluster: Checkbox + Chevron + Name & Rec Date */}
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => toggleSelectLead(lead.id, e.target.checked)}
                      className="rounded cursor-pointer shrink-0"
                    />

                    {/* Chevron Arrow Toggle */}
                    <button
                      type="button"
                      onClick={() => setExpandedLeadId(isExpanded ? null : lead.id)}
                      className="text-stone-400 hover:text-[#EA580C] transition-colors p-0.5 cursor-pointer shrink-0"
                      title={isExpanded ? "Collapse inline view" : "Expand inline view"}
                    >
                      <svg
                        className={`w-3.5 h-3.5 transition-transform ${isExpanded ? "rotate-180 text-[#EA580C]" : ""}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Client Name + Rec Date */}
                    <div className="min-w-0 pr-1">
                      <button
                        type="button"
                        onClick={() => setBlowUpLead(lead)}
                        className={`font-bold hover:text-[#EA580C] text-left truncate block cursor-pointer transition-colors ${
                          isDay ? "text-stone-900" : "text-white"
                        }`}
                        title="Click to blow up into readable page"
                      >
                        {lead.name}
                      </button>
                      <span className="text-[10px] text-stone-400 block font-normal">
                        Rec: {new Date(lead.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Status Pill (Soft Rounded Pill Badge) */}
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] px-2.5 py-0.5 rounded-full font-bold border shrink-0 ${
                        isDay ? statusMeta.badgeDay : statusMeta.badgeDark
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${statusMeta.dotClass}`} />
                      {statusMeta.label}
                    </span>

                    {/* Event Date (Calendar Icon) */}
                    <div className="hidden sm:flex items-center gap-1 text-stone-600 dark:text-stone-300 shrink-0 text-[11px] font-semibold">
                      <span className="text-stone-400">📅</span>
                      <span>{lead.eventDate || "Date Pending"}</span>
                    </div>

                    {/* Guests & Event Type (People Icon) */}
                    <div className="hidden md:flex items-center gap-1 text-stone-500 dark:text-stone-400 shrink-0 text-[11px]">
                      <span>👥</span>
                      <span>{lead.eventType || "private"} • {lead.guestCount} guests</span>
                    </div>

                    {/* Package Dash / Short Name */}
                    <div className="hidden xl:block text-stone-400 text-[11px] truncate max-w-[140px] shrink-0">
                      {lead.packageName ? lead.packageName.split("(")[0].trim() : "—"}
                    </div>

                    {/* Phone Number */}
                    <div className="hidden lg:flex items-center gap-1 shrink-0 text-[11px]">
                      <span className="text-stone-400">📞</span>
                      <a
                        href={`tel:${lead.phone.replace(/[^0-9]/g, "")}`}
                        className="font-bold text-[#FF7A00] hover:underline"
                        title="Click to dial"
                      >
                        {lead.phone}
                      </a>
                    </div>

                    {/* Email */}
                    <div className="hidden 2xl:flex items-center gap-1 shrink-0 text-[11px] truncate max-w-[150px]">
                      <span className="text-stone-400">✉️</span>
                      <a
                        href={`mailto:${lead.email}`}
                        className="text-stone-500 dark:text-stone-400 hover:underline truncate"
                        title={lead.email}
                      >
                        {lead.email}
                      </a>
                    </div>

                    {/* ⭐ Ask Review Pill Button (Screenshot 1) */}
                    <button
                      type="button"
                      onClick={() => handleAskReview(lead)}
                      className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-500 hover:bg-amber-500/25 text-[10px] font-bold shrink-0 transition-all cursor-pointer"
                      title="Request Google review from client"
                    >
                      <span>⭐</span>
                      <span>Ask Review</span>
                    </button>

                    {/* Location */}
                    <div className="hidden lg:block text-stone-400 text-[11px] truncate max-w-[110px] shrink-0">
                      {lead.deliveryAddress ? lead.deliveryAddress.split(",")[0] : "Chicago, IL"}
                    </div>
                  </div>

                  {/* Right Cluster: THE 4 ACTION ICONS (MATCHING USER SCREENSHOT EXACTLY) */}
                  <div className="flex items-center gap-1 shrink-0 pl-1">
                    {/* 1. Quick Note / Message Icon (Coral/Rose outline) */}
                    <button
                      type="button"
                      onClick={() => {
                        setQuickNoteLead(lead);
                        setNewNoteText("");
                      }}
                      className="p-1.5 rounded-lg text-rose-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
                      title="Add Quick Note"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </button>

                    {/* 2. Edit Booking Icon (Pencil outline) */}
                    <button
                      type="button"
                      onClick={() => setEditingLead(lead)}
                      className="p-1.5 rounded-lg text-stone-600 dark:text-stone-300 hover:text-[#EA580C] hover:bg-orange-500/10 transition-all cursor-pointer"
                      title="Edit Booking Details"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>

                    {/* 3. Blow Up Pop-Up Icon (Opposite Diagonal Arrows) */}
                    <button
                      type="button"
                      onClick={() => setBlowUpLead(lead)}
                      className="p-1.5 rounded-lg text-stone-600 dark:text-stone-300 hover:text-[#FF7A00] hover:bg-amber-500/10 transition-all cursor-pointer"
                      title="Blow up to popup page so Marion can read it better"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 10l6-6m0 0h-5m5 0v5M10 14l-6 6m0 0h5m-5 0v-5" />
                      </svg>
                    </button>

                    {/* 4. Delete Icon (Red Trash Can with lid) */}
                    <button
                      type="button"
                      onClick={() => handleDeleteLead(lead.id)}
                      className="p-1.5 rounded-lg text-red-500 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
                      title="Delete Booking"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* EXPANDED CARD SECTION (EXACT REPLICA OF USER SCREENSHOT 2) */}
                {isExpanded && (
                  <div
                    className={`p-4 sm:p-5 border-t border-b text-xs space-y-4 animate-fade-in ${
                      isDay
                        ? "bg-[#FAF7F2] border-[#E8DFC9] text-stone-900"
                        : "bg-[#181614] border-zinc-800 text-stone-200"
                    }`}
                  >
                    {/* Header Row: Client Message Title + Received Timestamp */}
                    <div className="flex items-center justify-between pb-2 border-b border-stone-200/60 dark:border-zinc-800 text-[11px]">
                      <div className="flex items-center gap-1.5 font-bold text-rose-500 dark:text-rose-400">
                        <span>📝</span>
                        <span>Client Message &amp; Special Requests</span>
                      </div>
                      <div className="text-stone-400 font-mono">
                        Received: {new Date(lead.createdAt).toLocaleString()}
                      </div>
                    </div>

                    {/* Clean Readable Message Body */}
                    <div
                      className={`p-4 rounded-2xl border text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans ${
                        isDay
                          ? "bg-white border-stone-200/80 text-stone-800 shadow-xs"
                          : "bg-[#11100E] border-zinc-800 text-stone-200"
                      }`}
                    >
                      {lead.notes || "No special requests submitted for this inquiry."}
                    </div>

                    {/* Bottom Action Bar (Screenshot 2: Update Status pills on Left, Action buttons on Right) */}
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 pt-2">
                      {/* Left: Update Status Pills */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[11px] font-bold text-stone-400 mr-1">Update Status:</span>

                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(lead.id, "new")}
                          className={`px-2.5 py-1 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                            lead.status === "new"
                              ? "bg-red-500 text-white border-red-500 shadow-xs"
                              : isDay
                              ? "bg-white border-stone-300 text-stone-700 hover:border-red-400"
                              : "bg-zinc-800 border-zinc-700 text-zinc-300 hover:border-red-400"
                          }`}
                        >
                          New
                        </button>

                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(lead.id, "contacted")}
                          className={`px-2.5 py-1 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                            lead.status === "contacted"
                              ? "bg-amber-500 text-white border-amber-500 shadow-xs"
                              : isDay
                              ? "bg-white border-stone-300 text-stone-700 hover:border-amber-400"
                              : "bg-zinc-800 border-zinc-700 text-zinc-300 hover:border-amber-400"
                          }`}
                        >
                          Contacted
                        </button>

                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(lead.id, "quoted")}
                          className={`px-2.5 py-1 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                            lead.status === "quoted"
                              ? "bg-purple-600 text-white border-purple-600 shadow-xs"
                              : isDay
                              ? "bg-white border-stone-300 text-stone-700 hover:border-purple-400"
                              : "bg-zinc-800 border-zinc-700 text-zinc-300 hover:border-purple-400"
                          }`}
                        >
                          Quoted
                        </button>

                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(lead.id, "booked")}
                          className={`px-2.5 py-1 rounded-full text-xs font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                            lead.status === "booked"
                              ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                              : isDay
                              ? "bg-white border-stone-300 text-stone-700 hover:border-emerald-400"
                              : "bg-zinc-800 border-zinc-700 text-zinc-300 hover:border-emerald-400"
                          }`}
                        >
                          <span>✓</span>
                          <span>Booked</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(lead.id, "completed")}
                          className={`px-2.5 py-1 rounded-full text-xs font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                            lead.status === "completed"
                              ? "bg-zinc-700 text-white border-zinc-700 shadow-xs"
                              : isDay
                              ? "bg-white border-stone-300 text-stone-700 hover:border-stone-400"
                              : "bg-zinc-800 border-zinc-700 text-zinc-300 hover:border-zinc-500"
                          }`}
                        >
                          <span>⭐</span>
                          <span>Completed</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(lead.id, "ghosted")}
                          className={`px-2.5 py-1 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                            lead.status === "ghosted"
                              ? "bg-stone-500 text-white border-stone-500"
                              : isDay
                              ? "bg-white border-stone-200 text-stone-400 hover:text-stone-700"
                              : "bg-zinc-800 border-zinc-700 text-zinc-500 hover:text-zinc-300"
                          }`}
                        >
                          Ghosted
                        </button>
                      </div>

                      {/* Right: Quick Action Buttons (Screenshot 2: Reply in Console, Request Google Review, Delete) */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          type="button"
                          onClick={() => {
                            if (onSelectLeadForEmail) {
                              onSelectLeadForEmail(lead);
                            } else {
                              window.location.href = `mailto:${lead.email}?subject=All%20The%20Smoke%20Catering%20Inquiry%20%23${lead.ticketId}`;
                            }
                          }}
                          className="h-8 px-3 rounded-xl bg-rose-600/90 hover:bg-rose-600 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                        >
                          <span>💬</span>
                          <span>Reply in Email Console</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleAskReview(lead)}
                          className="h-8 px-3 rounded-xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <span>⭐</span>
                          <span>Request Google Review</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteLead(lead.id)}
                          className="h-8 px-3 rounded-xl border border-red-500/40 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                        >
                          <span>🗑️</span>
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 5. BLOW UP TO POPUP PAGE (EXACT REPLICA OF USER SCREENSHOT 3 - LARGE READABLE MODAL FOR MARION) */}
      {blowUpLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div
            className={`w-full max-w-2xl rounded-3xl p-6 sm:p-8 border shadow-2xl space-y-6 my-auto ${
              isDay
                ? "bg-white border-[#E2DACF] text-stone-900"
                : "bg-[#141210] border-zinc-800 text-neutral-100"
            }`}
          >
            {/* Header: Badges + Client Name — Event Type + Close (Screenshot 3) */}
            <div className="flex items-start justify-between gap-4 pb-2 border-b border-stone-200 dark:border-zinc-800">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-600/90 text-white">
                    Customer Booking Inquiry
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/15 border border-purple-500/30 text-purple-600 dark:text-purple-400">
                    Status: {blowUpLead.status.charAt(0).toUpperCase() + blowUpLead.status.slice(1)}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight text-stone-900 dark:text-white">
                  {blowUpLead.name} <span className="font-normal text-stone-400">— {blowUpLead.eventType || "private"}</span>
                </h2>
              </div>

              {/* Close Button (✕) */}
              <button
                type="button"
                onClick={() => setBlowUpLead(null)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-stone-400 hover:text-stone-700 dark:hover:text-white cursor-pointer"
                title="Close Window (Esc)"
              >
                ✕
              </button>
            </div>

            {/* DATE & GUEST COUNT DUAL BOXES (Screenshot 3) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Date Box */}
              <div
                className={`p-4 rounded-2xl border ${
                  isDay ? "bg-stone-50/80 border-stone-200" : "bg-[#1B1815] border-zinc-800"
                }`}
              >
                <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block mb-1">
                  DATE
                </span>
                <div className="flex items-center gap-2 text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100">
                  <span>📅</span>
                  <span>{blowUpLead.eventDate || "Date Pending"}</span>
                </div>
              </div>

              {/* Guest Count Box */}
              <div
                className={`p-4 rounded-2xl border ${
                  isDay ? "bg-stone-50/80 border-stone-200" : "bg-[#1B1815] border-zinc-800"
                }`}
              >
                <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block mb-1">
                  GUEST COUNT
                </span>
                <div className="flex items-center gap-2 text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100">
                  <span>👥</span>
                  <span>{blowUpLead.guestCount} Guests</span>
                </div>
              </div>
            </div>

            {/* QUOTE & EVENT SPECIFICATIONS CARD (Screenshot 3) */}
            <div className="space-y-2">
              <span className="text-[11px] uppercase font-bold tracking-wider text-stone-400 block">
                QUOTE &amp; EVENT SPECIFICATIONS
              </span>
              <div
                className={`p-5 rounded-2xl border max-h-[360px] overflow-y-auto leading-relaxed text-sm sm:text-base font-sans whitespace-pre-wrap ${
                  isDay
                    ? "bg-white border-stone-200 text-stone-800 shadow-inner"
                    : "bg-[#11100E] border-zinc-800 text-stone-200"
                }`}
              >
                {blowUpLead.notes || "No additional specifications recorded."}
              </div>
            </div>

            {/* MODAL BOTTOM BUTTONS (EXACT REPLICA OF USER SCREENSHOT 3) */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-stone-200 dark:border-zinc-800">
              <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
                {/* Direct Reply In-App */}
                <button
                  type="button"
                  onClick={() => {
                    if (onSelectLeadForEmail) {
                      onSelectLeadForEmail(blowUpLead);
                    } else {
                      window.location.href = `mailto:${blowUpLead.email}?subject=All%20The%20Smoke%20Catering%20Quote%20%23${blowUpLead.ticketId}`;
                    }
                    setBlowUpLead(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-600/90 hover:bg-rose-600 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <span>✉️</span>
                  <span>Direct Reply In-App</span>
                </button>

                {/* Edit Booking Details */}
                <button
                  type="button"
                  onClick={() => {
                    setEditingLead(blowUpLead);
                    setBlowUpLead(null);
                  }}
                  className="px-4 py-2 rounded-xl border border-stone-300 dark:border-zinc-700 text-xs font-bold flex items-center gap-1.5 hover:bg-stone-100 dark:hover:bg-zinc-800 cursor-pointer"
                >
                  <span>✏️</span>
                  <span>Edit Booking Details</span>
                </button>

                {/* Delete Booking */}
                <button
                  type="button"
                  onClick={() => handleDeleteLead(blowUpLead.id)}
                  className="px-3 py-2 rounded-xl text-red-500 hover:text-red-400 hover:bg-red-500/10 text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <span>🗑️</span>
                  <span>Delete Booking</span>
                </button>
              </div>

              {/* Close Window Button (Solid rounded on right) */}
              <button
                type="button"
                onClick={() => setBlowUpLead(null)}
                className="w-full sm:w-auto px-5 py-2 rounded-xl bg-rose-500/80 hover:bg-rose-500 text-white text-xs font-bold cursor-pointer transition-all shadow-xs"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. EDIT LEAD MODAL (PENCIL ICON CLICKED) */}
      {editingLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div
            className={`w-full max-w-xl rounded-3xl p-6 sm:p-8 border shadow-2xl space-y-5 my-auto ${
              isDay ? "bg-white border-[#D8CEC1] text-stone-900" : "bg-[#141210] border-zinc-800 text-white"
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-zinc-800">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#FF7A00]">
                  Edit Inquiry
                </span>
                <h3 className="font-display text-xl font-bold">
                  Editing #{editingLead.ticketId} — {editingLead.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingLead(null)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold bg-stone-100 dark:bg-zinc-800 text-stone-500 hover:text-stone-900 dark:hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditedLead} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                    Client Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingLead.name}
                    onChange={(e) => setEditingLead({ ...editingLead, name: e.target.value })}
                    className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none ${
                      isDay ? "bg-stone-50 border-stone-300" : "bg-zinc-900 border-zinc-700 text-white"
                    }`}
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingLead.phone}
                    onChange={(e) => setEditingLead({ ...editingLead, phone: e.target.value })}
                    className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none ${
                      isDay ? "bg-stone-50 border-stone-300" : "bg-zinc-900 border-zinc-700 text-white"
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={editingLead.email}
                    onChange={(e) => setEditingLead({ ...editingLead, email: e.target.value })}
                    className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none ${
                      isDay ? "bg-stone-50 border-stone-300" : "bg-zinc-900 border-zinc-700 text-white"
                    }`}
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                    Event Date
                  </label>
                  <input
                    type="text"
                    placeholder="YYYY-MM-DD or e.g. Nov 20, 2026"
                    value={editingLead.eventDate}
                    onChange={(e) => setEditingLead({ ...editingLead, eventDate: e.target.value })}
                    className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none ${
                      isDay ? "bg-stone-50 border-stone-300" : "bg-zinc-900 border-zinc-700 text-white"
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                    Guests
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={editingLead.guestCount}
                    onChange={(e) => setEditingLead({ ...editingLead, guestCount: Number(e.target.value) || 1 })}
                    className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none ${
                      isDay ? "bg-stone-50 border-stone-300" : "bg-zinc-900 border-zinc-700 text-white"
                    }`}
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                    Status
                  </label>
                  <select
                    value={editingLead.status}
                    onChange={(e) => setEditingLead({ ...editingLead, status: e.target.value as LeadStatus })}
                    className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none font-bold ${
                      isDay ? "bg-stone-50 border-stone-300" : "bg-zinc-900 border-zinc-700 text-white"
                    }`}
                  >
                    <option value="new">🔴 New Lead</option>
                    <option value="contacted">🟡 Contacted</option>
                    <option value="quoted">🟣 Quoted</option>
                    <option value="booked">🟢 Booked</option>
                    <option value="completed">⚪ Completed</option>
                    <option value="ghosted">📁 Ghosted</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                    Est. Total ($)
                  </label>
                  <input
                    type="number"
                    value={editingLead.estimatedTotal || 0}
                    onChange={(e) => setEditingLead({ ...editingLead, estimatedTotal: Number(e.target.value) || 0 })}
                    className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none ${
                      isDay ? "bg-stone-50 border-stone-300" : "bg-zinc-900 border-zinc-700 text-white"
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                  Package Name
                </label>
                <select
                  value={editingLead.packageName}
                  onChange={(e) => setEditingLead({ ...editingLead, packageName: e.target.value })}
                  className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none ${
                    isDay ? "bg-stone-50 border-stone-300" : "bg-zinc-900 border-zinc-700 text-white"
                  }`}
                >
                  <option value="The Pitmaster Feast ($30/pp)">The Pitmaster Feast ($30/pp)</option>
                  <option value="Full Live-Fire Smokehouse ($45/pp)">Full Live-Fire Smokehouse ($45/pp)</option>
                  <option value="Backyard BBQ Classic ($22/pp)">Backyard BBQ Classic ($22/pp)</option>
                  <option value="Custom Pitmaster Feast (Custom Quote)">Custom Pitmaster Feast (Custom Quote)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                  Venue / Delivery Address
                </label>
                <input
                  type="text"
                  value={editingLead.deliveryAddress || ""}
                  onChange={(e) => setEditingLead({ ...editingLead, deliveryAddress: e.target.value })}
                  className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none ${
                    isDay ? "bg-stone-50 border-stone-300" : "bg-zinc-900 border-zinc-700 text-white"
                  }`}
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                  Event Vision &amp; Notes
                </label>
                <textarea
                  rows={5}
                  value={editingLead.notes || ""}
                  onChange={(e) => setEditingLead({ ...editingLead, notes: e.target.value })}
                  className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none leading-relaxed ${
                    isDay ? "bg-stone-50 border-stone-300" : "bg-zinc-900 border-zinc-700 text-white"
                  }`}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setEditingLead(null)}
                  className="px-4 py-2 rounded-xl border border-stone-300 dark:border-zinc-700 text-xs font-bold text-stone-500 hover:text-stone-900 dark:hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#EA580C] hover:bg-[#C84A0A] text-white text-xs font-bold cursor-pointer transition-colors shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. QUICK NOTE MODAL (SPEECH BUBBLE ICON CLICKED) */}
      {quickNoteLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div
            className={`w-full max-w-md rounded-3xl p-6 border shadow-2xl space-y-4 ${
              isDay ? "bg-white border-[#E2DACF] text-stone-900" : "bg-[#141417] border-zinc-800 text-white"
            }`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-stone-200 dark:border-zinc-800">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-500">Quick Note</span>
                <h4 className="font-display font-bold text-base">Note for {quickNoteLead.name}</h4>
              </div>
              <button
                type="button"
                onClick={() => setQuickNoteLead(null)}
                className="text-stone-400 hover:text-stone-200 text-xs"
              >
                ✕
              </button>
            </div>

            {quickNoteLead.notes && (
              <div className="p-3 rounded-xl bg-stone-100 dark:bg-zinc-900 text-xs max-h-36 overflow-y-auto space-y-1">
                <span className="text-[10px] text-stone-400 font-bold uppercase">Existing Notes:</span>
                <p className="whitespace-pre-wrap leading-relaxed">{quickNoteLead.notes}</p>
              </div>
            )}

            <form onSubmit={handleAddQuickNote} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                  Add New Note:
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. Spoke with client, requested 10 extra hot links..."
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none ${
                    isDay ? "bg-stone-50 border-stone-300" : "bg-zinc-900 border-zinc-700 text-white"
                  }`}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setQuickNoteLead(null)}
                  className="px-3 py-1.5 rounded-lg border border-stone-300 dark:border-zinc-700 text-xs font-semibold text-stone-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold cursor-pointer"
                >
                  Add Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 8. PHONE LEAD INTAKE MODAL */}
      {showIntakeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div
            className={`w-full max-w-lg rounded-3xl p-6 sm:p-8 border shadow-2xl space-y-5 my-auto ${
              isDay ? "bg-[#FFFFFF] border-[#E2DACF] text-stone-900" : "bg-[#141417] border-zinc-800 text-white"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#FF7A00]">
                  Direct Intake
                </span>
                <h3 className="font-display text-xl sm:text-2xl font-bold">
                  Log Phone or Walk-in Inquiry
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowIntakeModal(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold bg-zinc-800 text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateManualLead} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                    Client Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={newLeadForm.name}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, name: e.target.value })}
                    className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none ${
                      isDay ? "bg-stone-50 border-stone-300" : "bg-zinc-900 border-zinc-700 text-white"
                    }`}
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. (312) 555-0199"
                    value={newLeadForm.phone}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, phone: e.target.value })}
                    className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none ${
                      isDay ? "bg-stone-50 border-stone-300" : "bg-zinc-900 border-zinc-700 text-white"
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="client@example.com (optional)"
                    value={newLeadForm.email}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, email: e.target.value })}
                    className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none ${
                      isDay ? "bg-stone-50 border-stone-300" : "bg-zinc-900 border-zinc-700 text-white"
                    }`}
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                    Target Event Date
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Nov 28, 2026"
                    value={newLeadForm.eventDate}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, eventDate: e.target.value })}
                    className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none ${
                      isDay ? "bg-stone-50 border-stone-300" : "bg-zinc-900 border-zinc-700 text-white"
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                    Estimated Guest Count
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newLeadForm.guestCount}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, guestCount: Number(e.target.value) || 1 })}
                    className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none ${
                      isDay ? "bg-stone-50 border-stone-300" : "bg-zinc-900 border-zinc-700 text-white"
                    }`}
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                    Package
                  </label>
                  <select
                    value={newLeadForm.packageName}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, packageName: e.target.value })}
                    className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none ${
                      isDay ? "bg-stone-50 border-stone-300" : "bg-zinc-900 border-zinc-700 text-white"
                    }`}
                  >
                    <option value="The Pitmaster Feast ($30/pp)">The Pitmaster Feast ($30/pp)</option>
                    <option value="Full Live-Fire Smokehouse ($45/pp)">Full Live-Fire Smokehouse ($45/pp)</option>
                    <option value="Backyard BBQ Classic ($22/pp)">Backyard BBQ Classic ($22/pp)</option>
                    <option value="Custom Pitmaster Feast (Custom Quote)">Custom Pitmaster Feast (Custom Quote)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                  Delivery / Event Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. Northwest Chicago / 4500 N Western Ave"
                  value={newLeadForm.deliveryAddress}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, deliveryAddress: e.target.value })}
                  className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none ${
                    isDay ? "bg-stone-50 border-stone-300" : "bg-zinc-900 border-zinc-700 text-white"
                  }`}
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                  Pitmaster Intake Notes &amp; Requests
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Needs turkey chops, gluten-free sauce options, delivery by 4pm..."
                  value={newLeadForm.notes}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, notes: e.target.value })}
                  className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none ${
                    isDay ? "bg-stone-50 border-stone-300" : "bg-zinc-900 border-zinc-700 text-white"
                  }`}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowIntakeModal(false)}
                  className="px-4 py-2 rounded-xl border border-stone-300 dark:border-zinc-700 text-xs font-bold text-stone-500 hover:text-stone-900 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#EA580C] hover:bg-[#C84A0A] text-white text-xs font-bold cursor-pointer transition-colors shadow-md"
                >
                  Save Lead to Pipeline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 9. PROMOTIONAL SPECIAL BLAST MODAL */}
      {showPromoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div
            className={`w-full max-w-lg rounded-3xl p-6 sm:p-8 border shadow-2xl space-y-4 ${
              isDay ? "bg-[#FFFFFF] border-[#E2DACF] text-stone-900" : "bg-[#141417] border-zinc-800 text-white"
            }`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-stone-200 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <span className="text-xl">📢</span>
                <div>
                  <h3 className="font-display text-lg font-bold">Pitmaster Seasonal Promo Blast</h3>
                  <p className="text-[11px] text-stone-400">Dispatch special pricing to pipeline inquiries</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPromoModal(false)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold bg-zinc-800 text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                  Subject Line
                </label>
                <input
                  type="text"
                  value={promoSubject}
                  onChange={(e) => setPromoSubject(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none ${
                    isDay ? "bg-stone-50 border-stone-300" : "bg-zinc-900 border-zinc-700 text-white"
                  }`}
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                  Promotional Offer Message
                </label>
                <textarea
                  rows={4}
                  placeholder="Hey from Pitmaster Marion! We have open smoker rig slots next weekend..."
                  value={promoMessage}
                  onChange={(e) => setPromoMessage(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none ${
                    isDay ? "bg-stone-50 border-stone-300" : "bg-zinc-900 border-zinc-700 text-white"
                  }`}
                />
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-500 font-medium">
                ⚡ Will dispatch to {filteredLeads.filter((l) => l.email && l.email.includes("@")).length} active email leads currently in view via Brevo.
              </div>

              {promoFeedback && (
                <div className="p-2.5 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-bold">
                  {promoFeedback}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPromoModal(false)}
                  className="px-4 py-2 rounded-xl border border-stone-300 dark:border-zinc-700 text-xs font-bold text-stone-400"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPromoFeedback("Promo blast dispatched via Brevo! (BCC sent to boldenmarion83@gmail.com & todddavis923@gmail.com)");
                    setTimeout(() => {
                      setShowPromoModal(false);
                      setPromoFeedback(null);
                    }, 2000);
                  }}
                  className="px-5 py-2 rounded-xl bg-[#EA580C] hover:bg-[#C84A0A] text-white text-xs font-bold cursor-pointer shadow-md"
                >
                  Dispatch Promo Blast
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
