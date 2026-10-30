"use client";

import React from "react";

/**
 * Renders authentic, razor-sharp Industrial Black Anodized / Etched Metal Plate
 * specimens with real technical tables, data boxes, serial grids, barcodes/QR,
 * and corner mounting holes — zero AI-generated background scenery.
 */
export default function RealBlackPlateSpecimen({
  variant = 1,
  compact = false,
  className = "",
}) {
  // Subtle horizontal brushed black anodized metallic texture
  const blackAnodizedBg =
    "bg-[#0d0f13] bg-[linear-gradient(180deg,#161920_0%,#0b0d10_48%,#13161c_100%)] text-zinc-100";

  const CornerHoles = ({ gold = false }) => (
    <>
      {[
        "top-2 left-2",
        "top-2 right-2",
        "bottom-2 left-2",
        "bottom-2 right-2",
      ].map((pos, i) => (
        <span
          key={i}
          className={`absolute ${pos} w-2.5 h-2.5 rounded-full bg-[#050608] border ${
            gold ? "border-amber-400/80" : "border-zinc-300/80"
          } shadow-inner z-20 flex items-center justify-center`}
        >
          <span className="w-1 h-1 rounded-full bg-zinc-700/60" />
        </span>
      ))}
    </>
  );

  return (
    <div
      className={`w-full h-full p-2.5 sm:p-3 flex items-center justify-center bg-[#07080b] relative overflow-hidden select-none ${className}`}
    >
      {/* Subtle metallic reflection sweep */}
      <div className="absolute inset-0 bg-[linear-gradient(125deg,transparent_25%,rgba(255,255,255,0.04)_45%,transparent_65%)] pointer-events-none" />

      {/* ── VARIANT 1: Black Anodized Motor / Engine Rating Plate ── */}
      {variant === 1 && (
        <div
          className={`w-full h-full rounded-lg border-2 border-zinc-300/85 ${blackAnodizedBg} p-2 flex flex-col justify-between relative shadow-2xl font-mono`}
        >
          <CornerHoles />
          <div className="border border-zinc-300/75 rounded-xs p-1.5 h-full flex flex-col justify-between">
            <div className="text-center border-b border-zinc-300/75 pb-1">
              <div className="text-[9px] font-black tracking-[0.18em] text-white uppercase">
                THREE PHASE INDUCTION MOTOR
              </div>
              <div className="text-[7px] text-zinc-300 tracking-widest">
                SOURAV GRAPHIC INDUSTRIAL RATING PLATE • IS:325 / IEC 60034
              </div>
            </div>

            <div className="grid grid-cols-2 gap-1 my-1 text-[7.5px]">
              <div className="flex items-center justify-between border border-zinc-300/60 px-1 py-0.5">
                <span className="text-zinc-300 font-bold">MODEL</span>
                <span className="bg-zinc-200 text-zinc-950 font-black px-1 rounded-[1px]">
                  SG-132M-4
                </span>
              </div>
              <div className="flex items-center justify-between border border-zinc-300/60 px-1 py-0.5">
                <span className="text-zinc-300 font-bold">KW / HP</span>
                <span className="bg-zinc-200 text-zinc-950 font-black px-1 rounded-[1px]">
                  7.5 / 10.0
                </span>
              </div>
              <div className="flex items-center justify-between border border-zinc-300/60 px-1 py-0.5">
                <span className="text-zinc-300 font-bold">VOLTS</span>
                <span className="bg-zinc-200 text-zinc-950 font-black px-1 rounded-[1px]">
                  415V ±10%
                </span>
              </div>
              <div className="flex items-center justify-between border border-zinc-300/60 px-1 py-0.5">
                <span className="text-zinc-300 font-bold">RPM / HZ</span>
                <span className="bg-zinc-200 text-zinc-950 font-black px-1 rounded-[1px]">
                  1440 / 50Hz
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-zinc-300/75 pt-1 text-[7px] text-zinc-200">
              <span>SER. NO: SG/2026/08419</span>
              <span className="font-bold">IP55 • INS. CL. F</span>
            </div>
          </div>
        </div>
      )}

      {/* ── VARIANT 2: Black Chemical-Etched Compressor / Machine Data Plate ── */}
      {variant === 2 && (
        <div
          className={`w-full h-full rounded-lg border-2 border-zinc-300/85 ${blackAnodizedBg} p-2 flex flex-col justify-between relative shadow-2xl font-mono`}
        >
          <CornerHoles />
          <div className="border border-zinc-300/75 h-full p-1.5 flex flex-col justify-between">
            <div className="bg-zinc-200 text-zinc-950 text-center py-0.5 font-black text-[8.5px] tracking-[0.16em] uppercase">
              COMPRESSOR SPECIFICATION PLATE
            </div>

            <div className="space-y-1 my-1 text-[7.5px]">
              {[
                ["MACHINE NO.", "CMP-9042-IND"],
                ["MAX PRESS.", "12.5 KG/CM² (180 PSI)"],
                ["DISPLACEMENT", "48.5 CFM • 1750 RPM"],
                ["HYDRO TEST", "19.0 BAR • CERTIFIED"],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="grid grid-cols-12 items-center border-b border-zinc-400/50 pb-0.5"
                >
                  <span className="col-span-5 text-zinc-300 font-bold">{k}</span>
                  <span className="col-span-7 bg-zinc-200/95 text-zinc-950 font-black px-1.5 py-0.2 rounded-[1px] text-right">
                    {v}
                  </span>
                </div>
              ))}
            </div>

            <div className="text-[6.5px] text-center text-zinc-300 tracking-widest uppercase">
              DEEP CHEMICAL ETCHED • SOLVENT & WEATHER PROOF
            </div>
          </div>
        </div>
      )}

      {/* ── VARIANT 3: Black Anodized QR Code, Barcode & Serial Asset Tag ── */}
      {variant === 3 && (
        <div
          className={`w-full h-full rounded-lg border-2 border-zinc-300/85 ${blackAnodizedBg} p-2 flex flex-col justify-between relative shadow-2xl font-mono`}
        >
          {/* Left & Right Center Rivet Holes */}
          <span className="absolute left-2 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#050608] border border-zinc-300/85" />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#050608] border border-zinc-300/85" />

          <div className="border border-zinc-300/75 h-full px-4 py-1.5 flex items-center justify-between gap-2.5">
            {/* Crisp Simulated QR Matrix */}
            <div className="w-16 h-16 bg-white p-1 rounded-xs shrink-0 grid grid-cols-5 grid-rows-5 gap-0.5">
              {[
                1, 1, 1, 0, 1,
                1, 0, 1, 1, 0,
                1, 1, 1, 0, 1,
                0, 1, 0, 1, 1,
                1, 0, 1, 1, 1,
              ].map((cell, idx) => (
                <div
                  key={idx}
                  className={cell ? "bg-zinc-950" : "bg-white"}
                />
              ))}
            </div>

            <div className="flex-1 min-w-0 flex flex-col justify-between h-full py-0.5">
              <div>
                <div className="text-[7px] text-zinc-300 tracking-widest uppercase font-bold">
                  PROPERTY ASSET ID TAG
                </div>
                <div className="text-[10px] font-black text-white tracking-wider">
                  UID: SG-884920-A
                </div>
              </div>

              {/* Barcode Bars */}
              <div className="h-5 bg-white px-1.5 py-0.5 flex items-stretch justify-between gap-[1.5px] rounded-[1px]">
                {[2, 1, 3, 1, 2, 1, 4, 1, 2, 2, 1, 3, 1, 2, 1, 3, 2].map(
                  (w, idx) => (
                    <span
                      key={idx}
                      style={{ flex: w }}
                      className={idx % 2 === 0 ? "bg-zinc-950" : "bg-white"}
                    />
                  )
                )}
              </div>

              <div className="text-[6.5px] text-zinc-300 flex justify-between">
                <span>ANODIZED ALU 0.5MM</span>
                <span>LASER MATRIX</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── VARIANT 4: SS 304 / 316 Black-Filled Etched Process & Valve Plate ── */}
      {variant === 4 && (
        <div
          className={`w-full h-full rounded-lg border-2 border-zinc-200 ${blackAnodizedBg} p-2 flex flex-col justify-between relative shadow-2xl font-mono`}
        >
          <CornerHoles />
          <div className="border border-zinc-300/80 h-full p-1.5 flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-zinc-300/75 pb-1">
              <span className="text-[8px] font-black text-white tracking-wider">
                SS 316L VALVE SPECIFICATION
              </span>
              <span className="px-1 py-0.2 bg-zinc-200 text-zinc-950 text-[7px] font-black">
                PN40
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1 my-1 text-[7px] text-center">
              <div className="border border-zinc-300/60 p-1">
                <div className="text-zinc-400">SIZE / DN</div>
                <div className="text-white font-black text-[8.5px]">DN 100 (4&quot;)</div>
              </div>
              <div className="border border-zinc-300/60 p-1">
                <div className="text-zinc-400">BODY / TRIM</div>
                <div className="text-white font-black text-[8.5px]">CF8M / SS316</div>
              </div>
              <div className="border border-zinc-300/60 p-1">
                <div className="text-zinc-400">MAX TEMP</div>
                <div className="text-white font-black text-[8.5px]">425 °C</div>
              </div>
            </div>

            <div className="flex items-center justify-between text-[7px] bg-zinc-200 text-zinc-950 px-1.5 py-0.5 font-black">
              <span>TAG NO: HV-2041-B</span>
              <span>HEAT NO: 94820</span>
            </div>
          </div>
        </div>
      )}

      {/* ── VARIANT 5: Black & Gold Etched Brass / PVDF Name Board ── */}
      {variant === 5 && (
        <div
          className={`w-full h-full rounded-lg border-2 border-amber-400/90 ${blackAnodizedBg} p-2 flex flex-col justify-between relative shadow-2xl font-mono text-amber-300`}
        >
          <CornerHoles gold />
          <div className="border border-amber-400/75 h-full p-1.5 flex flex-col justify-between">
            <div className="text-center border-b border-amber-400/70 pb-1">
              <div className="text-[8.5px] font-black tracking-[0.2em] text-amber-300 uppercase">
                HERITAGE BRASS & PVDF GOLD PLATE
              </div>
              <div className="text-[6.5px] text-amber-200/80 tracking-widest">
                DEEP ETCHED • BLACK DUCO ENAMEL INFILL
              </div>
            </div>

            <div className="grid grid-cols-2 gap-1 my-1 text-[7.5px]">
              <div className="border border-amber-400/60 px-1.5 py-0.5 flex justify-between">
                <span>ALLOY</span>
                <strong className="text-amber-200">BRASS C26000</strong>
              </div>
              <div className="border border-amber-400/60 px-1.5 py-0.5 flex justify-between">
                <span>GAUGE</span>
                <strong className="text-amber-200">1.5MM / 3.0MM</strong>
              </div>
              <div className="border border-amber-400/60 px-1.5 py-0.5 flex justify-between">
                <span>COATING</span>
                <strong className="text-amber-200">PU LACQUER</strong>
              </div>
              <div className="border border-amber-400/60 px-1.5 py-0.5 flex justify-between">
                <span>MOUNT</span>
                <strong className="text-amber-200">BRASS STUDS</strong>
              </div>
            </div>

            <div className="text-[7px] text-center bg-amber-400 text-zinc-950 font-black py-0.5 tracking-widest">
              SOURAV GRAPHIC • PRECISION ETCHING
            </div>
          </div>
        </div>
      )}

      {/* ── VARIANT 6: Matte Black Polycarbonate Control Panel Fascia Overlay ── */}
      {variant === 6 && (
        <div
          className={`w-full h-full rounded-lg border-2 border-zinc-400/80 ${blackAnodizedBg} p-2 flex flex-col justify-between relative shadow-2xl font-mono`}
        >
          <div className="border border-zinc-400/70 h-full p-1.5 flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-zinc-500/60 pb-1">
              <span className="text-[8px] font-black tracking-wider text-white">
                CNC CONTROL FASCIA OVERLAY
              </span>
              <span className="text-[6.5px] px-1 bg-zinc-800 border border-zinc-500 text-zinc-200">
                3M 467MP
              </span>
            </div>

            <div className="grid grid-cols-4 gap-1.5 my-1 items-center text-center text-[7px]">
              <div className="border border-zinc-400/70 rounded-xs p-1 flex flex-col items-center">
                <span className="w-3 h-3 rounded-full border-2 border-emerald-400 mb-0.5" />
                <span className="font-bold text-white">START</span>
              </div>
              <div className="border border-zinc-400/70 rounded-xs p-1 flex flex-col items-center">
                <span className="w-3 h-3 rounded-full border-2 border-red-400 mb-0.5" />
                <span className="font-bold text-white">STOP</span>
              </div>
              <div className="border border-zinc-400/70 rounded-xs p-1 flex flex-col items-center">
                <span className="w-3 h-3 rounded-full border-2 border-amber-400 mb-0.5" />
                <span className="font-bold text-white">RESET</span>
              </div>
              <div className="border border-zinc-400/70 rounded-xs p-1 flex flex-col items-center">
                <span className="w-3 h-3 rounded-xs border border-zinc-300 bg-zinc-950 mb-0.5" />
                <span className="font-bold text-white">RPM</span>
              </div>
            </div>

            <div className="text-[6.5px] text-zinc-300 flex justify-between">
              <span>POLYCARBONATE LEXAN 0.25MM</span>
              <span>SUB-SURFACE PRINT</span>
            </div>
          </div>
        </div>
      )}

      {/* ── VARIANT 7: Black & Silver Screen Printed Safety / Electrical Plate ── */}
      {variant === 7 && (
        <div
          className={`w-full h-full rounded-lg border-2 border-zinc-200 ${blackAnodizedBg} p-2 flex flex-col justify-between relative shadow-2xl font-mono`}
        >
          <CornerHoles />
          <div className="border-2 border-zinc-200 h-full p-1.5 flex flex-col justify-between text-center">
            <div className="bg-white text-zinc-950 py-0.5 font-black text-[9px] tracking-[0.2em] uppercase">
              ⚡ DANGER • 415 VOLTS ⚡
            </div>

            <div className="my-auto space-y-0.5">
              <div className="text-[8.5px] font-black text-white tracking-wider uppercase">
                ISOLATE MAIN SUPPLY BEFORE
              </div>
              <div className="text-[8.5px] font-black text-white tracking-wider uppercase">
                REMOVING TERMINAL COVER
              </div>
              <div className="text-[7px] text-zinc-300">
                HIGH VOLTAGE SWITCHGEAR PANEL • IS:2551
              </div>
            </div>

            <div className="border-t border-zinc-400/70 pt-0.5 text-[6.5px] text-zinc-300 flex justify-between px-1">
              <span>SCREEN PRINTED ALUMINIUM</span>
              <span>UV CURED INK</span>
            </div>
          </div>
        </div>
      )}

      {/* ── VARIANT 8: Matte Black Laser-Engraved Gearbox / Pump Tag ── */}
      {variant === 8 && (
        <div
          className={`w-full h-full rounded-lg border-2 border-zinc-300/80 ${blackAnodizedBg} p-2 flex flex-col justify-between relative shadow-2xl font-mono`}
        >
          <CornerHoles />
          <div className="border border-zinc-400/75 h-full p-1.5 flex flex-col justify-between">
            <div className="flex justify-between items-center border-b border-zinc-400/70 pb-0.5">
              <span className="text-[8px] font-black text-white tracking-wider">
                HELICAL GEARBOX RATING TAG
              </span>
              <span className="text-[7px] font-bold text-zinc-300">ANO-ETCH</span>
            </div>

            <div className="grid grid-cols-2 gap-1 text-[7.5px] my-1">
              <div className="border border-zinc-400/60 px-1 py-0.5">
                <span className="text-zinc-400 block text-[6px]">TYPE / SIZE</span>
                <strong className="text-white">H3SH-11 • RATIO 35.5:1</strong>
              </div>
              <div className="border border-zinc-400/60 px-1 py-0.5">
                <span className="text-zinc-400 block text-[6px]">LUBRICATION</span>
                <strong className="text-white">ISO VG 320 SYNTHETIC</strong>
              </div>
            </div>

            <div className="bg-zinc-200 text-zinc-950 px-1.5 py-0.5 text-[7px] font-black flex justify-between">
              <span>SERIAL NO: GBX-2026-9104</span>
              <span>WT: 145 KG</span>
            </div>
          </div>
        </div>
      )}

      {/* ── VARIANT 9: Black Anodized Architectural / Cabin Door Plate ── */}
      {variant === 9 && (
        <div
          className={`w-full h-full rounded-lg border-2 border-zinc-300 ${blackAnodizedBg} p-2.5 flex flex-col justify-between relative shadow-2xl font-sans`}
        >
          <CornerHoles />
          <div className="border border-zinc-300/80 h-full p-2 flex flex-col items-center justify-center text-center">
            <div className="text-[7px] font-mono tracking-[0.25em] text-zinc-400 uppercase mb-1">
              EXECUTIVE SUITE • 302
            </div>
            <div className="text-xs sm:text-sm font-black tracking-[0.14em] text-white uppercase border-y border-zinc-400/60 py-1 px-3">
              DIRECTOR OF OPERATIONS
            </div>
            <div className="text-[7.5px] font-mono text-zinc-300 tracking-widest mt-1 uppercase">
              BLACK ANODIZED 3.0MM • LASER ENGRAVED
            </div>
          </div>
        </div>
      )}

      {/* ── VARIANT 10: Black Cast Acrylic & Metallic Sign Board ── */}
      {variant === 10 && (
        <div
          className={`w-full h-full rounded-lg border-2 border-zinc-200 ${blackAnodizedBg} p-2.5 flex flex-col justify-between relative shadow-2xl`}
        >
          <CornerHoles />
          <div className="border-2 border-double border-zinc-300/80 h-full p-2 flex flex-col items-center justify-center text-center">
            <div className="text-[7px] font-mono tracking-[0.22em] text-zinc-300 uppercase">
              ARCHITECTURAL SIGN BOARD
            </div>
            <div className="text-xs sm:text-sm font-black tracking-[0.16em] text-white uppercase mt-0.5">
              APEX INDUSTRIAL PARK
            </div>
            <div className="mt-1 px-2 py-0.5 bg-zinc-200 text-zinc-950 font-mono font-black text-[7px] tracking-widest">
              PLOT NO. 48/B • PHASE II, MIDC
            </div>
          </div>
        </div>
      )}

      {/* ── VARIANT 11: Black Maintenance & Monthly Inspection Punch Grid Tag ── */}
      {variant === 11 && (
        <div
          className={`w-full h-full rounded-lg border-2 border-zinc-300/85 ${blackAnodizedBg} p-2 flex flex-col justify-between relative shadow-2xl font-mono`}
        >
          <CornerHoles />
          <div className="border border-zinc-300/75 h-full p-1.5 flex flex-col justify-between">
            <div className="text-center text-[8px] font-black tracking-[0.18em] text-white border-b border-zinc-300/75 pb-0.5">
              MAINTENANCE & INSPECTION TAG
            </div>

            {/* 12-Month Calendar Punch Grid (Like the Reference Image!) */}
            <div className="my-1">
              <div className="grid grid-cols-12 border border-zinc-300/75 text-[6.5px] text-center bg-zinc-200 text-zinc-950 font-black">
                {["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"].map(
                  (m, idx) => (
                    <span key={idx} className="border-r last:border-r-0 border-zinc-950/30">
                      {m}
                    </span>
                  )
                )}
              </div>
              {["2026", "2027"].map((yr) => (
                <div
                  key={yr}
                  className="grid grid-cols-12 border-x border-b border-zinc-300/70 text-[6px] text-center h-3 items-center"
                >
                  <span className="col-span-2 font-bold text-zinc-200 border-r border-zinc-400/50">
                    {yr}
                  </span>
                  {Array.from({ length: 10 }).map((_, i) => (
                    <span
                      key={i}
                      className="border-r last:border-r-0 border-zinc-400/40 h-full"
                    />
                  ))}
                </div>
              ))}
            </div>

            <div className="text-[6.5px] text-zinc-300 flex justify-between">
              <span>TESTED & CERTIFIED</span>
              <span>EQUIP ID: MNT-409</span>
            </div>
          </div>
        </div>
      )}

      {/* ── VARIANT 12: Black & Silver CNG / Pressure Vessel Compliance Plate ── */}
      {variant === 12 && (
        <div
          className={`w-full h-full rounded-lg border-2 border-zinc-300/85 ${blackAnodizedBg} p-2 flex flex-col justify-between relative shadow-2xl font-mono`}
        >
          <CornerHoles />
          <div className="border border-zinc-300/75 h-full p-1.5 flex flex-col justify-between">
            <div className="bg-zinc-200 text-zinc-950 text-center py-0.5 font-black text-[8px] tracking-widest uppercase">
              CNG COMPLIANCE PLATE • IS:15490
            </div>

            <div className="grid grid-cols-2 gap-1 my-1 text-[7px]">
              <div className="border border-zinc-300/60 px-1 py-0.5">
                <span className="text-zinc-400 block text-[6px]">CYLINDER NO.</span>
                <strong className="text-white">CNG-26-78412</strong>
              </div>
              <div className="border border-zinc-300/60 px-1 py-0.5">
                <span className="text-zinc-400 block text-[6px]">TEST PRESSURE</span>
                <strong className="text-white">300 BAR / 60L</strong>
              </div>
              <div className="border border-zinc-300/60 px-1 py-0.5">
                <span className="text-zinc-400 block text-[6px]">LAST TEST DATE</span>
                <strong className="text-white">10 / 2026</strong>
              </div>
              <div className="border border-zinc-300/60 px-1 py-0.5">
                <span className="text-zinc-400 block text-[6px]">NEXT DUE DATE</span>
                <strong className="text-white">10 / 2029</strong>
              </div>
            </div>

            <div className="text-[6.5px] text-center text-zinc-300 tracking-wider">
              APPROVED BY PESO • DEEP STAMPED ANODIZED PLATE
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
