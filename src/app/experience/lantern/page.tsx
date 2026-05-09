"use client";

import { useState, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Float, Text, PerspectiveCamera, OrbitControls, Sky, Stars, MeshDistortMaterial } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";
import { Sparkles, Send, ArrowLeft, Heart } from "lucide-react";
import Link from "next/link";

function Lantern({ position, text, color }: { position: [number, number, number], text: string, color: string }) {
  const meshRef = useRef<THREE.Group>(null!);
  const [speed] = useState(() => 0.2 + Math.random() * 0.3);
  const [wobble] = useState(() => Math.random() * Math.PI * 2);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y += speed * 0.05;
      meshRef.current.position.x += Math.sin(state.clock.elapsedTime + wobble) * 0.01;
      meshRef.current.position.z += Math.cos(state.clock.elapsedTime + wobble) * 0.01;
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group ref={meshRef} position={position}>
      {/* Lantern Body */}
      <mesh>
        <cylinderGeometry args={[0.3, 0.3, 0.5, 8]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={2} 
          transparent 
          opacity={0.8} 
        />
      </mesh>
      
      {/* Light Glow */}
      <pointLight color={color} intensity={1} distance={5} />
      
      {/* Wish Text on Lantern */}
      <Text
        position={[0, 0, 0.31]}
        fontSize={0.08}
        color="white"
        anchorX="center"
        anchorY="middle"
        rotation={[0, 0, 0]}
      >
        {text.length > 15 ? text.substring(0, 12) + "..." : text}
      </Text>
    </group>
  );
}

function Sea() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
      <planeGeometry args={[100, 100]} />
      <MeshDistortMaterial
        color="#020617"
        speed={1}
        distort={0.2}
        radius={1}
      />
    </mesh>
  );
}

export default function LanternPage() {
  const [wish, setWish] = useState("");
  const [lanterns, setLanterns] = useState<{ id: number; text: string; position: [number, number, number]; color: string }[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const releaseLantern = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wish.trim()) return;

    // Send to Formspree
    try {
      await fetch(`https://formspree.io/f/${process.env.NEXT_PUBLIC_FORMSPREE_ID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: "New Birthday Wish from Aditi! 🏮",
          wish: wish,
          timestamp: new Date().toLocaleString()
        })
      });
    } catch (error) {
      console.error("Formspree error:", error);
    }

    const newLantern = {
      id: Date.now(),
      text: wish,
      position: [(Math.random() - 0.5) * 10, -2, (Math.random() - 0.5) * 10] as [number, number, number],
      color: ["#f97316", "#fb7185", "#a855f7", "#eab308"][Math.floor(Math.random() * 4)]
    };

    setLanterns(prev => [...prev, newLantern]);
    setWish("");
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
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
                <Sparkles className="w-4 h-4 text-orange-400" />
                <span className="text-xs font-bold uppercase tracking-[0.3em] text-slate-300">Lantern Festival</span>
            </motion.div>
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4 tracking-tight">
                Release a Wish
            </h1>
            <p className="text-slate-400 text-lg font-light italic max-w-md mx-auto">
                Type a wish for your new year and watch it float into the infinite sky.
            </p>
        </div>

        <div className="w-full max-w-md pointer-events-auto">
            <form onSubmit={releaseLantern} className="relative group">
                <input 
                    type="text" 
                    value={wish}
                    onChange={(e) => setWish(e.target.value)}
                    placeholder="I wish for..."
                    className="w-full bg-white/[0.03] border border-white/10 backdrop-blur-xl rounded-full px-8 py-5 text-white placeholder:text-white/20 focus:outline-none focus:border-orange-500/50 transition-all text-lg shadow-2xl"
                />
                <button 
                    type="submit"
                    className="absolute right-2 top-2 bottom-2 px-6 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 text-white font-bold flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-lg"
                >
                    <span>Release</span>
                    <Send className="w-4 h-4" />
                </button>
            </form>
            
            <div className="mt-12 flex justify-center gap-6">
                 <Link href="/experience/zen">
                    <button className="px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all text-sm font-bold uppercase tracking-widest flex items-center gap-3">
                        <span>Next Stop: Zen</span>
                        <Heart className="w-4 h-4 text-rose-500" />
                    </button>
                 </Link>
            </div>
        </div>
      </div>

      {/* 3D Scene */}
      <div className="absolute inset-0 cursor-grab active:cursor-grabbing">
        <Canvas shadows>
            <PerspectiveCamera makeDefault position={[0, 2, 10]} fov={50} />
            <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 1.8} minPolarAngle={Math.PI / 3} />
            
            <color attach="background" args={["#02040a"]} />
            <fog attach="fog" args={["#02040a", 5, 25]} />
            
            <ambientLight intensity={0.2} />
            <pointLight position={[10, 10, 10]} intensity={0.5} />
            
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            
            <Sea />

            {lanterns.map((l) => (
                <Lantern key={l.id} position={l.position} text={l.text} color={l.color} />
            ))}
            
            {/* Some ambient lanterns */}
            {useMemo(() => [...Array(20)].map((_, i) => (
                <Lantern 
                    key={`ambient-${i}`} 
                    position={[
                        (Math.random() - 0.5) * 20, 
                        Math.random() * 10, 
                        (Math.random() - 0.5) * 20
                    ]} 
                    text="" 
                    color={["#f97316", "#fb7185", "#a855f7"][Math.floor(Math.random() * 3)]} 
                />
            )), [])}
        </Canvas>
      </div>

      {/* Success Notification */}
      <AnimatePresence>
        {isSubmitted && (
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="fixed bottom-32 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full bg-orange-500 text-white font-bold shadow-2xl flex items-center gap-2 pointer-events-none"
            >
                <Sparkles className="w-4 h-4" />
                <span>Your wish has been released to the stars</span>
            </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
