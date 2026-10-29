"use client";

import { 
  Upload, 
  Type, 
  Palette, 
  Diamond, 
  Sliders, 
  ChevronDown, 
  Plus, 
  Trash2, 
  Layers, 
  Image as ImageIcon,
  Check,
  Maximize2
} from "lucide-react";
import { useRef, useState } from "react";

export default function ControlsPanel({ config, setConfig, price, previewRef, isDarkMode, setIsDarkMode }) {
  const fileInputRef = useRef(null);
  const designInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState("text"); // 'text', 'material', 'colors', 'artwork'

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
      layers: [...prev.layers, { 
        id: newId, 
        text: "NEW LINE", 
        font: prev.availableFonts[0], 
        color: config.material === "Titanium" ? "#ffffff" : "#18181b", 
        sizeMultiplier: 0.8,
        x: 0, 
        y: 0 
      }],
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
    { name: "Laser Obsidian", value: "#18181b" },
    { name: "Pure White", value: "#ffffff" },
    { name: "Champagne Gold", value: "#f59e0b" },
    { name: "Polished Brass", value: "#d4af37" },
    { name: "Satin Chrome", value: "#cbd5e1" },
    { name: "Architect Cyan", value: "#0ea5e9" },
    { name: "Imperial Emerald", value: "#10b981" },
    { name: "Crimson Red", value: "#e11d48" },
    { name: "Electric Indigo", value: "#6366f1" },
    { name: "Deep Charcoal", value: "#334155" },
  ];

  const materialOptions = [
    { id: "Aluminium", name: "Brushed Aluminium", desc: "Aerospace 6061-T6 Silver Grain" },
    { id: "Brass", name: "Heritage Brass Gold", desc: "Solid Architectural Warm Gold" },
    { id: "Titanium", name: "Matte Black Titanium", desc: "Stealth Dark Satin Finish" },
    { id: "RoseGold", name: "Satin Rose Gold", desc: "Refined Luxury Copper Glow" },
    { id: "Metal", name: "Stainless Chrome Steel", desc: "Bright Polished Industrial Alloy" },
  ];

  return (
    <div className="flex flex-col h-full bg-card text-card-foreground select-none">
      
      {/* Studio Drawer Header */}
      <div className="p-4 sm:p-5 border-b border-border/60 bg-muted/20 flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-foreground">Studio Controls</h2>
          <p className="text-[11px] text-muted-foreground mt-0.5">Customize laser engravings, hardware, and materials</p>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-muted-foreground block uppercase tracking-wider font-mono">Selected Spec</span>
          <span className="text-xs font-semibold text-amber-500 font-mono">{config.size.width}" × {config.size.height}" • {config.material}</span>
        </div>
      </div>

      {/* Category Tabs Strip */}
      <div className="flex border-b border-border/60 bg-background/50 px-2 pt-2 gap-1 shrink-0 overflow-x-auto">
        <button
          onClick={() => setActiveTab("text")}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-t-lg transition-all duration-75 border-b-2 whitespace-nowrap cursor-pointer active:scale-95 touch-manipulation select-none ${
            activeTab === "text" 
              ? "border-amber-500 text-foreground bg-card shadow-sm" 
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Type size={13} />
          <span>Text & Fonts</span>
          <span className="px-1.5 py-0.2 rounded-full bg-muted text-[10px] text-muted-foreground">{config.layers.length}</span>
        </button>

        <button
          onClick={() => setActiveTab("material")}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-t-lg transition-all duration-75 border-b-2 whitespace-nowrap cursor-pointer active:scale-95 touch-manipulation select-none ${
            activeTab === "material" 
              ? "border-amber-500 text-foreground bg-card shadow-sm" 
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Diamond size={13} />
          <span>Material & Mount</span>
        </button>

        <button
          onClick={() => setActiveTab("colors")}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-t-lg transition-all duration-75 border-b-2 whitespace-nowrap cursor-pointer active:scale-95 touch-manipulation select-none ${
            activeTab === "colors" 
              ? "border-amber-500 text-foreground bg-card shadow-sm" 
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Palette size={13} />
          <span>Inlay Color</span>
        </button>

        <button
          onClick={() => setActiveTab("artwork")}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-t-lg transition-all duration-75 border-b-2 whitespace-nowrap cursor-pointer active:scale-95 touch-manipulation select-none ${
            activeTab === "artwork" 
              ? "border-amber-500 text-foreground bg-card shadow-sm" 
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <ImageIcon size={13} />
          <span>Artwork</span>
        </button>
      </div>

      {/* Tab Panels Body (Scrollable, Clean) */}
      <div className="flex-1 p-5 space-y-6 overflow-y-auto">
        
        {/* TAB 1: TEXT & TYPOGRAPHY */}
        {activeTab === "text" && (
          <div className="space-y-5">
            
            {/* Layer Selection & Add Button */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-foreground">Active Text Layers</label>
                {config.layers.length < 5 && (
                  <button 
                    onClick={addLayer}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-muted hover:bg-muted/80 text-foreground transition-colors border border-border/60"
                  >
                    <Plus size={12} />
                    <span>Add Layer</span>
                  </button>
                )}
              </div>

              <div className="space-y-2">
                {config.layers.map((layer, idx) => {
                  const isSelected = layer.id === config.activeLayerId;
                  return (
                    <div
                      key={layer.id}
                      onClick={() => updateConfig("activeLayerId", layer.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer ${
                        isSelected 
                          ? "border-amber-500/70 bg-amber-500/[0.04] shadow-sm" 
                          : "border-border/60 bg-muted/20 hover:border-border"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <span className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-[10px] font-mono text-muted-foreground shrink-0">
                            {idx + 1}
                          </span>
                          <input
                            type="text"
                            value={layer.text}
                            onChange={(e) => {
                              const val = e.target.value;
                              setConfig(prev => ({
                                ...prev,
                                layers: prev.layers.map(l => l.id === layer.id ? { ...l, text: val } : l)
                              }));
                            }}
                            className="bg-transparent border-none text-xs font-medium text-foreground focus:outline-none w-full truncate"
                            placeholder="Layer text..."
                          />
                        </div>

                        {config.layers.length > 1 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeLayer(layer.id);
                            }}
                            className="text-muted-foreground hover:text-red-500 p-1 transition-colors"
                            title="Delete Layer"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>

                      {/* Font Size Slider for Selected Layer */}
                      {isSelected && (
                        <div className="mt-3 pt-2.5 border-t border-border/40 flex items-center justify-between gap-3 text-xs">
                          <span className="text-[11px] text-muted-foreground">Size</span>
                          <input
                            type="range"
                            min="0.4"
                            max="2.0"
                            step="0.05"
                            value={layer.sizeMultiplier || 1.0}
                            onChange={(e) => updateActiveLayer("sizeMultiplier", parseFloat(e.target.value))}
                            className="flex-1 accent-amber-500 cursor-pointer h-1.5 rounded-lg bg-muted"
                          />
                          <span className="text-[11px] font-mono text-muted-foreground w-8 text-right">
                            {Math.round((layer.sizeMultiplier || 1.0) * 100)}%
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Typography Selection */}
            <div className="pt-2">
              <label className="text-xs font-medium text-foreground block mb-2">Typeface / Font Style</label>
              
              <div className="relative mb-3">
                <select
                  value={activeLayer.font}
                  onChange={(e) => updateActiveLayer("font", e.target.value)}
                  className="w-full p-2.5 pr-8 text-xs bg-background border border-border/70 rounded-xl focus:outline-none focus:border-amber-500 text-foreground cursor-pointer appearance-none"
                  style={{ fontFamily: activeLayer.font === "UploadedCustomFont" ? "UploadedCustomFont" : `"${activeLayer.font}", sans-serif` }}
                >
                  {config.availableFonts.map((f) => (
                    <option key={f} value={f} style={{ fontFamily: `"${f}", sans-serif` }}>
                      {f}
                    </option>
                  ))}
                  {activeLayer.font === "UploadedCustomFont" && (
                    <option value="UploadedCustomFont">{config.uploadedFontName}</option>
                  )}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              </div>

              {/* Quick Font Preset Chips */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {["Montserrat", "Playfair Display", "Cinzel", "Bebas Neue", "Orbitron"].map(f => (
                  <button
                    key={f}
                    onClick={() => updateActiveLayer("font", f)}
                    className={`px-2.5 py-1 text-[11px] rounded-lg border transition-all duration-75 cursor-pointer active:scale-95 touch-manipulation select-none ${
                      activeLayer.font === f 
                        ? "bg-foreground text-background font-medium" 
                        : "bg-muted/40 text-muted-foreground hover:text-foreground border-border/50"
                    }`}
                    style={{ fontFamily: `"${f}", sans-serif` }}
                  >
                    {f}
                  </button>
                ))}
              </div>

              {/* Custom Font Upload */}
              <div className="pt-2">
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
                  className="w-full py-2 px-3 text-xs rounded-xl border border-dashed border-border hover:border-amber-500/70 text-muted-foreground hover:text-foreground transition-all duration-75 active:scale-[0.98] cursor-pointer touch-manipulation select-none flex items-center justify-center gap-2 bg-muted/20"
                >
                  <Upload size={13} />
                  <span>{config.uploadedFontName ? `Loaded: ${config.uploadedFontName}` : "Upload Custom Font (.ttf / .otf)"}</span>
                </button>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: MATERIAL & DIMENSIONS */}
        {activeTab === "material" && (
          <div className="space-y-6">
            
            {/* Material Cards */}
            <div>
              <label className="text-xs font-medium text-foreground block mb-2.5">Alloy Plate Material</label>
              <div className="space-y-2">
                {materialOptions.map((mat) => {
                  const isSelected = config.material === mat.id;
                  return (
                    <button
                      key={mat.id}
                      onClick={() => updateConfig("material", mat.id)}
                      className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all duration-75 active:scale-[0.98] cursor-pointer touch-manipulation select-none ${
                        isSelected 
                          ? "border-amber-500/80 bg-amber-500/[0.05] shadow-sm" 
                          : "border-border/60 bg-muted/20 hover:border-border"
                      }`}
                    >
                      <div>
                        <div className="text-xs font-semibold text-foreground">{mat.name}</div>
                        <div className="text-[11px] text-muted-foreground mt-0.5">{mat.desc}</div>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-amber-500 text-black flex items-center justify-center shrink-0">
                          <Check size={12} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dimensions */}
            <div className="pt-2 border-t border-border/50">
              <label className="text-xs font-medium text-foreground block mb-2.5">Plate Dimensions (Inches)</label>
              
              <div className="grid grid-cols-3 gap-3">
                <div className="p-2.5 rounded-xl bg-muted/30 border border-border/50">
                  <span className="text-[10px] text-muted-foreground block mb-1">Width</span>
                  <input
                    type="number"
                    min="4"
                    max="36"
                    value={config.size.width}
                    onChange={(e) => updateConfig("size", { ...config.size, width: parseInt(e.target.value) || 4 })}
                    className="w-full bg-transparent text-sm font-semibold text-foreground focus:outline-none"
                  />
                  <span className="text-[10px] text-muted-foreground font-mono">inches</span>
                </div>

                <div className="p-2.5 rounded-xl bg-muted/30 border border-border/50">
                  <span className="text-[10px] text-muted-foreground block mb-1">Height</span>
                  <input
                    type="number"
                    min="2"
                    max="18"
                    value={config.size.height}
                    onChange={(e) => updateConfig("size", { ...config.size, height: parseInt(e.target.value) || 2 })}
                    className="w-full bg-transparent text-sm font-semibold text-foreground focus:outline-none"
                  />
                  <span className="text-[10px] text-muted-foreground font-mono">inches</span>
                </div>

                <div className="p-2.5 rounded-xl bg-muted/30 border border-border/50">
                  <span className="text-[10px] text-muted-foreground block mb-1">Gauge</span>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={config.size.thickness || 3}
                    onChange={(e) => updateConfig("size", { ...config.size, thickness: parseInt(e.target.value) || 1 })}
                    className="w-full bg-transparent text-sm font-semibold text-foreground focus:outline-none"
                  />
                  <span className="text-[10px] text-muted-foreground font-mono">mm solid</span>
                </div>
              </div>
            </div>

            {/* Mounting Hardware */}
            <div className="pt-2 border-t border-border/50">
              <label className="text-xs font-medium text-foreground block mb-2.5">Mounting Hardware</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "Standoffs", label: "4× Standoffs" },
                  { id: "Adhesive", label: "3M High-Bond" },
                  { id: "Desk Stand", label: "Desk Easel" }
                ].map((mount) => (
                  <button
                    key={mount.id}
                    onClick={() => updateConfig("mountingStyle", mount.id)}
                    className={`py-2 px-2 text-xs rounded-xl border text-center transition-all duration-75 active:scale-95 cursor-pointer touch-manipulation select-none ${
                      config.mountingStyle === mount.id
                        ? "border-amber-500 text-foreground bg-amber-500/10 font-medium"
                        : "border-border/60 text-muted-foreground hover:text-foreground bg-muted/20"
                    }`}
                  >
                    {mount.label}
                  </button>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: COLORS & INLAY */}
        {activeTab === "colors" && (
          <div className="space-y-5">
            
            <div>
              <label className="text-xs font-medium text-foreground block mb-2">Engraving / Enamel Palette</label>
              <p className="text-[11px] text-muted-foreground mb-3">Pick an architectural finish for your active layer ({activeLayer.text || "Text"}).</p>

              <div className="grid grid-cols-2 gap-2">
                {colorPalette.map((col) => {
                  const isSelected = (activeLayer.textColors?.[0] || activeLayer.color) === col.value;
                  return (
                    <button
                      key={col.value}
                      onClick={() => {
                        updateActiveLayer("color", col.value);
                        updateActiveLayer("textColors", [col.value]);
                      }}
                      className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition-all duration-75 active:scale-95 cursor-pointer touch-manipulation select-none text-left ${
                        isSelected 
                          ? "border-amber-500 bg-amber-500/[0.05] shadow-sm" 
                          : "border-border/60 hover:border-border bg-muted/20"
                      }`}
                    >
                      <span 
                        className="w-4 h-4 rounded-full border border-black/20 shadow-inner shrink-0" 
                        style={{ backgroundColor: col.value }}
                      />
                      <span className="text-xs font-medium text-foreground truncate">{col.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* TAB 4: ARTWORK & LOGO */}
        {activeTab === "artwork" && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-foreground block mb-1">Company Logo / Emblem</label>
              <p className="text-[11px] text-muted-foreground mb-3">Upload your vectorized logo or transparent PNG to place on the plate.</p>
              
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
                className="w-full py-6 px-4 rounded-2xl border-2 border-dashed border-border hover:border-amber-500/70 text-muted-foreground hover:text-foreground transition-all flex flex-col items-center justify-center gap-2 bg-muted/10 group"
              >
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Upload size={16} className="text-amber-500" />
                </div>
                <span className="text-xs font-medium">
                  {config.uploadedDesignName ? `Change: ${config.uploadedDesignName}` : "Click to select PNG or SVG"}
                </span>
                <span className="text-[10px] text-muted-foreground">High resolution or vector recommended</span>
              </button>

              {config.uploadedDesignUrl && (
                <div className="flex items-center justify-between mt-3 p-3 rounded-xl bg-muted/30 border border-border/50 text-xs">
                  <span className="truncate max-w-[200px] text-foreground">{config.uploadedDesignName}</span>
                  <button
                    onClick={() => {
                      updateConfig("uploadedDesignUrl", null);
                      updateConfig("uploadedDesignName", null);
                    }}
                    className="text-red-500 hover:text-red-400 font-medium text-[11px]"
                  >
                    Remove Logo
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Custom Quote Notice Bar */}
        <div className="p-3 rounded-xl bg-muted/30 border border-border/50 text-[11px] text-muted-foreground">
          <div className="flex justify-between font-medium text-foreground mb-1">
            <span>Custom Fabrication & Bulk Quotes</span>
            <span className="text-amber-500 font-mono">24h Turnaround</span>
          </div>
          <span>Submit your inquiry below the preview to receive a formal quotation and digital proof.</span>
        </div>

      </div>

    </div>
  );
}
