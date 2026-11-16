"use client";

import React, { useEffect, useState } from "react";
import { AdminGuide } from "./AdminGuide";
import { SITE_CONFIG } from "@/config/site-config";

interface StripeStep {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  instructions: string[];
  copyHint?: { label: string; value: string }[];
  actionLabel?: string;
  actionUrl?: string;
}

const STORAGE_KEY_STRIPE_STEPS = "ats_stripe_setup_steps_v1";

const STRIPE_STEPS: StripeStep[] = [
  {
    id: "step-1-account",
    number: 1,
    title: "Create Your Stripe Account & Verify Email",
    subtitle: "Set up your login under All The Smoke BBQ & Catering.",
    instructions: [
      "Click 'Open Stripe Sign-Up' below (dashboard.stripe.com/register).",
      `Enter your business email (${SITE_CONFIG.brandEmail} or boldenmarion83@gmail.com), your full name (Marion Bolden), and a strong password.`,
      "Keep Country set to United States and click 'Create account'.",
      "Open your email inbox right away and click the 'Verify email address' button inside the email from Stripe.",
    ],
    actionLabel: "Open Stripe Sign-Up ↗",
    actionUrl: "https://dashboard.stripe.com/register",
  },
  {
    id: "step-2-2fa",
    number: 2,
    title: "Turn On 2-Step Verification (Required for Payouts)",
    subtitle: "Protects your money with a quick text code when logging in.",
    instructions: [
      "When Stripe asks you to secure your account, choose 'SMS' (text message) or an Authenticator app.",
      `Enter your cell phone number (${SITE_CONFIG.phoneFormatted}) and type in the 6-digit code Stripe texts you.`,
      "Write down or screenshot the emergency backup code Stripe shows on screen and keep it somewhere safe.",
    ],
  },
  {
    id: "step-3-business",
    number: 3,
    title: "Fill Out Business & Tax Details ('Activate Payments')",
    subtitle: "Tell Stripe who you are and what shows up on customer card receipts.",
    instructions: [
      "On your Stripe Home screen, click the 'Activate payments' (or 'Start') button.",
      "Business Type: Choose 'Individual / Sole Proprietorship' (or 'LLC' if you have a registered LLC) and enter your SSN or EIN.",
      `Business Address: Enter ${SITE_CONFIG.hubAddress.street}, ${SITE_CONFIG.hubAddress.city}, ${SITE_CONFIG.hubAddress.state} ${SITE_CONFIG.hubAddress.zip}.`,
      "Industry: Select 'Food & Drink' -> 'Catering' (or 'Restaurants').",
      `Website: Enter https://${SITE_CONFIG.primaryDomain}`,
      `Public Business Details (what customers see on their card statement): Name = ${SITE_CONFIG.brandName}, Statement Descriptor = ALL THE SMOKE BBQ, Support Phone = ${SITE_CONFIG.phoneFormatted}.`,
    ],
    copyHint: [
      { label: "Website", value: `https://${SITE_CONFIG.primaryDomain}` },
      { label: "Statement Descriptor", value: "ALL THE SMOKE BBQ" },
      {
        label: "Business Address",
        value: `${SITE_CONFIG.hubAddress.street}, ${SITE_CONFIG.hubAddress.city}, ${SITE_CONFIG.hubAddress.state} ${SITE_CONFIG.hubAddress.zip}`,
      },
    ],
  },
  {
    id: "step-4-bank",
    number: 4,
    title: "Link Your Business Bank Account for Payouts",
    subtitle: "This is where Stripe sends your catering deposits and Weekend Drop money.",
    instructions: [
      "In the Bank Account step, click 'Link bank account' to sign into your bank instantly—OR choose 'Enter bank details manually'.",
      "If entering manually, type your 9-digit Routing Number and your Checking Account Number (use a checking account, not savings).",
      "For Payout Schedule, leave it on Automatic (Daily or Weekly) so card payments deposit straight into your bank automatically.",
    ],
  },
  {
    id: "step-5-id",
    number: 5,
    title: "Complete Identity Check (If Stripe Asks)",
    subtitle: "Quick photo ID check so Stripe never holds your payouts.",
    instructions: [
      "Check the top of your Stripe Home screen for any yellow or red 'Action required' banner.",
      "If Stripe asks to verify your identity, click the banner and use your phone camera to snap a clear front-and-back photo of your Driver's License or State ID.",
      "Wait 2–5 minutes for the green 'Verified' status.",
    ],
  },
  {
    id: "step-6-invite-admin",
    number: 6,
    title: "Invite Your Web Team as Administrator",
    subtitle: "Gives us safe access to wire up Checkout, deposits, and Revenue Analytics.",
    instructions: [
      "Click 'Open Stripe Team Settings' below (or click the Gear icon in Stripe's top-right -> 'Team and security' -> 'Team').",
      "Click the purple '+ New member' button.",
      "Enter Todd's / Trident Website Design's email address.",
      "Under Role, select 'Administrator' (this lets us connect API keys, Payment Links, and webhooks without needing your password).",
      "Click 'Send invite', then text or call Todd so we can accept it and finish wiring your site!",
    ],
    actionLabel: "Open Stripe Team Settings ↗",
    actionUrl: "https://dashboard.stripe.com/settings/team",
  },
];

export interface AdminStripeSetupProps {
  theme?: "day" | "night" | "dark" | "butcher-paper";
}

export function AdminStripeSetup({ theme = "night" }: AdminStripeSetupProps) {
  const isDay = theme === "day" || theme === "butcher-paper";
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [copiedValue, setCopiedValue] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_STRIPE_STEPS);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setCompletedIds(parsed);
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  const toggleStep = (id: string) => {
    const next = completedIds.includes(id)
      ? completedIds.filter((item) => item !== id)
      : [...completedIds, id];
    setCompletedIds(next);
    try {
      localStorage.setItem(STORAGE_KEY_STRIPE_STEPS, JSON.stringify(next));
    } catch {
      // Ignore storage errors
    }
  };

  const handleCopy = (label: string, val: string) => {
    navigator.clipboard.writeText(val);
    setCopiedValue(label);
    setTimeout(() => setCopiedValue(null), 2000);
  };

  const completedCount = completedIds.length;
  const allDone = completedCount === STRIPE_STEPS.length;

  const cardCls = isDay
    ? "bg-[#FAF8F5] border border-[#D8CEC1] text-[#1C1917] shadow-sm"
    : "bg-zinc-900/80 border border-zinc-800 text-zinc-100";
  const subTextCls = isDay ? "text-stone-600" : "text-zinc-400";
  const innerCardCls = isDay
    ? "bg-white border border-[#E4DDD2]"
    : "bg-zinc-950/70 border border-zinc-800";

  return (
    <div className="space-y-6">
      <AdminGuide
        guideId="stripe-setup"
        theme={isDay ? "day" : "night"}
        title="How Stripe Setup & Bank Payouts work"
        summary="Why use this: Right now customers can request quotes, but they cannot pay a catering deposit or buy Weekend Drop plates online with a card. Follow these 6 steps in order to set up Stripe, link your bank account, and invite your web team as Administrator—once you send the invite, we handle all the website wiring for you."
        steps={[
          {
            title: "1. Follow Steps 1–5 in exact order",
            desc: "Each card below walks you click-by-click from creating your Stripe login, turning on 2-step text verification, entering your Chicago business details, and linking your checking account for payouts.",
          },
          {
            title: "2. Check off each step as you finish",
            desc: "Tap the numbered checkbox on each step when it's done so you never lose your place—your progress saves automatically.",
          },
          {
            title: "3. Invite your web team in Step 6",
            desc: "Go to Stripe Settings -> Team -> + New member, pick Administrator, and send the invite. Once we accept, we connect Checkout, deposits, and live Revenue Analytics without you touching any code.",
          },
        ]}
        tip="Never share your Stripe password—sending an Administrator invite from Settings -> Team gives us safe technical access while your bank payouts stay locked to your account."
      />

      {/* Progress & Quick Actions Header */}
      <section className={`rounded-2xl p-5 sm:p-6 space-y-4 ${cardCls}`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-widest text-[#EA580C]">
              💳 Step-by-Step Stripe Onboarding
            </span>
            <h2 className="font-display text-xl sm:text-2xl font-bold mt-1">
              Get Paid Online &amp; Connect Your Bank Account
            </h2>
            <p className={`text-xs sm:text-sm mt-1 ${subTextCls}`}>
              Complete Steps 1 through 6 in order. Once Step 6 is done, your web team can connect deposits, Checkout, and Revenue Analytics.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <span
              className={`px-3.5 py-2 rounded-full text-xs font-extrabold border ${
                allDone
                  ? "bg-emerald-500/15 text-emerald-500 border-emerald-500/40"
                  : "bg-[#EA580C]/15 text-[#EA580C] border-[#EA580C]/40"
              }`}
            >
              {allDone ? "✓ All 6 Steps Complete — Ready for Web Team!" : `${completedCount} / ${STRIPE_STEPS.length} Steps Complete`}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className={`w-full h-2.5 rounded-full overflow-hidden ${isDay ? "bg-[#E4DDD2]" : "bg-zinc-800"}`}>
          <div
            className={`h-full transition-all duration-300 ${allDone ? "bg-emerald-500" : "bg-[#EA580C]"}`}
            style={{ width: `${(completedCount / STRIPE_STEPS.length) * 100}%` }}
          />
        </div>

        {/* What to Have Ready */}
        <div className={`rounded-xl p-4 space-y-2 ${innerCardCls}`}>
          <p className="text-xs font-extrabold uppercase tracking-wider text-[#EA580C]">
            Before You Start — Have These 4 Things Handy:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
            <div>
              <span className="font-bold block">1. Business Email</span>
              <span className={subTextCls}>{SITE_CONFIG.brandEmail}</span>
            </div>
            <div>
              <span className="font-bold block">2. Mobile Phone</span>
              <span className={subTextCls}>For 2-step text codes</span>
            </div>
            <div>
              <span className="font-bold block">3. Tax &amp; Photo ID</span>
              <span className={subTextCls}>SSN or EIN + Driver&apos;s License</span>
            </div>
            <div>
              <span className="font-bold block">4. Business Bank Info</span>
              <span className={subTextCls}>Routing &amp; Checking Account #</span>
            </div>
          </div>
        </div>
      </section>

      {/* Step Cards */}
      <div className="space-y-4">
        {STRIPE_STEPS.map((step) => {
          const isDone = completedIds.includes(step.id);
          return (
            <section
              key={step.id}
              className={`rounded-2xl p-5 sm:p-6 transition-all ${cardCls} ${
                isDone ? "border-emerald-500/40" : ""
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <button
                    type="button"
                    onClick={() => toggleStep(step.id)}
                    aria-label={`Mark Step ${step.number} complete`}
                    className={`min-w-[48px] min-h-[48px] rounded-xl font-display text-base font-extrabold flex items-center justify-center shrink-0 transition-all cursor-pointer border ${
                      isDone
                        ? "bg-emerald-600 border-emerald-400 text-white"
                        : isDay
                        ? "bg-white border-[#C8A97E] text-[#1C1917] hover:border-[#EA580C]"
                        : "bg-zinc-950 border-zinc-700 text-white hover:border-[#EA580C]"
                    }`}
                  >
                    {isDone ? "✓" : step.number}
                  </button>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#EA580C]">
                        Step {step.number} of {STRIPE_STEPS.length}
                      </span>
                      {isDone && (
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
                          Completed
                        </span>
                      )}
                    </div>
                    <h3 className="font-display text-lg font-bold mt-0.5">{step.title}</h3>
                    <p className={`text-xs mt-0.5 ${subTextCls}`}>{step.subtitle}</p>
                  </div>
                </div>

                {step.actionUrl && step.actionLabel && (
                  <a
                    href={step.actionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[48px] px-4 rounded-xl bg-[radial-gradient(ellipse_at_center,_#C84A0A_0%,_#7E2605_60%,_#2A0D02_100%)] border border-[#FF7A00] text-white text-xs font-bold uppercase tracking-wider inline-flex items-center justify-center shrink-0 whitespace-nowrap"
                  >
                    {step.actionLabel}
                  </a>
                )}
              </div>

              <ol className={`mt-4 space-y-2 pl-4 sm:pl-16 text-xs sm:text-sm list-decimal ${isDone ? subTextCls : ""}`}>
                {step.instructions.map((line, i) => (
                  <li key={i} className="leading-relaxed">
                    {line}
                  </li>
                ))}
              </ol>

              {step.copyHint && step.copyHint.length > 0 && (
                <div className="mt-4 sm:pl-16 flex flex-wrap gap-2">
                  {step.copyHint.map((hint) => (
                    <button
                      key={hint.label}
                      type="button"
                      onClick={() => handleCopy(hint.label, hint.value)}
                      className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                        isDay
                          ? "bg-white border-[#D8CEC1] text-[#1C1917] hover:border-[#EA580C]"
                          : "bg-zinc-950 border-zinc-800 text-zinc-200 hover:border-[#EA580C]"
                      }`}
                    >
                      <span className="text-[#EA580C] font-bold">{hint.label}:</span> {hint.value}{" "}
                      <span className="ml-1 opacity-70">
                        {copiedValue === hint.label ? "✓ Copied" : "📋 Copy"}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
