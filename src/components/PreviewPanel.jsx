"use client";

import { motion } from "framer-motion";
import { useRef } from "react";

export default function PreviewPanel({ config, setConfig, previewRef }) {
  const { layers, uploadedFontUrl, material, size, logoUrl, activeLayerId, mountingStyle, showGuides } = config;
  const constraintsRef = useRef(null);


  // Helper to determine a character's color based on layer settings
  const getCharColor = (layer, charIndex) => {
    if (layer.textColorMode === "Single" || !layer.textColorMode) return layer.textColors?.[0] || layer.color;
    if (layer.textColorMode === "Custom") return layer.customCharColors?.[charIndex] || layer.textColors?.[0] || layer.color; 
    if (layer.textColorMode === "Pattern") {
      const blockIndex = Math.floor(charIndex / (layer.textPatternSize || 1));
      return layer.textColors?.[blockIndex % (layer.textColors.length || 1)] || layer.color;
    }
    return layer.color;
  };

  // Material background gradients
  const materialStyles = {
    Aluminium: "texture-aluminium",
    Metal: "bg-gradient-to-br from-zinc-800 to-black shadow-2xl border border-zinc-700/50",
  };

  const plateStyle = materialStyles[material];
  
  // Physical 3D shadow for painted metal lettering
  const physicalTextShadow = "1px 2px 3px rgba(0,0,0,0.8), -1px -1px 1px rgba(255,255,255,0.2)";

  // Dynamically load all unique fonts used across layers
  const uniqueGoogleFonts = [...new Set(layers.map(l => l.font).filter(f => f !== "UploadedCustomFont"))];
  const hasUploadedFont = layers.some(l => l.font === "UploadedCustomFont") && uploadedFontUrl;

  return (
    <div className="w-full flex items-center justify-center relative overflow-hidden px-2 lg:px-6 my-4 lg:my-8 shrink">
      
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

      <div ref={previewRef} className="relative flex items-center justify-center p-8 w-full max-w-[600px]">
        {/* Guides (Rulers) if enabled */}
        {showGuides && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="absolute top-0 left-8 right-8 border-t-2 border-dashed border-gray-400/50 text-[10px] text-gray-500 text-center font-bold">Width: {size.width}"</div>
            <div className="absolute left-0 top-8 bottom-8 border-l-2 border-dashed border-gray-400/50 text-[10px] text-gray-500 flex items-center justify-center font-bold" style={{ writingMode: 'vertical-rl' }}>Height: {size.height}"</div>
          </div>
        )}

      {/* The Name Plate */}
      <motion.div
        layout
        ref={constraintsRef}
        className={`relative flex flex-col p-3 lg:p-4 rounded-md transition-all duration-500 ${plateStyle} overflow-hidden items-center justify-center`}
        style={{
          width: "100%",
          maxWidth: "500px",
          containerType: "size",
          aspectRatio: `${size.width} / ${size.height}`,
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
        }}
      >
        {/* Safe Zone */}
        {showGuides && (
          <div className="absolute inset-4 border-2 border-dashed border-red-500/50 pointer-events-none z-20 rounded" />
        )}

        {/* Standoffs (Mounting) */}
        {mountingStyle === "Standoffs" && (
          <>
            <div className="absolute top-3 left-3 w-4 h-4 rounded-full bg-gradient-to-br from-gray-300 to-gray-600 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.4),0_2px_4px_rgba(0,0,0,0.5)] border border-gray-400 z-20" />
            <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-gradient-to-br from-gray-300 to-gray-600 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.4),0_2px_4px_rgba(0,0,0,0.5)] border border-gray-400 z-20" />
            <div className="absolute bottom-3 left-3 w-4 h-4 rounded-full bg-gradient-to-br from-gray-300 to-gray-600 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.4),0_2px_4px_rgba(0,0,0,0.5)] border border-gray-400 z-20" />
            <div className="absolute bottom-3 right-3 w-4 h-4 rounded-full bg-gradient-to-br from-gray-300 to-gray-600 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.4),0_2px_4px_rgba(0,0,0,0.5)] border border-gray-400 z-20" />
          </>
        )}

        {/* Multi-Layer Text Rendering */}
        {layers.map((layer) => {
          const actualFontFamily = layer.font === "UploadedCustomFont" ? "UploadedCustomFont" : `"${layer.font}", sans-serif`;
          const lines = layer.text.split('\n');
          const maxChars = Math.max(1, ...lines.map(l => l.length));
          // Fixed base size instead of shrinking dynamically based on text length
          const baseFontSize = "10cqw";
          const fontSize = `calc(${baseFontSize} * ${layer.sizeMultiplier || 1.0})`;
          const isActive = layer.id === activeLayerId;

          return (
            <motion.div
              key={layer.id}
              drag
              dragConstraints={constraintsRef}
              dragMomentum={false}
              whileDrag={{ scale: 1.05 }}
              onClick={() => {
                if (!isActive && setConfig) {
                  setConfig(prev => ({ ...prev, activeLayerId: layer.id }));
                }
              }}
              className={`cursor-move flex flex-col items-center justify-center text-center select-none touch-none relative ${isActive ? "ring-2 ring-primary/40 ring-offset-4 ring-offset-transparent rounded-lg z-10" : "z-0"}`}
              style={{ 
                fontSize, 
                fontFamily: actualFontFamily,
                color: layer.color,
                textShadow: physicalTextShadow,
              }}
            >
              {(() => {
                let globalCharIndex = 0;
                return lines.map((line, lineIndex) => (
                  <div key={lineIndex} className="leading-[1.1] whitespace-nowrap">
                    {line.split('').map((char) => {
                      const currentIndex = globalCharIndex++;
                      const charColor = getCharColor(layer, currentIndex);
                      
                      return (
                        <span
                          key={currentIndex}
                          style={{
                            color: charColor,
                            display: "inline-block",
                            whiteSpace: char === " " ? "pre" : "normal"
                          }}
                          className="transition-colors duration-500"
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
      </motion.div>

        {/* Desk Stand */}
        {mountingStyle === "Desk Stand" && (
          <div className="absolute bottom-4 w-[60%] h-6 bg-gradient-to-r from-gray-800 via-gray-500 to-gray-800 rounded-b-xl shadow-2xl -z-10 translate-y-4 border-b-2 border-gray-400" />
        )}
      </div>
    </div>
  );
}
