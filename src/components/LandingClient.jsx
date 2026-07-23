"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Briefcase, Factory, Sun, MoveRight, Layers, CheckCircle, Moon, ChevronsRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useTheme } from "./ThemeProvider";

export default function LandingClient() {
  const [scrolled, setScrolled] = useState(false);
  const { isDarkMode, setTheme } = useTheme();
  
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const imgRef = useRef(null);
  
  const heroImages = [
    "/Media/desk_name_plate.png",
    "/Media/premium_gold_plate.png",
    "/Media/brushed_aluminum_sign.png",
    "/Media/office_metal_labels.png"
  ];
  const [heroImageIndex, setHeroImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);
  
  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const heroY1 = useTransform(heroScroll, [0, 1], [0, -300]);
  const heroY2 = useTransform(heroScroll, [0, 1], [0, -100]);
  const heroY3 = useTransform(heroScroll, [0, 1], [0, -400]);

  // Benefits section parallax
  const { scrollYProgress: imgScrollProgress } = useScroll({
    target: imgRef,
    offset: ["start end", "end start"]
  });
  
  const imgScale = useTransform(imgScrollProgress, [0, 0.4], [0.8, 1]);
  const imgOpacity = useTransform(imgScrollProgress, [0, 0.3], [0.3, 1]);
  const imgY = useTransform(imgScrollProgress, [0, 1], [150, -150]);
  const innerImgScale = useTransform(imgScrollProgress, [0, 1], [1.4, 1]);
  const innerImgY = useTransform(imgScrollProgress, [0, 1], [-50, 50]);

  // Handle scroll event for sticky navbar glass effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary selection:text-primary-foreground overflow-x-hidden">
      
      {/* 1. Floating Glassmorphic Navbar (Framer Style) */}
      <nav className={`fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-5xl z-50 transition-all duration-500 rounded-full border border-border/50 shadow-[0_8px_30px_rgba(0,0,0,0.1)] backdrop-blur-xl ${scrolled ? 'bg-background/80 py-3' : 'bg-background/40 py-4'} px-6`}>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <Image src="/Media/Logo.png" alt="Saourav Graphic Logo" width={150} height={48} className="h-10 md:h-12 w-auto object-contain drop-shadow-md dark:drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] transition-all duration-300" />
          </div>
          
          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8 font-medium text-sm text-foreground/80">
            <button onClick={() => scrollToSection('features')} className="relative group overflow-hidden">
              <span className="group-hover:-translate-y-full transition-transform duration-300 block">Features</span>
              <span className="absolute top-0 left-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 block text-primary">Features</span>
            </button>
            <button onClick={() => scrollToSection('benefits')} className="relative group overflow-hidden">
              <span className="group-hover:-translate-y-full transition-transform duration-300 block">Benefits</span>
              <span className="absolute top-0 left-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 block text-primary">Benefits</span>
            </button>
            <button onClick={() => scrollToSection('products')} className="relative group overflow-hidden">
              <span className="group-hover:-translate-y-full transition-transform duration-300 block">Products</span>
              <span className="absolute top-0 left-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 block text-primary">Products</span>
            </button>
            <button onClick={() => scrollToSection('testimonials')} className="relative group overflow-hidden">
              <span className="group-hover:-translate-y-full transition-transform duration-300 block">Testimonials</span>
              <span className="absolute top-0 left-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 block text-primary">Testimonials</span>
            </button>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={(e) => {
                if (!document.startViewTransition) {
                  setTheme(!isDarkMode);
                  return;
                }

                const isDark = !isDarkMode;
                const transition = document.startViewTransition(() => {
                  setTheme(isDark);
                });

                transition.ready.then(() => {
                  const points = 40;
                  const startWavyBottom = [];
                  const endWavyBottom = [];
                  for (let i = points; i >= 0; i--) {
                    const x = (i / points) * 100;
                    const wave = Math.sin((i / points) * Math.PI * 6) * 5;
                    startWavyBottom.push(`${x.toFixed(1)}% ${(-10 + wave).toFixed(1)}%`);
                    endWavyBottom.push(`${x.toFixed(1)}% ${(120 + wave).toFixed(1)}%`);
                  }
                  const startClip = `polygon(0% 0%, 100% 0%, ${startWavyBottom.join(', ')})`;
                  const endClip = `polygon(0% 0%, 100% 0%, ${endWavyBottom.join(', ')})`;

                  document.documentElement.animate(
                    [
                      { clipPath: startClip },
                      { clipPath: endClip }
                    ],
                    { 
                      duration: 1500, 
                      easing: "cubic-bezier(0.4, 0, 0.2, 1)", 
                      pseudoElement: "::view-transition-new(root)", 
                      fill: "forwards" 
                    }
                  );
                });
              }}
              className="p-2 rounded-full bg-card border border-border shadow-sm text-foreground hover:bg-accent transition-colors duration-300"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Link href="/customize" className="relative flex items-center p-[4px] rounded-full bg-white border border-gray-200 dark:border-transparent group overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                
                {/* Background Sweep */}
                <div className="absolute inset-0 bg-white rounded-full -translate-x-[101%] group-hover:translate-x-0 transition-transform duration-700 ease-in-out z-10" />

                {/* Inner Pill */}
                <div className="relative px-5 py-1.5 rounded-full flex items-center justify-center">
                  <div className="absolute inset-0 bg-zinc-950 rounded-full z-0" />
                  <span className="relative z-20 text-white group-hover:text-black text-sm font-semibold transition-colors duration-500">
                    Design Now
                  </span>
                </div>

                {/* Sliding Arrow */}
                <div className="relative z-20 flex items-center overflow-hidden h-4 w-6 mx-1.5">
                  <ChevronsRight className="absolute left-0 w-4 h-4 text-black transition-all duration-700 ease-in-out group-hover:translate-x-8" />
                  <ChevronsRight className="absolute left-0 w-4 h-4 text-black -translate-x-8 transition-all duration-700 ease-in-out group-hover:translate-x-0" />
                </div>

              </Link>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* 2. Compact Bulky Hero Section */}
      <section ref={heroRef} className="relative pt-32 pb-12 px-6 max-w-7xl mx-auto w-full z-10">

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 auto-rows-[minmax(140px,auto)] relative z-10">
          
          {/* Main Hero Card */}
          {/* Main Hero Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:col-span-8 row-span-3 bg-card border-[4px] border-border rounded-3xl p-8 md:p-12 flex flex-col justify-center relative overflow-hidden group shadow-2xl"
          >
            {/* Realistic Brushed Metal Background (Light/Dark Compatible) */}
            <div className="absolute inset-0 z-0 overflow-hidden bg-card">
              
              {/* Base Gradient - Studio Lighting Reflection */}
              <div className="absolute inset-0 bg-gradient-to-br from-background via-muted to-card" />
              <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_20%,rgba(255,255,255,0.3)_30%,transparent_40%)] dark:bg-[linear-gradient(115deg,transparent_20%,rgba(255,255,255,0.05)_30%,transparent_40%)]" />
              
              {/* Fine Brushed Metal Texture */}
              <div className="absolute inset-0 opacity-[0.04] bg-[repeating-linear-gradient(to_right,transparent,transparent_1px,var(--color-foreground)_1px,var(--color-foreground)_2px)]" />
              
              {/* Diagonal Etched Grooves (Soft 3D Effect) */}
              <div className="absolute inset-0 opacity-30 bg-[repeating-linear-gradient(45deg,rgba(0,0,0,0.05)_0,rgba(0,0,0,0.05)_1px,rgba(255,255,255,0.3)_1px,rgba(255,255,255,0.3)_2px,transparent_2px,transparent_120px),repeating-linear-gradient(-45deg,rgba(0,0,0,0.05)_0,rgba(0,0,0,0.05)_1px,rgba(255,255,255,0.3)_1px,rgba(255,255,255,0.3)_2px,transparent_2px,transparent_120px)] dark:bg-[repeating-linear-gradient(45deg,rgba(0,0,0,0.6)_0,rgba(0,0,0,0.6)_1px,rgba(255,215,0,0.6)_1px,rgba(255,215,0,0.6)_2px,transparent_2px,transparent_120px),repeating-linear-gradient(-45deg,rgba(0,0,0,0.6)_0,rgba(0,0,0,0.6)_1px,rgba(255,215,0,0.6)_1px,rgba(255,215,0,0.6)_2px,transparent_2px,transparent_120px)] [mask-image:radial-gradient(ellipse_100%_100%_at_50%_50%,#000_60%,transparent_100%)]" />
              
              {/* Ambient Glow */}
              <motion.div 
                className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-primary/10 blur-[100px]"
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
            
            {/* Thick Metallic Edge Highlights */}
            <div className="absolute inset-x-0 top-0 h-[4px] bg-gradient-to-r from-transparent via-white/60 dark:via-white/20 to-transparent opacity-80" />
            <div className="absolute inset-x-0 bottom-0 h-[4px] bg-gradient-to-r from-transparent via-black/40 dark:via-black/80 to-transparent opacity-80" />
            
            <div className="relative z-10 inline-flex items-center gap-2 px-4 py-1.5 rounded-md bg-foreground/10 text-foreground font-black text-xs md:text-sm uppercase tracking-widest w-fit mb-6 border border-foreground/10 backdrop-blur-md">
              Industrial Grade
            </div>
            
            <h1 className="relative z-10 text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter text-foreground leading-[0.95] mb-6 uppercase">
              Metal & <br /> Aluminium
            </h1>
            
            <p className="relative z-10 text-lg font-bold text-muted-foreground max-w-md mb-8">
              HEAVY-DUTY CUSTOM LABELS AND NAME PLATES. BUILT COMPACT. BUILT BULKY. BUILT TO LAST.
            </p>
            
            <div className="relative z-10 mt-auto flex flex-col gap-4 max-w-xl bg-background/40 backdrop-blur-xl border border-border/50 p-6 rounded-2xl shadow-2xl">
              <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">
                <span>Get an Instant Bulk Quote</span>
                <span className="text-primary flex items-center gap-1"><CheckCircle size={12}/> 24h Turnaround</span>
              </div>
              <form className="flex flex-col sm:flex-row gap-3 w-full" onSubmit={(e) => e.preventDefault()}>
                <input type="email" placeholder="sanjay.rana@company.com" className="flex-1 px-5 py-4 bg-background/60 border-2 border-border rounded-xl font-bold focus:outline-none focus:border-primary transition-all text-foreground placeholder:text-muted-foreground/50" required />
                <button type="submit" className="px-8 py-4 bg-primary text-primary-foreground font-black text-lg uppercase tracking-widest rounded-xl border-[3px] border-primary hover:bg-transparent hover:text-primary transition-all shadow-[6px_6px_0px_0px_rgba(255,0,127,0.3)] active:translate-y-1 active:shadow-none whitespace-nowrap">
                  Get Quote
                </button>
              </form>
              <div className="flex gap-4 items-center mt-1">
                <span className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest">OR</span>
                <Link href="/customize" className="text-xs font-black uppercase tracking-widest text-foreground hover:text-primary transition-colors flex items-center gap-2 group">
                  Try Online Builder <MoveRight size={14} className="group-hover:animate-bounce-x transition-transform"/>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Side Card 1 - Dynamic Scattered Collage */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-4 row-span-2 rounded-3xl border-[4px] border-border overflow-hidden relative shadow-xl bg-accent min-h-[280px] md:min-h-0 group flex items-center justify-center"
          >
            {/* The Animated Collage Stack */}
            <div className="relative w-full h-[85%] flex items-center justify-center mb-8">
              {heroImages.map((src, idx) => {
                // Calculate position relative to current index
                const offset = (idx - heroImageIndex) % heroImages.length;
                const normalizedOffset = offset < 0 ? offset + heroImages.length : offset;
                
                // 0 is top (active), 1 is middle right, 2 is middle left, 3 is back
                const rotation = normalizedOffset === 0 ? 0 : normalizedOffset === 1 ? 8 : normalizedOffset === 2 ? -8 : 12;
                const scale = normalizedOffset === 0 ? 1 : normalizedOffset === 1 ? 0.9 : normalizedOffset === 2 ? 0.9 : 0.8;
                const x = normalizedOffset === 0 ? 0 : normalizedOffset === 1 ? 20 : normalizedOffset === 2 ? -20 : 0;
                const y = normalizedOffset === 0 ? -10 : normalizedOffset === 3 ? -30 : -20;
                const zIndex = 10 - normalizedOffset;
                
                return (
                  <motion.div
                    key={src}
                    animate={{ 
                      rotate: rotation,
                      scale: scale,
                      x: x,
                      y: y,
                      zIndex: zIndex,
                      opacity: normalizedOffset === 3 ? 0 : 1 // fade out the one moving to the back
                    }}
                    transition={{ type: "spring", stiffness: 80, damping: 15 }}
                    className="absolute w-[75%] h-[80%] rounded-2xl border-[6px] border-white dark:border-zinc-800 shadow-2xl overflow-hidden"
                  >
                    <Image
                      src={src}
                      alt="Premium Product Collage"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                      priority={idx === 0}
                    />
                  </motion.div>
                )
              })}
            </div>

            <div className="absolute bottom-4 left-4 right-4 bg-background/90 backdrop-blur-md border-[3px] border-border p-3 rounded-xl font-black uppercase text-sm text-center z-20 transition-all shadow-[0_0_20px_rgba(0,0,0,0.1)]">
              {['Premium Desk Plates', 'Gold Finished Plaques', 'Brushed Aluminum', 'Industrial Labels'][heroImageIndex]}
            </div>
          </motion.div>

          {/* Side Card 2 - Stats/Info */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="md:col-span-4 row-span-1 bg-foreground text-background rounded-3xl border-[4px] border-foreground p-6 flex flex-col justify-center items-center text-center shadow-xl hover:scale-[1.02] transition-transform"
          >
            <span className="text-4xl md:text-5xl font-black mb-1 tracking-tighter">500+</span>
            <span className="text-sm font-bold uppercase tracking-widest opacity-80">Trusted Clients</span>
          </motion.div>

        </div>
      </section>

      {/* 3. Scroll-Triggered Feature Sections */}
      <section id="features" className="py-16 bg-card border-y border-border">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Our Services</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Strong metal tags and signs made for real-world use.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard 
              icon={<Briefcase className="w-8 h-8" />}
              title="Corporate Name Plates"
              description="Clean metal name plates for desks and office doors."
              delay={0.1}
            />
            <FeatureCard 
              icon={<Factory className="w-8 h-8" />}
              title="Industrial Metal Tags"
              description="Tough metal tags built to last on machines and equipment."
              delay={0.2}
            />
            <FeatureCard 
              icon={<Sun className="w-8 h-8" />}
              title="LED & Illuminated Signs"
              description="Bright LED signs built into solid metal frames."
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* 4. Benefits Section (Alternating Layout) */}
      <section id="benefits" className="py-16 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-6 flex flex-col gap-12">
          
          {/* Benefit 1 */}
          <div className="flex flex-col md:flex-row items-center gap-8">
            <motion.div 
              ref={imgRef}
              style={{ scale: imgScale, opacity: imgOpacity, y: imgY }}
              className="flex-1"
            >
              <div className="w-full aspect-square md:aspect-[4/3] rounded-3xl border border-border shadow-2xl overflow-hidden relative group">
               <motion.div style={{ scale: innerImgScale, y: innerImgY }} className="w-full h-full absolute inset-0">
                 <motion.div 
                    className="absolute inset-0 w-full h-full group-hover:scale-[1.02] transition-transform duration-700 origin-center"
                 >
                   <Image 
                      src="/Media/premium_gold_plate.png" 
                      alt="Premium Gold Metal Plate" 
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                   />
                 </motion.div>
                 
                 {/* Left Shutter Overlay (Slides DOWN to reveal Top-to-Bottom) */}
                 <motion.div 
                   initial={{ y: "0%" }}
                   whileInView={{ y: "101%" }}
                   viewport={{ once: true, margin: "-100px" }}
                   transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
                   className="absolute top-0 left-0 w-[50.2%] h-full bg-card z-20"
                 />
                 
                 {/* Right Shutter Overlay (Slides UP to reveal Bottom-to-Top) */}
                 <motion.div 
                   initial={{ y: "0%" }}
                   whileInView={{ y: "-101%" }}
                   viewport={{ once: true, margin: "-100px" }}
                   transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
                   className="absolute top-0 right-0 w-[50.2%] h-full bg-card z-20"
                 />
               </motion.div>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="flex-1"
            >
              <h3 className="text-3xl md:text-4xl font-bold mb-6">Made well and delivered fast.</h3>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Whether you need a simple desk plate or hundreds of tough outdoor labels, we make exactly what you ask for. We also offer discounts for bulk orders and use solid materials.
              </p>
              <ul className="space-y-4">
                {['Tough, lasting materials', 'Clear engraving and printing', 'Quick delivery on large orders'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 font-medium">
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

        </div>
      </section>

      {/* 5. Shop Products Section */}
      <section id="products" className="py-16 relative bg-background border-t border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4">Our Products</h2>
            <p className="text-lg text-muted-foreground">Select a premium template below to customize it to your exact needs.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
            {[
              { id: 1, title: "Brushed Aluminum Sign", price: "₹999", img: "/Media/brushed_aluminum_sign.png" },
              { id: 2, title: "Industrial Metal Label", price: "₹499", img: "/Media/office_metal_labels.png" },
              { id: 3, title: "Gold Finished Plaque", price: "₹2,499", img: "/Media/premium_gold_plate.png" },
              { id: 4, title: "Anodized Aluminum Tag", price: "₹299", img: "/Media/anodized_aluminum_tag.png" },
              { id: 5, title: "Warning Signage", price: "₹799", img: "/Media/warning_signage.png" },
              { id: 6, title: "Commemorative Plaque", price: "₹3,499", img: "/Media/premium_gold_plate.png" },
              { id: 7, title: "Aluminum Door Plate", price: "₹899", img: "/Media/aluminum_door_plate.png" },
              { id: 8, title: "Equipment Tag", price: "₹199", img: "/Media/equipment_tag.png" },
            ].map((product, i) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group flex flex-col bg-card border border-border rounded-xl md:rounded-2xl overflow-hidden hover:border-foreground/30 hover:shadow-md transition-all duration-300"
              >
                <div className="h-32 md:h-48 bg-accent/30 flex items-center justify-center relative overflow-hidden border-b border-border/50">
                  <motion.div
                    initial={{ clipPath: "inset(50% 0 50% 0)" }}
                    whileInView={{ clipPath: "inset(0% 0 0% 0)" }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.05, ease: "easeOut" }}
                    className="w-full h-full"
                  >
                    <Image src={product.img} alt={product.title} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  </motion.div>
                </div>
                <div className="p-3 md:p-5 flex flex-col flex-grow">
                  <h3 className="text-sm md:text-lg font-bold mb-1 truncate">{product.title}</h3>
                  <p className="text-muted-foreground text-xs mb-4 line-clamp-2 hidden md:block">Customizable premium metal tag designed for durability and a professional finish.</p>
                  <div className="flex flex-col md:flex-row md:items-center justify-between mt-auto gap-2 md:gap-0">
                    <span className="text-base md:text-lg font-bold text-foreground">{product.price}</span>
                    <Link href="/customize" className="px-3 py-1.5 md:px-4 md:py-1.5 bg-primary/20 border border-primary text-primary neon-box text-xs md:text-sm font-medium rounded-full text-center hover:bg-primary hover:text-primary-foreground transition-all w-full md:w-auto">
                      Order
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Lead Generation Section */}
      <section className="py-24 bg-card border-t border-border relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -z-10" />
        
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="bg-background border-[4px] border-border rounded-3xl p-8 md:p-12 shadow-2xl flex flex-col md:flex-row gap-12 items-center">
            
            {/* Lead Copy */}
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-primary text-primary-foreground font-black text-xs uppercase tracking-widest mb-6">
                Bulk Orders
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 uppercase">
                Request a <br className="hidden md:block" />
                Custom Quote
              </h2>
              <p className="text-muted-foreground font-medium text-lg mb-6">
                Have a large industrial project? Drop your details and our team will get back to you with a customized pricing plan tailored to your specific needs.
              </p>
              <ul className="space-y-3 text-sm font-bold text-foreground">
                <li className="flex items-center gap-2 md:justify-start justify-center"><CheckCircle className="w-5 h-5 text-primary" /> Volume-based discounts</li>
                <li className="flex items-center gap-2 md:justify-start justify-center"><CheckCircle className="w-5 h-5 text-primary" /> Dedicated bulk pricing agent</li>
              </ul>
            </div>

            {/* Lead Form */}
            <div className="flex-1 w-full max-w-md bg-card border-[3px] border-border p-6 rounded-2xl shadow-xl">
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">Full Name</label>
                  <input type="text" placeholder="Sanjay Rana" className="w-full p-3 bg-background border-2 border-border rounded-xl focus:outline-none focus:border-primary transition-colors font-medium" required />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">Work Email</label>
                  <input type="email" placeholder="sanjay.rana@company.com" className="w-full p-3 bg-background border-2 border-border rounded-xl focus:outline-none focus:border-primary transition-colors font-medium" required />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">Phone (Optional)</label>
                  <input type="tel" placeholder="+91 98765 43210" className="w-full p-3 bg-background border-2 border-border rounded-xl focus:outline-none focus:border-primary transition-colors font-medium" />
                </div>
                <button type="submit" className="w-full py-4 mt-2 bg-foreground text-background font-black text-lg uppercase tracking-widest rounded-xl border-[3px] border-foreground hover:bg-background hover:text-foreground transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] active:translate-y-1 active:shadow-none">
                  Get My Quote
                </button>
                <p className="text-center text-xs font-medium text-muted-foreground mt-3">We typically respond within 24 hours.</p>
              </form>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-4 bg-background border-t border-border text-center">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <Image src="/Media/Logo.png" alt="Saourav Graphic Logo" width={280} height={80} className="h-20 w-auto object-contain opacity-70 dark:opacity-90 dark:drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] transition-all duration-300" />
          <p className="text-muted-foreground text-sm my-4 md:my-0">&copy; {new Date().getFullYear()} Saourav Graphic. All rights reserved.</p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground">Privacy</a>
            <a href="#" className="hover:text-foreground">Terms</a>
            <a href="#" className="hover:text-foreground">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description, delay }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: delay }}
      className="flex flex-col items-start p-8 rounded-3xl bg-background border border-border shadow-sm hover:shadow-lg transition-all group"
    >
      <div className="p-4 bg-accent text-accent-foreground rounded-2xl mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </motion.div>
  );
}
