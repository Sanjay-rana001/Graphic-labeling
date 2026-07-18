"use client";

import { useState, useMemo, useRef } from "react";
import PreviewPanel from "./PreviewPanel";
import ControlsPanel from "./ControlsPanel";
import CheckoutBlock from "./CheckoutBlock";
import { useTheme } from "./ThemeProvider";
import Link from "next/link";
import { Home } from "lucide-react";

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
        text: "ACME CORP",
        font: availableFonts[0],
        sizeMultiplier: 1.0,
        color: "#ffffff",
        textColorMode: "Single", // Single, Pattern, Custom
        textColors: ["#ffffff", "#ff007f"], // Color palette array
        textPatternSize: 1, // Pattern block size
        customCharColors: {}, // Specific colors per character index
      }
    ],
    activeLayerId: 1,
    availableFonts: availableFonts,
    uploadedFontUrl: null,
    uploadedFontName: null,
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
    <div className={`flex flex-col lg:flex-row min-h-screen bg-background relative text-foreground`}>
      <header className="absolute top-0 left-0 p-6 flex items-center gap-6 z-50 pointer-events-none">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/Media/Logo.png" alt="Brand Logo" className="h-12 lg:h-16 object-contain drop-shadow-xl pointer-events-auto" />
        <Link href="/" className="pointer-events-auto relative flex items-center p-[4px] rounded-full bg-white border border-gray-200 dark:border-transparent group overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
          
          {/* Background Sweep (Right to Left) */}
          <div className="absolute inset-0 bg-white rounded-full translate-x-[101%] group-hover:translate-x-0 transition-transform duration-700 ease-in-out z-10" />

          {/* Sliding Home Icon */}
          <div className="relative z-20 flex items-center overflow-hidden h-4 w-6 mx-1.5">
            <Home className="absolute left-1 w-4 h-4 text-black transition-all duration-700 ease-in-out group-hover:-translate-x-8" />
            <Home className="absolute left-1 w-4 h-4 text-black translate-x-8 transition-all duration-700 ease-in-out group-hover:translate-x-0" />
          </div>

          {/* Inner Pill */}
          <div className="relative px-5 py-1.5 rounded-full flex items-center justify-center">
            <div className="absolute inset-0 bg-zinc-950 rounded-full z-0" />
            <span className="relative z-20 text-white group-hover:text-black text-sm font-semibold transition-colors duration-500 whitespace-nowrap">
              Back to Home
            </span>
          </div>

        </Link>
      </header>
      
      {/* Left side: Preview */}
      <div className="w-full lg:flex-1 flex flex-col items-center justify-center relative pt-20 pb-4 lg:pt-20 lg:pb-4 sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b border-border lg:border-none lg:h-screen lg:overflow-hidden shadow-lg lg:shadow-none">
        <div className="w-full flex justify-center items-center">
          <PreviewPanel config={config} setConfig={setConfig} previewRef={previewRef} />
        </div>
        <div className="w-full max-w-2xl mt-4 shrink-0">
          <CheckoutBlock config={config} setConfig={setConfig} price={price} previewRef={previewRef} />
        </div>
      </div>

      {/* Right side: Controls */}
      <div className="flex flex-col w-full lg:w-[600px] h-full lg:max-h-screen">
        <ControlsPanel config={config} setConfig={setConfig} price={price} previewRef={previewRef} isDarkMode={isDarkMode} setIsDarkMode={setTheme} />
      </div>
    </div>
  );
}
