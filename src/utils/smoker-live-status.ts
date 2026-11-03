"use client";

import { useEffect, useState, useCallback } from "react";
import { PITMASTER_MENU_ITEMS, MenuItem } from "@/data/pitmaster-menu";

export type SmokerItemStatus = "in-stock" | "smoking-now" | "sold-out";

export interface LiveSmokerItemOverride {
  id: string;
  status: SmokerItemStatus;
  readyTime?: string; // e.g. "~4:00 PM", "~5:00 PM", "Ready Now"
  priceOverride?: string;
  batchNote?: string;
  syncToCalendar?: boolean;
}

export interface LiveSmokerState {
  lastUpdated: string;
  items: Record<string, LiveSmokerItemOverride>;
}

export const STORAGE_KEY_LIVE_STATUS = "ats_live_menu_status_v1";
export const STORAGE_KEY_PRICE_CONFIG = "ats_smoker_price_config";
export const EVENT_MENU_UPDATED = "ats-menu-updated";

// Quick Ready-Time Presets for Marion's 1-Tap Control
export const READY_TIME_PRESETS = [
  "~3:00 PM",
  "~4:00 PM",
  "~5:00 PM",
  "~6:00 PM",
  "~7:00 PM",
  "Ready Now",
];

// Helper to safely get all live overrides from localStorage
export function getStoredLiveMenuOverrides(): Record<string, LiveSmokerItemOverride> {
  if (typeof window === "undefined") return {};

  try {
    const raw = localStorage.getItem(STORAGE_KEY_LIVE_STATUS);
    if (raw) {
      const parsed: LiveSmokerState = JSON.parse(raw);
      if (parsed && typeof parsed.items === "object") {
        return parsed.items;
      }
    }

    // Backward compatibility: check ats_smoker_price_config
    const oldConfigRaw = localStorage.getItem(STORAGE_KEY_PRICE_CONFIG);
    if (oldConfigRaw) {
      const oldConfig = JSON.parse(oldConfigRaw);
      if (Array.isArray(oldConfig.meatItems)) {
        const migrated: Record<string, LiveSmokerItemOverride> = {};
        const idMap: Record<string, string> = {
          "meat-brisket": "whole-brisket",
          "meat-st-louis-ribs": "st-louis-ribs",
          "meat-turkey-chops": "turkey-chops",
          "meat-hot-links": "smoked-beef-sausage",
          "meat-pit-wings": "wings-peach-habanero",
          "meat-salmon": "cedar-plank-salmon",
          "meat-burnt-ends": "burnt-ends-specialty",
          "meat-oxtails": "smoked-oxtails",
        };

        for (const item of oldConfig.meatItems) {
          const targetId = idMap[item.id] || item.id;
          migrated[targetId] = {
            id: targetId,
            status: item.status || "in-stock",
            readyTime: item.readyTime || (item.status === "smoking-now" ? "~5:00 PM" : undefined),
            priceOverride: item.basePrice,
            batchNote: item.batchNote,
          };
        }
        return migrated;
      }
    }
  } catch (err) {
    console.warn("Could not load stored live smoker status:", err);
  }

  return {};
}

// Helper to save live overrides and broadcast to all tabs/components
export function saveStoredLiveMenuOverrides(
  items: Record<string, LiveSmokerItemOverride>
): void {
  if (typeof window === "undefined") return;

  try {
    const state: LiveSmokerState = {
      lastUpdated: new Date().toISOString(),
      items,
    };
    localStorage.setItem(STORAGE_KEY_LIVE_STATUS, JSON.stringify(state));

    // Dispatch custom event for same-window reactive updates
    window.dispatchEvent(new CustomEvent(EVENT_MENU_UPDATED, { detail: items }));
  } catch (err) {
    console.error("Could not save live smoker status:", err);
  }
}

// Helper to sync live smoking item to Marion's Smokehouse Calendar
export function syncLiveSmokeToCalendar(
  itemId: string,
  itemName: string,
  status: SmokerItemStatus,
  readyTime?: string
): void {
  if (typeof window === "undefined") return;

  try {
    const calendarKey = "ats_admin_calendar_events";
    const rawCalendar = localStorage.getItem(calendarKey);
    let events: any[] = [];
    if (rawCalendar) {
      events = JSON.parse(rawCalendar);
    }

    const todayDate = new Date().toISOString().split("T")[0];
    const eventId = `live-smoke-${itemId}-${todayDate}`;
    const existingIndex = events.findIndex((e) => e.id === eventId);

    if (status === "smoking-now") {
      const timeDisplay = readyTime ? `Ready at ${readyTime}` : "Ready Today";
      const newCalEvent = {
        id: eventId,
        title: `🔥 Pit Smoke: ${itemName} (${timeDisplay})`,
        eventType: "prep",
        eventDate: todayDate,
        timeSlot: `Smoking Now • ${timeDisplay}`,
        guestCount: undefined,
        location: "Marion's Trailer Smoker Rig (Commissary)",
        notes: `Live hardwood pit session for ${itemName}. Automatically synchronized from Smoker Menu Configurator. Customer menu badge active.`,
        clientName: "Pitmaster Marion Bolden (Commissary Cook)",
        clientPhone: "(773) 707-9988",
        isCompleted: false,
      };

      if (existingIndex >= 0) {
        events[existingIndex] = { ...events[existingIndex], ...newCalEvent };
      } else {
        events.unshift(newCalEvent);
      }
      localStorage.setItem(calendarKey, JSON.stringify(events));
    } else if (existingIndex >= 0) {
      // If switched away from smoking-now, mark event completed or remove
      events[existingIndex].isCompleted = true;
      events[existingIndex].notes += ` [Status changed to ${status.toUpperCase()} at ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}]`;
      localStorage.setItem(calendarKey, JSON.stringify(events));
    }
  } catch (e) {
    console.warn("Could not auto-sync live smoke to calendar:", e);
  }
}

// React Hook for consuming live smoker status reactively across the site
export function useLiveSmokerStatus() {
  const [overrides, setOverrides] = useState<Record<string, LiveSmokerItemOverride>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  const reload = useCallback(() => {
    const loaded = getStoredLiveMenuOverrides();
    setOverrides(loaded);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    reload();

    const handleCustomEvent = (event: Event) => {
      const custom = event as CustomEvent<Record<string, LiveSmokerItemOverride>>;
      if (custom.detail) {
        setOverrides(custom.detail);
      } else {
        reload();
      }
    };

    const handleStorageEvent = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY_LIVE_STATUS || event.key === STORAGE_KEY_PRICE_CONFIG) {
        reload();
      }
    };

    window.addEventListener(EVENT_MENU_UPDATED, handleCustomEvent);
    window.addEventListener("storage", handleStorageEvent);

    return () => {
      window.removeEventListener(EVENT_MENU_UPDATED, handleCustomEvent);
      window.removeEventListener("storage", handleStorageEvent);
    };
  }, [reload]);

  const getItemStatus = useCallback(
    (id: string): { status: SmokerItemStatus; readyTime?: string; priceOverride?: string } => {
      const itemOverride = overrides[id];
      if (itemOverride) {
        return {
          status: itemOverride.status || "in-stock",
          readyTime: itemOverride.readyTime,
          priceOverride: itemOverride.priceOverride,
        };
      }
      return { status: "in-stock" };
    },
    [overrides]
  );

  // Return list of all currently smoking items
  const activeSmokingItems = Object.values(overrides).filter(
    (item) => item.status === "smoking-now"
  );

  return {
    overrides,
    isLoaded,
    getItemStatus,
    activeSmokingItems,
    reload,
  };
}

