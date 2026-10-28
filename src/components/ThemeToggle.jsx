"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export default function ThemeToggle({ className = "", size = "md" }) {
  const { isDarkMode, toggleTheme } = useTheme();

  const isSmall = size === "sm";
  const iconSize = isSmall ? 14 : 16;
  const buttonDimensions = isSmall 
    ? "w-8 h-8" 
    : "w-9 h-9 sm:w-9.5 sm:h-9.5";

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.90 }}
      onClick={(e) => toggleTheme(e)}
      aria-label={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      className={`relative ${buttonDimensions} rounded-full flex items-center justify-center border border-border/80 bg-card/80 dark:bg-card/60 backdrop-blur-md shadow-xs hover:shadow-md transition-shadow cursor-pointer select-none overflow-hidden group active:scale-90 ${className}`}
    >
      {/* Ambient Radial Aura on Hover */}
      <div className="absolute inset-0 bg-gradient-to-tr from-amber-400/0 via-amber-400/10 to-transparent dark:from-sky-400/0 dark:via-sky-400/10 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* Animatic Sun / Moon Morph with Framer Motion */}
      <AnimatePresence mode="wait" initial={false}>
        {isDarkMode ? (
          <motion.div
            key="dark-sun-icon"
            initial={{ rotate: -90, scale: 0.2, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 90, scale: 0.2, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center text-amber-400"
          >
            <Sun 
              size={iconSize} 
              className="drop-shadow-[0_0_8px_rgba(245,158,11,0.5)] transition-transform duration-300 group-hover:rotate-45" 
            />
          </motion.div>
        ) : (
          <motion.div
            key="light-moon-icon"
            initial={{ rotate: 90, scale: 0.2, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: -90, scale: 0.2, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center text-foreground"
          >
            <Moon 
              size={iconSize} 
              className="drop-shadow-[0_0_6px_rgba(13,30,27,0.2)] transition-transform duration-300 group-hover:-rotate-12" 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
