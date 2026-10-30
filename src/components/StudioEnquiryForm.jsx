"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  Upload,
  CheckCircle2,
  AlertCircle,
  X,
  Send,
  ArrowLeft,
  FileText,
  Check,
  MessageCircle,
  Image as ImageIcon,
  Layers,
  CircleDot,
  Palette,
  Hash,
  User,
  Phone,
  MapPin,
  RefreshCw,
  Maximize2,
  Minimize2,
  ShieldCheck,
  Award,
  Printer,
  Home,
  Tag,
  Plus,
  Minus,
} from "lucide-react";
import { useTheme } from "./ThemeProvider";
import SweepButton from "./SweepButton";
import ThemeToggle from "./ThemeToggle";
import { INITIAL_LEADS } from "@/lib/adminData";

const PRODUCT_OPTIONS = [
  {
    id: "Aluminium Name Plate",
    label: "Aluminium Name Plate",
    shortDesc: "Anodized & etched industrial plates",
    icon: Award,
  },
  {
    id: "Aluminium Etching Plate",
    label: "Aluminium Etching Plate",
    shortDesc: "Deep acid-etched enamel-filled plates",
    icon: Layers,
  },
  {
    id: "QR & Barcode Metal Tag",
    label: "QR & Barcode Metal Tag",
    shortDesc: "Laser-marked QR & serial asset tags",
    icon: Tag,
  },
  {
    id: "SS 304 Etched Plate",
    label: "SS 304 Etched Plate",
    shortDesc: "Corrosion-proof SS 304/316 tags",
    icon: ShieldCheck,
  },
  {
    id: "Brass & Gold Plate",
    label: "Brass & Gold Plate",
    shortDesc: "Mirror & brushed brass nameplates",
    icon: Award,
  },
  {
    id: "Polycarbonate Sticker",
    label: "Polycarbonate Sticker",
    shortDesc: "Lexan Graphic Overlay & Control Stickers",
    icon: Printer,
  },
  {
    id: "Danger & Safety Plate",
    label: "Danger & Safety Plate",
    shortDesc: "High-voltage & factory safety plates",
    icon: ShieldCheck,
  },
  {
    id: "Black Anodized Tag",
    label: "Black Anodized Tag",
    shortDesc: "High-contrast black laser-etched tags",
    icon: Tag,
  },
  {
    id: "Cabin & Door Plate",
    label: "Cabin & Door Plate",
    shortDesc: "Corporate office & industrial room plates",
    icon: Home,
  },
  {
    id: "Acrylic Sign Board",
    label: "Acrylic Sign Board",
    shortDesc: "Laser-cut UV printed acrylic signage",
    icon: Layers,
  },
  {
    id: "Inspection Punch Tag",
    label: "Inspection Punch Tag",
    shortDesc: "Calibration & QC punchable date tags",
    icon: Tag,
  },
  {
    id: "CNG Compliance Plate",
    label: "CNG Compliance Plate",
    shortDesc: "Automotive & cylinder compliance plates",
    icon: ShieldCheck,
  },
];

const THICKNESS_OPTIONS = ["0.3 mm", "0.5 mm", "0.7 mm", "0.91 mm", "1.5 mm", "2.0 mm"];
const HOLES_OPTIONS = ["1 mm", "2 mm", "3 mm", "4 mm", "5 mm", "No Holes"];
const SIDE_OPTIONS = ["Single Side", "Double Side"];
const COLOUR_OPTIONS = [
  { label: "Single Colour", dots: ["#f59e0b"] },
  { label: "Double Colour", dots: ["#f59e0b", "#3b82f6"] },
  { label: "Three Colour", dots: ["#f59e0b", "#3b82f6", "#10b981"] },
  { label: "Four Colour", dots: ["#ef4444", "#f59e0b", "#3b82f6", "#10b981"] },
];

export default function StudioEnquiryForm({
  studioSettings = {},
  isPreview = false,
  onExitPreview = null,
}) {
  const { isDarkMode } = useTheme();
  const fileInputRef = useRef(null);

  const [selectedProduct, setSelectedProduct] = useState("Aluminium Name Plate");
  const [designFile, setDesignFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState("");
  const [imageFit, setImageFit] = useState("contain"); // 'contain' | 'cover'
  const [showHoleOverlay, setShowHoleOverlay] = useState(true);

  const [specs, setSpecs] = useState({
    thickness: "0.7 mm",
    holes: "2 mm",
    side: "Single Side",
    quantity: Math.max(1, Number(studioSettings.minQuantity) || 1),
    colour: "Single Colour",
  });

  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedEnquiry, setSubmittedEnquiry] = useState(null);
  const [previewNotice, setPreviewNotice] = useState("");

  const maxFileSizeMB = Number(studioSettings.maxFileSizeMB) || 10;

  const formatFileSize = (bytes) => {
    if (!bytes) return "";
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleFileSelect = (file) => {
    setFileError("");
    if (!file) return;

    const maxBytes = maxFileSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
      setFileError(`File size exceeds ${maxFileSizeMB} MB limit.`);
      return;
    }

    const isImage =
      file.type.startsWith("image/") ||
      /\.(png|jpe?g|webp|gif|svg|bmp)$/i.test(file.name);

    if (isImage) {
      const reader = new FileReader();
      reader.onload = () => {
        setDesignFile({
          fileName: file.name,
          fileType: file.type || "image/png",
          fileSize: file.size,
          previewUrl: typeof reader.result === "string" ? reader.result : null,
        });
      };
      reader.readAsDataURL(file);
    } else {
      setDesignFile({
        fileName: file.name,
        fileType: file.name.split(".").pop()?.toUpperCase() || "DOCUMENT",
        fileSize: file.size,
        previewUrl: null,
      });
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setPreviewNotice("");

    if (!customer.name.trim()) {
      setFormError("Please enter your full name.");
      return;
    }
    if (customer.phone.replace(/\D/g, "").length < 7) {
      setFormError("Please enter a valid 10-digit mobile / WhatsApp number.");
      return;
    }
    if (!customer.address.trim()) {
      setFormError("Please enter your complete delivery address.");
      return;
    }

    if (isPreview) {
      setPreviewNotice(
        "Admin Preview Verified — Form & photo preview work properly! (No real lead created in preview mode)"
      );
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: selectedProduct,
          specifications: {
            ...specs,
            quantity: Math.max(1, Number(specs.quantity) || 1),
          },
          customer,
          designFile,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit enquiry.");
      }

      try {
        const saved = localStorage.getItem("sourav_admin_leads");
        const existing = saved ? JSON.parse(saved) : INITIAL_LEADS;
        const merged = [
          data.enquiry,
          ...existing.filter((item) => item.id !== data.enquiry.id),
        ];
        localStorage.setItem("sourav_admin_leads", JSON.stringify(merged));
      } catch (err) {}

      setSubmittedEnquiry(data.enquiry);
    } catch (err) {
      setFormError(err.message || "Error submitting enquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Hole indicator size in px for visual preview
  const holeRadiusPx =
    specs.holes === "No Holes"
      ? 0
      : specs.holes === "1 mm"
      ? 6
      : specs.holes === "2 mm"
      ? 8
      : specs.holes === "3 mm"
      ? 10
      : specs.holes === "4 mm"
      ? 12
      : 14;

  return (
    <div className="flex flex-col min-h-screen lg:h-screen lg:overflow-hidden bg-background text-foreground relative select-none">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.png,.jpg,.jpeg,.webp,.svg,.pdf,.ai,.cdr,.eps"
        className="hidden"
        onChange={(e) => {
          handleFileSelect(e.target.files?.[0]);
          e.target.value = "";
        }}
      />

      {/* Admin Preview Top Banner */}
      {isPreview && (
        <div className="sticky top-0 z-50 bg-zinc-950 text-white px-4 py-2 border-b border-amber-500/40 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-amber-500 text-zinc-950 font-black uppercase tracking-wider text-[10px]">
              Admin Preview
            </span>
            <span className="text-zinc-300 font-medium">
              Direct Photo Upload & Enquiry Mode — Leads are simulated in preview.
            </span>
          </div>
          {onExitPreview && (
            <button
              type="button"
              onClick={onExitPreview}
              className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft size={13} /> Back to Admin Settings
            </button>
          )}
        </div>
      )}

      {/* Mobile Top Header */}
      <header className="w-full lg:hidden flex items-center justify-between px-4 py-3 border-b border-border/60 bg-background/80 backdrop-blur-md sticky top-0 z-40">
        <SweepButton href="/" label="Home" type="back" size="sm" />
        <Link
          href="/"
          prefetch={true}
          className="relative flex items-center h-8 w-24 cursor-pointer active:scale-95 transition-transform duration-75"
        >
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-[68px] w-24 pointer-events-none">
            <Image
              src="/Media/Logo.png"
              alt="Logo"
              fill
              sizes="160px"
              className="object-contain object-center scale-[1.08]"
              priority
            />
          </div>
        </Link>
        <ThemeToggle size="sm" />
      </header>

      {/* Main Split-Screen Container */}
      <div className="flex flex-col lg:flex-row flex-1 lg:overflow-hidden">
        {/* ══════════════════════════════════════════════════════════════════
            LEFT SIDE: LIVE PHOTO UPLOAD & SPECIMEN PREVIEW STAGE
           ══════════════════════════════════════════════════════════════════ */}
        <div className="w-full lg:flex-1 flex flex-col justify-between relative bg-muted/10 lg:h-full lg:overflow-hidden border-b lg:border-b-0 lg:border-r border-border/60">
          {/* Ambient radial glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.06)_0%,transparent_70%)] pointer-events-none" />

          {/* Desktop Header */}
          <div className="hidden lg:flex items-center justify-between px-6 py-3.5 border-b border-border/40 shrink-0 z-10">
            <div className="flex items-center gap-4">
              <SweepButton href="/" label="Back to Home" type="back" size="sm" />
              <div className="h-4 w-px bg-border/60" />
              <Link
                href="/"
                prefetch={true}
                className="relative flex items-center h-9 w-28 cursor-pointer group active:scale-95 transition-transform duration-75"
              >
                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-[76px] w-28 transition-transform duration-150 group-hover:scale-105 pointer-events-none">
                  <Image
                    src="/Media/Logo.png"
                    alt="Logo"
                    fill
                    sizes="180px"
                    className="object-contain object-center scale-[1.08]"
                    priority
                  />
                </div>
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-pill text-[11px] font-semibold text-muted-foreground border border-border/60">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Direct Artwork Upload • Live Preview</span>
              </div>
              <ThemeToggle size="sm" />
            </div>
          </div>

          {/* Center Photo Upload & Live Preview Stage */}
          <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 relative z-10 min-h-[340px] lg:min-h-0 overflow-hidden">
            {/* Floating Preview Controls Toolbar (when photo is uploaded) */}
            <AnimatePresence>
              {designFile && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-3 flex flex-wrap items-center gap-2 px-3 py-1.5 rounded-full bg-card/90 backdrop-blur-md border border-border/80 shadow-lg text-xs"
                >
                  <span className="font-bold text-amber-500 flex items-center gap-1.5 px-2">
                    <ImageIcon size={13} />
                    <span className="max-w-[160px] truncate">{designFile.fileName}</span>
                    <span className="text-[10px] opacity-60 font-mono">
                      ({formatFileSize(designFile.fileSize)})
                    </span>
                  </span>

                  <div className="h-3.5 w-px bg-border" />

                  {designFile.previewUrl && (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          setImageFit((prev) =>
                            prev === "contain" ? "cover" : "contain"
                          )
                        }
                        className="px-2.5 py-1 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground font-semibold flex items-center gap-1 transition-colors"
                        title="Toggle Image Fit"
                      >
                        {imageFit === "contain" ? (
                          <>
                            <Maximize2 size={12} /> Fill Frame
                          </>
                        ) : (
                          <>
                            <Minimize2 size={12} /> Fit Full Photo
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowHoleOverlay((v) => !v)}
                        className={`px-2.5 py-1 rounded-full font-semibold flex items-center gap-1 transition-colors ${
                          showHoleOverlay
                            ? "bg-amber-500/15 text-amber-500"
                            : "hover:bg-muted text-muted-foreground"
                        }`}
                      >
                        <CircleDot size={12} />
                        <span>Holes ({specs.holes})</span>
                      </button>
                    </>
                  )}

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-2.5 py-1 rounded-full bg-amber-500 text-zinc-950 font-extrabold flex items-center gap-1 hover:brightness-110 transition-all"
                  >
                    <RefreshCw size={11} /> Change Photo
                  </button>

                  <button
                    type="button"
                    onClick={() => setDesignFile(null)}
                    className="p-1 rounded-full bg-red-500/15 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                    title="Remove Uploaded Photo"
                  >
                    <X size={13} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* THE PREVIEW FRAME / DROPZONE */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => {
                if (!designFile) fileInputRef.current?.click();
              }}
              className={`w-full max-w-4xl 2xl:max-w-5xl flex-1 max-h-[480px] 2xl:max-h-[600px] rounded-2xl relative overflow-hidden transition-all duration-300 flex flex-col items-center justify-center border-2 ${
                designFile
                  ? isDarkMode
                    ? "bg-zinc-950/90 border-amber-500/40 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)]"
                    : "bg-white border-amber-500/50 shadow-[0_20px_50px_-15px_rgba(13,30,27,0.12)]"
                  : isDragging
                  ? "border-amber-500 bg-amber-500/10 scale-[1.01] cursor-pointer"
                  : isDarkMode
                  ? "border-dashed border-white/20 hover:border-amber-400/60 bg-zinc-900/40 hover:bg-zinc-900/70 cursor-pointer"
                  : "border-dashed border-emerald-950/25 hover:border-amber-500 bg-white/70 hover:bg-white cursor-pointer shadow-sm"
              }`}
            >
              {/* Subtle Industrial Blueprint Grid Inside Frame */}
              <div
                className="absolute inset-0 opacity-[0.06] pointer-events-none"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                }}
              />

              {/* Corner Mounting Hole Overlays (Dynamic based on Holes selection) */}
              {showHoleOverlay && holeRadiusPx > 0 && (
                <>
                  {[
                    "top-4 left-4",
                    "top-4 right-4",
                    "bottom-4 left-4",
                    "bottom-4 right-4",
                  ].map((pos, idx) => (
                    <div
                      key={idx}
                      style={{
                        width: `${holeRadiusPx * 2}px`,
                        height: `${holeRadiusPx * 2}px`,
                      }}
                      className={`absolute ${pos} rounded-full border-2 border-amber-500/80 bg-zinc-950/80 shadow-inner z-20 flex items-center justify-center pointer-events-none transition-all duration-300`}
                      title={`Mounting Hole: ${specs.holes}`}
                    >
                      <div className="w-1 h-1 rounded-full bg-amber-400/60" />
                    </div>
                  ))}
                </>
              )}

              {/* STATE 1: NO PHOTO UPLOADED YET -> LUXURY UPLOAD PROMPT */}
              {!designFile ? (
                <div className="p-6 sm:p-10 text-center max-w-md mx-auto flex flex-col items-center z-10">
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                    className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-500/20 via-amber-500/10 to-transparent border border-amber-500/40 flex items-center justify-center text-amber-500 mb-5 shadow-lg shadow-amber-500/10"
                  >
                    <Upload size={34} strokeWidth={2.2} />
                  </motion.div>

                  <span className="px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-500 text-[10px] font-black uppercase tracking-widest mb-2.5">
                    Step 1 • Direct Photo / Design Upload
                  </span>

                  <h2 className="text-lg sm:text-xl font-black tracking-tight mb-1.5">
                    Upload Your Artwork or Reference Photo
                  </h2>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-5">
                    Drop your design photo here or click to browse. Your uploaded photo will appear right here in live preview alongside your chosen specifications.
                  </p>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 text-zinc-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/25 hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
                  >
                    <ImageIcon size={16} />
                    <span>Select Photo from Device</span>
                  </button>

                  <div className="flex flex-wrap items-center justify-center gap-1.5 mt-5">
                    {["JPG", "PNG", "WEBP", "SVG", "PDF", "CDR", "AI"].map(
                      (ext) => (
                        <span
                          key={ext}
                          className="px-2 py-0.5 rounded-md bg-muted/80 border border-border text-[10px] font-mono font-bold text-muted-foreground"
                        >
                          .{ext}
                        </span>
                      )
                    )}
                    <span className="text-[10px] text-muted-foreground ml-1">
                      • Max {maxFileSizeMB}MB
                    </span>
                  </div>

                  {fileError && (
                    <div className="mt-3 px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-bold flex items-center gap-1.5">
                      <AlertCircle size={13} />
                      <span>{fileError}</span>
                    </div>
                  )}
                </div>
              ) : designFile.previewUrl ? (
                /* STATE 2: IMAGE PHOTO UPLOADED -> LARGE CRYSTAL CLEAR LIVE PREVIEW */
                <div className="relative w-full h-full flex items-center justify-center p-6 sm:p-8 z-10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={designFile.previewUrl}
                    alt={designFile.fileName}
                    className={`max-w-full max-h-full rounded-xl transition-all duration-300 shadow-2xl ${
                      imageFit === "cover"
                        ? "w-full h-full object-cover"
                        : "object-contain max-h-[330px]"
                    }`}
                  />

                  {/* Bottom-left live badge on the photo frame */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3.5 py-1.5 rounded-full bg-zinc-950/85 backdrop-blur-md border border-white/15 text-white text-[11px] font-bold flex items-center gap-2 shadow-lg whitespace-nowrap">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>{selectedProduct}</span>
                    <span className="text-zinc-400">•</span>
                    <span className="text-amber-400">{specs.thickness}</span>
                    <span className="text-zinc-400">•</span>
                    <span>Holes: {specs.holes}</span>
                  </div>
                </div>
              ) : (
                /* STATE 3: NON-IMAGE CAD/PDF FILE UPLOADED */
                <div className="p-8 text-center flex flex-col items-center z-10">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 flex items-center justify-center mb-3">
                    <FileText size={32} />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 text-[10px] font-black uppercase">
                    Production File Attached
                  </span>
                  <h3 className="text-base font-extrabold mt-2">
                    {designFile.fileName}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {designFile.fileType} • {formatFileSize(designFile.fileSize)}
                  </p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-4 px-4 py-2 rounded-xl bg-muted hover:bg-muted/80 text-xs font-bold"
                  >
                    Replace File
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Live Specification Bar on Left Stage */}
          <div className="px-4 sm:px-6 py-3.5 border-t border-border/50 bg-card/60 backdrop-blur-md shrink-0 z-10">
            <div className="flex flex-wrap items-center justify-between gap-2 max-w-3xl mx-auto text-xs">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mr-1">
                  Live Spec Summary:
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-500 font-extrabold">
                  {selectedProduct}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-muted border border-border font-bold">
                  Thickness: {specs.thickness}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-muted border border-border font-bold">
                  Holes: {specs.holes}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-muted border border-border font-bold">
                  {specs.side}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-muted border border-border font-bold">
                  {specs.colour}
                </span>
              </div>
              <div className="px-3 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 font-black font-mono">
                Qty: {specs.quantity} pcs
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            RIGHT SIDE: COMPACT LUXURY SPECIFICATION & LEAD GENERATION DRAWER
           ══════════════════════════════════════════════════════════════════ */}
        <div className="w-full lg:w-[500px] xl:w-[560px] 2xl:w-[660px] lg:h-full flex flex-col bg-card border-l border-border/60 z-20 lg:overflow-hidden">
          {submittedEnquiry ? (
            /* ── LEAD SUBMITTED SUCCESS STATE ── */
            <div className="flex-1 p-6 sm:p-8 flex flex-col items-center justify-center text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-16 h-16 rounded-3xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/10"
              >
                <CheckCircle2 size={34} />
              </motion.div>

              <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-500 text-[10px] font-black uppercase tracking-widest mb-2">
                Enquiry Reference • {submittedEnquiry.id}
              </span>

              <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                Enquiry Submitted Successfully!
              </h2>
              <p className="text-xs text-muted-foreground mt-1.5 max-w-sm leading-relaxed">
                Thank you, <strong>{submittedEnquiry.client}</strong>! Your design photo and specifications have been sent directly to our production team.
              </p>

              {/* Summary Card */}
              <div className="w-full max-w-md mt-5 p-4 rounded-2xl bg-muted/50 border border-border text-left space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reference ID:</span>
                  <span className="font-mono font-black text-amber-500">
                    {submittedEnquiry.id}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Product:</span>
                  <span className="font-bold">{submittedEnquiry.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Specifications:</span>
                  <span className="font-semibold">
                    {submittedEnquiry.specifications?.thickness} • Holes{" "}
                    {submittedEnquiry.specifications?.holes} •{" "}
                    {submittedEnquiry.specifications?.side}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Colour & Qty:</span>
                  <span className="font-bold text-emerald-500">
                    {submittedEnquiry.specifications?.colour} • Qty{" "}
                    {submittedEnquiry.quantity}
                  </span>
                </div>
                {submittedEnquiry.designFile?.fileName && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Uploaded Photo:</span>
                    <span className="font-mono font-semibold truncate max-w-[200px]">
                      {submittedEnquiry.designFile.fileName}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 mt-6 w-full max-w-md">
                <a
                  href={`https://wa.me/${(() => {
                    const raw =
                      studioSettings?.factoryInfo?.whatsapp || "9876543210";
                    const digits = String(raw).replace(/\D/g, "");
                    return digits.length === 10 ? `91${digits}` : digits || "919876543210";
                  })()}?text=${encodeURIComponent(
                    `Hi Sourav Graphic! I just submitted Enquiry *${submittedEnquiry.id}* for *${submittedEnquiry.category}* (${submittedEnquiry.specifications?.thickness}, Holes: ${submittedEnquiry.specifications?.holes}, ${submittedEnquiry.specifications?.side}, ${submittedEnquiry.specifications?.colour}, Qty: ${submittedEnquiry.quantity}).`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
                >
                  <MessageCircle size={15} />
                  <span>Instant WhatsApp Quote</span>
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setSubmittedEnquiry(null);
                    setDesignFile(null);
                    setCustomer({ name: "", phone: "", address: "" });
                  }}
                  className="py-3 px-4 rounded-xl bg-muted hover:bg-muted/80 border border-border text-xs font-extrabold transition-colors"
                >
                  New Enquiry
                </button>
              </div>
            </div>
          ) : (
            /* ── COMPACT SINGLE-SCREEN ENQUIRY FORM ── */
            <form
              onSubmit={handleSubmit}
              className="flex-1 flex flex-col justify-between lg:overflow-y-auto p-4 sm:p-5 space-y-3.5"
            >
              <div className="space-y-3.5">
                {/* Drawer Header + Quick Upload Trigger */}
                <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-border/60">
                  <div>
                    <h1 className="text-sm sm:text-base font-black tracking-tight">
                      Product Enquiry Form
                    </h1>
                    <p className="text-[11px] text-muted-foreground">
                      Select specifications & enter details below
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className={`px-3 py-2 rounded-xl border text-xs font-extrabold flex items-center gap-1.5 shrink-0 transition-all ${
                      designFile
                        ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-500"
                        : "bg-amber-500 text-zinc-950 border-amber-400 shadow-sm hover:brightness-110"
                    }`}
                  >
                    <Upload size={13} />
                    <span>{designFile ? "Change Photo" : "Upload Photo"}</span>
                  </button>
                </div>

                {/* Error / Preview Alerts */}
                {formError && (
                  <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-bold flex items-center gap-2">
                    <AlertCircle size={14} className="shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                {previewNotice && (
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 size={14} className="shrink-0" />
                    <span>{previewNotice}</span>
                  </div>
                )}

                {/* 1. PRODUCT CATEGORY SELECTOR */}
                <div>
                  <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">
                    1. Select Product Category
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                    {PRODUCT_OPTIONS.map((item) => {
                      const Icon = item.icon;
                      const isSelected = selectedProduct === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setSelectedProduct(item.id)}
                          className={`p-2 rounded-xl border text-left transition-all flex items-center gap-2 ${
                            isSelected
                              ? "border-amber-500 bg-amber-500/15 text-foreground shadow-sm"
                              : "border-border/70 bg-muted/30 hover:bg-muted/60 text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <div
                            className={`p-1.5 rounded-lg shrink-0 ${
                              isSelected
                                ? "bg-amber-500 text-zinc-950"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            <Icon size={13} />
                          </div>
                          <span className="text-[11px] font-extrabold leading-tight line-clamp-2">
                            {item.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. THICKNESS & HOLES (2-Column Compact Grid) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* Thickness */}
                  <div className="p-2.5 rounded-2xl bg-muted/30 border border-border/60">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                        <Layers size={11} className="text-amber-500" />
                        Thickness
                      </span>
                      <span className="text-[10px] font-mono font-bold text-amber-500">
                        {specs.thickness}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      {THICKNESS_OPTIONS.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setSpecs({ ...specs, thickness: t })}
                          className={`py-1.5 px-1.5 rounded-lg text-[11px] font-bold transition-all ${
                            specs.thickness === t
                              ? "bg-amber-500 text-zinc-950 font-black shadow-2xs"
                              : "bg-background/80 hover:bg-background text-muted-foreground hover:text-foreground border border-border/50"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Holes */}
                  <div className="p-2.5 rounded-2xl bg-muted/30 border border-border/60">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                        <CircleDot size={11} className="text-amber-500" />
                        Corner Holes
                      </span>
                      <span className="text-[10px] font-mono font-bold text-amber-500">
                        {specs.holes}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      {HOLES_OPTIONS.map((h) => (
                        <button
                          key={h}
                          type="button"
                          onClick={() => setSpecs({ ...specs, holes: h })}
                          className={`py-1.5 px-1.5 rounded-lg text-[11px] font-bold transition-all ${
                            specs.holes === h
                              ? "bg-amber-500 text-zinc-950 font-black shadow-2xs"
                              : "bg-background/80 hover:bg-background text-muted-foreground hover:text-foreground border border-border/50"
                          }`}
                        >
                          {h}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 3. PRINTING SIDE, QUANTITY & COLOUR */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                  {/* Double Side / Single Side */}
                  <div className="sm:col-span-4 p-2.5 rounded-2xl bg-muted/30 border border-border/60 flex flex-col justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">
                      Printing Side
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-1 gap-1">
                      {SIDE_OPTIONS.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setSpecs({ ...specs, side: s })}
                          className={`py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all ${
                            specs.side === s
                              ? "bg-amber-500 text-zinc-950 font-black"
                              : "bg-background/80 hover:bg-background text-muted-foreground border border-border/50"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="sm:col-span-3 p-2.5 rounded-2xl bg-muted/30 border border-border/60 flex flex-col justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">
                      Quantity (Qty)
                    </span>
                    <div className="flex items-center justify-between bg-background rounded-xl border border-border/70 p-1">
                      <button
                        type="button"
                        onClick={() =>
                          setSpecs((p) => ({
                            ...p,
                            quantity: Math.max(1, (Number(p.quantity) || 1) - 1),
                          }))
                        }
                        className="w-6 h-6 rounded-lg bg-muted hover:bg-amber-500 hover:text-zinc-950 flex items-center justify-center transition-colors"
                      >
                        <Minus size={11} />
                      </button>
                      <input
                        type="number"
                        min={1}
                        value={specs.quantity}
                        onChange={(e) =>
                          setSpecs({
                            ...specs,
                            quantity: Math.max(1, parseInt(e.target.value, 10) || 1),
                          })
                        }
                        className="w-10 text-center bg-transparent font-mono font-black text-xs focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setSpecs((p) => ({
                            ...p,
                            quantity: (Number(p.quantity) || 1) + 1,
                          }))
                        }
                        className="w-6 h-6 rounded-lg bg-muted hover:bg-amber-500 hover:text-zinc-950 flex items-center justify-center transition-colors"
                      >
                        <Plus size={11} />
                      </button>
                    </div>
                  </div>

                  {/* Colour Options */}
                  <div className="sm:col-span-5 p-2.5 rounded-2xl bg-muted/30 border border-border/60">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1 mb-1.5">
                      <Palette size={11} className="text-amber-500" />
                      Colour Option
                    </span>
                    <div className="grid grid-cols-2 gap-1">
                      {COLOUR_OPTIONS.map((c) => {
                        const active = specs.colour === c.label;
                        return (
                          <button
                            key={c.label}
                            type="button"
                            onClick={() => setSpecs({ ...specs, colour: c.label })}
                            className={`py-1.5 px-2 rounded-lg text-[10px] font-bold flex items-center justify-between gap-1 transition-all ${
                              active
                                ? "bg-amber-500 text-zinc-950 font-black"
                                : "bg-background/80 hover:bg-background text-muted-foreground border border-border/50"
                            }`}
                          >
                            <span className="truncate">
                              {c.label.replace(" Colour", "")}
                            </span>
                            <span className="flex items-center -space-x-1 shrink-0">
                              {c.dots.map((dot, idx) => (
                                <span
                                  key={idx}
                                  style={{ backgroundColor: dot }}
                                  className="w-2 h-2 rounded-full border border-black/20"
                                />
                              ))}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* 4. CUSTOMER ADDRESS DETAILS & CONTACT NO. */}
                <div className="p-3 rounded-2xl bg-muted/30 border border-border/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                      Customer Address Details & Contact No.
                    </span>
                    <span className="text-[10px] text-amber-500 font-semibold">
                      * Required for Quote
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="relative">
                      <User
                        size={13}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      />
                      <input
                        type="text"
                        required
                        placeholder="Your Full Name *"
                        value={customer.name}
                        onChange={(e) =>
                          setCustomer({ ...customer, name: e.target.value })
                        }
                        className="w-full pl-8 pr-3 py-2 rounded-xl bg-background border border-border/80 text-xs font-semibold focus:outline-none focus:border-amber-500 transition-colors"
                      />
                    </div>

                    <div className="relative">
                      <Phone
                        size={13}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      />
                      <input
                        type="tel"
                        required
                        placeholder="Contact / WhatsApp No. *"
                        value={customer.phone}
                        onChange={(e) =>
                          setCustomer({ ...customer, phone: e.target.value })
                        }
                        className="w-full pl-8 pr-3 py-2 rounded-xl bg-background border border-border/80 text-xs font-mono font-semibold focus:outline-none focus:border-amber-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <MapPin
                      size={13}
                      className="absolute left-3 top-2.5 text-muted-foreground"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Complete Delivery Address (Building, Area, City, Pincode) *"
                      value={customer.address}
                      onChange={(e) =>
                        setCustomer({ ...customer, address: e.target.value })
                      }
                      className="w-full pl-8 pr-3 py-2 rounded-xl bg-background border border-border/80 text-xs font-semibold focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* 5. SUBMIT ENQUIRY CTA */}
              <div className="pt-2 border-t border-border/60 flex items-center justify-between gap-3">
                <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <ShieldCheck size={14} className="text-emerald-500 shrink-0" />
                  <span>Direct factory enquiry • Fast response</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-zinc-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                >
                  <Send size={14} />
                  <span>
                    {isSubmitting
                      ? "Submitting Enquiry..."
                      : "Submit Enquiry"}
                  </span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
