"use client";

import { motion } from "framer-motion";

export default function MetalPlateLaserDoodle() {
  return (
    <div
      aria-hidden="true"
      className="absolute right-0 top-0 bottom-0 w-36 sm:w-48 md:w-56 lg:w-60 pointer-events-none select-none flex items-center justify-end pr-1 sm:pr-3 overflow-hidden z-0"
    >
      {/* Background ambient laser glow */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 w-28 h-28 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/25 transition-all duration-700 pointer-events-none" />

      <svg
        viewBox="0 0 200 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full max-h-[110px] object-contain opacity-40 sm:opacity-75 group-hover:opacity-100 transition-opacity duration-500"
      >
        <defs>
          <linearGradient id="laserBeamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
            <stop offset="65%" stopColor="#f59e0b" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#fbbf24" stopOpacity="1" />
          </linearGradient>

          <linearGradient id="goldDoodleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#d97706" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#fbbf24" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.3" />
          </linearGradient>

          <filter id="laserGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 1. Engineering Technical Grid & Calibration Coordinates */}
        <g stroke="rgba(245, 158, 11, 0.16)" strokeWidth="0.6" strokeDasharray="2 3">
          <line x1="30" y1="20" x2="190" y2="20" />
          <line x1="30" y1="60" x2="190" y2="60" />
          <line x1="30" y1="100" x2="190" y2="100" />
          <line x1="70" y1="10" x2="70" y2="110" />
          <line x1="130" y1="10" x2="130" y2="110" />
          <line x1="170" y1="10" x2="170" y2="110" />
        </g>

        {/* 2. Rotating CAD Machinery Gear (Smooth Continuous Clockwise Spin) */}
        <g className="origin-[135px_60px] animate-[spin_24s_linear_infinite] group-hover:animate-[spin_9s_linear_infinite]">
          {/* Gear Pitch Circle */}
          <circle
            cx="135"
            cy="60"
            r="38"
            stroke="url(#goldDoodleGrad)"
            strokeWidth="1.2"
            strokeDasharray="4 3"
          />
          {/* Outer Gear Teeth Doodles */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
            <rect
              key={deg}
              x="133"
              y="18"
              width="4"
              height="6"
              rx="1"
              fill="rgba(245, 158, 11, 0.45)"
              transform={`rotate(${deg} 135 60)`}
            />
          ))}
          {/* Inner Cog Hub */}
          <circle
            cx="135"
            cy="60"
            r="16"
            stroke="#f59e0b"
            strokeWidth="0.9"
            strokeDasharray="3 2"
          />
          <circle cx="135" cy="60" r="5" fill="#f59e0b" fillOpacity="0.3" />
        </g>

        {/* 3. Counter-Rotating Precision Dial with Crosshairs */}
        <g className="origin-[135px_60px] animate-[spin_32s_linear_infinite_reverse]">
          <circle
            cx="135"
            cy="60"
            r="26"
            stroke="rgba(56, 189, 248, 0.35)"
            strokeWidth="0.8"
            strokeDasharray="1 4"
          />
          {/* Crosshairs */}
          <line x1="105" y1="60" x2="165" y2="60" stroke="rgba(245, 158, 11, 0.35)" strokeWidth="0.75" />
          <line x1="135" y1="30" x2="135" y2="90" stroke="rgba(245, 158, 11, 0.35)" strokeWidth="0.75" />
        </g>

        {/* 4. Fiber Laser Nozzle Head + Live Firing Ray + Spark Cluster */}
        <g>
          {/* Laser Head Stylized Isometric Block */}
          <path
            d="M 68 18 L 86 18 L 80 32 L 74 32 Z"
            fill="rgba(212, 212, 216, 0.25)"
            stroke="rgba(245, 158, 11, 0.8)"
            strokeWidth="0.9"
          />
          {/* Brass Cone Tip */}
          <path
            d="M 74 32 L 80 32 L 78 39 L 76 39 Z"
            fill="#f59e0b"
            stroke="#fbbf24"
            strokeWidth="0.75"
          />

          {/* Dynamic Laser Beam Ray firing downwards to the plate surface */}
          <motion.line
            x1="77"
            y1="39"
            x2="88"
            y2="76"
            stroke="url(#laserBeamGrad)"
            strokeWidth="1.6"
            filter="url(#laserGlow)"
            animate={{
              opacity: [0.6, 1, 0.7, 0.95, 0.6],
              strokeWidth: [1.2, 2, 1.4, 2.2, 1.2],
            }}
            transition={{
              duration: 1.6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Laser Etch Contact Spark Point */}
          <motion.circle
            cx="88"
            cy="76"
            r="3"
            fill="#ffffff"
            filter="url(#laserGlow)"
            animate={{
              r: [2, 4.5, 2.5, 5, 2],
              opacity: [0.8, 1, 0.7, 1, 0.8],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Radiating Plasma Spark Particles */}
          <motion.g
            animate={{
              rotate: [0, 180, 360],
              scale: [0.85, 1.15, 0.85],
            }}
            transition={{
              duration: 2.8,
              repeat: Infinity,
              ease: "linear",
            }}
            className="origin-[88px_76px]"
          >
            <line x1="88" y1="70" x2="88" y2="67" stroke="#fbbf24" strokeWidth="1" strokeLinecap="round" />
            <line x1="88" y1="82" x2="88" y2="85" stroke="#fbbf24" strokeWidth="1" strokeLinecap="round" />
            <line x1="82" y1="76" x2="79" y2="76" stroke="#fbbf24" strokeWidth="1" strokeLinecap="round" />
            <line x1="94" y1="76" x2="97" y2="76" stroke="#fbbf24" strokeWidth="1" strokeLinecap="round" />
            <line x1="83" y1="71" x2="80" y2="68" stroke="#38bdf8" strokeWidth="0.8" strokeLinecap="round" />
            <line x1="93" y1="81" x2="96" y2="84" stroke="#38bdf8" strokeWidth="0.8" strokeLinecap="round" />
          </motion.g>
        </g>

        {/* 5. Precision Etched Vector Path (Being engraved by the laser) */}
        <motion.path
          d="M 40 76 H 88 Q 98 76 104 84 T 120 92 H 145"
          fill="none"
          stroke="#f59e0b"
          strokeWidth="1.2"
          strokeDasharray="140"
          animate={{
            strokeDashoffset: [140, 0, 140],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* 6. Technical Engineering Annotations / Blueprint Dimension Callouts */}
        <g fill="rgba(245, 158, 11, 0.75)" fontSize="6" fontFamily="monospace" fontWeight="bold">
          {/* Corner Fillet Radius Callout */}
          <path d="M 165 30 A 10 10 0 0 0 175 20" stroke="rgba(245,158,11,0.5)" strokeWidth="0.75" fill="none" />
          <line x1="172" y1="27" x2="183" y2="23" stroke="rgba(245,158,11,0.5)" strokeWidth="0.6" />
          <text x="175" y="20" fill="#fbbf24">R2.5</text>

          {/* Micro CAD Dimension Arrow */}
          <line x1="90" y1="102" x2="160" y2="102" stroke="rgba(245,158,11,0.4)" strokeWidth="0.6" />
          <line x1="90" y1="99" x2="90" y2="105" stroke="rgba(245,158,11,0.4)" strokeWidth="0.6" />
          <line x1="160" y1="99" x2="160" y2="105" stroke="rgba(245,158,11,0.4)" strokeWidth="0.6" />
          <text x="110" y="100" fill="rgba(250,204,21,0.85)">CAD 0.01mm</text>

          {/* Machine Status Blink Indicator */}
          <circle cx="48" cy="24" r="1.5" fill="#10b981" className="animate-ping" />
          <circle cx="48" cy="24" r="1.5" fill="#10b981" />
          <text x="54" y="26" fill="#34d399" fontSize="5.5">LASER ON</text>
        </g>
      </svg>
    </div>
  );
}
