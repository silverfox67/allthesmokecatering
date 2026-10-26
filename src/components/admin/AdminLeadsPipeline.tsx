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
    eventDate: "2026-11-20",
    packageName: "The Pitmaster Feast ($30/pp)",
    serviceStyle: "Heated Drop-Off Delivery",
    deliveryAddress: "Chicago Area (Pending Venue)",
    notes: "Submitted via Website Homepage Contact Form. Needs prime brisket and mac & cheese.",
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
    packageName: "The Pitmaster Feast ($30/pp)",
    serviceStyle: "On-Site Smoker Trailer Rig",
    deliveryAddress: "Lincoln Park Conservatory Alleyway, Chicago, IL",
    notes: "Requires trailer rig parking setup. 35 hardwood smoked turkey chops requested alongside brisket.",
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
    packageName: "Full Live-Fire Smokehouse ($45/pp)",
    serviceStyle: "Full Live-Fire Buffet",
    deliveryAddress: "Fulton Market District Loft, Chicago, IL",
    notes: "Corporate annual holiday banquet. Collard greens, pitmaster beans, and hot links required.",
    status: "booked",
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
    label: "New Lead",
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
    badgeDark: "bg-blue-950/80 text-blue-300 border-blue-700/80",
    badgeDay: "bg-blue-50 text-blue-800 border-blue-300 font-bold",
    dotClass: "bg-blue-500",
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
  archived: {
    label: "Archived",
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

  // Modals
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
      packageName: "The Pitmaster Feast ($30/pp)",
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
    alert("Lead summary copied to clipboard! You can paste this directly into a text or note.");
  };

  // Filtered Leads
  const filteredLeads = leads.filter((l) => {
    if (statusFilter === "active") {
      if (l.status === "completed" || l.status === "archived") return false;
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

  const activeCount = leads.filter((l) => l.status !== "completed" && l.status !== "archived").length;
  const bookedCount = leads.filter((l) => l.status === "booked").length;
  const completedCount = leads.filter((l) => l.status === "completed").length;

  return (
    <div className="space-y-4">
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
            Compact 1-line roster • Click any row or chevron for details • 1-tap call, email, &amp; status
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Live Search */}
          <div className="relative w-full sm:w-64">
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
            className="h-8 px-3 rounded-xl bg-[radial-gradient(ellipse_at_center,_#C84A0A_0%,_#7E2605_60%,_#2A0D02_100%)] border border-[#FF7A00] text-white text-xs font-bold uppercase tracking-wider transition-all hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap"
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

      {/* 4. HIGH-DENSITY 1-LINE TABLE ROSTER (Blind Cook Pattern) */}
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
          className={`rounded-2xl border shadow-sm overflow-hidden ${
            isDay ? "bg-white border-[#E2DACF]" : "bg-[#141417] border-zinc-800"
          }`}
        >
          <div className="overflow-x-auto min-w-full">
            <table className="w-full text-left text-xs whitespace-nowrap min-w-[980px] border-collapse">
              {/* Sticky Table Header */}
              <thead
                className={`border-b font-bold uppercase text-[10px] tracking-wider select-none ${
                  isDay
                    ? "bg-[#FAF8F5] border-[#E2DACF] text-stone-700"
                    : "bg-[#0E0D0C] border-zinc-800 text-stone-300"
                }`}
              >
                <tr>
                  <th className="py-2.5 px-3 w-8 text-center">
                    <input
                      type="checkbox"
                      checked={filteredLeads.length > 0 && selectedLeadIds.size === filteredLeads.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedLeadIds(new Set(filteredLeads.map((l) => l.id)));
                        } else {
                          setSelectedLeadIds(new Set());
                        }
                      }}
                      className="rounded cursor-pointer"
                      title="Select all visible"
                    />
                  </th>
                  <th className="py-2.5 px-1.5 w-6 text-center"></th>
                  <th className="py-2.5 px-3 min-w-[170px]">Client Name &amp; Ticket</th>
                  <th className="py-2.5 px-3 min-w-[100px]">Status</th>
                  <th className="py-2.5 px-3 min-w-[120px]">Event Date</th>
                  <th className="py-2.5 px-3 min-w-[140px]">Guests &amp; Package</th>
                  <th className="py-2.5 px-3 min-w-[120px]">Phone</th>
                  <th className="py-2.5 px-3 min-w-[160px]">Email</th>
                  <th className="py-2.5 px-3 min-w-[120px]">Location</th>
                  <th className="py-2.5 px-3 text-right pr-4 min-w-[100px]">Actions</th>
                </tr>
              </thead>

              {/* Table Body: 1-Line Density Rows + Accordion Dropdown */}
              <tbody className={`divide-y font-medium ${isDay ? "divide-stone-100" : "divide-zinc-800/80"}`}>
                {filteredLeads.map((lead) => {
                  const isExpanded = expandedLeadId === lead.id;
                  const isSelected = selectedLeadIds.has(lead.id);
                  const statusMeta = STATUS_CONFIG[lead.status] || STATUS_CONFIG.new;

                  return (
                    <React.Fragment key={lead.id}>
                      {/* 1-Line Compact Row */}
                      <tr
                        className={`transition-colors ${
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
                        {/* Checkbox */}
                        <td className="py-2.5 px-3 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => toggleSelectLead(lead.id, e.target.checked)}
                            className="rounded cursor-pointer"
                          />
                        </td>

                        {/* Accordion Expand Chevron */}
                        <td className="py-2.5 px-1.5 text-center">
                          <button
                            type="button"
                            onClick={() => setExpandedLeadId(isExpanded ? null : lead.id)}
                            className="text-stone-400 hover:text-[#EA580C] transition-colors p-0.5 cursor-pointer"
                            title={isExpanded ? "Collapse row" : "Expand details"}
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
                        </td>

                        {/* Client Name & Ticket */}
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setExpandedLeadId(isExpanded ? null : lead.id)}
                              className={`font-bold hover:text-[#EA580C] text-left truncate max-w-[150px] cursor-pointer ${
                                isDay ? "text-stone-900" : "text-white"
                              }`}
                            >
                              {lead.name}
                            </button>
                            <span className="font-mono text-[10px] text-amber-500 font-bold">
                              #{lead.ticketId}
                            </span>
                          </div>
                          <div className="text-[10px] text-stone-400">
                            Rec: {new Date(lead.createdAt).toLocaleDateString()} • {lead.source}
                          </div>
                        </td>

                        {/* Status Badge */}
                        <td className="py-2.5 px-3">
                          <span
                            className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                              isDay ? statusMeta.badgeDay : statusMeta.badgeDark
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${statusMeta.dotClass}`} />
                            {statusMeta.label}
                          </span>
                        </td>

                        {/* Event Date */}
                        <td className="py-2.5 px-3">
                          <span className={`font-semibold ${isDay ? "text-stone-900" : "text-stone-200"}`}>
                            {lead.eventDate || "Date Pending"}
                          </span>
                        </td>

                        {/* Guests & Package */}
                        <td className="py-2.5 px-3">
                          <div className="truncate max-w-[160px]">
                            <strong className={isDay ? "text-stone-900" : "text-white"}>{lead.guestCount}</strong> guests
                            <span className="text-stone-400 text-[11px] block truncate">{lead.packageName}</span>
                          </div>
                        </td>

                        {/* Phone */}
                        <td className="py-2.5 px-3">
                          <a
                            href={`tel:${lead.phone.replace(/[^0-9]/g, "")}`}
                            className="font-semibold text-[#FF7A00] hover:underline"
                            title="Click to dial"
                          >
                            {lead.phone}
                          </a>
                        </td>

                        {/* Email */}
                        <td className="py-2.5 px-3">
                          <a
                            href={`mailto:${lead.email}`}
                            className={`hover:underline truncate max-w-[150px] block ${
                              isDay ? "text-stone-700" : "text-stone-300"
                            }`}
                          >
                            {lead.email}
                          </a>
                        </td>

                        {/* Venue / Location */}
                        <td className="py-2.5 px-3">
                          <span
                            className={`truncate max-w-[120px] block ${isDay ? "text-stone-600" : "text-stone-400"}`}
                            title={lead.deliveryAddress || "Chicago Area"}
                          >
                            {lead.deliveryAddress || "Chicago Area"}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-2.5 px-3 text-right pr-4">
                          <div className="flex items-center justify-end gap-1.5">
                            <a
                              href={`tel:${lead.phone.replace(/[^0-9]/g, "")}`}
                              className="p-1 rounded text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10"
                              title="Call Client"
                            >
                              📞
                            </a>
                            <a
                              href={`mailto:${lead.email}?subject=All%20The%20Smoke%20Catering%20Inquiry%20%23${lead.ticketId}`}
                              className="p-1 rounded text-stone-400 hover:text-[#EA580C] hover:bg-orange-500/10"
                              title="Email Client"
                            >
                              ✉️
                            </a>
                            <button
                              type="button"
                              onClick={() => copyLeadSummary(lead)}
                              className="p-1 rounded text-stone-400 hover:text-stone-200 hover:bg-stone-500/10 cursor-pointer"
                              title="Copy Summary"
                            >
                              📋
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteLead(lead.id)}
                              className="p-1 rounded text-stone-400 hover:text-red-500 hover:bg-red-500/10 cursor-pointer"
                              title="Delete"
                            >
                              ✕
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Accordion Expanded Detail View (Below the 1-Line Row) */}
                      {isExpanded && (
                        <tr className={isDay ? "bg-[#FAF5EF]/90" : "bg-[#1E1916]/90"}>
                          <td colSpan={10} className="p-4 sm:p-5 border-t border-b border-stone-200/60 dark:border-zinc-800">
                            <div className="space-y-3 max-w-4xl">
                              <div className="flex flex-wrap items-center justify-between gap-3">
                                <div className="space-y-0.5">
                                  <div className="text-xs font-bold text-[#EA580C] uppercase tracking-wider">
                                    Inquiry Detail: #{lead.ticketId} • {lead.name}
                                  </div>
                                  <div className="text-xs text-stone-500">
                                    Service Style: <strong>{lead.serviceStyle}</strong> • Estimated Total: <strong>${lead.estimatedTotal || 0}</strong>
                                  </div>
                                </div>

                                {/* Status Changer in Accordion */}
                                <div className="flex items-center gap-2">
                                  <label className="text-xs font-bold text-stone-400">Change Status:</label>
                                  <select
                                    value={lead.status}
                                    onChange={(e) => handleUpdateStatus(lead.id, e.target.value as LeadStatus)}
                                    className={`text-xs font-bold rounded-lg px-2.5 py-1 border focus:outline-none transition-colors cursor-pointer ${
                                      isDay
                                        ? "bg-white border-stone-300 text-stone-900"
                                        : "bg-zinc-900 border-zinc-700 text-white"
                                    }`}
                                  >
                                    <option value="new">🔴 New Lead</option>
                                    <option value="contacted">🟡 Contacted</option>
                                    <option value="quoted">🔵 Quoted</option>
                                    <option value="booked">🟢 Booked / Deposit Paid</option>
                                    <option value="completed">⚪ Completed</option>
                                    <option value="archived">📁 Archived</option>
                                  </select>
                                </div>
                              </div>

                              {/* Customer Notes / Event Vision */}
                              <div
                                className={`p-3 rounded-xl border text-xs space-y-1 ${
                                  isDay
                                    ? "bg-white border-stone-200 text-stone-800"
                                    : "bg-zinc-900/90 border-zinc-800 text-stone-300"
                                }`}
                              >
                                <span className="font-bold text-stone-400 block text-[11px] uppercase tracking-wider">
                                  Event Vision &amp; Special Requests:
                                </span>
                                <p className="leading-relaxed">
                                  {lead.notes || "No additional notes submitted."}
                                </p>
                              </div>

                              {/* Direct action shortcuts */}
                              <div className="flex items-center gap-2 pt-1">
                                <button
                                  type="button"
                                  onClick={() => copyLeadSummary(lead)}
                                  className="px-3 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold cursor-pointer"
                                >
                                  Copy Full Client Slip
                                </button>
                                <a
                                  href={`tel:${lead.phone.replace(/[^0-9]/g, "")}`}
                                  className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                                >
                                  Call {lead.name}
                                </a>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. PHONE LEAD INTAKE MODAL */}
      {showIntakeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div
            className={`w-full max-w-lg rounded-3xl p-6 sm:p-8 border shadow-2xl space-y-5 ${
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
                    placeholder="e.g. Nov 20, 2026"
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
                    <option value="The Pitmaster Feast ($30/pp)">The Pitmaster Feast ($30/pp)</option>
                    <option value="Prime Brisket Experience ($35/pp)">Prime Brisket Experience ($35/pp)</option>
                    <option value="Whole Smoked Turkey Chops ($28/pp)">Whole Smoked Turkey Chops ($28/pp)</option>
                    <option value="Full Live-Fire Smokehouse ($45/pp)">Full Live-Fire Smokehouse ($45/pp)</option>
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
                  placeholder="Notes from call: serving style, dietary needs, trailer parking clearance..."
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

      {/* 6. PROMO CAMPAIGN MODAL (Blind Cook Feature) */}
      {showPromoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div
            className={`w-full max-w-lg rounded-3xl p-6 sm:p-8 border shadow-2xl space-y-5 ${
              isDay ? "bg-[#FFFFFF] border-[#E2DACF] text-stone-900" : "bg-[#141417] border-zinc-800 text-white"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#FF7A00]">
                  Promotional Broadcast
                </span>
                <h3 className="font-display text-xl sm:text-2xl font-bold">
                  Send Smokehouse Promo Special
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPromoModal(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-200"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-stone-400">
              Dispatches a promotional catering discount or seasonal menu offer to <strong>{filteredLeads.length}</strong> active leads currently visible in your roster.
            </p>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold uppercase tracking-wider text-stone-400">Email Subject</label>
                <input
                  type="text"
                  value={promoSubject}
                  onChange={(e) => setPromoSubject(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border bg-stone-900/50 border-stone-700 text-white focus:outline-none focus:border-[#EA580C]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold uppercase tracking-wider text-stone-400">Promo Announcement</label>
                <textarea
                  rows={5}
                  value={promoMessage}
                  onChange={(e) => setPromoMessage(e.target.value)}
                  placeholder="e.g. Book your smokehouse holiday catering date by Friday and receive 10% off whole prime brisket and specialty hardwood turkey chops!"
                  className="w-full p-3 rounded-xl border bg-stone-900/50 border-stone-700 text-white focus:outline-none focus:border-[#EA580C] resize-none"
                />
              </div>

              {promoFeedback && (
                <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-600 text-emerald-200 text-xs">
                  {promoFeedback}
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPromoModal(false)}
                  className="px-4 py-2 rounded-xl border border-stone-700 text-stone-300 hover:text-white"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPromoFeedback(`Promotional announcement queued for ${filteredLeads.length} leads!`);
                    setTimeout(() => setShowPromoModal(false), 1500);
                  }}
                  className="px-5 py-2 rounded-xl bg-[#EA580C] hover:bg-[#C84A0A] text-white font-bold tracking-wide cursor-pointer"
                >
                  Launch Promo Blast
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
