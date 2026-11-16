"use client";

import React, { useEffect, useState } from "react";
import { SITE_CONFIG } from "@/config/site-config";
import { AdminGuide } from "./AdminGuide";

export type DirectoryStatus =
  | "Not Started"
  | "Docs Needed"
  | "Pending Verification"
  | "Live";

export interface DirectoryEntry {
  id: string;
  name: string;
  requiredProof: string;
  claimUrl: string;
  status: DirectoryStatus;
  liveUrl: string;
  notes: string;
}

export interface VerificationDocItem {
  docKey: "business-license" | "kitchen-lease" | "utility-bill";
  label: string;
  helper: string;
  fileName: string;
  verified: boolean;
  updatedAt?: string;
}

const STORAGE_KEY_DIRS = "ats_blueprint_q_directories_v2";
const STORAGE_KEY_VAULT = "ats_blueprint_q_vault_v1";

const DEFAULT_DIRECTORIES: DirectoryEntry[] = [
  {
    id: "tiktok-business",
    name: "TikTok (@allthesmokebbq_catering)",
    requiredProof: "Live Bio Link to https://allthesmokecatering.com + Matching Phone",
    claimUrl: "https://www.tiktok.com/@allthesmokebbq_catering",
    status: "Live",
    liveUrl: "https://www.tiktok.com/@allthesmokebbq_catering",
    notes: "Already live and linked in website schema & GBP.",
  },
  {
    id: "facebook-business",
    name: "Facebook Business Page",
    requiredProof: "Matching NAP, Hours (Tue–Sun 8AM–8PM), and Website",
    claimUrl: "https://business.facebook.com/",
    status: "Not Started",
    liveUrl: "",
    notes: "Priority #1: Replaces competitor 'All The Smoke' Facebook page on Google Page 1.",
  },
  {
    id: "instagram-business",
    name: "Instagram Business (@allthesmokebbq_catering)",
    requiredProof: "Professional Account linked to Facebook Business + Bio Link",
    claimUrl: "https://www.instagram.com/",
    status: "Not Started",
    liveUrl: "",
    notes: "Match TikTok handle @allthesmokebbq_catering and link https://allthesmokecatering.com.",
  },
  {
    id: "apple-business-connect",
    name: "Apple Business Connect (Apple Maps)",
    requiredProof: "City of Chicago Business License or Kitchen Lease + Phone Verification",
    claimUrl: "https://businessconnect.apple.com/",
    status: "Docs Needed",
    liveUrl: "",
    notes: "Use 3401 N Orange Ave privately for verification; hide walk-in storefront view.",
  },
  {
    id: "bing-places",
    name: "Bing Places for Business",
    requiredProof: "1-Click Import from Verified Google Business Profile",
    claimUrl: "https://www.bingplaces.com/",
    status: "Not Started",
    liveUrl: "",
    notes: "Powers Bing, Yahoo, DuckDuckGo, and Copilot local results.",
  },
  {
    id: "yelp-business",
    name: "Yelp for Business",
    requiredProof: "Business Phone / SMS Verification + Matching NAP",
    claimUrl: "https://biz.yelp.com/",
    status: "Not Started",
    liveUrl: "",
    notes: "Match exact phone (773) 707-9988 and https://allthesmokecatering.com.",
  },
  {
    id: "nextdoor-business",
    name: "Nextdoor Business",
    requiredProof: "Chicago Service-Area Verification",
    claimUrl: "https://business.nextdoor.com/",
    status: "Not Started",
    liveUrl: "",
    notes: "Strong neighborhood catering referrals across NW Side & Chicagoland.",
  },
  {
    id: "ezcater",
    name: "ezCater (Corporate Catering)",
    requiredProof: "Business License, Food Handler Cert & W-9",
    claimUrl: "https://www.ezcater.com/caterers",
    status: "Not Started",
    liveUrl: "",
    notes: "High-intent corporate & office catering orders.",
  },
];

const DEFAULT_VAULT_DOCS: VerificationDocItem[] = [
  {
    docKey: "business-license",
    label: "City of Chicago Business License",
    helper: "Required for Apple Business Connect & ezCater verification (never store SSN/EIN here).",
    fileName: "",
    verified: false,
  },
  {
    docKey: "kitchen-lease",
    label: "Commercial / Shared Kitchen Lease",
    helper: "Proves physical operating authority at commercial hub address.",
    fileName: "",
    verified: false,
  },
  {
    docKey: "utility-bill",
    label: "Business Utility Bill / Tax Registration",
    helper: "Backup proof showing All The Smoke BBQ & Catering + Chicago address.",
    fileName: "",
    verified: false,
  },
];

export interface AdminDirectoriesHubProps {
  theme?: "day" | "night" | "dark" | "butcher-paper";
}

export function AdminDirectoriesHub({ theme = "night" }: AdminDirectoriesHubProps) {
  const isDay = theme === "day" || theme === "butcher-paper";
  const [directories, setDirectories] = useState<DirectoryEntry[]>(DEFAULT_DIRECTORIES);
  const [vaultDocs, setVaultDocs] = useState<VerificationDocItem[]>(DEFAULT_VAULT_DOCS);
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  useEffect(() => {
    try {
      const rawDirs = localStorage.getItem(STORAGE_KEY_DIRS);
      if (rawDirs) {
        const parsed: DirectoryEntry[] = JSON.parse(rawDirs);
        if (Array.isArray(parsed) && parsed.length > 0) setDirectories(parsed);
      }
      const rawVault = localStorage.getItem(STORAGE_KEY_VAULT);
      if (rawVault) {
        const parsed: VerificationDocItem[] = JSON.parse(rawVault);
        if (Array.isArray(parsed) && parsed.length > 0) setVaultDocs(parsed);
      }
    } catch {
      // Fallback to defaults
    }
  }, []);

  const persistDirs = (next: DirectoryEntry[], msg = "Directory tracker saved") => {
    setDirectories(next);
    try {
      localStorage.setItem(STORAGE_KEY_DIRS, JSON.stringify(next));
    } catch {}
    setSavedNotice(msg);
    setTimeout(() => setSavedNotice(null), 2200);
  };

  const persistVault = (next: VerificationDocItem[], msg = "Verification vault updated") => {
    setVaultDocs(next);
    try {
      localStorage.setItem(STORAGE_KEY_VAULT, JSON.stringify(next));
    } catch {}
    setSavedNotice(msg);
    setTimeout(() => setSavedNotice(null), 2200);
  };

  const updateDirectory = (
    id: string,
    patch: Partial<Pick<DirectoryEntry, "status" | "liveUrl" | "notes">>
  ) => {
    const next = directories.map((d) => (d.id === id ? { ...d, ...patch } : d));
    persistDirs(next);
  };

  const handleDocAttach = (
    docKey: VerificationDocItem["docKey"],
    file: File | undefined
  ) => {
    if (!file) return;
    const next = vaultDocs.map((doc) =>
      doc.docKey === docKey
        ? {
            ...doc,
            fileName: file.name,
            verified: true,
            updatedAt: new Date().toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }),
          }
        : doc
    );
    persistVault(next, `Attached ${file.name} to private vault`);
  };

  const toggleDocVerified = (docKey: VerificationDocItem["docKey"]) => {
    const next = vaultDocs.map((doc) =>
      doc.docKey === docKey ? { ...doc, verified: !doc.verified } : doc
    );
    persistVault(next);
  };

  const liveCount = directories.filter((d) => d.status === "Live").length;
  const cardCls = isDay
    ? "bg-[#FAF8F5] border border-[#D8CEC1] text-[#1C1917] shadow-sm"
    : "bg-zinc-900/80 border border-zinc-800 text-zinc-100";
  const subTextCls = isDay ? "text-stone-600" : "text-zinc-400";
  const inputCls = isDay
    ? "bg-white border border-[#C8A97E] text-[#1C1917]"
    : "bg-zinc-950 border border-zinc-700 text-white";

  return (
    <div className="space-y-6">
      <AdminGuide
        guideId="directories"
        theme={isDay ? "day" : "night"}
        title="Directories & Apple Maps Verification"
        summary="Keep your business license, kitchen lease, and directory listings organized in one private spot."
        steps={[
          {
            title: "Attach your verification docs below",
            desc: "Apple Maps asks for your City of Chicago Business License or kitchen lease (never your SSN or EIN).",
          },
          {
            title: "Claim Bing Places in 2 minutes",
            desc: "Bing Places imports straight from your verified Google Business Profile.",
          },
          {
            title: "Save each live URL",
            desc: "Once a listing goes live, update its status and paste the public link here.",
          },
        ]}
        tip="3401 N Orange Ave is strictly for private Apple/Bing verification—never shown as a walk-in storefront."
      />

      {savedNotice && (
        <div className="px-4 py-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-xs font-bold">
          ✓ {savedNotice}
        </div>
      )}

      {/* 1. Private Business Verification Vault */}
      <section className={`rounded-2xl p-5 sm:p-6 space-y-5 ${cardCls}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-700/30 pb-4">
          <div>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-widest text-[#EA580C]">
              🔒 Private Business Verification Vault
            </span>
            <h2 className="font-display text-xl font-bold mt-1">
              NAP &amp; Official Proof (RLS-Protected Bucket: <code className="text-xs">verification-docs</code>)
            </h2>
            <p className={`text-xs mt-1 ${subTextCls}`}>
              Private verification only—never store raw SSN or EIN numbers here, and never expose the hub address as a walk-in storefront.
            </p>
          </div>
          <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-[#EA580C]/15 text-[#EA580C] border border-[#EA580C]/40 self-start sm:self-center">
            {vaultDocs.filter((d) => d.verified).length}/{vaultDocs.length} Docs Ready
          </span>
        </div>

        {/* Locked Canonical NAP Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className={`p-3 rounded-xl border ${isDay ? "bg-white border-[#E4DDD2]" : "bg-zinc-950/70 border-zinc-800"}`}>
            <span className={`block font-bold uppercase tracking-wider text-[10px] ${subTextCls}`}>Legal Brand Name</span>
            <span className="font-bold text-sm mt-0.5 block">{SITE_CONFIG.brandName}</span>
          </div>
          <div className={`p-3 rounded-xl border ${isDay ? "bg-white border-[#E4DDD2]" : "bg-zinc-950/70 border-zinc-800"}`}>
            <span className={`block font-bold uppercase tracking-wider text-[10px] ${subTextCls}`}>Private Hub Address (No Walk-In)</span>
            <span className="font-bold text-sm mt-0.5 block">
              {SITE_CONFIG.hubAddress.street}, {SITE_CONFIG.hubAddress.city}, {SITE_CONFIG.hubAddress.state} {SITE_CONFIG.hubAddress.zip}
            </span>
          </div>
          <div className={`p-3 rounded-xl border ${isDay ? "bg-white border-[#E4DDD2]" : "bg-zinc-950/70 border-zinc-800"}`}>
            <span className={`block font-bold uppercase tracking-wider text-[10px] ${subTextCls}`}>Official Phone</span>
            <span className="font-bold text-sm mt-0.5 block">{SITE_CONFIG.phoneFormatted}</span>
          </div>
          <div className={`p-3 rounded-xl border ${isDay ? "bg-white border-[#E4DDD2]" : "bg-zinc-950/70 border-zinc-800"}`}>
            <span className={`block font-bold uppercase tracking-wider text-[10px] ${subTextCls}`}>Canonical Website</span>
            <span className="font-bold text-sm mt-0.5 block">https://{SITE_CONFIG.primaryDomain}</span>
          </div>
        </div>

        {/* Document Checklist & Private File Attach */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {vaultDocs.map((doc) => (
            <div
              key={doc.docKey}
              className={`p-4 rounded-xl border flex flex-col justify-between gap-3 ${
                isDay ? "bg-white border-[#E4DDD2]" : "bg-zinc-950/60 border-zinc-800"
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-bold text-sm">{doc.label}</h3>
                  <span
                    className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                      doc.verified
                        ? "bg-emerald-500/15 text-emerald-500 border border-emerald-500/30"
                        : "bg-amber-500/15 text-amber-500 border border-amber-500/30"
                    }`}
                  >
                    {doc.verified ? "Ready" : "Needed"}
                  </span>
                </div>
                <p className={`text-xs leading-relaxed ${subTextCls}`}>{doc.helper}</p>
                {doc.fileName && (
                  <p className="text-xs font-semibold text-[#EA580C] break-all">
                    File: {doc.fileName} {doc.updatedAt ? `(${doc.updatedAt})` : ""}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 pt-1">
                <label className="flex-1 min-h-[48px] px-3 py-2 rounded-xl bg-[#FAF8F5] hover:bg-white border border-[#C8A97E] text-[#1C1917] text-xs font-bold inline-flex items-center justify-center cursor-pointer text-center">
                  <span>{doc.fileName ? "Replace File" : "Attach PDF / Photo"}</span>
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    className="sr-only"
                    onChange={(e) => handleDocAttach(doc.docKey, e.target.files?.[0])}
                  />
                </label>
                <button
                  type="button"
                  onClick={() => toggleDocVerified(doc.docKey)}
                  className={`min-h-[48px] px-3 rounded-xl text-xs font-bold border ${
                    doc.verified
                      ? "bg-emerald-600 text-white border-emerald-500"
                      : isDay
                        ? "bg-stone-100 text-stone-800 border-stone-300"
                        : "bg-zinc-800 text-zinc-200 border-zinc-700"
                  }`}
                >
                  {doc.verified ? "✓" : "Mark"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Directory Submission Tracker */}
      <section className={`rounded-2xl p-5 sm:p-6 space-y-5 ${cardCls}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="font-display text-xl font-bold">
              Directory Submission Tracker
            </h2>
            <p className={`text-xs mt-0.5 ${subTextCls}`}>
              Track claim status and live profile URLs across Apple Maps, Bing, Yelp, Facebook, Nextdoor, and ezCater.
            </p>
          </div>
          <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 self-start sm:self-center">
            {liveCount}/{directories.length} Live
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {directories.map((dir) => (
            <div
              key={dir.id}
              className={`p-4 sm:p-5 rounded-xl border space-y-3 ${
                isDay ? "bg-white border-[#E4DDD2]" : "bg-zinc-950/60 border-zinc-800"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold text-base">{dir.name}</h3>
                  <p className="text-xs font-semibold text-[#EA580C] mt-0.5">
                    Proof: {dir.requiredProof}
                  </p>
                </div>
                <a
                  href={dir.claimUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[48px] px-4 rounded-xl bg-[radial-gradient(ellipse_at_center,_#C84A0A_0%,_#7E2605_60%,_#2A0D02_100%)] border border-[#FF7A00] text-white text-xs font-bold uppercase tracking-wider inline-flex items-center justify-center shrink-0 whitespace-nowrap"
                >
                  Claim ↗
                </a>
              </div>

              <p className={`text-xs ${subTextCls}`}>{dir.notes}</p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <select
                  aria-label={`${dir.name} status`}
                  value={dir.status}
                  onChange={(e) =>
                    updateDirectory(dir.id, { status: e.target.value as DirectoryStatus })
                  }
                  className={`min-h-[48px] px-3 rounded-xl text-xs font-bold ${inputCls}`}
                >
                  <option value="Not Started">Not Started</option>
                  <option value="Docs Needed">Docs Needed</option>
                  <option value="Pending Verification">Pending Verification</option>
                  <option value="Live">Live</option>
                </select>

                <input
                  type="url"
                  aria-label={`${dir.name} live profile URL`}
                  placeholder="Paste live listing URL..."
                  value={dir.liveUrl}
                  onChange={(e) => updateDirectory(dir.id, { liveUrl: e.target.value })}
                  className={`sm:col-span-2 min-h-[48px] px-3 rounded-xl text-xs ${inputCls}`}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
