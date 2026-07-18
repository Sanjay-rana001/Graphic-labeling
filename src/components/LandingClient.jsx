"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Briefcase, Factory, Sun, MoveRight, Layers, CheckCircle, Moon, ChevronsRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useTheme } from "./ThemeProvider";

export default function LandingClient() {
  const [scrolled, setScrolled] = useState(false);
  const { isDarkMode, setTheme } = useTheme();
  
  const imgRef = useRef(null);
  
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
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/Media/Logo.png" alt="Saourav Graphic Logo" className="h-10 md:h-12 object-contain drop-shadow-md" />
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

      {/* 2. Immersive Hero Section */}
      <section ref={heroRef} className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden flex flex-col items-center justify-center min-h-[90vh]">
        {/* Abstract Background Elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -z-10 mix-blend-multiply dark:mix-blend-screen" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-slate-500/20 rounded-full blur-[100px] -z-10 mix-blend-multiply dark:mix-blend-screen" />

        <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-12">
          
          {/* Hero Text */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex-1 text-center lg:text-left z-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent text-accent-foreground text-xs md:text-sm font-bold mb-6 tracking-wide uppercase border border-border shadow-sm">
              <span>Professional Labeling & Printing</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground mb-6 leading-[1.1]">
              Custom Metal Labels & <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-500 to-slate-800 dark:from-slate-200 dark:to-slate-400">
                Printing Services
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              We make tough metal labels, custom name plates, and handle industrial printing for your business.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center mt-8">
              <motion.button 
                onClick={() => scrollToSection('features')} 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="relative flex items-center p-[5px] rounded-full bg-white border border-gray-200 dark:border-transparent group overflow-hidden transition-shadow duration-300 ease-out hover:shadow-lg"
              >
                {/* Background Sweep */}
                <div className="absolute inset-0 bg-white rounded-full -translate-x-[101%] group-hover:translate-x-0 transition-transform duration-700 ease-in-out z-10" />

                {/* Inner Pill */}
                <div className="relative px-8 py-3 rounded-full flex items-center justify-center">
                  <div className="absolute inset-0 bg-zinc-950 rounded-full z-0" />
                  <span className="relative z-20 text-white group-hover:text-black text-lg font-semibold transition-colors duration-500">
                    Explore Services
                  </span>
                </div>

                {/* Sliding Arrow */}
                <div className="relative z-20 flex items-center overflow-hidden h-6 w-8 mx-2">
                  <ChevronsRight className="absolute left-0 w-6 h-6 text-black transition-all duration-700 ease-in-out group-hover:translate-x-10" />
                  <ChevronsRight className="absolute left-0 w-6 h-6 text-black -translate-x-10 transition-all duration-700 ease-in-out group-hover:translate-x-0" />
                </div>
              </motion.button>
              
              <Link href="/customize">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className="px-8 py-4 rounded-full bg-transparent border-2 border-border text-foreground font-semibold text-lg flex items-center gap-2 hover:bg-foreground hover:text-background transition-colors duration-300"
                >
                  Try Online Builder
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* Hero Images Collage: Small Big Small */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="flex-1 w-full relative z-10 flex gap-2 sm:gap-4 lg:gap-6 h-[250px] sm:h-[350px] lg:h-[550px] justify-center items-center mt-10 lg:mt-0"
          >
            {/* Small Left */}
            <motion.div style={{ y: heroY1 }} className="w-[32%] lg:w-[28%] h-[75%] lg:h-[60%] rounded-xl lg:rounded-2xl overflow-hidden shadow-lg border border-border/50 relative top-4 lg:top-8">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/Media/desk_name_plate.png" alt="Desk Name Plate" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
            </motion.div>
            {/* Big Center */}
            <motion.div style={{ y: heroY2 }} className="w-[42%] lg:w-[44%] h-[100%] lg:h-[90%] rounded-xl lg:rounded-2xl overflow-hidden shadow-2xl border border-border/50 z-10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/Media/premium_gold_plate.png" alt="Premium Gold Plate" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
            </motion.div>
            {/* Small Right */}
            <motion.div style={{ y: heroY3 }} className="w-[32%] lg:w-[28%] h-[75%] lg:h-[60%] rounded-xl lg:rounded-2xl overflow-hidden shadow-lg border border-border/50 relative -top-4 lg:-top-8">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/Media/office_metal_labels.png" alt="Office Metal Labels" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 3. Scroll-Triggered Feature Sections */}
      <section id="features" className="py-24 bg-card border-y border-border">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Our Services</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Strong metal tags and signs made for real-world use.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
      <section id="benefits" className="py-24">
        <div className="max-w-7xl mx-auto px-6 flex flex-col gap-24">
          
          {/* Benefit 1 */}
          <div className="flex flex-col md:flex-row items-center gap-12">
            <motion.div 
              ref={imgRef}
              style={{ scale: imgScale, opacity: imgOpacity, y: imgY }}
              className="flex-1"
            >
              <div className="w-full aspect-square md:aspect-[4/3] rounded-3xl border border-border shadow-2xl overflow-hidden relative group">
                 {/* eslint-disable-next-line @next/next/no-img-element */}
                 <motion.img 
                    style={{ scale: innerImgScale, y: innerImgY }}
                    src="/Media/premium_gold_plate.png" 
                    alt="Premium Gold Metal Plate" 
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700 origin-center" 
                 />
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
      <section id="products" className="py-24 relative bg-background border-t border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4">Our Products</h2>
            <p className="text-lg text-muted-foreground">Select a premium template below to customize it to your exact needs.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
            {[
              { id: 1, title: "Brushed Aluminum Sign", price: "₹999", img: "/Media/desk_name_plate.png" },
              { id: 2, title: "Industrial Metal Label", price: "₹499", img: "/Media/office_metal_labels.png" },
              { id: 3, title: "Gold Finished Plaque", price: "₹2,499", img: "/Media/premium_gold_plate.png" },
              { id: 4, title: "Anodized Aluminum Tag", price: "₹299", img: "/Media/desk_name_plate.png" },
              { id: 5, title: "Warning Signage", price: "₹799", img: "/Media/office_metal_labels.png" },
              { id: 6, title: "Commemorative Plaque", price: "₹3,499", img: "/Media/premium_gold_plate.png" },
              { id: 7, title: "Aluminum Door Plate", price: "₹899", img: "/Media/desk_name_plate.png" },
              { id: 8, title: "Equipment Tag", price: "₹199", img: "/Media/office_metal_labels.png" },
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
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={product.img} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-3 md:p-5 flex flex-col flex-grow">
                  <h3 className="text-sm md:text-lg font-bold mb-1 truncate">{product.title}</h3>
                  <p className="text-muted-foreground text-xs mb-4 line-clamp-2 hidden md:block">Customizable premium metal tag designed for durability and a professional finish.</p>
                  <div className="flex flex-col md:flex-row md:items-center justify-between mt-auto gap-2 md:gap-0">
                    <span className="text-base md:text-lg font-bold text-foreground">{product.price}</span>
                    <Link href="/customize" className="px-3 py-1.5 md:px-4 md:py-1.5 bg-foreground text-background text-xs md:text-sm font-medium rounded-full text-center hover:opacity-90 transition-opacity w-full md:w-auto">
                      Customize
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-12 bg-background border-t border-border text-center">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/Media/Logo.png" alt="Saourav Graphic Logo" className="h-8 object-contain opacity-70" />
          </div>
          <p className="text-muted-foreground text-sm">&copy; {new Date().getFullYear()} Saourav Graphic. All rights reserved.</p>
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
