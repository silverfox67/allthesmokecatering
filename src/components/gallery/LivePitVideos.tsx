"use client";

import React, { useState, useRef, useEffect } from "react";

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
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.4; // Pleasant balanced background volume
    }
  }, []);

  const toggleMasterAudio = () => {
    if (!audioRef.current) return;

    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlayingAudio(true))
        .catch((err) => {
          console.warn("Audio autoplay blocked by browser policy:", err);
          setIsPlayingAudio(false);
        });
    }
  };

  const handleVideoPlay = (id: string) => {
    setActiveVideoId(id);

    // Pause all other videos so only one plays at a time
    videos.forEach((v) => {
      if (v.id !== id && videoRefs.current[v.id]) {
        videoRefs.current[v.id]?.pause();
      }
    });

    // Start upbeat Chicago blues if not already playing
    if (audioRef.current && audioRef.current.paused) {
      audioRef.current
        .play()
        .then(() => setIsPlayingAudio(true))
        .catch(() => {});
    }
  };

  const handleVideoPause = (id: string) => {
    if (activeVideoId === id) {
      setActiveVideoId(null);
    }
  };

  return (
    <div className="space-y-10">
      {/* Background Audio Player */}
      <audio
        ref={audioRef}
        src="/audio/chicago-blues-shuffle.mp3"
        loop
        preload="auto"
        onPlay={() => setIsPlayingAudio(true)}
        onPause={() => setIsPlayingAudio(false)}
      />

      {/* Section Header with Soundtrack Control Bar */}
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
            Authentic pit captures of prime brisket hand-slicing, slow-rendered au jus resting, and live smoker chamber racks. Raw phone background noise removed.
          </p>
        </div>

        {/* Chicago Blues Audio Bar */}
        <div className="flex flex-wrap items-center gap-3 bg-zinc-950/90 border border-amber-500/30 rounded-2xl p-3 sm:p-3.5 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-2.5">
            <span className="flex h-3 w-3 relative">
              {isPlayingAudio && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF7A00] opacity-75" />
              )}
              <span
                className={`relative inline-flex rounded-full h-3 w-3 ${
                  isPlayingAudio ? "bg-[#FF7A00]" : "bg-zinc-600"
                }`}
              />
            </span>
            <div className="text-left">
              <p className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <span>Chicago Blues Pit Shuffle</span>
                {isPlayingAudio && (
                  <span className="text-[10px] text-amber-400 font-mono tracking-tight animate-pulse">
                    [ON AIR]
                  </span>
                )}
              </p>
              <p className="text-[11px] text-zinc-400">
                {isPlayingAudio
                  ? "Playing authentic upbeat blues groove"
                  : "Tap to hear our smokehouse soundtrack"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={toggleMasterAudio}
            className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-2 ${
              isPlayingAudio
                ? "bg-amber-500/20 text-[#FF7A00] border border-[#FF7A00]/50 hover:bg-amber-500/30 shadow-[0_0_12px_rgba(255,122,0,0.25)]"
                : "bg-gradient-to-r from-[#EA580C] to-[#C2410C] hover:from-[#FF7A00] hover:to-[#EA580C] text-white shadow-[0_0_15px_rgba(234,88,12,0.4)] hover:scale-105 active:scale-95"
            }`}
            aria-label={isPlayingAudio ? "Mute Chicago Blues audio" : "Play Chicago Blues audio"}
          >
            {isPlayingAudio ? (
              <>
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
                <span>Mute Blues</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                <span>Play Blues Audio</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 3 Video Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {videos.map((vid) => (
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
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Pit Video
              </span>
            </div>

            {/* 9:16 Video Container (Muted to strip phone mic noise) */}
            <div className="relative aspect-[9/16] w-full rounded-xl overflow-hidden bg-black border border-zinc-800/80 shadow-inner group">
              <video
                ref={(el) => {
                  videoRefs.current[vid.id] = el;
                }}
                src={vid.src}
                controls
                muted
                playsInline
                preload="metadata"
                onPlay={() => handleVideoPlay(vid.id)}
                onPause={() => handleVideoPause(vid.id)}
                className="w-full h-full object-cover"
              />

              {/* Mute Overlay Badge */}
              <div className="absolute top-2.5 right-2.5 pointer-events-none z-10">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-black/75 backdrop-blur-md text-amber-300 px-2 py-0.5 rounded-md border border-amber-500/30">
                  {isPlayingAudio ? "🎵 Blues Soundtrack Active" : "🔇 Phone Mic Muted"}
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

              {/* Per-card soundtrack toggle */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={toggleMasterAudio}
                  className="w-full min-h-[38px] px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-amber-500/25 text-[#C8A97E] hover:text-[#FF7A00] text-xs font-semibold tracking-wide transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                  </svg>
                  <span>
                    {isPlayingAudio ? "Mute Chicago Blues" : "Play Chicago Blues Track"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Legal Attribution Badge for CC BY 4.0 */}
      <div className="text-center pt-2">
        <p className="text-[11px] text-zinc-500 tracking-wide">
          Soundtrack: <em>Chicago Blues Pit Shuffle (&quot;Hustle&quot;)</em> by Kevin MacLeod (incompetech.com) • Licensed under Creative Commons: By Attribution 4.0.
        </p>
      </div>
    </div>
  );
}
