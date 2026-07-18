"use client";

import { ShoppingCart, CreditCard, MessageCircle, Download } from "lucide-react";
import html2canvas from "html2canvas";

export default function CheckoutBlock({ config, setConfig, price, previewRef }) {
  const updateConfig = (key, value) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
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

  const handleDownloadProof = async () => {
    if (!previewRef?.current) return;
    try {
      const canvas = await html2canvas(previewRef.current, { backgroundColor: "#1e1e1e" });
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = "LuxePlates_Proof.png";
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Error generating proof", err);
    }
  };

  return (
    <div className="p-4 border-t border-border bg-stone-950/80 backdrop-blur-xl shrink-0 z-20 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] lg:shadow-none lg:bg-stone-950/50 lg:border-t-0 lg:rounded-xl lg:m-4 lg:mb-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4 gap-4">
        <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-start">
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
        <div className="flex items-end justify-between w-full lg:w-auto">
          <span className="text-sm text-gray-400 font-medium pb-1 lg:hidden">Total</span>
          <span className="hidden lg:inline-block text-sm text-gray-400 font-medium pb-1 mr-3">Total:</span>
          <span className="text-2xl font-black text-white leading-none">₹{price.toLocaleString('en-IN')}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        <button 
          className="w-full py-2 bg-stone-800 hover:bg-stone-700 text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all border border-stone-700"
        >
          <ShoppingCart size={16} />
          Add to Cart
        </button>
        <button 
          className="w-full py-2 bg-white hover:bg-gray-200 text-black rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all"
        >
          <CreditCard size={16} />
          Buy Now
        </button>
        <button 
          onClick={handleOrderWhatsApp}
          className="w-full py-2 bg-[#25D366] hover:bg-[#20b958] text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#25D366]/20 hover:shadow-[#25D366]/40"
        >
          <MessageCircle size={18} />
          Order via WhatsApp
        </button>
        <button 
          onClick={handleDownloadProof}
          className="w-full py-2 bg-stone-800 hover:bg-stone-700 text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all border border-stone-700"
        >
          <Download size={18} />
          Download Digital Proof
        </button>
      </div>
    </div>
  );
}
