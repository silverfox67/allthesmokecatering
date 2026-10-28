"use client";

import React, { useState, useRef, useEffect } from "react";

interface CalendarDatePickerProps {
  id?: string;
  name?: string;
  value: string; // "YYYY-MM-DD"
  onChange: (dateStr: string) => void;
  required?: boolean;
  minDate?: string; // "YYYY-MM-DD"
  placeholder?: string;
  className?: string;
  theme?: "light" | "dark";
}

export function CalendarDatePicker({
  id = "event-date-picker",
  name = "eventDate",
  value,
  onChange,
  required = false,
  minDate,
  placeholder = "Select event date...",
  className = "",
  theme = "light",
}: CalendarDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse initial view month from value or current date
  const getInitialDate = () => {
    if (value && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const [y, m, d] = value.split("-").map(Number);
      return new Date(y, m - 1, d);
    }
    return new Date();
  };

  const [viewDate, setViewDate] = useState<Date>(getInitialDate);

  // Sync viewDate when value changes
  useEffect(() => {
    if (value && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const [y, m, d] = value.split("-").map(Number);
      setViewDate(new Date(y, m - 1, d));
    }
  }, [value]);

  // Click outside listener to close calendar
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const effectiveMinDate = minDate || todayStr;

  const currentYear = viewDate.getFullYear();
  const currentMonth = viewDate.getMonth(); // 0-indexed

  // Navigation handlers
  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setViewDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setViewDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const handleSelectDate = (dateStr: string) => {
    onChange(dateStr);
    const [y, m, d] = dateStr.split("-").map(Number);
    setViewDate(new Date(y, m - 1, d));
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
  };

  // Format display text (e.g. "Sat, Nov 14, 2026")
  const formatDisplay = (val: string) => {
    if (!val || !/^\d{4}-\d{2}-\d{2}$/.test(val)) return "";
    const [y, m, d] = val.split("-").map(Number);
    const dateObj = new Date(y, m - 1, d);
    return dateObj.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Calendar days calculation
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sun
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

  const calendarDays: {
    dayNum: number;
    dateStr: string;
    isCurrentMonth: boolean;
    isPast: boolean;
    isSelected: boolean;
    isToday: boolean;
  }[] = [];

  // Trailing days of previous month
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const d = daysInPrevMonth - i;
    const prevM = currentMonth === 0 ? 12 : currentMonth;
    const prevY = currentMonth === 0 ? currentYear - 1 : currentYear;
    const dateStr = `${prevY}-${String(prevM).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    calendarDays.push({
      dayNum: d,
      dateStr,
      isCurrentMonth: false,
      isPast: dateStr < effectiveMinDate,
      isSelected: dateStr === value,
      isToday: dateStr === todayStr,
    });
  }

  // Days of current month
  for (let i = 1; i <= daysInMonth; i++) {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
    calendarDays.push({
      dayNum: i,
      dateStr,
      isCurrentMonth: true,
      isPast: dateStr < effectiveMinDate,
      isSelected: dateStr === value,
      isToday: dateStr === todayStr,
    });
  }

  // Leading days of next month to complete 35 or 42 grid cells
  const remaining = (7 - (calendarDays.length % 7)) % 7;
  for (let i = 1; i <= remaining; i++) {
    const nextM = currentMonth === 11 ? 1 : currentMonth + 2;
    const nextY = currentMonth === 11 ? currentYear + 1 : currentYear;
    const dateStr = `${nextY}-${String(nextM).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
    calendarDays.push({
      dayNum: i,
      dateStr,
      isCurrentMonth: false,
      isPast: dateStr < effectiveMinDate,
      isSelected: dateStr === value,
      isToday: dateStr === todayStr,
    });
  }

  // Quick preset shortcuts
  const handlePreset = (daysAhead: number) => {
    const target = new Date();
    target.setDate(target.getDate() + daysAhead);
    const dateStr = `${target.getFullYear()}-${String(target.getMonth() + 1).padStart(2, "0")}-${String(target.getDate()).padStart(2, "0")}`;
    onChange(dateStr);
    setViewDate(target);
    setIsOpen(false);
  };

  const isLight = theme === "light";

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Hidden input for required form validation */}
      <input
        type="text"
        id={id}
        name={name}
        value={value}
        required={required}
        onChange={() => {}}
        tabIndex={-1}
        aria-hidden="true"
        className="opacity-0 pointer-events-none absolute w-px h-px bottom-0 left-1/2 -translate-x-1/2"
      />

      {/* Visible Trigger Box */}
      <button
        type="button"
        id={`${id}-trigger`}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full h-11 px-3.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer select-none font-medium text-sm text-left ${
          isLight
            ? "bg-[#FAF8F5] border-stone-300 text-stone-900 hover:border-stone-400 focus:border-[#EA580C] focus:ring-1 focus:ring-[#EA580C]"
            : "bg-[#191614] border-[#3A312A] text-[#F4EFEA] hover:border-[#52443A] focus:border-[#EA580C] focus:ring-1 focus:ring-[#EA580C]"
        } ${isOpen ? "ring-2 ring-[#EA580C]/30 border-[#EA580C]" : ""} ${className}`}
      >
        <div className="flex items-center gap-2.5 truncate">
          <span className="text-base text-[#EA580C] shrink-0">📅</span>
          {value ? (
            <span className="font-bold text-sm truncate">
              {formatDisplay(value)}
            </span>
          ) : (
            <span className={isLight ? "text-stone-400 font-normal" : "text-stone-500 font-normal"}>
              {placeholder}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className={`p-1 rounded-full text-xs font-bold transition-colors ${
                isLight ? "text-stone-400 hover:text-black hover:bg-stone-200" : "text-stone-400 hover:text-white hover:bg-zinc-800"
              }`}
              title="Clear date"
            >
              ✕
            </button>
          )}
          <span className="text-xs text-stone-400">
            {isOpen ? "▲" : "▼"}
          </span>
        </div>
      </button>

      {/* Interactive Calendar Popover Dropdown */}
      {isOpen && (
        <div
          className={`absolute left-0 top-full mt-2 z-50 w-full sm:w-[320px] p-4 rounded-2xl border shadow-2xl animate-in fade-in zoom-in-95 duration-150 ${
            isLight
              ? "bg-white border-stone-300 text-stone-900"
              : "bg-[#161311] border-zinc-750 text-white"
          }`}
        >
          {/* Calendar Header: Month, Year & Navigation */}
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-stone-200 dark:border-zinc-800">
            <h4 className="font-black text-sm tracking-wide flex items-center gap-1.5 text-[#C8A97E]">
              <span>★</span>
              <span>
                {viewDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </span>
            </h4>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handlePrevMonth}
                className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black transition-colors cursor-pointer ${
                  isLight
                    ? "bg-stone-100 hover:bg-stone-200 text-black border border-stone-300"
                    : "bg-zinc-800 hover:bg-zinc-700 text-stone-200 border border-zinc-700"
                }`}
                title="Previous Month"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black transition-colors cursor-pointer ${
                  isLight
                    ? "bg-stone-100 hover:bg-stone-200 text-black border border-stone-300"
                    : "bg-zinc-800 hover:bg-zinc-700 text-stone-200 border border-zinc-700"
                }`}
                title="Next Month"
              >
                ›
              </button>
            </div>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-black uppercase tracking-wider text-stone-400 mb-1.5">
            <div>Su</div>
            <div>Mo</div>
            <div>Tu</div>
            <div>We</div>
            <div>Th</div>
            <div>Fr</div>
            <div>Sa</div>
          </div>

          {/* Days of Month Grid */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs">
            {calendarDays.map((calDay, idx) => {
              const isDisabled = calDay.isPast;

              let cellStyle = "";
              if (calDay.isSelected) {
                cellStyle = "bg-[#EA580C] text-white font-black shadow-md scale-105 z-10";
              } else if (isDisabled) {
                cellStyle = "opacity-25 cursor-not-allowed text-stone-400";
              } else if (calDay.isCurrentMonth) {
                cellStyle = isLight
                  ? "text-black font-bold hover:bg-amber-100/80 hover:text-[#EA580C]"
                  : "text-stone-200 font-bold hover:bg-zinc-800 hover:text-[#FF7A00]";
              } else {
                cellStyle = isLight
                  ? "text-stone-400 hover:bg-stone-100"
                  : "text-stone-600 hover:bg-zinc-900";
              }

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => !isDisabled && handleSelectDate(calDay.dateStr)}
                  className={`h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer relative ${cellStyle}`}
                >
                  <span>{calDay.dayNum}</span>
                  {calDay.isToday && !calDay.isSelected && (
                    <span className="absolute bottom-1 w-1 h-1 rounded-full bg-[#EA580C]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Shortcuts */}
          <div className="mt-3 pt-2.5 border-t border-stone-200 dark:border-zinc-800 flex items-center justify-between text-[11px] font-bold text-[#EA580C]">
            <span className="text-[10px] uppercase font-black tracking-wider text-stone-400">Quick:</span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handlePreset(7)}
                className={`px-2 py-0.5 rounded-md border text-[10px] font-extrabold cursor-pointer transition-colors ${
                  isLight
                    ? "bg-amber-50 hover:bg-amber-100 border-amber-300 text-stone-900"
                    : "bg-zinc-850 hover:bg-zinc-800 border-zinc-700 text-amber-300"
                }`}
              >
                In 1 Wk
              </button>
              <button
                type="button"
                onClick={() => handlePreset(14)}
                className={`px-2 py-0.5 rounded-md border text-[10px] font-extrabold cursor-pointer transition-colors ${
                  isLight
                    ? "bg-amber-50 hover:bg-amber-100 border-amber-300 text-stone-900"
                    : "bg-zinc-850 hover:bg-zinc-800 border-zinc-700 text-amber-300"
                }`}
              >
                In 2 Wks
              </button>
              <button
                type="button"
                onClick={() => handlePreset(30)}
                className={`px-2 py-0.5 rounded-md border text-[10px] font-extrabold cursor-pointer transition-colors ${
                  isLight
                    ? "bg-amber-50 hover:bg-amber-100 border-amber-300 text-stone-900"
                    : "bg-zinc-850 hover:bg-zinc-800 border-zinc-700 text-amber-300"
                }`}
              >
                In 1 Mo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
