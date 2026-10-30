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
  ChevronLeft,
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
  ZoomIn,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "./ThemeProvider";
import SweepButton from "./SweepButton";
import ThemeToggle from "./ThemeToggle";
import RealBlackPlateSpecimen from "./RealBlackPlateSpecimen";
import PremiumLoader, { isScreenLoaderEnabled } from "./PremiumLoader";
import MetalScrollToTop from "./MetalScrollToTop";
import { INITIAL_LEADS } from "@/lib/adminData";

function WhatsAppLogo({ size = 15, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12.031 2c-5.516 0-9.999 4.486-9.999 10.004 0 1.766.461 3.49 1.337 5.008L2 22l5.125-1.344a9.953 9.953 0 0 0 4.904 1.292h.004c5.515 0 9.998-4.486 9.998-10.004 0-2.673-1.04-5.186-2.928-7.075A9.936 9.936 0 0 0 12.031 2zm5.847 14.287c-.246.693-1.432 1.326-1.997 1.411-.513.077-1.163.11-1.878-.118-.434-.138-.99-.322-1.703-.63-2.996-1.294-4.953-4.312-5.102-4.512-.149-.199-1.218-1.621-1.218-3.092 0-1.471.771-2.194 1.045-2.493.274-.3.598-.375.797-.375.199 0 .398.002.573.01.184.009.43-.07.673.514.249.599.846 2.07.921 2.22.075.15.125.324.025.524-.1.2-.15.324-.299.499-.149.175-.314.39-.448.524-.15.149-.306.311-.131.611.174.3.774 1.278 1.662 2.071 1.142 1.018 2.104 1.334 2.403 1.484.299.15.473.125.648-.075.174-.2.747-.873.946-1.172.199-.3.399-.25.673-.15.274.1 1.743.823 2.042.972.299.15.498.225.573.35.075.124.075.723-.171 1.415z" />
    </svg>
  );
}

const FEATURED_SPECIMEN_SLIDES = [
  {
    src: "/Media/1.png",
    alt: "Real Anodized & Black Motor Rating Plates Specimen 1",
    caption: "Black Anodized Motor & Inspection Plates",
    badge: "Specimen 01 / 02",
  },
  {
    src: "/Media/2.png",
    alt: "Real Industrial Etched Switchgear & Warning Plates Specimen 2",
    caption: "Etched Switchgear, Chamber & Safety Plates",
    badge: "Specimen 02 / 02",
  },
];

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
    title: "Aluminium Name Plate",
    code: "SG-ALU-101",
    desc: "Anodized & etched aluminium rating plates for motors & panels.",
    thickness: "0.3 – 2.0mm",
    material: "6061 / 1100 Aluminium",
    process: "Anodize + Laser Etch",
    mounting: "1–5mm Holes",
    application: "Machinery & Motors",
    tag: "Bestseller",
    img: "/Media/Aluminium Name Plate.webp",
  },
  {
    id: 2,
    category: "Aluminium Nameplates",
    title: "Aluminium Etching Plate",
    code: "SG-ALU-102",
    desc: "Deep chemical-etched aluminium plates with enamel colour fill.",
    thickness: "0.7 – 3.0mm",
    material: "Brushed Aluminium",
    process: "Chemical Etching",
    mounting: "Holes / Studs",
    application: "Valves & Equipment",
    tag: "Export",
    img: "/Media/Aluminium Etching Plate.jpeg",
  },
  {
    id: 3,
    category: "Industrial Tags & Labels",
    title: "QR & Barcode Metal Tag",
    code: "SG-TAG-201",
    desc: "Anodized aluminium tags with sequential barcode & QR matrix.",
    thickness: "0.3 – 1.5mm",
    material: "Anodized Aluminium",
    process: "Laser Matrix",
    mounting: "1–5mm Holes",
    application: "Asset & Cable ID",
    tag: "QR / ID",
    img: "/Media/QR & Barcode Metal Tag.webp",
  },
  {
    id: 4,
    category: "SS & Brass Plates",
    title: "SS 304 Etched Plate",
    code: "SG-SS-301",
    desc: "Corrosion-proof stainless steel machinery rating plates.",
    thickness: "0.5 – 2.0mm",
    material: "SS 304 / 316",
    process: "Acid Etching",
    mounting: "2–5mm Holes",
    application: "Chemical & Marine",
    tag: "SS 304/316",
    img: "/Media/SS 304 Etched Plate.webp",
  },
  {
    id: 5,
    category: "SS & Brass Plates",
    title: "Brass & Gold Plate",
    code: "SG-BRS-302",
    desc: "Etched solid brass & PVDF gold coated name boards.",
    thickness: "1.0 – 4.0mm",
    material: "Brass / Gold SS",
    process: "Etched + Lacquer",
    mounting: "Studs / Screws",
    application: "Corporate Signage",
    tag: "Gold Finish",
    img: "/Media/Brass & Gold Plate.jpg",
  },
  {
    id: 6,
    category: "Polycarbonate & Stickers",
    title: "Polycarbonate Sticker",
    code: "SG-PC-401",
    desc: "Sub-surface printed polycarbonate overlays with 3M backing.",
    thickness: "0.18 – 0.5mm",
    material: "Lexan / PVC Foil",
    process: "Reverse Print",
    mounting: "3M Adhesive",
    application: "Control Panels",
    tag: "3M Backing",
    img: "/Media/Polycarbonate Sticker.webp",
  },
  {
    id: 7,
    category: "Acrylic & Screen Print",
    title: "Danger & Safety Plate",
    code: "SG-PRT-501",
    desc: "1 to 4 colour industrial screen printed safety & warning boards.",
    thickness: "0.5 – 2.0mm",
    material: "Aluminium / PVC",
    process: "1–4 Colour Print",
    mounting: "Holes / 3M",
    application: "Electrical Safety",
    tag: "1–4 Colour",
    img: "/Media/Danger & Safety Plate.webp",
  },
  {
    id: 8,
    category: "Industrial Tags & Labels",
    title: "Black Anodized Tag",
    code: "SG-TAG-202",
    desc: "Scratch-proof matte black aluminium tag with laser engraving.",
    thickness: "0.5 – 2.0mm",
    material: "Black Aluminium",
    process: "Fiber Laser",
    mounting: "1–5mm Holes",
    application: "Switchgear & Pumps",
    tag: "Ano-Etch",
    img: "/Media/Black Anodized Tag.jpg",
  },
  {
    id: 9,
    category: "SS & Brass Plates",
    title: "Cabin & Door Plate",
    code: "SG-DSK-303",
    desc: "CNC-chamfered metal door & desk plates for offices.",
    thickness: "2.0 – 12mm",
    material: "Aluminium / Brass",
    process: "Bevel + Laser",
    mounting: "Standoffs",
    application: "Offices & Cabins",
    tag: "Custom",
    img: "/Media/Cabin & Door Plate.jpg",
  },
  {
    id: 10,
    category: "Acrylic & Screen Print",
    title: "Acrylic Sign Board",
    code: "SG-ACR-502",
    desc: "Weatherproof laser-cut cast acrylic & house name plates.",
    thickness: "2.0 – 6.0mm",
    material: "Cast Acrylic",
    process: "UV Screen Print",
    mounting: "SS Studs",
    application: "House & Office",
    tag: "Outdoor",
    img: "/Media/Acrylic Sign Board.jpg",
  },
  {
    id: 11,
    category: "Polycarbonate & Stickers",
    title: "Inspection Punch Tag",
    code: "SG-PC-402",
    desc: "Monthly maintenance & inspection punch grid metal labels.",
    thickness: "0.3 – 1.0mm",
    material: "Anodized Foil / Alu",
    process: "Etched Grid",
    mounting: "Rivet / 3M",
    application: "AMC & Maintenance",
    tag: "Punch Grid",
    img: "/Media/Inspection Punch Tag.jpg",
  },
  {
    id: 12,
    category: "Aluminium Nameplates",
    title: "CNG Compliance Plate",
    code: "SG-ALU-104",
    desc: "Deep-etched compliance plates for CNG cylinders & vessels.",
    thickness: "0.7 – 2.0mm",
    material: "Hard Anodized Alu",
    process: "Deep Stamp",
    mounting: "Rivet Holes",
    application: "CNG & Boilers",
    tag: "PESO Grade",
    img: "/Media/CNG Compliance Plate.jpg",
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
  const [specimenSlide, setSpecimenSlide] = useState(0);

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
  const [showInitialLoader, setShowInitialLoader] = useState(false);

  // High-Res Product Photo Zoom / Specimen Inspection Lightbox State
  const [lightboxProduct, setLightboxProduct] = useState(null);
  const [lightboxZoom, setLightboxZoom] = useState(1);
  const [adminCatalog, setAdminCatalog] = useState(null);
  const [openFaqIdx, setOpenFaqIdx] = useState(0);

  // Dynamic Factory & Contact Info (Synced with Admin Factory Settings)
  const [factoryInfo, setFactoryInfo] = useState({
    businessName: "Sourav Graphic & Metal Label",
    whatsapp: "9876543210",
    address: "Industrial Area, New Delhi, India",
    gstin: "07AABCS1429B1Z1",
    tagline: "B2B Industrial Nameplate & Metal Label Manufacturer",
  });

  const waNumber = (() => {
    const digits = String(factoryInfo.whatsapp || "9876543210").replace(/\D/g, "");
    return digits.length === 10 ? `91${digits}` : digits || "919876543210";
  })();

  useEffect(() => {
    let active = true;

    try {
      const localAdmin = localStorage.getItem("sourav_admin_settings");
      if (localAdmin) {
        const parsed = JSON.parse(localAdmin);
        if (parsed) setFactoryInfo((prev) => ({ ...prev, ...parsed }));
      }
      const savedMats = localStorage.getItem("sourav_admin_materials");
      if (savedMats) {
        const parsedMats = JSON.parse(savedMats);
        if (Array.isArray(parsedMats) && parsedMats.length > 0) {
          setAdminCatalog(parsedMats);
        }
      }
    } catch (e) {}

    let channel = null;
    try {
      if (typeof BroadcastChannel !== "undefined") {
        channel = new BroadcastChannel("sourav_studio_mode_channel");
        channel.onmessage = (event) => {
          if (event?.data?.factoryInfo) {
            setFactoryInfo((prev) => ({ ...prev, ...event.data.factoryInfo }));
          }
          if (Array.isArray(event?.data?.catalogItems)) {
            setAdminCatalog(event.data.catalogItems);
          }
        };
      }
    } catch (e) {}

    const enabled = isScreenLoaderEnabled();
    if (enabled) {
      setShowInitialLoader(true);
      const t = setTimeout(() => {
        if (active) setShowInitialLoader(false);
      }, 500);
      fetch("/api/studio-settings", { cache: "no-store" })
        .then((r) => r.json())
        .then((data) => {
          if (data?.success && data.settings) {
            const loaderOn = data.settings.screenLoaderOn !== false;
            if (data.settings.factoryInfo && active) {
              setFactoryInfo((prev) => ({ ...prev, ...data.settings.factoryInfo }));
            }
            if (Array.isArray(data.settings.catalogItems) && active) {
              setAdminCatalog(data.settings.catalogItems);
            }
            try {
              localStorage.setItem("sourav_screen_loader", String(loaderOn));
            } catch (e) {}
            if (!loaderOn && active) setShowInitialLoader(false);
          }
        })
        .catch(() => {});
      return () => {
        active = false;
        clearTimeout(t);
        if (channel) channel.close();
      };
    } else {
      setShowInitialLoader(false);
      fetch("/api/studio-settings", { cache: "no-store" })
        .then((r) => r.json())
        .then((data) => {
          if (active && data?.success && data.settings) {
            if (data.settings.factoryInfo) {
              setFactoryInfo((prev) => ({ ...prev, ...data.settings.factoryInfo }));
            }
            if (Array.isArray(data.settings.catalogItems)) {
              setAdminCatalog(data.settings.catalogItems);
            }
          }
        })
        .catch(() => {});
      return () => {
        active = false;
        if (channel) channel.close();
      };
    }
  }, []);

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

  // Automatic shifting / sliding between 1.png and 2.png in Featured Specimen
  useEffect(() => {
    const timer = setInterval(() => {
      setSpecimenSlide((prev) => (prev + 1) % FEATURED_SPECIMEN_SLIDES.length);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  const liveCatalogProducts = (() => {
    if (!Array.isArray(adminCatalog) || adminCatalog.length === 0) {
      return CATALOG_PRODUCTS;
    }
    const baseTitles = new Set(
      CATALOG_PRODUCTS.map((p) => p.title.toLowerCase())
    );
    const updatedBase = CATALOG_PRODUCTS.map((p) => {
      const match = adminCatalog.find(
        (m) => (m.name || "").toLowerCase() === p.title.toLowerCase()
      );
      if (!match) return p;
      return {
        ...p,
        thickness: match.thickness || p.thickness,
        status: match.status || "Available",
        tag:
          match.status === "Out of Stock"
            ? "Out of Stock"
            : match.popular
            ? "Top Seller"
            : p.tag,
      };
    });
    const extraProducts = adminCatalog
      .filter((m) => m.name && !baseTitles.has(m.name.toLowerCase()))
      .map((m, idx) => ({
        id: m.id || `custom-${idx}`,
        code: `SG-C${idx + 1}`,
        title: m.name,
        category: m.category || "Industrial Tags & Labels",
        desc: `Custom B2B industrial ${m.name} manufactured to OEM drawing & gauge specifications.`,
        material: m.name,
        thickness: m.thickness || "0.5mm – 2.0mm",
        mounting: "Holes / 3M Adhesive",
        tag: m.status === "Out of Stock" ? "Out of Stock" : "New Addition",
        status: m.status || "Available",
        img: m.img || "/Media/metal labels.jpg",
      }));
    return [...extraProducts, ...updatedBase];
  })();

  const filteredProducts = liveCatalogProducts.filter((p) => {
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
    } catch (e) { }

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
    } catch (err) { }

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
      {showInitialLoader && (
        <PremiumLoader label="Loading B2B Industrial Catalog..." />
      )}
      {/* ══════════════════════════════════════════════════════════════════
          FLUID FULL-WIDTH STICKY HEADER WITH SEARCH & DIRECT ENQUIRY CTAS
         ══════════════════════════════════════════════════════════════════ */}
      <header
        className={`fixed top-0 inset-x-0 z-40 transition-all duration-200 border-b ${scrolled
            ? "bg-card/95 dark:bg-[#0c0e14]/95 backdrop-blur-xl border-border shadow-md py-2"
            : "bg-background/90 backdrop-blur-md border-border/60 py-2.5"
          }`}
      >
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10 2xl:px-14 flex items-center justify-between gap-3">
          {/* Left: Brand Logo + Verified Badge */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/"
              prefetch={true}
              className="relative flex items-center h-8 sm:h-9 w-24 sm:w-28 group shrink-0"
            >
              <div className="absolute left-0 top-1/2 -translate-y-1/2 h-[68px] sm:h-[76px] w-24 sm:w-28 transition-transform duration-150 group-hover:scale-105 pointer-events-none">
                <Image
                  src="/Media/Logo.png"
                  alt="Sourav Graphic"
                  fill
                  sizes="180px"
                  className="object-contain object-center scale-[1.08] dark:brightness-110"
                  priority
                />
              </div>
            </Link>
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-[10.5px] font-extrabold uppercase tracking-wide">
              <BadgeCheck size={13} className="text-emerald-500 shrink-0" />
              <span>B2B OEM & Wholesale Manufacturer</span>
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
            <motion.a
              href={`https://wa.me/${waNumber}?text=Hi%20Sourav%20Graphic,%20I%20want%20to%20enquire%20about%20industrial%20metal%20labels%20and%20nameplates.`}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              className="hidden sm:inline-flex relative overflow-hidden items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 hover:text-zinc-950 border border-emerald-500/35 text-[11px] font-extrabold transition-colors duration-500 group shadow-2xs hover:shadow-emerald-500/25 hover:shadow-md"
            >
              <span className="absolute inset-0 bg-[#25D366] rounded-full -translate-x-[101%] group-hover:translate-x-0 transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] z-0 pointer-events-none" />
              <WhatsAppLogo
                size={14}
                className="relative z-10 text-[#25D366] group-hover:text-zinc-950 transition-all duration-500 group-hover:rotate-12 group-hover:scale-110"
              />
              <span className="relative z-10">WhatsApp</span>
            </motion.a>
            <ThemeToggle size="sm" />
            <SweepButton href="/customize" label="Upload Design / Enquire" size="nav" />
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════════════════════
          COMPACT 3-COLUMN FLUID B2B HERO (Adapts to 13" up to 50"+ Screens)
         ══════════════════════════════════════════════════════════════════ */}
      <section className="relative pt-16 sm:pt-18 pb-4 px-4 sm:px-6 lg:px-10 2xl:px-14 w-full max-w-[1920px] mx-auto z-10">
        {/* Instant-Glance B2B Industrial Trust & Credentials Strip */}
        <div className="mb-3 px-3.5 py-2 rounded-xl bg-card border border-border shadow-2xs flex flex-wrap items-center justify-between gap-2 text-[11px]">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-amber-500 text-zinc-950 font-black text-[10px] uppercase tracking-wider">
              B2B Factory Direct
            </span>
            <span className="font-extrabold text-foreground">
              Dedicated B2B Industrial Manufacturing Partner for OEMs, Factories & Corporate Buyers
            </span>
          </div>
          <div className="hidden xl:flex items-center gap-4 text-[10.5px] font-bold text-muted-foreground">
            <span className="flex items-center gap-1 text-foreground">
              <Check size={12} className="text-emerald-500" /> Direct Wholesale Factory Rates
            </span>
            <span className="flex items-center gap-1 text-foreground">
              <Check size={12} className="text-emerald-500" /> 100% GST Tax Invoice
            </span>
            <span className="flex items-center gap-1 text-foreground">
              <Check size={12} className="text-emerald-500" /> Bulk & Custom CAD Production
            </span>
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <Check size={12} /> Pan-India Industrial Dispatch
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch">
          {/* Col 1 (5 Cols): Manufacturer Value Proposition */}
          <div className="lg:col-span-5 bg-card border border-border rounded-2xl p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden shadow-2xs">
            <div className="relative z-10">
              {/* Top B2B Authority Badge Row */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted border border-border text-foreground text-[10px] font-extrabold uppercase tracking-wider">
                  <Factory size={11} className="text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>B2B Industrial Manufacturer • Bulk & OEM</span>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-muted border border-border text-muted-foreground text-[9.5px] font-mono font-bold uppercase tracking-wider">
                  ISO-Grade Precision
                </span>
              </div>

              {/* HERO COMPANY NAME SHOWCASE — Precision Metallic Nameplate Lockup */}
              <div className="relative rounded-xl bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 dark:from-black dark:via-zinc-900/95 dark:to-zinc-950 border border-amber-500/40 p-3.5 sm:p-4 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.45)] overflow-hidden group">
                {/* 4 Realistic Corner Nameplate Mounting Rivets */}
                <span className="w-2 h-2 rounded-full bg-gradient-to-br from-zinc-200 to-zinc-500 border border-zinc-700 shadow-inner absolute top-2 left-2" />
                <span className="w-2 h-2 rounded-full bg-gradient-to-br from-zinc-200 to-zinc-500 border border-zinc-700 shadow-inner absolute top-2 right-2" />
                <span className="w-2 h-2 rounded-full bg-gradient-to-br from-zinc-200 to-zinc-500 border border-zinc-700 shadow-inner absolute bottom-2 left-2" />
                <span className="w-2 h-2 rounded-full bg-gradient-to-br from-zinc-200 to-zinc-500 border border-zinc-700 shadow-inner absolute bottom-2 right-2" />

                {/* Brushed Metal Hairline Texture & Specular Sweep */}
                <div
                  className="absolute inset-0 opacity-15 pointer-events-none"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(90deg, rgba(255,255,255,0.08) 0px, rgba(255,255,255,0.08) 1px, transparent 1px, transparent 4px)",
                  }}
                />
                <div className="absolute -inset-y-full -left-1/2 w-1/2 bg-gradient-to-r from-transparent via-amber-300/15 to-transparent rotate-12 translate-x-[-120%] group-hover:translate-x-[380%] transition-transform duration-1000 ease-out pointer-events-none" />

                <div className="relative z-10 pl-1.5 pr-1.5">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] font-mono font-extrabold uppercase tracking-[0.25em] text-amber-400/90">
                      PRECISION ETCHED • ANODIZED • LASER ENGRAVED
                    </span>
                  </div>

                  <h1 className="uppercase leading-none">
                    {/* Line 1: SOURAV GRAPHIC in Brushed Silver/White Monumental Display */}
                    <span className="block text-2xl sm:text-3xl xl:text-[32px] 2xl:text-[36px] font-black tracking-[-0.01em] bg-gradient-to-b from-white via-zinc-100 to-zinc-300 bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(255,255,255,0.12)]">
                      SOURAV GRAPHIC
                    </span>

                    {/* Line 2: & METAL LABEL in Embossed 24K Gold Metallic Nameplate Strip */}
                    <span className="mt-2 inline-flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-zinc-950 font-black text-base sm:text-xl xl:text-[21px] tracking-[0.06em] shadow-[0_4px_20px_rgba(245,158,11,0.45),inset_0_1px_1px_rgba(255,255,255,0.8)] border border-amber-200/80">
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-950/75" />
                        <span>&amp; METAL LABEL</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-950/75" />
                      </span>
                      <span className="text-[10px] font-mono font-bold text-zinc-300 tracking-wider uppercase px-2 py-1 rounded border border-white/15 bg-white/5">
                        Direct Factory
                      </span>
                    </span>
                  </h1>
                </div>
              </div>

              <p className="mt-2.5 pl-2.5 border-l-3 border-amber-500 text-[11.5px] sm:text-xs font-extrabold text-amber-700 dark:text-amber-400 leading-snug">
                India&apos;s Trusted B2B Supplier for OEMs, Machinery Builders & Electrical Panel Makers
              </p>

              <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                Bulk manufacturer & exporter of{" "}
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

          {/* Col 2 (3 Cols): Featured Specimen Card with Full-Size Seamless Stage (1.png & 2.png) */}
          <div className="lg:col-span-3 bg-card border border-border rounded-2xl p-3.5 flex flex-col justify-between shadow-2xs overflow-hidden">
            <div className="flex items-center justify-between text-[11px] mb-2">
              <span className="font-bold text-foreground">Featured Specimen</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 font-mono text-[10px] font-bold">
                OEM Export Grade
              </span>
            </div>

            <div className="relative flex-1 w-full min-h-[220px] sm:min-h-[250px] rounded-xl bg-white overflow-hidden flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={FEATURED_SPECIMEN_SLIDES[specimenSlide].src}
                  initial={{ opacity: 0, x: 36 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -36 }}
                  transition={{ duration: 0.42, ease: "easeInOut" }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={FEATURED_SPECIMEN_SLIDES[specimenSlide].src}
                    alt={FEATURED_SPECIMEN_SLIDES[specimenSlide].alt}
                    fill
                    className={`object-contain ${specimenSlide === 0
                        ? "scale-110 p-1 drop-shadow-md"
                        : "scale-[1.14]"
                      }`}
                    sizes="(max-width: 1024px) 100vw, 420px"
                    priority
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Col 3 (4 Cols): Samarth-Style Instant "Tell Us Your Requirement" Box */}
          <div className="lg:col-span-4 bg-card border border-border rounded-2xl p-4 flex flex-col justify-between shadow-2xs">
            <div className="flex items-center justify-between pb-2 border-b border-border/60">
              <div>
                <h2 className="text-xs sm:text-sm font-black uppercase tracking-wide text-foreground">
                  B2B Bulk & Custom Quote Desk
                </h2>
                <p className="text-[10px] text-muted-foreground">
                  Direct factory wholesale quotation • GST Billing Available
                </p>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 text-[10px] font-bold">
                B2B Priority
              </span>
            </div>

            {/* Metal Labels Full Showcase Image (Big & Complete View) */}
            <div className="relative flex-1 w-full h-44 sm:h-52 min-h-[175px] sm:min-h-[205px] my-2 rounded-xl overflow-hidden border border-border/60 bg-[#f6f6f7] flex items-center justify-center">
              <Image
                src="/Media/metal labels.jpg"
                alt="Industrial Metal Labels Specimen"
                fill
                className="object-contain scale-[1.22] -translate-y-1.5"
                sizes="(max-width: 1024px) 100vw, 480px"
                priority
              />
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
          OPTIMIZED FULL-WIDTH B2B PRODUCT CATALOG SECTION
          (Sticky Category Filter Bar + Unobstructed Real Black Plate Specimens + Compact 2x2 Spec Pills)
         ══════════════════════════════════════════════════════════════════ */}
      <section
        id="products"
        className="py-5 px-4 sm:px-6 lg:px-10 2xl:px-14 w-full max-w-[1920px] mx-auto"
      >
        {/* Top Unified Category & Filter Control Bar */}
        <div className="bg-card border border-border rounded-2xl p-3 sm:p-4 mb-4 shadow-2xs space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-foreground uppercase tracking-tight">
                  Industrial Product Range
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 font-mono text-[10px] font-extrabold">
                  {filteredProducts.length} / {CATALOG_PRODUCTS.length} Items
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Real anodized & etched industrial plates • Select any item to{" "}
                <strong className="text-foreground">Get Best Quote</strong> or{" "}
                <strong className="text-foreground">Upload Sample Photo</strong>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative flex-1 sm:w-60">
                <Search
                  size={13}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter by material, QR, SS 304..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-background border border-border text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
              <Link
                href="/customize"
                prefetch={true}
                className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-[11px] uppercase tracking-wide flex items-center gap-1.5 transition-all shrink-0 shadow-xs"
              >
                <Upload size={12} />
                <span>Upload Custom Drawing</span>
              </Link>
            </div>
          </div>

          {/* Horizontal Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 pt-2 border-t border-border/60 no-scrollbar">
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
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer border ${isActive
                      ? "bg-amber-500 text-zinc-950 border-amber-500 font-black shadow-xs"
                      : "bg-muted/50 text-muted-foreground border-border hover:text-foreground hover:bg-muted"
                    }`}
                >
                  <span>{cat.short}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${isActive
                        ? "bg-zinc-950/15 text-zinc-950"
                        : "bg-background text-muted-foreground"
                      }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Micro-Compact 6-Column Product Grid (Small Cards on All Laptop & Desktop Screens) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="group bg-card border border-border hover:border-amber-500/80 rounded-xl overflow-hidden shadow-2xs hover:shadow-md transition-all duration-150 flex flex-col justify-between"
            >
              <div>
                {/* Real Product Photo Stage (Uncropped Full View + Zoom Lightbox Trigger) */}
                <div
                  onClick={() => {
                    setLightboxProduct(product);
                    setLightboxZoom(1);
                  }}
                  className="relative h-28 bg-white overflow-hidden border-b border-border/60 cursor-zoom-in flex items-center justify-center"
                >
                  <Image
                    src={product.img}
                    alt={product.title}
                    fill
                    className="object-contain p-1 group-hover:scale-105 transition-transform duration-200"
                    sizes="(max-width: 768px) 50vw, 18vw"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightboxProduct(product);
                      setLightboxZoom(1);
                    }}
                    className="absolute top-1.5 right-1.5 p-1 rounded-md bg-zinc-950/75 hover:bg-amber-500 text-white hover:text-zinc-950 border border-white/15 opacity-0 group-hover:opacity-100 transition-all cursor-pointer z-10"
                    title="Zoom & Inspect Product Specimen"
                  >
                    <ZoomIn size={11} />
                  </button>
                </div>

                {/* Micro-Compact Card Info */}
                <div className="px-2 pt-1.5 pb-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[8px] font-mono font-bold text-muted-foreground">
                      {product.code}
                    </span>
                    <span
                      className={`px-1 py-0.1 rounded text-[7.5px] font-black uppercase ${
                        product.status === "Out of Stock"
                          ? "bg-red-500/15 text-red-500"
                          : "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                      }`}
                    >
                      {product.tag}
                    </span>
                  </div>

                  <h3 className="text-[10.5px] font-extrabold text-foreground line-clamp-1 group-hover:text-amber-500 transition-colors mt-0.5 leading-tight">
                    {product.title}
                  </h3>

                  <div className="mt-0.5 flex items-center justify-between gap-1 text-[8.5px] text-muted-foreground font-mono">
                    <span className="truncate">{product.thickness}</span>
                    <span className="text-amber-600 dark:text-amber-400 font-bold shrink-0">
                      • {product.mounting.split(" ")[0]}
                    </span>
                  </div>
                </div>
              </div>

              {/* Micro-Compact Action Row */}
              <div className="px-2 pb-1.5 pt-0.5 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setModalProduct(product);
                    setModalSuccessId("");
                  }}
                  className="flex-1 py-1 px-1.5 rounded-md bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-[9.5px] uppercase tracking-wide transition-all flex items-center justify-center gap-0.5 cursor-pointer"
                >
                  <span>Get Quote</span>
                  <ArrowRight size={9} />
                </button>
                <Link
                  href="/customize"
                  prefetch={true}
                  className="py-1 px-1.5 rounded-md bg-muted hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-zinc-950 border border-border text-[9.5px] font-bold transition-colors flex items-center justify-center"
                  title="Upload Custom Design Photo"
                >
                  <Upload size={10} />
                </Link>
              </div>
            </motion.div>
          ))}
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
                Sourav Graphic & Metal Label — Fact Sheet
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
              <motion.a
                href={`https://wa.me/${waNumber}?text=Hi%20Sourav%20Graphic,%20I%20want%20to%20enquire%20about%20industrial%20metal%20labels%20and%20nameplates.`}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 280, damping: 22 }}
                className="relative p-[2.5px] rounded-full bg-emerald-500/25 border border-emerald-500/40 group shadow-sm hover:shadow-emerald-500/30 hover:shadow-lg transition-all duration-300 inline-flex items-center cursor-pointer select-none"
              >
                <div className="relative flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#128C7E] dark:bg-zinc-950 overflow-hidden">
                  {/* Smooth 600ms WhatsApp Green Filling Sweep */}
                  <div className="absolute inset-0 bg-[#25D366] rounded-full -translate-x-[101%] group-hover:translate-x-0 transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] z-10 pointer-events-none" />

                  {/* Sliding Official WhatsApp Logo */}
                  <div className="relative z-20 flex items-center overflow-hidden w-4 h-4">
                    <WhatsAppLogo
                      size={15}
                      className="absolute left-0 text-[#25D366] group-hover:text-zinc-950 transition-all duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-6"
                    />
                    <WhatsAppLogo
                      size={15}
                      className="absolute left-0 text-zinc-950 -translate-x-6 transition-all duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0 group-hover:rotate-12"
                    />
                  </div>

                  <span className="relative z-20 text-white group-hover:text-zinc-950 font-black text-xs transition-colors duration-500 whitespace-nowrap">
                    Chat on WhatsApp
                  </span>
                </div>
              </motion.a>
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
          COMPACT B2B TECHNICAL FAQ & MATERIAL SELECTION GUIDE (#faq)
         ══════════════════════════════════════════════════════════════════ */}
      <section
        id="faq"
        className="py-5 px-4 sm:px-6 lg:px-10 2xl:px-14 w-full max-w-[1920px] mx-auto border-t border-border/50"
      >
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase text-amber-500 block">
              B2B Procurement & Technical Guide
            </span>
            <h2 className="text-base sm:text-lg font-black text-foreground">
              Frequently Asked Questions — Industrial Metal Labels
            </h2>
          </div>
          <span className="text-[11px] font-mono text-muted-foreground">
            Click any question to view specification answer
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {[
            {
              q: "1. What is the difference between SS 304 Etched Plates and Anodized Aluminium Nameplates?",
              a: "SS 304/316 Chemical Etched Plates have recessed acid-etched lettering filled with oven-baked epoxy paint, ideal for extreme heat, chemical plants, marine valves, and outdoor switchgear. Anodized Aluminium Plates have sealed dye/laser graphics inside the anodic layer, making them lightweight and cost-effective for motors, pumps, and control panels.",
            },
            {
              q: "2. What is your Minimum Order Quantity (MOQ) and bulk OEM pricing structure?",
              a: "We accept prototype/sample orders starting from 1–10 pieces as well as recurring OEM production schedules of 500 to 50,000+ plates. Tiered wholesale discounts apply automatically at 50, 250, 1,000, and 5,000+ pieces.",
            },
            {
              q: "3. Which artwork or design file formats can we upload for custom fabrication?",
              a: "You can upload a clear photo/sketch of an existing nameplate, or vector/CAD files (.CDR, .AI, .PDF, .EPS, .SVG, .PNG, .JPG) directly on our /customize page. Our in-house CAD desk prepares a digital proof before bulk production.",
            },
            {
              q: "4. What mounting options and hole sizes are available?",
              a: "We provide precision CNC/die-punched corner holes (1 mm, 2 mm, 3 mm, 4 mm, 5 mm, or custom elongated cable-tie slots) as well as industrial 3M 467MP / 468MP high-tack peel-and-stick adhesive backing.",
            },
            {
              q: "5. Can you print sequential serial numbers, QR codes, and barcodes on metal tags?",
              a: "Yes. Using high-speed fiber laser marking, we engrave unique sequential serial numbers, UID matrices, QR codes, and barcodes from your Excel/CSV sheet with 100% scanner readability.",
            },
            {
              q: "6. What is the standard manufacturing lead time and pan-India dispatch process?",
              a: "Standard production takes 3 to 5 working days after artwork approval. Urgent OEM batches can be expedited within 48 hours. We ship pan-India via BlueDart, Delhivery, DTDC, and industrial transport with GST tax invoices.",
            },
          ].map((item, idx) => {
            const isOpen = openFaqIdx === idx;
            return (
              <div
                key={idx}
                onClick={() => setOpenFaqIdx(isOpen ? -1 : idx)}
                className={`rounded-xl border p-3 cursor-pointer transition-all ${
                  isOpen
                    ? "bg-card border-amber-500/60 shadow-xs"
                    : "bg-card/60 border-border hover:border-amber-500/40"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-xs font-extrabold text-foreground leading-snug">
                    {item.q}
                  </h3>
                  <span className="text-xs font-mono font-black text-amber-500 shrink-0">
                    {isOpen ? "−" : "+"}
                  </span>
                </div>
                {isOpen && (
                  <p className="text-[11px] text-muted-foreground mt-2 pt-2 border-t border-border/60 leading-relaxed">
                    {item.a}
                  </p>
                )}
              </div>
            );
          })}
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
                  <div className="relative w-12 h-12 rounded-xl bg-white dark:bg-zinc-900 border border-border overflow-hidden shrink-0">
                    <Image
                      src={modalProduct.img}
                      alt={modalProduct.title}
                      fill
                      className="object-cover"
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
                      href={`https://wa.me/${waNumber}?text=${encodeURIComponent(
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

      {/* ══════════════════════════════════════════════════════════════════
          HIGH-RES PRODUCT PHOTO ZOOM / SPECIMEN INSPECTION LIGHTBOX
         ══════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {lightboxProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxProduct(null)}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 12 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl rounded-2xl bg-card border border-border shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Top Lightbox Header */}
              <div className="px-4 py-3 bg-muted/40 border-b border-border flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400 font-mono font-bold text-[10px]">
                      {lightboxProduct.code}
                    </span>
                    <span className="text-[10px] font-mono uppercase text-muted-foreground">
                      {lightboxProduct.category}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-black text-foreground mt-0.5">
                    {lightboxProduct.title}
                  </h3>
                </div>

                <div className="flex items-center gap-1.5">
                  {[1, 1.5, 2].map((z) => (
                    <button
                      key={z}
                      type="button"
                      onClick={() => setLightboxZoom(z)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-mono font-extrabold border transition-all cursor-pointer ${
                        lightboxZoom === z
                          ? "bg-amber-500 text-zinc-950 border-amber-400"
                          : "bg-background border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {z}x Zoom
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setLightboxProduct(null)}
                    className="w-7 h-7 rounded-lg bg-muted hover:bg-muted/80 flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer ml-1"
                  >
                    <X size={15} />
                  </button>
                </div>
              </div>

              {/* High-Resolution Zoomable Specimen Stage */}
              <div className="relative h-64 sm:h-80 bg-white overflow-auto flex items-center justify-center p-4">
                <div
                  className="relative w-full h-full transition-transform duration-200 flex items-center justify-center"
                  style={{ transform: `scale(${lightboxZoom})` }}
                >
                  <Image
                    src={lightboxProduct.img}
                    alt={lightboxProduct.title}
                    fill
                    className="object-contain p-2"
                    sizes="(max-width: 768px) 95vw, 650px"
                  />
                </div>
              </div>

              {/* Technical Spec Strip + Direct Enquiry Actions */}
              <div className="p-4 border-t border-border bg-card space-y-3">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {lightboxProduct.desc}
                </p>

                <div className="grid grid-cols-3 gap-2 text-[11px]">
                  <div className="p-2 rounded-lg bg-muted/50 border border-border/60">
                    <span className="text-[9px] font-mono uppercase text-muted-foreground block">
                      Material Grade
                    </span>
                    <span className="font-extrabold text-foreground">
                      {lightboxProduct.material}
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-muted/50 border border-border/60">
                    <span className="text-[9px] font-mono uppercase text-muted-foreground block">
                      Thickness Range
                    </span>
                    <span className="font-mono font-extrabold text-amber-600 dark:text-amber-400">
                      {lightboxProduct.thickness}
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-muted/50 border border-border/60">
                    <span className="text-[9px] font-mono uppercase text-muted-foreground block">
                      Mounting / Finish
                    </span>
                    <span className="font-extrabold text-foreground">
                      {lightboxProduct.mounting}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      const prod = lightboxProduct;
                      setLightboxProduct(null);
                      setModalProduct(prod);
                      setModalSuccessId("");
                    }}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Get Bulk Quote for This Plate</span>
                    <ArrowRight size={13} />
                  </button>
                  <a
                    href={`https://wa.me/${waNumber}?text=${encodeURIComponent(
                      `Hi Sourav Graphic, I want a bulk quotation for *${lightboxProduct.title}* (${lightboxProduct.code}, ${lightboxProduct.material}, Thickness: ${lightboxProduct.thickness}).`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5"
                  >
                    <WhatsAppLogo size={14} />
                    <span>WhatsApp Quote</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Compact Footer */}
      <footer className="mt-auto border-t border-border py-4 px-4 sm:px-6 lg:px-10 2xl:px-14 bg-card/60 dark:bg-background">
        <div className="w-full max-w-[1920px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground font-medium">
          <div className="flex items-center gap-3">
            <Link href="/" className="relative flex items-center h-7 w-24 shrink-0">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 h-14 w-24 pointer-events-none">
                <Image
                  src="/Media/Logo.png"
                  alt="Logo"
                  fill
                  sizes="120px"
                  className="object-contain object-center scale-[1.08] opacity-95"
                />
              </div>
            </Link>
            <span>•</span>
            <span>
              {factoryInfo.businessName || "Sourav Graphic & Metal Label"} • {factoryInfo.address || "Industrial Metal Label Manufacturer"}
            </span>
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
