import React from "react";
import Image from "next/image";
import { SITE_CONFIG } from "@/config/site-config";

export function Footer() {
  return (
    <footer className="bg-[#0e0e10] border-t border-zinc-800/80 py-14 px-4 sm:px-8 text-stone-400 text-xs mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Column 1: Brand */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 shrink-0 overflow-hidden rounded-full border border-[#C8A97E]/40 shadow-[0_0_12px_rgba(200,169,126,0.15)]">
              <Image
                src="/brand/allthesmoke-logo.png"
                alt="All The Smoke Official Master Crest"
                fill
                className="object-cover"
              />
            </div>
            <h3 className="font-display text-lg font-bold tracking-tight text-[#F4EFEA]">
              All The Smoke
            </h3>
          </div>
          <p className="text-stone-400 text-xs leading-relaxed">
            Booked-to-order live-fire smokehouse &amp; culinary commissary operations.
            Exclusive Chicago wedding, corporate, and private catering dispatch.
          </p>
        </div>

        {/* Column 2: Operations Hub */}
        <div>
          <h3 className="font-display text-lg font-bold tracking-tight text-[#F4EFEA] mb-4">
            Operations Hub
          </h3>
          <div className="space-y-1">
            <p className="text-stone-300 text-sm">Chicago’s Northwest Side</p>
            <p className="text-stone-400 text-xs">Dunning Hub / 60634</p>
            <p className="text-stone-500 text-xs mt-1">
              (By booked dispatch only; exclusive commercial kitchen commissary)
            </p>
          </div>
        </div>

        {/* Column 3: Direct Dispatch */}
        <div>
          <h3 className="font-display text-lg font-bold tracking-tight text-[#F4EFEA] mb-4">
            Direct Dispatch
          </h3>
          <div className="text-stone-300 leading-relaxed space-y-2">
            <p>
              <span className="text-stone-400">Direct: </span>
              <a
                href="tel:7737079988"
                className="text-[#C8A97E] hover:text-[#EA580C] font-semibold transition-colors"
              >
                (773) 707-9988
              </a>
            </p>
            <p>
              <span className="text-stone-400">Inquiries: </span>
              <a
                href={`mailto:${SITE_CONFIG.brandEmail}`}
                className="text-stone-300 hover:text-white transition-colors"
              >
                {SITE_CONFIG.brandEmail}
              </a>
            </p>
            <p>
              <span className="text-stone-400">TikTok: </span>
              <a
                href="https://www.tiktok.com/@allthesmokebbq_catering"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#C8A97E] hover:text-[#EA580C] font-semibold transition-colors"
              >
                @allthesmokebbq_catering
              </a>
            </p>
          </div>
        </div>

        {/* Column 4: Authentic Credentials & Agency Credit */}
        <div>
          <h3 className="font-display text-lg font-bold tracking-tight text-[#F4EFEA] mb-4">
            Authentic Credentials
          </h3>
          <div className="space-y-2 text-xs text-stone-400">
            <p>© 2026 All The Smoke BBQ &amp; Catering. All rights reserved.</p>
            <p>
              Pitmaster / Operator:{" "}
              <span className="text-[#F4EFEA] font-semibold">Marion Bolden</span>
            </p>
            <p className="pt-2 text-stone-400">
              Designed By:{" "}
              <a
                href="https://tridentwebsitedesign.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#C8A97E] hover:text-[#EA580C] font-bold tracking-wide transition-colors"
              >
                Trident Website Design
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
