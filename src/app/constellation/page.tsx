"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ThreeBackground from "@/components/ThreeBackground";
import Link from "next/link";
import { ArrowLeft, Sparkles, Stars, Heart, MousePointer2 } from "lucide-react";

// Predefined points for the constellation
// These form a heart-like shape
const constellationPoints = [
  { id: 1, x: 50, y: 30 },
  { id: 2, x: 35, y: 20 },
  { id: 3, x: 20, y: 30 },
  { id: 4, x: 20, y: 55 },
  { id: 5, x: 50, y: 80 },
  { id: 6, x: 80, y: 55 },
  { id: 7, x: 80, y: 30 },
  { id: 8, x: 65, y: 20 },
];

export default function ConstellationPage() {
  const [activePoints, setActivePoints] = useState<number[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  const handlePointClick = (id: number) => {
    // Only allow clicking in sequence or clicking any unclicked point
    // For this experience, let's allow clicking in sequence to make it feel like "drawing"
    if (activePoints.includes(id)) return;
    
    // Check if it's the next point in sequence (optional, but makes it more guided)
    if (activePoints.length > 0 && id !== activePoints[activePoints.length - 1] + 1 && id !== 1) {
        // Allow it anyway to not frustrate the user, but we could enforce order
    }

    const newActivePoints = [...activePoints, id];
    setActivePoints(newActivePoints);

    if (newActivePoints.length === constellationPoints.length) {
      setTimeout(() => setIsCompleted(true), 1000);
    }
  };

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center bg-[#02040a] overflow-hidden">
      {/* Noise Texture */}
      <div className="fixed inset-0 z-50 opacity-[0.03] pointer-events-none bg-[url('data:image/svg+xml,%3Csvg%20viewBox%3D%220%200%20200%20200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cfilter%20id%3D%22noiseFilter%22%3E%3CfeTurbulence%20type%3D%22fractalNoise%22%20baseFrequency%3D%220.65%22%20numOctaves%3D%223%22%20stitchTiles%3D%22stitch%22%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20filter%3D%22url(%23noiseFilter)%22%2F%3E%3C%2Fsvg%3E')]" />
      
      <ThreeBackground />

      <div className="z-10 w-full max-w-4xl mx-auto px-6 relative flex flex-col items-center">
        <AnimatePresence mode="wait">
          {!isCompleted ? (
            <motion.div
              key="interaction"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
              className="w-full flex flex-col items-center"
            >
              <div className="text-center mb-12">
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md mb-6"
                >
                  <Stars className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-bold uppercase tracking-[0.3em] text-slate-300">Connect the Stars</span>
                  <Stars className="w-4 h-4 text-pink-400" />
                </motion.div>
                <h1 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4 tracking-tight leading-tight">
                  A Message Written <br className="md:hidden" /> in the Stars
                </h1>
                <p className="text-slate-400 text-lg font-light italic">
                  Click the glowing stars to reveal what's hidden...
                </p>
              </div>

              {/* Constellation Canvas */}
              <div className="relative w-full aspect-square md:aspect-video max-w-2xl bg-white/[0.02] rounded-[40px] border border-white/5 backdrop-blur-sm overflow-hidden flex items-center justify-center group shadow-2xl">
                {/* Lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {activePoints.map((pointId, index) => {
                    if (index === 0) return null;
                    const p1 = constellationPoints.find(p => p.id === activePoints[index - 1]);
                    const p2 = constellationPoints.find(p => p.id === pointId);
                    if (!p1 || !p2) return null;

                    return (
                      <motion.line
                        key={`line-${index}`}
                        x1={`${p1.x}%`}
                        y1={`${p1.y}%`}
                        x2={`${p2.x}%`}
                        y2={`${p2.y}%`}
                        stroke="rgba(168, 85, 247, 0.6)"
                        strokeWidth="3"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      />
                    );
                  })}
                  
                  {/* Closing line if completed */}
                  {activePoints.length === constellationPoints.length && (
                     <motion.line
                        x1={`${constellationPoints[constellationPoints.length-1].x}%`}
                        y1={`${constellationPoints[constellationPoints.length-1].y}%`}
                        x2={`${constellationPoints[0].x}%`}
                        y2={`${constellationPoints[0].y}%`}
                        stroke="rgba(168, 85, 247, 0.6)"
                        strokeWidth="3"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
                      />
                  )}
                </svg>

                {/* Stars */}
                {constellationPoints.map((point) => {
                  const isActive = activePoints.includes(point.id);
                  const isNext = activePoints.length === 0 ? point.id === 1 : !isActive && point.id === activePoints[activePoints.length - 1] + 1;

                  return (
                    <motion.button
                      key={point.id}
                      className={`absolute w-4 h-4 rounded-full z-20 transition-all ${
                        isActive 
                          ? "bg-white shadow-[0_0_20px_rgba(255,255,255,1)]" 
                          : "bg-white/10 border border-white/20"
                      }`}
                      style={{ left: `${point.x}%`, top: `${point.y}%`, transform: 'translate(-50%, -50%)' }}
                      whileHover={{ scale: 1.8 }}
                      whileTap={{ scale: 0.8 }}
                      onClick={() => handlePointClick(point.id)}
                    >
                      {isActive && (
                        <motion.div 
                          className="absolute inset-[-12px] bg-purple-500/40 rounded-full blur-lg" 
                          animate={{ scale: [1, 1.8, 1], opacity: [0.4, 0.7, 0.4] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                      {isNext && (
                        <motion.div 
                          className="absolute inset-[-15px] border-2 border-purple-400/50 rounded-full"
                          animate={{ scale: [1, 1.3, 1], opacity: [1, 0, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                      )}
                    </motion.button>
                  );
                })}

                {/* Hint */}
                {activePoints.length === 0 && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute bottom-8 flex items-center gap-2 text-white/40 text-xs uppercase tracking-[0.3em] font-bold"
                  >
                    <MousePointer2 className="w-4 h-4" />
                    <span>Click the first star to begin</span>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="completion"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", duration: 1.2 }}
              className="flex flex-col items-center text-center"
            >
              <motion.div
                animate={{ 
                  filter: ["drop-shadow(0 0 20px rgba(168,85,247,0.5))", "drop-shadow(0 0 40px rgba(236,72,153,0.8))", "drop-shadow(0 0 20px rgba(168,85,247,0.5))"]
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="mb-12"
              >
                <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md mb-8">
                    <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
                    <span className="text-xs font-bold uppercase tracking-[0.3em] text-slate-300">Written in the Stars</span>
                    <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
                </div>
                <h1 className="text-7xl md:text-9xl font-serif font-bold text-white mb-6 tracking-tight">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 [text-shadow:0_0_50px_rgba(168,85,247,0.3)]">
                    அதிதி
                  </span>
                </h1>
                <p className="text-2xl md:text-4xl text-pink-200/90 font-light italic tracking-widest">
                  Aditi
                </p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="max-w-2xl px-4"
              >
                <p className="text-xl md:text-2xl text-slate-300 leading-relaxed font-light mb-16 italic">
                  "Just like the stars in the night sky, <br className="hidden md:block" />
                  your smile is a beautiful light that reaches me across every mile."
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <Link href="/aura">
                    <motion.button 
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full sm:w-auto px-12 py-5 rounded-full bg-white text-slate-950 font-bold shadow-[0_20px_50px_rgba(255,255,255,0.1)] hover:shadow-white/20 transition-all text-lg flex items-center gap-3"
                    >
                      <span>Continue the Journey</span>
                      <Sparkles className="w-5 h-5 text-purple-600" />
                    </motion.button>
                  </Link>
                  <Link href="/message">
                    <motion.button 
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full sm:w-auto px-12 py-5 rounded-full bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all text-lg backdrop-blur-md"
                    >
                      Read Note
                    </motion.button>
                  </Link>
                </div>
              </motion.div>

              {/* Final Bloom Effect */}
              <div className="fixed inset-0 pointer-events-none -z-10">
                {[...Array(30)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white rounded-full"
                    initial={{ 
                      x: "50%", 
                      y: "50%",
                      opacity: 1 
                    }}
                    animate={{ 
                      x: `${Math.random() * 100}%`,
                      y: `${Math.random() * 100}%`,
                      opacity: 0,
                      scale: Math.random() * 5
                    }}
                    transition={{ 
                      duration: 3 + Math.random() * 2,
                      repeat: Infinity,
                      repeatDelay: Math.random() * 3
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </main>
  );
}
