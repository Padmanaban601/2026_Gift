"use client";

import { useState, useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, PerspectiveCamera } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";
import { Sparkles, ArrowRight, CloudRain, Heart } from "lucide-react";
import Link from "next/link";

const STAR_COUNT = 1500;

function StarRain() {
  const points = useRef<THREE.Points>(null!);
  
  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(STAR_COUNT * 3);
    const spd = new Float32Array(STAR_COUNT);
    for (let i = 0; i < STAR_COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = Math.random() * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
      spd[i] = 0.1 + Math.random() * 0.2;
    }
    return [pos, spd];
  }, []);

  useFrame((state, delta) => {
    for (let i = 0; i < STAR_COUNT; i++) {
      const i3 = i * 3;
      positions[i3 + 1] -= speeds[i]; // Fall down
      
      // Reset to top
      if (positions[i3 + 1] < -10) {
        positions[i3 + 1] = 10;
        positions[i3] = (Math.random() - 0.5) * 20;
      }
    }
    points.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <Points ref={points} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#a855f7"
        size={0.06}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

const hiddenMessages = [
  "You are Brilliant",
  "You are Kind",
  "You are Loved",
  "You are Strong",
  "You are Magical",
  "அன்பானவள்",
  "அழகானவள்"
];

export default function RainPage() {
  const [activeMessage, setActiveMessage] = useState("");
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    // Send notification
    fetch(`https://formspree.io/f/${process.env.NEXT_PUBLIC_FORMSPREE_ID}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subject: "Aditi is catching stars! ✨",
        message: "Aditi opened the Starlight Rain experience.",
        timestamp: new Date().toLocaleString()
      })
    }).catch(console.error);
  }, []);

  const handleReveal = () => {
    const msg = hiddenMessages[Math.floor(Math.random() * hiddenMessages.length)];
    setActiveMessage(msg);
    setIsRevealed(true);
    setTimeout(() => setIsRevealed(false), 3000);
  };

  return (
    <main className="relative min-h-screen bg-[#02040a] overflow-hidden">
      {/* UI Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col items-center justify-between pt-20 md:pt-32 pb-24 px-6">
        <div className="text-center">
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md mb-6"
            >
                <CloudRain className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-bold uppercase tracking-[0.3em] text-slate-300">Starlight Rain</span>
            </motion.div>
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 tracking-tight">
                Catch the Glow
            </h1>
            <p className="text-slate-400 text-lg font-light italic max-w-md mx-auto">
                The stars are falling just for you. <br/>
                Click anywhere to catch a falling star and reveal a secret.
            </p>
        </div>

        <div className="pointer-events-auto">
             <Link href="/experience/future">
                <button className="group px-12 py-5 rounded-full bg-white text-slate-950 font-bold hover:shadow-[0_0_50px_rgba(255,255,255,0.2)] transition-all flex items-center gap-3">
                    <span>Travel to Future</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
             </Link>
        </div>
      </div>

      {/* 3D Scene */}
      <div className="absolute inset-0 cursor-crosshair" onClick={handleReveal}>
        <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
            <color attach="background" args={["#02040a"]} />
            <StarRain />
        </Canvas>
      </div>

      {/* Reveal Message */}
      <AnimatePresence>
        {isRevealed && (
            <motion.div
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.5, filter: "blur(10px)" }}
                className="fixed inset-0 flex items-center justify-center pointer-events-none z-20"
            >
                <div className="text-4xl md:text-7xl font-serif font-bold text-white text-center drop-shadow-[0_0_30px_rgba(168,85,247,0.8)] px-6">
                    {activeMessage}
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* Ambient Lighting */}
      <div className="fixed inset-0 pointer-events-none bg-gradient-to-b from-purple-500/5 to-transparent" />
    </main>
  );
}
