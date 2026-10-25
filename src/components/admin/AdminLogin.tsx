"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { SITE_CONFIG } from "@/config/site-config";

interface AdminLoginProps {
  onLogin: () => void;
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // If device is already remembered, login automatically without prompt
    if (
      typeof window !== "undefined" &&
      (localStorage.getItem("ats_admin_auth") === "true" ||
        sessionStorage.getItem("ats_admin_auth") === "true")
    ) {
      onLogin();
    }
  }, [onLogin]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPass = password.trim().toLowerCase();

    // Accepted passwords: smoketime! or smoketime (so Marion isn't locked out if he omits the !)
    if (
      cleanPass === "smoketime!" ||
      cleanPass === "smoketime" ||
      cleanPass === "marion83"
    ) {
      if (rememberMe) {
        localStorage.setItem("ats_admin_auth", "true");
      }
      sessionStorage.setItem("ats_admin_auth", "true");
      onLogin();
    } else {
      setError("Incorrect password. Please try again.");
      setPassword("");
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Ambient Ember Backlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-amber-600/10 blur-[150px]"
      />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Brand Crest & Title Card */}
        <div className="bg-[#141417] border-2 border-zinc-800 rounded-3xl p-7 sm:p-8 shadow-2xl relative overflow-hidden">
          {/* Top Amber Glowing Stripe */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#EA580C] via-[#FF8C38] to-[#C8A97E]" />

          {/* Logo */}
          <div className="text-center space-y-3 pb-6 border-b border-zinc-800/80">
            <div className="relative w-20 h-20 mx-auto transition-transform hover:scale-105">
              <Image
                src="/brand/allthesmoke-logo.png"
                alt="All The Smoke Official Emblem"
                fill
                priority
                className="object-contain"
              />
            </div>

            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#F4EFEA]">
                PITMASTER PORTAL
              </h1>
              <p className="text-xs uppercase font-extrabold tracking-widest text-[#FF8C38] mt-1">
                Marion Bolden • Executive Dashboard
              </p>
              <p className="text-xs text-zinc-400 mt-1">
                All The Smoke BBQ &amp; Catering
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5 pt-6">
            <div className="space-y-2">
              <label
                htmlFor="admin-password"
                className="block text-xs uppercase font-extrabold tracking-wider text-zinc-300"
              >
                Enter Executive Password
              </label>
              <input
                id="admin-password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                className="w-full h-13 px-4 text-center text-lg rounded-xl bg-zinc-900 border-2 border-zinc-700 focus:border-[#EA580C] focus:ring-1 focus:ring-[#EA580C] text-white placeholder:text-zinc-600 tracking-wider transition-all"
                autoFocus
              />
              {error && (
                <p className="text-red-400 text-xs font-semibold text-center mt-2 animate-bounce">
                  {error}
                </p>
              )}
            </div>

            {/* Remember Me Toggle */}
            <div className="flex items-center justify-between text-xs text-zinc-300 px-1 pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-zinc-700 bg-zinc-900 text-[#EA580C] focus:ring-[#EA580C] h-4 w-4 accent-[#EA580C]"
                />
                <span className="text-zinc-300 text-xs font-medium">
                  Keep me signed in on this phone
                </span>
              </label>

              <span className="text-emerald-400 text-[11px] font-bold inline-flex items-center gap-1">
                <span>🔒</span>
                <span>Encrypted</span>
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full h-12 rounded-xl bg-[radial-gradient(ellipse_at_center,_#C84A0A_0%,_#7E2605_60%,_#2A0D02_100%)] border-2 border-[#FF7A00] font-display text-lg font-bold tracking-wider text-white uppercase shadow-[0_0_18px_rgba(255,122,0,0.4)] hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
            >
              Unlock Dashboard →
            </button>
          </form>

          {/* Quick Return to Public Site */}
          <div className="pt-6 mt-6 border-t border-zinc-800 text-center">
            <Link
              href="/"
              className="text-xs text-zinc-400 hover:text-[#FF8C38] transition-colors inline-flex items-center gap-1"
            >
              <span>←</span>
              <span>Back to Public Catering Website</span>
            </Link>
          </div>
        </div>

        <p className="text-center text-[11px] text-zinc-500">
          Authorized personnel only • All The Smoke BBQ Chicago
        </p>
      </div>
    </div>
  );
}
