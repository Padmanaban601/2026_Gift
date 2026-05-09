"use client";

import { useState, useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Points, PointMaterial, Float, PerspectiveCamera, MeshDistortMaterial } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";
import { Sparkles, ArrowRight, MousePointer2, Wind } from "lucide-react";
import Link from "next/link";

const PARTICLE_COUNT = 3000;

function FluidParticles() {
  const points = useRef<THREE.Points>(null!);
  const mouse = useRef(new THREE.Vector2(0, 0));
  
  const [positions, step] = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const stp = new Float32Array(PARTICLE_COUNT);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 2;
      stp[i] = Math.random();
    }
    return [pos, stp];
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Smoothly track mouse in world space
    const targetX = (state.mouse.x * state.viewport.width) / 2;
    const targetY = (state.mouse.y * state.viewport.height) / 2;
    mouse.current.x = THREE.MathUtils.lerp(mouse.current.x, targetX, 0.1);
    mouse.current.y = THREE.MathUtils.lerp(mouse.current.y, targetY, 0.1);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      
      // Basic wave motion
      positions[i3] += Math.sin(time * 0.5 + positions[i3 + 1]) * 0.005;
      positions[i3 + 1] += Math.cos(time * 0.3 + positions[i3]) * 0.005;

      // Interaction with mouse
      const dx = positions[i3] - mouse.current.x;
      const dy = positions[i3 + 1] - mouse.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < 2) {
        const force = (2 - dist) * 0.05;
        positions[i3] += dx * force;
        positions[i3 + 1] += dy * force;
      }

      // Keep within bounds
      if (Math.abs(positions[i3]) > 6) positions[i3] *= -0.9;
      if (Math.abs(positions[i3 + 1]) > 6) positions[i3 + 1] *= -0.9;
    }
    
    points.current.geometry.attributes.position.needsUpdate = true;
    points.current.rotation.z = time * 0.05;
  });

  return (
    <Points ref={points} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        vertexColors={false}
        color="#8b5cf6"
        size={0.05}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

function BackgroundGlow() {
  return (
    <mesh scale={20}>
      <planeGeometry />
      <meshBasicMaterial color="#4c1d95" transparent opacity={0.05} />
    </mesh>
  );
}

export default function ZenPage() {
  const [hintVisible, setHintVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setHintVisible(false), 5000);
    
    // Send notification
    fetch(`https://formspree.io/f/${process.env.NEXT_PUBLIC_FORMSPREE_ID}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subject: "Aditi is relaxing in the Zen Garden 🧘‍♀️",
        message: "Aditi opened the Zen Fluid Garden experience.",
        timestamp: new Date().toLocaleString()
      })
    }).catch(console.error);

    return () => clearTimeout(timer);
  }, []);

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
                <Wind className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold uppercase tracking-[0.3em] text-slate-300">Zen Fluid Garden</span>
            </motion.div>
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 tracking-tight">
                Mindful Motion
            </h1>
            <p className="text-slate-400 text-lg font-light italic max-w-md mx-auto">
                Move your mouse to stir the cosmic energy. <br/> 
                Let the flow calm your mind.
            </p>
        </div>

        <div className="pointer-events-auto">
             <Link href="/experience/rain">
                <button className="group px-12 py-5 rounded-full bg-white text-slate-950 font-bold hover:shadow-[0_0_50px_rgba(255,255,255,0.2)] transition-all flex items-center gap-3">
                    <span>The Starlight Rain</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
             </Link>
        </div>
      </div>

      {/* 3D Scene */}
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
            <color attach="background" args={["#02040a"]} />
            <ambientLight intensity={1} />
            <FluidParticles />
            <BackgroundGlow />
        </Canvas>
      </div>

      {/* Interaction Hint */}
      <AnimatePresence>
        {hintVisible && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 flex items-center justify-center pointer-events-none z-20"
            >
                <div className="flex flex-col items-center gap-4 text-white/40">
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], x: [-20, 20, -20] }}
                        transition={{ duration: 3, repeat: Infinity }}
                    >
                        <MousePointer2 className="w-12 h-12" />
                    </motion.div>
                    <span className="text-xs uppercase tracking-[0.4em] font-bold">Stir the flow</span>
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* Corner Vignette */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(2,4,10,0.8)_100%)]" />
    </main>
  );
}
