"use client";

import { MessageCircle, Download, Check, Send, Sparkles, X, CheckCircle2, ShieldCheck } from "lucide-react";
import { toPng } from "html-to-image";
import { useState } from "react";
import { INITIAL_LEADS } from "@/lib/adminData";

export default function CheckoutBlock({ config, setConfig, previewRef, isPreview = false }) {
  const [downloading, setDownloading] = useState(false);
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const [submittedInqId, setSubmittedInqId] = useState("");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    quantity: 1,
    notes: ""
  });

  const updateConfig = (key, value) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
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
      link.download = `SouravGraphic_Custom_${config.material}_${config.size.width}x${config.size.height}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Proof download failed", err);
    } finally {
      setDownloading(false);
    }
  };

  const handleSubmitInquiry = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone) return;

    if (isPreview) {
      setSubmittedInqId("PREVIEW-MODE");
      setInquirySubmitted(true);
      return;
    }

    const inqId = `INQ-${Math.floor(1000 + Math.random() * 9000)}`;

    const newLead = {
      id: inqId,
      client: form.name,
      phone: form.phone,
      email: form.email || "inquiry@client.com",
      city: form.city || "Online Studio",
      date: new Date().toISOString().split("T")[0],
      source: "Online 3D Studio",
      material: config.material,
      size: `${config.size.width}" × ${config.size.height}" (${config.size.thickness || 3}mm)`,
      lighting: config.lightingMode ? `${config.lightingMode} Light` : "None",
      mounting: config.mountingStyle || "Standoffs",
      textLayers: config.layers.map(l => ({ line: l.text, font: l.font })),
      quantity: Number(form.quantity) || 1,
      status: "New Inquiry",
      notes: form.notes || "Customizer configuration submitted online."
    };

    try {
      await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: `${config.material} Name Plate`,
          specifications: {
            thickness: `${config.size.thickness || 3} mm`,
            holes: config.mountingStyle || "Standoffs",
            side: "Single Side",
            quantity: Number(form.quantity) || 1,
            colour: "Custom Engraved",
          },
          customer: {
            name: form.name,
            phone: form.phone,
            address: form.city || "Online 3D Studio",
          },
        }),
      });
    } catch (err) {}

    // Save to local storage for Admin Panel
    try {
      const saved = localStorage.getItem("sourav_admin_leads");
      const existing = saved ? JSON.parse(saved) : INITIAL_LEADS;
      localStorage.setItem("sourav_admin_leads", JSON.stringify([newLead, ...existing]));
    } catch (err) {
      console.error("Failed to save lead", err);
    }

    setSubmittedInqId(inqId);
    setInquirySubmitted(true);
  };

  const handleDirectWhatsApp = () => {
    const number = "919876543210";
    
    const layerDetails = config.layers.map((l, i) => 
      `Line ${i+1}: "${l.text.replace(/\n/g, " ")}" (Font: ${l.font})`
    ).join("\n");

    const text = `Hello Sourav Graphic! I customized a name plate on your 3D Studio and want to request a quotation:
    
*Custom Plate Specs:*
${layerDetails}
- Material: ${config.material}
- Dimensions: ${config.size.width}" × ${config.size.height}" (${config.size.thickness || 3}mm)
- Lighting: ${config.lightingMode || "None"}
- Mounting: ${config.mountingStyle}
- Quantity Needed: ${form.quantity || 1} units

Please provide quotation, production turnaround, and digital proof.`;

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/${number}?text=${encoded}`, "_blank");
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl glass-panel shadow-lg border border-border/70 transition-all select-none">
      
      {/* Top Specifications Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        
        {/* Specification Chips */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold border border-amber-500/20">
            {config.material}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-muted text-muted-foreground font-mono font-medium border border-border">
            {config.size.width}" × {config.size.height}"
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-muted text-muted-foreground font-medium border border-border">
            {config.layers.length} Text {config.layers.length > 1 ? "Layers" : "Layer"}
          </span>
        </div>

        {/* Lead Generation Prompt */}
        <div className="text-xs text-muted-foreground font-medium flex items-center gap-1.5 sm:text-right">
          <Sparkles size={13} className="text-amber-500 shrink-0" />
          <span>Instant Quote & Workshop Specs</span>
        </div>

      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        
        {/* Primary Inquiry Trigger */}
        <button
          onClick={() => {
            setIsInquiryModalOpen(true);
            setInquirySubmitted(false);
          }}
          className="sm:col-span-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-zinc-950 transition-all shadow-md shadow-amber-500/20 active:scale-98"
        >
          <Send size={14} />
          <span>Send Inquiry / Get Quote</span>
        </button>

        {/* WhatsApp Direct Inquiry */}
        <button
          onClick={handleDirectWhatsApp}
          className="inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-sm active:scale-98"
        >
          <MessageCircle size={15} />
          <span>Inquire on WhatsApp</span>
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

      </div>

      {/* INQUIRY SUBMISSION MODAL */}
      {isInquiryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl max-w-md w-full p-6 shadow-2xl relative space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <h3 className="text-base font-extrabold text-foreground">Submit Design Inquiry</h3>
                <p className="text-[11px] text-muted-foreground">Our fabrication team will share formal pricing and production proof</p>
              </div>
              <button
                onClick={() => setIsInquiryModalOpen(false)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground"
              >
                <X size={18} />
              </button>
            </div>

            {inquirySubmitted ? (
              <div className="py-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-500/20">
                  <CheckCircle2 size={26} />
                </div>
                <h4 className="font-bold text-sm text-foreground">Inquiry Sent Successfully!</h4>
                <div className="p-3 rounded-xl bg-muted/60 border border-border text-xs text-muted-foreground space-y-1">
                  <div>Reference Inquiry ID: <strong className="font-mono text-foreground font-bold">{submittedInqId}</strong></div>
                  <div>We will contact you via WhatsApp / Call within 2 hours.</div>
                </div>
                <div className="pt-2 flex flex-col gap-2">
                  <button
                    onClick={handleDirectWhatsApp}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <MessageCircle size={15} />
                    <span>Open Inquiry on WhatsApp</span>
                  </button>
                  <button
                    onClick={() => setIsInquiryModalOpen(false)}
                    className="w-full py-2 rounded-xl bg-muted text-muted-foreground hover:text-foreground text-xs font-semibold"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitInquiry} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-muted-foreground font-medium mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma / Apex Corp"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground focus:ring-1 focus:ring-amber-500 focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-muted-foreground font-medium mb-1">WhatsApp / Phone *</label>
                    <input
                      type="text"
                      required
                      placeholder="98XXXXXXXX"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground font-mono focus:ring-1 focus:ring-amber-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-muted-foreground font-medium mb-1">Quantity Needed</label>
                    <input
                      type="number"
                      min="1"
                      value={form.quantity}
                      onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground font-mono focus:ring-1 focus:ring-amber-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-muted-foreground font-medium mb-1">City / Location</label>
                    <input
                      type="text"
                      placeholder="e.g. New Delhi"
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground focus:ring-1 focus:ring-amber-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-muted-foreground font-medium mb-1">Email ID (Optional)</label>
                    <input
                      type="email"
                      placeholder="name@gmail.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground focus:ring-1 focus:ring-amber-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-muted-foreground font-medium mb-1">Project Notes / Timeline</label>
                  <textarea
                    rows="2"
                    placeholder="Any specific laser relief requirements or deadline..."
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-background border border-border text-foreground focus:ring-1 focus:ring-amber-500 focus:outline-hidden"
                  />
                </div>

                {/* Selected Design Attach Notice */}
                <div className="p-2.5 rounded-xl bg-muted/60 border border-border/80 flex items-center gap-2 text-[11px] text-muted-foreground">
                  <ShieldCheck size={14} className="text-amber-500 shrink-0" />
                  <span>Your current plate dimensions ({config.size.width}"×{config.size.height}") & metal choice ({config.material}) will be attached automatically.</span>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsInquiryModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-muted text-muted-foreground hover:text-foreground font-semibold text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-amber-500 text-zinc-950 font-bold text-xs hover:bg-amber-400 transition-colors shadow-md shadow-amber-500/20"
                  >
                    Send Inquiry
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
