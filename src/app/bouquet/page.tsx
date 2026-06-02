"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ThreeBackground from "@/components/ThreeBackground";
import Link from "next/link";
import { Sparkles, Heart } from "lucide-react";

interface Flower {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  rotation: number;
  type: number;
}

const FLOWER_TYPES = [
  { id: 0, name: "Blossom",  emoji: "🌸", desc: "Classic 8-petal" },
  { id: 1, name: "Lotus",    emoji: "🪷", desc: "Elegant lotus" },
  { id: 2, name: "Daisy",    emoji: "🌼", desc: "Sweet 5-petal" },
  { id: -1, name: "Surprise", emoji: "✨", desc: "Random mix" },
];

export default function InfiniteBouquetPage() {
  const [flowers, setFlowers] = useState<Flower[]>([]);
  const [clickCount, setClickCount] = useState(0);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [selectedType, setSelectedType] = useState<number>(-1); // -1 = random

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const colors = [
    "text-pink-400", "text-purple-400", "text-rose-400", 
    "text-fuchsia-400", "text-violet-400", "text-indigo-400"
  ];

  const handleCanvasClick = (e: React.MouseEvent) => {
    const naturalTilt = (Math.random() * 40) - 20;
    const flowerType = selectedType === -1 ? Math.floor(Math.random() * 3) : selectedType;

    const newFlower: Flower = {
      id: Date.now(),
      x: e.clientX,
      y: e.clientY,
      size: Math.random() * 30 + 65,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: naturalTilt,
      type: flowerType,
    };

    setFlowers(prev => [...prev, newFlower]);
    setClickCount(prev => prev + 1);
  };

  const getFlowerSvg = (type: number) => {
    if (type === 0) {
      // Classic 8-petal
      return (
        <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full drop-shadow-[0_0_15px_currentColor]">
          {[0, 45, 90, 135].map(deg => (
            <g key={deg} transform={`rotate(${deg} 50 50)`}>
              <ellipse cx="50" cy="50" rx="14" ry="48" opacity="1"/>
            </g>
          ))}
          <circle cx="50" cy="50" r="16" fill="white" opacity="1"/>
          <circle cx="50" cy="50" r="8" fill="currentColor" opacity="1"/>
        </svg>
      );
    } else if (type === 1) {
      // Lotus — petals open from base at bottom (y=90) up to the top of the viewBox
      return (
        <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full drop-shadow-[0_0_15px_currentColor]">
          {/* Centre front petal */}
          <path d="M50 90 Q30 55 50 8 Q70 55 50 90" opacity="1" />
          {/* Left inner petal */}
          <path d="M50 90 Q15 60 25 20 Q55 55 50 90" opacity="0.9" />
          {/* Right inner petal */}
          <path d="M50 90 Q85 60 75 20 Q45 55 50 90" opacity="0.9" />
          {/* Left outer petal */}
          <path d="M50 90 Q5 72 10 40 Q40 68 50 90" opacity="0.8" />
          {/* Right outer petal */}
          <path d="M50 90 Q95 72 90 40 Q60 68 50 90" opacity="0.8" />
          {/* Centre stamen dot */}
          <circle cx="50" cy="36" r="7" fill="white" opacity="1" />
        </svg>
      );
    } else {
      // 5-petal Daisy
      return (
        <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full drop-shadow-[0_0_15px_currentColor]">
          {[0, 72, 144, 216, 288].map(deg => (
            <g key={deg} transform={`rotate(${deg} 50 50)`}>
              <ellipse cx="50" cy="22" rx="16" ry="24" opacity="1"/>
            </g>
          ))}
          <circle cx="50" cy="50" r="18" fill="white" opacity="1" />
          <circle cx="50" cy="50" r="8" fill="currentColor" opacity="1" />
        </svg>
      );
    }
  };

  return (
    <main 
        className="relative min-h-screen flex flex-col items-center bg-[#02040a] overflow-hidden cursor-crosshair"
        onClick={handleCanvasClick}
    >
      <ThreeBackground />
      
      {/* Background Ambient Layers */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-purple-900/40 via-pink-900/10 to-transparent" />
      
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.02]">
        <h1 className="text-[18vw] font-serif font-bold text-white select-none tracking-widest">BOUQUET</h1>
      </div>

      <div className="z-20 w-full max-w-4xl mx-auto px-6 pt-20 md:pt-32 pb-12 relative flex flex-col items-center pointer-events-none">
        <div className="text-center mb-12">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/[0.05] border border-white/10 backdrop-blur-xl mb-6 shadow-[0_0_30px_rgba(236,72,153,0.15)]"
          >
            <Sparkles className="w-4 h-4 text-pink-400" />
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-pink-100">Infinite Garden</span>
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 tracking-tight [text-shadow:_0_0_30px_rgba(255,255,255,0.2)]">
            Click to Bloom
          </h1>
          <p className="text-pink-200/70 text-lg md:text-xl font-light italic mb-8 max-w-lg mx-auto">
            Every click grows a new flower. Let's build a beautiful bouquet that never fades, just for you.
          </p>
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-black/30 backdrop-blur-md border border-white/5 text-pink-300/80 text-xs font-bold uppercase tracking-widest mb-8">
             <Heart className="w-3.5 h-3.5 text-pink-500" />
             <span>{clickCount} Flowers Grown</span>
          </div>

          {/* Flower Picker */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center gap-3 pointer-events-auto"
          >
            <p className="text-white/40 text-xs uppercase tracking-widest font-bold">Choose your flower</p>
            <div className="flex gap-3">
              {FLOWER_TYPES.map(ft => (
                <button
                  key={ft.id}
                  onClick={(e) => { e.stopPropagation(); setSelectedType(ft.id); }}
                  className={`relative flex flex-col items-center gap-1 px-4 py-3 rounded-2xl border transition-all duration-300 group ${
                    selectedType === ft.id
                      ? "bg-white/15 border-pink-400/60 shadow-[0_0_20px_rgba(236,72,153,0.4)] scale-110"
                      : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 hover:scale-105"
                  }`}
                >
                  <span className="text-2xl">{ft.emoji}</span>
                  <span className="text-white text-[10px] font-bold tracking-wide">{ft.name}</span>
                  {selectedType === ft.id && (
                    <motion.div
                      layoutId="selected-flower"
                      className="absolute inset-0 rounded-2xl border-2 border-pink-400/80"
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    />
                  )}
                </button>
              ))}
            </div>
            <p className="text-white/30 text-[11px] italic">
              {FLOWER_TYPES.find(f => f.id === selectedType)?.desc} — click anywhere to bloom ✨
            </p>
          </motion.div>
        </div>
      </div>

      {/* Stems Layer - drawn BEHIND flowers */}
      <svg className="fixed inset-0 pointer-events-none z-10 w-full h-full">
        <AnimatePresence>
          {flowers.map(flower => {
            const startX = windowSize.width / 2;
            const startY = windowSize.height + 100;

            // Flowers always face up, so the stem always attaches at the
            // BOTTOM CENTER of the flower — straight down from the flower center.
            // We account for the small natural tilt.
            const rad = (flower.rotation * Math.PI) / 180;
            const halfSize = flower.size / 2;
            // Bottom of the flower in screen space (rotated by the small tilt)
            const attachX = flower.x + halfSize * Math.sin(rad);
            const attachY = flower.y + halfSize * Math.cos(rad);

            // Nice natural curve from base to flower
            const controlX = startX + (attachX - startX) * 0.15;
            const controlY = startY - (startY - attachY) * 0.75;

            const pathData = `M ${startX} ${startY} Q ${controlX} ${controlY} ${attachX} ${attachY}`;

            return (
              <motion.path
                key={`stem-${flower.id}`}
                d={pathData}
                fill="transparent"
                stroke="rgba(74, 222, 128, 0.9)"
                strokeWidth={Math.max(2.5, flower.size / 22)}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.0, ease: "easeOut" }}
                strokeLinecap="round"
              />
            );
          })}
        </AnimatePresence>
      </svg>

      {/* Flowers Layer - z-30 so always above stems */}
      <div className="fixed inset-0 pointer-events-none z-30">
        <AnimatePresence>
          {flowers.map((flower) => (
            <motion.div
              key={flower.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 260, 
                damping: 18,
              }}
              className={`absolute ${flower.color}`}
              style={{ 
                left: flower.x, 
                top: flower.y, 
                width: flower.size, 
                height: flower.size,
                transform: `translate(-50%, -50%) rotate(${flower.rotation}deg)`,
              }}
            >
              {getFlowerSvg(flower.type)}
              
              {/* Little pop animation when spawning */}
              <motion.div
                initial={{ scale: 1, opacity: 0.6 }}
                animate={{ scale: 2.5, opacity: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="absolute inset-0 rounded-full bg-current mix-blend-screen"
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 pointer-events-auto">
        <Link href="/typography">
            <button className="px-10 py-4 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold shadow-[0_0_30px_rgba(236,72,153,0.4)] hover:shadow-[0_0_40px_rgba(236,72,153,0.6)] hover:scale-105 transition-all flex items-center gap-3 group border border-white/20">
              <span>Next Surprise</span>
              <Heart className="w-5 h-5 group-hover:scale-125 transition-transform fill-white/20" />
            </button>
        </Link>
        <button 
            onClick={(e) => { e.stopPropagation(); setFlowers([]); setClickCount(0); }}
            className="px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-all backdrop-blur-md font-bold uppercase text-xs tracking-widest"
        >
            Clear Garden
        </button>
      </div>

    </main>
  );
}
