"use client";

import { Upload, Type, Palette, Diamond, MessageCircle, Sliders, ChevronDown, Plus, Trash2, Layers, LayoutTemplate, AlignLeft, AlignCenter, AlignRight, ShoppingCart, CreditCard } from "lucide-react";
import { useRef } from "react";

export default function ControlsPanel({ config, setConfig, price }) {
  const fileInputRef = useRef(null);

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

  const handleOrderWhatsApp = () => {
    const number = "1234567890";
    
    const layerDetails = config.layers.map((l, i) => 
      `Layer ${i+1}: "${l.text.replace(/\n/g, " ")}" (Font: ${l.font === "UploadedCustomFont" ? config.uploadedFontName : l.font}, Color: ${l.color})`
    ).join("\n");

    const text = `Hello! I would like to order a Custom Metal Name Plate.
    
Details:
${layerDetails}
- Material: ${config.material}
- Size: ${config.size.width}x${config.size.height} inches
- Price: ₹${price}

Please confirm!`;
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/${number}?text=${encoded}`, "_blank");
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
    <div className="flex flex-col w-full lg:w-[600px] bg-card text-card-foreground border-l border-border h-full max-h-screen overflow-hidden shadow-2xl z-10 relative">
      <div className="p-5 border-b border-border bg-stone-950 flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Customize</h2>
          <p className="text-xs text-gray-400 mt-1">Design your premium name plate</p>
        </div>
      </div>

      <div className="flex-1 p-5 space-y-6 overflow-y-auto">
        
        {/* Layer Manager */}
        <section className="space-y-3">
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
          <p className="text-xs text-gray-400">Add up to 5 independent text layers. Drag them directly on the preview to position!</p>
          <div className="flex flex-col gap-2">
            {config.layers.map((layer, index) => (
              <div 
                key={layer.id} 
                onClick={() => updateConfig("activeLayerId", layer.id)}
                className={`flex flex-col p-3 rounded-lg border transition-all cursor-pointer ${config.activeLayerId === layer.id ? "border-primary bg-primary/10" : "border-border bg-stone-900/50 hover:border-gray-600"}`}
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
                    className={`flex-1 bg-transparent border-none focus:outline-none resize-none text-sm font-medium ${config.activeLayerId === layer.id ? "text-primary" : "text-gray-300"}`}
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
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2 flex justify-between">
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
        <div className="pt-4 border-t border-border space-y-5 relative">
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
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
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
                className="flex items-center justify-center gap-2 w-full py-1.5 bg-stone-900 border border-stone-700 hover:border-primary rounded-lg text-xs transition-all text-gray-300 hover:text-white"
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

          <section className="space-y-4 pt-4">
            <div className="flex items-center gap-2 text-primary">
              <Palette size={18} />
              <h3 className="font-semibold">Letter Coloring</h3>
            </div>
            
            <div className="flex bg-stone-900 rounded-lg p-1 border border-border">
              {["Single", "Pattern", "Custom"].map(mode => (
                <button
                  key={mode}
                  onClick={() => updateActiveLayer("textColorMode", mode)}
                  className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${activeLayer.textColorMode === mode ? "bg-stone-700 text-white shadow-sm" : "text-gray-500 hover:text-gray-300"}`}
                >
                  {mode}
                </button>
              ))}
            </div>

            {(!activeLayer.textColorMode || activeLayer.textColorMode === "Single") && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Select Color</label>
                <div className="flex flex-wrap gap-2">
                  {colorPalette.map(color => (
                    <button
                      key={color}
                      onClick={() => updateActiveLayer("textColors", [color])}
                      className={`w-6 h-6 rounded-full border-2 transition-all ${(activeLayer.textColors?.[0] || activeLayer.color) === color ? "border-white scale-110 shadow-lg" : "border-transparent hover:scale-105"}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            )}

            {activeLayer.textColorMode === "Pattern" && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Pattern Colors (Click to toggle)</label>
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
                          className={`w-6 h-6 rounded-full border-2 transition-all ${isActive ? "border-white scale-110 shadow-lg" : "border-transparent hover:scale-105 opacity-50"}`}
                          style={{ backgroundColor: color }}
                        />
                      );
                    })}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2 flex justify-between">
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
                <p className="text-xs text-gray-400">Click a character below to select it, then pick a color.</p>
                <div className="flex flex-wrap gap-1 p-3 bg-stone-900 rounded-lg border border-border">
                  {activeLayer.text.split('').map((char, index) => (
                    <button
                      key={index}
                      onClick={() => setConfig(prev => ({ ...prev, activeLayerCharIndex: index }))}
                      className={`w-6 h-6 text-xs flex items-center justify-center font-bold rounded-md transition-all ${config.activeLayerCharIndex === index ? "ring-2 ring-primary bg-primary/20" : "bg-black hover:bg-stone-800"}`}
                      style={{ color: activeLayer.customCharColors?.[index] || activeLayer.textColors?.[0] || activeLayer.color || "#ffffff" }}
                    >
                      {char === " " ? "_" : char}
                    </button>
                  ))}
                </div>
                {config.activeLayerCharIndex !== undefined && (
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">
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
                          className={`w-6 h-6 rounded-full border-2 transition-all ${activeLayer.customCharColors?.[config.activeLayerCharIndex] === color ? "border-white scale-110 shadow-lg" : "border-transparent hover:scale-105"}`}
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
        <div className="pt-4 border-t border-border space-y-5 relative">
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-primary">
              <Diamond size={18} />
              <h3 className="font-semibold">Base Material</h3>
            </div>
            <div className="flex gap-2">
              {["Metal", "Aluminium"].map((mat) => (
                <button
                  key={mat}
                  onClick={() => updateConfig("material", mat)}
                  className={`flex-1 py-2 border rounded-lg transition-all text-sm font-bold ${config.material === mat ? "border-primary bg-primary/10" : "border-border hover:border-gray-500"}`}
                >
                  {mat} Plate
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-2 text-primary">
              <Sliders size={18} />
              <h3 className="font-semibold">Dimensions</h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Width (in)</label>
                <input type="number" value={config.size.width} onChange={(e) => updateConfig("size", { ...config.size, width: parseInt(e.target.value) || 1 })} className="w-full p-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all text-sm" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Height (in)</label>
                <input type="number" value={config.size.height} onChange={(e) => updateConfig("size", { ...config.size, height: parseInt(e.target.value) || 1 })} className="w-full p-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all text-sm" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Thick (mm)</label>
                <input type="number" value={config.size.thickness || 2} onChange={(e) => updateConfig("size", { ...config.size, thickness: parseInt(e.target.value) || 1 })} className="w-full p-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all text-sm" />
              </div>
            </div>
          </section>
        </div>

        {/* Volume Pricing moved to bottom of scrollable area */}
        <div className="mt-8 p-3 bg-stone-900 rounded-xl border border-stone-800">
          <h4 className="text-[10px] font-bold text-primary uppercase tracking-wider mb-2">Volume Discount Applied</h4>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs font-medium text-gray-400">
            <div className="flex justify-between"><span>1 - 10 qty</span> <span className="text-white">₹600 / pc</span></div>
            <div className="flex justify-between"><span>11 - 30 qty</span> <span className="text-white">₹350 / pc</span></div>
            <div className="flex justify-between"><span>31+ qty</span> <span className="text-white">₹150 / pc</span></div>
            <div className="flex justify-between"><span>Base Setup (Fixed)</span> <span className="text-white">₹1,000</span></div>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-border bg-stone-950/80 backdrop-blur-xl shrink-0 z-20 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-gray-400 font-medium">Quantity</span>
          <div className="flex items-center gap-2 bg-stone-900 p-1 rounded-lg border border-stone-800">
            <button 
              onClick={() => updateConfig("quantity", Math.max(1, (config.quantity || 1) - 1))}
              className="w-7 h-7 rounded-md bg-stone-800 text-white flex items-center justify-center hover:bg-stone-700 transition-colors"
            >-</button>
            <span className="font-bold text-sm w-6 text-center">{config.quantity || 1}</span>
            <button 
              onClick={() => updateConfig("quantity", (config.quantity || 1) + 1)}
              className="w-7 h-7 rounded-md bg-stone-800 text-white flex items-center justify-center hover:bg-stone-700 transition-colors"
            >+</button>
          </div>
        </div>
        <div className="flex justify-between items-end mb-4">
          <span className="text-sm text-gray-400 font-medium pb-1">Total</span>
          <span className="text-2xl font-black text-white leading-none">₹{price.toLocaleString('en-IN')}</span>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <button 
              className="flex-1 py-2 bg-stone-800 hover:bg-stone-700 text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all border border-stone-700"
            >
              <ShoppingCart size={16} />
              Add to Cart
            </button>
            <button 
              className="flex-1 py-2 bg-white hover:bg-gray-200 text-black rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all"
            >
              <CreditCard size={16} />
              Buy Now
            </button>
          </div>
          <button 
            onClick={handleOrderWhatsApp}
            className="w-full py-2 bg-[#25D366] hover:bg-[#20b958] text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#25D366]/20 hover:shadow-[#25D366]/40"
          >
            <MessageCircle size={18} />
            Order via WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
