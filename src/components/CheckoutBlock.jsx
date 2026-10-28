"use client";

import { ShoppingCart, MessageCircle, Download, Check } from "lucide-react";
import { toPng } from "html-to-image";
import { useState } from "react";

export default function CheckoutBlock({ config, setConfig, price, previewRef }) {
  const [downloading, setDownloading] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const updateConfig = (key, value) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const handleOrderWhatsApp = () => {
    const number = "919876543210";
    
    const layerDetails = config.layers.map((l, i) => 
      `Line ${i+1}: "${l.text.replace(/\n/g, " ")}" (Font: ${l.font === "UploadedCustomFont" ? config.uploadedFontName : l.font})`
    ).join("\n");

    const text = `Hello Saourav Graphic! I customized a Name Plate on your studio:
    
*Details:*
${layerDetails}
- Material: ${config.material}
- Size: ${config.size.width}" × ${config.size.height}" (${config.size.thickness || 3}mm)
- Mounting: ${config.mountingStyle}
- Quantity: ${config.quantity || 1} units
- Estimated Total: ₹${price.toLocaleString('en-IN')}

Please share payment details and digital proof!`;
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/${number}?text=${encoded}`, "_blank");
  };

  const handleDownloadProof = async () => {
    if (!previewRef?.current) return;
    try {
      setDownloading(true);
      const dataUrl = await toPng(previewRef.current, { 
        backgroundColor: "#090a0f",
        pixelRatio: 2,
        cacheBust: true,
      });
      const link = document.createElement("a");
      link.download = `SaouravGraphic_${config.material}_${config.size.width}x${config.size.height}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Proof download failed", err);
    } finally {
      setDownloading(false);
    }
  };

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3000);
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl glass-panel shadow-lg border border-border/70 transition-all select-none">
      
      {/* Top Details & Price */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        
        {/* Quantity Stepper */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground font-medium">Quantity</span>
          <div className="flex items-center gap-1.5 bg-muted/60 p-1 rounded-xl border border-border/60">
            <button 
              onClick={() => updateConfig("quantity", Math.max(1, (config.quantity || 1) - 1))}
              className="w-6 h-6 rounded-lg bg-card text-foreground shadow-xs flex items-center justify-center hover:bg-muted transition-colors text-xs font-semibold"
            >
              -
            </button>
            <span className="font-mono font-semibold text-xs w-7 text-center text-foreground">
              {config.quantity || 1}
            </span>
            <button 
              onClick={() => updateConfig("quantity", (config.quantity || 1) + 1)}
              className="w-6 h-6 rounded-lg bg-card text-foreground shadow-xs flex items-center justify-center hover:bg-muted transition-colors text-xs font-semibold"
            >
              +
            </button>
          </div>
          {(config.quantity || 1) >= 10 && (
            <span className="text-[10px] font-medium text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
              Bulk Discount Applied
            </span>
          )}
        </div>

        {/* Total Price */}
        <div className="flex items-baseline justify-between sm:justify-end gap-2">
          <span className="text-xs text-muted-foreground font-normal">Project Total:</span>
          <span className="text-xl sm:text-2xl font-bold text-foreground font-mono leading-none">
            ₹{price.toLocaleString('en-IN')}
          </span>
        </div>

      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        
        {/* WhatsApp Order (Primary) */}
        <button
          onClick={handleOrderWhatsApp}
          className="sm:col-span-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-sm active:scale-98"
        >
          <MessageCircle size={15} />
          <span>Confirm on WhatsApp</span>
        </button>

        {/* Download Digital Proof */}
        <button
          onClick={handleDownloadProof}
          disabled={downloading}
          className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-medium bg-muted/50 hover:bg-muted text-foreground border border-border/60 transition-all active:scale-98"
        >
          <Download size={14} className="text-muted-foreground" />
          <span>{downloading ? "Rendering PNG..." : "Download Proof"}</span>
        </button>

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-medium bg-card hover:bg-muted/40 text-foreground border border-border/60 transition-all active:scale-98"
        >
          {addedToCart ? (
            <>
              <Check size={14} className="text-emerald-500" />
              <span className="text-emerald-500 font-semibold">Config Saved</span>
            </>
          ) : (
            <>
              <ShoppingCart size={14} className="text-muted-foreground" />
              <span>Save Configuration</span>
            </>
          )}
        </button>

      </div>

    </div>
  );
}
