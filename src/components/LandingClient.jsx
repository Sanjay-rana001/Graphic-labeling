"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Check,
  ShieldCheck,
  Layers,
  Clock,
  ChevronRight,
  Send,
  CheckCircle2,
  MessageCircle,
  Upload,
  BadgeCheck,
  X,
  Tag,
  Printer,
  Search,
  Factory,
  Cpu,
  Award,
  Building2,
  Wrench,
  Zap,
  Cog,
  Sun,
  Ship,
  Car,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "./ThemeProvider";
import SweepButton from "./SweepButton";
import ThemeToggle from "./ThemeToggle";
import { INITIAL_LEADS } from "@/lib/adminData";

// ─── Samarth Metal Labels Inspired Categories & Product Directory ───
const PRODUCT_CATEGORIES = [
  { id: "All", label: "All Product Categories", short: "All Range" },
  {
    id: "Aluminium Nameplates",
    label: "Aluminium Nameplates & Rating Plates",
    short: "Aluminium Plates",
  },
  {
    id: "Industrial Tags & Labels",
    label: "Aluminium Tags, QR & Cable ID Labels",
    short: "Tags & Barcode",
  },
  {
    id: "SS & Brass Plates",
    label: "Stainless Steel (SS 304/316) & Brass Boards",
    short: "SS 304 & Brass",
  },
  {
    id: "Polycarbonate & Stickers",
    label: "Polycarbonate, Foil & 3M Adhesive Stickers",
    short: "Polycarbonate & Stickers",
  },
  {
    id: "Acrylic & Screen Print",
    label: "Acrylic Sign Boards & Screen Printing",
    short: "Acrylic & Screen Print",
  },
];

const CATALOG_PRODUCTS = [
  {
    id: 1,
    category: "Aluminium Nameplates",
    title: "Anodized & UV Printed Aluminium Nameplate",
    code: "SG-ALU-101",
    desc: "High-contrast anodized & chemical-etched aluminium rating plates for motors, compressors, weighing scales & control panels.",
    thickness: "0.3mm, 0.5mm, 0.7mm, 1.5mm, 2.0mm",
    material: "Aerospace 6061 / 1100 Aluminium",
    process: "Anodizing + UV / Laser Etch",
    mounting: "1mm–5mm Corner Holes / 3M",
    application: "Machinery, Motors & OEM Panels",
    tag: "Bestseller",
    img: "/Media/anodized-aluminium-labels-1000x1000-removebg-preview.png",
    isContain: true,
  },
  {
    id: 2,
    category: "Aluminium Nameplates",
    title: "Premium Aluminium Etching Name Plate",
    code: "SG-ALU-102",
    desc: "Deep chemical-etched and satin-brushed aluminium name plates with solvent-proof baked enamel colour filling.",
    thickness: "0.7mm – 3.0mm",
    material: "Brushed / Matte Aluminium",
    process: "Deep Chemical Etching",
    mounting: "Punched Holes / Studs",
    application: "Industrial Equipment & Valves",
    tag: "Export Quality",
    img: "/Media/brushed_aluminum_sign.png",
  },
  {
    id: 3,
    category: "Industrial Tags & Labels",
    title: "Custom QR Code, Barcode & Serial Asset ID Tag",
    code: "SG-TAG-201",
    desc: "Oil, heat, and UV-resistant anodized aluminium tags with sequential numbering, barcode & QR code laser matrix.",
    thickness: "0.3mm – 1.5mm",
    material: "Sealed Anodized Aluminium",
    process: "Fiber Laser Matrix Marking",
    mounting: "1mm–5mm Rivet / Cable Holes",
    application: "Asset Tracking & Cable ID",
    tag: "QR / Barcode",
    img: "/Media/equipment_tag.png",
  },
  {
    id: 4,
    category: "SS & Brass Plates",
    title: "SS 304 / 316 Chemical Etched Equipment Nameplate",
    code: "SG-SS-301",
    desc: "Corrosion-proof 0.5mm to 2.0mm stainless steel machinery rating plates, schematic diagrams, and compliance boards.",
    thickness: "0.5mm, 0.7mm, 1.0mm, 1.5mm, 2.0mm",
    material: "Grade 304 / 316 Stainless Steel",
    process: "Acid Etching + Colour Fill",
    mounting: "2mm–5mm Corner Holes",
    application: "Chemical, Marine & Heavy Plants",
    tag: "SS 304 / 316",
    img: "/Media/aluminum_door_plate.png",
  },
  {
    id: 5,
    category: "SS & Brass Plates",
    title: "PVDF Golden Coated & Heritage Brass Name Board",
    code: "SG-BRS-302",
    desc: "Mirror-polished and chemical-etched solid brass & PVDF gold coated plates for prestige corporate & industrial branding.",
    thickness: "1.0mm – 4.0mm",
    material: "Solid Brass / PVDF Gold SS",
    process: "Etched + Lacquer Coated",
    mounting: "Studs / Mirror Screws",
    application: "Corporate & Architectural",
    tag: "Golden Finish",
    img: "/Media/premium_gold_plate.png",
  },
  {
    id: 6,
    category: "Polycarbonate & Stickers",
    title: "Polycarbonate Graphic Overlay & Membrane Sticker",
    code: "SG-PC-401",
    desc: "Sub-surface printed velvet/matte polycarbonate stickers and fascia panels with strong 3M self-adhesive backing.",
    thickness: "0.18mm – 0.5mm",
    material: "Lexan Polycarbonate / PVC Foil",
    process: "Reverse Screen & UV Print",
    mounting: "3M 467MP Self-Adhesive",
    application: "Control Panels & Electronics",
    tag: "3M Adhesive",
    img: "/Media/office_metal_labels.png",
  },
  {
    id: 7,
    category: "Acrylic & Screen Print",
    title: "Export Quality Safety Sign & Screen Printed Board",
    code: "SG-PRT-501",
    desc: "High-visibility single to four-colour industrial screen printed warning plates, instruction boards, and dial scales.",
    thickness: "0.5mm – 2.0mm",
    material: "Aluminium / Acrylic / PVC",
    process: "1 to 4 Colour Screen Print",
    mounting: "Corner Holes / Adhesive",
    application: "Safety & Electrical Compliance",
    tag: "1–4 Colour Print",
    img: "/Media/warning_signage.png",
  },
  {
    id: 8,
    category: "Industrial Tags & Labels",
    title: "Matte Black Anodized Aluminium Rating Tag",
    code: "SG-TAG-202",
    desc: "Scratch-proof electrochemically oxidized matte black aluminium tag with high-contrast silver laser engraving.",
    thickness: "0.5mm – 2.0mm",
    material: "Black Anodized Aluminium",
    process: "High-Precision Fiber Laser",
    mounting: "1mm–5mm Holes / 3M Backing",
    application: "Valves, Pumps & Compressors",
    tag: "Ano-Etching",
    img: "/Media/anodized_aluminum_tag.png",
  },
  {
    id: 9,
    category: "SS & Brass Plates",
    title: "Executive Solid Metal Desk & Door Name Plate",
    code: "SG-DSK-303",
    desc: "Heavy-duty CNC-chamfered metallic block and architectural door plates for offices, cabins, and residences.",
    thickness: "2.0mm – 12.0mm",
    material: "Solid Billet Aluminium / Brass",
    process: "Diamond Bevel + Laser",
    mounting: "Free-Standing / Standoffs",
    application: "Office Cabins & Houses",
    tag: "Custom Size",
    img: "/Media/desk_name_plate.png",
  },
  {
    id: 10,
    category: "Acrylic & Screen Print",
    title: "Custom Acrylic Sign Board & House Name Plate",
    code: "SG-ACR-502",
    desc: "Weatherproof laser-cut cast acrylic sign boards with single/double side UV printing and stainless steel studs.",
    thickness: "2.0mm – 6.0mm",
    material: "Cast Acrylic + Metal Layer",
    process: "Laser Cut + UV Screen Print",
    mounting: "SS Standoff Studs",
    application: "Commercial & Residential",
    tag: "Weatherproof",
    img: "/Media/brushed_aluminum_sign.png",
  },
  {
    id: 11,
    category: "Polycarbonate & Stickers",
    title: "PVC Silver Foil & Metallic Promotional Stickers",
    code: "SG-PC-402",
    desc: "Waterproof die-cut metallic foil stickers, brand logo badges, and structured self-adhesive industrial labels.",
    thickness: "0.1mm – 0.5mm",
    material: "Metallic Foil / Polyester",
    process: "Die-Cut + Multi-Colour Print",
    mounting: "High-Tack Self-Adhesive",
    application: "Appliances, Cartons & Branding",
    tag: "Custom Die-Cut",
    img: "/Media/office_metal_labels.png",
  },
  {
    id: 12,
    category: "Aluminium Nameplates",
    title: "CNG Cylinder & Pressure Vessel Compliance Plate",
    code: "SG-ALU-104",
    desc: "Stamped and deep-etched compliance plates for CNG cylinders, boilers, transformers, and heavy automotive kits.",
    thickness: "0.7mm – 2.0mm",
    material: "Hard Anodized Aluminium / SS",
    process: "Deep Etch + Serial Punching",
    mounting: "Rivet Holes / Weldable",
    application: "Automotive & Gas Cylinders",
    tag: "Compliance Grade",
    img: "/Media/equipment_tag.png",
  },
];

const INDUSTRIES_SERVED = [
  { name: "Automotive & EV", desc: "VIN plates, CNG compliance & engine tags", icon: Car },
  { name: "Electrical & Panels", desc: "Switchgear rating plates & mimic labels", icon: Zap },
  { name: "Heavy Machinery", desc: "Compressor, pump & motor spec plates", icon: Cog },
  { name: "Solar & Energy", desc: "UV-proof inverter & module asset tags", icon: Sun },
  { name: "Marine & Oil/Gas", desc: "SS 316 acid-etched corrosion-proof tags", icon: Ship },
  { name: "Corporate & Homes", desc: "Acrylic, brass & brushed door signage", icon: Building2 },
];

const INFRASTRUCTURE_FEATURES = [
  {
    title: "Chemical Etching & Anodizing Line",
    desc: "Deep acid etching and sealed anodizing ensuring markings never fade under harsh solvents or outdoor salt spray.",
  },
  {
    title: "High-Precision Fiber Laser Marking",
    desc: "Micron-level QR codes, sequential barcodes, and fine schematic text on Aluminium, SS 304/316, and Brass.",
  },
  {
    title: "Multi-Colour Industrial Screen Printing",
    desc: "Single, Double, Three & Four-Colour UV-cured screen printing on metal plates, polycarbonate, and acrylic.",
  },
  {
    title: "Custom Gauges (0.3mm–2.0mm+) & Hole Punching",
    desc: "Precision die-cutting with 1mm to 5mm mounting holes, single/double side print, and 3M 467MP adhesive backing.",
  },
];

const COMPANY_FACTS = [
  { label: "Nature of Business", value: "Manufacturer, Exporter & B2B Supplier" },
  { label: "Materials Offered", value: "Aluminium, SS 304/316, Brass, Acrylic, Polycarbonate" },
  { label: "Thickness Gauges", value: "0.3 mm, 0.5 mm, 0.7 mm, 0.91 mm, 1.5 mm, 2.0 mm+" },
  { label: "Mounting & Holes", value: "1mm–5mm Holes, SS Studs, 3M Self-Adhesive" },
  { label: "Printing Options", value: "Single / Double Side • 1 to 4 Colour & Etched" },
  { label: "Quality & Dispatch", value: "ISO-Grade Inspection • Pan-India Express Delivery" },
];

export default function LandingClient() {
  const [scrolled, setScrolled] = useState(false);

  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Hero Quick Requirement Card State
  const [heroForm, setHeroForm] = useState({
    product: "Aluminium Name Plate",
    thickness: "0.7 mm",
    holes: "2 mm",
    colour: "Single Colour",
    quantity: "50",
    name: "",
    phone: "",
  });
  const [heroSubmitting, setHeroSubmitting] = useState(false);
  const [heroSubmittedId, setHeroSubmittedId] = useState("");

  // Bottom Bulk Estimator Console State
  const [quoteQuantity, setQuoteQuantity] = useState(100);
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    product: "Aluminium Name Plate",
    thickness: "0.7 mm",
    holes: "2 mm",
    side: "Single Side",
    colour: "Single Colour",
    notes: "",
  });

  // Product "Yes! I am Interested / Get Best Quote" Modal State
  const [modalProduct, setModalProduct] = useState(null);
  const [modalForm, setModalForm] = useState({
    name: "",
    phone: "",
    address: "",
    thickness: "0.7 mm",
    holes: "2 mm",
    side: "Single Side",
    colour: "Single Colour",
    quantity: 50,
  });
  const [modalSubmitting, setModalSubmitting] = useState(false);
  const [modalSuccessId, setModalSuccessId] = useState("");

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const filteredProducts = CATALOG_PRODUCTS.filter((p) => {
    const matchesCat = activeCategory === "All" || p.category === activeCategory;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.desc.toLowerCase().includes(q) ||
      p.material.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  const submitLeadToBackendAndAdmin = async ({
    category,
    thickness = "0.7 mm",
    holes = "2 mm",
    side = "Single Side",
    colour = "Single Colour",
    quantity = 50,
    name,
    phone,
    address = "Website Quick Quote",
    source = "Website Quick Quote",
    notes = "",
  }) => {
    let createdLead = null;
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          specifications: {
            thickness,
            holes,
            side,
            quantity: Number(quantity) || 1,
            colour,
          },
          customer: {
            name: name || "Website Buyer",
            phone: phone || "9876543210",
            address: address || "Commercial Inquiry",
          },
        }),
      });
      const data = await res.json();
      if (res.ok && data?.success && data.enquiry) {
        createdLead = data.enquiry;
      }
    } catch (e) {}

    if (!createdLead) {
      createdLead = {
        id: `INQ-${Math.floor(1000 + Math.random() * 9000)}`,
        client: name || "Commercial Buyer",
        phone: phone || "Not provided",
        email: "—",
        address: address || "Website Inquiry",
        city: address || "India",
        date: new Date().toISOString().split("T")[0],
        source,
        category,
        material: category,
        size: `Thickness: ${thickness} | Holes: ${holes}`,
        lighting: colour,
        mounting: `${side} | Holes: ${holes}`,
        quantity: Number(quantity) || 1,
        status: "New Inquiry",
        notes:
          notes ||
          `Product: ${category} | Thickness: ${thickness} | Holes: ${holes} | Side: ${side} | Colour: ${colour} | Qty: ${quantity}`,
      };
    }

    try {
      const saved = localStorage.getItem("sourav_admin_leads");
      const existing = saved ? JSON.parse(saved) : INITIAL_LEADS;
      const merged = [
        createdLead,
        ...existing.filter((item) => item.id !== createdLead.id),
      ];
      localStorage.setItem("sourav_admin_leads", JSON.stringify(merged));
    } catch (err) {}

    return createdLead;
  };

  const handleHeroQuoteSubmit = async (e) => {
    e.preventDefault();
    if (!heroForm.phone || heroSubmitting) return;
    setHeroSubmitting(true);
    const lead = await submitLeadToBackendAndAdmin({
      category: heroForm.product,
      thickness: heroForm.thickness,
      holes: heroForm.holes,
      colour: heroForm.colour,
      quantity: Number(heroForm.quantity) || 50,
      name: heroForm.name || "Direct Buyer",
      phone: heroForm.phone,
      address: "Hero Quick Quote",
      source: "Hero Instant Quote",
    });
    setHeroSubmitting(false);
    setHeroSubmittedId(lead.id);
    setHeroForm((prev) => ({ ...prev, name: "", phone: "" }));
    setTimeout(() => setHeroSubmittedId(""), 6000);
  };

  const handleModalQuoteSubmit = async (e) => {
    e.preventDefault();
    if (!modalProduct || modalSubmitting) return;
    setModalSubmitting(true);
    const lead = await submitLeadToBackendAndAdmin({
      category: modalProduct.title,
      thickness: modalForm.thickness,
      holes: modalForm.holes,
      side: modalForm.side,
      colour: modalForm.colour,
      quantity: Number(modalForm.quantity) || 1,
      name: modalForm.name,
      phone: modalForm.phone,
      address: modalForm.address,
      source: "Catalog Product Quote",
    });
    setModalSubmitting(false);
    setModalSuccessId(lead.id);
  };

  const handleQuoteSubmit = async (e) => {
    e.preventDefault();
    await submitLeadToBackendAndAdmin({
      category: formData.product,
      thickness: formData.thickness,
      holes: formData.holes,
      side: formData.side,
      colour: formData.colour,
      quantity: Number(quoteQuantity) || 100,
      name: formData.name,
      phone: formData.phone,
      address: formData.notes || "Bulk Enquiry Console",
      source: "Homepage Bulk Enquiry",
      notes: formData.notes,
    });
    setQuoteSubmitted(true);
    setFormData({
      name: "",
      phone: "",
      product: "Aluminium Name Plate",
      thickness: "0.7 mm",
      holes: "2 mm",
      side: "Single Side",
      colour: "Single Colour",
      notes: "",
    });
    setTimeout(() => setQuoteSubmitted(false), 6000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-amber-500/20 selection:text-amber-500 overflow-x-hidden">
      {/* ══════════════════════════════════════════════════════════════════
          FLUID FULL-WIDTH STICKY HEADER WITH SEARCH & DIRECT ENQUIRY CTAS
         ══════════════════════════════════════════════════════════════════ */}
      <header
        className={`fixed top-0 inset-x-0 z-40 transition-all duration-200 border-b ${
          scrolled
            ? "bg-card/95 dark:bg-[#0c0e14]/95 backdrop-blur-xl border-border shadow-md py-2"
            : "bg-background/90 backdrop-blur-md border-border/60 py-2.5"
        }`}
      >
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10 2xl:px-14 flex items-center justify-between gap-3">
          {/* Left: Brand Logo + Verified Badge */}
          <div className="flex items-center gap-3 shrink-0">
            <Link href="/" prefetch={true} className="flex items-center group">
              <div className="relative h-8 sm:h-9 w-28 sm:w-32 transition-transform duration-150 group-hover:scale-103">
                <Image
                  src="/Media/Logo.png"
                  alt="Sourav Graphic"
                  fill
                  sizes="140px"
                  className="object-contain object-left dark:brightness-110"
                  priority
                />
              </div>
            </Link>
            <div className="hidden 2xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold">
              <BadgeCheck size={13} />
              <span>Manufacturer & Exporter of Metal Labels</span>
            </div>
          </div>

          {/* Center: Product Search Bar + Navigation Links */}
          <div className="hidden lg:flex items-center gap-5 flex-1 max-w-2xl mx-4">
            <div className="relative flex-1">
              <Search
                size={13}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (e.target.value.trim()) {
                    document
                      .getElementById("products")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                placeholder="Search Aluminum Nameplates, SS 304 Tags, QR Labels, Polycarbonate Stickers..."
                className="w-full pl-8 pr-3 py-1.5 rounded-full bg-muted/60 border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-amber-500"
              />
            </div>

            <nav className="flex items-center gap-4 text-xs font-bold text-muted-foreground shrink-0">
              <a href="#products" className="hover:text-foreground transition-colors">
                Our Products
              </a>
              <a href="#industries" className="hover:text-foreground transition-colors">
                Industries
              </a>
              <a href="#profile" className="hover:text-foreground transition-colors">
                Company Profile
              </a>
              <a href="#quote" className="hover:text-foreground transition-colors">
                Get Quote
              </a>
            </nav>
          </div>

          {/* Right: Direct Conversion Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <a
              href="https://wa.me/919876543210?text=Hi%20Sourav%20Graphic,%20I%20want%20to%20enquire%20about%20industrial%20metal%20labels%20and%20nameplates."
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/15 hover:bg-emerald-500 text-emerald-600 dark:text-emerald-400 hover:text-zinc-950 border border-emerald-500/30 text-[11px] font-extrabold transition-all"
            >
              <MessageCircle size={13} />
              <span>WhatsApp</span>
            </a>
            <ThemeToggle size="sm" />
            <SweepButton href="/customize" label="Upload Design / Enquire" size="nav" />
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════════════════════
          COMPACT 3-COLUMN FLUID B2B HERO (Adapts to 13" up to 50"+ Screens)
         ══════════════════════════════════════════════════════════════════ */}
      <section className="relative pt-16 sm:pt-18 pb-4 px-4 sm:px-6 lg:px-10 2xl:px-14 w-full max-w-[1920px] mx-auto z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch">
          {/* Col 1 (5 Cols): Manufacturer Value Proposition */}
          <div className="lg:col-span-5 bg-card border border-border rounded-2xl p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden shadow-2xs">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-600 dark:text-amber-400 text-[10px] font-bold uppercase tracking-wider mb-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                <span>Industrial Identification & Custom Signage Manufacturer</span>
              </div>

              <h1 className="text-xl sm:text-2xl xl:text-3xl font-black tracking-tight text-foreground leading-tight uppercase">
                Sourav Graphic &{" "}
                <span className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600 dark:from-amber-400 dark:to-yellow-500 bg-clip-text text-transparent">
                  Metal Labels
                </span>
              </h1>

              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                Manufacturer & supplier of{" "}
                <strong className="text-foreground">
                  Anodized Aluminium Nameplates, SS 304/316 Etched Tags, Brass Boards, QR/Barcode Cable Tags, Polycarbonate Stickers
                </strong>{" "}
                & <strong className="text-foreground">Multi-Colour Screen Printing</strong>.
              </p>

              {/* Quick Category Pills */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {[
                  "Aluminium Name Plate",
                  "SS 304 Etched Plate",
                  "Anodize Aluminium Tag",
                  "Acrylic Sign Board",
                  "Industrial Screen Printing",
                  "Polycarbonate Stickers",
                ].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      setHeroForm((prev) => ({ ...prev, product: item }));
                      document
                        .getElementById("products")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="px-2 py-1 rounded-lg bg-muted/70 hover:bg-amber-500 hover:text-zinc-950 border border-border text-[10px] font-bold transition-colors cursor-pointer"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-border/60 flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <SweepButton
                  href="/customize"
                  label="Upload Design Photo & Enquire"
                  size="sm"
                />
                <a
                  href="#products"
                  className="px-3 py-1.5 rounded-full bg-muted hover:bg-muted/80 border border-border text-[11px] font-extrabold flex items-center gap-1"
                >
                  <span>View All 12 Products</span>
                  <ArrowRight size={11} />
                </a>
              </div>
              <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                ● 0.3mm to 12mm Gauges
              </span>
            </div>
          </div>

          {/* Col 2 (3 Cols): Featured Specimen + Key Spec Highlights */}
          <div className="lg:col-span-3 bg-card border border-border rounded-2xl p-4 flex flex-col justify-between shadow-2xs">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-foreground">Featured Specimen</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 font-mono text-[10px] font-bold">
                OEM Export Grade
              </span>
            </div>

            <div className="relative w-full h-32 sm:h-36 my-1 flex items-center justify-center">
              <Image
                src="/Media/anodized-aluminium-labels-1000x1000-removebg-preview.png"
                alt="Anodized Aluminium Nameplates"
                fill
                className="object-contain scale-110 drop-shadow-xl"
                sizes="240px"
                priority
              />
            </div>

            <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-border/60 text-[10px]">
              <div className="p-1.5 rounded-lg bg-muted/40 border border-border/50">
                <span className="text-muted-foreground block">Thickness:</span>
                <strong className="font-mono text-foreground">
                  0.3, 0.5, 0.7, 1.5, 2.0mm
                </strong>
              </div>
              <div className="p-1.5 rounded-lg bg-muted/40 border border-border/50">
                <span className="text-muted-foreground block">Holes & Side:</span>
                <strong className="font-mono text-foreground">
                  1–5mm • Single/Double
                </strong>
              </div>
            </div>
          </div>

          {/* Col 3 (4 Cols): Samarth-Style Instant "Tell Us Your Requirement" Box */}
          <div className="lg:col-span-4 bg-card border border-border rounded-2xl p-4 flex flex-col justify-between shadow-2xs">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-border/60">
              <div>
                <h2 className="text-xs sm:text-sm font-black uppercase tracking-wide text-foreground">
                  Tell Us Your Requirement
                </h2>
                <p className="text-[10px] text-muted-foreground">
                  Get instant quotation directly from our workshop
                </p>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 text-[10px] font-bold">
                Fast Response
              </span>
            </div>

            {heroSubmittedId ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-1 my-auto">
                <CheckCircle2 size={22} className="text-emerald-500 mx-auto" />
                <h3 className="text-xs font-black text-foreground">
                  Enquiry Sent! ({heroSubmittedId})
                </h3>
                <p className="text-[11px] text-muted-foreground">
                  Logged in Admin Dashboard. We will call you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleHeroQuoteSubmit} className="space-y-2 text-xs">
                <div className="grid grid-cols-12 gap-1.5">
                  <div className="col-span-6">
                    <label className="text-[9px] font-bold uppercase text-muted-foreground block mb-0.5">
                      Product
                    </label>
                    <select
                      value={heroForm.product}
                      onChange={(e) =>
                        setHeroForm({ ...heroForm, product: e.target.value })
                      }
                      className="w-full px-2 py-1.5 rounded-lg bg-background border border-border text-foreground font-bold text-[11px]"
                    >
                      <option>Aluminium Name Plate</option>
                      <option>Acrylic Sign Board</option>
                      <option>Industrial Screen Printing</option>
                      <option>Anodize Aluminium Tag</option>
                      <option>SS 304 Etched Plate</option>
                      <option>Polycarbonate Stickers</option>
                      <option>House Name Plate</option>
                    </select>
                  </div>
                  <div className="col-span-3">
                    <label className="text-[9px] font-bold uppercase text-muted-foreground block mb-0.5">
                      Thickness
                    </label>
                    <select
                      value={heroForm.thickness}
                      onChange={(e) =>
                        setHeroForm({ ...heroForm, thickness: e.target.value })
                      }
                      className="w-full px-1.5 py-1.5 rounded-lg bg-background border border-border text-foreground font-mono font-bold text-[11px]"
                    >
                      <option>0.3 mm</option>
                      <option>0.5 mm</option>
                      <option>0.7 mm</option>
                      <option>0.91 mm</option>
                      <option>1.5 mm</option>
                      <option>2.0 mm</option>
                    </select>
                  </div>
                  <div className="col-span-3">
                    <label className="text-[9px] font-bold uppercase text-muted-foreground block mb-0.5">
                      Qty
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={heroForm.quantity}
                      onChange={(e) =>
                        setHeroForm({ ...heroForm, quantity: e.target.value })
                      }
                      className="w-full px-1.5 py-1.5 rounded-lg bg-background border border-border text-foreground font-mono font-bold text-[11px] text-center"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                  <input
                    type="text"
                    required
                    placeholder="Your Name / Company *"
                    value={heroForm.name}
                    onChange={(e) =>
                      setHeroForm({ ...heroForm, name: e.target.value })
                    }
                    className="w-full px-2.5 py-1.5 rounded-lg bg-background border border-border text-foreground font-medium text-[11px]"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Mobile / WhatsApp No. *"
                    value={heroForm.phone}
                    onChange={(e) =>
                      setHeroForm({ ...heroForm, phone: e.target.value })
                    }
                    className="w-full px-2.5 py-1.5 rounded-lg bg-background border border-border text-foreground font-mono font-semibold text-[11px]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={heroSubmitting}
                  className="w-full py-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-zinc-950 font-black text-xs uppercase tracking-wider shadow-sm hover:brightness-110 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Send size={12} />
                  <span>{heroSubmitting ? "Submitting..." : "Submit Requirement"}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          MAIN B2B CATALOG SECTION: LEFT SIDEBAR CATEGORIES + RIGHT PRODUCT GRID
          (Exact Samarth Metal Labels B2B Directory Structure, Sleek & Modern)
         ══════════════════════════════════════════════════════════════════ */}
      <section
        id="products"
        className="py-6 px-4 sm:px-6 lg:px-10 2xl:px-14 w-full max-w-[1920px] mx-auto"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* LEFT SIDEBAR (3 Cols on Desktop / 2.5 Cols on Ultrawide): Product Range Directory + Direct Upload Card */}
          <aside className="lg:col-span-3 2xl:col-span-2 lg:sticky lg:top-16 space-y-3.5">
            <div className="bg-card border border-border rounded-2xl p-3.5 shadow-2xs">
              <div className="pb-2.5 mb-2.5 border-b border-border flex items-center justify-between">
                <h2 className="text-xs font-black uppercase tracking-wider text-foreground">
                  Our Product Range
                </h2>
                <span className="text-[10px] font-mono text-amber-500 font-bold">
                  {CATALOG_PRODUCTS.length} Items
                </span>
              </div>

              <div className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0">
                {PRODUCT_CATEGORIES.map((cat) => {
                  const isActive = activeCategory === cat.id;
                  const count =
                    cat.id === "All"
                      ? CATALOG_PRODUCTS.length
                      : CATALOG_PRODUCTS.filter((p) => p.category === cat.id)
                          .length;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setActiveCategory(cat.id)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between gap-2 shrink-0 lg:shrink cursor-pointer ${
                        isActive
                          ? "bg-amber-500 text-zinc-950 font-black shadow-xs"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                      }`}
                    >
                      <span className="truncate">{cat.short}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                          isActive
                            ? "bg-zinc-950/15 text-zinc-950"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Direct Custom Artwork Upload CTA Card in Sidebar */}
            <div className="hidden lg:block bg-card border border-amber-500/30 rounded-2xl p-4 shadow-2xs space-y-2.5">
              <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-500 text-[10px] font-mono font-bold uppercase">
                Custom Fabrication
              </span>
              <h3 className="text-xs font-black text-foreground">
                Have a Drawing or Sample Photo?
              </h3>
              <p className="text-[11px] text-muted-foreground leading-snug">
                Upload your photo directly, choose Thickness (0.3–2.0mm), Holes (1–5mm), Single/Double Side & Colour.
              </p>
              <Link
                href="/customize"
                className="w-full py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-[11px] uppercase tracking-wide flex items-center justify-center gap-1.5 transition-all"
              >
                <Upload size={12} />
                <span>Upload Design Photo</span>
              </Link>
            </div>
          </aside>

          {/* RIGHT CATALOG GRID (9 Cols on Desktop / 10 Cols on Ultrawide) */}
          <div className="lg:col-span-9 2xl:col-span-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3.5">
              <div>
                <h2 className="text-base sm:text-lg font-black text-foreground">
                  {activeCategory === "All"
                    ? "All Industrial Nameplates, Metal Labels & Tags"
                    : activeCategory}
                </h2>
                <p className="text-[11px] text-muted-foreground">
                  Showing {filteredProducts.length} industrial products • Click{" "}
                  <strong>Get Best Quote</strong> to send requirement
                </p>
              </div>

              {/* Mobile / Tablet Search Input */}
              <div className="relative lg:hidden w-full sm:w-64">
                <Search
                  size={13}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-card border border-border text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-3.5">
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group bg-card border border-border hover:border-amber-500/80 rounded-2xl overflow-hidden shadow-2xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    {/* Product Image Header */}
                    <div className="relative h-36 bg-muted/40 dark:bg-[#0c0e14] overflow-hidden">
                      <Image
                        src={product.img}
                        alt={product.title}
                        fill
                        className={`${
                          product.isContain
                            ? "object-contain p-2.5"
                            : "object-cover"
                        } group-hover:scale-105 transition-transform duration-300`}
                        sizes="(max-width: 768px) 100vw, (max-width: 1536px) 30vw, 22vw"
                      />
                      <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-zinc-950/85 text-amber-400 border border-white/15 text-[10px] font-bold">
                        {product.tag}
                      </div>
                      <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-card/90 text-foreground border border-border text-[9px] font-mono font-bold">
                        {product.code}
                      </div>
                    </div>

                    {/* Product Details & Spec Table */}
                    <div className="p-3.5">
                      <h3 className="text-xs sm:text-sm font-extrabold text-foreground line-clamp-1 group-hover:text-amber-500 transition-colors">
                        {product.title}
                      </h3>
                      <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2 leading-snug">
                        {product.desc}
                      </p>

                      {/* Structured B2B Spec Rows (Like Samarth Metal Labels) */}
                      <div className="mt-2.5 pt-2 border-t border-border/60 space-y-1 text-[10px]">
                        <div className="flex justify-between gap-2">
                          <span className="text-muted-foreground shrink-0">
                            Material:
                          </span>
                          <strong className="text-foreground truncate text-right">
                            {product.material}
                          </strong>
                        </div>
                        <div className="flex justify-between gap-2">
                          <span className="text-muted-foreground shrink-0">
                            Thickness:
                          </span>
                          <strong className="font-mono text-amber-600 dark:text-amber-400 truncate text-right">
                            {product.thickness}
                          </strong>
                        </div>
                        <div className="flex justify-between gap-2">
                          <span className="text-muted-foreground shrink-0">
                            Process:
                          </span>
                          <strong className="text-foreground truncate text-right">
                            {product.process}
                          </strong>
                        </div>
                        <div className="flex justify-between gap-2">
                          <span className="text-muted-foreground shrink-0">
                            Mounting:
                          </span>
                          <strong className="text-foreground truncate text-right">
                            {product.mounting}
                          </strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Dual High-Conversion Quote & Upload Buttons */}
                  <div className="px-3.5 pb-3.5 pt-1 flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setModalProduct(product);
                        setModalSuccessId("");
                      }}
                      className="flex-1 py-2 px-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-[11px] uppercase tracking-wide transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>Get Best Quote</span>
                      <ArrowRight size={11} />
                    </button>
                    <Link
                      href="/customize"
                      prefetch={true}
                      className="py-2 px-2.5 rounded-xl bg-muted hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-zinc-950 border border-border text-[11px] font-bold transition-colors flex items-center justify-center gap-1"
                      title="Upload Design Photo"
                    >
                      <Upload size={11} />
                      <span>Upload</span>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          INDUSTRIES WE SERVE (6 COMPACT SECTOR CARDS)
         ══════════════════════════════════════════════════════════════════ */}
      <section
        id="industries"
        className="py-6 px-4 sm:px-6 lg:px-10 2xl:px-14 w-full max-w-[1920px] mx-auto border-t border-border/50"
      >
        <div className="flex items-center justify-between mb-3.5">
          <div>
            <h2 className="text-base sm:text-lg font-black text-foreground">
              Industries We Serve
            </h2>
            <p className="text-[11px] text-muted-foreground">
              Supplying precision identification plates & labels across key industrial sectors
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {INDUSTRIES_SERVED.map((ind) => {
            const Icon = ind.icon;
            return (
              <div
                key={ind.name}
                className="p-3.5 rounded-2xl bg-card border border-border hover:border-amber-500/60 transition-all flex flex-col justify-between"
              >
                <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center mb-2">
                  <Icon size={16} />
                </div>
                <div>
                  <h3 className="text-xs font-extrabold text-foreground">
                    {ind.name}
                  </h3>
                  <p className="text-[10px] text-muted-foreground mt-0.5 leading-snug">
                    {ind.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          SIDE-BY-SIDE INFRASTRUCTURE & QUALITY + COMPANY FACT SHEET (#profile)
         ══════════════════════════════════════════════════════════════════ */}
      <section
        id="profile"
        className="py-6 px-4 sm:px-6 lg:px-10 2xl:px-14 w-full max-w-[1920px] mx-auto border-t border-border/50"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          {/* Left (6 Cols): Manufacturing Infrastructure & Quality Testing */}
          <div className="lg:col-span-6 bg-card border border-border rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-amber-500 block">
                Infrastructure & Quality Assurance
              </span>
              <h2 className="text-base sm:text-lg font-black text-foreground mt-0.5">
                In-House Fabrication & Testing Facilities
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-3.5">
                {INFRASTRUCTURE_FEATURES.map((feat) => (
                  <div
                    key={feat.title}
                    className="p-3 rounded-xl bg-muted/40 border border-border/60"
                  >
                    <h3 className="text-xs font-extrabold text-foreground flex items-center gap-1.5">
                      <Check size={13} className="text-emerald-500 shrink-0" />
                      <span>{feat.title}</span>
                    </h3>
                    <p className="text-[11px] text-muted-foreground mt-1 leading-snug">
                      {feat.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-xs">
              <span className="text-muted-foreground font-medium">
                Need custom sample plates for approval?
              </span>
              <SweepButton href="/customize" label="Upload Sample Photo" size="sm" />
            </div>
          </div>

          {/* Right (6 Cols): Company Profile Fact Sheet */}
          <div className="lg:col-span-6 bg-card border border-border rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-amber-500 block">
                Company Profile
              </span>
              <h2 className="text-base sm:text-lg font-black text-foreground mt-0.5">
                Sourav Graphic & Metal Labels — Fact Sheet
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-3.5">
                {COMPANY_FACTS.map((fact) => (
                  <div
                    key={fact.label}
                    className="p-3 rounded-xl bg-muted/40 border border-border/60"
                  >
                    <span className="text-[9px] font-mono uppercase text-muted-foreground block">
                      {fact.label}
                    </span>
                    <span className="text-[11px] font-extrabold text-foreground mt-0.5 block leading-snug">
                      {fact.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-border/50 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <ShieldCheck size={15} />
                <span>Verified Quality • Direct Factory Pricing</span>
              </div>
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-xl bg-emerald-500 text-zinc-950 font-black text-xs flex items-center gap-1.5"
              >
                <MessageCircle size={13} />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          COMPACT BULK & CUSTOM ENQUIRY CONSOLE (#quote)
         ══════════════════════════════════════════════════════════════════ */}
      <section
        id="quote"
        className="py-6 px-4 sm:px-6 lg:px-10 2xl:px-14 w-full max-w-[1920px] mx-auto"
      >
        <div className="bg-card rounded-2xl p-4 sm:p-5 border border-border shadow-2xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
            <div className="lg:col-span-4 space-y-2.5">
              <div>
                <span className="text-[10px] font-mono font-bold text-amber-500 uppercase tracking-wider block">
                  Direct Factory Enquiry
                </span>
                <h2 className="text-base sm:text-lg font-black text-foreground">
                  Send Bulk or Custom Requirement
                </h2>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Choose specifications below to generate an instant factory quotation.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-muted/40 border border-border">
                <div className="flex items-center justify-between text-xs font-bold mb-1">
                  <span className="text-muted-foreground">Quantity Needed:</span>
                  <span className="text-amber-500 font-mono">{quoteQuantity} Pcs</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="500"
                  step="1"
                  value={quoteQuantity}
                  onChange={(e) => setQuoteQuantity(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer h-1.5 rounded-lg bg-muted"
                />
              </div>
            </div>

            <div className="lg:col-span-8">
              {quoteSubmitted ? (
                <div className="p-5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center">
                  <Check size={22} className="text-emerald-500 mx-auto mb-1" />
                  <h4 className="text-sm font-black text-foreground">
                    Enquiry Logged Successfully!
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Our sales team will contact you with the quotation shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleQuoteSubmit} className="space-y-2 text-xs">
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    <div className="col-span-2 sm:col-span-2">
                      <label className="block text-[9px] font-bold uppercase text-muted-foreground mb-0.5">
                        Product Category
                      </label>
                      <select
                        value={formData.product}
                        onChange={(e) =>
                          setFormData({ ...formData, product: e.target.value })
                        }
                        className="w-full px-2.5 py-1.5 rounded-lg bg-background border border-border text-foreground font-bold text-[11px]"
                      >
                        <option>Aluminium Name Plate</option>
                        <option>Acrylic Sign Board</option>
                        <option>Industrial Screen Printing</option>
                        <option>House Name Plate</option>
                        <option>Anodize Aluminium Tag</option>
                        <option>SS 304 Etched Plate</option>
                        <option>Polycarbonate Stickers</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold uppercase text-muted-foreground mb-0.5">
                        Thickness
                      </label>
                      <select
                        value={formData.thickness}
                        onChange={(e) =>
                          setFormData({ ...formData, thickness: e.target.value })
                        }
                        className="w-full px-2 py-1.5 rounded-lg bg-background border border-border text-foreground font-mono font-bold text-[11px]"
                      >
                        <option>0.3 mm</option>
                        <option>0.5 mm</option>
                        <option>0.7 mm</option>
                        <option>0.91 mm</option>
                        <option>1.5 mm</option>
                        <option>2.0 mm</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold uppercase text-muted-foreground mb-0.5">
                        Holes
                      </label>
                      <select
                        value={formData.holes}
                        onChange={(e) =>
                          setFormData({ ...formData, holes: e.target.value })
                        }
                        className="w-full px-2 py-1.5 rounded-lg bg-background border border-border text-foreground font-mono font-bold text-[11px]"
                      >
                        <option>1 mm</option>
                        <option>2 mm</option>
                        <option>3 mm</option>
                        <option>4 mm</option>
                        <option>5 mm</option>
                        <option>No Holes</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold uppercase text-muted-foreground mb-0.5">
                        Colour
                      </label>
                      <select
                        value={formData.colour}
                        onChange={(e) =>
                          setFormData({ ...formData, colour: e.target.value })
                        }
                        className="w-full px-2 py-1.5 rounded-lg bg-background border border-border text-foreground font-bold text-[11px]"
                      >
                        <option>Single Colour</option>
                        <option>Double Colour</option>
                        <option>Three Colour</option>
                        <option>Four Colour</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Your Name / Company *"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="sm:col-span-3 px-2.5 py-1.5 rounded-lg bg-background border border-border text-foreground font-medium text-[11px]"
                    />
                    <input
                      type="tel"
                      required
                      placeholder="WhatsApp / Mobile No. *"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="sm:col-span-3 px-2.5 py-1.5 rounded-lg bg-background border border-border text-foreground font-mono font-semibold text-[11px]"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Delivery Address & Custom Requirement *"
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData({ ...formData, notes: e.target.value })
                      }
                      className="sm:col-span-4 px-2.5 py-1.5 rounded-lg bg-background border border-border text-foreground font-medium text-[11px]"
                    />
                    <button
                      type="submit"
                      className="sm:col-span-2 py-1.5 px-3 rounded-lg text-xs font-black uppercase bg-gradient-to-r from-amber-500 to-yellow-500 text-zinc-950 hover:brightness-110 transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <Send size={11} />
                      <span>Submit</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          INSTANT "GET BEST QUOTE" MODAL FOR ANY CATALOG PRODUCT
         ══════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {modalProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModalProduct(null)}
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl bg-card border border-border shadow-2xl overflow-hidden"
            >
              <div className="p-4 bg-muted/40 border-b border-border flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-12 h-12 rounded-xl bg-background border border-border overflow-hidden shrink-0">
                    <Image
                      src={modalProduct.img}
                      alt={modalProduct.title}
                      fill
                      className="object-contain p-1"
                      sizes="50px"
                    />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-mono font-bold uppercase text-amber-500 block">
                      Enquire Now • {modalProduct.code}
                    </span>
                    <h3 className="text-sm font-black text-foreground truncate">
                      {modalProduct.title}
                    </h3>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setModalProduct(null)}
                  className="w-7 h-7 rounded-lg bg-muted hover:bg-muted/80 flex items-center justify-center text-muted-foreground hover:text-foreground"
                >
                  <X size={15} />
                </button>
              </div>

              {modalSuccessId ? (
                <div className="p-6 text-center space-y-3">
                  <CheckCircle2 size={32} className="text-emerald-500 mx-auto" />
                  <h4 className="text-base font-black text-foreground">
                    Enquiry Sent! ({modalSuccessId})
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Your requirement for <strong>{modalProduct.title}</strong> has been logged in our system.
                  </p>
                  <div className="flex gap-2 justify-center pt-1">
                    <a
                      href={`https://wa.me/919876543210?text=${encodeURIComponent(
                        `Hi Sourav Graphic! I requested a quote (${modalSuccessId}) for ${modalProduct.title} (Thickness: ${modalForm.thickness}, Holes: ${modalForm.holes}, Qty: ${modalForm.quantity}).`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-emerald-500 text-zinc-950 font-black text-xs flex items-center gap-1.5"
                    >
                      <MessageCircle size={13} /> WhatsApp Us
                    </a>
                    <button
                      type="button"
                      onClick={() => setModalProduct(null)}
                      className="px-4 py-2 rounded-xl bg-muted text-foreground font-bold text-xs"
                    >
                      Close
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleModalQuoteSubmit} className="p-4 space-y-3 text-xs">
                  <div className="grid grid-cols-4 gap-2">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">
                        Thickness
                      </label>
                      <select
                        value={modalForm.thickness}
                        onChange={(e) =>
                          setModalForm({ ...modalForm, thickness: e.target.value })
                        }
                        className="w-full px-2 py-1.5 rounded-lg bg-background border border-border font-mono font-bold text-[11px]"
                      >
                        <option>0.3 mm</option>
                        <option>0.5 mm</option>
                        <option>0.7 mm</option>
                        <option>0.91 mm</option>
                        <option>1.5 mm</option>
                        <option>2.0 mm</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">
                        Holes
                      </label>
                      <select
                        value={modalForm.holes}
                        onChange={(e) =>
                          setModalForm({ ...modalForm, holes: e.target.value })
                        }
                        className="w-full px-2 py-1.5 rounded-lg bg-background border border-border font-mono font-bold text-[11px]"
                      >
                        <option>1 mm</option>
                        <option>2 mm</option>
                        <option>3 mm</option>
                        <option>4 mm</option>
                        <option>5 mm</option>
                        <option>No Holes</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">
                        Colour
                      </label>
                      <select
                        value={modalForm.colour}
                        onChange={(e) =>
                          setModalForm({ ...modalForm, colour: e.target.value })
                        }
                        className="w-full px-2 py-1.5 rounded-lg bg-background border border-border font-bold text-[11px]"
                      >
                        <option>Single Colour</option>
                        <option>Double Colour</option>
                        <option>Three Colour</option>
                        <option>Four Colour</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">
                        Qty
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={modalForm.quantity}
                        onChange={(e) =>
                          setModalForm({ ...modalForm, quantity: e.target.value })
                        }
                        className="w-full px-2 py-1.5 rounded-lg bg-background border border-border font-mono font-bold text-center text-[11px]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Your Full Name *"
                      value={modalForm.name}
                      onChange={(e) =>
                        setModalForm({ ...modalForm, name: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-background border border-border font-medium"
                    />
                    <input
                      type="tel"
                      required
                      placeholder="Mobile / WhatsApp *"
                      value={modalForm.phone}
                      onChange={(e) =>
                        setModalForm({ ...modalForm, phone: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-background border border-border font-mono font-semibold"
                    />
                  </div>

                  <input
                    type="text"
                    required
                    placeholder="Delivery Address / City *"
                    value={modalForm.address}
                    onChange={(e) =>
                      setModalForm({ ...modalForm, address: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-background border border-border font-medium"
                  />

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="submit"
                      disabled={modalSubmitting}
                      className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-zinc-950 font-black uppercase tracking-wider shadow-md hover:brightness-110 transition-all cursor-pointer"
                    >
                      {modalSubmitting ? "Sending..." : "Submit Enquiry"}
                    </button>
                    <Link
                      href="/customize"
                      className="py-2.5 px-3 rounded-xl bg-muted hover:bg-muted/80 border border-border font-bold flex items-center gap-1"
                    >
                      <Upload size={12} /> Upload Photo
                    </Link>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Compact Footer */}
      <footer className="mt-auto border-t border-border py-4 px-4 sm:px-6 lg:px-10 2xl:px-14 bg-card/60 dark:bg-background">
        <div className="w-full max-w-[1920px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground font-medium">
          <div className="flex items-center gap-3">
            <div className="relative h-6 w-20">
              <Image
                src="/Media/Logo.png"
                alt="Logo"
                fill
                sizes="90px"
                className="object-contain object-left opacity-90"
              />
            </div>
            <span>•</span>
            <span>Industrial Metal Labels, Nameplates & Signage Manufacturer</span>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <a href="#products" className="hover:text-foreground transition-colors">
              Our Products
            </a>
            <a href="#industries" className="hover:text-foreground transition-colors">
              Industries
            </a>
            <a href="#profile" className="hover:text-foreground transition-colors">
              Company Profile
            </a>
            <Link
              href="/customize"
              prefetch={true}
              className="hover:text-foreground transition-colors font-bold"
            >
              Upload Design / Studio
            </Link>
            <Link
              href="/admin"
              className="px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold hover:bg-amber-500 hover:text-zinc-950 transition-colors"
            >
              Admin Portal
            </Link>
          </div>

          <div>
            &copy; {new Date().getFullYear()} Sourav Graphic. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
