"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronsRight, Home } from "lucide-react";

export default function SweepButton({ 
  href = "/customize", 
  label = "Design Now", 
  type = "forward", // 'forward' (sweep right with chevrons) or 'back' (sweep left with home icon)
  size = "md",      // 'sm' | 'nav' | 'md' | 'lg'
  fullWidth = false,
  className = "" 
}) {
  const isBack = type === "back";
  const isFull = fullWidth || className.includes("w-full");

  // Size variations - Plump, tactile, luxury button proportions
  const sizeStyles = {
    sm: {
      container: "p-[2.5px]",
      pill: "px-4 py-1.5",
      text: "text-xs font-bold",
      iconBox: "h-3.5 w-5 mr-1.5",
      icon: "w-3.5 h-3.5",
    },
    nav: {
      container: "p-[3px]",
      pill: "px-5 sm:px-6 py-2 sm:py-2.5",
      text: "text-xs sm:text-sm font-bold tracking-wide",
      iconBox: "h-4 w-6 ml-2",
      icon: "w-4 h-4",
    },
    md: {
      container: "p-[3.5px]",
      pill: "px-6 sm:px-7 py-2.5 sm:py-3",
      text: "text-xs sm:text-sm font-bold",
      iconBox: "h-4 w-6 ml-2.5",
      icon: "w-4 h-4",
    },
    lg: {
      container: "p-[4px]",
      pill: "px-8 sm:px-10 py-3.5 sm:py-4",
      text: "text-sm sm:text-base font-extrabold",
      iconBox: "h-5 w-7 ml-3",
      icon: "w-5 h-5",
    },
  }[size] || {
    container: "p-[3.5px]",
    pill: "px-6 sm:px-7 py-2.5 sm:py-3",
    text: "text-xs sm:text-sm font-bold",
    iconBox: "h-4 w-6 ml-2.5",
    icon: "w-4 h-4",
  };

  const wrapperClass = isFull 
    ? `w-full block ${className}` 
    : `inline-block ${className}`;

  const linkClass = isFull
    ? `w-full justify-center`
    : `w-auto inline-flex`;

  const innerClass = isFull
    ? `w-full justify-center`
    : `w-auto inline-flex`;

  if (isBack) {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 280, damping: 24 }}
        className={wrapperClass}
      >
        <Link 
          href={href} 
          prefetch={true}
          className={`relative flex items-center ${linkClass} ${sizeStyles.container} rounded-full bg-zinc-200/90 dark:bg-white/10 border border-zinc-300 dark:border-white/15 group shadow-sm hover:shadow-lg active:scale-[0.98] transition-all duration-300 cursor-pointer touch-manipulation select-none`}
        >
          {/* Inner Black Capsule with Filling Sweep */}
          <div className={`relative flex items-center ${innerClass} rounded-full bg-zinc-950 overflow-hidden ${sizeStyles.pill}`}>
            
            {/* The Filling Background Sweep (Right to Left) - Smooth 600ms Fluid Curve */}
            <div className="absolute inset-0 bg-white rounded-full translate-x-[101%] group-hover:translate-x-0 transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] z-10 pointer-events-none" />

            {/* Sliding Home Icon */}
            <div className={`relative z-20 flex items-center overflow-hidden ${sizeStyles.iconBox} mr-2`}>
              <Home className={`absolute left-0.5 ${sizeStyles.icon} text-white group-hover:text-black transition-all duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-x-8`} />
              <Home className={`absolute left-0.5 ${sizeStyles.icon} text-white group-hover:text-black translate-x-8 transition-all duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0`} />
            </div>

            {/* Text Label */}
            <span className={`relative z-20 text-white group-hover:text-black ${sizeStyles.text} transition-colors duration-500 ease-in-out whitespace-nowrap`}>
              {label}
            </span>
          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 280, damping: 24 }}
      className={wrapperClass}
    >
      <Link 
        href={href} 
        prefetch={true}
        className={`relative flex items-center ${linkClass} ${sizeStyles.container} rounded-full bg-zinc-200/90 dark:bg-white/10 border border-zinc-300 dark:border-white/15 group shadow-sm hover:shadow-lg active:scale-[0.98] transition-all duration-300 cursor-pointer touch-manipulation select-none`}
      >
        {/* Inner Black Capsule with Filling Sweep */}
        <div className={`relative flex items-center ${innerClass} rounded-full bg-zinc-950 overflow-hidden ${sizeStyles.pill}`}>
          
          {/* The Filling Background Sweep (Left to Right) - Smooth 600ms Fluid Curve */}
          <div className="absolute inset-0 bg-white rounded-full -translate-x-[101%] group-hover:translate-x-0 transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] z-10 pointer-events-none" />

          {/* Text Label */}
          <span className={`relative z-20 text-white group-hover:text-black ${sizeStyles.text} transition-colors duration-500 ease-in-out whitespace-nowrap`}>
            {label}
          </span>

          {/* Sliding Chevrons Arrow */}
          <div className={`relative z-20 flex items-center overflow-hidden ${sizeStyles.iconBox}`}>
            <ChevronsRight className={`absolute left-0 ${sizeStyles.icon} text-white group-hover:text-black transition-all duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-8`} />
            <ChevronsRight className={`absolute left-0 ${sizeStyles.icon} text-white group-hover:text-black -translate-x-8 transition-all duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0`} />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
