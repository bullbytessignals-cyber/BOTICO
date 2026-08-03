"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

/**
 * Layered ambient hero backdrop: drifting grid, glowing aurora blobs,
 * floating AI particles and a couple of animated chart lines. Purely
 * decorative — hidden from assistive tech and calmed under reduced-motion.
 */
export function AnimatedBackground() {
  const particles = useMemo(
    () =>
      Array.from({ length: 26 }, (_, i) => ({
        id: i,
        left: (i * 37) % 100,
        top: (i * 53) % 100,
        size: 1 + (i % 4),
        delay: (i % 10) * 0.6,
        duration: 6 + (i % 6),
      })),
    []
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {/* drifting grid */}
      <div className="absolute inset-0 grid-bg animate-[grid-pan_40s_linear_infinite]" />

      {/* aurora blobs */}
      <div className="absolute -top-40 left-1/4 size-[520px] rounded-full bg-cyan/20 blur-[120px] animate-[pulse-glow_6s_ease-in-out_infinite]" />
      <div className="absolute top-10 right-1/5 size-[440px] rounded-full bg-blue/20 blur-[120px] animate-[pulse-glow_8s_ease-in-out_infinite]" />
      <div className="absolute top-1/2 left-1/2 size-[380px] rounded-full bg-violet/20 blur-[120px] animate-[pulse-glow_7s_ease-in-out_infinite]" />

      {/* floating particles */}
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full bg-cyan-bright/60"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{ y: [0, -30, 0], opacity: [0.15, 0.7, 0.15] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {/* animated chart lines */}
      <svg className="absolute inset-x-0 bottom-0 h-1/2 w-full opacity-30" preserveAspectRatio="none" viewBox="0 0 1200 400">
        <defs>
          <linearGradient id="hero-line" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0" />
            <stop offset="50%" stopColor="#22d3ee" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.path
          d="M0,320 C200,260 300,340 500,240 S800,140 1000,200 1200,120 1200,120"
          fill="none"
          stroke="url(#hero-line)"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 3, ease: "easeInOut" }}
        />
        <motion.path
          d="M0,360 C250,300 350,380 550,300 S850,220 1050,280 1200,220 1200,220"
          fill="none"
          stroke="#6366f1"
          strokeOpacity="0.5"
          strokeWidth="1.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 4, delay: 0.4, ease: "easeInOut" }}
        />
      </svg>

      {/* vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
    </div>
  );
}
