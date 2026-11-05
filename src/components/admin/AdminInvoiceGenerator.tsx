"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { AdminTheme } from "./AdminPortal";
import { PitmasterLead } from "./AdminLeadsPipeline";
import { SITE_CONFIG } from "@/config/site-config";

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface InvoiceData {
  invoiceNumber: string;
  issueDate: string;
  eventDate: string;
  servingWindow: string;
  clientName: string;
  companyName: string;
  clientEmail: string;
  clientPhone: string;
  eventVenue: string;
  serviceStyle: string;
  guestCount: number;
  lineItems: InvoiceLineItem[];
  deliveryFee: number;
  taxRate: number; // e.g. 0.0 or 0.1025
  discount: number;
  depositPercent: number; // e.g. 50
  notesAndTerms: string;
  // Payment methods
  enableStripe: boolean;
  stripePaymentLink: string;
  zelleRecipient: string;
  cashAppHandle: string;
  checkPayableTo: string;
}

interface AdminInvoiceGeneratorProps {
  theme?: AdminTheme;
  lead?: PitmasterLead | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveLeadTotal?: (leadId: string, newTotal: number) => void;
}

export function AdminInvoiceGenerator({
  theme = "night",
  lead,
  isOpen,
  onClose,
  onSaveLeadTotal,
}: AdminInvoiceGeneratorProps) {
  const isDay = theme === "day";

  // Default empty invoice template
  const [invoice, setInvoice] = useState<InvoiceData>({
    invoiceNumber: "ATS-INV-1001",
    issueDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    eventDate: "Pending Confirmation",
    servingWindow: "12:30 PM - 2:30 PM",
    clientName: "",
    companyName: "",
    clientEmail: "",
    clientPhone: "",
    eventVenue: "Chicago Area (Pending Venue)",
    serviceStyle: "On-Site Smoker Trailer Rig",
    guestCount: 35,
    lineItems: [
      {
        id: "item-1",
        description: "The Pitmaster Feast ($30/pp) — Hardwood Smoked Brisket & St. Louis Ribs",
        quantity: 35,
        unitPrice: 30,
        total: 1050,
      },
      {
        id: "item-2",
        description: "Scratch Smokehouse Sides: 5-Cheese Mac, Baked Beans & Cornbread Squares",
        quantity: 1,
        unitPrice: 0,
        total: 0,
      },
      {
        id: "item-3",
        description: "Insulated Chafing Warmers, Disposable Serviceware & Stainless Tongs Kit",
        quantity: 1,
        unitPrice: 75,
        total: 75,
      },
    ],
    deliveryFee: 65,
    taxRate: 0,
    discount: 0,
    depositPercent: 50,
    notesAndTerms: `1. 50% lock-in deposit required to reserve Marion's smoker trailer and calendar date.
2. Remaining 50% balance due upon trailer rig arrival and meat presentation on event day.
3. Live-fire cooks require level ground parking for the 18ft offset rig with 10ft clearance.
4. Food is held in heated insulated cambros at 160°F+ adhering to strict Illinois sanitary code.`,
    enableStripe: false,
    stripePaymentLink: "https://buy.stripe.com/live_example_link",
    zelleRecipient: `${SITE_CONFIG.primaryAdminEmail} or ${SITE_CONFIG.phoneFormatted}`,
    cashAppHandle: "$AllTheSmokeBBQ",
    checkPayableTo: "All The Smoke Catering (Marion Bolden)",
  });

  const [copiedToast, setCopiedToast] = useState<string | null>(null);

  // Populate from lead prop whenever a lead is selected
  useEffect(() => {
    if (lead) {
      const gCount = Number(lead.guestCount) || 35;
      const pkgPrice = lead.packageName?.includes("45") ? 45 : 30;
      const basePkgTotal = gCount * pkgPrice;

      // Clean ticket number for invoice ID
      const invNum = lead.ticketId ? lead.ticketId.replace("ATS-QUOTE", "ATS-INV") : `ATS-INV-${Math.floor(1000 + Math.random() * 9000)}`;

      // Load saved Stripe link from localStorage if Marion configured it
      const savedStripeLink = typeof window !== "undefined" ? localStorage.getItem("ats_stripe_payment_link") || "" : "";
      const savedStripeEnabled = typeof window !== "undefined" ? localStorage.getItem("ats_stripe_enabled") === "true" : false;

      setInvoice((prev) => ({
        ...prev,
        invoiceNumber: invNum,
        clientName: lead.name || "",
        companyName: lead.eventType === "corporate" ? lead.name + " Event" : "",
        clientEmail: lead.email || "",
        clientPhone: lead.phone || "",
        eventDate: lead.eventDate || "Date Pending",
        eventVenue: lead.deliveryAddress || "Chicago Area",
        serviceStyle: lead.serviceStyle || "On-Site Smoker Trailer Rig",
        guestCount: gCount,
        lineItems: [
          {
            id: "item-1",
            description: `${lead.packageName || "The Pitmaster Feast"} (${gCount} guests)`,
            quantity: gCount,
            unitPrice: pkgPrice,
            total: basePkgTotal,
          },
          {
            id: "item-2",
            description: "Scratch Sides: Southern Baked Beans, 5-Cheese Mac, Peach Cobbler & Honey Butter Cornbread",
            quantity: 1,
            unitPrice: 0,
            total: 0,
          },
          {
            id: "item-3",
            description: "Full Buffet Chafer Setup (Deep Disposable Steam Pans, Sternos, Heavy Utensils)",
            quantity: 1,
            unitPrice: 75,
            total: 75,
          },
        ],
        deliveryFee: 65,
        enableStripe: savedStripeEnabled,
        stripePaymentLink: savedStripeLink || prev.stripePaymentLink,
      }));
    }
  }, [lead]);

  // Calculations
  const subtotal = invoice.lineItems.reduce((sum, item) => sum + (Number(item.total) || 0), 0);
  const taxAmount = Math.round(subtotal * (invoice.taxRate || 0) * 100) / 100;
  const totalAmount = Math.max(0, subtotal + taxAmount + (Number(invoice.deliveryFee) || 0) - (Number(invoice.discount) || 0));
  const depositDue = Math.round(totalAmount * ((invoice.depositPercent || 50) / 100));
  const balanceDue = totalAmount - depositDue;

  const showToast = (msg: string) => {
    setCopiedToast(msg);
    setTimeout(() => setCopiedToast(null), 3000);
  };

  // Line Item Handlers
  const handleUpdateItem = (id: string, field: keyof InvoiceLineItem, value: any) => {
    setInvoice((prev) => {
      const updatedItems = prev.lineItems.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          if (field === "quantity" || field === "unitPrice") {
            updated.total = Number(updated.quantity || 0) * Number(updated.unitPrice || 0);
          }
          return updated;
        }
        return item;
      });
      return { ...prev, lineItems: updatedItems };
    });
  };

  const handleAddItem = () => {
    const newItem: InvoiceLineItem = {
      id: `item-${Date.now()}`,
      description: "Additional Smoker Cut / Side Pan",
      quantity: 1,
      unitPrice: 50,
      total: 50,
    };
    setInvoice((prev) => ({
      ...prev,
      lineItems: [...prev.lineItems, newItem],
    }));
  };

  const handleRemoveItem = (id: string) => {
    if (invoice.lineItems.length <= 1) return;
    setInvoice((prev) => ({
      ...prev,
      lineItems: prev.lineItems.filter((item) => item.id !== id),
    }));
  };

  // Stripe Settings Handlers (Persistent in browser)
  const handleToggleStripe = (enabled: boolean) => {
    setInvoice((prev) => ({ ...prev, enableStripe: enabled }));
    if (typeof window !== "undefined") {
      localStorage.setItem("ats_stripe_enabled", String(enabled));
    }
    showToast(enabled ? "💳 Stripe checkout enabled on invoice!" : "Stripe disabled (using Zelle/CashApp)");
  };

  const handleStripeLinkChange = (url: string) => {
    setInvoice((prev) => ({ ...prev, stripePaymentLink: url }));
    if (typeof window !== "undefined") {
      localStorage.setItem("ats_stripe_payment_link", url);
    }
  };

  // Print Action
  const handlePrint = () => {
    window.print();
  };

  // Copy SMS / Text Friendly Summary
  const handleCopySMS = () => {
    const text = `🔥 All The Smoke BBQ & Catering — Event Agreement
Client: ${invoice.clientName}
Event Date: ${invoice.eventDate}
Guest Count: ${invoice.guestCount} Guests
Service: ${invoice.serviceStyle}

Total Event Balance: $${totalAmount.toLocaleString()}
⭐ 50% Lock-In Deposit: $${depositDue.toLocaleString()} (Due Now)
Remaining Balance: $${balanceDue.toLocaleString()} (Due Day-Of)

Payment Options:
• Zelle: ${invoice.zelleRecipient}
• CashApp: ${invoice.cashAppHandle}
${invoice.enableStripe && invoice.stripePaymentLink ? `• Card/Stripe: ${invoice.stripePaymentLink}\n` : ""}
Questions? Call Marion Bolden: (773) 707-9988
Website: https://allthesmokecatering.com`;

    navigator.clipboard.writeText(text);
    showToast("📋 Copied SMS invoice summary to clipboard!");
  };

  // Save updated total back to the lead in pipeline
  const handleSaveToLead = () => {
    if (lead && onSaveLeadTotal) {
      onSaveLeadTotal(lead.id, totalAmount);
      showToast(`✓ Updated lead balance to $${totalAmount.toLocaleString()}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
      {/* Top Floating Action Bar (Hidden on print) */}
      <div className="fixed top-3 left-4 right-4 z-50 max-w-5xl mx-auto flex items-center justify-between gap-3 bg-[#18181A]/95 border border-zinc-700/80 p-3 rounded-2xl shadow-2xl print:hidden">
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-xl bg-[#FF7A00]/20 text-[#FF7A00] text-lg font-bold">📄</span>
          <div>
            <h2 className="text-white text-sm sm:text-base font-bold font-display tracking-wide">
              SMOKEHOUSE INVOICE & CATERING CONTRACT
            </h2>
            <p className="text-xs text-zinc-400 hidden sm:block">
              Itemized quote, 50% lock-in deposit, and payment terms for Marion's clients.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {lead && (
            <button
              type="button"
              onClick={handleSaveToLead}
              className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold transition flex items-center gap-1.5"
              title="Save total back to lead in pipeline"
            >
              <span>💾</span>
              <span className="hidden md:inline">Save Total</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleCopySMS}
            className="px-3 py-1.5 rounded-xl bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition flex items-center gap-1.5"
            title="Copy text message summary to clipboard"
          >
            <span>📱</span>
            <span className="hidden sm:inline">Copy SMS</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#E65100] text-white text-xs font-bold transition shadow-md flex items-center gap-1.5 active:scale-95"
            title="Print or Save as PDF"
          >
            <span>🖨️</span>
            <span>Print / PDF</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center font-bold text-sm transition"
            title="Close Invoice Generator"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {copiedToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs sm:text-sm shadow-xl flex items-center gap-2 animate-bounce print:hidden">
          <span>✓</span>
          <span>{copiedToast}</span>
        </div>
      )}

      {/* MAIN INVOICE SHEET (Formatted for Screen & Standard Letter Print) */}
      <div className="mt-16 mb-8 w-full max-w-4xl bg-white text-neutral-900 rounded-2xl shadow-2xl p-6 sm:p-10 md:p-12 print:m-0 print:p-8 print:shadow-none print:w-full print:max-w-none text-xs sm:text-sm font-sans relative">
        
        {/* 1. SMOKEHOUSE HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pb-6 border-b-2 border-neutral-900">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0">
              <Image
                src="/brand/allthesmoke-logo.png"
                alt="All The Smoke Catering Logo"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#FF7A00]">
                Chicagoland Premier Live-Fire Smokehouse
              </span>
              <h1 className="text-xl sm:text-2xl font-black font-display tracking-tight text-neutral-900">
                ALL THE SMOKE BBQ & CATERING
              </h1>
              <p className="text-xs text-neutral-600 font-medium">
                Marion Bolden • Executive Pitmaster & Owner
              </p>
              <p className="text-xs text-neutral-500 mt-0.5">
                (773) 707-9988 • info@allthesmokecatering.com • allthesmokecatering.com
              </p>
            </div>
          </div>

          {/* Invoice # & Dates */}
          <div className="text-left sm:text-right w-full sm:w-auto">
            <span className="inline-block px-2.5 py-1 rounded bg-[#FF7A00]/15 text-[#E65100] font-black text-xs uppercase tracking-wider mb-1.5">
              Official Agreement & Invoice
            </span>
            <div className="space-y-0.5 text-xs">
              <p className="font-mono font-bold text-base text-neutral-900">
                Invoice #:{" "}
                <input
                  type="text"
                  value={invoice.invoiceNumber}
                  onChange={(e) => setInvoice({ ...invoice, invoiceNumber: e.target.value })}
                  className="font-mono font-bold border-b border-dashed border-neutral-400 focus:outline-none focus:border-[#FF7A00] w-32 px-1 text-right print:border-none"
                />
              </p>
              <p className="text-neutral-600">
                Issued:{" "}
                <input
                  type="text"
                  value={invoice.issueDate}
                  onChange={(e) => setInvoice({ ...invoice, issueDate: e.target.value })}
                  className="border-b border-dashed border-neutral-400 focus:outline-none focus:border-[#FF7A00] w-28 px-1 text-right print:border-none"
                />
              </p>
              <p className="text-neutral-600">
                Event Date:{" "}
                <input
                  type="text"
                  value={invoice.eventDate}
                  onChange={(e) => setInvoice({ ...invoice, eventDate: e.target.value })}
                  className="font-bold text-neutral-900 border-b border-dashed border-neutral-400 focus:outline-none focus:border-[#FF7A00] w-36 px-1 text-right print:border-none"
                />
              </p>
            </div>
          </div>
        </div>

        {/* 2. CLIENT & EVENT DETAILS (2-Column Grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-6 py-4 bg-stone-50 rounded-xl p-4 border border-stone-200 print:bg-transparent print:border-stone-300">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
              Catering Client & Contact:
            </h3>
            <div className="space-y-1">
              <input
                type="text"
                placeholder="Client Full Name"
                value={invoice.clientName}
                onChange={(e) => setInvoice({ ...invoice, clientName: e.target.value })}
                className="font-bold text-base text-neutral-900 w-full border-b border-stone-300 bg-transparent focus:outline-none focus:border-[#FF7A00] print:border-none"
              />
              <input
                type="text"
                placeholder="Company / Organization (Optional)"
                value={invoice.companyName}
                onChange={(e) => setInvoice({ ...invoice, companyName: e.target.value })}
                className="text-xs text-neutral-600 w-full border-b border-stone-300 bg-transparent focus:outline-none focus:border-[#FF7A00] print:border-none"
              />
              <div className="flex gap-2 text-xs text-neutral-600 pt-1">
                <input
                  type="text"
                  placeholder="Phone Number"
                  value={invoice.clientPhone}
                  onChange={(e) => setInvoice({ ...invoice, clientPhone: e.target.value })}
                  className="border-b border-stone-300 bg-transparent focus:outline-none focus:border-[#FF7A00] flex-1 print:border-none"
                />
                <input
                  type="text"
                  placeholder="Email Address"
                  value={invoice.clientEmail}
                  onChange={(e) => setInvoice({ ...invoice, clientEmail: e.target.value })}
                  className="border-b border-stone-300 bg-transparent focus:outline-none focus:border-[#FF7A00] flex-1 print:border-none"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
              Event Logistics & Setup:
            </h3>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-neutral-500 font-medium">Service Style:</span>
                <input
                  type="text"
                  value={invoice.serviceStyle}
                  onChange={(e) => setInvoice({ ...invoice, serviceStyle: e.target.value })}
                  className="font-bold text-neutral-900 border-b border-stone-300 bg-transparent focus:outline-none focus:border-[#FF7A00] flex-1 print:border-none"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-neutral-500 font-medium">Guest Count:</span>
                <input
                  type="number"
                  value={invoice.guestCount}
                  onChange={(e) => setInvoice({ ...invoice, guestCount: Number(e.target.value) })}
                  className="font-bold text-neutral-900 border-b border-stone-300 bg-transparent focus:outline-none focus:border-[#FF7A00] w-20 print:border-none"
                />
                <span className="text-neutral-500 font-medium ml-2">Window:</span>
                <input
                  type="text"
                  value={invoice.servingWindow}
                  onChange={(e) => setInvoice({ ...invoice, servingWindow: e.target.value })}
                  className="text-xs font-semibold text-neutral-900 border-b border-stone-300 bg-transparent focus:outline-none focus:border-[#FF7A00] flex-1 print:border-none"
                />
              </div>
              <div className="flex items-start gap-2 pt-1">
                <span className="text-neutral-500 font-medium shrink-0">Location:</span>
                <input
                  type="text"
                  placeholder="Venue Address / Delivery Location"
                  value={invoice.eventVenue}
                  onChange={(e) => setInvoice({ ...invoice, eventVenue: e.target.value })}
                  className="text-xs text-neutral-800 border-b border-stone-300 bg-transparent focus:outline-none focus:border-[#FF7A00] w-full print:border-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 3. ITEMIZED MENU & SERVICES TABLE */}
        <div className="my-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-neutral-900 text-[11px] font-black uppercase tracking-wider text-neutral-600">
                <th className="py-2.5 w-7/12">Menu Selection & Service Description</th>
                <th className="py-2.5 text-center w-1/12">Qty</th>
                <th className="py-2.5 text-right w-2/12">Unit Price</th>
                <th className="py-2.5 text-right w-2/12">Total</th>
                <th className="py-2.5 w-8 print:hidden"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {invoice.lineItems.map((item) => (
                <tr key={item.id} className="group">
                  <td className="py-2.5 pr-3">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => handleUpdateItem(item.id, "description", e.target.value)}
                      className="w-full font-medium text-neutral-900 bg-transparent border-b border-transparent hover:border-stone-300 focus:border-[#FF7A00] focus:outline-none print:border-none"
                    />
                  </td>
                  <td className="py-2.5 px-2 text-center">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleUpdateItem(item.id, "quantity", Number(e.target.value))}
                      className="w-12 text-center font-bold text-neutral-900 bg-transparent border-b border-transparent hover:border-stone-300 focus:border-[#FF7A00] focus:outline-none print:border-none"
                    />
                  </td>
                  <td className="py-2.5 px-2 text-right">
                    <input
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) => handleUpdateItem(item.id, "unitPrice", Number(e.target.value))}
                      className="w-20 text-right font-mono text-neutral-700 bg-transparent border-b border-transparent hover:border-stone-300 focus:border-[#FF7A00] focus:outline-none print:border-none"
                    />
                  </td>
                  <td className="py-2.5 pl-2 text-right font-mono font-bold text-neutral-900">
                    ${Number(item.total || 0).toLocaleString()}
                  </td>
                  <td className="py-2.5 text-right print:hidden">
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-stone-400 hover:text-red-500 font-bold px-1 transition opacity-0 group-hover:opacity-100"
                      title="Remove line item"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Add Line Item Button (Hidden on print) */}
          <div className="mt-3 print:hidden">
            <button
              type="button"
              onClick={handleAddItem}
              className="text-xs font-bold text-[#E65100] hover:text-[#C2410C] flex items-center gap-1.5 transition"
            >
              <span>+ Add Custom Meat / Side / Equipment Line</span>
            </button>
          </div>
        </div>

        {/* 4. TOTALS & 50% DEPOSIT MATH */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t-2 border-neutral-900 my-6">
          {/* Left: Smokehouse Terms & Conditions */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Contract Terms & Food Safety Policy:
            </h4>
            <textarea
              rows={4}
              value={invoice.notesAndTerms}
              onChange={(e) => setInvoice({ ...invoice, notesAndTerms: e.target.value })}
              className="w-full text-[11px] leading-relaxed text-neutral-600 bg-stone-50 border border-stone-200 rounded-lg p-2.5 focus:outline-none focus:border-[#FF7A00] print:bg-transparent print:border-none print:p-0"
            />
          </div>

          {/* Right: Subtotal, Fees, 50% Deposit Due */}
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 text-neutral-600">
              <span>Food & Equipment Subtotal:</span>
              <span className="font-mono font-bold text-neutral-900">${subtotal.toLocaleString()}</span>
            </div>

            <div className="flex items-center justify-between py-1 text-neutral-600">
              <span>Heated Delivery / Smoker Rig Travel:</span>
              <div className="flex items-center gap-1">
                <span>$</span>
                <input
                  type="number"
                  value={invoice.deliveryFee}
                  onChange={(e) => setInvoice({ ...invoice, deliveryFee: Number(e.target.value) })}
                  className="w-16 font-mono text-right border-b border-stone-300 focus:outline-none focus:border-[#FF7A00] print:border-none"
                />
              </div>
            </div>

            {taxAmount > 0 && (
              <div className="flex justify-between py-1 text-neutral-600">
                <span>Estimated Sales Tax ({(invoice.taxRate * 100).toFixed(2)}%):</span>
                <span className="font-mono">${taxAmount.toFixed(2)}</span>
              </div>
            )}

            {/* Total Balance */}
            <div className="flex justify-between py-2 border-t border-b border-neutral-900 text-sm font-black text-neutral-900">
              <span>TOTAL CONTRACT BALANCE:</span>
              <span className="font-mono text-base text-[#FF7A00]">${totalAmount.toLocaleString()}</span>
            </div>

            {/* 50% Lock-In Deposit Section (Highlighted) */}
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-300 space-y-1 print:bg-stone-50 print:border-stone-400">
              <div className="flex justify-between items-center">
                <span className="font-bold text-[#9A3412] text-xs uppercase tracking-wider">
                  ⭐ 50% Lock-In Deposit Due Now:
                </span>
                <span className="font-mono font-black text-base text-[#9A3412]">
                  ${depositDue.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-[11px] text-neutral-600 pt-1 border-t border-amber-200">
                <span>Remaining 50% Day-Of Balance:</span>
                <span className="font-mono font-bold text-neutral-800">${balanceDue.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 5. PAYMENT OPTIONS & STRIPE INTEGRATION */}
        <div className="my-6 p-4 rounded-xl bg-stone-50 border border-stone-300 print:bg-transparent print:border-stone-400">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-neutral-800">
              Payment Instructions to Secure Date:
            </h4>
            
            {/* Stripe Toggle Switch (Hidden on print) */}
            <div className="flex items-center gap-2 print:hidden">
              <span className="text-[11px] font-bold text-neutral-600">Credit Card (Stripe):</span>
              <button
                type="button"
                onClick={() => handleToggleStripe(!invoice.enableStripe)}
                className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                  invoice.enableStripe ? "bg-emerald-600" : "bg-neutral-300"
                }`}
                title="Toggle Stripe card payments on invoice"
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-0.5 ${
                    invoice.enableStripe ? "left-5.5" : "left-0.5"
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            {/* Option A: Zelle */}
            <div className="p-2.5 rounded-lg bg-white border border-stone-200">
              <p className="font-bold text-[#FF7A00]">📱 Zelle (Preferred):</p>
              <p className="font-mono font-semibold text-neutral-900 mt-0.5">{invoice.zelleRecipient}</p>
              <p className="text-[10px] text-neutral-500">Recipient: Marion Bolden</p>
            </div>

            {/* Option B: CashApp */}
            <div className="p-2.5 rounded-lg bg-white border border-stone-200">
              <p className="font-bold text-emerald-600">💵 CashApp:</p>
              <p className="font-mono font-semibold text-neutral-900 mt-0.5">{invoice.cashAppHandle}</p>
              <p className="text-[10px] text-neutral-500">Memo: {invoice.invoiceNumber}</p>
            </div>

            {/* Option C: Stripe / Card Checkout (Forward-Compatible) */}
            <div className="p-2.5 rounded-lg bg-white border border-stone-200">
              <p className="font-bold text-purple-600 flex items-center gap-1">
                <span>💳 Credit / Debit Card:</span>
              </p>
              {invoice.enableStripe ? (
                <div>
                  <a
                    href={invoice.stripePaymentLink}
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold text-[#FF7A00] underline block truncate mt-0.5"
                  >
                    Click to Pay via Stripe ➔
                  </a>
                  <p className="text-[10px] text-neutral-500">Apple Pay / Visa / MC accepted</p>
                </div>
              ) : (
                <div>
                  <p className="text-neutral-700 text-[11px] mt-0.5">Corporate Check / ACH</p>
                  <p className="text-[10px] text-neutral-500">{invoice.checkPayableTo}</p>
                </div>
              )}
            </div>
          </div>

          {/* If Stripe is Enabled, show input for Marion to paste payment link (Hidden on print) */}
          {invoice.enableStripe && (
            <div className="mt-3 pt-3 border-t border-stone-200 flex items-center gap-2 print:hidden">
              <span className="text-[11px] font-bold text-neutral-600 shrink-0">Stripe Payment Link URL:</span>
              <input
                type="text"
                placeholder="https://buy.stripe.com/..."
                value={invoice.stripePaymentLink}
                onChange={(e) => handleStripeLinkChange(e.target.value)}
                className="text-xs font-mono bg-white border border-stone-300 rounded-lg px-2.5 py-1 w-full focus:outline-none focus:border-purple-600"
              />
            </div>
          )}
        </div>

        {/* 6. CLIENT ACCEPTANCE SIGNATURE SECTION */}
        <div className="pt-8 border-t border-neutral-900 grid grid-cols-1 sm:grid-cols-2 gap-8 my-6">
          <div>
            <div className="border-b border-neutral-800 pb-1 mb-1">
              <p className="text-xs text-neutral-400">Client Authorized Signature:</p>
            </div>
            <p className="text-[11px] font-bold text-neutral-800">
              Client: {invoice.clientName || "_________________________"}
            </p>
            <p className="text-[10px] text-neutral-500">I accept the menu selections, guest count, and 50% deposit policy.</p>
          </div>

          <div>
            <div className="border-b border-neutral-800 pb-1 mb-1 flex justify-between items-baseline">
              <span className="font-display font-black text-sm tracking-wider text-[#FF7A00]">
                Marion Bolden
              </span>
              <span className="text-xs text-neutral-500">Date: {invoice.issueDate}</span>
            </div>
            <p className="text-[11px] font-bold text-neutral-800">Executive Pitmaster • All The Smoke Catering</p>
            <p className="text-[10px] text-neutral-500">Thank you for your business. We look forward to smoking for you!</p>
          </div>
        </div>
      </div>
    </div>
  );
}

