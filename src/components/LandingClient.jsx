"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { 
  ArrowRight, 
  Check, 
  Sliders, 
  ShieldCheck, 
  Layers, 
  Cpu, 
  Award, 
  Clock, 
  ChevronRight,
  ExternalLink,
  MessageSquare,
  Send,
  Building2,
  CheckCircle2,
  MoveRight,
  Factory,
  Briefcase,
  ChevronsRight,
  Lightbulb
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useTheme } from "./ThemeProvider";
import SweepButton from "./SweepButton";
import ThemeToggle from "./ThemeToggle";
import { INITIAL_LEADS } from "@/lib/adminData";

const sampleProducts = [
  { 
    id: 1, 
    category: "Office & Desk",
    title: "Brushed Aluminum Door Sign", 
    desc: "Satin-brushed 6061 alloy with high-precision fiber laser relief engraving.",
    price: "₹999", 
    tag: "Bestseller",
    img: "/Media/brushed_aluminum_sign.png" 
  },
  { 
    id: 2, 
    category: "Office & Desk",
    title: "Executive Minimalist Desk Plate", 
    desc: "Heavyweight solid metal block with angled display face and felt base.",
    price: "₹1,299", 
    tag: "Executive",
    img: "/Media/desk_name_plate.png" 
  },
  { 
    id: 3, 
    category: "Architectural Plaques",
    title: "Heritage Gold Brass Plaque", 
    desc: "Mirror-chamfered edges, warm metallic luster, coated with protective lacquer.",
    price: "₹2,499", 
    tag: "Luxury",
    img: "/Media/premium_gold_plate.png" 
  },
  { 
    id: 4, 
    category: "Industrial Tags",
    title: "Industrial Grade Equipment Tag", 
    desc: "Chemical and heat-resistant anodized aluminium tag with barcode & serial matrix.",
    price: "₹349", 
    tag: "Heavy-Duty",
    img: "/Media/equipment_tag.png" 
  },
  { 
    id: 5, 
    category: "Industrial Tags",
    title: "Office Specification Metal Labels", 
    desc: "Ultra-slim adhesive metal labels for corporate asset tracking and server racks.",
    price: "₹499", 
    tag: "Precision",
    img: "/Media/office_metal_labels.png" 
  },
  { 
    id: 6, 
    category: "Architectural Plaques",
    title: "Anodized Architectural Room Plate", 
    desc: "Architectural room signage complete with stainless standoff mounting pins.",
    price: "₹899", 
    tag: "Popular",
    img: "/Media/aluminum_door_plate.png" 
  },
  { 
    id: 7, 
    category: "Industrial Tags",
    title: "High-Visibility Safety Warning Sign", 
    desc: "Compliance-rated industrial safety tag with vibrant UV screen print.",
    price: "₹799", 
    tag: "OSHA Grade",
    img: "/Media/warning_signage.png" 
  },
  { 
    id: 8, 
    category: "Architectural Plaques",
    title: "Anodized Matte Aluminum Tag", 
    desc: "Electrochemically oxidized matte finish with scratch-proof laser etched text.",
    price: "₹599", 
    tag: "Matte Finish",
    img: "/Media/anodized_aluminum_tag.png" 
  },
];

const showcaseSpecimens = [
  {
    name: "Brushed Aluminium",
    subtitle: "Aerospace Grade 6061-T6",
    thickness: "3.0 mm",
    finish: "Satin Brushed Horizontal Grain",
    mount: "4× M6 Stainless Standoffs",
    img: "/Media/brushed_aluminum_sign.png",
  },
  {
    name: "Executive Desk Plate",
    subtitle: "Solid Heavy Billet",
    thickness: "12.0 mm",
    finish: "Diamond Cut Bevel Edge",
    mount: "Weighted Non-Slip Base",
    img: "/Media/desk_name_plate.png",
  },
  {
    name: "Heritage Brass Gold",
    subtitle: "Forged Architectural Brass",
    thickness: "4.0 mm",
    finish: "Hand-Buffed Gold PVD Finish",
    mount: "Concealed Stud Mount",
    img: "/Media/premium_gold_plate.png",
  },
  {
    name: "Industrial Control Label",
    subtitle: "Anodized Sealed Aluminium",
    thickness: "1.5 mm",
    finish: "UV Cured High-Contrast Etch",
    mount: "3M High-Bond Adhesive",
    img: "/Media/office_metal_labels.png",
  },
];

export default function LandingClient() {
  const [scrolled, setScrolled] = useState(false);
  const { isDarkMode, setTheme } = useTheme();

  // Parallax Shutter Reveal Ref
  const shutterRef = useRef(null);
  const { scrollYProgress: shutterScrollProgress } = useScroll({
    target: shutterRef,
    offset: ["start end", "end start"]
  });
  
  const shutterScale = useTransform(shutterScrollProgress, [0, 0.4], [0.92, 1]);
  const shutterOpacity = useTransform(shutterScrollProgress, [0, 0.25], [0.5, 1]);
  const shutterInnerY = useTransform(shutterScrollProgress, [0, 1], [-25, 25]);

  // Specimen & filter states
  const [selectedSpecimen, setSelectedSpecimen] = useState(0);
  const [activeCategory, setActiveCategory] = useState("All");
  const [quoteQuantity, setQuoteQuantity] = useState(25);
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);
  const [quickEmail, setQuickEmail] = useState("");
  const [quickSubmitted, setQuickSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", notes: "" });

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 30);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const categories = ["All", "Office & Desk", "Architectural Plaques", "Industrial Tags"];
  const filteredProducts = activeCategory === "All" 
    ? sampleProducts 
    : sampleProducts.filter(p => p.category === activeCategory);

  const calculateEstimate = () => {
    let rate = 750;
    if (quoteQuantity >= 50) rate = 550;
    else if (quoteQuantity >= 20) rate = 650;
    return (rate * quoteQuantity).toLocaleString("en-IN");
  };

  const handleQuickQuote = (e) => {
    e.preventDefault();
    if (!quickEmail) return;
    try {
      const saved = localStorage.getItem("sourav_admin_leads");
      const existing = saved ? JSON.parse(saved) : INITIAL_LEADS;
      const newLead = {
        id: `INQ-${Math.floor(1000 + Math.random() * 9000)}`,
        client: quickEmail.split("@")[0] || "Web Inquiry",
        phone: "Not provided",
        email: quickEmail,
        city: "Website Hero",
        date: new Date().toISOString().split("T")[0],
        source: "Hero Spec Request",
        material: "Brushed / Anodized Aluminium",
        size: "Custom / Catalog Request",
        lighting: "None",
        mounting: "To be discussed",
        textLayers: [],
        quantity: 25,
        status: "New Inquiry",
        notes: "Requested instant spec sheet & bulk quote from homepage hero."
      };
      localStorage.setItem("sourav_admin_leads", JSON.stringify([newLead, ...existing]));
    } catch (err) {}
    setQuickSubmitted(true);
    setQuickEmail("");
    setTimeout(() => setQuickSubmitted(false), 5000);
  };

  const handleQuoteSubmit = (e) => {
    e.preventDefault();
    try {
      const saved = localStorage.getItem("sourav_admin_leads");
      const existing = saved ? JSON.parse(saved) : INITIAL_LEADS;
      const newLead = {
        id: `INQ-${Math.floor(1000 + Math.random() * 9000)}`,
        client: formData.name || "Commercial Client",
        phone: formData.phone || "Not provided",
        email: formData.email || "",
        city: "Commercial Inquiry",
        date: new Date().toISOString().split("T")[0],
        source: "Website Inquiry Console",
        material: showcaseSpecimens[selectedSpecimen]?.name || "Brushed Aluminium",
        size: showcaseSpecimens[selectedSpecimen]?.thickness || "3.0 mm",
        lighting: "To be discussed",
        mounting: showcaseSpecimens[selectedSpecimen]?.mount || "Standoffs",
        textLayers: [],
        quantity: Number(quoteQuantity) || 25,
        status: "New Inquiry",
        notes: formData.notes || "Submitted bulk / custom inquiry from homepage proposal console."
      };
      localStorage.setItem("sourav_admin_leads", JSON.stringify([newLead, ...existing]));
    } catch (err) {}
    setQuoteSubmitted(true);
    setFormData({ name: "", email: "", phone: "", notes: "" });
    setTimeout(() => setQuoteSubmitted(false), 5000);
  };

  const handleThemeToggle = () => {
    setTheme(!isDarkMode);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-amber-500/20 selection:text-amber-500 overflow-x-hidden transition-colors duration-200">
      
      {/* Ambient background glows - rich & radiant in both modes */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-amber-400/[0.12] via-amber-300/[0.05] to-transparent dark:from-amber-500/[0.08] dark:via-amber-400/[0.03] rounded-full blur-3xl opacity-80 dark:opacity-90" />
        <div className="absolute top-[35%] -right-40 w-[600px] h-[500px] bg-sky-400/[0.06] dark:bg-sky-500/[0.04] rounded-full blur-3xl" />
        <div className="absolute top-[70%] -left-40 w-[550px] h-[500px] bg-amber-400/[0.06] dark:bg-amber-500/[0.04] rounded-full blur-3xl" />
      </div>

      {/* 1. Independent Prominent Brand Logo (Left Side, Outside Navbar) */}
      <div className="fixed top-3.5 sm:top-4 left-4 sm:left-8 lg:left-12 z-50 pointer-events-auto">
        <Link href="/" prefetch={true} className="flex items-center group">
          <div className="relative h-11 sm:h-13 w-36 sm:w-44 transition-all duration-200 group-hover:scale-105 active:scale-95">
            <Image 
              src="/Media/Logo.png" 
              alt="Saourav Graphic" 
              fill 
              sizes="180px"
              className="object-contain object-left drop-shadow-sm dark:brightness-110" 
              priority
            />
          </div>
        </Link>
      </div>

      {/* 2. Sleek Floating Header / Navigation Capsule */}
      <header className={`fixed top-4 right-4 sm:right-8 md:left-1/2 md:-translate-x-1/2 md:right-auto z-40 transition-all duration-300 rounded-full ${scrolled ? 'bg-card/90 dark:bg-[#0c0e14]/90 backdrop-blur-2xl border border-border shadow-xl shadow-black/[0.03] dark:shadow-black/30 py-2 sm:py-2.5 px-4 sm:px-6' : 'bg-card/75 dark:bg-background/60 backdrop-blur-md border border-border/70 py-2 sm:py-2.5 px-4 sm:px-6'}`}>
        <div className="flex items-center gap-4 sm:gap-6">
          
          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-7 text-xs lg:text-sm font-semibold text-muted-foreground">
            <a href="#services" className="hover:text-foreground transition-colors">Services</a>
            <a href="#engineering" className="hover:text-foreground transition-colors">Engineering</a>
            <a href="#specimens" className="hover:text-foreground transition-colors">Specimens</a>
            <a href="#products" className="hover:text-foreground transition-colors">Collections</a>
            <a href="#quote" className="hover:text-foreground transition-colors">Estimator</a>
          </nav>

          <div className="hidden md:block h-4 w-px bg-border/60" />

          {/* Action Group */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            
            {/* Animated Theme Toggle Capsule */}
            <ThemeToggle />

            {/* Launch Studio Button - Signature Filling Sweep Button (Fuller & Thicker) */}
            <SweepButton href="/customize" label="Studio Builder" size="nav" />

          </div>
        </div>
      </header>

      {/* 2. GRAND BENTO HERO SECTION (Solid, High-Contrast & Vibrant in Light & Dark) */}
      <section className="relative pt-32 sm:pt-36 pb-16 px-6 max-w-6xl mx-auto w-full z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 auto-rows-[minmax(180px,auto)] items-stretch">
          
          {/* Main Hero Card (8 Cols) - High-Vibrancy Metallic Presence */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-8 bg-card border border-border rounded-3xl p-7 sm:p-10 flex flex-col justify-between relative overflow-hidden shadow-xl shadow-black/[0.03] dark:shadow-black/40 group"
          >
            {/* Fine Brushed Metal Texture & Specular Light Reflection */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-card via-card/80 to-muted/20 dark:from-background dark:via-muted/30 dark:to-card" />
              <div className="absolute inset-0 opacity-[0.035] dark:opacity-[0.05] bg-[repeating-linear-gradient(to_right,transparent,transparent_1px,currentColor_1px,currentColor_2px)]" />
              <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_20%,rgba(255,255,255,0.4)_30%,transparent_40%)] dark:bg-[linear-gradient(115deg,transparent_20%,rgba(255,255,255,0.06)_30%,transparent_40%)]" />
              <div className="absolute -top-24 -left-24 w-72 h-72 bg-amber-400/15 dark:bg-amber-500/10 rounded-full blur-3xl" />
            </div>

            {/* Top Badge - Rich and Crisp in Light Mode */}
            <div className="relative z-10 flex items-center gap-2 mb-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300/80 dark:bg-amber-500/10 dark:text-amber-500 dark:border-amber-500/20 text-xs font-bold tracking-wide shadow-xs">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span>AEROSPACE 6061-T6 ALLOY • FIBER LASER WORKSHOP</span>
              </div>
            </div>

            {/* Headline - Deep, Lustrous Liquid Gold in Light Mode */}
            <div className="relative z-10 mb-6">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground leading-[1.05] uppercase">
                Sourav Graphic & <br />
                <span className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600 dark:from-amber-400 dark:via-amber-300 dark:to-yellow-500 bg-clip-text text-transparent drop-shadow-xs">
                  Metal Labels
                </span>
              </h1>
              <p className="mt-4 text-sm sm:text-base text-muted-foreground font-medium max-w-lg leading-relaxed">
                Heavy-duty custom labels, architectural name plates, and precision laser engravings. Built robust. Hand-finished. Engineered to last a lifetime.
              </p>
            </div>

            {/* Embedded Quick Quote Console & Builder CTA */}
            <div className="relative z-10 mt-auto pt-4 border-t border-border/50">
              <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-2">
                <span>Get an Instant Spec Sheet / Bulk Quote</span>
                <span className="text-amber-700 dark:text-amber-400 flex items-center gap-1 font-bold">
                  <CheckCircle2 size={13} /> 24h Turnaround
                </span>
              </div>

              {quickSubmitted ? (
                <div className="p-3.5 rounded-xl bg-emerald-100 text-emerald-900 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-300/60 dark:border-emerald-500/20 text-xs font-semibold flex items-center gap-2">
                  <Check size={16} />
                  <span>Request received! We will send you our official product catalog within 2 hours.</span>
                </div>
              ) : (
                <form onSubmit={handleQuickQuote} className="flex flex-col sm:flex-row gap-2.5">
                  <input
                    type="email"
                    required
                    placeholder="sanjay.rana@company.com"
                    value={quickEmail}
                    onChange={(e) => setQuickEmail(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-background border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-amber-600 dark:focus:border-amber-500 transition-colors shadow-xs font-medium"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl text-xs font-bold bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-foreground dark:text-background transition-all flex items-center justify-center gap-1.5 whitespace-nowrap active:scale-98 shadow-sm"
                  >
                    <span>Get Quote</span>
                    <ArrowRight size={13} />
                  </button>
                </form>
              )}

              <div className="flex flex-wrap items-center gap-4 mt-4 pt-3 border-t border-border/50">
                <SweepButton href="/customize" label="Try Online Builder" size="md" />
                <span className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-emerald-500" />
                  <span>Real-time digital proof before production</span>
                </span>
              </div>
            </div>

          </motion.div>

          {/* Right Top Card (4 Cols) - Material Sample Full Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="lg:col-span-4 min-h-[320px] lg:min-h-[380px] bg-card border border-border rounded-3xl p-5 relative overflow-hidden shadow-xl shadow-black/[0.03] dark:shadow-black/40 flex flex-col justify-between items-center group"
          >
            {/* Ambient Specular Highlight */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(245,158,11,0.08)_0%,transparent_70%)] pointer-events-none" />

            <div className="w-full flex items-center justify-between text-xs text-muted-foreground z-20">
              <span className="font-mono text-[11px] font-bold text-foreground">Material Samples</span>
              <span className="text-[10px] text-muted-foreground font-semibold">Aerospace Grade</span>
            </div>

            {/* Full Material Sample Image - Zoomed */}
            <div className="relative w-full flex-1 min-h-[240px] sm:min-h-[270px] flex items-center justify-center my-2 z-10">
              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src="/Media/anodized-aluminium-labels-1000x1000-removebg-preview.png"
                  alt="Anodized Aluminium Label"
                  fill
                  className="object-contain scale-125 group-hover:scale-130 transition-transform duration-500 drop-shadow-2xl"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  priority
                />
              </div>
            </div>

            {/* Material Label */}
            <div className="w-full py-2 px-3.5 rounded-xl glass-panel text-center text-xs font-bold text-foreground z-20 border border-border shadow-xs flex items-center justify-between">
              <span className="truncate">Anodized Aluminium Labels</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono font-medium border border-amber-500/20">
                Sample Specimen
              </span>
            </div>
          </motion.div>

          {/* Right Bottom Stats Pill */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.6 }}
            className="lg:col-span-12 glass-panel rounded-2xl p-5 border border-border grid grid-cols-2 md:grid-cols-4 gap-4 items-center text-center"
          >
            <div>
              <div className="text-2xl sm:text-3xl font-black tracking-tight text-foreground font-mono">2,500+</div>
              <div className="text-xs text-muted-foreground font-medium">Plates Fabricated</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black tracking-tight text-foreground font-mono">±0.02 mm</div>
              <div className="text-xs text-muted-foreground font-medium flex items-center justify-center gap-1">
                <ShieldCheck size={13} className="text-emerald-500" />
                <span>CNC Machine Tolerance</span>
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black tracking-tight text-foreground font-mono">24-48h</div>
              <div className="text-xs text-muted-foreground font-medium">Standard Proof Dispatch</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black tracking-tight text-foreground font-mono">100% Solid</div>
              <div className="text-xs text-muted-foreground font-medium">Aerospace Billet Guarantee</div>
            </div>
          </motion.div>

        </div>

      </section>

      {/* 3. CAPABILITIES & SERVICES (Vibrant Bento Cards) */}
      <section id="services" className="py-16 px-6 max-w-6xl mx-auto w-full border-t border-zinc-200/70 dark:border-border/50">
        <div className="text-center max-w-xl mx-auto mb-12">
          <div className="inline-block text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-2">
            Signature Formats
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-foreground">
            Our Core Capabilities
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-zinc-600 dark:text-muted-foreground font-medium">
            Precision fabricated signage engineered for corporate prestige and industrial longevity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* Card 1 */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="p-7 rounded-2xl bg-card border border-border shadow-sm hover:border-amber-500 hover:shadow-xl hover:shadow-amber-500/10 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-800 dark:bg-amber-500/10 dark:text-amber-500 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform shadow-xs">
                <Briefcase size={22} />
              </div>
              <h3 className="text-base font-bold text-foreground mb-2">Corporate Name Plates</h3>
              <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                Architectural brushed aluminium and heavy metal blocks for boardroom tables, office doors, and executive suites.
              </p>
            </div>
            <Link href="/customize" prefetch={true} className="mt-6 text-xs font-bold text-foreground hover:text-amber-600 dark:hover:text-amber-400 inline-flex items-center gap-1 active:scale-95 transition-transform duration-75">
              <span>Configure in 3D</span>
              <ChevronRight size={13} />
            </Link>
          </motion.div>

          {/* Card 2 */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="p-7 rounded-2xl bg-card border border-border shadow-sm hover:border-amber-500 hover:shadow-xl hover:shadow-amber-500/10 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-800 dark:bg-amber-500/10 dark:text-amber-500 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform shadow-xs">
                <Factory size={22} />
              </div>
              <h3 className="text-base font-bold text-foreground mb-2">Industrial Metal Tags</h3>
              <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                Anodized aluminium tags impervious to motor oil, extreme friction, UV radiation, and outdoor exposure.
              </p>
            </div>
            <Link href="/customize" prefetch={true} className="mt-6 text-xs font-bold text-foreground hover:text-amber-600 dark:hover:text-amber-400 inline-flex items-center gap-1 active:scale-95 transition-transform duration-75">
              <span>View Specifications</span>
              <ChevronRight size={13} />
            </Link>
          </motion.div>

          {/* Card 3 */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="p-7 rounded-2xl bg-card border border-border shadow-sm hover:border-amber-500 hover:shadow-xl hover:shadow-amber-500/10 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-800 dark:bg-amber-500/10 dark:text-amber-500 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform shadow-xs">
                <Lightbulb size={22} />
              </div>
              <h3 className="text-base font-bold text-foreground mb-2">LED & Illuminated Plaques</h3>
              <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                Halo-illuminated warm backlighting integrated into precision CNC metal housing for luxury interior spaces.
              </p>
            </div>
            <Link href="/customize" prefetch={true} className="mt-6 text-xs font-bold text-foreground hover:text-amber-600 dark:hover:text-amber-400 inline-flex items-center gap-1 active:scale-95 transition-transform duration-75">
              <span>Explore Lighting</span>
              <ChevronRight size={13} />
            </Link>
          </motion.div>

        </div>
      </section>

      {/* 4. THE PARALLAX SHUTTER REVEAL SECTION */}
      <section id="engineering" ref={shutterRef} className="py-20 px-6 max-w-6xl mx-auto w-full border-t border-border/50">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Shutter Reveal Image Stage */}
          <motion.div 
            style={{ scale: shutterScale, opacity: shutterOpacity }}
            className="lg:col-span-6 relative w-full aspect-[4/3] rounded-3xl border border-border shadow-2xl overflow-hidden group bg-card dark:bg-[#0f1118]"
          >
            <motion.div style={{ y: shutterInnerY }} className="w-full h-full relative">
              <Image 
                src="/Media/premium_gold_plate.png" 
                alt="Heritage Gold Plaque Detail" 
                fill
                className="object-cover group-hover:scale-103 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </motion.div>

            {/* Left Shutter Overlay */}
            <motion.div 
              initial={{ y: "0%" }}
              whileInView={{ y: "102%" }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
              className="absolute top-0 left-0 w-[50.2%] h-full bg-card dark:bg-[#0f1118] z-20 border-r border-border"
            />

            {/* Right Shutter Overlay */}
            <motion.div 
              initial={{ y: "0%" }}
              whileInView={{ y: "-102%" }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
              className="absolute top-0 right-0 w-[50.2%] h-full bg-card dark:bg-[#0f1118] z-20 border-l border-border"
            />

            {/* Floating Tag */}
            <div className="absolute bottom-4 left-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-pill text-[11px] font-bold text-foreground z-30 shadow-md">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span>Micro-Machined Brass Specimen</span>
            </div>
          </motion.div>

          {/* Copy and Specifications */}
          <div className="lg:col-span-6">
            <div className="inline-block text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-2">
              Uncompromising Craftsmanship
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-4">
              Machined to perfection, <br />
              delivered without delay.
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-6 font-medium">
              Whether you need an individual executive door plate or two thousand serialized asset tags for high-voltage transformers, every piece is laser cut and inspected before dispatch.
            </p>

            <div className="space-y-3.5 mb-8">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-500 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  <Check size={13} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">Solid 6061 Alloys & Forged Brass</h4>
                  <p className="text-[11px] text-muted-foreground">Never hollow stamped sheet metal. Genuine aerospace grade billet.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-500 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  <Check size={13} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">Fiber Laser Micro-Relief</h4>
                  <p className="text-[11px] text-muted-foreground">Deep etched typography that will not peel, fade, or dissolve under solvents.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-500 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  <Check size={13} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">Grade 304 Stainless Standoff Hardware</h4>
                  <p className="text-[11px] text-muted-foreground">Includes concentric machined wall mounting studs and neoprene dampeners.</p>
                </div>
              </div>
            </div>

            <SweepButton href="/customize" label="Design Your Plate Now" size="md" />
          </div>

        </div>
      </section>

      {/* 5. INTERACTIVE MATERIAL SPECIMENS */}
      <section id="specimens" className="py-16 px-6 max-w-6xl mx-auto w-full border-t border-border/50">
        <div className="relative glass-panel rounded-3xl p-6 sm:p-10 shadow-xl border border-border overflow-hidden">
          
          <div className="text-center max-w-md mx-auto mb-8">
            <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider block mb-1">
              Tangible Samples
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Explore Physical Finishes
            </h3>
          </div>

          {/* Material Switcher Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            {showcaseSpecimens.map((specimen, idx) => (
              <button
                key={specimen.name}
                onClick={() => setSelectedSpecimen(idx)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-150 cursor-pointer active:scale-95 touch-manipulation select-none ${
                  selectedSpecimen === idx
                    ? 'bg-zinc-950 text-white dark:bg-foreground dark:text-background shadow-sm scale-102'
                    : 'text-muted-foreground hover:text-foreground bg-muted/60 dark:bg-muted/30 border border-border'
                }`}
              >
                {specimen.name}
              </button>
            ))}
          </div>

          {/* Specimen Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Visual Frame */}
            <div className="lg:col-span-7 relative flex items-center justify-center min-h-[260px] sm:min-h-[340px] rounded-2xl bg-card border border-border p-6 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={showcaseSpecimens[selectedSpecimen].name}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="relative w-full h-[220px] sm:h-[300px] max-w-md flex items-center justify-center"
                >
                  <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border-2 border-border">
                    <Image
                      src={showcaseSpecimens[selectedSpecimen].img}
                      alt={showcaseSpecimens[selectedSpecimen].name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Spec Sheet Column */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              <h4 className="text-xl sm:text-2xl font-black text-foreground mb-1">
                {showcaseSpecimens[selectedSpecimen].name}
              </h4>
              <p className="text-xs text-muted-foreground font-medium mb-6">
                {showcaseSpecimens[selectedSpecimen].subtitle}
              </p>

              <div className="space-y-3 mb-6 text-xs sm:text-sm">
                <div className="flex items-center justify-between py-2 border-b border-border/50">
                  <span className="text-muted-foreground font-medium">Thickness Gauge</span>
                  <span className="font-bold text-foreground font-mono">{showcaseSpecimens[selectedSpecimen].thickness}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border/50">
                  <span className="text-muted-foreground font-medium">Surface Texture</span>
                  <span className="font-bold text-foreground">{showcaseSpecimens[selectedSpecimen].finish}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border/50">
                  <span className="text-muted-foreground font-medium">Mounting Hardware</span>
                  <span className="font-bold text-foreground">{showcaseSpecimens[selectedSpecimen].mount}</span>
                </div>
              </div>

              <div className="pt-2">
                <SweepButton href="/customize" label="Customize in Studio" size="md" fullWidth />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. CURATED CATALOG GRID */}
      <section id="products" className="py-16 px-6 max-w-6xl mx-auto w-full border-t border-border/50">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-block text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-2">
              Catalog & Collections
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Signature Metal Formats
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-150 cursor-pointer active:scale-95 touch-manipulation select-none ${
                  activeCategory === cat
                    ? 'bg-zinc-950 text-white dark:bg-foreground dark:text-background shadow-sm'
                    : 'bg-card text-muted-foreground hover:text-foreground border border-border shadow-xs'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredProducts.map((product) => (
            <div 
              key={product.id}
              className="group flex flex-col bg-card border border-border rounded-2xl overflow-hidden hover:border-amber-500 hover:shadow-xl hover:shadow-black/[0.04] transition-all duration-300 shadow-xs"
            >
              <div className="relative h-44 bg-muted/40 dark:bg-[#0c0e14] overflow-hidden">
                <Image
                  src={product.img}
                  alt={product.title}
                  fill
                  className="object-cover group-hover:scale-104 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, 25vw"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-card/90 dark:bg-card/90 text-foreground border border-border text-[10px] font-bold shadow-xs">
                  {product.tag}
                </div>
              </div>

              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-sm font-bold text-foreground mb-1 line-clamp-1 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  {product.title}
                </h3>
                <p className="text-xs text-muted-foreground mb-4 line-clamp-2 leading-relaxed font-medium">
                  {product.desc}
                </p>

                <div className="mt-auto pt-3 border-t border-border/40 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-muted-foreground font-medium block">Fabrication</span>
                    <span className="text-xs font-bold text-foreground">Custom Size & Finish</span>
                  </div>
                  <Link
                    href="/customize"
                    prefetch={true}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-zinc-950 text-white dark:bg-foreground dark:text-background hover:opacity-90 active:scale-95 transition-all duration-75 cursor-pointer touch-manipulation select-none"
                  >
                    <span>Inquire</span>
                    <ArrowRight size={11} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. VOLUME & CUSTOM INQUIRY CONSOLE */}
      <section id="quote" className="py-20 px-6 max-w-5xl mx-auto w-full">
        <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-border relative overflow-hidden shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-6">
              <div className="inline-block text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-2">
                Direct Workshop Inquiry
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground mb-3">
                Submit Your Custom Query
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-6 font-medium">
                Planning signage for a home, corporate office, manufacturing floor, or residential society? Select your approximate quantity and submit your requirement for a tailored quotation.
              </p>

              <div className="p-5 rounded-2xl bg-card border border-border mb-6">
                <div className="flex items-center justify-between text-xs font-bold mb-3">
                  <span className="text-muted-foreground">Approximate Quantity Needed:</span>
                  <span className="text-foreground px-2.5 py-0.5 rounded-md bg-muted/60 dark:bg-muted/40 border border-border shadow-xs font-mono">
                    {quoteQuantity} Units
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="150"
                  step="1"
                  value={quoteQuantity}
                  onChange={(e) => setQuoteQuantity(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer h-1.5 rounded-lg bg-muted"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground mt-2 font-medium">
                  <span>1 pc (Single Custom)</span>
                  <span>25 pcs (Corporate Batch)</span>
                  <span>100+ pcs (Industrial Bulk)</span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-muted-foreground font-medium">
                <div className="flex items-center gap-2">
                  <Check size={13} className="text-emerald-600 dark:text-emerald-500" />
                  <span>Direct consultation & digital proof before laser fabrication</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={13} className="text-emerald-600 dark:text-emerald-500" />
                  <span>Physical pre-production sample available for bulk inquiries</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 bg-card border border-border p-6 sm:p-7 rounded-2xl shadow-sm">
              <h3 className="text-sm font-bold text-foreground mb-4">Request Official Quote & Spec Sheet</h3>
              
              {quoteSubmitted ? (
                <div className="py-12 text-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-500 mx-auto flex items-center justify-center mb-3">
                    <Check size={22} />
                  </div>
                  <h4 className="text-sm font-bold text-foreground mb-1">Inquiry Received</h4>
                  <p className="text-xs text-muted-foreground">Our production manager will email your pricing summary within 24 business hours.</p>
                </div>
              ) : (
                <form onSubmit={handleQuoteSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-[11px] font-bold text-muted-foreground mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Suraj Kumar"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-amber-600 shadow-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-muted-foreground mb-1">Work / Business Email</label>
                    <input
                      type="email"
                      required
                      placeholder="suraj@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-amber-600 shadow-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-muted-foreground mb-1">WhatsApp / Contact Number</label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-amber-600 shadow-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-muted-foreground mb-1">Project Details or Logo Requirements</label>
                    <textarea
                      rows={2}
                      placeholder="Size dimensions, mounting surface, or preferred material..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-amber-600 shadow-xs resize-none font-medium"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl text-xs font-bold bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-foreground dark:text-background transition-all duration-75 flex items-center justify-center gap-2 active:scale-95 cursor-pointer touch-manipulation shadow-sm"
                  >
                    <Send size={13} />
                    <span>Send Proposal Request</span>
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* 8. Minimalist Serene Footer */}
      <footer className="mt-auto border-t border-border py-8 px-6 bg-card/60 dark:bg-background">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground font-medium">
          <div className="flex items-center gap-3">
            <div className="relative h-7 w-24">
              <Image src="/Media/Logo.png" alt="Logo" fill sizes="100px" className="object-contain object-left opacity-90" />
            </div>
            <span>•</span>
            <span>Handcrafted in India</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#services" className="hover:text-foreground transition-colors">Services</a>
            <a href="#engineering" className="hover:text-foreground transition-colors">Engineering</a>
            <a href="#products" className="hover:text-foreground transition-colors">Collections</a>
            <Link href="/customize" prefetch={true} className="hover:text-foreground active:scale-95 transition-all duration-75">Studio Builder</Link>
            <Link href="/admin" className="px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold hover:bg-amber-500 hover:text-zinc-950 transition-colors">
              Admin Portal
            </Link>
          </div>

          <div>
            &copy; {new Date().getFullYear()} Saourav Graphic. All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  );
}
