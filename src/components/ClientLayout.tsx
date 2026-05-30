"use client";

import React, { useState, useEffect, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PasscodeLock from "./PasscodeLock";

import Navbar from "./Navbar";
import AudioPlayer from "./AudioPlayer";
import MagicCursor from "./MagicCursor";
import MoodSwitcher from "./MoodSwitcher";
import { usePathname, useRouter } from "next/navigation";

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
  const [mood, setMood] = useState("luxury");
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const savedMood = localStorage.getItem("hb_mood");
    requestAnimationFrame(() => {
      setMounted(true);
      if (savedMood) setMood(savedMood);
    });
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
    router.push("/");
  };

  useEffect(() => {
    if (localStorage.getItem("hb_unlocked") === "true") {
      requestAnimationFrame(() => {
        setIsUnlocked(true);
      });
    }
  }, []);

  if (!mounted) return null;

  return (
    <AppContext.Provider value={{ isUnlocked, unlock, logout, mood, setMood: updateMood }}>
      {/* Mood Theme Provider Style Wrapper */}
      <div className={`theme-${mood} transition-colors duration-1000`}>
      
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
            className="min-h-screen flex flex-col"
          >
            <MagicCursor />
            <Navbar />
            <AudioPlayer />
            <MoodSwitcher />
            
            <main className="flex-grow relative overflow-x-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={pathname}
                  initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -10, filter: "blur(10px)" }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                >
                  {children}
                </motion.div>
              </AnimatePresence>
            </main>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </AppContext.Provider>
  );
}
