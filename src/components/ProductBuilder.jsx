"use client";

import { useState, useMemo } from "react";
import PreviewPanel from "./PreviewPanel";
import ControlsPanel from "./ControlsPanel";

const availableFonts = [
  "Montserrat", "Bebas Neue", "Playfair Display",
  "Pacifico", "Dancing Script", "Caveat", "Permanent Marker",
  "Orbitron", "Audiowide", "Syncopate", "Press Start 2P",
  "Cinzel", "Marcellus", "UnifrakturMaguntia",
  "Righteous", "Lobster", "Anton", "Abril Fatface", "Alfa Slab One", "Bangers",
  "Special Elite", "Black Ops One"
];

export default function ProductBuilder() {
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
  });

  // Calculate dynamic price based on selections
  const price = useMemo(() => {
    const qty = config.quantity || 1;
    const basePrice = 1000;
    let perPiecePrice = 0;

    if (qty <= 10) {
      perPiecePrice = 600;
    } else if (qty <= 30) {
      perPiecePrice = 350;
    } else {
      perPiecePrice = 150;
    }

    return basePrice + (perPiecePrice * qty);
  }, [config]);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-background relative">
      <header className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-50 pointer-events-none">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/Media/Logo.png" alt="Brand Logo" className="h-12 lg:h-16 object-contain drop-shadow-xl" />
      </header>
      
      {/* Left side: Preview */}
      <div className="w-full lg:flex-1 flex flex-col items-center justify-center relative pt-20 pb-4 lg:pt-24 lg:pb-8 sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b border-border lg:border-none lg:static lg:bg-transparent">
        <PreviewPanel config={config} setConfig={setConfig} />
      </div>

      {/* Right side: Controls */}
      <ControlsPanel config={config} setConfig={setConfig} price={price} />
    </div>
  );
}
