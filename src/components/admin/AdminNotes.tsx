"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

export interface NoteAttachment {
  id: string;
  name: string;
  type: string;
  dataUrl: string;
  sizeKb: number;
}

export type NoteCategory =
  | "smoker-rig"
  | "meats-menu"
  | "event-prep"
  | "customer-request"
  | "general";

export type NotePriority = "normal" | "high" | "urgent";

export interface PitmasterNote {
  id: string;
  title: string;
  category: NoteCategory;
  priority: NotePriority;
  author: string;
  whatAndWhy: string;
  attachments: NoteAttachment[];
  isCompleted: boolean;
  createdAt: string;
  emailNotified?: boolean;
}

const CATEGORY_META: Record<
  NoteCategory,
  { label: string; badgeClassDark: string; badgeClassButcher: string }
> = {
  "smoker-rig": {
    label: "Smoker Rig & Access",
    badgeClassDark: "bg-amber-950/70 text-[#FF8C38] border-amber-800/80",
    badgeClassButcher: "bg-[#FAF0E6] text-[#9A3412] border-[#E2CEB9] font-bold",
  },
  "meats-menu": {
    label: "Meats & Custom Menu",
    badgeClassDark: "bg-red-950/70 text-red-300 border-red-800/80",
    badgeClassButcher: "bg-[#FEF2F2] text-[#991B1B] border-[#FCA5A5] font-bold",
  },
  "event-prep": {
    label: "Event Day Logistics",
    badgeClassDark: "bg-orange-950/70 text-[#FF7A00] border-orange-800/80",
    badgeClassButcher: "bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA] font-bold",
  },
  "customer-request": {
    label: "Customer Request",
    badgeClassDark: "bg-blue-950/70 text-blue-300 border-blue-800/80",
    badgeClassButcher: "bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE] font-bold",
  },
  general: {
    label: "General Smokehouse",
    badgeClassDark: "bg-zinc-800 text-zinc-300 border-zinc-700",
    badgeClassButcher: "bg-[#F5F0E8] text-[#44403C] border-[#D8CEC1] font-bold",
  },
};

const PRIORITY_META: Record<
  NotePriority,
  { label: string; dotClass: string; badgeClassDark: string; badgeClassButcher: string }
> = {
  normal: {
    label: "Normal",
    dotClass: "bg-emerald-500",
    badgeClassDark: "bg-emerald-950/50 text-emerald-300 border-emerald-800/70",
    badgeClassButcher: "bg-emerald-50 text-emerald-800 border-emerald-300 font-bold",
  },
  high: {
    label: "High Priority",
    dotClass: "bg-amber-500",
    badgeClassDark: "bg-amber-950/50 text-amber-300 border-amber-800/70",
    badgeClassButcher: "bg-amber-50 text-amber-900 border-amber-300 font-bold",
  },
  urgent: {
    label: "Urgent / Event Day",
    dotClass: "bg-red-600 animate-pulse",
    badgeClassDark: "bg-red-950/70 text-red-200 border-red-600 font-bold",
    badgeClassButcher: "bg-red-100 text-red-950 border-red-300 font-black",
  },
};

const SEED_NOTES: PitmasterNote[] = [
  {
    id: "note-1",
    title: "Lincoln Park Driveway & Rig Clearance Check",
    category: "smoker-rig",
    priority: "high",
    author: "Marion Bolden",
    whatAndWhy:
      "Customer sent photos of the venue alleyway entrance on Fullerton. The trailer rig must back in at a 45-degree angle to avoid the low tree branch. Bring 2 wheel chocks and 50ft heavy-duty extension cord for the rotisserie warmers.",
    attachments: [],
    isCompleted: false,
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    emailNotified: true,
  },
  {
    id: "note-2",
    title: "Saturday Cook: Extra Whole Turkey Chops for 65-Guest Wedding",
    category: "meats-menu",
    priority: "urgent",
    author: "Marion Bolden",
    whatAndWhy:
      "Bride requested adding 35 whole hardwood smoked turkey chops alongside the prime brisket spread. Prep brine on Thursday night; put on pecan smoke at 6:00 AM Saturday.",
    attachments: [],
    isCompleted: false,
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    emailNotified: true,
  },
];

// Helper to compress images client-side before storing
function compressImage(file: File, maxDim = 1200, quality = 0.75): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(compressedDataUrl);
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

interface AdminNotesProps {
  theme?: "dark" | "butcher-paper";
}

export function AdminNotes({ theme = "dark" }: AdminNotesProps) {
  const isButcher = theme === "butcher-paper";

  const [notes, setNotes] = useState<PitmasterNote[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // New Note Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<NoteCategory>("general");
  const [priority, setPriority] = useState<NotePriority>("normal");
  const [whatAndWhy, setWhatAndWhy] = useState("");
  const [attachments, setAttachments] = useState<NoteAttachment[]>([]);
  const [sendBrevoEmail, setSendBrevoEmail] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitFeedback, setSubmitFeedback] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "completed">("active");

  // Full Image Modal Preview
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load notes from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("ats_admin_notes");
        if (saved) {
          setNotes(JSON.parse(saved));
        } else {
          setNotes(SEED_NOTES);
          localStorage.setItem("ats_admin_notes", JSON.stringify(SEED_NOTES));
        }
      } catch (err) {
        console.error("Failed to load notes from localStorage:", err);
        setNotes(SEED_NOTES);
      }
      setIsLoaded(true);
    }
  }, []);

  // Save notes to localStorage
  const saveNotes = (updated: PitmasterNote[]) => {
    setNotes(updated);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("ats_admin_notes", JSON.stringify(updated));
      } catch (err) {
        console.error("Storage save error:", err);
      }
    }
  };

  // Handle File Uploads
  const handleFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newAttachments: NoteAttachment[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const compressedDataUrl = await compressImage(file);
        const approxSizeKb = Math.round((compressedDataUrl.length * 3) / 4 / 1024);

        newAttachments.push({
          id: `att-${Date.now()}-${i}`,
          name: file.name,
          type: file.type || "image/jpeg",
          dataUrl: compressedDataUrl,
          sizeKb: approxSizeKb,
        });
      } catch (err) {
        console.error("File compression failed for:", file.name, err);
      }
    }

    setAttachments((prev) => [...prev, ...newAttachments]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveAttachment = (attId: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== attId));
  };

  // Submit Note
  const handleSubmitNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !whatAndWhy.trim()) {
      alert("Please provide both a Note Title and the explanation body.");
      return;
    }

    setIsSubmitting(true);
    setSubmitFeedback(null);

    const newNote: PitmasterNote = {
      id: `note-${Date.now()}`,
      title: title.trim(),
      category,
      priority,
      author: "Marion Bolden",
      whatAndWhy: whatAndWhy.trim(),
      attachments,
      isCompleted: false,
      createdAt: new Date().toISOString(),
      emailNotified: sendBrevoEmail,
    };

    // If Brevo notification is checked, dispatch to backend API
    if (sendBrevoEmail) {
      try {
        await fetch("/api/admin/notes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: newNote.title,
            category: newNote.category,
            categoryLabel: CATEGORY_META[newNote.category].label,
            priority: newNote.priority,
            whatAndWhy: newNote.whatAndWhy,
            attachmentCount: attachments.length,
            recipientEmail: "boldenmarion83@gmail.com",
            createdAt: newNote.createdAt,
          }),
        });
      } catch (err) {
        console.warn("Brevo email dispatch non-blocking notice:", err);
      }
    }

    const updated = [newNote, ...notes];
    saveNotes(updated);

    // Reset Form
    setTitle("");
    setWhatAndWhy("");
    setCategory("general");
    setPriority("normal");
    setAttachments([]);
    setIsSubmitting(false);
    setShowAddForm(false);
    setSubmitFeedback("Note saved successfully and forwarded to Marion!");
    setTimeout(() => setSubmitFeedback(null), 4000);
  };

  // Toggle Completion
  const toggleComplete = (noteId: string) => {
    const updated = notes.map((n) =>
      n.id === noteId ? { ...n, isCompleted: !n.isCompleted } : n
    );
    saveNotes(updated);
  };

  // Delete Note
  const handleDeleteNote = (noteId: string) => {
    if (confirm("Are you sure you want to delete this note and its attachments?")) {
      const updated = notes.filter((n) => n.id !== noteId);
      saveNotes(updated);
    }
  };

  // Filter notes
  const filteredNotes = notes.filter((n) => {
    // Status
    if (statusFilter === "active" && n.isCompleted) return false;
    if (statusFilter === "completed" && !n.isCompleted) return false;

    // Category
    if (selectedCategory !== "all" && n.category !== selectedCategory) return false;

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const inTitle = n.title.toLowerCase().includes(q);
      const inBody = n.whatAndWhy.toLowerCase().includes(q);
      const inCat = CATEGORY_META[n.category].label.toLowerCase().includes(q);
      if (!inTitle && !inBody && !inCat) return false;
    }

    return true;
  });

  const totalActive = notes.filter((n) => !n.isCompleted).length;
  const totalPhotos = notes.reduce((acc, n) => acc + (n.attachments?.length || 0), 0);
  const totalUrgent = notes.filter((n) => !n.isCompleted && n.priority === "urgent").length;

  if (!isLoaded) {
    return (
      <div
        className={`py-20 text-center text-sm font-semibold ${
          isButcher ? "text-stone-600" : "text-zinc-400"
        }`}
      >
        Loading Smokehouse Notes...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. TOP STATS BAR */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Notes */}
        <div
          className={`p-4 sm:p-5 rounded-2xl border transition-colors ${
            isButcher
              ? "bg-[#FFFFFF] border-[#E2DACF] shadow-sm text-stone-900"
              : "bg-[#141417] border-zinc-800 text-white"
          }`}
        >
          <div
            className={`text-[11px] uppercase font-extrabold tracking-wider ${
              isButcher ? "text-stone-600" : "text-zinc-400"
            }`}
          >
            Total Notes
          </div>
          <div
            className={`text-2xl sm:text-3xl font-black font-display mt-1 ${
              isButcher ? "text-[#1C1917]" : "text-white"
            }`}
          >
            {notes.length}
          </div>
        </div>

        {/* Active Items */}
        <div
          className={`p-4 sm:p-5 rounded-2xl border transition-colors ${
            isButcher
              ? "bg-[#FFFFFF] border-[#E2DACF] shadow-sm"
              : "bg-[#141417] border-zinc-800"
          }`}
        >
          <div
            className={`text-[11px] uppercase font-extrabold tracking-wider ${
              isButcher ? "text-stone-600" : "text-zinc-400"
            }`}
          >
            Active Items
          </div>
          <div className="text-2xl sm:text-3xl font-black font-display text-[#EA580C] mt-1">
            {totalActive}
          </div>
        </div>

        {/* Photos & Docs */}
        <div
          className={`p-4 sm:p-5 rounded-2xl border transition-colors ${
            isButcher
              ? "bg-[#FFFFFF] border-[#E2DACF] shadow-sm"
              : "bg-[#141417] border-zinc-800"
          }`}
        >
          <div
            className={`text-[11px] uppercase font-extrabold tracking-wider ${
              isButcher ? "text-stone-600" : "text-zinc-400"
            }`}
          >
            Photos &amp; Docs
          </div>
          <div
            className={`text-2xl sm:text-3xl font-black font-display mt-1 ${
              isButcher ? "text-[#8C6D3B]" : "text-[#C8A97E]"
            }`}
          >
            {totalPhotos}
          </div>
        </div>

        {/* Urgent Tasks */}
        <div
          className={`p-4 sm:p-5 rounded-2xl border transition-colors ${
            isButcher
              ? "bg-[#FFFFFF] border-[#E2DACF] shadow-sm"
              : "bg-[#141417] border-zinc-800"
          }`}
        >
          <div
            className={`text-[11px] uppercase font-extrabold tracking-wider ${
              isButcher ? "text-stone-600" : "text-zinc-400"
            }`}
          >
            Urgent Tasks
          </div>
          <div
            className={`text-2xl sm:text-3xl font-black font-display mt-1 ${
              totalUrgent > 0
                ? isButcher
                  ? "text-red-700 font-black"
                  : "text-red-400"
                : isButcher
                ? "text-stone-400"
                : "text-zinc-500"
            }`}
          >
            {totalUrgent}
          </div>
        </div>
      </div>

      {/* FEEDBACK BANNER */}
      {submitFeedback && (
        <div
          className={`p-4 rounded-xl text-sm font-semibold flex items-center justify-between border ${
            isButcher
              ? "bg-emerald-50 border-emerald-300 text-emerald-900"
              : "bg-emerald-950/80 border-emerald-700 text-emerald-200"
          }`}
        >
          <span>✓ {submitFeedback}</span>
          <button
            type="button"
            onClick={() => setSubmitFeedback(null)}
            className={isButcher ? "text-emerald-700 hover:text-black" : "text-emerald-400 hover:text-white"}
          >
            ✕
          </button>
        </div>
      )}

      {/* 2. ACTIONS & FILTERS HEADER */}
      <div
        className={`p-4 sm:p-5 rounded-2xl border space-y-4 transition-colors ${
          isButcher
            ? "bg-[#FFFFFF] border-[#E2DACF] shadow-sm text-stone-900"
            : "bg-[#141417] border-zinc-800 text-white"
        }`}
      >
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div>
            <h2
              className={`font-display text-xl sm:text-2xl font-bold tracking-wide ${
                isButcher ? "text-[#1C1917]" : "text-white"
              }`}
            >
              Smokehouse Notes &amp; Media Files
            </h2>
            <p className={`text-xs ${isButcher ? "text-stone-600 font-medium" : "text-zinc-400"}`}>
              Save instructions, driveway photos, custom recipes, and smoker logistics.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex h-11 px-5 items-center justify-center gap-2 rounded-xl bg-[radial-gradient(ellipse_at_center,_#C84A0A_0%,_#7E2605_60%,_#2A0D02_100%)] border border-[#FF7A00] font-display text-sm font-bold tracking-wider text-white uppercase shadow-[0_0_14px_rgba(255,122,0,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap"
          >
            <span>{showAddForm ? "✕ Cancel" : "+ Create New Note"}</span>
          </button>
        </div>

        {/* 3. ADD NOTE ACCORDION / FORM */}
        {showAddForm && (
          <form
            onSubmit={handleSubmitNote}
            className={`pt-4 border-t space-y-4 animate-in fade-in duration-200 ${
              isButcher ? "border-[#E2DACF]" : "border-zinc-800/80"
            }`}
          >
            <div
              className={`p-5 sm:p-6 rounded-2xl border-2 space-y-4 shadow-lg transition-colors ${
                isButcher
                  ? "bg-[#FAF7F2] border-[#EA580C]"
                  : "bg-[#18181C] border-[#EA580C]/60"
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs uppercase font-extrabold tracking-widest ${
                    isButcher ? "text-[#C84A0A]" : "text-[#FF8C38]"
                  }`}
                >
                  New Pitmaster Note &amp; Attachment
                </span>
                <span className={`text-xs ${isButcher ? "text-stone-600 font-medium" : "text-zinc-400"}`}>
                  Recipient: <strong className={isButcher ? "text-stone-900" : "text-white"}>boldenmarion83@gmail.com</strong>
                </span>
              </div>

              {/* Title */}
              <div>
                <label
                  className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                    isButcher ? "text-stone-800" : "text-zinc-300"
                  }`}
                >
                  Note Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fullerton Ave Wedding: Rig Placement & Tree Clearance"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`w-full h-11 px-4 rounded-xl border focus:border-[#EA580C] text-sm focus:outline-none transition-colors ${
                    isButcher
                      ? "bg-white border-[#D8CEC1] text-stone-900 placeholder:text-stone-400"
                      : "bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500"
                  }`}
                />
              </div>

              {/* Category & Priority Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                      isButcher ? "text-stone-800" : "text-zinc-300"
                    }`}
                  >
                    Category Tag
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as NoteCategory)}
                    className={`w-full h-11 px-3 rounded-xl border text-xs font-semibold focus:border-[#EA580C] focus:outline-none transition-colors ${
                      isButcher
                        ? "bg-white border-[#D8CEC1] text-stone-900"
                        : "bg-zinc-900 border-zinc-700 text-white"
                    }`}
                  >
                    <option value="smoker-rig">Smoker Rig &amp; Access</option>
                    <option value="meats-menu">Meats &amp; Custom Menu</option>
                    <option value="event-prep">Event Day Logistics</option>
                    <option value="customer-request">Customer Request</option>
                    <option value="general">General Smokehouse Note</option>
                  </select>
                </div>

                <div>
                  <label
                    className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                      isButcher ? "text-stone-800" : "text-zinc-300"
                    }`}
                  >
                    Priority Level
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as NotePriority)}
                    className={`w-full h-11 px-3 rounded-xl border text-xs font-semibold focus:border-[#EA580C] focus:outline-none transition-colors ${
                      isButcher
                        ? "bg-white border-[#D8CEC1] text-stone-900"
                        : "bg-zinc-900 border-zinc-700 text-white"
                    }`}
                  >
                    <option value="normal">Normal Priority</option>
                    <option value="high">High Priority</option>
                    <option value="urgent">Urgent / Event Day</option>
                  </select>
                </div>
              </div>

              {/* What I'm Sending & Why (Body text) */}
              <div>
                <label
                  className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                    isButcher ? "text-stone-800" : "text-zinc-300"
                  }`}
                >
                  What I&apos;m Sending &amp; Why *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Explain what this is and why it's important (e.g. Driveway photos attached. Alley is tight, smoker rig must be unhitched from the side. Bring extra extension cords...)"
                  value={whatAndWhy}
                  onChange={(e) => setWhatAndWhy(e.target.value)}
                  className={`w-full p-4 rounded-xl border focus:border-[#EA580C] text-sm focus:outline-none resize-none transition-colors ${
                    isButcher
                      ? "bg-white border-[#D8CEC1] text-stone-900 placeholder:text-stone-400"
                      : "bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500"
                  }`}
                />
              </div>

              {/* Photo & Attachment Uploader */}
              <div className="space-y-3">
                <label
                  className={`block text-xs font-bold uppercase tracking-wider ${
                    isButcher ? "text-stone-800" : "text-zinc-300"
                  }`}
                >
                  Attach Photos &amp; Documents (Smoker layout, venue pics, cut sheets)
                </label>

                <div className="flex flex-wrap items-center gap-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,.pdf,.doc,.docx"
                    onChange={handleFilesSelected}
                    className="hidden"
                    id="note-file-input"
                  />
                  <label
                    htmlFor="note-file-input"
                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold uppercase tracking-wider cursor-pointer transition-all ${
                      isButcher
                        ? "bg-white hover:bg-[#F2ECE3] border-[#D8CEC1] hover:border-[#EA580C] text-stone-800 shadow-sm"
                        : "bg-zinc-900 hover:bg-zinc-800 border-zinc-700 hover:border-[#EA580C] text-zinc-200 hover:text-white"
                    }`}
                  >
                    <span>Upload Photos / Files</span>
                  </label>

                  <span className={`text-xs ${isButcher ? "text-stone-500 font-medium" : "text-zinc-500"}`}>
                    Auto-compressed for instant mobile view. Max 10 photos per note.
                  </span>
                </div>

                {/* Thumbnails Gallery */}
                {attachments.length > 0 && (
                  <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                    {attachments.map((att) => (
                      <div
                        key={att.id}
                        className={`relative group rounded-xl overflow-hidden border aspect-square ${
                          isButcher
                            ? "border-[#D8CEC1] bg-stone-100"
                            : "border-zinc-700 bg-zinc-900"
                        }`}
                      >
                        <Image
                          src={att.dataUrl}
                          alt={att.name}
                          fill
                          className="object-cover cursor-pointer hover:scale-105 transition-transform"
                          onClick={() => setPreviewImage(att.dataUrl)}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-1.5">
                          <span className="text-[10px] text-zinc-200 truncate font-mono">
                            {att.name}
                          </span>
                          <span className="text-[9px] text-[#FF8C38]">
                            {att.sizeKb} KB
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveAttachment(att.id)}
                          className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-600/90 text-white text-xs flex items-center justify-center hover:bg-red-700 cursor-pointer shadow"
                          title="Remove this photo"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Brevo Notification Toggle */}
              <div className="pt-2 flex items-center gap-2">
                <input
                  id="brevo-notify-check"
                  type="checkbox"
                  checked={sendBrevoEmail}
                  onChange={(e) => setSendBrevoEmail(e.target.checked)}
                  className="rounded border-zinc-700 bg-zinc-900 text-[#EA580C] focus:ring-[#EA580C] h-4 w-4 accent-[#EA580C]"
                />
                <label
                  htmlFor="brevo-notify-check"
                  className={`text-xs cursor-pointer select-none ${
                    isButcher ? "text-stone-700 font-semibold" : "text-zinc-300 font-medium"
                  }`}
                >
                  Forward alert copy to{" "}
                  <strong className={isButcher ? "text-[#C84A0A]" : "text-amber-400"}>
                    boldenmarion83@gmail.com
                  </strong>{" "}
                  via Brevo
                </label>
              </div>

              {/* Buttons */}
              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-colors ${
                    isButcher
                      ? "border-[#D8CEC1] bg-white text-stone-700 hover:text-stone-900 hover:bg-stone-50"
                      : "border-zinc-700 text-zinc-400 hover:text-white"
                  }`}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex h-11 px-6 items-center justify-center rounded-xl bg-[radial-gradient(ellipse_at_center,_#C84A0A_0%,_#7E2605_60%,_#2A0D02_100%)] border border-[#FF7A00] font-display text-sm font-bold tracking-wider text-white uppercase shadow-[0_0_14px_rgba(255,122,0,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? "Saving Note..." : "Save & Forward Note →"}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* 4. SEARCH & FILTER TABS */}
        <div className="pt-2 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search */}
          <div className="flex-1 max-w-md relative">
            <input
              type="text"
              placeholder="Search notes by keyword or venue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full h-10 px-4 rounded-xl border text-xs focus:border-[#EA580C] focus:outline-none transition-colors ${
                isButcher
                  ? "bg-[#FAF7F2] border-[#D8CEC1] text-stone-900 placeholder:text-stone-500"
                  : "bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500"
              }`}
            />
          </div>

          {/* Status & Category Selector */}
          <div className="flex flex-wrap items-center gap-2">
            <div
              className={`inline-flex p-1 rounded-xl border text-xs transition-colors ${
                isButcher
                  ? "bg-[#FAF7F2] border-[#D8CEC1]"
                  : "bg-zinc-900 border-zinc-800"
              }`}
            >
              <button
                type="button"
                onClick={() => setStatusFilter("active")}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  statusFilter === "active"
                    ? "bg-[#EA580C] text-white shadow"
                    : isButcher
                    ? "text-stone-600 hover:text-stone-900"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Active ({totalActive})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("completed")}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  statusFilter === "completed"
                    ? isButcher
                      ? "bg-[#E5DDD1] text-stone-900 shadow font-black"
                      : "bg-zinc-800 text-white shadow"
                    : isButcher
                    ? "text-stone-600 hover:text-stone-900"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Completed
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("all")}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  statusFilter === "all"
                    ? isButcher
                      ? "bg-[#E5DDD1] text-stone-900 shadow font-black"
                      : "bg-zinc-800 text-white shadow"
                    : isButcher
                    ? "text-stone-600 hover:text-stone-900"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                All ({notes.length})
              </button>
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={`h-9 px-3 rounded-xl border text-xs font-semibold focus:border-[#EA580C] focus:outline-none transition-colors ${
                isButcher
                  ? "bg-[#FAF7F2] border-[#D8CEC1] text-stone-800"
                  : "bg-zinc-900 border-zinc-800 text-zinc-300"
              }`}
            >
              <option value="all">All Categories</option>
              <option value="smoker-rig">Smoker Rig &amp; Access</option>
              <option value="meats-menu">Meats &amp; Custom Menu</option>
              <option value="event-prep">Event Day Logistics</option>
              <option value="customer-request">Customer Request</option>
              <option value="general">General Smokehouse</option>
            </select>
          </div>
        </div>
      </div>

      {/* 5. NOTES FEED */}
      <div className="space-y-4">
        {filteredNotes.length === 0 ? (
          <div
            className={`p-12 rounded-2xl border text-center space-y-3 transition-colors ${
              isButcher
                ? "bg-[#FFFFFF] border-[#E2DACF] shadow-sm text-stone-900"
                : "bg-[#141417] border-zinc-800 text-white"
            }`}
          >
            <h3
              className={`font-display text-lg font-bold ${
                isButcher ? "text-[#1C1917]" : "text-white"
              }`}
            >
              No matching smokehouse notes found
            </h3>
            <p className={`text-xs max-w-sm mx-auto ${isButcher ? "text-stone-600 font-medium" : "text-zinc-400"}`}>
              Create a note above to record smoker parking details, custom meat portions, or customer event notes.
            </p>
          </div>
        ) : (
          filteredNotes.map((note) => {
            const cat = CATEGORY_META[note.category];
            const prio = PRIORITY_META[note.priority];
            const dateFormatted = new Date(note.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "2-digit",
            });

            const badgeCategoryClass = isButcher ? cat.badgeClassButcher : cat.badgeClassDark;
            const badgePriorityClass = isButcher ? prio.badgeClassButcher : prio.badgeClassDark;

            return (
              <div
                key={note.id}
                className={`p-5 sm:p-6 rounded-2xl border transition-all ${
                  note.isCompleted
                    ? isButcher
                      ? "bg-[#EAE4DC]/60 border-[#D8CEC1] opacity-60 text-stone-600"
                      : "bg-zinc-950/60 border-zinc-800 opacity-60"
                    : note.priority === "urgent"
                    ? isButcher
                      ? "bg-[#FFF5F5] border-red-300 shadow-sm"
                      : "bg-[#181210] border-red-800/80 shadow-[0_0_20px_rgba(220,38,38,0.15)]"
                    : isButcher
                    ? "bg-[#FFFFFF] border-[#E2DACF] shadow-sm hover:border-[#D0C4B5]"
                    : "bg-[#141417] border-zinc-800 hover:border-zinc-700"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  {/* Badges & Meta */}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Category Pill */}
                      <span
                        className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border inline-flex items-center ${badgeCategoryClass}`}
                      >
                        {cat.label}
                      </span>

                      {/* Priority Badge */}
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border inline-flex items-center gap-1.5 ${badgePriorityClass}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${prio.dotClass}`} />
                        <span>{prio.label}</span>
                      </span>

                      {/* Email Alert Badge */}
                      {note.emailNotified && (
                        <span
                          className={`text-[10px] font-mono inline-flex items-center gap-1 ${
                            isButcher ? "text-stone-600 font-semibold" : "text-zinc-400"
                          }`}
                        >
                          <span>Forwarded to boldenmarion83@gmail.com</span>
                        </span>
                      )}

                      <span
                        className={`text-[11px] ml-auto sm:ml-0 ${
                          isButcher ? "text-stone-500 font-medium" : "text-zinc-500"
                        }`}
                      >
                        {dateFormatted}
                      </span>
                    </div>

                    {/* Title */}
                    <h3
                      className={`font-display text-xl sm:text-2xl font-bold tracking-wide ${
                        note.isCompleted
                          ? isButcher
                            ? "text-stone-400 line-through"
                            : "text-zinc-400 line-through"
                          : isButcher
                          ? "text-[#1C1917]"
                          : "text-white"
                      }`}
                    >
                      {note.title}
                    </h3>

                    {/* What & Why Body Text */}
                    <div
                      className={`p-4 rounded-xl border text-xs sm:text-sm leading-relaxed whitespace-pre-wrap transition-colors ${
                        isButcher
                          ? "bg-[#FAF8F5] border-[#E8E0D5] text-stone-800 font-medium"
                          : "bg-[#19191D]/80 border-zinc-800/80 text-zinc-300"
                      }`}
                    >
                      {note.whatAndWhy}
                    </div>

                    {/* Attached Photos / Documents */}
                    {note.attachments && note.attachments.length > 0 && (
                      <div className="pt-2 space-y-1.5">
                        <span
                          className={`text-[11px] uppercase font-bold tracking-wider ${
                            isButcher ? "text-stone-700" : "text-zinc-400"
                          }`}
                        >
                          Attached Photos ({note.attachments.length}):
                        </span>
                        <div className="flex flex-wrap gap-2.5">
                          {note.attachments.map((att) => (
                            <div
                              key={att.id}
                              className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border cursor-pointer hover:scale-105 transition-transform ${
                                isButcher
                                  ? "border-[#D8CEC1] bg-stone-100"
                                  : "border-zinc-700 bg-black"
                              }`}
                              onClick={() => setPreviewImage(att.dataUrl)}
                              title={`${att.name} (${att.sizeKb} KB) - Click to view`}
                            >
                              <Image
                                src={att.dataUrl}
                                alt={att.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div
                    className={`flex sm:flex-col items-center gap-2 pt-2 sm:pt-0 sm:pl-4 border-t sm:border-t-0 sm:border-l ${
                      isButcher ? "border-[#E2DACF]" : "border-zinc-800"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleComplete(note.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                        note.isCompleted
                          ? isButcher
                            ? "bg-[#EAE4DC] text-stone-700 hover:bg-[#DDD5C9] border border-[#D0C4B5]"
                            : "bg-zinc-800 text-zinc-300 hover:text-white"
                          : isButcher
                          ? "bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 text-emerald-950 font-black"
                          : "bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700 text-emerald-300"
                      }`}
                    >
                      {note.isCompleted ? "Re-open" : "Mark Done"}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteNote(note.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        isButcher
                          ? "text-stone-500 hover:text-red-700 hover:bg-red-50"
                          : "text-zinc-500 hover:text-red-400 hover:bg-red-950/30"
                      }`}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 6. FULL-RESOLUTION IMAGE PREVIEW MODAL */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] w-full rounded-2xl overflow-hidden border border-zinc-700 bg-zinc-950 shadow-2xl p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-zinc-900/90 text-white border border-zinc-700 flex items-center justify-center text-sm font-bold hover:bg-red-600 transition-colors"
            >
              ✕
            </button>
            <div className="relative w-full h-[70vh]">
              <Image
                src={previewImage}
                alt="Enlarged note attachment"
                fill
                className="object-contain"
              />
            </div>
            <div className="p-3 text-center text-xs text-zinc-400">
              Tap anywhere outside image to close
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
