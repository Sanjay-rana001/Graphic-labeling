"use client";

import { useState, useMemo, useRef } from "react";
import PreviewPanel from "./PreviewPanel";
import ControlsPanel from "./ControlsPanel";
import CheckoutBlock from "./CheckoutBlock";
import { useTheme } from "./ThemeProvider";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import SweepButton from "./SweepButton";
import ThemeToggle from "./ThemeToggle";

const availableFonts = [
  "Montserrat", "Bebas Neue", "Playfair Display",
  "Pacifico", "Dancing Script", "Caveat", "Permanent Marker",
  "Orbitron", "Audiowide", "Syncopate", "Press Start 2P",
  "Cinzel", "Marcellus", "UnifrakturMaguntia",
  "Righteous", "Lobster", "Anton", "Abril Fatface", "Alfa Slab One", "Bangers",
  "Special Elite", "Black Ops One"
];

export default function ProductBuilder() {
  const { isDarkMode, setTheme } = useTheme();
  
  const [config, setConfig] = useState({
    layers: [
      {
        id: 1,
        text: "SAOURAV GRAPHIC",
        font: availableFonts[0],
        sizeMultiplier: 1.0,
        color: "#18181b",
        textColorMode: "Single",
        textColors: ["#18181b"],
        textPatternSize: 1,
        customCharColors: {},
      }
    ],
    activeLayerId: 1,
    availableFonts: availableFonts,
    uploadedFontUrl: null,
    uploadedFontName: null,
    uploadedDesignUrl: null,
    uploadedDesignName: null,
    material: "Aluminium",
    size: { width: 12, height: 4, thickness: 2 },
    quantity: 1,
    mountingStyle: "Standoffs",
    showGuides: false,
  });

  const previewRef = useRef(null);

  // Calculate dynamic price based on selections
  const price = useMemo(() => {
    const qty = config.quantity || 1;
    const basePrice = 1000;
    let perPiecePrice = 0;

    if (qty <= 10) {
      perPiecePrice = 600;
    } else if (qty <= 30) {
      perPiecePrice = 450;
    } else {
      perPiecePrice = 350;
    }

    return basePrice + (perPiecePrice * qty);
  }, [config]);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-background relative text-foreground">
      
      {/* Sleek Top Navigation Bar for Builder */}
      <header className="w-full lg:hidden flex items-center justify-between p-4 border-b border-border/60 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <SweepButton href="/" label="Home" type="back" size="sm" />
        <Link href="/" prefetch={true} className="relative h-7 w-24 block cursor-pointer active:scale-95 transition-transform duration-75">
          <Image src="/Media/Logo.png" alt="Logo" fill sizes="100px" className="object-contain" priority />
        </Link>
        <ThemeToggle size="sm" />
      </header>

      {/* Left side: Canvas & Realtime 3D Specimen Preview */}
      <div className="w-full lg:flex-1 flex flex-col justify-between relative bg-muted/10 lg:h-screen lg:overflow-y-auto">
        
        {/* Desktop Header */}
        <div className="hidden lg:flex items-center justify-between p-5 border-b border-border/40 shrink-0">
          <div className="flex items-center gap-4">
            <SweepButton href="/" label="Back to Home" type="back" size="sm" />
            <div className="h-4 w-px bg-border/60" />
            <Link href="/" prefetch={true} className="relative h-8 w-28 block cursor-pointer active:scale-95 transition-transform duration-75">
              <Image src="/Media/Logo.png" alt="Logo" fill sizes="120px" className="object-contain object-left" priority />
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-pill text-[11px] text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Laser Proof • 1:1 Scale Preview</span>
            </div>
            <ThemeToggle size="sm" />
          </div>
        </div>

        {/* Center Canvas */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-8 min-h-[360px] relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.03)_0%,transparent_70%)] pointer-events-none" />
          <PreviewPanel config={config} setConfig={setConfig} previewRef={previewRef} />
        </div>

        {/* Bottom Checkout & Export Block */}
        <div className="w-full max-w-2xl mx-auto px-4 pb-6 shrink-0">
          <CheckoutBlock config={config} setConfig={setConfig} price={price} previewRef={previewRef} />
        </div>

      </div>

      {/* Right side: Modern Sleek Controls Drawer */}
      <div className="flex flex-col w-full lg:w-[500px] xl:w-[540px] h-full lg:max-h-screen border-l border-border/60 bg-card">
        <ControlsPanel 
          config={config} 
          setConfig={setConfig} 
          price={price} 
          previewRef={previewRef} 
          isDarkMode={isDarkMode} 
          setIsDarkMode={setTheme} 
        />
      </div>

    </div>
  );
}
