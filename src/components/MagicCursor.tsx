"use client";

import React, { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";
import { useApp } from "./ClientLayout";

export default function MagicCursor() {
  const [mounted, setMounted] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const { mood } = useApp();
  
  const springConfig = { damping: 25, stiffness: 200 };
  const followerX = useSpring(cursorX, springConfig);
  const followerY = useSpring(cursorY, springConfig);

  useEffect(() => {
    const handle = requestAnimationFrame(() => setMounted(true));
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    window.addEventListener("mousemove", moveCursor);
    return () => {
      cancelAnimationFrame(handle);
      window.removeEventListener("mousemove", moveCursor);
    };
  }, [cursorX, cursorY]);

  if (!mounted) return null;

  // Determine cursor styles based on mood theme
  let cursorColor = "bg-white";
  let ringColor = "border-white/30";
  let glowColor = "bg-purple-500/10";

  if (mood === "midnight") {
    cursorColor = "bg-blue-400";
    ringColor = "border-blue-400/30";
    glowColor = "bg-blue-500/10";
  } else if (mood === "sunset") {
    cursorColor = "bg-orange-400";
    ringColor = "border-orange-400/30";
    glowColor = "bg-orange-500/10";
  } else {
    // Luxury / Classic theme
    cursorColor = "bg-white";
    ringColor = "border-purple-400/30";
    glowColor = "bg-purple-500/10";
  }

  return (
    <>
      {/* Main dot */}
      <motion.div
        className={`fixed top-0 left-0 w-2 h-2 ${cursorColor} rounded-full z-[10000] pointer-events-none mix-blend-difference hidden md:block`}
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />
      
      {/* Lagging Ring */}
      <motion.div
        className={`fixed top-0 left-0 w-8 h-8 border ${ringColor} rounded-full z-[9999] pointer-events-none hidden md:block`}
        style={{
          x: followerX,
          y: followerY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />

      {/* Ambient Glow */}
      <motion.div
        className={`fixed top-0 left-0 w-64 h-64 ${glowColor} rounded-full blur-3xl z-[9998] pointer-events-none hidden md:block`}
        style={{
          x: followerX,
          y: followerY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />
    </>
  );
}
