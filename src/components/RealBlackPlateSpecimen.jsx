"use client";

import React from "react";

/**
 * Compact, realistic die-cut Black Anodized / Etched Metal Label Specimens
 * in varied authentic industrial shapes (circular dial rings, keyhole switch tags,
 * square QR badges, capsule cable tags, octagon & chamfered plates — NOT big rectangles).
 */
export default function RealBlackPlateSpecimen({
  variant = 1,
  className = "",
}) {
  const blackMetal =
    "bg-[#0c0e12] bg-[linear-gradient(155deg,#222732_0%,#0d1015_45%,#080a0d_70%,#1b1f28_100%)] text-zinc-100 shadow-[0_6px_16px_rgba(0,0,0,0.75),inset_0_1px_0_rgba(255,255,255,0.25)]";

  const Hole = ({ className: holePos = "" }) => (
    <span
      className={`w-2 h-2 rounded-full bg-[#161920] border border-zinc-300/90 shadow-inner inline-block shrink-0 ${holePos}`}
    />
  );

  return (
    <div
      className={`w-full h-full p-2 flex items-center justify-center bg-[radial-gradient(circle_at_center,#1b1f27_0%,#0b0d12_100%)] relative overflow-hidden select-none font-mono ${className}`}
    >
      {/* ── 1: Chamfered Square Motor Rating Badge ── */}
      {variant === 1 && (
        <div
          className={`w-28 h-20 rounded-xl border-2 border-zinc-300/90 ${blackMetal} p-1.5 flex flex-col justify-between relative`}
        >
          <div className="flex items-center justify-between border-b border-zinc-400/60 pb-0.5">
            <Hole />
            <span className="text-[7px] font-black tracking-wider text-white">
              MOTOR SPEC
            </span>
            <Hole />
          </div>
          <div className="grid grid-cols-2 gap-0.5 text-[6.5px] my-0.5">
            <div className="bg-zinc-200 text-zinc-950 font-black px-1 rounded-[2px] text-center">
              415V 50Hz
            </div>
            <div className="bg-zinc-200 text-zinc-950 font-black px-1 rounded-[2px] text-center">
              1440 RPM
            </div>
            <div className="border border-zinc-400/60 px-1 text-center text-zinc-200">
              7.5 KW
            </div>
            <div className="border border-zinc-400/60 px-1 text-center text-zinc-200">
              IP55 CL-F
            </div>
          </div>
          <div className="text-[6px] text-center text-zinc-300 tracking-wider">
            IS:325 • SG-101
          </div>
        </div>
      )}

      {/* ── 2: Circular Rotary Valve / Open-Close Ring Plate (Like 2.png!) ── */}
      {variant === 2 && (
        <div
          className={`w-20 h-20 rounded-full border-2 border-zinc-200 ${blackMetal} flex flex-col items-center justify-between p-1.5 relative`}
        >
          <span className="text-[6.5px] font-black tracking-widest text-amber-400">
            ◀ OPEN ▶
          </span>
          <div className="w-8 h-8 rounded-full bg-[#090b0f] border-2 border-zinc-300 shadow-inner flex items-center justify-center">
            <span className="text-[5.5px] text-zinc-400 font-bold">Ø22mm</span>
          </div>
          <span className="text-[6.5px] font-black tracking-widest text-zinc-200">
            ◀ CLOSE ▶
          </span>
        </div>
      )}

      {/* ── 3: Compact Square QR & Serial Matrix Asset Tag ── */}
      {variant === 3 && (
        <div
          className={`w-24 h-20 rounded-xl border-2 border-zinc-300/90 ${blackMetal} p-1.5 flex items-center gap-1.5 relative`}
        >
          <div className="w-11 h-11 bg-white p-0.5 rounded-xs shrink-0 grid grid-cols-5 grid-rows-5 gap-[1px]">
            {[
              1, 1, 1, 0, 1,
              1, 0, 1, 1, 0,
              1, 1, 1, 0, 1,
              0, 1, 0, 1, 1,
              1, 0, 1, 1, 1,
            ].map((c, i) => (
              <div key={i} className={c ? "bg-zinc-950" : "bg-white"} />
            ))}
          </div>
          <div className="flex flex-col justify-between h-full py-0.5 min-w-0">
            <Hole className="self-end" />
            <div>
              <div className="text-[6px] text-zinc-400 font-bold">ASSET ID</div>
              <div className="text-[7.5px] font-black text-white leading-tight">
                SG-8849
              </div>
            </div>
            <div className="h-2.5 bg-white px-0.5 flex items-stretch gap-[1px]">
              {[2, 1, 2, 1, 3, 1, 2, 1].map((w, i) => (
                <span
                  key={i}
                  style={{ flex: w }}
                  className={i % 2 === 0 ? "bg-zinc-950" : "bg-white"}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── 4: Keyhole Push-Button Switch Escutcheon Tag (Like 2.png!) ── */}
      {variant === 4 && (
        <div className="flex items-center gap-2">
          <div
            className={`w-14 h-20 rounded-t-md rounded-b-full border-2 border-zinc-200 ${blackMetal} p-1.5 flex flex-col items-center justify-between`}
          >
            <span className="text-[6.5px] font-black text-white tracking-wider">
              R-PHASE
            </span>
            <div className="w-8 h-8 rounded-full bg-[#090b0f] border-2 border-zinc-300 shadow-inner" />
          </div>
          <div
            className={`w-16 h-16 rounded-lg border-2 border-zinc-200 ${blackMetal} flex flex-col items-center justify-center p-1`}
          >
            <span className="text-[18px] font-black text-white leading-none tracking-tight">
              3R
            </span>
            <span className="text-[5.5px] text-zinc-300 mt-0.5">SS 316 TAG</span>
          </div>
        </div>
      )}

      {/* ── 5: Octagonal Gold-Bevel Heritage Brass & Black Badge ── */}
      {variant === 5 && (
        <div
          className={`w-26 h-18 rounded-2xl border-2 border-amber-400/90 ${blackMetal} p-1.5 flex flex-col items-center justify-between text-center`}
        >
          <div className="w-full flex items-center justify-between">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span className="text-[6px] font-bold text-amber-300 tracking-widest">
              ETCHED BRASS
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          </div>
          <div className="text-[8.5px] font-black text-amber-300 tracking-wider border-y border-amber-400/50 py-0.5 w-full">
            PVDF GOLD
          </div>
          <span className="text-[6px] text-amber-200/80">1.0MM – 3.0MM</span>
        </div>
      )}

      {/* ── 6: Compact 4-Button CNC Membrane Control Cluster ── */}
      {variant === 6 && (
        <div
          className={`w-26 h-20 rounded-xl border-2 border-zinc-400/85 ${blackMetal} p-1.5 flex flex-col justify-between`}
        >
          <div className="text-[6px] font-black text-center text-zinc-200 tracking-wider border-b border-zinc-500/60 pb-0.5">
            3M MEMBRANE OVERLAY
          </div>
          <div className="grid grid-cols-2 gap-1 my-auto">
            <div className="border border-emerald-400/80 rounded-xs py-0.5 text-center text-[6.5px] font-black text-emerald-400">
              ● START
            </div>
            <div className="border border-red-400/80 rounded-xs py-0.5 text-center text-[6.5px] font-black text-red-400">
              ● STOP
            </div>
            <div className="border border-amber-400/80 rounded-xs py-0.5 text-center text-[6.5px] font-black text-amber-300">
              RESET
            </div>
            <div className="border border-zinc-300/80 rounded-xs py-0.5 text-center text-[6.5px] font-black text-white">
              AUTO
            </div>
          </div>
        </div>
      )}

      {/* ── 7: High-Voltage Danger 415V Square Plate (Like 2.png!) ── */}
      {variant === 7 && (
        <div
          className={`w-24 h-20 rounded-lg border-2 border-zinc-200 ${blackMetal} p-1.5 flex flex-col justify-between text-center`}
        >
          <div className="bg-white text-zinc-950 font-black text-[7px] py-0.2 rounded-[2px] tracking-widest">
            ⚡ DANGER ⚡
          </div>
          <div className="text-[8px] font-black text-white leading-tight">
            415 / 460 VOLTS
          </div>
          <div className="text-[7px] font-bold text-amber-400 leading-none">
            खतरा • बिजली
          </div>
          <div className="flex justify-between items-center text-[5.5px] text-zinc-300">
            <Hole />
            <span>IS:2551</span>
            <Hole />
          </div>
        </div>
      )}

      {/* ── 8: Stacked Capsule / Slotted Chamber Tags (Like 2.png!) ── */}
      {variant === 8 && (
        <div className="flex flex-col gap-1.5 items-center">
          <div
            className={`w-28 h-8 rounded-full border-2 border-zinc-200 ${blackMetal} px-2 flex items-center justify-between`}
          >
            <Hole />
            <span className="text-[7px] font-black text-white tracking-wider">
              CABLE CHAMBER
            </span>
            <Hole />
          </div>
          <div
            className={`w-28 h-8 rounded-full border-2 border-zinc-300 ${blackMetal} px-2 flex items-center justify-between`}
          >
            <Hole />
            <span className="text-[6.5px] font-black text-amber-400 tracking-wider">
              BUSBAR CHAMBER
            </span>
            <Hole />
          </div>
        </div>
      )}

      {/* ── 9: Arch-Top Executive Door & Cabin Badge ── */}
      {variant === 9 && (
        <div
          className={`w-28 h-18 rounded-t-2xl rounded-b-md border-2 border-zinc-200 ${blackMetal} p-1.5 flex flex-col items-center justify-between text-center`}
        >
          <span className="text-[6px] text-zinc-400 tracking-widest">
            CABIN NO. 302
          </span>
          <span className="text-[8px] font-black text-white tracking-wider border-y border-zinc-400/60 py-0.5 w-full">
            DIRECTOR CABIN
          </span>
          <div className="w-full flex justify-between items-center px-0.5">
            <Hole />
            <span className="text-[5.5px] text-zinc-300">LASER ETCH</span>
            <Hole />
          </div>
        </div>
      )}

      {/* ── 10: Rounded Pill / Oval Architectural House Plate ── */}
      {variant === 10 && (
        <div
          className={`w-28 h-18 rounded-full border-2 border-zinc-200 ${blackMetal} px-3 py-1.5 flex flex-col items-center justify-center text-center relative`}
        >
          <Hole className="absolute left-2 top-1/2 -translate-y-1/2" />
          <Hole className="absolute right-2 top-1/2 -translate-y-1/2" />
          <span className="text-[6px] text-amber-400 tracking-widest font-bold">
            ACRYLIC & METAL
          </span>
          <span className="text-[8px] font-black text-white tracking-wider">
            PLOT NO. 48/B
          </span>
          <span className="text-[6px] text-zinc-300">WEATHERPROOF</span>
        </div>
      )}

      {/* ── 11: Compact Monthly Inspection Calendar Grid Badge (Like 1.png!) ── */}
      {variant === 11 && (
        <div
          className={`w-26 h-20 rounded-xl border-2 border-zinc-300/90 ${blackMetal} p-1.5 flex flex-col justify-between`}
        >
          <div className="text-[6.5px] font-black text-center text-white tracking-wider">
            INSPECTION TAG
          </div>
          <div className="grid grid-cols-6 border border-zinc-300/80 text-[6px] text-center bg-zinc-200 text-zinc-950 font-black">
            {["J", "F", "M", "A", "M", "J"].map((m, i) => (
              <span key={i} className="border-r last:border-r-0 border-zinc-950/30">
                {m}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-6 border border-zinc-400/60 text-[6px] text-center text-zinc-200">
            {["26", "✓", "✓", "✓", "—", "—"].map((v, i) => (
              <span key={i} className="border-r last:border-r-0 border-zinc-500/40">
                {v}
              </span>
            ))}
          </div>
          <div className="flex justify-between items-center text-[5.5px] text-zinc-300">
            <Hole />
            <span>PUNCH GRID</span>
            <Hole />
          </div>
        </div>
      )}

      {/* ── 12: Multi-Window Slotted Rating & Compliance Plate (Like 2.png!) ── */}
      {variant === 12 && (
        <div
          className={`w-28 h-18 rounded-lg border-2 border-zinc-200 ${blackMetal} p-1.5 flex items-center gap-1 relative`}
        >
          <Hole className="shrink-0" />
          <div className="w-9 h-full flex flex-col gap-1">
            <div className="flex-1 bg-[#060709] border border-zinc-300/80 rounded-[2px] flex items-center justify-center text-[6px] font-bold text-zinc-200">
              CNG
            </div>
            <div className="flex-1 bg-[#060709] border border-zinc-300/80 rounded-[2px] flex items-center justify-center text-[6px] font-bold text-amber-400">
              300B
            </div>
          </div>
          <div className="flex-1 h-full bg-[#060709] border border-zinc-300/80 rounded-[2px] p-1 flex flex-col justify-between text-center">
            <span className="text-[6px] text-zinc-400 font-bold">IS:15490</span>
            <span className="text-[7px] font-black text-white">PESO CERT</span>
            <span className="text-[5.5px] text-zinc-300">0.7–2.0MM</span>
          </div>
          <Hole className="shrink-0" />
        </div>
      )}
    </div>
  );
}
