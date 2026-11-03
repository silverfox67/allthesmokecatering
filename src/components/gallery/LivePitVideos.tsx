"use client";

import React, { useState, useRef } from "react";

export interface LiveVideoItem {
  id: string;
  badge: string;
  title: string;
  tagline: string;
  src: string;
}

interface LivePitVideosProps {
  videos: LiveVideoItem[];
}

export function LivePitVideos({ videos }: LivePitVideosProps) {
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [mutedStates, setMutedStates] = useState<{ [key: string]: boolean }>({
    "vid-1": false,
    "vid-2": false,
    "vid-3": false,
  });

  const handleVideoPlay = (id: string) => {
    setActiveVideoId(id);

    // Pause all other videos so only one plays at a time
    videos.forEach((v) => {
      if (v.id !== id && videoRefs.current[v.id]) {
        videoRefs.current[v.id]?.pause();
      }
    });
  };

  const handleVideoPause = (id: string) => {
    if (activeVideoId === id) {
      setActiveVideoId(null);
    }
  };

  const toggleSound = (id: string) => {
    const video = videoRefs.current[id];
    if (!video) return;

    const newMuted = !video.muted;
    video.muted = newMuted;
    setMutedStates((prev) => ({ ...prev, [id]: newMuted }));

    // If unmuting while paused, prompt play
    if (!newMuted && video.paused) {
      video.play().catch(() => {});
    }
  };

  return (
    <div className="space-y-10">
      {/* Section Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-4 border-b border-zinc-800/80">
        <div className="max-w-2xl space-y-2">
          <div>
            <span className="text-[#C8A97E] text-xs uppercase font-extrabold tracking-widest bg-zinc-900/90 px-3.5 py-1.5 rounded-full border border-[#C8A97E]/30 inline-flex items-center gap-1.5 shadow-sm">
              ★ LIVE-FIRE CAPTURES ★
            </span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-wide">
            Live From the Pit
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Authentic pit captures of prime brisket hand-slicing, slow-rendered au jus resting, and live smoker chamber racks. Remastered directly with our upbeat Chicago blues soundtrack and zero phone background noise.
          </p>
        </div>

        {/* Chicago Blues Soundtrack Status Badge */}
        <div className="flex items-center gap-3 bg-zinc-950/90 border border-amber-500/30 rounded-2xl p-3 sm:p-3.5 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-2.5">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF7A00] opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#FF7A00]" />
            </span>
            <div className="text-left">
              <p className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <span>Chicago Blues Soundtrack</span>
                <span className="text-[10px] text-amber-400 font-mono tracking-tight">
                  [SYNCED]
                </span>
              </p>
              <p className="text-[11px] text-zinc-400">
                100% timed directly inside each video clip
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Video Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {videos.map((vid) => {
          const isMuted = mutedStates[vid.id] ?? false;
          const isActive = activeVideoId === vid.id;

          return (
            <div
              key={vid.id}
              className="rounded-2xl overflow-hidden bg-[#141210] border border-amber-500/25 shadow-[0_15px_35px_-10px_rgba(0,0,0,0.85)] hover:border-amber-500/50 transition-all p-4 sm:p-5 flex flex-col justify-between"
            >
              {/* Top Card Badge Header */}
              <div className="flex items-center justify-between gap-2 pb-3 border-b border-zinc-800/80 mb-3">
                <span className="text-[#C8A97E] text-[11px] uppercase font-extrabold tracking-widest bg-zinc-950 px-2.5 py-1 rounded-full border border-[#C8A97E]/30 inline-flex items-center gap-1 shadow-sm">
                  ★ {vid.badge.toUpperCase()} ★
                </span>
                <span className="text-[11px] font-semibold text-zinc-400 flex items-center gap-1.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isActive ? "bg-amber-400 animate-ping" : "bg-emerald-500"
                    }`}
                  />
                  Pit Video
                </span>
              </div>

              {/* 9:16 Video Container */}
              <div className="relative aspect-[9/16] w-full rounded-xl overflow-hidden bg-black border border-zinc-800/80 shadow-inner group">
                <video
                  ref={(el) => {
                    videoRefs.current[vid.id] = el;
                  }}
                  src={vid.src}
                  controls
                  playsInline
                  preload="metadata"
                  onPlay={() => handleVideoPlay(vid.id)}
                  onPause={() => handleVideoPause(vid.id)}
                  className="w-full h-full object-cover"
                />

                {/* Soundtrack Tag Pill */}
                <div className="absolute top-2.5 right-2.5 pointer-events-none z-10">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-black/80 backdrop-blur-md text-amber-300 px-2 py-0.5 rounded-md border border-amber-500/40 shadow-sm flex items-center gap-1">
                    <span>🎵</span>
                    <span>Chicago Blues</span>
                  </span>
                </div>
              </div>

              {/* Card Bottom Body */}
              <div className="pt-3.5 space-y-2">
                <h3 className="font-display text-base sm:text-lg font-bold text-white tracking-wide">
                  {vid.title}
                </h3>
                <p className="text-xs text-zinc-300 leading-snug">
                  {vid.tagline}
                </p>

                {/* Per-card soundtrack audio quick toggle */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => toggleSound(vid.id)}
                    className="w-full min-h-[40px] px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-amber-500/30 text-[#C8A97E] hover:text-[#FF7A00] text-xs font-bold tracking-wide transition-all flex items-center justify-center gap-2"
                  >
                    {isMuted ? (
                      <>
                        <svg className="w-4 h-4 fill-current text-zinc-400" viewBox="0 0 24 24">
                          <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                        </svg>
                        <span>Unmute Chicago Blues Track</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 fill-current text-amber-400" viewBox="0 0 24 24">
                          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                        </svg>
                        <span>Playing Blues Audio • Tap to Mute</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Attribution */}
      <div className="text-center pt-2">
        <p className="text-[11px] text-zinc-500 tracking-wide">
          Soundtrack: <em>Chicago Blues Pit Shuffle (&quot;Hustle&quot;)</em> by Kevin MacLeod (incompetech.com) • Licensed under Creative Commons: By Attribution 4.0.
        </p>
      </div>
    </div>
  );
}
