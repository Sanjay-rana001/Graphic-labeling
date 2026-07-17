"use client";

import { motion } from "framer-motion";
import { useRef } from "react";

export default function PreviewPanel({ config, setConfig }) {
  const { layers, uploadedFontUrl, material, size, logoUrl, activeLayerId } = config;
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
    <div className="flex-1 min-h-[500px] w-full flex items-center justify-center relative overflow-hidden px-2 lg:px-6">
      
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
    </div>
  );
}
