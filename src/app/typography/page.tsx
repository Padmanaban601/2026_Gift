"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ThreeBackground from "@/components/ThreeBackground";
import Link from "next/link";
import { ArrowLeft, Sparkles, Heart } from "lucide-react";

const tamilWords = [
  "அன்பு", "மகிழ்ச்சி", "அழகி", "புன்னகை", "வாழ்த்துக்கள்", 
  "அதிதி", "இனிமை", "காதல்", "வாழ்க்கை", "வெற்றி"
];

export default function TypographyHeartPage() {
  const [isHovered, setIsHovered] = useState(false);
  const [scatteredWords, setScatteredWords] = useState<any[]>([]);

  useEffect(() => {
    // Generate scattered words once
    const words = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      text: tamilWords[i % tamilWords.length],
      x: (Math.random() - 0.5) * 600,
      y: (Math.random() - 0.5) * 600,
      rotate: Math.random() * 360,
      scale: Math.random() * 0.5 + 0.5,
      delay: Math.random() * 0.5
    }));
    setScatteredWords(words);
  }, []);

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center bg-[#02040a] overflow-hidden">
      <ThreeBackground />
      
      <div className="z-10 w-full max-w-4xl mx-auto px-6 relative flex flex-col items-center">
        <div className="text-center mb-20">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md mb-6"
          >
            <Sparkles className="w-4 h-4 text-rose-400" />
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-slate-300">Cultural Art</span>
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 tracking-tight">
            The Heart of Words
          </h1>
          <p className="text-slate-400 text-lg font-light italic">
            Hover over the heart to see it dissolve into the words that define you.
          </p>
        </div>

        {/* Central Heart Interaction */}
        <div className="relative w-64 h-64 md:w-96 md:h-96 flex items-center justify-center">
          <AnimatePresence>
            {isHovered && scatteredWords.map((word) => (
              <motion.div
                key={word.id}
                initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                animate={{ 
                  x: word.x, 
                  y: word.y, 
                  opacity: 0.6, 
                  scale: word.scale,
                  rotate: word.rotate
                }}
                exit={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                transition={{ 
                  duration: 1.5, 
                  delay: word.delay,
                  ease: [0.22, 1, 0.36, 1] 
                }}
                className="absolute text-pink-300/40 font-serif whitespace-nowrap pointer-events-none"
              >
                {word.text}
              </motion.div>
            ))}
          </AnimatePresence>

          <motion.div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            animate={isHovered ? { scale: 0.9, opacity: 0.1 } : { scale: 1, opacity: 1 }}
            className="relative cursor-pointer z-20 group"
          >
            <div className="absolute inset-0 bg-rose-500/20 blur-[60px] rounded-full group-hover:bg-rose-500/40 transition-all duration-700" />
            <Heart 
                className="w-48 h-48 md:w-72 md:h-72 text-rose-500 fill-rose-500 shadow-[0_0_50px_rgba(244,63,94,0.5)] transition-all duration-700 group-hover:shadow-[0_0_100px_rgba(244,63,94,0.8)]" 
                strokeWidth={0.5}
            />
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-serif font-bold text-2xl md:text-3xl tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                    அதிதி
                </span>
            </div>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-32 flex flex-col items-center"
        >
             <p className="text-slate-400 text-sm uppercase tracking-[0.4em] mb-12">Thank you for being you</p>
             <Link href="/experience/lantern">
                <button className="px-12 py-5 rounded-full bg-white text-slate-950 font-bold hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all flex items-center gap-3 group">
                  <span>Continue the Dream</span>
                  <Sparkles className="w-5 h-5 text-purple-600 group-hover:rotate-12 transition-transform" />
                </button>
             </Link>
        </motion.div>
      </div>

    </main>
  );
}
