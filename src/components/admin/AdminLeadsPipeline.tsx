"use client";

import React, { useState, useEffect } from "react";

export type LeadStatus = "new" | "contacted" | "quoted" | "booked" | "completed" | "archived";

export interface PitmasterLead {
  id: string;
  ticketId: string;
  name: string;
  email: string;
  phone: string;
  guestCount: number;
  eventDate: string;
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
    eventDate: "Date Pending",
    packageName: "The Pitmaster Feast",
    serviceStyle: "Heated Drop-Off Delivery",
    deliveryAddress: "Chicago Area (Pending Confirmation)",
    notes: "Submitted via Website Homepage Reservation Form",
    status: "new",
    createdAt: new Date().toISOString(),
    source: "Homepage Reservation Form",
    estimatedTotal: 1050,
  },
  {
    id: "ATS-QUOTE-8221",
    ticketId: "ATS-QUOTE-8221",
    name: "Marcus Vance",
    email: "marcus.vance@chicagoevents.org",
    phone: "(773) 555-0199",
    guestCount: 65,
    eventDate: "November 14, 2026",
    packageName: "The Pitmaster Feast",
    serviceStyle: "On-Site Smoker Trailer Rig",
    deliveryAddress: "Lincoln Park Conservatory Alleyway, Chicago, IL",
    notes: "Requires rig parking setup. Whole turkey chops requested in addition to prime brisket.",
    status: "contacted",
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    source: "Interactive Quote Modal",
    estimatedTotal: 2275,
  },
  {
    id: "ATS-QUOTE-6104",
    ticketId: "ATS-QUOTE-6104",
    name: "Elena Rostova",
    email: "elena@fultonmarketsummit.com",
    phone: "(312) 555-8842",
    guestCount: 120,
    eventDate: "December 5, 2026",
    packageName: "Full Live-Fire Smokehouse",
    serviceStyle: "Full Live-Fire Buffet",
    deliveryAddress: "Fulton Market District Loft, Chicago, IL",
    notes: "Corporate annual holiday banquet. Mac & cheese, collards, and hot links required.",
    status: "booked",
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    source: "Phone Intake (Marion)",
    estimatedTotal: 4200,
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
    label: "New Lead",
    badgeDark: "bg-red-950/80 text-red-300 border-red-700/80",
    badgeDay: "bg-red-50 text-red-800 border-red-300 font-bold",
    dotClass: "bg-red-500 animate-pulse",
  },
  contacted: {
    label: "Contacted / In Discussion",
    badgeDark: "bg-amber-950/80 text-amber-300 border-amber-700/80",
    badgeDay: "bg-amber-50 text-amber-900 border-amber-300 font-bold",
    dotClass: "bg-amber-500",
  },
  quoted: {
    label: "Proposal / Quote Sent",
    badgeDark: "bg-blue-950/80 text-blue-300 border-blue-700/80",
    badgeDay: "bg-blue-50 text-blue-800 border-blue-300 font-bold",
    dotClass: "bg-blue-500",
  },
  booked: {
    label: "Deposit Confirmed / Booked",
    badgeDark: "bg-emerald-950/80 text-emerald-300 border-emerald-700/80",
    badgeDay: "bg-emerald-50 text-emerald-800 border-emerald-300 font-bold",
    dotClass: "bg-emerald-500",
  },
  completed: {
    label: "Cook Completed",
    badgeDark: "bg-zinc-800 text-zinc-300 border-zinc-700",
    badgeDay: "bg-stone-100 text-stone-700 border-stone-300 font-bold",
    dotClass: "bg-zinc-400",
  },
  archived: {
    label: "Archived / Inactive",
    badgeDark: "bg-zinc-900/60 text-zinc-500 border-zinc-800",
    badgeDay: "bg-stone-50 text-stone-400 border-stone-200",
    dotClass: "bg-stone-400",
  },
};

interface AdminLeadsPipelineProps {
  theme?: "dark" | "butcher-paper" | "day" | "night";
}

export function AdminLeadsPipeline({ theme = "night" }: AdminLeadsPipelineProps) {
  const isDay = theme === "day" || theme === "butcher-paper";

  const [leads, setLeads] = useState<PitmasterLead[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showIntakeModal, setShowIntakeModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<PitmasterLead | null>(null);

  // Quick manual intake state
  const [newLeadForm, setNewLeadForm] = useState({
    name: "",
    phone: "",
    email: "",
    guestCount: 35,
    eventDate: "",
    packageName: "The Pitmaster Feast",
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
          // Ensure Todd's test lead is present if not already added
          const has7585 = parsed.some((l) => l.ticketId === "ATS-QUOTE-7585" || l.phone.includes("6782076008") || l.phone.includes("678-207-6008"));
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
      setIsLoaded(true);
    }
  }, []);

  // Listen for storage events (if lead submitted in another tab)
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
  };

  const handleUpdateStatus = (id: string, newStatus: LeadStatus) => {
    const updated = leads.map((l) => (l.id === id ? { ...l, status: newStatus } : l));
    saveLeads(updated);
  };

  const handleDeleteLead = (id: string) => {
    if (confirm("Are you sure you want to delete this lead from the pipeline?")) {
      const updated = leads.filter((l) => l.id !== id);
      saveLeads(updated);
      if (selectedLead?.id === id) {
        setSelectedLead(null);
      }
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
      packageName: newLeadForm.packageName,
      serviceStyle: newLeadForm.serviceStyle,
      deliveryAddress: newLeadForm.deliveryAddress.trim() || "Chicago Area",
      notes: newLeadForm.notes.trim() || "Manual phone intake recorded by Pitmaster.",
      status: "new",
      createdAt: new Date().toISOString(),
      source: "Manual Pitmaster Intake",
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
      packageName: "The Pitmaster Feast",
      serviceStyle: "Heated Drop-Off Delivery",
      deliveryAddress: "",
      notes: "",
    });
  };

  const copyLeadSummary = (lead: PitmasterLead) => {
    const text = `ALL THE SMOKE CATERING LEAD:
Ticket: #${lead.ticketId}
Client: ${lead.name}
Phone: ${lead.phone}
Email: ${lead.email}
Date: ${lead.eventDate}
Guests: ${lead.guestCount}
Package: ${lead.packageName} (${lead.serviceStyle})
Address: ${lead.deliveryAddress || "Pending"}
Notes: ${lead.notes || "None"}`;

    navigator.clipboard.writeText(text);
    alert("Lead summary copied to clipboard! You can paste this directly into a text or pitmaster note.");
  };

  // Metrics
  const totalCount = leads.length;
  const newCount = leads.filter((l) => l.status === "new").length;
  const contactedCount = leads.filter((l) => l.status === "contacted" || l.status === "quoted").length;
  const bookedCount = leads.filter((l) => l.status === "booked").length;
  const totalGuests = leads.reduce((sum, l) => sum + (l.guestCount || 0), 0);

  // Filtered Leads
  const filteredLeads = leads.filter((l) => {
    const matchesStatus = statusFilter === "all" ? true : l.status === statusFilter;
    if (!matchesStatus) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      l.name.toLowerCase().includes(q) ||
      l.email.toLowerCase().includes(q) ||
      l.phone.toLowerCase().includes(q) ||
      l.ticketId.toLowerCase().includes(q) ||
      l.packageName.toLowerCase().includes(q) ||
      (l.notes && l.notes.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* 1. PIPELINE HEADER & ACTIONS */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase font-extrabold tracking-widest text-[#FF8C38]">
              Live Inbound Pipeline
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                newCount > 0
                  ? "bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse"
                  : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
              }`}
            >
              {newCount} New Inquiries
            </span>
          </div>
          <h2
            className={`font-display text-2xl sm:text-3xl font-bold tracking-tight ${
              isDay ? "text-[#1C1917]" : "text-white"
            }`}
          >
            Catering Leads &amp; Inquiry Pipeline
          </h2>
          <p className={`text-xs sm:text-sm mt-0.5 ${isDay ? "text-stone-600" : "text-zinc-400"}`}>
            Track incoming quote tickets from the website, manage follow-ups, and lock in smoke dates.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowIntakeModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[radial-gradient(ellipse_at_center,_#C84A0A_0%,_#7E2605_60%,_#2A0D02_100%)] border border-[#FF7A00]/80 shadow-[0_0_12px_rgba(255,122,0,0.35)] text-white text-xs font-bold uppercase tracking-wider transition-all hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <span>Log Phone Intake</span>
        </button>
      </div>

      {/* 2. STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div
          className={`p-4 rounded-2xl border transition-all ${
            isDay ? "bg-[#FFFFFF] border-[#E2DACF] shadow-sm" : "bg-[#141417] border-zinc-800"
          }`}
        >
          <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Total Leads</div>
          <div className={`text-2xl sm:text-3xl font-display font-black mt-1 ${isDay ? "text-stone-900" : "text-white"}`}>
            {totalCount}
          </div>
          <div className="text-[11px] text-stone-400 mt-0.5 font-medium">{totalGuests} estimated guests</div>
        </div>

        <div
          className={`p-4 rounded-2xl border transition-all ${
            isDay ? "bg-[#FFFFFF] border-[#E2DACF] shadow-sm" : "bg-[#141417] border-zinc-800"
          }`}
        >
          <div className="text-[11px] font-bold uppercase tracking-wider text-red-500 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            Needs Contact
          </div>
          <div className={`text-2xl sm:text-3xl font-display font-black mt-1 ${isDay ? "text-red-700" : "text-red-400"}`}>
            {newCount}
          </div>
          <div className="text-[11px] text-stone-400 mt-0.5 font-medium">Under 12h SLA response</div>
        </div>

        <div
          className={`p-4 rounded-2xl border transition-all ${
            isDay ? "bg-[#FFFFFF] border-[#E2DACF] shadow-sm" : "bg-[#141417] border-zinc-800"
          }`}
        >
          <div className="text-[11px] font-bold uppercase tracking-wider text-amber-500">In Discussion</div>
          <div className={`text-2xl sm:text-3xl font-display font-black mt-1 ${isDay ? "text-amber-700" : "text-amber-400"}`}>
            {contactedCount}
          </div>
          <div className="text-[11px] text-stone-400 mt-0.5 font-medium">Quotes &amp; custom menus sent</div>
        </div>

        <div
          className={`p-4 rounded-2xl border transition-all ${
            isDay ? "bg-[#FFFFFF] border-[#E2DACF] shadow-sm" : "bg-[#141417] border-zinc-800"
          }`}
        >
          <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-500">Booked &amp; Confirmed</div>
          <div className={`text-2xl sm:text-3xl font-display font-black mt-1 ${isDay ? "text-emerald-700" : "text-emerald-400"}`}>
            {bookedCount}
          </div>
          <div className="text-[11px] text-stone-400 mt-0.5 font-medium">Deposit locked on schedule</div>
        </div>
      </div>

      {/* 3. FILTER PILLS & SEARCH BAR */}
      <div
        className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 ${
          isDay ? "bg-[#FFFFFF] border-[#E2DACF] shadow-sm" : "bg-[#141417] border-zinc-800"
        }`}
      >
        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { key: "all", label: `All (${totalCount})` },
            { key: "new", label: `New (${newCount})` },
            { key: "contacted", label: "Contacted" },
            { key: "quoted", label: "Quoted" },
            { key: "booked", label: `Booked (${bookedCount})` },
            { key: "completed", label: "Completed" },
          ].map((pill) => (
            <button
              key={pill.key}
              type="button"
              onClick={() => setStatusFilter(pill.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                statusFilter === pill.key
                  ? "bg-[#EA580C] text-white shadow-sm"
                  : isDay
                  ? "bg-[#F4EFEA] text-stone-700 hover:bg-[#EBE4DC]"
                  : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white"
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name, phone, ticket..."
            className={`w-full pl-9 pr-3 py-1.5 rounded-xl text-xs focus:outline-none border transition-colors ${
              isDay
                ? "bg-[#FAF8F5] border-[#D8CEC1] text-stone-900 placeholder:text-stone-400 focus:border-[#EA580C]"
                : "bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-[#EA580C]"
            }`}
          />
        </div>
      </div>

      {/* 4. LEADS LIST FEED */}
      <div className="space-y-3">
        {filteredLeads.length === 0 ? (
          <div
            className={`p-12 text-center rounded-2xl border space-y-3 ${
              isDay ? "bg-[#FFFFFF] border-[#E2DACF]" : "bg-[#141417] border-zinc-800"
            }`}
          >
            <p className={`text-sm ${isDay ? "text-stone-500" : "text-zinc-400"}`}>
              No leads match the current search or status filter.
            </p>
          </div>
        ) : (
          filteredLeads.map((lead) => {
            const statusMeta = STATUS_CONFIG[lead.status] || STATUS_CONFIG.new;
            const isToddLead = lead.ticketId === "ATS-QUOTE-7585" || lead.phone.includes("6782076008");

            return (
              <div
                key={lead.id}
                className={`p-5 rounded-2xl border transition-all duration-200 relative overflow-hidden ${
                  isDay
                    ? "bg-[#FFFFFF] border-[#E2DACF] hover:border-amber-400 shadow-sm"
                    : "bg-[#141417] border-zinc-800/80 hover:border-zinc-700"
                } ${isToddLead ? "ring-2 ring-amber-500/40" : ""}`}
              >
                {/* Active Lead Pill Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-black px-2.5 py-1 rounded-md bg-stone-900 text-amber-400 border border-amber-500/30">
                      #{lead.ticketId}
                    </span>

                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                        isDay ? statusMeta.badgeDay : statusMeta.badgeDark
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${statusMeta.dotClass}`} />
                      {statusMeta.label}
                    </span>

                    <span className={`text-[11px] font-medium ${isDay ? "text-stone-500" : "text-zinc-500"}`}>
                      {lead.source} • {new Date(lead.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>

                  {/* Status Dropdown Switcher */}
                  <div className="flex items-center gap-2">
                    <label className={`text-[11px] font-bold uppercase tracking-wider ${isDay ? "text-stone-500" : "text-zinc-400"}`}>
                      Status:
                    </label>
                    <select
                      value={lead.status}
                      onChange={(e) => handleUpdateStatus(lead.id, e.target.value as LeadStatus)}
                      aria-label={`Update status for ${lead.name}`}
                      className={`text-xs font-bold rounded-lg px-2.5 py-1 border focus:outline-none transition-colors cursor-pointer ${
                        isDay
                          ? "bg-[#FAF8F5] border-[#D8CEC1] text-stone-900 focus:border-[#EA580C]"
                          : "bg-zinc-900 border-zinc-700 text-zinc-200 focus:border-[#EA580C]"
                      }`}
                    >
                      <option value="new">🔴 New Lead</option>
                      <option value="contacted">🟡 Contacted</option>
                      <option value="quoted">🔵 Quoted</option>
                      <option value="booked">🟢 Deposit Paid / Booked</option>
                      <option value="completed">⚪ Completed</option>
                      <option value="archived">📁 Archived</option>
                    </select>
                  </div>
                </div>

                {/* Lead Core Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-2 border-t border-b my-3 border-stone-200/50 dark:border-zinc-800/60">
                  {/* Column 1: Client & Contact */}
                  <div className="space-y-1">
                    <div className={`text-base font-bold ${isDay ? "text-stone-900" : "text-white"}`}>
                      {lead.name}
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <a
                        href={`tel:${lead.phone.replace(/[^0-9]/g, "")}`}
                        className="text-[#FF7A00] hover:underline font-semibold"
                      >
                        {lead.phone}
                      </a>
                      <span className="text-stone-400">•</span>
                      <a
                        href={`mailto:${lead.email}`}
                        className={`hover:underline truncate max-w-[180px] ${isDay ? "text-stone-600" : "text-zinc-400"}`}
                      >
                        {lead.email}
                      </a>
                    </div>
                  </div>

                  {/* Column 2: Event Logistics */}
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className={`font-semibold ${isDay ? "text-stone-800" : "text-zinc-300"}`}>
                        Event Date:
                      </span>
                      <span className={`font-bold ${isDay ? "text-[#C84A0A]" : "text-amber-400"}`}>
                        {lead.eventDate}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`font-semibold ${isDay ? "text-stone-800" : "text-zinc-300"}`}>
                        Guest Count:
                      </span>
                      <span className={`font-bold ${isDay ? "text-stone-900" : "text-white"}`}>
                        {lead.guestCount} guests
                      </span>
                    </div>
                  </div>

                  {/* Column 3: Package & Style */}
                  <div className="space-y-1 text-xs">
                    <div className={`font-bold ${isDay ? "text-stone-900" : "text-stone-200"}`}>
                      {lead.packageName}
                    </div>
                    <div className={`text-[11px] ${isDay ? "text-stone-600" : "text-zinc-400"}`}>
                      Style: {lead.serviceStyle}
                    </div>
                  </div>
                </div>

                {/* Notes & Location */}
                {(lead.notes || lead.deliveryAddress) && (
                  <div
                    className={`p-3 rounded-xl text-xs mb-3 space-y-1 ${
                      isDay ? "bg-[#FAF8F5] text-stone-700 border border-[#EAE3D9]" : "bg-zinc-900/80 text-zinc-300 border border-zinc-800"
                    }`}
                  >
                    {lead.deliveryAddress && (
                      <div className="flex items-start gap-1.5">
                        <span className="font-bold shrink-0 text-[#EA580C]">Venue/Address:</span>
                        <span>{lead.deliveryAddress}</span>
                      </div>
                    )}
                    {lead.notes && (
                      <div className="flex items-start gap-1.5">
                        <span className="font-bold shrink-0 text-stone-400">Notes:</span>
                        <span>{lead.notes}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Action Buttons Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <a
                      href={`tel:${lead.phone.replace(/[^0-9]/g, "")}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      Call Client
                    </a>

                    <a
                      href={`mailto:${lead.email}?subject=All%20The%20Smoke%20Catering%20Inquiry%20%23${lead.ticketId}`}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                        isDay
                          ? "bg-white border-[#D8CEC1] text-stone-800 hover:bg-stone-50"
                          : "bg-zinc-800 border-zinc-700 text-zinc-200 hover:bg-zinc-700"
                      }`}
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Email Client
                    </a>

                    <button
                      type="button"
                      onClick={() => copyLeadSummary(lead)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                        isDay
                          ? "bg-white border-[#D8CEC1] text-stone-700 hover:bg-stone-50"
                          : "bg-zinc-800/80 border-zinc-700/80 text-zinc-300 hover:bg-zinc-700"
                      }`}
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                      Copy Slip
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteLead(lead.id)}
                    aria-label={`Delete inquiry #${lead.ticketId}`}
                    className="text-stone-400 hover:text-red-500 text-xs p-1 rounded transition-colors cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 5. MANUAL PHONE INTAKE MODAL */}
      {showIntakeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div
            className={`w-full max-w-lg rounded-3xl p-6 sm:p-8 border shadow-2xl space-y-6 ${
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
                className="p-1 rounded-lg text-stone-400 hover:text-stone-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateManualLead} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold uppercase tracking-wider text-stone-400">Client Name *</label>
                  <input
                    type="text"
                    required
                    value={newLeadForm.name}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, name: e.target.value })}
                    placeholder="e.g. Todd Davis"
                    className="w-full h-10 px-3 rounded-xl border bg-stone-900/50 border-stone-700 text-white focus:outline-none focus:border-[#EA580C]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold uppercase tracking-wider text-stone-400">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={newLeadForm.phone}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, phone: e.target.value })}
                    placeholder="(773) 555-0199"
                    className="w-full h-10 px-3 rounded-xl border bg-stone-900/50 border-stone-700 text-white focus:outline-none focus:border-[#EA580C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold uppercase tracking-wider text-stone-400">Email Address</label>
                  <input
                    type="email"
                    value={newLeadForm.email}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, email: e.target.value })}
                    placeholder="client@example.com"
                    className="w-full h-10 px-3 rounded-xl border bg-stone-900/50 border-stone-700 text-white focus:outline-none focus:border-[#EA580C]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold uppercase tracking-wider text-stone-400">Guest Count</label>
                  <input
                    type="number"
                    min="10"
                    value={newLeadForm.guestCount}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, guestCount: Number(e.target.value) })}
                    className="w-full h-10 px-3 rounded-xl border bg-stone-900/50 border-stone-700 text-white focus:outline-none focus:border-[#EA580C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold uppercase tracking-wider text-stone-400">Target Date</label>
                  <input
                    type="text"
                    value={newLeadForm.eventDate}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, eventDate: e.target.value })}
                    placeholder="e.g. Nov 14, 2026"
                    className="w-full h-10 px-3 rounded-xl border bg-stone-900/50 border-stone-700 text-white focus:outline-none focus:border-[#EA580C]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold uppercase tracking-wider text-stone-400">Package</label>
                  <select
                    value={newLeadForm.packageName}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, packageName: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border bg-stone-900 border-stone-700 text-white focus:outline-none focus:border-[#EA580C]"
                  >
                    <option value="The Pitmaster Feast">The Pitmaster Feast</option>
                    <option value="Prime Brisket Experience">Prime Brisket Experience</option>
                    <option value="Whole Smoked Turkey Chops">Whole Smoked Turkey Chops</option>
                    <option value="Full Live-Fire Smokehouse">Full Live-Fire Smokehouse</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold uppercase tracking-wider text-stone-400">Venue Address</label>
                <input
                  type="text"
                  value={newLeadForm.deliveryAddress}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, deliveryAddress: e.target.value })}
                  placeholder="Street, City, Zip"
                  className="w-full h-10 px-3 rounded-xl border bg-stone-900/50 border-stone-700 text-white focus:outline-none focus:border-[#EA580C]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold uppercase tracking-wider text-stone-400">Notes / Requests</label>
                <textarea
                  rows={3}
                  value={newLeadForm.notes}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, notes: e.target.value })}
                  placeholder="Notes from call: serving style, dietary needs, smoker rig parking clearance..."
                  className="w-full p-3 rounded-xl border bg-stone-900/50 border-stone-700 text-white focus:outline-none focus:border-[#EA580C] resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowIntakeModal(false)}
                  className="px-4 py-2 rounded-xl border border-stone-700 text-stone-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#EA580C] hover:bg-[#C84A0A] text-white font-bold tracking-wide cursor-pointer"
                >
                  Save to Pipeline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
