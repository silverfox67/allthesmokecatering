"use client";

import React, { useState, useEffect } from "react";
import { PitmasterLead } from "./AdminLeadsPipeline";

export type CalendarEventType = "gig" | "prep" | "logistics" | "consultation" | "other";

export interface CalendarEvent {
  id: string;
  title: string;
  eventType: CalendarEventType;
  eventDate: string; // YYYY-MM-DD
  timeSlot: string;
  guestCount?: number;
  location?: string;
  notes?: string;
  clientName?: string;
  clientPhone?: string;
  isCompleted: boolean;
}

const EVENT_TYPE_META: Record<
  CalendarEventType,
  { label: string; chipDay: string; chipDark: string; icon: string }
> = {
  gig: {
    label: "Catering Gig",
    chipDay: "bg-red-100 text-red-950 border border-red-300 font-bold",
    chipDark: "bg-red-950/80 text-red-300 border border-red-700/80 font-bold",
    icon: "🔥",
  },
  prep: {
    label: "Smoke Prep & Brine",
    chipDay: "bg-amber-100 text-amber-950 border border-amber-300 font-bold",
    chipDark: "bg-amber-950/80 text-amber-300 border border-amber-700/80 font-bold",
    icon: "🥩",
  },
  logistics: {
    label: "Rig & Wood Restock",
    chipDay: "bg-stone-200 text-stone-900 border border-stone-300 font-bold",
    chipDark: "bg-zinc-800 text-zinc-300 border border-zinc-700 font-bold",
    icon: "🚚",
  },
  consultation: {
    label: "Tasting / Phone Call",
    chipDay: "bg-blue-100 text-blue-950 border border-blue-300 font-bold",
    chipDark: "bg-blue-950/80 text-blue-300 border border-blue-700/80 font-bold",
    icon: "📞",
  },
  other: {
    label: "General Schedule",
    chipDay: "bg-emerald-100 text-emerald-950 border border-emerald-300 font-bold",
    chipDark: "bg-emerald-950/80 text-emerald-300 border border-emerald-700/80 font-bold",
    icon: "★",
  },
};

const SEED_CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: "cal-1",
    title: "Lincoln Park Wedding: 65 Guests (Prime Brisket)",
    eventType: "gig",
    eventDate: "2026-11-14",
    timeSlot: "1:00 PM - 5:00 PM",
    guestCount: 65,
    location: "Lincoln Park Conservatory Alleyway, Chicago, IL",
    notes: "Trailer rig setup required. 35 hardwood smoked turkey chops alongside brisket.",
    clientName: "Marcus Vance",
    clientPhone: "(773) 555-0199",
    isCompleted: false,
  },
  {
    id: "cal-2",
    title: "Pecan & White Oak Hardwood Delivery (2 Cords)",
    eventType: "logistics",
    eventDate: "2026-11-12",
    timeSlot: "9:00 AM",
    location: "Commercial Smokehouse Commissary Hub",
    notes: "Stack seasoned oak in dry shed for upcoming weekend cooks.",
    isCompleted: false,
  },
  {
    id: "cal-3",
    title: "Overnight Brisket Trim & Dry Rub Prep",
    eventType: "prep",
    eventDate: "2026-11-13",
    timeSlot: "8:00 PM",
    location: "Commercial Kitchen",
    notes: "Trim 8 whole packer prime briskets. Coarse salt & 16-mesh black pepper.",
    isCompleted: false,
  },
  {
    id: "cal-4",
    title: "Fulton Market Corporate Summit Gala: 120 Guests",
    eventType: "gig",
    eventDate: "2026-12-05",
    timeSlot: "5:30 PM - 9:30 PM",
    guestCount: 120,
    location: "Fulton Market District Loft, Chicago, IL",
    notes: "Full Live-Fire Buffet with hot holding Cambros.",
    clientName: "Elena Rostova",
    clientPhone: "(312) 555-8842",
    isCompleted: false,
  },
];

interface AdminCalendarProps {
  theme?: "day" | "night" | "dark" | "butcher-paper";
}

export function AdminCalendar({ theme = "night" }: AdminCalendarProps) {
  const isDay = theme === "day" || theme === "butcher-paper";

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [leads, setLeads] = useState<PitmasterLead[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Event Form
  const [newEvent, setNewEvent] = useState({
    title: "",
    eventType: "gig" as CalendarEventType,
    eventDate: new Date().toISOString().split("T")[0],
    timeSlot: "12:00 PM - 4:00 PM",
    guestCount: 50,
    location: "",
    notes: "",
    clientName: "",
    clientPhone: "",
  });

  // Load saved calendar events and leads
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const savedEvents = localStorage.getItem("ats_admin_calendar_events");
        if (savedEvents) {
          setEvents(JSON.parse(savedEvents));
        } else {
          setEvents(SEED_CALENDAR_EVENTS);
          localStorage.setItem("ats_admin_calendar_events", JSON.stringify(SEED_CALENDAR_EVENTS));
        }

        const savedLeads = localStorage.getItem("ats_pitmaster_leads");
        if (savedLeads) {
          setLeads(JSON.parse(savedLeads));
        }
      } catch (err) {
        console.error("Failed to load calendar events:", err);
      }
    }
  }, []);

  const saveEvents = (updated: CalendarEvent[]) => {
    setEvents(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("ats_admin_calendar_events", JSON.stringify(updated));
    }
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.eventDate) return;

    const created: CalendarEvent = {
      id: "cal-" + Date.now(),
      title: newEvent.title.trim(),
      eventType: newEvent.eventType,
      eventDate: newEvent.eventDate,
      timeSlot: newEvent.timeSlot.trim(),
      guestCount: Number(newEvent.guestCount) || undefined,
      location: newEvent.location.trim() || undefined,
      notes: newEvent.notes.trim() || undefined,
      clientName: newEvent.clientName.trim() || undefined,
      clientPhone: newEvent.clientPhone.trim() || undefined,
      isCompleted: false,
    };

    saveEvents([...events, created]);
    setShowAddModal(false);
    setNewEvent({
      title: "",
      eventType: "gig",
      eventDate: selectedDateStr,
      timeSlot: "12:00 PM - 4:00 PM",
      guestCount: 50,
      location: "",
      notes: "",
      clientName: "",
      clientPhone: "",
    });
  };

  const handleDeleteEvent = (id: string) => {
    if (confirm("Delete this event from the calendar schedule?")) {
      saveEvents(events.filter((e) => e.id !== id));
    }
  };

  const handleToggleComplete = (id: string) => {
    saveEvents(events.map((e) => (e.id === id ? { ...e, isCompleted: !e.isCompleted } : e)));
  };

  // Month navigation
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  const jumpToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDateStr(today.toISOString().split("T")[0]);
  };

  // Calendar days generation
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const calendarDays: { dayNum: number; dateStr: string; isCurrentMonth: boolean }[] = [];

  // Previous month trailing days
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const d = prevMonthDays - i;
    const prevM = month === 0 ? 12 : month;
    const prevY = month === 0 ? year - 1 : year;
    const dateStr = `${prevY}-${String(prevM).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    calendarDays.push({ dayNum: d, dateStr, isCurrentMonth: false });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
    calendarDays.push({ dayNum: i, dateStr, isCurrentMonth: true });
  }

  // Next month leading days to complete 35 or 42 grid
  const remaining = (7 - (calendarDays.length % 7)) % 7;
  for (let i = 1; i <= remaining; i++) {
    const nextM = month === 11 ? 1 : month + 2;
    const nextY = month === 11 ? year + 1 : year;
    const dateStr = `${nextY}-${String(nextM).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
    calendarDays.push({ dayNum: i, dateStr, isCurrentMonth: false });
  }

  // Events on selected day
  const selectedDayEvents = events.filter((e) => e.eventDate === selectedDateStr);

  // Month Metrics
  const curMonthPrefix = `${year}-${String(month + 1).padStart(2, "0")}`;
  const monthGigs = events.filter((e) => e.eventDate.startsWith(curMonthPrefix) && e.eventType === "gig").length;
  const bookedCount = leads.filter((l) => l.status === "booked").length;

  return (
    <div className="space-y-6">
      {/* 1. TOP HEADER & SCHEDULE ACTIONS */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase font-extrabold tracking-widest text-[#FF7A00]">
              Pitmaster Operations Schedule
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-[#FF7A00] border border-amber-500/40">
              Live Cook Calendar
            </span>
          </div>
          <h2
            className={`font-display text-2xl sm:text-3xl font-bold tracking-tight ${
              isDay ? "text-[#1C1917]" : "text-white"
            }`}
          >
            Event Calendar &amp; Smoke Schedule
          </h2>
          <p className={`text-xs sm:text-sm mt-0.5 ${isDay ? "text-stone-600" : "text-zinc-400"}`}>
            Unified schedule combining customer catering inquiries, booked gigs, wood deliveries, and internal meat prep.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setNewEvent((prev) => ({ ...prev, eventDate: selectedDateStr }));
            setShowAddModal(true);
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[radial-gradient(ellipse_at_center,_#C84A0A_0%,_#7E2605_60%,_#2A0D02_100%)] border border-[#FF7A00] shadow-[0_0_14px_rgba(255,122,0,0.4)] text-white text-xs font-bold uppercase tracking-wider transition-all hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <span>Schedule Event</span>
        </button>
      </div>

      {/* 2. QUICK METRICS SUMMARY (4 Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div
          className={`p-4 rounded-2xl border transition-all ${
            isDay ? "bg-[#FFFFFF] border-[#E2DACF] shadow-sm" : "bg-[#141417] border-zinc-800"
          }`}
        >
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#EA580C] flex items-center gap-1.5">
            <span>🔥</span> Total Schedule
          </div>
          <div className={`text-2xl sm:text-3xl font-display font-black mt-1 ${isDay ? "text-stone-900" : "text-white"}`}>
            {events.length}
          </div>
          <div className="text-[11px] text-stone-400 mt-0.5 font-medium">Active events &amp; prep sessions</div>
        </div>

        <div
          className={`p-4 rounded-2xl border transition-all ${
            isDay ? "bg-[#FFFFFF] border-[#E2DACF] shadow-sm" : "bg-[#141417] border-zinc-800"
          }`}
        >
          <div className="text-[11px] font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
            <span>📅</span> {currentDate.toLocaleDateString("en-US", { month: "short" })} Schedule
          </div>
          <div className={`text-2xl sm:text-3xl font-display font-black mt-1 ${isDay ? "text-amber-700" : "text-amber-400"}`}>
            {monthGigs}
          </div>
          <div className="text-[11px] text-stone-400 mt-0.5 font-medium">Gigs scheduled this month</div>
        </div>

        <div
          className={`p-4 rounded-2xl border transition-all ${
            isDay ? "bg-[#FFFFFF] border-[#E2DACF] shadow-sm" : "bg-[#141417] border-zinc-800"
          }`}
        >
          <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-500 flex items-center gap-1.5">
            <span>✓</span> Confirmed Booked
          </div>
          <div className={`text-2xl sm:text-3xl font-display font-black mt-1 ${isDay ? "text-emerald-700" : "text-emerald-400"}`}>
            {bookedCount}
          </div>
          <div className="text-[11px] text-stone-400 mt-0.5 font-medium">Deposits confirmed</div>
        </div>

        <div
          className={`p-4 rounded-2xl border transition-all ${
            isDay ? "bg-[#FFFFFF] border-[#E2DACF] shadow-sm" : "bg-[#141417] border-zinc-800"
          }`}
        >
          <div className="text-[11px] font-bold uppercase tracking-wider text-blue-500 flex items-center gap-1.5">
            <span>🔔</span> Calendar Alerts
          </div>
          <div className={`text-sm font-bold mt-1.5 truncate ${isDay ? "text-stone-900" : "text-white"}`}>
            Marion &amp; Todd
          </div>
          <div className="text-[11px] text-stone-400 mt-0.5 font-medium">boldenmarion83 &amp; todddavis923</div>
        </div>
      </div>

      {/* 3. INTERACTIVE MONTH CALENDAR GRID */}
      <div
        className={`rounded-3xl border p-5 sm:p-7 space-y-5 shadow-xl ${
          isDay ? "bg-[#FFFFFF] border-[#E2DACF]" : "bg-[#141417] border-zinc-800"
        }`}
      >
        {/* Month Navigation Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <h3 className={`font-display text-2xl font-bold tracking-wide ${isDay ? "text-stone-900" : "text-white"}`}>
              {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </h3>
            <button
              type="button"
              onClick={jumpToday}
              className={`px-3 py-1 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                isDay
                  ? "bg-[#FAF8F5] border-[#D8CEC1] text-stone-700 hover:bg-[#EAE3D9]"
                  : "bg-zinc-800 border-zinc-700 text-stone-300 hover:bg-zinc-700"
              }`}
            >
              Today
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={prevMonth}
              aria-label="Previous Month"
              className={`p-2 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
                isDay
                  ? "bg-[#FAF8F5] border-[#D8CEC1] text-stone-700 hover:bg-[#EAE3D9]"
                  : "bg-zinc-800 border-zinc-700 text-stone-300 hover:bg-zinc-700"
              }`}
            >
              « Prev
            </button>
            <button
              type="button"
              onClick={nextMonth}
              aria-label="Next Month"
              className={`p-2 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
                isDay
                  ? "bg-[#FAF8F5] border-[#D8CEC1] text-stone-700 hover:bg-[#EAE3D9]"
                  : "bg-zinc-800 border-zinc-700 text-stone-300 hover:bg-zinc-700"
              }`}
            >
              Next »
            </button>
          </div>
        </div>

        {/* Day of Week Headers */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-xs font-bold uppercase tracking-wider text-stone-400">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {calendarDays.map((calDay, idx) => {
            const isSelected = calDay.dateStr === selectedDateStr;
            const isToday = calDay.dateStr === new Date().toISOString().split("T")[0];
            const dayEvents = events.filter((e) => e.eventDate === calDay.dateStr);

            return (
              <div
                key={idx}
                onClick={() => setSelectedDateStr(calDay.dateStr)}
                className={`min-h-[90px] sm:min-h-[110px] p-1.5 sm:p-2 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? isDay
                      ? "bg-[#FAF5EF] border-[#EA580C] ring-2 ring-[#EA580C]/20 shadow-md"
                      : "bg-[#1C1815] border-[#FF7A00] ring-2 ring-[#FF7A00]/25 shadow-md"
                    : calDay.isCurrentMonth
                    ? isDay
                      ? "bg-[#FAF8F5] border-[#E8E1D5] hover:border-amber-400"
                      : "bg-[#181614] border-zinc-800/80 hover:border-zinc-700"
                    : isDay
                    ? "bg-[#F4EFEA]/50 border-stone-200/50 opacity-40"
                    : "bg-zinc-900/40 border-zinc-900 opacity-40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full ${
                      isToday
                        ? "bg-[#EA580C] text-white"
                        : isDay
                        ? "text-stone-800"
                        : "text-stone-200"
                    }`}
                  >
                    {calDay.dayNum}
                  </span>
                  {dayEvents.length > 0 && (
                    <span className="text-[10px] font-bold text-amber-500">
                      {dayEvents.length}
                    </span>
                  )}
                </div>

                {/* Event Chips */}
                <div className="space-y-1 mt-1 overflow-hidden">
                  {dayEvents.slice(0, 2).map((ev) => {
                    const meta = EVENT_TYPE_META[ev.eventType] || EVENT_TYPE_META.other;
                    return (
                      <div
                        key={ev.id}
                        className={`text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded truncate ${
                          isDay ? meta.chipDay : meta.chipDark
                        }`}
                        title={ev.title}
                      >
                        {meta.icon} {ev.title}
                      </div>
                    );
                  })}
                  {dayEvents.length > 2 && (
                    <div className="text-[9px] text-stone-400 font-bold pl-1">
                      +{dayEvents.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. SELECTED DAY DETAILED SCHEDULE ROSTER */}
      <div
        className={`rounded-3xl border p-5 sm:p-7 space-y-4 shadow-xl ${
          isDay ? "bg-[#FFFFFF] border-[#E2DACF]" : "bg-[#141417] border-zinc-800"
        }`}
      >
        <div className="flex items-center justify-between border-b border-stone-200 dark:border-zinc-800 pb-3">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#FF7A00] block">
              Day Schedule Breakdown
            </span>
            <h3 className={`font-display text-xl font-bold ${isDay ? "text-stone-900" : "text-white"}`}>
              {new Date(selectedDateStr + "T12:00:00").toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </h3>
          </div>

          <button
            type="button"
            onClick={() => {
              setNewEvent((prev) => ({ ...prev, eventDate: selectedDateStr }));
              setShowAddModal(true);
            }}
            className="text-xs font-bold text-[#EA580C] hover:underline"
          >
            + Add to this date
          </button>
        </div>

        {selectedDayEvents.length === 0 ? (
          <div className="py-8 text-center text-xs text-stone-400">
            No events or catering gigs scheduled for this date.
          </div>
        ) : (
          <div className="space-y-3">
            {selectedDayEvents.map((ev) => {
              const meta = EVENT_TYPE_META[ev.eventType] || EVENT_TYPE_META.other;

              return (
                <div
                  key={ev.id}
                  className={`p-4 rounded-2xl border transition-all text-xs space-y-2 ${
                    isDay ? "bg-[#FAF8F5] border-[#E2DACF]" : "bg-zinc-900/80 border-zinc-800"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${isDay ? meta.chipDay : meta.chipDark}`}>
                        {meta.icon} {meta.label}
                      </span>
                      <span className="font-bold text-sm text-stone-900 dark:text-white">
                        {ev.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-mono text-stone-400 text-[11px]">
                        🕒 {ev.timeSlot}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleToggleComplete(ev.id)}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                          ev.isCompleted
                            ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                            : "bg-stone-800 text-stone-400 border-stone-700"
                        }`}
                      >
                        {ev.isCompleted ? "✓ Completed" : "Mark Done"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteEvent(ev.id)}
                        className="text-stone-400 hover:text-red-500 p-1"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-stone-500 pt-1">
                    {ev.guestCount && <div>👥 <strong>Guests:</strong> {ev.guestCount}</div>}
                    {ev.location && <div>📍 <strong>Location:</strong> {ev.location}</div>}
                    {ev.clientName && <div>👤 <strong>Client:</strong> {ev.clientName} ({ev.clientPhone})</div>}
                  </div>

                  {ev.notes && (
                    <div className="p-2 rounded-lg bg-black/20 text-stone-400 text-[11px] italic">
                      {ev.notes}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. ADD EVENT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div
            className={`w-full max-w-lg rounded-3xl p-6 sm:p-8 border shadow-2xl space-y-5 ${
              isDay ? "bg-[#FFFFFF] border-[#E2DACF] text-stone-900" : "bg-[#141417] border-zinc-800 text-white"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#FF7A00]">
                  Schedule New Event
                </span>
                <h3 className="font-display text-xl sm:text-2xl font-bold">
                  Add to Pitmaster Schedule
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold uppercase tracking-wider text-stone-400">Event Title *</label>
                <input
                  type="text"
                  required
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  placeholder="e.g. Wedding Catering: 65 Guests"
                  className="w-full h-10 px-3 rounded-xl border bg-stone-900/50 border-stone-700 text-white focus:outline-none focus:border-[#EA580C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold uppercase tracking-wider text-stone-400">Event Type</label>
                  <select
                    value={newEvent.eventType}
                    onChange={(e) => setNewEvent({ ...newEvent, eventType: e.target.value as CalendarEventType })}
                    className="w-full h-10 px-3 rounded-xl border bg-stone-900 border-stone-700 text-white focus:outline-none focus:border-[#EA580C]"
                  >
                    <option value="gig">🔥 Catering Gig</option>
                    <option value="prep">🥩 Smoke Prep &amp; Brine</option>
                    <option value="logistics">🚚 Rig &amp; Wood Restock</option>
                    <option value="consultation">📞 Tasting / Consultation</option>
                    <option value="other">★ General Schedule</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold uppercase tracking-wider text-stone-400">Date *</label>
                  <input
                    type="date"
                    required
                    value={newEvent.eventDate}
                    onChange={(e) => setNewEvent({ ...newEvent, eventDate: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border bg-stone-900/50 border-stone-700 text-white focus:outline-none focus:border-[#EA580C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold uppercase tracking-wider text-stone-400">Time Slot</label>
                  <input
                    type="text"
                    value={newEvent.timeSlot}
                    onChange={(e) => setNewEvent({ ...newEvent, timeSlot: e.target.value })}
                    placeholder="e.g. 1:00 PM - 5:00 PM"
                    className="w-full h-10 px-3 rounded-xl border bg-stone-900/50 border-stone-700 text-white focus:outline-none focus:border-[#EA580C]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold uppercase tracking-wider text-stone-400">Guest Count</label>
                  <input
                    type="number"
                    value={newEvent.guestCount}
                    onChange={(e) => setNewEvent({ ...newEvent, guestCount: Number(e.target.value) })}
                    className="w-full h-10 px-3 rounded-xl border bg-stone-900/50 border-stone-700 text-white focus:outline-none focus:border-[#EA580C]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold uppercase tracking-wider text-stone-400">Location / Venue</label>
                <input
                  type="text"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                  placeholder="Venue address or Commercial Kitchen Hub"
                  className="w-full h-10 px-3 rounded-xl border bg-stone-900/50 border-stone-700 text-white focus:outline-none focus:border-[#EA580C]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold uppercase tracking-wider text-stone-400">Notes &amp; Details</label>
                <textarea
                  rows={3}
                  value={newEvent.notes}
                  onChange={(e) => setNewEvent({ ...newEvent, notes: e.target.value })}
                  placeholder="Meats, setup times, trailer parking logistics..."
                  className="w-full p-3 rounded-xl border bg-stone-900/50 border-stone-700 text-white focus:outline-none focus:border-[#EA580C] resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-stone-700 text-stone-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#EA580C] hover:bg-[#C84A0A] text-white font-bold tracking-wide cursor-pointer"
                >
                  Add to Calendar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
