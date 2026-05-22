"use client";

import React, { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export default function MagicCursor() {
  const [mounted, setMounted] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
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

  return (
    <>
      {/* Main dot */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full z-[10000] pointer-events-none mix-blend-difference hidden md:block"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />
      
      {/* Lagging Ring */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 border border-white/30 rounded-full z-[9999] pointer-events-none hidden md:block"
        style={{
          x: followerX,
          y: followerY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />

      {/* Ambient Glow */}
      <motion.div
        className="fixed top-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl z-[9998] pointer-events-none hidden md:block"
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
