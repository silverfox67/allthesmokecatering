"use client";

import { useEffect, useState, useCallback } from "react";
import {
  WEEKLY_CHALKBOARD,
  WeeklyChalkboard,
  WeeklyChalkboardItem,
} from "@/data/pitmaster-menu";

export const STORAGE_KEY_CHALKBOARD = "ats_weekly_chalkboard_config_v1";
export const EVENT_CHALKBOARD_UPDATED = "ats-chalkboard-updated";

// Helper to safely fetch the stored chalkboard configuration from localStorage
export function getStoredWeeklyChalkboard(): WeeklyChalkboard {
  if (typeof window === "undefined") return WEEKLY_CHALKBOARD;

  try {
    const raw = localStorage.getItem(STORAGE_KEY_CHALKBOARD);
    if (raw) {
      const parsed: WeeklyChalkboard = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.items) && parsed.items.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Could not load stored chalkboard specials:", err);
  }

  return WEEKLY_CHALKBOARD;
}

// Helper to save updated chalkboard and broadcast to all pages and components
export function saveStoredWeeklyChalkboard(chalkboard: WeeklyChalkboard): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY_CHALKBOARD, JSON.stringify(chalkboard));
    window.dispatchEvent(
      new CustomEvent(EVENT_CHALKBOARD_UPDATED, { detail: chalkboard })
    );
    window.dispatchEvent(new Event("storage"));
  } catch (err) {
    console.error("Could not save chalkboard specials:", err);
  }
}

// Helper to reset to original smokehouse defaults
export function resetStoredWeeklyChalkboard(): WeeklyChalkboard {
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(STORAGE_KEY_CHALKBOARD);
      window.dispatchEvent(
        new CustomEvent(EVENT_CHALKBOARD_UPDATED, { detail: WEEKLY_CHALKBOARD })
      );
      window.dispatchEvent(new Event("storage"));
    } catch (e) {
      console.warn("Could not reset chalkboard:", e);
    }
  }
  return WEEKLY_CHALKBOARD;
}

// React Hook to consume live chalkboard reactively across homepage, specials page, & admin
export function useWeeklyChalkboard(): {
  chalkboard: WeeklyChalkboard;
  saveChalkboard: (cb: WeeklyChalkboard) => void;
  resetChalkboard: () => void;
} {
  const [chalkboard, setChalkboard] = useState<WeeklyChalkboard>(WEEKLY_CHALKBOARD);

  useEffect(() => {
    // Initial sync
    setChalkboard(getStoredWeeklyChalkboard());

    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<WeeklyChalkboard>;
      if (customEvent.detail) {
        setChalkboard(customEvent.detail);
      } else {
        setChalkboard(getStoredWeeklyChalkboard());
      }
    };

    window.addEventListener(EVENT_CHALKBOARD_UPDATED, handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener(EVENT_CHALKBOARD_UPDATED, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const save = useCallback((cb: WeeklyChalkboard) => {
    setChalkboard(cb);
    saveStoredWeeklyChalkboard(cb);
  }, []);

  const reset = useCallback(() => {
    const def = resetStoredWeeklyChalkboard();
    setChalkboard(def);
  }, []);

  return {
    chalkboard,
    saveChalkboard: save,
    resetChalkboard: reset,
  };
}

