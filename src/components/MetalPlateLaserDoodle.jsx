"use client";

import { motion } from "framer-motion";

export default function MetalPlateLaserDoodle() {
  return (
    <div
      aria-hidden="true"
      className="relative w-full h-full pointer-events-none select-none flex items-center justify-center overflow-visible"
    >
      {/* Background ambient laser glow */}
      <div className="absolute inset-2 bg-amber-500/12 rounded-full blur-2xl group-hover:bg-amber-500/25 transition-all duration-700 pointer-events-none" />

      <svg
        viewBox="92 5 110 112"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full max-h-[148px] object-contain opacity-85 group-hover:opacity-100 transition-opacity duration-500"
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
          <line x1="80" y1="20" x2="200" y2="20" />
          <line x1="80" y1="60" x2="200" y2="60" />
          <line x1="80" y1="100" x2="200" y2="100" />
          <line x1="110" y1="10" x2="110" y2="110" />
          <line x1="150" y1="10" x2="150" y2="110" />
          <line x1="185" y1="10" x2="185" y2="110" />
        </g>

        {/* 2. Rotating CAD Machinery Gear (Smooth Continuous Clockwise Spin) */}
        <g className="origin-[155px_60px] animate-[spin_24s_linear_infinite] group-hover:animate-[spin_9s_linear_infinite]">
          {/* Gear Pitch Circle */}
          <circle
            cx="155"
            cy="60"
            r="36"
            stroke="url(#goldDoodleGrad)"
            strokeWidth="1.2"
            strokeDasharray="4 3"
          />
          {/* Outer Gear Teeth Doodles */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
            <rect
              key={deg}
              x="153"
              y="20"
              width="4"
              height="6"
              rx="1"
              fill="rgba(245, 158, 11, 0.45)"
              transform={`rotate(${deg} 155 60)`}
            />
          ))}
          {/* Inner Cog Hub */}
          <circle
            cx="155"
            cy="60"
            r="15"
            stroke="#f59e0b"
            strokeWidth="0.9"
            strokeDasharray="3 2"
          />
          <circle cx="155" cy="60" r="5" fill="#f59e0b" fillOpacity="0.3" />
        </g>

        {/* 3. Counter-Rotating Precision Dial with Crosshairs */}
        <g className="origin-[155px_60px] animate-[spin_32s_linear_infinite_reverse]">
          <circle
            cx="155"
            cy="60"
            r="24"
            stroke="rgba(56, 189, 248, 0.35)"
            strokeWidth="0.8"
            strokeDasharray="1 4"
          />
          {/* Crosshairs */}
          <line x1="128" y1="60" x2="182" y2="60" stroke="rgba(245, 158, 11, 0.35)" strokeWidth="0.75" />
          <line x1="155" y1="33" x2="155" y2="87" stroke="rgba(245, 158, 11, 0.35)" strokeWidth="0.75" />
        </g>

        {/* 4. Fiber Laser Nozzle Head + Live Firing Ray + Spark Cluster */}
        <g>
          {/* Laser Head Stylized Isometric Block */}
          <path
            d="M 108 18 L 124 18 L 119 32 L 113 32 Z"
            fill="rgba(212, 212, 216, 0.25)"
            stroke="rgba(245, 158, 11, 0.8)"
            strokeWidth="0.9"
          />
          {/* Brass Cone Tip */}
          <path
            d="M 113 32 L 119 32 L 117 38 L 115 38 Z"
            fill="#f59e0b"
            stroke="#fbbf24"
            strokeWidth="0.75"
          />

          {/* Dynamic Laser Beam Ray firing downwards to the plate surface */}
          <motion.line
            x1="116"
            y1="38"
            x2="126"
            y2="72"
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
            cx="126"
            cy="72"
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
            className="origin-[126px_72px]"
          >
            <line x1="126" y1="66" x2="126" y2="63" stroke="#fbbf24" strokeWidth="1" strokeLinecap="round" />
            <line x1="126" y1="78" x2="126" y2="81" stroke="#fbbf24" strokeWidth="1" strokeLinecap="round" />
            <line x1="120" y1="72" x2="117" y2="72" stroke="#fbbf24" strokeWidth="1" strokeLinecap="round" />
            <line x1="132" y1="72" x2="135" y2="72" stroke="#fbbf24" strokeWidth="1" strokeLinecap="round" />
            <line x1="121" y1="67" x2="118" y2="64" stroke="#38bdf8" strokeWidth="0.8" strokeLinecap="round" />
            <line x1="131" y1="77" x2="134" y2="80" stroke="#38bdf8" strokeWidth="0.8" strokeLinecap="round" />
          </motion.g>
        </g>

        {/* 5. Precision Etched Vector Path (Being engraved by the laser) */}
        <motion.path
          d="M 106 72 H 126 Q 134 72 139 79 T 152 86 H 175"
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
          <path d="M 180 30 A 10 10 0 0 0 190 20" stroke="rgba(245,158,11,0.5)" strokeWidth="0.75" fill="none" />
          <line x1="187" y1="27" x2="196" y2="23" stroke="rgba(245,158,11,0.5)" strokeWidth="0.6" />
          <text x="187" y="19" fill="#fbbf24">R2.5</text>

          {/* Micro CAD Dimension Arrow */}
          <line x1="125" y1="102" x2="185" y2="102" stroke="rgba(245,158,11,0.4)" strokeWidth="0.6" />
          <line x1="125" y1="99" x2="125" y2="105" stroke="rgba(245,158,11,0.4)" strokeWidth="0.6" />
          <line x1="185" y1="99" x2="185" y2="105" stroke="rgba(245,158,11,0.4)" strokeWidth="0.6" />
          <text x="135" y="100" fill="rgba(250,204,21,0.85)">CAD 0.01</text>

          {/* Machine Status Blink Indicator */}
          <circle cx="112" cy="24" r="1.5" fill="#10b981" className="animate-ping" />
          <circle cx="112" cy="24" r="1.5" fill="#10b981" />
          <text x="117" y="26" fill="#34d399" fontSize="5">LASER ON</text>
        </g>
      </svg>
    </div>
  );
}
