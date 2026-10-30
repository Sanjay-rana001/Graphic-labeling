"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function MetalScrollToTop() {
  const [visible, setVisible] = useState(false);
  const [scrollPct, setScrollPct] = useState(0);
  const [isLaunching, setIsLaunching] = useState(false);

  useEffect(() => {
    let ticking = false;

    const updateScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop;
      const docHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const pct =
        docHeight > 0
          ? Math.min(100, Math.max(0, Math.round((y / docHeight) * 100)))
          : 0;

      setVisible(y > 240);
      setScrollPct(pct);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScroll);
        ticking = true;
      }
    };

    updateScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleScrollTop = () => {
    setIsLaunching(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => setIsLaunching(false), 600);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.9 }}
          animate={{
            opacity: 1,
            y: isLaunching ? -10 : 0,
            scale: 1,
          }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 340, damping: 26 }}
          className="fixed bottom-4 right-3.5 sm:bottom-6 sm:right-6 z-50 flex items-center group select-none"
        >
          {/* ═════════════════════════════════════════════════════════════
              MOBILE VIEW (< 640px): Clean, Simple, Compact Metallic Button
             ═════════════════════════════════════════════════════════════ */}
          <button
            type="button"
            onClick={handleScrollTop}
            aria-label="Scroll to top"
            className="sm:hidden relative w-10 h-10 rounded-xl bg-[#0f131a]/95 backdrop-blur-md border border-amber-500/45 shadow-[0_8px_20px_rgba(0,0,0,0.45)] flex items-center justify-center text-amber-400 active:scale-90 active:bg-amber-500 active:text-zinc-950 transition-all overflow-hidden cursor-pointer"
          >
            {/* Bottom Thin Gold Scroll Progress Line */}
            <span
              className="absolute bottom-0 left-0 h-[2.5px] bg-gradient-to-r from-amber-500 to-yellow-300 transition-all duration-150"
              style={{ width: `${scrollPct}%` }}
              aria-hidden="true"
            />
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              className="relative z-10"
            >
              <path
                d="M6.5 14L12 8.5L17.5 14"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* ═════════════════════════════════════════════════════════════
              DESKTOP / TABLET VIEW (>= 640px): Riveted Metal Label Tag
             ═════════════════════════════════════════════════════════════ */}
          <div className="hidden sm:flex items-center">
            {/* Slide-Out Stamped Metal Spec Tab on Hover */}
            <div className="flex items-center mr-2 pointer-events-none overflow-hidden">
              <div className="translate-x-6 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 ease-out px-3 py-1.5 rounded-lg bg-[#0d1118]/95 border border-amber-500/45 shadow-[0_8px_24px_rgba(0,0,0,0.45)] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <div className="text-left">
                  <div className="text-[9.5px] font-mono font-black uppercase tracking-[0.16em] text-amber-400 leading-none">
                    BACK TO TOP
                  </div>
                  <div className="text-[8.5px] font-mono text-zinc-400 tracking-wider mt-0.5 leading-none">
                    SS-304 • GAUGE {scrollPct}%
                  </div>
                </div>
              </div>
            </div>

            {/* Main Riveted Industrial Metal Tag / Nameplate Button */}
            <button
              type="button"
              onClick={handleScrollTop}
              aria-label="Scroll to top"
              className="relative w-[56px] rounded-xl bg-gradient-to-b from-[#1a202c] via-[#0f131a] to-[#090b10] border-[1.5px] border-amber-500/45 group-hover:border-amber-400 shadow-[0_14px_34px_-6px_rgba(0,0,0,0.65),inset_0_1px_0_rgba(255,255,255,0.18)] p-1.5 pt-2 pb-1.5 flex flex-col items-center cursor-pointer overflow-hidden transition-all duration-300 group-hover:-translate-y-1 active:scale-95"
            >
              {/* Bottom-to-Top Molten 24K Gold Sweep Fill Animation on Hover */}
              <span
                className="absolute inset-0 bg-gradient-to-t from-amber-500 via-amber-400 to-yellow-300 translate-y-[102%] group-hover:translate-y-0 transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] z-0 pointer-events-none"
                aria-hidden="true"
              />

              {/* Brushed Anodized Metal Hairline Texture */}
              <span
                className="absolute inset-0 opacity-[0.07] group-hover:opacity-[0.12] pointer-events-none bg-[repeating-linear-gradient(90deg,transparent,transparent_1px,#ffffff_1px,#ffffff_2px)] z-[1]"
                aria-hidden="true"
              />

              {/* Live Vertical Scroll-Depth Laser Gauge Bar (Left Edge) */}
              <span
                className="absolute left-0 bottom-0 w-[3px] bg-gradient-to-t from-amber-500 via-amber-400 to-yellow-200 transition-all duration-150 z-[2]"
                style={{ height: `${scrollPct}%` }}
                aria-hidden="true"
              />

              {/* Top Die-Cut Metal Tag Mounting Slot / Hole */}
              <div className="relative z-10 w-5 h-1.5 rounded-full bg-[#05070a] border border-amber-500/40 group-hover:border-zinc-900/50 shadow-inner mb-1.5 flex items-center justify-center">
                <span className="w-2.5 h-[1.5px] rounded-full bg-amber-400/50 group-hover:bg-amber-950/60" />
              </div>

              {/* 4 Corner Stainless-Steel Slotted Rivets (Rotate on Hover) */}
              {[
                "top-1.5 left-1.5",
                "top-1.5 right-1.5",
                "bottom-1.5 left-1.5",
                "bottom-1.5 right-1.5",
              ].map((pos, idx) => (
                <span
                  key={idx}
                  className={`absolute ${pos} w-2 h-2 rounded-full bg-gradient-to-br from-zinc-200 via-zinc-400 to-zinc-700 border border-black/70 shadow-2xs flex items-center justify-center transition-transform duration-500 group-hover:rotate-90 z-10 pointer-events-none`}
                >
                  <span className="w-1.5 h-[1px] bg-zinc-900/80 rotate-45" />
                </span>
              ))}

              {/* Inner Etched Metal Plate Chamber */}
              <div className="relative z-10 w-full rounded-lg bg-[#0b0e14]/90 group-hover:bg-zinc-950/90 border border-white/10 group-hover:border-zinc-950/40 py-1.5 px-1 flex flex-col items-center justify-center overflow-hidden transition-colors duration-500">
                {/* Subtle Etched Measurement Ruler Ticks on Right */}
                <div className="absolute right-1 inset-y-1 flex flex-col justify-between opacity-35 pointer-events-none">
                  <span className="w-1 h-[1px] bg-amber-400" />
                  <span className="w-1.5 h-[1px] bg-amber-400" />
                  <span className="w-1 h-[1px] bg-amber-400" />
                  <span className="w-1.5 h-[1px] bg-amber-400" />
                  <span className="w-1 h-[1px] bg-amber-400" />
                </div>

                {/* Horizontal Laser Engraving Scan Line */}
                <motion.span
                  animate={{ y: [-8, 10, -8] }}
                  transition={{
                    duration: 2.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-x-1 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/80 to-transparent pointer-events-none"
                />

                {/* Custom SVG Engraved Metal Chevron & Plate Emblem */}
                <motion.svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  animate={{ y: [1, -2.5, 1] }}
                  transition={{
                    duration: 1.6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="text-amber-400 group-hover:text-amber-300 drop-shadow-[0_0_6px_rgba(245,158,11,0.45)]"
                >
                  <path
                    d="M6 11L12 5L18 11"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M7.5 16.5L12 12L16.5 16.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeOpacity="0.75"
                  />
                  <line
                    x1="7"
                    y1="20"
                    x2="17"
                    y2="20"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeOpacity="0.55"
                  />
                </motion.svg>
              </div>

              {/* Bottom Stamped Brass Rating Strip ("SG • TOP" / Scroll %) */}
              <div className="relative z-10 mt-1 w-full rounded bg-gradient-to-r from-amber-500/20 via-yellow-400/25 to-amber-500/20 group-hover:from-zinc-950 group-hover:via-zinc-900 group-hover:to-zinc-950 border border-amber-400/35 group-hover:border-zinc-950 py-0.5 px-1 text-center transition-colors duration-500">
                <span className="block font-mono font-black text-[8.5px] tracking-[0.14em] uppercase text-amber-300 group-hover:text-amber-400 leading-tight">
                  <span className="group-hover:hidden">{scrollPct}% ▲</span>
                  <span className="hidden group-hover:inline">TOP ▲</span>
                </span>
              </div>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
