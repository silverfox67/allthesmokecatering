"use client";

import React, { useState, useEffect, useMemo } from "react";
import { AdminTheme } from "./AdminPortal";
import { PitmasterLead } from "./AdminLeadsPipeline";

interface AdminAnalyticsProps {
  theme: AdminTheme;
}

// Fallback seed data if no leads currently exist in localStorage
const DEFAULT_ANALYTICS_LEADS: PitmasterLead[] = [
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
    deliveryAddress: "Chicago Area (North Side)",
    status: "booked",
    createdAt: "2026-11-01T14:30:00.000Z",
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
    status: "booked",
    createdAt: "2026-11-02T10:15:00.000Z",
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
    status: "quoted",
    createdAt: "2026-11-03T18:45:00.000Z",
    source: "Phone Intake",
    estimatedTotal: 5400,
  },
  {
    id: "ATS-QUOTE-9932",
    ticketId: "ATS-QUOTE-9932",
    name: "Darius Washington",
    email: "dwash99@gmail.com",
    phone: "(312) 709-4411",
    guestCount: 85,
    eventDate: "2026-11-28",
    eventType: "wedding",
    packageName: "Full Live-Fire Smokehouse ($45/pp)",
    serviceStyle: "On-Site Smoker Trailer Rig",
    deliveryAddress: "Promontory Point, Hyde Park, Chicago, IL",
    status: "booked",
    createdAt: "2026-10-28T09:20:00.000Z",
    source: "Instagram / TikTok Reel",
    estimatedTotal: 4250,
  },
  {
    id: "ATS-QUOTE-4401",
    ticketId: "ATS-QUOTE-4401",
    name: "Sarah Jenkins",
    email: "sarah.j@alliedhealthchicago.com",
    phone: "(773) 891-2200",
    guestCount: 45,
    eventDate: "2026-11-18",
    eventType: "corporate",
    packageName: "The Pitmaster Feast ($30/pp)",
    serviceStyle: "Heated Drop-Off Delivery",
    deliveryAddress: "Rosemont Corporate Center, Des Plaines, IL",
    status: "completed",
    createdAt: "2026-10-15T11:00:00.000Z",
    source: "Google Search (Local SEO)",
    estimatedTotal: 1575,
  },
  {
    id: "ATS-QUOTE-3329",
    ticketId: "ATS-QUOTE-3329",
    name: "Coach Malik Bell",
    email: "malik.bell@cps.edu",
    phone: "(773) 441-9080",
    guestCount: 50,
    eventDate: "2026-11-21",
    eventType: "private",
    packageName: "Party Pans & Bulk BBQ ($25/pp est)",
    serviceStyle: "Commissary Pickup",
    deliveryAddress: "Northwest Side Commissary, Chicago, IL",
    status: "contacted",
    createdAt: "2026-11-03T20:10:00.000Z",
    source: "Word of Mouth / Referral",
    estimatedTotal: 1250,
  },
  {
    id: "ATS-QUOTE-1194",
    ticketId: "ATS-QUOTE-1194",
    name: "Kendall Brooks",
    email: "kbrooks@wickerparklofts.com",
    phone: "(312) 604-1888",
    guestCount: 110,
    eventDate: "2026-12-19",
    eventType: "corporate",
    packageName: "Full Live-Fire Smokehouse ($45/pp)",
    serviceStyle: "On-Site Smoker Trailer Rig",
    deliveryAddress: "Wicker Park Loft Space, Chicago, IL",
    status: "quoted",
    createdAt: "2026-11-02T16:22:00.000Z",
    source: "Tabletop QR Tent Display",
    estimatedTotal: 4950,
  },
];

type TimeRangeFilter = "all" | "this-month" | "upcoming";

export function AdminAnalytics({ theme }: AdminAnalyticsProps) {
  const isDay = theme === "day";
  const [leads, setLeads] = useState<PitmasterLead[]>(DEFAULT_ANALYTICS_LEADS);
  const [timeFilter, setTimeFilter] = useState<TimeRangeFilter>("all");
  const [monthlyTarget] = useState<number>(25000); // Marion's monthly catering target ($25k)

  // Load actual leads from localStorage if available
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("ats_pitmaster_leads");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setLeads(parsed);
          }
        }
      } catch (e) {
        console.warn("Could not load leads for analytics:", e);
      }
    }
  }, []);

  // Filter leads based on selected timeframe
  const filteredLeads = useMemo(() => {
    if (timeFilter === "all") return leads;

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return leads.filter((lead) => {
      const eventDate = new Date(lead.eventDate || lead.createdAt);
      if (timeFilter === "this-month") {
        return eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear;
      }
      if (timeFilter === "upcoming") {
        return eventDate.getTime() >= now.getTime();
      }
      return true;
    });
  }, [leads, timeFilter]);

  // Executive Revenue Metrics
  const metrics = useMemo(() => {
    let bookedRevenue = 0;
    let pendingQuotedRevenue = 0;
    let totalGuestsBooked = 0;
    let totalGuestsProjected = 0;
    let bookedCount = 0;
    let quotedCount = 0;
    let totalLeadsCount = filteredLeads.length;

    filteredLeads.forEach((lead) => {
      const total = Number(lead.estimatedTotal) || (lead.guestCount ? lead.guestCount * 30 : 0);
      const guests = Number(lead.guestCount) || 0;

      totalGuestsProjected += guests;

      if (lead.status === "booked" || lead.status === "completed") {
        bookedRevenue += total;
        totalGuestsBooked += guests;
        bookedCount += 1;
      } else if (lead.status === "quoted" || lead.status === "contacted" || lead.status === "new") {
        pendingQuotedRevenue += total;
        quotedCount += 1;
      }
    });

    const conversionRate = totalLeadsCount > 0 ? ((bookedCount / totalLeadsCount) * 100).toFixed(1) : "0.0";
    const avgOrderValue = bookedCount > 0 ? Math.round(bookedRevenue / bookedCount) : 0;
    const avgPerPersonYield = totalGuestsBooked > 0 ? (bookedRevenue / totalGuestsBooked).toFixed(2) : "0.00";
    const targetProgressPct = Math.min(100, Math.round((bookedRevenue / monthlyTarget) * 100));

    // 50% locked-in deposit math
    const lockedDeposits = Math.round(bookedRevenue * 0.5);
    const dayOfBalances = bookedRevenue - lockedDeposits;

    return {
      bookedRevenue,
      pendingQuotedRevenue,
      totalPipeline: bookedRevenue + pendingQuotedRevenue,
      totalGuestsBooked,
      totalGuestsProjected,
      bookedCount,
      quotedCount,
      totalLeadsCount,
      conversionRate,
      avgOrderValue,
      avgPerPersonYield,
      targetProgressPct,
      lockedDeposits,
      dayOfBalances,
    };
  }, [filteredLeads, monthlyTarget]);

  // Breakdown by Event Type (Corporate, Wedding, Private)
  const eventTypeBreakdown = useMemo(() => {
    const counts: Record<string, { count: number; revenue: number }> = {
      corporate: { count: 0, revenue: 0 },
      wedding: { count: 0, revenue: 0 },
      private: { count: 0, revenue: 0 },
      other: { count: 0, revenue: 0 },
    };

    filteredLeads.forEach((lead) => {
      const type = (lead.eventType || "private").toLowerCase();
      const target = counts[type] || counts.other;
      const total = Number(lead.estimatedTotal) || (lead.guestCount ? lead.guestCount * 30 : 0);

      target.count += 1;
      target.revenue += total;
    });

    const totalRev = Object.values(counts).reduce((sum, item) => sum + item.revenue, 0) || 1;

    return [
      { key: "corporate", label: "Corporate Banquets & Galas", count: counts.corporate.count, revenue: counts.corporate.revenue, pct: Math.round((counts.corporate.revenue / totalRev) * 100), color: "bg-amber-500" },
      { key: "wedding", label: "Weddings & Rehearsal Dinners", count: counts.wedding.count, revenue: counts.wedding.revenue, pct: Math.round((counts.wedding.revenue / totalRev) * 100), color: "bg-emerald-500" },
      { key: "private", label: "Private Celebrations & Game Days", count: counts.private.count, revenue: counts.private.revenue, pct: Math.round((counts.private.revenue / totalRev) * 100), color: "bg-orange-500" },
    ];
  }, [filteredLeads]);

  // Package Popularity
  const packageBreakdown = useMemo(() => {
    let fullSmokehouseRev = 0;
    let pitmasterFeastRev = 0;
    let partyPansRev = 0;

    filteredLeads.forEach((lead) => {
      const total = Number(lead.estimatedTotal) || 0;
      const pkg = (lead.packageName || "").toLowerCase();
      if (pkg.includes("live-fire") || pkg.includes("smokehouse") || pkg.includes("45")) {
        fullSmokehouseRev += total;
      } else if (pkg.includes("pitmaster") || pkg.includes("feast") || pkg.includes("30")) {
        pitmasterFeastRev += total;
      } else {
        partyPansRev += total;
      }
    });

    const total = fullSmokehouseRev + pitmasterFeastRev + partyPansRev || 1;

    return [
      { name: "Full Live-Fire Smokehouse ($45/pp)", revenue: fullSmokehouseRev, pct: Math.round((fullSmokehouseRev / total) * 100), badge: "Highest Margin" },
      { name: "The Pitmaster Feast ($30/pp)", revenue: pitmasterFeastRev, pct: Math.round((pitmasterFeastRev / total) * 100), badge: "Most Popular" },
      { name: "A La Carte Bulk Pans & Reserve", revenue: partyPansRev, pct: Math.round((partyPansRev / total) * 100), badge: "Volume Add-On" },
    ];
  }, [filteredLeads]);

  // Smokehouse Prep & Butcher Estimator (Pounds of meat needed for booked events)
  const butcherProjections = useMemo(() => {
    // Estimating ~0.65 lbs raw brisket per guest, ~0.4 slabs ribs per guest, 0.5 lbs poultry/chops
    const guests = metrics.totalGuestsBooked;

    return [
      {
        meat: "Prime Texas Beef Brisket",
        icon: "🥩",
        rawPounds: Math.round(guests * 0.7),
        yieldPounds: Math.round(guests * 0.38),
        cutsNote: `Approx. ${Math.ceil((guests * 0.7) / 14)} full packer briskets (14-16 lb packers)`,
      },
      {
        meat: "St. Louis Spare Rib Slabs",
        icon: "🍖",
        rawPounds: Math.round(guests * 0.4),
        yieldPounds: Math.round(guests * 0.4), // Slabs
        cutsNote: `Approx. ${Math.ceil(guests * 0.35)} slabs trimmed cherry-smoked ribs`,
      },
      {
        meat: "Pit-Smoked Turkey Chops & Wings",
        icon: "🍗",
        rawPounds: Math.round(guests * 0.5),
        yieldPounds: Math.round(guests * 0.45),
        cutsNote: `Approx. ${Math.round(guests * 0.5)} lbs brined poultry cuts`,
      },
      {
        meat: "Scratch Sides (Beans, Mac & Yams)",
        icon: "🧀",
        rawPounds: Math.ceil(guests / 20), // Half pans
        yieldPounds: Math.ceil(guests / 20),
        cutsNote: `Approx. ${Math.ceil(guests / 18)} deep aluminum half pans per side`,
      },
    ];
  }, [metrics.totalGuestsBooked]);

  // 1-Click CSV Export for Marion's records
  const handleExportCSV = () => {
    const headers = [
      "Ticket ID",
      "Client Name",
      "Email",
      "Phone",
      "Event Date",
      "Event Type",
      "Guests",
      "Package",
      "Status",
      "Estimated Total ($)",
      "Source",
    ];

    const rows = filteredLeads.map((l) => [
      `"${l.ticketId}"`,
      `"${l.name}"`,
      `"${l.email}"`,
      `"${l.phone}"`,
      `"${l.eventDate}"`,
      `"${l.eventType}"`,
      l.guestCount || 0,
      `"${l.packageName}"`,
      `"${l.status}"`,
      l.estimatedTotal || 0,
      `"${l.source || ""}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `all-the-smoke-catering-analytics-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* 1. HEADER & CONTROLS */}
      <div
        className={`rounded-2xl p-4 sm:p-6 transition-all border shadow-lg ${
          isDay
            ? "bg-white border-[#E6DDD2] text-[#1C1917]"
            : "bg-[#141416] border-zinc-800 text-neutral-100"
        }`}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                Smokehouse Intelligence
              </span>
              <span className="text-xs text-zinc-500">Live Revenue & Yield Forecasting</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-display tracking-wide mt-1">
              CATERING REVENUE & PIPELINE ANALYTICS
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
              Real-time conversion metrics, guest yields, butcher meat requirements, and event booking pace.
            </p>
          </div>

          {/* Timeframe Filter Buttons & CSV Export */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <div
              className={`p-1 rounded-xl border flex items-center gap-1 ${
                isDay ? "bg-stone-100 border-stone-300" : "bg-black/40 border-zinc-700/60"
              }`}
            >
              {[
                { key: "all", label: "All Time" },
                { key: "this-month", label: "This Month" },
                { key: "upcoming", label: "Upcoming" },
              ].map((btn) => (
                <button
                  key={btn.key}
                  type="button"
                  onClick={() => setTimeFilter(btn.key as TimeRangeFilter)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    timeFilter === btn.key
                      ? "bg-[#FF7A00] text-white shadow-sm"
                      : isDay
                      ? "text-stone-600 hover:text-stone-900"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleExportCSV}
              className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 font-bold text-xs flex items-center gap-2 transition active:scale-95 shadow-sm"
              title="Download CSV spreadsheet of all leads & revenue"
            >
              <span>📥</span>
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. TOP EXECUTIVE KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Booked Revenue */}
        <div
          className={`p-5 rounded-2xl border transition-all ${
            isDay ? "bg-white border-[#E6DDD2] shadow-sm" : "bg-[#141416] border-zinc-800 shadow-lg"
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-zinc-400">
            <span>Booked Revenue</span>
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-sm">💰</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black font-display tracking-tight text-emerald-400">
              ${metrics.bookedRevenue.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-zinc-400">
              ({metrics.bookedCount} events)
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-zinc-800/60">
            <span className="text-zinc-400">50% Deposit Locked:</span>
            <span className="font-mono font-bold text-amber-500">
              ${metrics.lockedDeposits.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Card 2: Active Pipeline Quoted */}
        <div
          className={`p-5 rounded-2xl border transition-all ${
            isDay ? "bg-white border-[#E6DDD2] shadow-sm" : "bg-[#141416] border-zinc-800 shadow-lg"
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-zinc-400">
            <span>Pending Pipeline</span>
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 text-sm">⏳</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black font-display tracking-tight text-amber-400">
              ${metrics.pendingQuotedRevenue.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-zinc-400">
              ({metrics.quotedCount} quotes)
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-zinc-800/60">
            <span className="text-zinc-400">Total Pipeline:</span>
            <span className="font-mono font-bold text-zinc-300">
              ${metrics.totalPipeline.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Card 3: Guests Fed / Projected */}
        <div
          className={`p-5 rounded-2xl border transition-all ${
            isDay ? "bg-white border-[#E6DDD2] shadow-sm" : "bg-[#141416] border-zinc-800 shadow-lg"
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-zinc-400">
            <span>Total Guests Fed</span>
            <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 text-sm">👥</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black font-display tracking-tight text-[#FF7A00]">
              {metrics.totalGuestsBooked.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-zinc-400">guests booked</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-zinc-800/60">
            <span className="text-zinc-400">Avg Yield / Guest:</span>
            <span className="font-mono font-bold text-emerald-400">
              ${metrics.avgPerPersonYield} / pp
            </span>
          </div>
        </div>

        {/* Card 4: Inquiry Conversion Rate */}
        <div
          className={`p-5 rounded-2xl border transition-all ${
            isDay ? "bg-white border-[#E6DDD2] shadow-sm" : "bg-[#141416] border-zinc-800 shadow-lg"
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-zinc-400">
            <span>Inquiry Conversion</span>
            <span className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 text-sm">🎯</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black font-display tracking-tight text-purple-400">
              {metrics.conversionRate}%
            </span>
            <span className="text-xs font-bold text-zinc-400">lead-to-book</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-zinc-800/60">
            <span className="text-zinc-400">Avg Event Value:</span>
            <span className="font-mono font-bold text-zinc-300">
              ${metrics.avgOrderValue.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* 3. MONTHLY REVENUE TARGET TRACKER ($25,000 GOAL) */}
      <div
        className={`p-5 sm:p-6 rounded-2xl border ${
          isDay ? "bg-white border-[#E6DDD2]" : "bg-[#141416] border-zinc-800"
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <h3 className="font-bold font-display text-base sm:text-lg flex items-center gap-2">
              <span>🎯 Monthly Smokehouse Revenue Target</span>
              <span className="text-xs font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                Target: ${monthlyTarget.toLocaleString()} / mo
              </span>
            </h3>
            <p className="text-xs text-zinc-400">
              Tracking booked deposits & balances towards Marion’s monthly catering goal.
            </p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black font-display text-[#FF7A00]">
              {metrics.targetProgressPct}%
            </span>
            <span className="text-xs text-zinc-400 block">
              ${metrics.bookedRevenue.toLocaleString()} of ${monthlyTarget.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-zinc-800/80 rounded-full h-3 overflow-hidden shadow-inner">
          <div
            className="bg-gradient-to-r from-amber-500 via-[#FF7A00] to-emerald-500 h-full transition-all duration-500 rounded-full"
            style={{ width: `${metrics.targetProgressPct}%` }}
          />
        </div>

        {/* Breakdown Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-3 border-t border-zinc-800/60 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0" />
            <span className="text-zinc-400">Locked 50% Deposits:</span>
            <span className="font-bold font-mono text-emerald-400">
              ${metrics.lockedDeposits.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0" />
            <span className="text-zinc-400">Day-Of Balances Due:</span>
            <span className="font-bold font-mono text-amber-400">
              ${metrics.dayOfBalances.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-500 shrink-0" />
            <span className="text-zinc-400">Remaining to Hit Goal:</span>
            <span className="font-bold font-mono text-zinc-300">
              ${Math.max(0, monthlyTarget - metrics.bookedRevenue).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* 4. VISUAL BREAKDOWNS: EVENT TYPES & PACKAGE POPULARITY */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Revenue by Event Type */}
        <div
          className={`p-5 sm:p-6 rounded-2xl border ${
            isDay ? "bg-white border-[#E6DDD2]" : "bg-[#141416] border-zinc-800"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold font-display text-base sm:text-lg">
                Revenue by Event Type
              </h3>
              <p className="text-xs text-zinc-400">Distribution across corporate, weddings, and private events</p>
            </div>
            <span className="text-xs font-mono text-[#FF7A00]">3 Main Segments</span>
          </div>

          <div className="space-y-4">
            {eventTypeBreakdown.map((item) => (
              <div key={item.key} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold">{item.label}</span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-zinc-400">({item.count} events)</span>
                    <span className="font-bold">${item.revenue.toLocaleString()}</span>
                    <span className="text-[#FF7A00] font-bold">({item.pct}%)</span>
                  </div>
                </div>
                <div className="w-full bg-zinc-800/80 rounded-full h-2 overflow-hidden">
                  <div className={`${item.color} h-full rounded-full transition-all duration-300`} style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Signature Package Breakdown */}
        <div
          className={`p-5 sm:p-6 rounded-2xl border ${
            isDay ? "bg-white border-[#E6DDD2]" : "bg-[#141416] border-zinc-800"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold font-display text-base sm:text-lg">
                Package Popularity & Yield
              </h3>
              <p className="text-xs text-zinc-400">Per-person packages vs party pans</p>
            </div>
            <span className="text-xs font-mono text-emerald-400">Live Yields</span>
          </div>

          <div className="space-y-3.5">
            {packageBreakdown.map((pkg, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 ${
                  isDay ? "bg-stone-50 border-stone-200" : "bg-black/30 border-zinc-800"
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-xs sm:text-sm">{pkg.name}</h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-black/40 text-[#FF7A00] border border-[#FF7A00]/30">
                      {pkg.badge}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Total Volume: ${pkg.revenue.toLocaleString()}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-lg font-black font-display text-[#FF7A00]">
                    {pkg.pct}%
                  </span>
                  <span className="text-[10px] text-zinc-400 block">share</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. BUTCHER ORDERING & SMOKEHOUSE PREP FORECAST */}
      <div
        className={`p-5 sm:p-6 rounded-2xl border ${
          isDay ? "bg-white border-[#E6DDD2]" : "bg-[#141416] border-zinc-800"
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Butcher Forecasting
              </span>
              <span className="text-xs text-zinc-400">Based on {metrics.totalGuestsBooked} Booked Guests</span>
            </div>
            <h3 className="font-bold font-display text-base sm:text-lg mt-1">
              RAW MEAT & PROVISIONS ORDERING FORECAST
            </h3>
            <p className="text-xs text-zinc-400">
              Auto-calculates the raw pounds of brisket, ribs, and poultry Marion needs to order from meat purveyors.
            </p>
          </div>

          <div className="text-xs text-zinc-400 font-mono bg-black/30 px-3 py-1.5 rounded-xl border border-zinc-800 shrink-0">
            Rule: 0.70 lbs raw flat per guest (yields 0.38 lbs smoked)
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {butcherProjections.map((item, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border flex flex-col justify-between ${
                isDay ? "bg-stone-50 border-stone-200" : "bg-black/30 border-zinc-800"
              }`}
            >
              <div>
                <div className="flex items-center gap-2.5 mb-2">
                  <span className="text-2xl p-1.5 rounded-lg bg-black/20">{item.icon}</span>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm leading-tight">{item.meat}</h4>
                    <p className="text-[11px] text-zinc-400 mt-0.5">{item.cutsNote}</p>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-zinc-800 flex items-baseline justify-between">
                <span className="text-[11px] text-zinc-400">Raw Order Target:</span>
                <span className="text-base font-black font-mono text-[#FF7A00]">
                  {item.rawPounds} {item.meat.includes("Rib") ? "Slabs" : item.meat.includes("Sides") ? "Half Pans" : "lbs"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

