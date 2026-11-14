"use client";

import React from "react";

interface ServiceAreaMapProps {
  activeZone: number | null;
  onSelectZip?: (zip: string) => void;
}

interface CityPin {
  name: string;
  zip: string;
  zone: 1 | 2 | 3;
  x: number;
  y: number;
  anchor?: "start" | "middle" | "end";
  dy?: number;
}

const CITY_PINS: CityPin[] = [
  // Zone 1 (0–10 mi from 60634)
  { name: "O'Hare / Rosemont", zip: "60018", zone: 1, x: 205, y: 185, anchor: "end", dy: -8 },
  { name: "Park Ridge", zip: "60068", zone: 1, x: 235, y: 158, anchor: "middle", dy: -9 },
  { name: "Oak Park", zip: "60301", zone: 1, x: 258, y: 245, anchor: "start", dy: 12 },

  // Zone 2 (10–20 mi)
  { name: "Evanston", zip: "60201", zone: 2, x: 302, y: 128, anchor: "start", dy: -6 },
  { name: "Schaumburg", zip: "60173", zone: 2, x: 145, y: 148, anchor: "end", dy: -6 },
  { name: "Downtown / West Loop", zip: "60607", zone: 2, x: 326, y: 228, anchor: "start", dy: 4 },
  { name: "Lombard", zip: "60148", zone: 2, x: 168, y: 236, anchor: "end", dy: 12 },

  // Zone 3 (20–35 mi)
  { name: "Highland Park", zip: "60035", zone: 3, x: 268, y: 70, anchor: "start", dy: -6 },
  { name: "Naperville", zip: "60540", zone: 3, x: 128, y: 288, anchor: "end", dy: 12 },
  { name: "Aurora", zip: "60505", zone: 3, x: 78, y: 282, anchor: "end", dy: -8 },
  { name: "Bolingbrook", zip: "60440", zone: 3, x: 155, y: 318, anchor: "middle", dy: 14 },
  { name: "Orland Park", zip: "60462", zone: 3, x: 245, y: 344, anchor: "middle", dy: 14 },
  { name: "South Side", zip: "60619", zone: 3, x: 342, y: 302, anchor: "start", dy: 5 },
];

const GOOGLE_MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=All+The+Smoke+BBQ+%26+Catering+Chicago+IL";

export function ServiceAreaMap({ activeZone, onSelectZip }: ServiceAreaMapProps) {
  // Center hub (60634 - Dunning / Northwest Side)
  const cx = 250;
  const cy = 205;

  const isZoneActive = (z: 1 | 2 | 3) => activeZone === null || activeZone === z;

  return (
    <div className="bg-[#0D0B0A] rounded-2xl border border-stone-800/90 p-4 sm:p-6 space-y-4 relative overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#C8A97E] block">
            35-Mile Chicagoland Coverage Map
          </span>
          <p className="text-xs text-stone-400">
            Click any city pin to auto-calculate its delivery zone &amp; fee.
          </p>
        </div>

        <a
          href={GOOGLE_MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold bg-[#1C1814] text-amber-400 border border-[#C8A97E]/30 hover:border-[#FF7A00] hover:text-amber-300 transition-colors"
        >
          <span>View on Google Maps</span>
          <span aria-hidden="true">↗</span>
        </a>
      </div>

      {/* Stylized Dark Chicagoland SVG Map */}
      <div className="relative w-full overflow-hidden rounded-xl border border-stone-800/80 bg-[#080706]">
        <svg
          viewBox="0 0 500 390"
          className="w-full h-auto block select-none"
          role="img"
          aria-label="Chicagoland 3-zone delivery radius map centered on Northwest Side Chicago 60634"
        >
          <defs>
            <radialGradient id="hubGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FF7A00" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#FF7A00" stopOpacity="0" />
            </radialGradient>
            <pattern id="mapGrid" width="25" height="25" patternUnits="userSpaceOnUse">
              <path
                d="M 25 0 L 0 0 0 25"
                fill="none"
                stroke="#1F1B18"
                strokeWidth="0.7"
              />
            </pattern>
          </defs>

          {/* Subtle street grid */}
          <rect width="500" height="390" fill="url(#mapGrid)" />

          {/* Lake Michigan Shoreline (East) */}
          <path
            d="M 278 0 Q 292 85 322 145 T 355 235 T 395 330 L 430 390 L 500 390 L 500 0 Z"
            fill="#0B1622"
            stroke="#1E3A5F"
            strokeWidth="1.2"
          />
          <text
            x="432"
            y="175"
            fill="#3B6998"
            fontSize="11"
            fontWeight="700"
            letterSpacing="2"
            textAnchor="middle"
            transform="rotate(72 432 175)"
            opacity="0.7"
          >
            LAKE MICHIGAN
          </text>

          {/* Major Chicagoland Expressways */}
          <g stroke="#29231E" strokeWidth="1.3" fill="none" strokeDasharray="3 3">
            {/* I-90 / I-94 */}
            <path d="M 55 30 Q 175 115 265 180 T 345 315 L 385 390" />
            {/* I-290 / I-88 */}
            <path d="M 30 278 Q 160 255 335 228" />
            {/* I-55 */}
            <path d="M 85 390 Q 200 305 335 228" />
            {/* I-294 Tri-State */}
            <path d="M 225 0 Q 205 190 255 390" />
          </g>

          {/* Zone 3 Ring (20–35 mi) */}
          <circle
            cx={cx}
            cy={cy}
            r={168}
            fill={activeZone === 3 ? "rgba(200, 169, 126, 0.12)" : "rgba(200, 169, 126, 0.04)"}
            stroke="#C8A97E"
            strokeWidth={activeZone === 3 ? 2.4 : 1.3}
            strokeDasharray="6 4"
            opacity={isZoneActive(3) ? 0.95 : 0.3}
          />

          {/* Zone 2 Ring (10–20 mi) */}
          <circle
            cx={cx}
            cy={cy}
            r={108}
            fill={activeZone === 2 ? "rgba(245, 158, 11, 0.14)" : "rgba(245, 158, 11, 0.05)"}
            stroke="#F59E0B"
            strokeWidth={activeZone === 2 ? 2.4 : 1.4}
            strokeDasharray="5 3"
            opacity={isZoneActive(2) ? 0.95 : 0.35}
          />

          {/* Zone 1 Ring (0–10 mi) */}
          <circle
            cx={cx}
            cy={cy}
            r={54}
            fill={activeZone === 1 ? "rgba(234, 88, 12, 0.24)" : "rgba(234, 88, 12, 0.12)"}
            stroke="#FF7A00"
            strokeWidth={activeZone === 1 ? 2.6 : 1.8}
            opacity={isZoneActive(1) ? 1 : 0.4}
          />

          {/* Ring Distance Badges */}
          <g fontSize="9" fontWeight="700" fontFamily="monospace">
            <text x={cx} y={cy - 58} fill="#FF8C38" textAnchor="middle">
              ZONE 1 • 10 MI
            </text>
            <text x={cx} y={cy - 113} fill="#F59E0B" textAnchor="middle">
              ZONE 2 • 20 MI
            </text>
            <text x={cx} y={cy - 173} fill="#C8A97E" textAnchor="middle">
              ZONE 3 • 35 MI
            </text>
          </g>

          {/* City Pins */}
          {CITY_PINS.map((city) => {
            const highlighted = activeZone === city.zone;
            const color =
              city.zone === 1 ? "#FF7A00" : city.zone === 2 ? "#F59E0B" : "#C8A97E";
            return (
              <g
                key={city.zip}
                onClick={() => onSelectZip?.(city.zip)}
                className={onSelectZip ? "cursor-pointer" : undefined}
                opacity={isZoneActive(city.zone) ? 1 : 0.4}
              >
                <circle
                  cx={city.x}
                  cy={city.y}
                  r={highlighted ? 5 : 3.5}
                  fill={color}
                  stroke="#080706"
                  strokeWidth="1.5"
                />
                <text
                  x={city.x}
                  y={city.y + (city.dy ?? -7)}
                  fill={highlighted ? "#FFFFFF" : "#D6D3D1"}
                  fontSize={highlighted ? "10" : "9"}
                  fontWeight={highlighted ? "700" : "600"}
                  textAnchor={city.anchor ?? "middle"}
                >
                  {city.name}
                </text>
              </g>
            );
          })}

          {/* Center Hub Pin (60634) */}
          <circle cx={cx} cy={cy} r={22} fill="url(#hubGlow)" />
          <circle
            cx={cx}
            cy={cy}
            r={6.5}
            fill="#EA580C"
            stroke="#FFFFFF"
            strokeWidth="2"
          />
          <rect
            x={cx - 44}
            y={cy + 10}
            width={88}
            height={17}
            rx={4}
            fill="#141210"
            stroke="#FF7A00"
            strokeWidth="1"
          />
          <text
            x={cx}
            y={cy + 21.5}
            fill="#FFFFFF"
            fontSize="9"
            fontWeight="800"
            textAnchor="middle"
          >
            HUB • 60634
          </text>
        </svg>
      </div>

      {/* Compact Ring Legend */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
        <div
          className={`flex items-center justify-between px-3 py-2 rounded-lg border ${
            activeZone === 1
              ? "border-[#FF7A00] bg-[#FF7A00]/10 text-white"
              : "border-stone-800 bg-[#141210] text-stone-300"
          }`}
        >
          <span className="flex items-center gap-2 font-semibold">
            <span className="h-2.5 w-2.5 rounded-full bg-[#FF7A00]" />
            Zone 1 (0–10 mi)
          </span>
          <span className="font-bold text-[#FF8C38]">$25</span>
        </div>

        <div
          className={`flex items-center justify-between px-3 py-2 rounded-lg border ${
            activeZone === 2
              ? "border-amber-500 bg-amber-500/10 text-white"
              : "border-stone-800 bg-[#141210] text-stone-300"
          }`}
        >
          <span className="flex items-center gap-2 font-semibold">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
            Zone 2 (10–20 mi)
          </span>
          <span className="font-bold text-amber-400">$55</span>
        </div>

        <div
          className={`flex items-center justify-between px-3 py-2 rounded-lg border ${
            activeZone === 3
              ? "border-[#C8A97E] bg-[#C8A97E]/10 text-white"
              : "border-stone-800 bg-[#141210] text-stone-300"
          }`}
        >
          <span className="flex items-center gap-2 font-semibold">
            <span className="h-2.5 w-2.5 rounded-full bg-[#C8A97E]" />
            Zone 3 (20–35 mi)
          </span>
          <span className="font-bold text-[#C8A97E]">$85</span>
        </div>
      </div>
    </div>
  );
}
