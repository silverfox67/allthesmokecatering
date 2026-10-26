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
  const [blowUpEvent, setBlowUpEvent] = useState<CalendarEvent | null>(null);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

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
      if (blowUpEvent?.id === id) {
        setBlowUpEvent(null);
      }
      if (editingEvent?.id === id) {
        setEditingEvent(null);
      }
    }
  };

  const handleUpdateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent || !editingEvent.title || !editingEvent.eventDate) return;

    const updated = events.map((ev) =>
      ev.id === editingEvent.id ? { ...editingEvent } : ev
    );
    saveEvents(updated);
    if (blowUpEvent?.id === editingEvent.id) {
      setBlowUpEvent({ ...editingEvent });
    }
    setEditingEvent(null);
  };

  const handleToggleComplete = (id: string) => {
    saveEvents(events.map((e) => (e.id === id ? { ...e, isCompleted: !e.isCompleted } : e)));
    if (blowUpEvent?.id === id) {
      setBlowUpEvent((prev) => (prev ? { ...prev, isCompleted: !prev.isCompleted } : null));
    }
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
          <p className={`text-xs sm:text-sm mt-0.5 font-bold ${isDay ? "text-black" : "text-zinc-400"}`}>
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
          <div className="text-[11px] font-black uppercase tracking-wider text-[#EA580C] flex items-center gap-1.5">
            <span>🔥</span> Total Schedule
          </div>
          <div className={`text-2xl sm:text-3xl font-display font-black mt-1 ${isDay ? "text-black" : "text-white"}`}>
            {events.length}
          </div>
          <div className={`text-[11px] mt-0.5 font-bold ${isDay ? "text-black" : "text-stone-400"}`}>Active events &amp; prep sessions</div>
        </div>

        <div
          className={`p-4 rounded-2xl border transition-all ${
            isDay ? "bg-[#FFFFFF] border-[#E2DACF] shadow-sm" : "bg-[#141417] border-zinc-800"
          }`}
        >
          <div className="text-[11px] font-black uppercase tracking-wider text-amber-600 flex items-center gap-1.5">
            <span>📅</span> {currentDate.toLocaleDateString("en-US", { month: "short" })} Schedule
          </div>
          <div className={`text-2xl sm:text-3xl font-display font-black mt-1 ${isDay ? "text-black" : "text-amber-400"}`}>
            {monthGigs}
          </div>
          <div className={`text-[11px] mt-0.5 font-bold ${isDay ? "text-black" : "text-stone-400"}`}>Gigs scheduled this month</div>
        </div>

        <div
          className={`p-4 rounded-2xl border transition-all ${
            isDay ? "bg-[#FFFFFF] border-[#E2DACF] shadow-sm" : "bg-[#141417] border-zinc-800"
          }`}
        >
          <div className="text-[11px] font-black uppercase tracking-wider text-emerald-600 flex items-center gap-1.5">
            <span>✓</span> Confirmed Booked
          </div>
          <div className={`text-2xl sm:text-3xl font-display font-black mt-1 ${isDay ? "text-black" : "text-emerald-400"}`}>
            {bookedCount}
          </div>
          <div className={`text-[11px] mt-0.5 font-bold ${isDay ? "text-black" : "text-stone-400"}`}>Deposits confirmed</div>
        </div>

        <div
          className={`p-4 rounded-2xl border transition-all ${
            isDay ? "bg-[#FFFFFF] border-[#E2DACF] shadow-sm" : "bg-[#141417] border-zinc-800"
          }`}
        >
          <div className="text-[11px] font-black uppercase tracking-wider text-blue-600 flex items-center gap-1.5">
            <span>🔔</span> Calendar Alerts
          </div>
          <div className={`text-sm font-black mt-1.5 truncate ${isDay ? "text-black" : "text-white"}`}>
            Marion &amp; Todd
          </div>
          <div className={`text-[11px] mt-0.5 font-bold ${isDay ? "text-black" : "text-stone-400"}`}>boldenmarion83 &amp; todddavis923</div>
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
            <h3 className={`font-display text-2xl font-black tracking-wide ${isDay ? "text-black" : "text-white"}`}>
              {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </h3>
            <button
              type="button"
              onClick={jumpToday}
              className={`px-3 py-1 rounded-lg text-xs font-black border transition-colors cursor-pointer ${
                isDay
                  ? "bg-white border-stone-400 text-black hover:bg-stone-100"
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
              className={`p-2 rounded-xl border text-xs font-black transition-colors cursor-pointer ${
                isDay
                  ? "bg-white border-stone-400 text-black hover:bg-stone-100"
                  : "bg-zinc-800 border-zinc-700 text-stone-300 hover:bg-zinc-700"
              }`}
            >
              « Prev
            </button>
            <button
              type="button"
              onClick={nextMonth}
              aria-label="Next Month"
              className={`p-2 rounded-xl border text-xs font-black transition-colors cursor-pointer ${
                isDay
                  ? "bg-white border-stone-400 text-black hover:bg-stone-100"
                  : "bg-zinc-800 border-zinc-700 text-stone-300 hover:bg-zinc-700"
              }`}
            >
              Next »
            </button>
          </div>
        </div>

        {/* Day of Week Headers */}
        <div className={`grid grid-cols-7 gap-1 sm:gap-2 text-center text-xs font-black uppercase tracking-wider ${isDay ? "text-black" : "text-stone-400"}`}>
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
                    className={`text-xs font-black w-6 h-6 flex items-center justify-center rounded-full ${
                      isToday
                        ? "bg-[#EA580C] text-white"
                        : isDay
                        ? "text-black"
                        : "text-stone-200"
                    }`}
                  >
                    {calDay.dayNum}
                  </span>
                  {dayEvents.length > 0 && (
                    <span className="text-[10px] font-black text-amber-500">
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
                        className={`text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded truncate font-bold ${
                          isDay ? meta.chipDay : meta.chipDark
                        }`}
                        title={ev.title}
                      >
                        {meta.icon} {ev.title}
                      </div>
                    );
                  })}
                  {dayEvents.length > 2 && (
                    <div className={`text-[9px] font-black pl-1 ${isDay ? "text-black" : "text-stone-400"}`}>
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
          isDay ? "bg-[#FFFFFF] border-[#E2DACF]" : "bg-[#141210] border-zinc-800"
        }`}
      >
        <div className="flex items-center justify-between border-b border-stone-200 dark:border-zinc-800 pb-3">
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-[#FF7A00] block">
              Day Schedule Breakdown
            </span>
            <h3 className={`font-display text-xl font-black ${isDay ? "text-black" : "text-white"}`}>
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
            className="text-xs font-black text-[#EA580C] hover:underline"
          >
            + Add to this date
          </button>
        </div>

        {selectedDayEvents.length === 0 ? (
          <div className={`py-8 text-center text-xs font-bold ${isDay ? "text-black" : "text-stone-400"}`}>
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
                    isDay ? "bg-[#FAF8F5] border-[#D8CEC1]" : "bg-zinc-900/80 border-zinc-800"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${isDay ? meta.chipDay : meta.chipDark}`}>
                        {meta.icon} {meta.label}
                      </span>
                      <span className={`font-black text-sm ${isDay ? "text-black" : "text-white"}`}>
                        {ev.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                      <span className={`font-mono text-[11px] font-black mr-1 ${isDay ? "text-black" : "text-stone-400"}`}>
                        🕒 {ev.timeSlot}
                      </span>

                      {/* Blowup Button */}
                      <button
                        type="button"
                        onClick={() => setBlowUpEvent(ev)}
                        className={`h-7 px-2.5 rounded-lg border text-xs font-black flex items-center gap-1 transition-all cursor-pointer ${
                          isDay
                            ? "bg-white border-stone-400 text-black hover:bg-stone-100"
                            : "bg-zinc-800 border-zinc-700 text-stone-200 hover:bg-zinc-700"
                        }`}
                        title="Blow up full event slip"
                      >
                        <svg className="w-3.5 h-3.5 text-[#FF7A00]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                        </svg>
                        <span>Blowup</span>
                      </button>

                      {/* Edit Button */}
                      <button
                        type="button"
                        onClick={() => setEditingEvent({ ...ev })}
                        className={`h-7 px-2.5 rounded-lg border text-xs font-black flex items-center gap-1 transition-all cursor-pointer ${
                          isDay
                            ? "bg-white border-stone-400 text-black hover:bg-stone-100"
                            : "bg-zinc-800 border-zinc-700 text-stone-200 hover:bg-zinc-700"
                        }`}
                        title="Edit event details"
                      >
                        <span className="text-[#EA580C]">✏️</span>
                        <span>Edit</span>
                      </button>

                      {/* Mark Done Button */}
                      <button
                        type="button"
                        onClick={() => handleToggleComplete(ev.id)}
                        className={`h-7 px-2.5 rounded-lg text-xs font-black border transition-colors cursor-pointer ${
                          ev.isCompleted
                            ? "bg-emerald-500/20 text-emerald-800 border-emerald-400"
                            : isDay
                            ? "bg-stone-100 text-black border-stone-400 hover:bg-stone-200"
                            : "bg-stone-800 text-stone-300 border-stone-700 hover:bg-stone-700"
                        }`}
                      >
                        {ev.isCompleted ? "✓ Done" : "Mark Done"}
                      </button>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => handleDeleteEvent(ev.id)}
                        className="h-7 px-2.5 rounded-lg text-xs font-black border border-red-300 dark:border-red-800/60 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-950/70 text-red-700 dark:text-red-300 flex items-center gap-1 transition-all cursor-pointer"
                        title="Delete this event from calendar"
                      >
                        <span>🗑️</span>
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>

                  {/* Details Grid (solid black in day mode) */}
                  <div className={`grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs pt-1 font-bold ${isDay ? "text-black" : "text-stone-300"}`}>
                    {ev.guestCount && <div>👥 <strong>Guests:</strong> {ev.guestCount}</div>}
                    {ev.location && <div>📍 <strong>Location:</strong> {ev.location}</div>}
                    {ev.clientName && <div>👤 <strong>Client:</strong> {ev.clientName} ({ev.clientPhone || "No phone"})</div>}
                  </div>

                  {/* Large High-Contrast Bottom Box */}
                  {ev.notes && (
                    <div
                      className={`p-3 sm:p-3.5 rounded-xl border text-xs sm:text-sm font-bold leading-relaxed space-y-1 ${
                        isDay
                          ? "bg-white border-stone-300 text-black shadow-2xs"
                          : "bg-black/30 border-zinc-800 text-stone-200"
                      }`}
                    >
                      <span className="text-[10px] uppercase font-black tracking-wider text-[#EA580C] block">
                        📝 Notes &amp; Prep Instructions:
                      </span>
                      <p className="whitespace-pre-wrap">{ev.notes}</p>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className={`w-full max-w-lg rounded-3xl p-6 sm:p-8 border shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto ${
              isDay ? "bg-white border-stone-300 text-black" : "bg-[#141417] border-zinc-800 text-white"
            }`}
          >
            <div className={`flex items-center justify-between border-b pb-3 ${isDay ? "border-stone-200" : "border-zinc-800"}`}>
              <div>
                <span className="text-[11px] font-black uppercase tracking-widest text-[#FF7A00]">
                  Schedule New Event
                </span>
                <h3 className={`font-display text-xl sm:text-2xl font-black ${isDay ? "text-black" : "text-white"}`}>
                  Add to Pitmaster Schedule
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className={`w-8 h-8 rounded-full font-bold flex items-center justify-center text-sm cursor-pointer transition-colors ${
                  isDay ? "bg-stone-200 hover:bg-stone-300 text-black" : "bg-zinc-800 hover:bg-zinc-700 text-white"
                }`}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-4 text-xs font-bold">
              <div className="space-y-1">
                <label className={`font-black uppercase tracking-wider block ${isDay ? "text-black" : "text-stone-300"}`}>
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  placeholder="e.g. Wedding Catering: 65 Guests"
                  className={`w-full h-10 px-3 rounded-xl border focus:outline-none focus:border-[#EA580C] font-bold ${
                    isDay
                      ? "bg-white border-stone-400 text-black"
                      : "bg-zinc-900 border-zinc-700 text-white"
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className={`font-black uppercase tracking-wider block ${isDay ? "text-black" : "text-stone-300"}`}>
                    Event Type
                  </label>
                  <select
                    value={newEvent.eventType}
                    onChange={(e) => setNewEvent({ ...newEvent, eventType: e.target.value as CalendarEventType })}
                    className={`w-full h-10 px-3 rounded-xl border focus:outline-none focus:border-[#EA580C] font-bold ${
                      isDay
                        ? "bg-white border-stone-400 text-black"
                        : "bg-zinc-900 border-zinc-700 text-white"
                    }`}
                  >
                    <option value="gig">🔥 Catering Gig</option>
                    <option value="prep">🥩 Smoke Prep &amp; Brine</option>
                    <option value="logistics">🚚 Rig &amp; Wood Restock</option>
                    <option value="consultation">📞 Tasting / Consultation</option>
                    <option value="other">★ General Schedule</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className={`font-black uppercase tracking-wider block ${isDay ? "text-black" : "text-stone-300"}`}>
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={newEvent.eventDate}
                    onChange={(e) => setNewEvent({ ...newEvent, eventDate: e.target.value })}
                    className={`w-full h-10 px-3 rounded-xl border focus:outline-none focus:border-[#EA580C] font-bold ${
                      isDay
                        ? "bg-white border-stone-400 text-black"
                        : "bg-zinc-900 border-zinc-700 text-white"
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className={`font-black uppercase tracking-wider block ${isDay ? "text-black" : "text-stone-300"}`}>
                    Time Slot
                  </label>
                  <input
                    type="text"
                    value={newEvent.timeSlot}
                    onChange={(e) => setNewEvent({ ...newEvent, timeSlot: e.target.value })}
                    placeholder="e.g. 1:00 PM - 5:00 PM"
                    className={`w-full h-10 px-3 rounded-xl border focus:outline-none focus:border-[#EA580C] font-bold ${
                      isDay
                        ? "bg-white border-stone-400 text-black"
                        : "bg-zinc-900 border-zinc-700 text-white"
                    }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className={`font-black uppercase tracking-wider block ${isDay ? "text-black" : "text-stone-300"}`}>
                    Guest Count
                  </label>
                  <input
                    type="number"
                    value={newEvent.guestCount || ""}
                    onChange={(e) => setNewEvent({ ...newEvent, guestCount: Number(e.target.value) })}
                    placeholder="e.g. 50"
                    className={`w-full h-10 px-3 rounded-xl border focus:outline-none focus:border-[#EA580C] font-bold ${
                      isDay
                        ? "bg-white border-stone-400 text-black"
                        : "bg-zinc-900 border-zinc-700 text-white"
                    }`}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className={`font-black uppercase tracking-wider block ${isDay ? "text-black" : "text-stone-300"}`}>
                  Location / Venue
                </label>
                <input
                  type="text"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                  placeholder="Venue address or Commissary Hub"
                  className={`w-full h-10 px-3 rounded-xl border focus:outline-none focus:border-[#EA580C] font-bold ${
                    isDay
                      ? "bg-white border-stone-400 text-black"
                      : "bg-zinc-900 border-zinc-700 text-white"
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className={`font-black uppercase tracking-wider block ${isDay ? "text-black" : "text-stone-300"}`}>
                    Client Name
                  </label>
                  <input
                    type="text"
                    value={newEvent.clientName}
                    onChange={(e) => setNewEvent({ ...newEvent, clientName: e.target.value })}
                    placeholder="e.g. Marcus Vance"
                    className={`w-full h-10 px-3 rounded-xl border focus:outline-none focus:border-[#EA580C] font-bold ${
                      isDay
                        ? "bg-white border-stone-400 text-black"
                        : "bg-zinc-900 border-zinc-700 text-white"
                    }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className={`font-black uppercase tracking-wider block ${isDay ? "text-black" : "text-stone-300"}`}>
                    Client Phone
                  </label>
                  <input
                    type="text"
                    value={newEvent.clientPhone}
                    onChange={(e) => setNewEvent({ ...newEvent, clientPhone: e.target.value })}
                    placeholder="e.g. (773) 555-0199"
                    className={`w-full h-10 px-3 rounded-xl border focus:outline-none focus:border-[#EA580C] font-bold ${
                      isDay
                        ? "bg-white border-stone-400 text-black"
                        : "bg-zinc-900 border-zinc-700 text-white"
                    }`}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className={`font-black uppercase tracking-wider block ${isDay ? "text-black" : "text-stone-300"}`}>
                  Notes &amp; Details
                </label>
                <textarea
                  rows={3}
                  value={newEvent.notes}
                  onChange={(e) => setNewEvent({ ...newEvent, notes: e.target.value })}
                  placeholder="Meats, setup times, trailer parking logistics..."
                  className={`w-full p-3 rounded-xl border focus:outline-none focus:border-[#EA580C] resize-none font-bold ${
                    isDay
                      ? "bg-white border-stone-400 text-black"
                      : "bg-zinc-900 border-zinc-700 text-white"
                  }`}
                />
              </div>

              <div className={`flex items-center justify-end gap-3 pt-2 border-t ${isDay ? "border-stone-200" : "border-zinc-800"}`}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className={`px-4 py-2 rounded-xl border font-black transition-colors ${
                    isDay
                      ? "border-stone-300 text-black hover:bg-stone-100"
                      : "border-zinc-700 text-stone-300 hover:text-white"
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#EA580C] hover:bg-[#C84A0A] text-white font-black tracking-wide cursor-pointer shadow-xs"
                >
                  Add to Calendar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. BLOW-UP EVENT DETAILS POPUP MODAL */}
      {blowUpEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className={`w-full max-w-2xl rounded-3xl border shadow-2xl p-6 sm:p-7 space-y-5 max-h-[90vh] overflow-y-auto ${
              isDay ? "bg-white border-stone-300 text-black" : "bg-[#141210] border-zinc-800 text-white"
            }`}
          >
            {/* Header */}
            <div className={`flex items-start justify-between gap-3 border-b pb-4 ${isDay ? "border-stone-200" : "border-zinc-800"}`}>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      isDay
                        ? (EVENT_TYPE_META[blowUpEvent.eventType] || EVENT_TYPE_META.other).chipDay
                        : (EVENT_TYPE_META[blowUpEvent.eventType] || EVENT_TYPE_META.other).chipDark
                    }`}
                  >
                    {(EVENT_TYPE_META[blowUpEvent.eventType] || EVENT_TYPE_META.other).icon}{" "}
                    {(EVENT_TYPE_META[blowUpEvent.eventType] || EVENT_TYPE_META.other).label}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-md text-[10px] font-black border uppercase tracking-wider ${
                      blowUpEvent.isCompleted
                        ? "bg-emerald-100 border-emerald-300 text-emerald-950 font-black"
                        : isDay
                        ? "bg-amber-100 border-amber-300 text-amber-950 font-black"
                        : "bg-amber-950/60 border-amber-500/30 text-amber-300 font-bold"
                    }`}
                  >
                    {blowUpEvent.isCompleted ? "✓ Completed" : "⏳ Scheduled"}
                  </span>
                </div>
                <h3 className={`text-xl sm:text-2xl font-black mt-0.5 ${isDay ? "text-black" : "text-white"}`}>
                  {blowUpEvent.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setBlowUpEvent(null)}
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
                <span className={`text-[10px] uppercase font-black block ${isDay ? "text-black" : "text-stone-400"}`}>Event Date</span>
                <span className={`text-xs font-black mt-0.5 block ${isDay ? "text-black" : "text-white"}`}>
                  {blowUpEvent.eventDate}
                </span>
              </div>
              <div className={`p-3 rounded-xl border ${isDay ? "bg-stone-50 border-stone-300" : "bg-zinc-900 border-zinc-800"}`}>
                <span className={`text-[10px] uppercase font-black block ${isDay ? "text-black" : "text-stone-400"}`}>Time Slot</span>
                <span className={`text-xs font-black mt-0.5 block ${isDay ? "text-black" : "text-white"}`}>
                  {blowUpEvent.timeSlot || "All Day"}
                </span>
              </div>
              <div className={`p-3 rounded-xl border ${isDay ? "bg-stone-50 border-stone-300" : "bg-zinc-900 border-zinc-800"}`}>
                <span className={`text-[10px] uppercase font-black block ${isDay ? "text-black" : "text-stone-400"}`}>Guest Count</span>
                <span className={`text-xs font-black mt-0.5 block ${isDay ? "text-black" : "text-white"}`}>
                  {blowUpEvent.guestCount ? `${blowUpEvent.guestCount} Guests` : "N/A"}
                </span>
              </div>
              <div className={`p-3 rounded-xl border ${isDay ? "bg-stone-50 border-stone-300" : "bg-zinc-900 border-zinc-800"}`}>
                <span className={`text-[10px] uppercase font-black block ${isDay ? "text-black" : "text-stone-400"}`}>Category</span>
                <span className={`text-xs font-black capitalize mt-0.5 block ${isDay ? "text-black" : "text-white"}`}>
                  {blowUpEvent.eventType}
                </span>
              </div>
            </div>

            {/* Logistics & Client Details */}
            <div className={`p-4 rounded-xl border space-y-1.5 ${isDay ? "bg-stone-50 border-stone-300" : "bg-zinc-900 border-zinc-800"}`}>
              <div className={`text-xs font-black flex items-center justify-between ${isDay ? "text-black" : "text-white"}`}>
                <span>Event Logistics &amp; Contacts</span>
                <span className="text-[#EA580C] text-[11px] font-mono font-bold">ID: {blowUpEvent.id}</span>
              </div>
              <div className={`text-xs font-bold ${isDay ? "text-black" : "text-stone-200"}`}>
                <strong className={isDay ? "text-black font-black" : "text-white font-bold"}>Location / Venue:</strong>{" "}
                {blowUpEvent.location || "Commercial Smokehouse Commissary Hub"}
              </div>
              {blowUpEvent.clientName && (
                <div className={`text-xs font-bold ${isDay ? "text-black" : "text-stone-200"}`}>
                  <strong className={isDay ? "text-black font-black" : "text-white font-bold"}>Client Name:</strong>{" "}
                  {blowUpEvent.clientName}
                </div>
              )}
              {blowUpEvent.clientPhone && (
                <div className={`text-xs font-bold ${isDay ? "text-black" : "text-stone-200"}`}>
                  <strong className={isDay ? "text-black font-black" : "text-white font-bold"}>Client Phone:</strong>{" "}
                  {blowUpEvent.clientPhone}
                </div>
              )}
            </div>

            {/* Notes & Prep Specifications */}
            <div className="space-y-1.5">
              <span className={`text-[11px] font-black uppercase tracking-wider block ${isDay ? "text-black" : "text-stone-300"}`}>
                📝 Smoke Prep, Rig Logistics &amp; Special Instructions:
              </span>
              <div
                className={`p-4 rounded-xl border max-h-[220px] overflow-y-auto leading-relaxed text-xs sm:text-sm whitespace-pre-wrap font-sans font-bold ${
                  isDay ? "bg-white border-stone-400 text-black" : "bg-zinc-900 border-zinc-800 text-stone-200"
                }`}
              >
                {blowUpEvent.notes || "No additional instructions recorded for this event."}
              </div>
            </div>

            {/* Modal Bottom Buttons */}
            <div className={`flex flex-wrap items-center justify-between gap-3 pt-3 border-t ${isDay ? "border-stone-200" : "border-zinc-800"}`}>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingEvent({ ...blowUpEvent });
                    setBlowUpEvent(null);
                  }}
                  className={`h-8 px-3 rounded-lg border text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                    isDay
                      ? "bg-white border-stone-400 text-black hover:bg-stone-100"
                      : "bg-zinc-800 border-zinc-700 text-stone-200 hover:bg-zinc-700"
                  }`}
                >
                  <span className="text-[#EA580C]">✏️</span>
                  <span>Edit Event</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleToggleComplete(blowUpEvent.id);
                  }}
                  className={`h-8 px-3 rounded-lg border text-xs font-black transition-all cursor-pointer ${
                    blowUpEvent.isCompleted
                      ? "bg-emerald-500/20 text-emerald-800 border-emerald-400 font-black"
                      : isDay
                      ? "bg-stone-100 hover:bg-stone-200 border-stone-400 text-black font-black"
                      : "bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-white"
                  }`}
                >
                  {blowUpEvent.isCompleted ? "✓ Completed (Click to Re-open)" : "Mark Done"}
                </button>

                {/* Delete Event Button */}
                <button
                  type="button"
                  onClick={() => handleDeleteEvent(blowUpEvent.id)}
                  className="h-8 px-3 rounded-lg border border-red-300 dark:border-red-800/60 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-950/70 text-red-700 dark:text-red-300 text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>🗑️</span>
                  <span>Delete Event</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setBlowUpEvent(null)}
                className="h-8 px-4 rounded-lg bg-[#EA580C] hover:bg-[#C84A0A] text-white text-xs font-black cursor-pointer shadow-xs"
              >
                Close Slip
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. EDIT EVENT DETAILS MODAL */}
      {editingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className={`w-full max-w-lg rounded-3xl p-6 sm:p-8 border shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto ${
              isDay ? "bg-white border-stone-300 text-black" : "bg-[#141417] border-zinc-800 text-white"
            }`}
          >
            <div className={`flex items-center justify-between border-b pb-3 ${isDay ? "border-stone-200" : "border-zinc-800"}`}>
              <div>
                <span className="text-[11px] font-black uppercase tracking-widest text-[#FF7A00]">
                  Edit Schedule Item
                </span>
                <h3 className={`font-display text-xl sm:text-2xl font-black ${isDay ? "text-black" : "text-white"}`}>
                  Update Event Details
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingEvent(null)}
                className={`w-8 h-8 rounded-full font-bold flex items-center justify-center text-sm cursor-pointer transition-colors ${
                  isDay ? "bg-stone-200 hover:bg-stone-300 text-black" : "bg-zinc-800 hover:bg-zinc-700 text-white"
                }`}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateEvent} className="space-y-4 text-xs font-bold">
              <div className="space-y-1">
                <label className={`font-black uppercase tracking-wider block ${isDay ? "text-black" : "text-stone-300"}`}>
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  value={editingEvent.title}
                  onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                  placeholder="e.g. Wedding Catering: 65 Guests"
                  className={`w-full h-10 px-3 rounded-xl border focus:outline-none focus:border-[#EA580C] font-bold ${
                    isDay
                      ? "bg-white border-stone-400 text-black"
                      : "bg-zinc-900 border-zinc-700 text-white"
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className={`font-black uppercase tracking-wider block ${isDay ? "text-black" : "text-stone-300"}`}>
                    Event Type
                  </label>
                  <select
                    value={editingEvent.eventType}
                    onChange={(e) => setEditingEvent({ ...editingEvent, eventType: e.target.value as CalendarEventType })}
                    className={`w-full h-10 px-3 rounded-xl border focus:outline-none focus:border-[#EA580C] font-bold ${
                      isDay
                        ? "bg-white border-stone-400 text-black"
                        : "bg-zinc-900 border-zinc-700 text-white"
                    }`}
                  >
                    <option value="gig">🔥 Catering Gig</option>
                    <option value="prep">🥩 Smoke Prep &amp; Brine</option>
                    <option value="logistics">🚚 Rig &amp; Wood Restock</option>
                    <option value="consultation">📞 Tasting / Consultation</option>
                    <option value="other">★ General Schedule</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className={`font-black uppercase tracking-wider block ${isDay ? "text-black" : "text-stone-300"}`}>
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={editingEvent.eventDate}
                    onChange={(e) => setEditingEvent({ ...editingEvent, eventDate: e.target.value })}
                    className={`w-full h-10 px-3 rounded-xl border focus:outline-none focus:border-[#EA580C] font-bold ${
                      isDay
                        ? "bg-white border-stone-400 text-black"
                        : "bg-zinc-900 border-zinc-700 text-white"
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className={`font-black uppercase tracking-wider block ${isDay ? "text-black" : "text-stone-300"}`}>
                    Time Slot
                  </label>
                  <input
                    type="text"
                    value={editingEvent.timeSlot || ""}
                    onChange={(e) => setEditingEvent({ ...editingEvent, timeSlot: e.target.value })}
                    placeholder="e.g. 1:00 PM - 5:00 PM"
                    className={`w-full h-10 px-3 rounded-xl border focus:outline-none focus:border-[#EA580C] font-bold ${
                      isDay
                        ? "bg-white border-stone-400 text-black"
                        : "bg-zinc-900 border-zinc-700 text-white"
                    }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className={`font-black uppercase tracking-wider block ${isDay ? "text-black" : "text-stone-300"}`}>
                    Guest Count
                  </label>
                  <input
                    type="number"
                    value={editingEvent.guestCount || ""}
                    onChange={(e) => setEditingEvent({ ...editingEvent, guestCount: e.target.value ? Number(e.target.value) : undefined })}
                    placeholder="e.g. 65"
                    className={`w-full h-10 px-3 rounded-xl border focus:outline-none focus:border-[#EA580C] font-bold ${
                      isDay
                        ? "bg-white border-stone-400 text-black"
                        : "bg-zinc-900 border-zinc-700 text-white"
                    }`}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className={`font-black uppercase tracking-wider block ${isDay ? "text-black" : "text-stone-300"}`}>
                  Location / Venue
                </label>
                <input
                  type="text"
                  value={editingEvent.location || ""}
                  onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })}
                  placeholder="Venue address or Commissary Hub"
                  className={`w-full h-10 px-3 rounded-xl border focus:outline-none focus:border-[#EA580C] font-bold ${
                    isDay
                      ? "bg-white border-stone-400 text-black"
                      : "bg-zinc-900 border-zinc-700 text-white"
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className={`font-black uppercase tracking-wider block ${isDay ? "text-black" : "text-stone-300"}`}>
                    Client Name
                  </label>
                  <input
                    type="text"
                    value={editingEvent.clientName || ""}
                    onChange={(e) => setEditingEvent({ ...editingEvent, clientName: e.target.value })}
                    placeholder="e.g. Marcus Vance"
                    className={`w-full h-10 px-3 rounded-xl border focus:outline-none focus:border-[#EA580C] font-bold ${
                      isDay
                        ? "bg-white border-stone-400 text-black"
                        : "bg-zinc-900 border-zinc-700 text-white"
                    }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className={`font-black uppercase tracking-wider block ${isDay ? "text-black" : "text-stone-300"}`}>
                    Client Phone
                  </label>
                  <input
                    type="text"
                    value={editingEvent.clientPhone || ""}
                    onChange={(e) => setEditingEvent({ ...editingEvent, clientPhone: e.target.value })}
                    placeholder="e.g. (773) 555-0199"
                    className={`w-full h-10 px-3 rounded-xl border focus:outline-none focus:border-[#EA580C] font-bold ${
                      isDay
                        ? "bg-white border-stone-400 text-black"
                        : "bg-zinc-900 border-zinc-700 text-white"
                    }`}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className={`font-black uppercase tracking-wider block ${isDay ? "text-black" : "text-stone-300"}`}>
                  Notes &amp; Details
                </label>
                <textarea
                  rows={4}
                  value={editingEvent.notes || ""}
                  onChange={(e) => setEditingEvent({ ...editingEvent, notes: e.target.value })}
                  placeholder="Meats, setup times, trailer parking logistics..."
                  className={`w-full p-3 rounded-xl border focus:outline-none focus:border-[#EA580C] resize-none font-bold ${
                    isDay
                      ? "bg-white border-stone-400 text-black"
                      : "bg-zinc-900 border-zinc-700 text-white"
                  }`}
                />
              </div>

              <div className={`flex items-center justify-end gap-3 pt-3 border-t ${isDay ? "border-stone-200" : "border-zinc-800"}`}>
                <button
                  type="button"
                  onClick={() => setEditingEvent(null)}
                  className={`px-4 py-2 rounded-xl border font-black transition-colors ${
                    isDay
                      ? "border-stone-300 text-black hover:bg-stone-100"
                      : "border-zinc-700 text-stone-300 hover:text-white"
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#EA580C] hover:bg-[#C84A0A] text-white font-black tracking-wide cursor-pointer shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
