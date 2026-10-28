"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { Grid, Sliders, Sun, Eye, RotateCcw, Shield } from "lucide-react";

export default function PreviewPanel({ config, setConfig, previewRef }) {
  const { 
    layers, 
    uploadedFontUrl, 
    material, 
    size, 
    activeLayerId, 
    mountingStyle, 
    showGuides, 
    uploadedDesignUrl 
  } = config;

  const [lightingMode, setLightingMode] = useState("studio"); // 'studio', 'warm', 'dramatic'
  const constraintsRef = useRef(null);

  // Material background classes
  const materialStyles = {
    Aluminium: "texture-aluminium",
    Metal: "texture-metal",
    Brass: "texture-brass",
    Titanium: "texture-titanium",
    RoseGold: "texture-rosegold",
  };

  const plateStyle = materialStyles[material] || "texture-aluminium";

  // Lighting overlays
  const lightingOverlays = {
    studio: "bg-gradient-to-tr from-transparent via-white/[0.08] to-transparent",
    warm: "bg-gradient-to-tr from-amber-500/[0.05] via-transparent to-amber-300/[0.08]",
    dramatic: "bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.15)_0%,transparent_60%)]",
  };

  // Realistic engraving shadows per material
  const isDarkMaterial = material === "Titanium";
  const defaultEngravingShadow = isDarkMaterial 
    ? "0 1px 1px rgba(0,0,0,0.9), 0 0 1px rgba(255,255,255,0.2)" 
    : "0 1px 0 rgba(255,255,255,0.6), inset 0 1px 2px rgba(0,0,0,0.4)";

  // Unique Google Fonts loader
  const uniqueGoogleFonts = [...new Set(layers.map(l => l.font).filter(f => f && f !== "UploadedCustomFont"))];
  const hasUploadedFont = layers.some(l => l.font === "UploadedCustomFont") && uploadedFontUrl;

  const getCharColor = (layer, charIndex) => {
    if (layer.textColorMode === "Single" || !layer.textColorMode) return layer.textColors?.[0] || layer.color;
    if (layer.textColorMode === "Custom") return layer.customCharColors?.[charIndex] || layer.textColors?.[0] || layer.color; 
    if (layer.textColorMode === "Pattern") {
      const blockIndex = Math.floor(charIndex / (layer.textPatternSize || 1));
      return layer.textColors?.[blockIndex % (layer.textColors.length || 1)] || layer.color;
    }
    return layer.color;
  };

  const resetLayerPositions = () => {
    setConfig(prev => ({
      ...prev,
      layers: prev.layers.map(l => ({ ...l, x: 0, y: 0 }))
    }));
  };

  return (
    <div className="w-full flex flex-col items-center justify-center relative select-none">
      
      {/* Dynamic Font Injector */}
      {hasUploadedFont && (
        <style>{`
          @font-face {
            font-family: 'UploadedCustomFont';
            src: url('${uploadedFontUrl}');
          }
        `}</style>
      )}
      {uniqueGoogleFonts.map(font => (
        <style key={font}>{`
          @import url('https://fonts.googleapis.com/css2?family=${font.replace(/ /g, '+')}&display=swap');
        `}</style>
      ))}

      {/* Sleek Floating Canvas Toolbar */}
      <div className="flex items-center gap-2 mb-4 p-1.5 rounded-full glass-panel shadow-sm text-xs text-muted-foreground z-20">
        
        {/* Toggle Guides */}
        <button
          onClick={() => setConfig(prev => ({ ...prev, showGuides: !prev.showGuides }))}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all ${showGuides ? 'bg-foreground text-background font-medium' : 'hover:text-foreground'}`}
          title="Toggle Dimension Guides"
        >
          <Grid size={13} />
          <span>Guides</span>
        </button>

        <div className="h-3 w-px bg-border/60" />

        {/* Lighting Selector */}
        <button
          onClick={() => setLightingMode(prev => prev === "studio" ? "warm" : prev === "warm" ? "dramatic" : "studio")}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full hover:text-foreground transition-colors"
          title="Switch Studio Lighting"
        >
          <Sun size={13} />
          <span className="capitalize">{lightingMode} Light</span>
        </button>

        <div className="h-3 w-px bg-border/60" />

        {/* Reset Positions */}
        <button
          onClick={resetLayerPositions}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full hover:text-foreground transition-colors"
          title="Center text layers"
        >
          <RotateCcw size={13} />
          <span>Center</span>
        </button>

        {/* Size Spec Tag */}
        <span className="hidden sm:inline-flex px-2.5 py-0.5 rounded-md bg-muted text-[11px] font-mono text-foreground">
          {size.width}" × {size.height}"
        </span>

      </div>

      {/* Interactive Plate Canvas Stage */}
      <div 
        ref={previewRef} 
        className="relative flex items-center justify-center p-6 sm:p-10 w-full max-w-[620px] transition-all"
      >
        
        {/* Rulers / Guides */}
        <AnimatePresence>
          {showGuides && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-2 sm:inset-4 pointer-events-none flex items-center justify-center z-10"
            >
              {/* Top Width Ruler */}
              <div className="absolute top-2 left-8 right-8 border-t-2 border-dashed border-amber-500/60 text-[11px] text-amber-500 font-mono text-center font-semibold">
                <span className="bg-background/80 px-2 rounded -translate-y-2 inline-block">
                  Width: {size.width} inches
                </span>
              </div>
              
              {/* Left Height Ruler */}
              <div 
                className="absolute left-2 top-8 bottom-8 border-l-2 border-dashed border-amber-500/60 text-[11px] text-amber-500 font-mono flex items-center justify-center font-semibold"
                style={{ writingMode: 'vertical-rl' }}
              >
                <span className="bg-background/80 py-2 rounded -translate-x-2 inline-block">
                  Height: {size.height} inches
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* The Realistic Physical Nameplate */}
        <motion.div
          layout
          ref={constraintsRef}
          className={`relative flex flex-col rounded-xl transition-all duration-500 ${plateStyle} overflow-hidden items-center justify-center`}
          style={{
            width: "100%",
            maxWidth: "520px",
            containerType: "size",
            aspectRatio: `${size.width} / ${size.height}`,
            boxShadow: isDarkMaterial
              ? "0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 1px 1px rgba(255,255,255,0.1) inset"
              : "0 25px 50px -15px rgba(0, 0, 0, 0.45), 0 0 1px 1px rgba(255,255,255,0.4) inset",
          }}
        >
          {/* Subtle Ambient Specular Lighting Layer */}
          <div className={`absolute inset-0 pointer-events-none ${lightingOverlays[lightingMode]} transition-all duration-700`} />

          {/* Standoff Mounting Pins - Realistic concentric machining */}
          {mountingStyle === "Standoffs" && (
            <>
              {/* Top-Left */}
              <div className="absolute top-3.5 left-3.5 w-4 h-4 rounded-full bg-gradient-to-br from-zinc-200 via-zinc-400 to-zinc-600 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_2px_4px_rgba(0,0,0,0.5)] border border-zinc-400/80 z-30 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-700 shadow-inner" />
              </div>
              {/* Top-Right */}
              <div className="absolute top-3.5 right-3.5 w-4 h-4 rounded-full bg-gradient-to-br from-zinc-200 via-zinc-400 to-zinc-600 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_2px_4px_rgba(0,0,0,0.5)] border border-zinc-400/80 z-30 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-700 shadow-inner" />
              </div>
              {/* Bottom-Left */}
              <div className="absolute bottom-3.5 left-3.5 w-4 h-4 rounded-full bg-gradient-to-br from-zinc-200 via-zinc-400 to-zinc-600 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_2px_4px_rgba(0,0,0,0.5)] border border-zinc-400/80 z-30 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-700 shadow-inner" />
              </div>
              {/* Bottom-Right */}
              <div className="absolute bottom-3.5 right-3.5 w-4 h-4 rounded-full bg-gradient-to-br from-zinc-200 via-zinc-400 to-zinc-600 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_2px_4px_rgba(0,0,0,0.5)] border border-zinc-400/80 z-30 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-700 shadow-inner" />
              </div>
            </>
          )}

          {/* Safe-Zone Guide Dashes if Enabled */}
          <AnimatePresence>
            {showGuides && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-9 border border-dashed border-amber-400/50 pointer-events-none z-20 rounded" 
              />
            )}
          </AnimatePresence>

          {/* Uploaded Logo / Artwork Layer */}
          {uploadedDesignUrl && (
            <motion.div
              drag
              dragConstraints={constraintsRef}
              dragMomentum={false}
              whileDrag={{ scale: 1.05 }}
              className="absolute z-10 cursor-move p-2 rounded-lg hover:ring-1 hover:ring-primary/60 transition-all"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={uploadedDesignUrl} 
                alt="Uploaded Artwork" 
                className="w-auto h-16 sm:h-24 object-contain pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" 
              />
            </motion.div>
          )}

          {/* Laser-Engraved Text Layers (Safe padded container) */}
          <div className="relative z-20 w-full h-full flex flex-col items-center justify-center px-10 sm:px-12 py-4">
            {layers.map((layer) => {
              const actualFontFamily = layer.font === "UploadedCustomFont" ? "UploadedCustomFont" : `"${layer.font}", sans-serif`;
              const lines = layer.text.split('\n');
              
              // Responsive safe font scale based on text length to prevent overflowing
              const maxLineChars = Math.max(1, ...lines.map(l => l.length));
              // Safe adaptive base size
              const adaptiveScale = maxLineChars > 12 ? Math.max(0.6, 12 / maxLineChars) : 1.0;
              const baseFontSize = `${7 * adaptiveScale}cqw`;
              const fontSize = `calc(${baseFontSize} * ${layer.sizeMultiplier || 1.0})`;
              const isActive = layer.id === activeLayerId;

              // Color fallback
              const defaultCharColor = isDarkMaterial ? "#f4f4f5" : "#18181b";

              return (
                <motion.div
                  key={layer.id}
                  drag
                  dragConstraints={constraintsRef}
                  dragMomentum={false}
                  whileDrag={{ scale: 1.03 }}
                  onClick={() => {
                    if (!isActive && setConfig) {
                      setConfig(prev => ({ ...prev, activeLayerId: layer.id }));
                    }
                  }}
                  className={`cursor-move flex flex-col items-center justify-center text-center select-none touch-none relative px-3 py-1.5 rounded-lg transition-all ${
                    isActive ? "ring-1 ring-amber-500/70 bg-amber-500/[0.04]" : "hover:ring-1 hover:ring-black/10 dark:hover:ring-white/10"
                  }`}
                  style={{ 
                    fontSize, 
                    fontFamily: actualFontFamily,
                    textShadow: defaultEngravingShadow,
                  }}
                >
                  {(() => {
                    let globalCharIndex = 0;
                    return lines.map((line, lineIndex) => (
                      <div key={lineIndex} className="leading-[1.15] whitespace-nowrap">
                        {line.split('').map((char) => {
                          const currentIndex = globalCharIndex++;
                          const charColor = getCharColor(layer, currentIndex) || defaultCharColor;
                          
                          return (
                            <span
                              key={currentIndex}
                              style={{
                                color: charColor,
                                display: "inline-block",
                                whiteSpace: char === " " ? "pre" : "normal"
                              }}
                              className="transition-colors duration-300"
                            >
                              {char}
                            </span>
                          );
                        })}
                      </div>
                    ));
                  })()}
                </motion.div>
              );
            })}
          </div>

        </motion.div>

        {/* Desk Stand if Selected */}
        {mountingStyle === "Desk Stand" && (
          <div className="absolute bottom-3 w-[55%] h-5 bg-gradient-to-r from-zinc-800 via-zinc-600 to-zinc-800 rounded-b-lg shadow-xl -z-10 translate-y-3 border-b-2 border-zinc-500" />
        )}

      </div>

      {/* Studio Hint */}
      <div className="text-[11px] text-muted-foreground flex items-center gap-1.5 mt-2">
        <Sliders size={12} className="text-muted-foreground" />
        <span>Click & drag typography directly on plate to align</span>
      </div>

    </div>
  );
}
