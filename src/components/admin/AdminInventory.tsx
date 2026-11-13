"use client";

import React, { useState, useEffect, useMemo } from "react";
import { AdminTheme } from "./AdminPortal";
import { AdminGuide } from "./AdminGuide";

export type InventoryCategory = "wood" | "menu-stock" | "supplies";

export interface InventoryItem {
  id: string;
  category: InventoryCategory;
  name: string;
  qty: number;
  par: number;
  unit: string;
  unitCost: number;
  supplier: string;
  notes?: string;
  updatedAt: string;
}

interface WoodSupplierInfo {
  name: string;
  phone: string;
  defaultOrderNote: string;
  lastOrderDate?: string;
}

interface AdminInventoryProps {
  theme: AdminTheme;
  /** Driven by sidebar: wood | menu-stock | supplies */
  subTab?: string;
}

const INVENTORY_STORAGE_KEY = "ats_pitmaster_inventory_v1";
const SUPPLIER_STORAGE_KEY = "ats_wood_supplier_v1";

const DEFAULT_SUPPLIER: WoodSupplierInfo = {
  name: "Local Hardwood Guy",
  phone: "",
  defaultOrderNote: "1/2 cord seasoned Post Oak + 1/4 cord Hickory splits",
};

const STARTER_INVENTORY: InventoryItem[] = [
  // Wood & Fuel
  {
    id: "wood-oak",
    category: "wood",
    name: "Seasoned Post Oak Splits",
    qty: 1.25,
    par: 0.5,
    unit: "cords",
    unitCost: 340,
    supplier: "Local Hardwood Guy",
    notes: "Primary base heat for brisket & pork butts",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "wood-hickory",
    category: "wood",
    name: "Hickory Splits",
    qty: 0.5,
    par: 0.5,
    unit: "cords",
    unitCost: 360,
    supplier: "Local Hardwood Guy",
    notes: "Ribs, shoulders & deep smoke flavor",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "wood-cherry",
    category: "wood",
    name: "Cherry / Apple Fruitwood",
    qty: 8,
    par: 5,
    unit: "bags",
    unitCost: 22,
    supplier: "Local Hardwood Guy",
    notes: "Color & sweet smoke for poultry & ribs",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "wood-charcoal",
    category: "wood",
    name: "Hardwood Lump Charcoal (20 lb)",
    qty: 6,
    par: 4,
    unit: "bags",
    unitCost: 24,
    supplier: "Restaurant Depot",
    notes: "Coal bed starter",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "wood-propane",
    category: "wood",
    name: "Propane Tanks (Burner / Warmer)",
    qty: 3,
    par: 2,
    unit: "tanks",
    unitCost: 25,
    supplier: "Ace Hardware",
    updatedAt: new Date().toISOString(),
  },

  // Menu & Meat Stock
  {
    id: "meat-brisket",
    category: "menu-stock",
    name: "Whole Packer Brisket (Prime/Choice)",
    qty: 6,
    par: 4,
    unit: "briskets",
    unitCost: 68,
    supplier: "Restaurant Depot",
    notes: "14-16 lb avg",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "meat-ribs",
    category: "menu-stock",
    name: "St. Louis Spare Ribs",
    qty: 12,
    par: 8,
    unit: "racks",
    unitCost: 16,
    supplier: "Restaurant Depot",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "meat-porkbutt",
    category: "menu-stock",
    name: "Bone-In Pork Butts",
    qty: 8,
    par: 4,
    unit: "butts",
    unitCost: 22,
    supplier: "Restaurant Depot",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "meat-chicken",
    category: "menu-stock",
    name: "Chicken Leg Quarters / Wings",
    qty: 40,
    par: 25,
    unit: "lbs",
    unitCost: 1.9,
    supplier: "Restaurant Depot",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "meat-links",
    category: "menu-stock",
    name: "Smoked Beef & Polish Links",
    qty: 15,
    par: 10,
    unit: "lbs",
    unitCost: 4.5,
    supplier: "Sam's Club",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "side-mac",
    category: "menu-stock",
    name: "Smoked Mac & Cheese Prep",
    qty: 4,
    par: 3,
    unit: "full pans",
    unitCost: 24,
    supplier: "Restaurant Depot",
    updatedAt: new Date().toISOString(),
  },

  // Supplies & Disposables
  {
    id: "sup-butcher",
    category: "supplies",
    name: '24" Pink Butcher Paper Roll',
    qty: 2,
    par: 1,
    unit: "rolls",
    unitCost: 38,
    supplier: "Restaurant Depot / Amazon",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "sup-foilpans",
    category: "supplies",
    name: "Full-Size Deep Foil Catering Pans",
    qty: 25,
    par: 15,
    unit: "pans",
    unitCost: 1.4,
    supplier: "Restaurant Depot",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "sup-halfpans",
    category: "supplies",
    name: "Half-Size Foil Pans + Lids",
    qty: 30,
    par: 15,
    unit: "pans",
    unitCost: 0.95,
    supplier: "Restaurant Depot",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "sup-gloves",
    category: "supplies",
    name: "Black Nitrile Gloves (Box of 100)",
    qty: 2,
    par: 2,
    unit: "boxes",
    unitCost: 14,
    supplier: "Restaurant Depot",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "sup-rub",
    category: "supplies",
    name: "House SPG & BBQ Rub Batch",
    qty: 8,
    par: 4,
    unit: "lbs",
    unitCost: 5.5,
    supplier: "In-House / Sam's",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "sup-sauce",
    category: "supplies",
    name: "Signature BBQ Sauce (Gallon)",
    qty: 3,
    par: 2,
    unit: "gallons",
    unitCost: 18,
    supplier: "In-House",
    updatedAt: new Date().toISOString(),
  },
];

const INVENTORY_GUIDES: Record<
  InventoryCategory,
  { title: string; summary: string; steps: { title: string; desc: string }[]; tip?: string }
> = {
  wood: {
    title: "How Wood & Fuel Stock works",
    summary: "Keep track of your woodpile, charcoal, and propane so you never run dry mid-cook.",
    steps: [
      { title: "Tap + or - anytime", desc: "Use the + and - buttons on any wood or fuel card as you burn or unload." },
      { title: "Add, edit, or delete", desc: "Tap + Add Item to add a new wood or fuel, or Edit on any row to update cost and low-stock alerts." },
      { title: "1-Tap text your wood guy", desc: "Save your supplier's number below to text them a pre-filled wood order in one tap." },
    ],
    tip: "Any item at or below its Low Alert number turns orange/red and jumps onto your Restock List automatically.",
  },
  "menu-stock": {
    title: "How Menu & Meat Stock works",
    summary: "Count what's in the walk-in, freezer, or prepped for the weekend.",
    steps: [
      { title: "Check weekend par", desc: "Each meat and side shows how much you have on hand vs. your weekend minimum (Low Alert)." },
      { title: "Quick count with + / -", desc: "Adjust briskets, rib racks, butts, or pans with one tap after prep or a pop-up." },
      { title: "Customize your list", desc: "Add new menu items, change units (lbs, racks, pans), or delete items you aren't running." },
    ],
  },
  supplies: {
    title: "How Supplies & Restock List works",
    summary: "Track butcher paper, foil pans, gloves, rubs, and see everything you need to buy in one place.",
    steps: [
      { title: "Review Needs Reorder", desc: "The top box automatically lists every wood, meat, and supply running low across all tabs." },
      { title: "Copy or text your run", desc: "Tap Copy Order List before heading to Restaurant Depot or Sam's Club." },
      { title: "Keep counts fresh", desc: "Add, edit, or delete any supply item anytime — everything saves automatically." },
    ],
  },
};

const UNIT_OPTIONS = [
  "cords",
  "splits",
  "bags",
  "tanks",
  "lbs",
  "briskets",
  "racks",
  "butts",
  "full pans",
  "half pans",
  "pans",
  "rolls",
  "boxes",
  "cases",
  "gallons",
  "bottles",
];

export function AdminInventory({ theme, subTab }: AdminInventoryProps) {
  const isDay = theme === "day";
  const activeCategory: InventoryCategory =
    subTab === "menu-stock" || subTab === "supplies" ? subTab : "wood";

  const [items, setItems] = useState<InventoryItem[]>(STARTER_INVENTORY);
  const [supplierInfo, setSupplierInfo] = useState<WoodSupplierInfo>(DEFAULT_SUPPLIER);
  const [loaded, setLoaded] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [lowOnly, setLowOnly] = useState(false);
  const [copiedList, setCopiedList] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(false);

  // Add / Edit Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formCategory, setFormCategory] = useState<InventoryCategory>("wood");
  const [formName, setFormName] = useState("");
  const [formQty, setFormQty] = useState("1");
  const [formPar, setFormPar] = useState("1");
  const [formUnit, setFormUnit] = useState("bags");
  const [formCost, setFormCost] = useState("0");
  const [formSupplier, setFormSupplier] = useState("");
  const [formNotes, setFormNotes] = useState("");

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(INVENTORY_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setItems(parsed);
        }
      }
      const savedSup = localStorage.getItem(SUPPLIER_STORAGE_KEY);
      if (savedSup) {
        setSupplierInfo({ ...DEFAULT_SUPPLIER, ...JSON.parse(savedSup) });
      }
    } catch {
      // ignore storage errors
    } finally {
      setLoaded(true);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items, loaded]);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(SUPPLIER_STORAGE_KEY, JSON.stringify(supplierInfo));
    } catch {}
  }, [supplierInfo, loaded]);

  const lowStockAll = useMemo(
    () => items.filter((item) => item.qty <= item.par),
    [items]
  );

  const lowStockWood = useMemo(
    () => lowStockAll.filter((item) => item.category === "wood"),
    [lowStockAll]
  );

  const categoryItems = useMemo(() => {
    return items.filter((item) => {
      if (item.category !== activeCategory) return false;
      if (lowOnly && item.qty > item.par) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.name.toLowerCase().includes(q) ||
          item.supplier.toLowerCase().includes(q) ||
          (item.notes || "").toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [items, activeCategory, lowOnly, searchQuery]);

  const totalCategoryValue = useMemo(
    () =>
      items
        .filter((i) => i.category === activeCategory)
        .reduce((sum, i) => sum + i.qty * i.unitCost, 0),
    [items, activeCategory]
  );

  const estimatedReorderCost = useMemo(
    () =>
      lowStockAll.reduce((sum, i) => {
        const needed = Math.max(1, Math.ceil(i.par * 2 - i.qty));
        return sum + needed * i.unitCost;
      }, 0),
    [lowStockAll]
  );

  const adjustQty = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const step = item.unit === "cords" ? delta * 0.25 : delta;
        const next = Math.max(0, Math.round((item.qty + step) * 100) / 100);
        return { ...item, qty: next, updatedAt: new Date().toISOString() };
      })
    );
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormCategory(activeCategory);
    setFormName("");
    setFormQty("1");
    setFormPar("1");
    setFormUnit(
      activeCategory === "wood"
        ? "cords"
        : activeCategory === "menu-stock"
        ? "lbs"
        : "cases"
    );
    setFormCost("0");
    setFormSupplier(
      activeCategory === "wood" ? supplierInfo.name : "Restaurant Depot"
    );
    setFormNotes("");
    setModalOpen(true);
  };

  const openEditModal = (item: InventoryItem) => {
    setEditingId(item.id);
    setFormCategory(item.category);
    setFormName(item.name);
    setFormQty(String(item.qty));
    setFormPar(String(item.par));
    setFormUnit(item.unit);
    setFormCost(String(item.unitCost));
    setFormSupplier(item.supplier);
    setFormNotes(item.notes || "");
    setModalOpen(true);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const qty = Math.max(0, parseFloat(formQty) || 0);
    const par = Math.max(0, parseFloat(formPar) || 0);
    const unitCost = Math.max(0, parseFloat(formCost) || 0);

    if (editingId) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? {
                ...item,
                category: formCategory,
                name: formName.trim(),
                qty,
                par,
                unit: formUnit.trim() || "units",
                unitCost,
                supplier: formSupplier.trim() || "Local Supplier",
                notes: formNotes.trim() || undefined,
                updatedAt: new Date().toISOString(),
              }
            : item
        )
      );
    } else {
      const newItem: InventoryItem = {
        id: `inv-${Date.now()}`,
        category: formCategory,
        name: formName.trim(),
        qty,
        par,
        unit: formUnit.trim() || "units",
        unitCost,
        supplier: formSupplier.trim() || "Local Supplier",
        notes: formNotes.trim() || undefined,
        updatedAt: new Date().toISOString(),
      };
      setItems((prev) => [newItem, ...prev]);
    }
    setModalOpen(false);
  };

  const handleDeleteItem = (id: string, name: string) => {
    if (typeof window !== "undefined" && !window.confirm(`Delete "${name}" from inventory?`)) {
      return;
    }
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const buildOrderText = (list: InventoryItem[]) => {
    if (list.length === 0) {
      return "All The Smoke BBQ & Catering — Everything is stocked above par!";
    }
    const lines = list.map(
      (i) => `- ${i.name}: ${i.qty} ${i.unit} left (Low alert: ${i.par}) — ${i.supplier}`
    );
    return `All The Smoke BBQ Restock List:\n${lines.join("\n")}`;
  };

  const handleCopyReorderList = () => {
    const text = buildOrderText(lowStockAll);
    const markDone = () => {
      setCopiedList(true);
      setTimeout(() => setCopiedList(false), 2000);
    };

    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(markDone).catch(() => {});
      return;
    }
    const el = document.createElement("textarea");
    el.value = text;
    el.style.position = "fixed";
    el.style.opacity = "0";
    document.body.appendChild(el);
    el.select();
    try {
      document.execCommand("copy");
      markDone();
    } catch {}
    document.body.removeChild(el);
  };

  const handleTextWoodOrder = () => {
    const cleanPhone = supplierInfo.phone.replace(/\D/g, "");
    const lowWoodText =
      lowStockWood.length > 0
        ? lowStockWood.map((w) => `${w.name} (${w.qty} ${w.unit} left)`).join(", ")
        : supplierInfo.defaultOrderNote;
    const msg = `Hey ${supplierInfo.name}, this is Marion with All The Smoke BBQ. Looking to schedule a wood order: ${lowWoodText}. Let me know when works!`;
    window.location.href = cleanPhone
      ? `sms:${cleanPhone}?body=${encodeURIComponent(msg)}`
      : `sms:?body=${encodeURIComponent(msg)}`;
  };

  const guide = INVENTORY_GUIDES[activeCategory];

  const cardSurface = isDay
    ? "bg-white border-[#D8CEC1] text-stone-900 shadow-sm"
    : "bg-[#181416] border-zinc-800 text-stone-100";

  const mutedText = isDay ? "text-stone-600" : "text-stone-400";

  const categoryTitle =
    activeCategory === "wood"
      ? "Wood & Fuel Inventory"
      : activeCategory === "menu-stock"
      ? "Menu & Meat Stock"
      : "Supplies & Restock List";

  return (
    <div className="space-y-6">
      <AdminGuide
        guideId={`inventory-${activeCategory}`}
        theme={theme}
        title={guide.title}
        summary={guide.summary}
        steps={guide.steps}
        tip={guide.tip}
      />

      {/* TOP KPI STRIP */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className={`p-4 rounded-2xl border ${cardSurface}`}>
          <p className={`text-[11px] font-bold uppercase tracking-wider ${mutedText}`}>
            {categoryTitle}
          </p>
          <p className="text-2xl font-black mt-1">
            {items.filter((i) => i.category === activeCategory).length} Items
          </p>
          <p className={`text-xs mt-0.5 ${mutedText}`}>
            Est. On-Hand Value: ${totalCategoryValue.toFixed(0)}
          </p>
        </div>

        <div
          className={`p-4 rounded-2xl border ${
            lowStockAll.length > 0
              ? isDay
                ? "bg-amber-50 border-amber-300 text-amber-950"
                : "bg-amber-950/30 border-amber-500/40 text-amber-100"
              : cardSurface
          }`}
        >
          <p className="text-[11px] font-bold uppercase tracking-wider opacity-80">
            Low Stock Alerts (All Tabs)
          </p>
          <p className="text-2xl font-black mt-1">
            {lowStockAll.length} {lowStockAll.length === 1 ? "Item" : "Items"}
          </p>
          <p className="text-xs mt-0.5 opacity-80">
            {lowStockAll.length > 0
              ? `Est. Restock: ~$${estimatedReorderCost.toFixed(0)}`
              : "Everything is stocked above par"}
          </p>
        </div>

        <div className={`p-4 rounded-2xl border flex flex-col justify-between gap-2 ${cardSurface}`}>
          <p className={`text-[11px] font-bold uppercase tracking-wider ${mutedText}`}>
            Quick Actions
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={openAddModal}
              className="flex-1 min-h-[44px] px-3 rounded-xl bg-gradient-to-r from-[#EA580C] to-[#D97706] hover:from-[#F97316] hover:to-[#EA580C] text-white font-bold text-xs shadow transition cursor-pointer"
            >
              + Add Item
            </button>
            <button
              type="button"
              onClick={handleCopyReorderList}
              className={`min-h-[44px] px-3 rounded-xl border text-xs font-bold transition cursor-pointer ${
                isDay
                  ? "bg-stone-100 hover:bg-stone-200 border-stone-300 text-stone-800"
                  : "bg-zinc-900 hover:bg-zinc-800 border-zinc-700 text-stone-200"
              }`}
            >
              {copiedList ? "✓ Copied!" : "📋 Order List"}
            </button>
          </div>
        </div>
      </div>

      {/* WOOD SUPPLIER & 1-TAP REORDER CARD (Shown on Wood & Fuel tab) */}
      {activeCategory === "wood" && (
        <div className={`p-4 sm:p-5 rounded-2xl border space-y-3 ${cardSurface}`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold flex items-center gap-2">
                <span>🪵</span>
                <span>Wood Supplier & 1-Tap Reorder</span>
              </h3>
              <p className={`text-xs mt-0.5 ${mutedText}`}>
                {supplierInfo.name}
                {supplierInfo.phone ? ` • ${supplierInfo.phone}` : " • Add phone number to call or text"}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleTextWoodOrder}
                className="min-h-[44px] px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition cursor-pointer"
              >
                💬 Text Wood Order
              </button>
              {supplierInfo.phone && (
                <a
                  href={`tel:${supplierInfo.phone.replace(/\D/g, "")}`}
                  className={`min-h-[44px] px-3.5 rounded-xl border text-xs font-bold flex items-center transition ${
                    isDay
                      ? "bg-stone-100 hover:bg-stone-200 border-stone-300 text-stone-800"
                      : "bg-zinc-900 hover:bg-zinc-800 border-zinc-700 text-stone-200"
                  }`}
                >
                  📞 Call
                </a>
              )}
              <button
                type="button"
                onClick={() => setEditingSupplier(!editingSupplier)}
                className={`min-h-[44px] px-3 rounded-xl border text-xs font-bold transition cursor-pointer ${
                  isDay
                    ? "bg-white hover:bg-stone-100 border-stone-300 text-stone-700"
                    : "bg-black/40 hover:bg-zinc-900 border-zinc-700 text-stone-300"
                }`}
              >
                {editingSupplier ? "Done" : "Edit Supplier"}
              </button>
            </div>
          </div>

          {editingSupplier && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-zinc-800/40">
              <input
                type="text"
                value={supplierInfo.name}
                onChange={(e) => setSupplierInfo({ ...supplierInfo, name: e.target.value })}
                placeholder="Supplier Name"
                className={`min-h-[44px] px-3 rounded-xl border text-xs ${
                  isDay ? "bg-stone-50 border-stone-300" : "bg-black/50 border-zinc-700 text-white"
                }`}
              />
              <input
                type="tel"
                value={supplierInfo.phone}
                onChange={(e) => setSupplierInfo({ ...supplierInfo, phone: e.target.value })}
                placeholder="Phone (e.g. 773-555-0144)"
                className={`min-h-[44px] px-3 rounded-xl border text-xs ${
                  isDay ? "bg-stone-50 border-stone-300" : "bg-black/50 border-zinc-700 text-white"
                }`}
              />
              <input
                type="text"
                value={supplierInfo.defaultOrderNote}
                onChange={(e) =>
                  setSupplierInfo({ ...supplierInfo, defaultOrderNote: e.target.value })
                }
                placeholder="Usual wood order"
                className={`min-h-[44px] px-3 rounded-xl border text-xs ${
                  isDay ? "bg-stone-50 border-stone-300" : "bg-black/50 border-zinc-700 text-white"
                }`}
              />
            </div>
          )}
        </div>
      )}

      {/* NEEDS REORDER CHECKLIST (Shown on Supplies & Restock tab) */}
      {activeCategory === "supplies" && (
        <div
          className={`p-4 sm:p-5 rounded-2xl border space-y-3 ${
            lowStockAll.length > 0
              ? isDay
                ? "bg-amber-50 border-amber-300 text-stone-900"
                : "bg-amber-950/20 border-amber-500/40 text-stone-100"
              : cardSurface
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold flex items-center gap-2">
                <span>🛒</span>
                <span>Needs Reorder Checklist ({lowStockAll.length})</span>
              </h3>
              <p className={`text-xs ${mutedText}`}>
                Auto-pulls every Wood, Meat, and Supply item at or below its Low Alert count.
              </p>
            </div>
            <button
              type="button"
              onClick={handleCopyReorderList}
              className="min-h-[44px] px-3.5 rounded-xl bg-[#EA580C] hover:bg-[#F97316] text-white text-xs font-bold transition cursor-pointer"
            >
              {copiedList ? "✓ Copied Order List!" : "📋 Copy Full Order List"}
            </button>
          </div>

          {lowStockAll.length === 0 ? (
            <p className="text-xs font-semibold text-emerald-500">
              ✓ All wood, meats, and supplies are currently stocked above par.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {lowStockAll.map((item) => (
                <div
                  key={`reorder-${item.id}`}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-2 text-xs ${
                    isDay
                      ? "bg-white border-amber-200"
                      : "bg-black/40 border-amber-500/30"
                  }`}
                >
                  <div className="min-w-0">
                    <p className="font-bold truncate">{item.name}</p>
                    <p className={`text-[11px] ${mutedText}`}>
                      {item.qty} {item.unit} left (Par: {item.par}) • {item.supplier}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => adjustQty(item.id, 1)}
                    className="min-h-[38px] px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] shrink-0 cursor-pointer"
                  >
                    + Restock
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SEARCH & FILTER BAR */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={`Search ${categoryTitle.toLowerCase()} or supplier...`}
          className={`flex-1 min-h-[44px] px-3.5 rounded-xl border text-xs ${
            isDay
              ? "bg-white border-[#D8CEC1] text-stone-900"
              : "bg-[#181416] border-zinc-800 text-white"
          }`}
        />
        <button
          type="button"
          onClick={() => setLowOnly(!lowOnly)}
          className={`min-h-[44px] px-4 rounded-xl border text-xs font-bold transition cursor-pointer ${
            lowOnly
              ? "bg-[#EA580C] border-[#EA580C] text-white"
              : isDay
              ? "bg-white border-[#D8CEC1] text-stone-700 hover:bg-stone-100"
              : "bg-[#181416] border-zinc-800 text-stone-300 hover:bg-zinc-900"
          }`}
        >
          {lowOnly ? "Showing Low Stock Only" : "Filter: Low Stock Only"}
        </button>
      </div>

      {/* INVENTORY ITEMS LIST */}
      {categoryItems.length === 0 ? (
        <div className={`p-8 rounded-2xl border text-center space-y-2 ${cardSurface}`}>
          <p className="text-sm font-bold">No matching items here</p>
          <p className={`text-xs ${mutedText}`}>
            Tap &ldquo;+ Add Item&rdquo; to add something new, or clear your search filter.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {categoryItems.map((item) => {
            const isLow = item.qty <= item.par;
            const isOut = item.qty <= 0;

            return (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isOut
                    ? isDay
                      ? "bg-red-50 border-red-300"
                      : "bg-red-950/25 border-red-500/40"
                    : isLow
                    ? isDay
                      ? "bg-amber-50/70 border-amber-300"
                      : "bg-amber-950/20 border-amber-500/40"
                    : cardSurface
                }`}
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-sm font-bold">{item.name}</h4>
                    {isOut ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-red-600 text-white">
                        Out of Stock
                      </span>
                    ) : isLow ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-500 text-black">
                        Low Stock
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
                        Stocked
                      </span>
                    )}
                  </div>
                  <p className={`text-xs ${mutedText}`}>
                    Supplier: <span className="font-semibold">{item.supplier}</span> • Low Alert:{" "}
                    {item.par} {item.unit} • Est. ${item.unitCost.toFixed(2)}/{item.unit}
                  </p>
                  {item.notes && (
                    <p className={`text-[11px] italic ${mutedText}`}>{item.notes}</p>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  {/* - / Qty / + */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => adjustQty(item.id, -1)}
                      aria-label={`Decrease ${item.name}`}
                      className={`w-11 h-11 rounded-xl border font-black text-base flex items-center justify-center transition cursor-pointer ${
                        isDay
                          ? "bg-stone-100 hover:bg-stone-200 border-stone-300 text-stone-900"
                          : "bg-zinc-900 hover:bg-zinc-800 border-zinc-700 text-white"
                      }`}
                    >
                      −
                    </button>
                    <div className="min-w-[82px] text-center px-2">
                      <span className="block text-base font-black leading-tight">{item.qty}</span>
                      <span className={`block text-[10.5px] ${mutedText}`}>{item.unit}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => adjustQty(item.id, 1)}
                      aria-label={`Increase ${item.name}`}
                      className="w-11 h-11 rounded-xl bg-[#EA580C] hover:bg-[#F97316] text-white font-black text-base flex items-center justify-center transition cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  {/* Edit & Delete */}
                  <div className="flex items-center gap-1.5 pl-1">
                    <button
                      type="button"
                      onClick={() => openEditModal(item)}
                      className={`min-h-[44px] px-3 rounded-xl border text-xs font-bold transition cursor-pointer ${
                        isDay
                          ? "bg-white hover:bg-stone-100 border-stone-300 text-stone-700"
                          : "bg-black/40 hover:bg-zinc-900 border-zinc-700 text-stone-300"
                      }`}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteItem(item.id, item.name)}
                      className="min-h-[44px] px-3 rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold transition cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className={`w-full max-w-md rounded-3xl border p-5 sm:p-6 shadow-2xl space-y-4 ${
              isDay
                ? "bg-white border-stone-300 text-stone-900"
                : "bg-[#181416] border-amber-500/40 text-stone-100"
            }`}
          >
            <div className="flex items-center justify-between border-b border-zinc-800/30 pb-3">
              <h3 className="text-base font-bold">
                {editingId ? "Edit Inventory Item" : "Add Inventory Item"}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-full bg-zinc-500/20 hover:bg-zinc-500/30 flex items-center justify-center text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Category</label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as InventoryCategory)}
                  className={`w-full min-h-[44px] px-3 rounded-xl border ${
                    isDay
                      ? "bg-stone-50 border-stone-300"
                      : "bg-black/60 border-zinc-700 text-white"
                  }`}
                >
                  <option value="wood">Wood & Fuel</option>
                  <option value="menu-stock">Menu & Meat Stock</option>
                  <option value="supplies">Supplies & Disposables</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Item Name *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Seasoned Post Oak, Prime Brisket, Foil Pans"
                  className={`w-full min-h-[44px] px-3 rounded-xl border ${
                    isDay
                      ? "bg-stone-50 border-stone-300"
                      : "bg-black/60 border-zinc-700 text-white"
                  }`}
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold mb-1">On Hand</label>
                  <input
                    type="number"
                    step="0.25"
                    min="0"
                    value={formQty}
                    onChange={(e) => setFormQty(e.target.value)}
                    className={`w-full min-h-[44px] px-3 rounded-xl border ${
                      isDay
                        ? "bg-stone-50 border-stone-300"
                        : "bg-black/60 border-zinc-700 text-white"
                    }`}
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Low Alert</label>
                  <input
                    type="number"
                    step="0.25"
                    min="0"
                    value={formPar}
                    onChange={(e) => setFormPar(e.target.value)}
                    className={`w-full min-h-[44px] px-3 rounded-xl border ${
                      isDay
                        ? "bg-stone-50 border-stone-300"
                        : "bg-black/60 border-zinc-700 text-white"
                    }`}
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Unit</label>
                  <select
                    value={formUnit}
                    onChange={(e) => setFormUnit(e.target.value)}
                    className={`w-full min-h-[44px] px-2 rounded-xl border ${
                      isDay
                        ? "bg-stone-50 border-stone-300"
                        : "bg-black/60 border-zinc-700 text-white"
                    }`}
                  >
                    {UNIT_OPTIONS.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Cost per Unit ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formCost}
                    onChange={(e) => setFormCost(e.target.value)}
                    className={`w-full min-h-[44px] px-3 rounded-xl border ${
                      isDay
                        ? "bg-stone-50 border-stone-300"
                        : "bg-black/60 border-zinc-700 text-white"
                    }`}
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Supplier / Store</label>
                  <input
                    type="text"
                    value={formSupplier}
                    onChange={(e) => setFormSupplier(e.target.value)}
                    placeholder="e.g. Restaurant Depot"
                    className={`w-full min-h-[44px] px-3 rounded-xl border ${
                      isDay
                        ? "bg-stone-50 border-stone-300"
                        : "bg-black/60 border-zinc-700 text-white"
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Notes (Optional)</label>
                <input
                  type="text"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="e.g. 14-16 lb packers, stacked under tarp"
                  className={`w-full min-h-[44px] px-3 rounded-xl border ${
                    isDay
                      ? "bg-stone-50 border-stone-300"
                      : "bg-black/60 border-zinc-700 text-white"
                  }`}
                />
              </div>

              <button
                type="submit"
                className="w-full min-h-[48px] rounded-xl bg-gradient-to-r from-[#EA580C] to-[#D97706] hover:from-[#F97316] hover:to-[#EA580C] text-white font-bold text-xs uppercase tracking-wider shadow-lg transition cursor-pointer"
              >
                {editingId ? "Save Changes" : "Add to Inventory"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

