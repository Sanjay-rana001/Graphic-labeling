"use client";

import { ShoppingCart, CreditCard, MessageCircle, Download } from "lucide-react";
import { toPng } from "html-to-image";
import { motion } from "framer-motion";

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
    if (!previewRef?.current) {
      alert("Preview not found");
      return;
    }
    try {
      const dataUrl = await toPng(previewRef.current, { 
        backgroundColor: "#1e1e1e",
        pixelRatio: 2
      });
      const link = document.createElement("a");
      link.download = "LuxePlates_Proof.png";
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Error generating proof", err);
      alert("Error generating proof: " + err.message);
    }
  };

  return (
    <div className="p-4 border-t border-border bg-card/80 backdrop-blur-xl shrink-0 z-20 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] lg:shadow-sm lg:bg-card/90 lg:border lg:border-border lg:rounded-xl lg:m-4 lg:mb-8 transition-colors duration-300">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4 gap-4">
        <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-start">
          <span className="text-sm text-muted-foreground font-medium">Quantity</span>
          <div className="flex items-center gap-2 bg-muted p-1 rounded-lg border border-border">
            <button 
              onClick={() => updateConfig("quantity", Math.max(1, (config.quantity || 1) - 1))}
              className="w-7 h-7 rounded-md bg-card text-foreground shadow-sm flex items-center justify-center hover:bg-accent transition-colors"
            >-</button>
            <span className="font-bold text-sm w-6 text-center text-foreground">{config.quantity || 1}</span>
            <button 
              onClick={() => updateConfig("quantity", (config.quantity || 1) + 1)}
              className="w-7 h-7 rounded-md bg-card text-foreground shadow-sm flex items-center justify-center hover:bg-accent transition-colors"
            >+</button>
          </div>
        </div>
        <div className="flex items-end justify-between w-full lg:w-auto">
          <span className="text-sm text-muted-foreground font-medium pb-1 lg:hidden">Total</span>
          <span className="hidden lg:inline-block text-sm text-muted-foreground font-medium pb-1 mr-3">Total:</span>
          <span className="text-2xl font-black text-foreground leading-none">₹{price.toLocaleString('en-IN')}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Add to Cart Button */}
        <motion.button 
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 500, damping: 15 }}
          className="group w-full py-2.5 bg-card hover:bg-accent text-foreground rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors border border-border shadow-sm hover:shadow-md"
        >
          <ShoppingCart size={16} className="transition-transform duration-150 group-hover:-rotate-12 group-hover:scale-110" />
          <span>Add to Cart</span>
        </motion.button>

        {/* Buy Now Button */}
        <motion.button 
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 500, damping: 15 }}
          className="group w-full py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors shadow-md hover:shadow-lg"
        >
          <CreditCard size={16} className="transition-transform duration-150 group-hover:scale-110" />
          <span>Buy Now</span>
        </motion.button>

        {/* Order via WhatsApp Button */}
        <motion.button 
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 500, damping: 15 }}
          onClick={handleOrderWhatsApp}
          className="group w-full py-2.5 bg-[#25D366] hover:bg-[#20b958] text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors shadow-md hover:shadow-lg"
        >
          <MessageCircle size={18} className="transition-transform duration-150 group-hover:rotate-12 group-hover:scale-110" />
          <span>Order via WhatsApp</span>
        </motion.button>

        {/* Download Digital Proof Button */}
        <motion.button 
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 500, damping: 15 }}
          onClick={handleDownloadProof}
          className="group w-full py-2.5 bg-card hover:bg-accent text-foreground rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors border border-dashed border-border hover:border-primary shadow-sm hover:shadow-md"
        >
          <Download size={18} className="transition-transform duration-150 group-hover:translate-y-1 text-muted-foreground group-hover:text-primary" />
          <span>Download Digital Proof</span>
        </motion.button>
      </div>
    </div>
  );
}
