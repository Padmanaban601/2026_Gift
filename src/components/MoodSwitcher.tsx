"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "./ClientLayout";
import { Palette, Sun, Moon, Sparkles } from "lucide-react";

export default function MoodSwitcher() {
  const { mood, setMood } = useApp();
  const [isOpen, setIsOpen] = React.useState(false);

  const themes = [
    { id: "luxury", name: "Classic", icon: <Sparkles className="w-4 h-4" />, color: "bg-purple-500" },
    { id: "midnight", name: "Midnight", icon: <Moon className="w-4 h-4" />, color: "bg-blue-600" },
    { id: "sunset", name: "Sunset", icon: <Sun className="w-4 h-4" />, color: "bg-orange-500" },
  ];

  return (
    <div className="fixed bottom-8 right-8 z-[70] flex flex-col items-end gap-4">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="flex flex-col gap-2 p-2 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl mb-2"
          >
            {themes.map((t) => (
              <motion.button
                key={t.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setMood(t.id);
                  setIsOpen(false);
                }}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl transition-all ${
                  mood === t.id 
                    ? "bg-white text-slate-950 font-bold" 
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {t.icon}
                <span className="text-xs font-bold uppercase tracking-widest">{t.name}</span>
                {mood === t.id && (
                   <motion.div 
                    layoutId="active-dot"
                    className="w-1.5 h-1.5 rounded-full bg-purple-600"
                   />
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`p-4 rounded-full border shadow-2xl backdrop-blur-md transition-all duration-500 ${
          isOpen 
            ? "bg-white text-slate-950 border-white rotate-90" 
            : "bg-white/5 text-white border-white/10 hover:bg-white/10"
        }`}
      >
        <Palette className="w-6 h-6" />
      </motion.button>
    </div>
  );
}
