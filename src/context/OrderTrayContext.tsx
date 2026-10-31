"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface TrayItem {
  id: string; // Unique id for tray item (e.g. "mac-cheese-half" or "mac-cheese-full")
  baseId: string;
  name: string;
  selectedOption?: string; // e.g. "Half Pan (12-15)" or "Full Pan (25-30)"
  price: number;
  quantity: number;
  image?: string;
  portion?: string;
  category?: string;
}

interface OrderTrayContextType {
  trayItems: TrayItem[];
  isOpen: boolean;
  openTray: () => void;
  closeTray: () => void;
  toggleTray: () => void;
  addItem: (item: Omit<TrayItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearTray: () => void;
  totalItemCount: number;
  subtotal: number;
}

const OrderTrayContext = createContext<OrderTrayContextType | undefined>(undefined);

const STORAGE_KEY = "ats_smokehouse_order_tray_v1";

export function OrderTrayProvider({ children }: { children: React.ReactNode }) {
  const [trayItems, setTrayItems] = useState<TrayItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setTrayItems(parsed);
        }
      }
    } catch (e) {
      console.warn("Failed to read order tray from localStorage", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trayItems));
    } catch (e) {
      console.warn("Failed to persist order tray to localStorage", e);
    }
  }, [trayItems, isLoaded]);

  const openTray = () => setIsOpen(true);
  const closeTray = () => setIsOpen(false);
  const toggleTray = () => setIsOpen((prev) => !prev);

  const addItem = (item: Omit<TrayItem, "quantity"> & { quantity?: number }) => {
    const qtyToAdd = item.quantity || 1;
    setTrayItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.id === item.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += qtyToAdd;
        return updated;
      }
      return [...prev, { ...item, quantity: qtyToAdd }];
    });
    setIsOpen(true); // Automatically open the tray to show the item was added
  };

  const removeItem = (id: string) => {
    setTrayItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setTrayItems((prev) => {
      return prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as TrayItem[];
    });
  };

  const clearTray = () => {
    setTrayItems([]);
  };

  const totalItemCount = trayItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = trayItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <OrderTrayContext.Provider
      value={{
        trayItems,
        isOpen,
        openTray,
        closeTray,
        toggleTray,
        addItem,
        removeItem,
        updateQuantity,
        clearTray,
        totalItemCount,
        subtotal,
      }}
    >
      {children}
    </OrderTrayContext.Provider>
  );
}

export function useOrderTray() {
  const context = useContext(OrderTrayContext);
  if (!context) {
    throw new Error("useOrderTray must be used within an OrderTrayProvider");
  }
  return context;
}

