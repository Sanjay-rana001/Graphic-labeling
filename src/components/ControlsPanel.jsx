"use client";

import { Upload, Type, Palette, Diamond, Sliders, ChevronDown, Plus, Trash2, Layers, LayoutTemplate, AlignLeft, AlignCenter, AlignRight, Target, Grid, Sun, Moon, Image as ImageIcon } from "lucide-react";
import { useRef } from "react";
export default function ControlsPanel({ config, setConfig, price, previewRef, isDarkMode, setIsDarkMode }) {
  const fileInputRef = useRef(null);
  const designInputRef = useRef(null);

  const activeLayer = config.layers.find(l => l.id === config.activeLayerId) || config.layers[0];

  const updateConfig = (key, value) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const updateActiveLayer = (key, value) => {
    setConfig(prev => ({
      ...prev,
      layers: prev.layers.map(l => l.id === prev.activeLayerId ? { ...l, [key]: value } : l)
    }));
  };

  const addLayer = () => {
    if (config.layers.length >= 5) return;
    const newId = Date.now();
    setConfig(prev => ({
      ...prev,
      layers: [...prev.layers, { id: newId, text: "New Text", font: prev.availableFonts[0], color: "#ffffff", x: 0, y: 0 }],
      activeLayerId: newId
    }));
  };

  const removeLayer = (id) => {
    if (config.layers.length <= 1) return;
    setConfig(prev => {
      const newLayers = prev.layers.filter(l => l.id !== id);
      return {
        ...prev,
        layers: newLayers,
        activeLayerId: prev.activeLayerId === id ? newLayers[0].id : prev.activeLayerId
      };
    });
  };

  const colorPalette = [
    '#ffffff', // Pure White
    '#000000', // Pure Black
    '#222222', // Matte Black
    '#ff007f', // Neon Pink
    '#00f3ff', // Cyan
    '#39ff14', // Neon Green
    '#ff0000', // Bright Red
    '#b026ff', // Neon Purple
    '#ffd700', // Golden Yellow
    '#ff6600', // Neon Orange
  ];

  return (
    <div className="flex flex-col w-full lg:w-[600px] bg-card text-card-foreground border-l border-border h-full max-h-screen overflow-visible shadow-2xl z-50 relative">
      
      {/* Vertical Side Tab for Guides */}
      <button 
        onClick={() => updateConfig("showGuides", !config.showGuides)}
        className="hidden lg:flex absolute top-40 -left-10 w-10 h-32 bg-card border-y border-l border-border rounded-l-lg shadow-[-4px_0_10px_rgba(0,0,0,0.1)] items-center justify-center cursor-pointer hover:bg-accent transition-colors z-50"
      >
        <div 
          className="text-xs font-bold text-foreground flex items-center gap-2 whitespace-nowrap"
          style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
        >
          {config.showGuides ? "Hide Guides" : "Show Guides"} <Grid size={12} className="text-primary" style={{ transform: 'rotate(90deg)' }} />
        </div>
      </button>

      <div className="p-5 border-b border-border bg-muted flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Customize</h2>
          <p className="text-xs text-muted-foreground mt-1">Design your premium name plate</p>
        </div>
        <button 
          onClick={(e) => {
            if (!document.startViewTransition) {
              setIsDarkMode(!isDarkMode);
              return;
            }

            const isDark = !isDarkMode;
            const transition = document.startViewTransition(() => {
              setIsDarkMode(isDark);
            });

            transition.ready.then(() => {
              const duration = 900;
              const easing = "cubic-bezier(0.4, 0, 0.2, 1)"; 

              // Generate a complex wavy polygon for the leading edge of the liquid
              const points = 40; // High resolution for smooth curves
              const startWavyBottom = [];
              const endWavyBottom = [];
              
              for (let i = points; i >= 0; i--) {
                const x = (i / points) * 100;
                // Create 3 full liquid waves across the screen with a 5% height amplitude
                const wave = Math.sin((i / points) * Math.PI * 6) * 5;
                startWavyBottom.push(`${x.toFixed(1)}% ${(-10 + wave).toFixed(1)}%`);
                endWavyBottom.push(`${x.toFixed(1)}% ${(120 + wave).toFixed(1)}%`);
              }

              const startClip = `polygon(0% 0%, 100% 0%, ${startWavyBottom.join(', ')})`;
              const endClip = `polygon(0% 0%, 100% 0%, ${endWavyBottom.join(', ')})`;

              // "The Wavy Liquid Drop" - Water fills downward with actual rolling waves
              document.documentElement.animate(
                [
                  { clipPath: startClip },
                  { clipPath: endClip }
                ],
                { 
                  duration: 1500, 
                  easing: "cubic-bezier(0.4, 0, 0.2, 1)", 
                  pseudoElement: "::view-transition-new(root)", 
                  fill: "forwards" 
                }
              );
            });
          }}
          className="p-2 rounded-full bg-card border border-border shadow-sm text-foreground hover:bg-accent transition-colors duration-300"
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        
        {/* Base Material */}
        <section className="space-y-2 pb-4 border-b border-border">
          <div className="flex items-center gap-2 text-primary">
            <Diamond size={18} />
            <h3 className="font-semibold">Base Material</h3>
          </div>
          <div className="flex gap-2">
            {["Metal", "Aluminium"].map((mat) => (
              <button
                key={mat}
                onClick={() => updateConfig("material", mat)}
                className={`flex-1 py-3 border-2 rounded-xl transition-all text-sm font-bold ${config.material === mat ? "border-primary bg-primary/10 shadow-sm text-primary" : "border-border hover:border-primary/50 hover:bg-accent/50 text-muted-foreground bg-card shadow-sm hover:shadow-md"}`}
              >
                {mat} Plate
              </button>
            ))}
          </div>
        </section>

        {/* Custom Design Upload */}
        <section className="space-y-2 pb-4 border-b border-border">
          <div className="flex items-center gap-2 text-primary">
            <ImageIcon size={18} />
            <h3 className="font-semibold">Custom Design / Logo</h3>
          </div>
          <p className="text-xs text-muted-foreground">Upload your own logo or design to place on the plate.</p>
          <div className="flex flex-col gap-2">
            <input 
              type="file" 
              accept="image/png, image/jpeg, image/svg+xml" 
              ref={designInputRef} 
              className="hidden" 
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const url = URL.createObjectURL(file);
                  updateConfig("uploadedDesignUrl", url);
                  updateConfig("uploadedDesignName", file.name);
                }
              }} 
            />
            <button 
              onClick={() => designInputRef.current.click()} 
              className="flex items-center justify-center gap-2 w-full py-3 bg-primary/10 border-2 border-primary/30 hover:border-primary rounded-xl text-sm font-bold transition-all text-primary shadow-sm hover:shadow-md hover:bg-primary/20"
            >
              <Upload size={18} /> 
              {config.uploadedDesignName ? `Change: ${config.uploadedDesignName}` : "Upload PNG / SVG"}
            </button>
            {config.uploadedDesignUrl && (
              <button 
                onClick={() => {
                  updateConfig("uploadedDesignUrl", null);
                  updateConfig("uploadedDesignName", null);
                }}
                className="text-xs font-bold text-red-500 hover:text-red-400 self-end mt-1"
              >
                Remove Design
              </button>
            )}
          </div>
        </section>

        {/* Layer Manager */}
        <section className="space-y-2">
          <div className="flex items-center justify-between text-primary">
            <div className="flex items-center gap-2">
              <Layers size={18} />
              <h3 className="font-semibold">Text Layers ({config.layers.length}/5)</h3>
            </div>
            {config.layers.length < 5 && (
              <button onClick={addLayer} className="text-xs bg-primary/20 text-primary hover:bg-primary/40 px-2 py-1 rounded flex items-center gap-1 transition-all">
                <Plus size={14} /> Add Layer
              </button>
            )}
          </div>
          <p className="text-xs text-muted-foreground">Add up to 5 independent text layers. Drag them directly on the preview to position!</p>
          <div className="flex flex-col gap-2">
            {config.layers.map((layer, index) => (
              <div 
                key={layer.id} 
                onClick={() => updateConfig("activeLayerId", layer.id)}
                className={`flex flex-col p-3 rounded-lg border transition-all cursor-pointer ${config.activeLayerId === layer.id ? "border-primary bg-primary/10 shadow-sm" : "border-border bg-muted hover:border-accent-foreground/50 hover:shadow-sm"}`}
              >
                <div className="flex items-start justify-between w-full">
                  <textarea 
                    value={layer.text}
                    onChange={(e) => {
                      setConfig(prev => ({
                        ...prev,
                        layers: prev.layers.map(l => l.id === layer.id ? { ...l, text: e.target.value } : l)
                      }));
                    }}
                    className={`flex-1 bg-transparent border-none focus:outline-none resize-none text-sm font-medium ${config.activeLayerId === layer.id ? "text-primary" : "text-muted-foreground"}`}
                    rows={1}
                    placeholder={`Layer ${index + 1}`}
                  />
                  {config.layers.length > 1 && (
                    <button onClick={(e) => { e.stopPropagation(); removeLayer(layer.id); }} className="text-red-400 hover:text-red-300 ml-2 mt-1 shrink-0">
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
                {config.activeLayerId === layer.id && (
                  <div className="mt-2 pt-2 border-t border-primary/20 w-full" onClick={(e) => e.stopPropagation()}>
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-2 flex justify-between">
                      <span>Font Size</span>
                      <span className="text-primary">{layer.sizeMultiplier || 1.0}x</span>
                    </label>
                    <input 
                      type="range" 
                      min="0.2" 
                      max="3.0" 
                      step="0.1"
                      value={layer.sizeMultiplier || 1.0}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        setConfig(prev => ({
                          ...prev,
                          layers: prev.layers.map(l => l.id === layer.id ? { ...l, sizeMultiplier: val } : l)
                        }));
                      }}
                      className="w-full accent-primary h-1"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Active Layer Settings */}
        <div className="pt-4 border-t border-border space-y-4 relative">
          <div className="absolute -top-3 left-0 bg-card px-2 text-[10px] font-bold text-primary uppercase tracking-widest">
            Editing Layer: {activeLayer.text.substring(0, 10) || "Empty"}
          </div>

          <section className="space-y-3">
            <div className="flex items-center gap-2 text-primary">
              <Type size={18} />
              <h3 className="font-semibold">Typography</h3>
            </div>
            <div className="relative">
              <select 
                value={activeLayer.font}
                onChange={(e) => updateActiveLayer("font", e.target.value)}
                className="w-full p-2 pr-10 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all appearance-none cursor-pointer"
                style={{ fontFamily: activeLayer.font === "UploadedCustomFont" ? "UploadedCustomFont" : `"${activeLayer.font}", sans-serif` }}
              >
                {config.availableFonts.map((fontName) => (
                  <option key={fontName} value={fontName} style={{ fontFamily: `"${fontName}", sans-serif` }}>
                    {fontName}
                  </option>
                ))}
                {activeLayer.font === "UploadedCustomFont" && (
                  <option value="UploadedCustomFont">
                    {config.uploadedFontName}
                  </option>
                )}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={18} />
            </div>

            <div className="flex flex-col gap-2 pt-2 border-t border-border">
              <input 
                type="file" 
                accept=".ttf,.otf,.woff,.woff2" 
                ref={fileInputRef} 
                className="hidden" 
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const url = URL.createObjectURL(file);
                    updateConfig("uploadedFontUrl", url);
                    updateConfig("uploadedFontName", file.name.split('.')[0]);
                    updateActiveLayer("font", "UploadedCustomFont");
                  }
                }} 
              />
              <button 
                onClick={() => fileInputRef.current.click()} 
                className="flex items-center justify-center gap-2 w-full py-1.5 bg-muted border border-border hover:border-primary rounded-lg text-xs transition-all text-muted-foreground hover:text-foreground shadow-sm"
              >
                <Upload size={16} /> 
                {config.uploadedFontName && activeLayer.font === "UploadedCustomFont" ? `Using: ${config.uploadedFontName}` : "Upload Custom Font (.ttf/.otf)"}
              </button>
              {activeLayer.font === "UploadedCustomFont" && (
                <button 
                  onClick={() => updateActiveLayer("font", config.availableFonts[0])}
                  className="text-[10px] text-red-400 hover:text-red-300 self-end"
                >
                  Clear Custom Font
                </button>
              )}
            </div>
          </section>

          <section className="space-y-3 pt-4">
            <div className="flex items-center gap-2 text-primary">
              <Palette size={18} />
              <h3 className="font-semibold">Letter Coloring</h3>
            </div>
            
            <div className="flex bg-muted rounded-lg p-1 border border-border">
              {["Single", "Pattern", "Custom"].map(mode => (
                <button
                  key={mode}
                  onClick={() => updateActiveLayer("textColorMode", mode)}
                  className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${activeLayer.textColorMode === mode ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {mode}
                </button>
              ))}
            </div>

            {(!activeLayer.textColorMode || activeLayer.textColorMode === "Single") && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Select Color</label>
                <div className="flex flex-wrap gap-2">
                  {colorPalette.map(color => (
                    <button
                      key={color}
                      onClick={() => updateActiveLayer("textColors", [color])}
                      className={`w-6 h-6 rounded-full border-2 transition-all ${(activeLayer.textColors?.[0] || activeLayer.color) === color ? "border-foreground scale-110 shadow-md" : "border-transparent hover:scale-105 shadow-sm"}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            )}

            {activeLayer.textColorMode === "Pattern" && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2">Pattern Colors (Click to toggle)</label>
                  <div className="flex flex-wrap gap-2">
                    {colorPalette.map(color => {
                      const isActive = activeLayer.textColors?.includes(color);
                      return (
                        <button
                          key={color}
                          onClick={() => {
                            const current = activeLayer.textColors || [];
                            const newColors = isActive ? current.filter(c => c !== color) : [...current, color];
                            if (newColors.length > 0) updateActiveLayer("textColors", newColors);
                          }}
                          className={`w-6 h-6 rounded-full border-2 transition-all ${isActive ? "border-foreground scale-110 shadow-md" : "border-transparent hover:scale-105 shadow-sm opacity-50"}`}
                          style={{ backgroundColor: color }}
                        />
                      );
                    })}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2 flex justify-between">
                    <span>Block Size</span>
                    <span className="text-primary">{activeLayer.textPatternSize || 1} chars</span>
                  </label>
                  <input 
                    type="range" min="1" max="5" step="1"
                    value={activeLayer.textPatternSize || 1}
                    onChange={(e) => updateActiveLayer("textPatternSize", parseInt(e.target.value))}
                    className="w-full accent-primary"
                  />
                </div>
              </div>
            )}

            {activeLayer.textColorMode === "Custom" && (
              <div className="space-y-4">
                <p className="text-xs text-muted-foreground">Click a character below to select it, then pick a color.</p>
                <div className="flex flex-wrap gap-1 p-3 bg-muted rounded-lg border border-border">
                  {activeLayer.text.split('').map((char, index) => (
                    <button
                      key={index}
                      onClick={() => setConfig(prev => ({ ...prev, activeLayerCharIndex: index }))}
                      className={`w-6 h-6 text-xs flex items-center justify-center font-bold rounded-md transition-all ${config.activeLayerCharIndex === index ? "ring-2 ring-primary bg-card shadow-sm text-foreground" : "bg-card border border-border hover:bg-accent shadow-sm text-foreground"}`}
                      style={{ color: activeLayer.customCharColors?.[index] || activeLayer.textColors?.[0] || activeLayer.color || "currentColor" }}
                    >
                      {char === " " ? "_" : char}
                    </button>
                  ))}
                </div>
                {config.activeLayerCharIndex !== undefined && (
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2">
                      Color for '{activeLayer.text[config.activeLayerCharIndex] === " " ? "Space" : activeLayer.text[config.activeLayerCharIndex]}'
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {colorPalette.map(color => (
                        <button
                          key={color}
                          onClick={() => {
                            const custom = { ...(activeLayer.customCharColors || {}) };
                            custom[config.activeLayerCharIndex] = color;
                            updateActiveLayer("customCharColors", custom);
                          }}
                          className={`w-6 h-6 rounded-full border-2 transition-all ${activeLayer.customCharColors?.[config.activeLayerCharIndex] === color ? "border-foreground scale-110 shadow-md" : "border-transparent hover:scale-105"}`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>

        {/* Global Settings */}
        <div className="pt-4 border-t border-border space-y-4 relative">
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-primary">
              <Sliders size={18} />
              <h3 className="font-semibold">Dimensions</h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-2">Width (in)</label>
                <input type="number" value={config.size.width} onChange={(e) => updateConfig("size", { ...config.size, width: parseInt(e.target.value) || 1 })} className="w-full p-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all text-sm text-foreground shadow-sm" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-2">Height (in)</label>
                <input type="number" value={config.size.height} onChange={(e) => updateConfig("size", { ...config.size, height: parseInt(e.target.value) || 1 })} className="w-full p-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all text-sm text-foreground shadow-sm" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-2">Thick (mm)</label>
                <input type="number" value={config.size.thickness || 2} onChange={(e) => updateConfig("size", { ...config.size, thickness: parseInt(e.target.value) || 1 })} className="w-full p-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all text-sm text-foreground shadow-sm" />
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-2 text-primary">
              <Target size={18} />
              <h3 className="font-semibold">Mounting Options</h3>
            </div>
            <div className="flex gap-2">
              {["Standoffs", "Adhesive", "Desk Stand"].map((mount) => (
                <button
                  key={mount}
                  onClick={() => updateConfig("mountingStyle", mount)}
                  className={`flex-1 py-2 border rounded-lg transition-all text-xs font-bold ${config.mountingStyle === mount ? "border-primary bg-primary/10 text-primary shadow-sm" : "border-border hover:border-accent text-muted-foreground bg-card shadow-sm"}`}
                >
                  {mount}
                </button>
              ))}
            </div>
          </section>


        </div>

        {/* Volume Pricing moved to bottom of scrollable area */}
        <div className="mt-8 p-3 bg-muted rounded-xl border border-border">
          <h4 className="text-[10px] font-bold text-primary uppercase tracking-wider mb-2">Volume Discount Applied</h4>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs font-medium text-muted-foreground">
            <div className="flex justify-between"><span>1 - 10 qty</span> <span className="text-foreground">₹600 / pc</span></div>
            <div className="flex justify-between"><span>11 - 30 qty</span> <span className="text-foreground">₹450 / pc</span></div>
            <div className="flex justify-between"><span>31+ qty</span> <span className="text-foreground">₹350 / pc</span></div>
            <div className="flex justify-between"><span>Base Setup (Fixed)</span> <span className="text-foreground">₹1,000</span></div>
          </div>
        </div>
      </div>

    </div>
  );
}
