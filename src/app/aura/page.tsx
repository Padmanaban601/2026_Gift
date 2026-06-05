"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ThreeBackground from "@/components/ThreeBackground";
import Link from "next/link";
import { Sparkles, Fingerprint, ShieldCheck, Zap } from "lucide-react";

interface AuraStat {
  label: string;
  value: string | number;
}

interface AuraResult {
  name: string;
  description: string;
  color: string;
  glow: string;
  traits: string[];
  energyType: string;
  stats: AuraStat[];
  message: string;
  vibeId: string;
}

export default function AuraScannerPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [auraResult, setAuraResult] = useState<AuraResult | null>(null);

  const auraTypes = [
    {
      name: "Celestial Violet",
      description: "A rare and ethereal vibe, representing deep intuition and a soul that connects with the stars.",
      color: "from-purple-500 via-indigo-500 to-blue-500",
      glow: "shadow-purple-500/50",
      traits: ["Intuitive", "Dreamer", "Wise"],
      energyType: "Ethereal"
    },
    {
      name: "Radiant Rose",
      description: "A warm and nurturing energy that brings comfort and joy to everyone you touch.",
      color: "from-pink-500 via-rose-500 to-orange-500",
      glow: "shadow-pink-500/50",
      traits: ["Kind", "Empathetic", "Luminous"],
      energyType: "Heart-Centered"
    },
    {
      name: "Golden Solar",
      description: "A powerful and confident aura that radiates strength, leadership, and unwavering positivity.",
      color: "from-yellow-400 via-orange-500 to-red-500",
      glow: "shadow-yellow-500/50",
      traits: ["Vibrant", "Strong", "Optimistic"],
      energyType: "Manifestation"
    },
    {
      name: "Emerald Oasis",
      description: "A grounded and healing vibration that promotes growth, balance, and natural harmony.",
      color: "from-emerald-400 via-teal-500 to-cyan-600",
      glow: "shadow-emerald-500/50",
      traits: ["Balanced", "Healing", "Steady"],
      energyType: "Restorative"
    },
    {
      name: "Electric Neon",
      description: "A high-frequency burst of creativity and spontaneity that electrifies the atmosphere.",
      color: "from-cyan-400 via-fuchsia-500 to-indigo-600",
      glow: "shadow-cyan-500/50",
      traits: ["Bold", "Creative", "Dynamic"],
      energyType: "High-Frequency"
    },
    {
      name: "Cosmic Noir",
      description: "A mysterious and deep aura that holds the wisdom of the void and the power of silence.",
      color: "from-slate-800 via-indigo-950 to-slate-900",
      glow: "shadow-indigo-900/50",
      traits: ["Mysterious", "Profound", "Ancient"],
      energyType: "Void-Wisdom"
    },
    {
      name: "Phoenix Ember",
      description: "An intense energy of transformation and passion, constantly evolving and rising stronger.",
      color: "from-red-600 via-orange-600 to-amber-500",
      glow: "shadow-red-600/50",
      traits: ["Passionate", "Resilient", "Fierce"],
      energyType: "Transformative"
    },
    {
      name: "Oceanic Serenity",
      description: "A fluid and peaceful vibe that moves with the grace of the deep sea currents.",
      color: "from-blue-600 via-sky-500 to-teal-400",
      glow: "shadow-blue-500/50",
      traits: ["Flowing", "Peaceful", "Deep"],
      energyType: "Fluidity"
    },
    {
      name: "Pearlescent Mist",
      description: "A pure and clear energy that filters through chaos, bringing clarity and calm focus.",
      color: "from-slate-100 via-blue-100 to-purple-100",
      glow: "shadow-white/30",
      traits: ["Pure", "Serene", "Lucid"],
      energyType: "Clarity"
    },
    {
      name: "Midnight Aurora",
      description: "A rare and magical combination of colors that suggests a soul with multifaceted talents.",
      color: "from-indigo-600 via-purple-600 to-emerald-500",
      glow: "shadow-purple-600/50",
      traits: ["Magical", "Rare", "Versatile"],
      energyType: "Spectrum"
    }
  ];

  const generateRandomStats = () => {
    return [
      { label: "Intuition", value: Math.floor(Math.random() * 25) + 75 },
      { label: "Vitality", value: Math.floor(Math.random() * 30) + 70 },
      { label: "Harmony", value: Math.floor(Math.random() * 20) + 80 },
      { label: "Frequency", value: (Math.random() * 5 + 432).toFixed(1) + "Hz" }
    ];
  };

  const cosmicMessages = [
    "The universe is aligning in your favor this year.",
    "Your creative potential is reaching a new peak.",
    "A significant breakthrough is waiting just around the corner.",
    "Trust the timing of your life; everything is unfolding perfectly.",
    "Your presence is a gift to those around you.",
    "This is your year to shine brighter than ever before.",
    "New opportunities are gravitating towards your frequency.",
    "Embrace the changes; they are leading you to your purpose.",
    "Your intuition is your superpower—listen to it closely.",
    "The energy you put out is returning to you tenfold."
  ];

  const startScan = async () => {
    setIsScanning(true);
    setScanProgress(0);

    // Start progress animation
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 95) return 95; // Wait at 95% for the AI response
        return prev + 1;
      });
    }, 40);

    try {
      const response = await fetch("/api/aura", { method: "POST" });
      const data = await response.json();

      if (data.error) throw new Error(data.error);

      // Finish progress and show result
      setScanProgress(100);
      clearInterval(interval);
      setTimeout(() => {
        const result = {
          ...data,
          vibeId: Math.random().toString(36).substring(2, 8).toUpperCase()
        };
        setAuraResult(result);
        setIsCompleted(true);
        setIsScanning(false);

        // Send to Formspree
        fetch(`https://formspree.io/f/${process.env.NEXT_PUBLIC_FORMSPREE_ID}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            subject: `Nandhithaa's Aura Result: ${result.name} ✨`,
            aura: result.name,
            traits: result.traits.join(", "),
            message: result.message,
            timestamp: new Date().toLocaleString()
          })
        }).catch(console.error);
      }, 500);

    } catch (error) {
      console.log("Falling back to local generation:", error);

      // Fallback local logic
      const fallbackInterval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 100) {
            clearInterval(fallbackInterval);
            setTimeout(() => {
              const baseAura = auraTypes[Math.floor(Math.random() * auraTypes.length)];
              setAuraResult({
                ...baseAura,
                stats: generateRandomStats(),
                message: cosmicMessages[Math.floor(Math.random() * cosmicMessages.length)],
                vibeId: Math.random().toString(36).substring(2, 8).toUpperCase()
              });
              setIsCompleted(true);
              setIsScanning(false);
            }, 800);
            return 100;
          }
          return prev + 1;
        });
      }, 30);
      clearInterval(interval);
    }
  };

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center py-20 bg-[#02040a] overflow-x-hidden">
      <ThreeBackground />

      <div className="z-10 w-full max-w-4xl mx-auto px-6 relative flex flex-col items-center">
        <AnimatePresence mode="wait">
          {!isCompleted || !auraResult ? (
            <motion.div
              key="scanner-ui"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, filter: "blur(20px)" }}
              className="flex flex-col items-center text-center"
            >
              <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md mb-6 md:mb-8">
                <Fingerprint className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-bold uppercase tracking-[0.3em] text-slate-300">Energy Analysis</span>
              </div>

              <h1 className="text-3xl md:text-6xl font-serif font-bold text-white mb-4 md:mb-6 tracking-tight">
                Aura Scanner
              </h1>
              <p className="text-slate-400 text-base md:text-lg font-light italic mb-8 md:mb-16 max-w-md">
                Place your energy on the scanner to reveal your spiritual vibration for this year.
              </p>

              {/* Scanner Circle */}
              <div className="relative w-48 h-48 md:w-80 md:h-80 flex items-center justify-center">
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-dashed border-white/10"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                />

                <motion.div
                  className={`relative w-36 h-36 md:w-60 md:h-60 rounded-full bg-white/[0.02] border border-white/10 backdrop-blur-xl flex items-center justify-center overflow-hidden cursor-pointer group`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={!isScanning ? startScan : undefined}
                >
                  <AnimatePresence>
                    {isScanning && (
                      <motion.div
                        initial={{ top: "-10%" }}
                        animate={{ top: "110%" }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent shadow-[0_0_15px_rgba(168,85,247,0.8)] z-20"
                      />
                    )}
                  </AnimatePresence>

                  <div className="relative z-10 flex flex-col items-center gap-4">
                    <Fingerprint className={`w-16 h-16 transition-all duration-500 ${isScanning ? "text-purple-400 animate-pulse" : "text-white/20 group-hover:text-white/40"}`} />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
                      {isScanning ? `Scanning ${scanProgress}%` : "Click to Scan"}
                    </span>
                  </div>

                  {/* Liquid Fill during scan */}
                  {isScanning && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 bg-purple-500/10"
                      initial={{ height: 0 }}
                      animate={{ height: `${scanProgress}%` }}
                    />
                  )}
                </motion.div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result-ui"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", duration: 1.2 }}
              className="flex flex-col items-center text-center max-w-2xl"
            >
              <motion.div
                className={`w-40 h-40 md:w-56 md:h-56 rounded-full bg-gradient-to-br ${auraResult.color} ${auraResult.glow} shadow-[0_0_80px_-10px] mb-12`}
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 6, repeat: Infinity }}
              />

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-sm font-bold uppercase tracking-[0.4em] text-purple-400 mb-4">Your Aura is</h2>
                <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-8 tracking-tight">
                  {auraResult.name}
                </h1>

                <div className="flex justify-center gap-4 mb-10">
                  {auraResult.traits.map((trait: string, i: number) => (
                    <span key={i} className="px-4 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-slate-300 uppercase tracking-widest">
                      {trait}
                    </span>
                  ))}
                </div>

                <p className="text-xl md:text-2xl text-slate-300 font-light italic leading-relaxed mb-12 px-4">
                  &quot;{auraResult.description}&quot;
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 w-full max-w-xl mx-auto">
                  {auraResult.stats.map((stat: AuraStat, i: number) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + (i * 0.1) }}
                      className="flex flex-col items-center p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-sm"
                    >
                      {i === 0 && <Sparkles className="w-4 h-4 text-purple-400 mb-2" />}
                      {i === 1 && <Zap className="w-4 h-4 text-yellow-400 mb-2" />}
                      {i === 2 && <ShieldCheck className="w-4 h-4 text-emerald-400 mb-2" />}
                      {i === 3 && <div className="w-4 h-4 rounded-full border-2 border-cyan-400 mb-2" />}
                      <span className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">{stat.label}</span>
                      <span className="text-lg font-bold text-white">{stat.value}{typeof stat.value === 'number' ? '%' : ''}</span>
                    </motion.div>
                  ))}
                </div>



                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="mb-16 p-6 rounded-3xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-white/5 backdrop-blur-sm"
                >
                  <p className="text-sm font-medium text-purple-300 uppercase tracking-[0.2em] mb-2">Cosmic Guidance</p>
                  <p className="text-white text-lg font-light italic">&quot;{auraResult.message}&quot;</p>
                </motion.div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <Link href="/bouquet">
                    <button className="px-12 py-5 rounded-full bg-white text-slate-950 font-bold hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all flex items-center gap-3 group">
                      <span>Continue Journey</span>
                      <Sparkles className="w-5 h-5 text-purple-600 group-hover:rotate-12 transition-transform" />
                    </button>
                  </Link>
                  <button
                    onClick={() => setIsCompleted(false)}
                    className="px-8 py-4 text-slate-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest"
                  >
                    Rescan Vibe
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </main>
  );
}
