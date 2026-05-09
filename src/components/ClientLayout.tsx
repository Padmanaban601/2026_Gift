"use client";

import React, { useState, useEffect, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PasscodeLock from "./PasscodeLock";
import Navbar from "./Navbar";
import AudioPlayer from "./AudioPlayer";
import MoodSwitcher from "./MoodSwitcher";

const AppContext = createContext<{
  isUnlocked: boolean;
  unlock: () => void;
  logout: () => void;
  mood: string;
  setMood: (mood: string) => void;
}>({
  isUnlocked: false,
  unlock: () => {},
  logout: () => {},
  mood: "luxury",
  setMood: () => {},
});

export const useApp = () => useContext(AppContext);

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [mood, setMood] = useState("luxury");

  useEffect(() => {
    setMounted(true);
    const savedMood = localStorage.getItem("hb_mood");
    if (savedMood) setMood(savedMood);

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const updateMood = (newMood: string) => {
    setMood(newMood);
    localStorage.setItem("hb_mood", newMood);
  };

  const unlock = () => {
    setIsUnlocked(true);
    localStorage.setItem("hb_unlocked", "true");
  };

  const logout = () => {
    setIsUnlocked(false);
    localStorage.removeItem("hb_unlocked");
  };

  useEffect(() => {
    if (localStorage.getItem("hb_unlocked") === "true") {
      setIsUnlocked(true);
    }
  }, []);

  if (!mounted) return null;

  return (
    <AppContext.Provider value={{ isUnlocked, unlock, logout, mood, setMood: updateMood }}>
      {/* Mood Theme Provider Style Wrapper */}
      <div className={`theme-${mood} transition-colors duration-1000`}>
      {/* Custom Cursor Glow */}
      <div 
        className="fixed pointer-events-none z-[9998] w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(168,85,247,0.12)_0%,transparent_70%)] -translate-x-1/2 -translate-y-1/2 hidden md:block will-change-transform" 
        style={{ left: mousePos.x, top: mousePos.y }}
      />
      
      <AnimatePresence mode="wait">
        {!isUnlocked ? (
          <motion.div
            key="lock"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] bg-slate-950"
          >
            <PasscodeLock onUnlock={unlock} />
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="min-h-screen"
          >
            <Navbar />
            <AudioPlayer />
            {children}
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </AppContext.Provider>
  );
}
