"use client";

import { useState, useEffect, useCallback } from "react";
import { WeekendDrop, WeekendDropOrder } from "@/types/weekend-drop";

export const STORAGE_KEY_WEEKEND_DROP = "ats_weekend_drop_active_v1";
export const STORAGE_KEY_DROP_ORDERS = "ats_weekend_drop_orders_v1";
export const EVENT_DROP_UPDATED = "ats-weekend-drop-updated";
export const EVENT_DROP_ORDER_CREATED = "ats-weekend-drop-order-created";

export const DEFAULT_WEEKEND_DROP: WeekendDrop = {
  id: "drop-2026-11-14",
  title: "This Saturday November 14th Features",
  eventDate: "2026-11-14",
  eventDateLabel: "This Saturday, November 14th",
  orderCutoffDate: "2026-11-11",
  orderCutoffLabel: "Wednesday, Nov 11 (11:59 PM)",
  pickupTime: "4:00 PM",
  pickupLocation: "Mason Ave Hub, Chicago (Address texted upon order)",
  deliveryAvailable: true,
  deliveryStartTime: "5:00 PM",
  deliveryNotes: "Chicagoland heated delivery available after 5:00 PM for standard zone delivery fee.",
  zellePhone: "773.707.9988",
  zelleEmail: "bbqcateringking83@gmail.com",
  isActive: true,
  notice: "1st come, 1st served. Pre-paid customers have 1st priority. Limited smoker batch—food sells out fast.",
  options: [
    {
      id: "opt-cornish-hen",
      title: "Whole Cornish Hen Dinner Plate",
      price: 28,
      description: "Seasoned to perfection whole Cornish Hen slow-smoked over hardwood, scratch Southern dressing, candied sweet potatoes, and broccoli/cauliflower casserole.",
      badge: "Chef's Cut",
      includedSides: [
        "Scratch Southern Dressing",
        "Candied Sweet Potatoes",
        "Broccoli & Cauliflower Casserole",
      ],
    },
    {
      id: "opt-chicken-dressing",
      title: "Chicken N' Dressing Dinner Plate",
      price: 21,
      description: "Tender pulled hardwood smoked chicken & Southern dressing, candied sweet potatoes, and broccoli/cauliflower casserole.",
      badge: "Southern Staple",
      includedSides: [
        "Scratch Southern Dressing",
        "Candied Sweet Potatoes",
        "Broccoli & Cauliflower Casserole",
      ],
    },
  ],
};

// Safe localStorage loader
export function getStoredWeekendDrop(): WeekendDrop {
  if (typeof window === "undefined") return DEFAULT_WEEKEND_DROP;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_WEEKEND_DROP);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object" && parsed.id) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Could not load stored weekend drop:", err);
  }
  return DEFAULT_WEEKEND_DROP;
}

export function saveStoredWeekendDrop(drop: WeekendDrop): void {
  if (typeof window === "undefined") return;
  try {
    drop.updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY_WEEKEND_DROP, JSON.stringify(drop));
    window.dispatchEvent(new CustomEvent(EVENT_DROP_UPDATED, { detail: drop }));
    window.dispatchEvent(new Event("storage"));
  } catch (err) {
    console.error("Could not save weekend drop:", err);
  }
}

export function getStoredDropOrders(): WeekendDropOrder[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_DROP_ORDERS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.warn("Could not load stored drop orders:", err);
  }
  return [];
}

export function saveDropOrder(order: WeekendDropOrder): void {
  if (typeof window === "undefined") return;
  try {
    const existing = getStoredDropOrders();
    const updated = [order, ...existing];
    localStorage.setItem(STORAGE_KEY_DROP_ORDERS, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(EVENT_DROP_ORDER_CREATED, { detail: order }));
    window.dispatchEvent(new Event("storage"));

    // Also inject into general admin leads pipeline for Marion
    try {
      const LEADS_STORAGE_KEY = "ats_admin_catering_leads_v1";
      const rawLeads = localStorage.getItem(LEADS_STORAGE_KEY);
      let leads = rawLeads ? JSON.parse(rawLeads) : [];
      if (!Array.isArray(leads)) leads = [];

      const itemsSummary = order.items
        .map((i) => `${i.quantity}x ${i.title} ($${i.price * i.quantity})`)
        .join(", ");

      const leadCard = {
        id: `lead-${order.ticketNumber}`,
        clientName: order.customerName,
        phone: order.customerPhone,
        email: order.customerEmail,
        eventType: "Saturday Dinner Drop Pre-Order",
        eventDate: "2026-11-14",
        guestCount: order.items.reduce((sum, i) => sum + i.quantity, 0),
        estimatedTotal: order.total,
        status: "new",
        source: "weekend-drop-zelle",
        location: order.fulfillmentType === "pickup" ? "Pickup @ Mason" : (order.deliveryAddress || "Delivery Requested"),
        notes: `[TICKET #${order.ticketNumber}] ${itemsSummary} • Fulfillment: ${order.fulfillmentType.toUpperCase()} • Payment: Awaiting Zelle ($${order.total})`,
        createdAt: order.createdAt,
      };

      leads.unshift(leadCard);
      localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(leads));
      window.dispatchEvent(new CustomEvent("ats-leads-updated", { detail: leads }));
    } catch (e) {
      console.warn("Could not pipe drop order to leads pipeline:", e);
    }
  } catch (err) {
    console.error("Could not save drop order:", err);
  }
}

// React Hook
export function useWeekendDrop() {
  const [drop, setDrop] = useState<WeekendDrop>(DEFAULT_WEEKEND_DROP);
  const [isLoaded, setIsLoaded] = useState(false);

  const reload = useCallback(() => {
    setDrop(getStoredWeekendDrop());
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    reload();

    const handleCustom = (e: Event) => {
      const custom = e as CustomEvent<WeekendDrop>;
      if (custom.detail) {
        setDrop(custom.detail);
      } else {
        reload();
      }
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY_WEEKEND_DROP) {
        reload();
      }
    };

    window.addEventListener(EVENT_DROP_UPDATED, handleCustom);
    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener(EVENT_DROP_UPDATED, handleCustom);
      window.removeEventListener("storage", handleStorage);
    };
  }, [reload]);

  // Check if drop is expired past the event date or cutoff
  const today = new Date().toISOString().split("T")[0];
  const isCutoffPassed = drop.orderCutoffDate ? today > drop.orderCutoffDate : false;
  const isEventPassed = drop.eventDate ? today > drop.eventDate : false;

  return {
    drop,
    isLoaded,
    isCutoffPassed,
    isEventPassed,
    updateDrop: saveStoredWeekendDrop,
  };
}

