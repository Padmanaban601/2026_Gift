"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { Delete } from "lucide-react";

const CORRECT_PASSCODE = "1234";

export default function PasscodeLock({ onUnlock }: { onUnlock: () => void }) {
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const controls = useAnimation();

  const handleKeyPress = useCallback((num: string) => {
    if (passcode.length < 4 && !isVerifying) {
      setPasscode((p) => p + num);
      setError(false);
    }
  }, [passcode.length, isVerifying]);

  const handleBackspace = useCallback(() => {
    if (!isVerifying) {
      setPasscode((p) => p.slice(0, -1));
      setError(false);
    }
  }, [isVerifying]);

  useEffect(() => {
    if (passcode.length === 4) {
      setIsVerifying(true);
      const t = setTimeout(() => {
        if (passcode === CORRECT_PASSCODE) {
          onUnlock();
        } else {
          setError(true);
          setIsVerifying(false);
          controls.start({
            x: [-14, 14, -14, 14, -7, 7, 0],
            transition: { duration: 0.5 },
          });
          setTimeout(() => { setPasscode(""); setError(false); }, 900);
        }
      }, 900);
      return () => clearTimeout(t);
    }
  }, [passcode, onUnlock, controls]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (/^[0-9]$/.test(e.key)) handleKeyPress(e.key);
      if (e.key === "Backspace") handleBackspace();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleKeyPress, handleBackspace]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-between overflow-hidden bg-black">

      {/* ── Full-bleed art background ── */}
      <div className="fixed inset-0 z-0">
        <img
          src="/portal_hero_v2.png"
          alt=""
          className="w-full h-full object-cover brightness-[0.45] scale-105"
        />
        {/* gradient layers */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
        {/* purple tint bloom */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-purple-600/10 blur-[140px]" />
      </div>

      {/* ── Heading (Top) ── */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 text-center pt-20 px-8"
      >
        <motion.p
          initial={{ opacity: 0, letterSpacing: "0.2em" }}
          animate={{ opacity: 0.4, letterSpacing: "0.5em" }}
          transition={{ delay: 0.4, duration: 1 }}
          className="text-white text-[9px] font-bold uppercase mb-5"
        >
          Private Entrance
        </motion.p>
        <h1 className="text-5xl sm:text-6xl font-serif font-bold tracking-tighter leading-none text-white mb-2">
          Step
        </h1>
        <h1 className="text-5xl sm:text-6xl font-serif font-bold tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-300 to-purple-400">
          Inside
        </h1>
      </motion.div>

      {/* ── Dot indicators ── */}
      <motion.div
        animate={controls}
        className="relative z-10 flex gap-5 items-center justify-center"
      >
        {[0, 1, 2, 3].map((i) => {
          const filled = passcode.length > i;
          return (
            <motion.div
              key={i}
              animate={{
                scale: filled ? 1.25 : 1,
                opacity: filled ? 1 : 0.25,
                backgroundColor: error ? "#f87171" : filled ? "#c084fc" : "white",
                boxShadow:
                  filled && !error
                    ? "0 0 24px 6px rgba(192,132,252,0.5)"
                    : error && filled
                    ? "0 0 16px 4px rgba(248,113,113,0.4)"
                    : "none",
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="w-3 h-3 rounded-full"
            />
          );
        })}
      </motion.div>

      {/* ── Floating Keypad ── */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-xs px-8 pb-16"
      >
        {/* Status */}
        <div className="h-8 flex items-center justify-center mb-6">
          <AnimatePresence mode="wait">
            {error && (
              <motion.p
                key="err"
                initial={{ opacity: 0, y: 5, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(8px)" }}
                className="text-red-400 text-[10px] font-bold uppercase tracking-[0.4em]"
              >
                Incorrect Code
              </motion.p>
            )}
            {isVerifying && (
              <motion.div
                key="ver"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2"
              >
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ scaleY: [1, 2.5, 1], opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.12 }}
                    className="w-0.5 h-3 bg-purple-400 rounded-full origin-center"
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Numbers grid — borderless floating style */}
        <div className="grid grid-cols-3 gap-y-2 gap-x-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n, idx) => (
            <motion.button
              key={n}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + idx * 0.04, duration: 0.5 }}
              whileTap={{ scale: 0.82, opacity: 0.7 }}
              onClick={() => handleKeyPress(String(n))}
              disabled={isVerifying}
              className="flex items-center justify-center h-16 outline-none group select-none"
            >
              <span className="text-4xl sm:text-5xl font-serif font-light text-white/70 group-hover:text-white group-active:text-purple-300 transition-all duration-200">
                {n}
              </span>
            </motion.button>
          ))}

          {/* Row 4 */}
          <div className="flex items-center justify-center h-16">
            <AnimatePresence>
              {passcode.length > 0 && !isVerifying && (
                <motion.button
                  key="del"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  onClick={handleBackspace}
                  className="text-white/40 hover:text-white/80 active:scale-85 transition-all outline-none"
                >
                  <Delete className="w-6 h-6" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.76 }}
            whileTap={{ scale: 0.82, opacity: 0.7 }}
            onClick={() => handleKeyPress("0")}
            disabled={isVerifying}
            className="flex items-center justify-center h-16 outline-none group select-none"
          >
            <span className="text-4xl sm:text-5xl font-serif font-light text-white/70 group-hover:text-white group-active:text-purple-300 transition-all duration-200">
              0
            </span>
          </motion.button>

          <div /> {/* empty right */}
        </div>
      </motion.div>

      {/* grain */}
      <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.04] bg-[url('data:image/svg+xml,%3Csvg%20viewBox%3D%220%200%20256%20256%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cfilter%20id%3D%22n%22%3E%3CfeTurbulence%20type%3D%22fractalNoise%22%20baseFrequency%3D%220.9%22%20numOctaves%3D%224%22%20stitchTiles%3D%22stitch%22%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20filter%3D%22url(%23n)%22%2F%3E%3C%2Fsvg%3E')]" />
    </div>
  );
}
