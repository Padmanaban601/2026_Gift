"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ThreeBackground from "@/components/ThreeBackground";
import Link from "next/link";
import { ArrowLeft, Sparkles, Heart } from "lucide-react";

interface Flower {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  rotation: number;
}

export default function InfiniteBouquetPage() {
  const [flowers, setFlowers] = useState<Flower[]>([]);
  const [clickCount, setClickCount] = useState(0);

  const colors = [
    "text-pink-400", "text-purple-400", "text-rose-400", 
    "text-fuchsia-400", "text-violet-400", "text-indigo-400"
  ];

  const handleCanvasClick = (e: React.MouseEvent) => {
    const newFlower: Flower = {
      id: Date.now(),
      x: e.clientX,
      y: e.clientY,
      size: Math.random() * 40 + 40,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360
    };

    setFlowers(prev => [...prev, newFlower]);
    
    // Notify on first flower
    if (clickCount === 0) {
      fetch(`https://formspree.io/f/${process.env.NEXT_PUBLIC_FORMSPREE_ID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: "Aditi started growing flowers! 🌸",
          message: "Aditi opened the Infinite Bouquet and bloomed her first flower.",
          timestamp: new Date().toLocaleString()
        })
      }).catch(console.error);
    }

    setClickCount(prev => prev + 1);
  };

  return (
    <main 
        className="relative min-h-screen flex flex-col items-center bg-[#02040a] overflow-hidden cursor-crosshair"
        onClick={handleCanvasClick}
    >
      <ThreeBackground />
      
      {/* Background Text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
        <h1 className="text-[20vw] font-serif font-bold text-white select-none">BOUQUET</h1>
      </div>

      <div className="z-20 w-full max-w-4xl mx-auto px-6 pt-20 md:pt-32 pb-12 relative flex flex-col items-center pointer-events-none">
        <div className="text-center mb-12">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md mb-6"
          >
            <Sparkles className="w-4 h-4 text-pink-400" />
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-slate-300">Infinite Garden</span>
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 tracking-tight">
            Click to Bloom
          </h1>
          <p className="text-slate-400 text-lg font-light italic mb-8">
            Every click grows a new flower. Build a bouquet that never fades.
          </p>
          <div className="text-pink-300/60 text-xs font-bold uppercase tracking-widest flex items-center gap-2 justify-center">
             <Heart className="w-3 h-3" />
             <span>{clickCount} Flowers Grown</span>
          </div>
        </div>
      </div>

      {/* Flowers Layer */}
      <div className="fixed inset-0 pointer-events-none z-10">
        <AnimatePresence>
          {flowers.map((flower) => (
            <motion.div
              key={flower.id}
              initial={{ scale: 0, opacity: 0, rotate: flower.rotation }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 260, 
                damping: 20,
                duration: 0.6 
              }}
              className={`absolute ${flower.color}`}
              style={{ 
                left: flower.x, 
                top: flower.y, 
                width: flower.size, 
                height: flower.size,
                transform: `translate(-50%, -50%) rotate(${flower.rotation}deg)` 
              }}
            >
                <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                    <path d="M50 50 C50 20 20 20 20 50 C20 80 50 80 50 50 Z" />
                    <path d="M50 50 C80 50 80 20 50 20 C20 20 20 50 50 50 Z" />
                    <path d="M50 50 C50 80 80 80 80 50 C80 20 50 20 50 50 Z" />
                    <path d="M50 50 C20 50 20 80 50 80 C80 80 80 50 50 50 Z" />
                    <circle cx="50" cy="50" r="10" fill="white" opacity="0.5" />
                </svg>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 flex gap-6 pointer-events-auto">
        <Link href="/typography">
            <button className="px-10 py-4 rounded-full bg-white text-slate-950 font-bold hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all flex items-center gap-3 group">
              <span>Next Surprise</span>
              <Heart className="w-5 h-5 text-pink-600 group-hover:scale-125 transition-transform" />
            </button>
        </Link>
        <button 
            onClick={(e) => { e.stopPropagation(); setFlowers([]); setClickCount(0); }}
            className="px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white/50 hover:text-white transition-all backdrop-blur-md font-bold uppercase text-xs tracking-widest"
        >
            Clear Garden
        </button>
      </div>

    </main>
  );
}
