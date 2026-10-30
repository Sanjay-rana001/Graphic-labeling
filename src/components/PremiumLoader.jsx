"use client";

import { useState, useEffect } from "react";

export function isScreenLoaderEnabled() {
  if (typeof window === "undefined") return true;
  try {
    const direct = localStorage.getItem("sourav_screen_loader");
    if (direct === "false") return false;
    if (direct === "true") return true;

    const cached = localStorage.getItem("sourav_studio_mode_settings");
    if (cached) {
      const parsed = JSON.parse(cached);
      if (typeof parsed?.screenLoaderOn === "boolean") {
        return parsed.screenLoaderOn;
      }
    }

    if (typeof document !== "undefined" && document.cookie) {
      if (document.cookie.includes("sourav_screen_loader=false")) return false;
    }
  } catch (e) {}
  return true;
}

export default function PremiumLoader({
  label = "Initializing Studio",
  sublabel = "Sourav Graphic & Metal Label",
  forcePreview = false,
}) {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    if (!forcePreview) {
      setEnabled(isScreenLoaderEnabled());
    }
  }, [forcePreview]);

  if (!forcePreview && !enabled) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-[#08090d] text-white flex flex-col items-center justify-center p-6 select-none overflow-hidden">
      {/* Ambient Champagne Gold & Obsidian Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute inset-0 opacity-[0.04] bg-[repeating-linear-gradient(to_right,transparent,transparent_1px,#ffffff_1px,#ffffff_2px)]" />
      </div>

      {/* Center Metallic Emblem & Laser Ring */}
      <div className="relative flex flex-col items-center z-10">
        <div className="relative w-28 h-28 flex items-center justify-center mb-7">
          {/* Outer Rotating Dashed Precision Ring */}
          <div className="absolute inset-0 rounded-full border border-amber-500/25 border-dashed animate-[spin_10s_linear_infinite]" />

          {/* Middle Fast-Spinning Gold Laser Arc */}
          <div className="absolute inset-1.5 rounded-full border-2 border-transparent border-t-amber-400 border-r-amber-500/50 animate-spin shadow-[0_0_25px_rgba(245,158,11,0.3)]" />

          {/* Counter-Rotating Inner Ring */}
          <div className="absolute inset-4 rounded-full border border-zinc-700/80 border-b-amber-300/70 animate-[spin_2.4s_linear_infinite_reverse]" />

          {/* Core Metallic Billet Badge */}
          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-zinc-800 via-zinc-900 to-black border border-amber-500/30 shadow-2xl flex items-center justify-center overflow-hidden">
            {/* Scanning Laser Line */}
            <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_10px_#f59e0b] animate-[bounce_1.8s_ease-in-out_infinite]" />
            <span className="font-black text-lg tracking-tighter bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500 bg-clip-text text-transparent">
              SG
            </span>
          </div>
        </div>

        {/* Brand Title */}
        <h2 className="text-lg sm:text-xl font-black tracking-wider uppercase bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent mb-1 text-center">
          {sublabel}
        </h2>

        {/* Dynamic Status Pill */}
        <div className="flex items-center gap-2 text-xs font-mono text-amber-400/90 tracking-widest uppercase mt-1 mb-6">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span>{label}</span>
        </div>

        {/* Sleek Liquid Gold Progress Bar */}
        <div className="w-56 sm:w-64 h-1.5 rounded-full bg-zinc-900 border border-zinc-800 overflow-hidden p-0.5 shadow-inner">
          <div className="h-full w-full rounded-full bg-gradient-to-r from-amber-600 via-amber-400 to-yellow-300 animate-pulse origin-left" />
        </div>

        {/* Bottom Precision Spec Caption */}
        <p className="mt-4 text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500">
          Industrial Nameplates • SS 304 • Anodized Aluminium
        </p>
      </div>
    </div>
  );
}
