"use client";
// Last update: 2026-05-09 22:10


import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import ThreeBackground from "@/components/ThreeBackground";
import Link from "next/link";
import { ArrowRight, Sparkles, Stars } from "lucide-react";
import Countdown from "@/components/Countdown";
import { createPRNG } from "@/lib/pureRandom";

export default function Home() {
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const handle = requestAnimationFrame(() => {
      const hours = new Date().getHours();
      if (hours < 12) setGreeting("Good Morning");
      else if (hours < 17) setGreeting("Good Afternoon");
      else setGreeting("Good Evening");
    });
    return () => cancelAnimationFrame(handle);
  }, []);

  const birthdayDate = "2026-06-06T00:00:00";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.5,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1.2,
        ease: "easeOut" as const,
      },
    },
  };

  // Pre-generate micro-hearts using seedable random generator for purity
  const microHearts = useMemo(() => {
    const prng = createPRNG(42);
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: prng() * 100 + "%",
      initialRotate: prng() * 360,
      animateRotate: prng() * 360 + 180,
      duration: prng() * 10 + 20,
      delay: prng() * 20,
    }));
  }, []);

  // Pre-generate balloon positions and animation parameters for purity
  const balloons = useMemo(() => {
    const prng = createPRNG(99);
    return Array.from({ length: 8 }, (_, i) => {
      const isLeft = i < 4;
      const pos = 5 + prng() * 10;
      const initRot = prng() * 20 - 10;
      const rot1 = prng() * 20 - 10;
      const rot2 = prng() * 40 - 20;
      const rot3 = prng() * 20 - 10;
      const duration = 20 + prng() * 10;
      return {
        id: i,
        isLeft,
        pos,
        initRot,
        animateRot: [rot1, rot2, rot3],
        duration,
      };
    });
  }, []);

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center overflow-x-hidden px-6 pt-20 md:pt-32 pb-12 bg-[#02040a]">
      {/* Noise Texture Replacement */}
      <div className="fixed inset-0 z-50 opacity-[0.03] pointer-events-none bg-[url('data:image/svg+xml,%3Csvg%20viewBox%3D%220%200%20200%20200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cfilter%20id%3D%22noiseFilter%22%3E%3CfeTurbulence%20type%3D%22fractalNoise%22%20baseFrequency%3D%220.65%22%20numOctaves%3D%223%22%20stitchTiles%3D%22stitch%22%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20filter%3D%22url(%23noiseFilter)%22%2F%3E%3C%2Fsvg%3E')]" />
      
      <ThreeBackground name="Happy Birthday Aditi" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="z-10 text-center max-w-5xl w-full"
      >
        <motion.div variants={itemVariants} className="flex justify-center mb-8">
          <div className="relative group">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 via-transparent to-pink-500/20 rounded-full blur-2xl opacity-50 group-hover:opacity-100 transition-opacity"
            />
            <div className="relative px-6 py-2 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md flex items-center gap-3">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-300">A Special Journey Awaits</span>
              <Stars className="w-4 h-4 text-pink-400" />
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <h1 className="text-6xl md:text-9xl font-serif font-bold text-white mb-8 tracking-tight leading-[0.9] [text-shadow:_0_0_30px_var(--theme-glow)]">
            {greeting}
          </h1>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          className="relative max-w-2xl mx-auto px-12 py-8 rounded-[40px] bg-white/[0.03] backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]"
        >
          <div className="absolute left-4 top-4 text-6xl text-white/10 font-serif leading-none italic">“</div>
          <p className="text-xl md:text-3xl text-slate-300 font-light italic leading-relaxed mb-0">
            In a world of constant motion, <br className="hidden md:block" />
            your smile is the <span className="text-white [text-shadow:_0_0_15px_var(--theme-glow)]">perfect light</span>.
          </p>
          <div className="absolute right-4 bottom-4 text-6xl text-white/10 font-serif leading-none italic rotate-180">“</div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Countdown targetDate={birthdayDate} />
        </motion.div>

        <motion.div 
          variants={itemVariants}
          className="mt-16"
        >
          <Link href="/message">
            <motion.div
              whileHover="hover"
              className="relative inline-flex items-center gap-4 px-12 py-5 rounded-[24px] bg-white text-slate-950 font-bold overflow-hidden transition-all shadow-[0_20px_50px_rgba(255,255,255,0.1)] hover:shadow-white/20"
            >
              <motion.div 
                variants={{
                  hover: { x: 5 }
                }}
                className="relative z-10 flex items-center gap-3"
              >
                <span className="text-lg">Begin the Experience</span>
                <ArrowRight className="w-5 h-5" />
              </motion.div>
              
              <motion.div 
                variants={{
                  hover: { x: ["-100%", "100%"] }
                }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent -skew-x-12"
              />
            </motion.div>
          </Link>
        </motion.div>
      </motion.div>

      {/* Luxury Background Layers */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.4, 0.3],
          }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute top-[10%] left-[-5%] w-[50%] h-[50%] bg-purple-600/5 rounded-full blur-[160px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{ duration: 18, repeat: Infinity, delay: 2 }}
          className="absolute bottom-[10%] right-[-5%] w-[50%] h-[50%] bg-pink-600/5 rounded-full blur-[160px]" 
        />
      </div>

      {/* Floating Micro-hearts */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        {microHearts.map((heart) => (
          <motion.div
            key={heart.id}
            initial={{ 
              x: heart.x, 
              y: "110%",
              opacity: 0,
              rotate: heart.initialRotate
            }}
            animate={{ 
              y: "-10%",
              opacity: [0, 1, 1, 0],
              rotate: heart.animateRotate
            }}
            transition={{ 
              duration: heart.duration, 
              repeat: Infinity,
              delay: heart.delay,
              ease: "linear"
            }}
            className="absolute"
          >
            <Stars className="w-3 h-3 text-pink-400/30" />
          </motion.div>
        ))}
      </div>

      {/* Elegant Floating Balloons (Framing the sides) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {balloons.map((balloon) => {
          return (
            <motion.div
              key={`balloon-${balloon.id}`}
              style={balloon.isLeft ? { left: `${balloon.pos}%` } : { right: `${balloon.pos}%` }}
              initial={{ 
                y: "120%",
                rotate: balloon.initRot
              }}
              animate={{ 
                y: "-20%",
                x: [0, balloon.isLeft ? 15 : -15, 0],
                rotate: balloon.animateRot
              }}
              whileHover={{ 
                scale: 1.1,
                x: balloon.isLeft ? 40 : -40,
                transition: { duration: 0.5, type: "spring" as const }
              }}
              transition={{ 
                duration: balloon.duration, 
                repeat: Infinity,
                delay: balloon.id * 1.5,
                ease: "linear"
              }}
              className="absolute cursor-pointer z-20"
            >
              <div className="relative">
                  {/* Balloon Body */}
                  <div 
                      className={`w-12 h-16 md:w-16 md:h-20 rounded-[50%_50%_50%_50%_/_40%_40%_60%_60%] shadow-xl backdrop-blur-[2px] border border-white/10 ${
                          balloon.id % 2 === 0 ? 'bg-gradient-to-br from-purple-500/30 to-purple-700/20' : 'bg-gradient-to-br from-pink-500/30 to-pink-700/20'
                      }`}
                  >
                      {/* Glossy Highlight */}
                      <div className="absolute top-3 left-3 w-3 h-5 bg-white/20 rounded-full blur-[2px] rotate-[25deg]" />
                  </div>
                  {/* Balloon Knot */}
                  <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 ${balloon.id % 2 === 0 ? 'bg-purple-500/40' : 'bg-pink-500/40'}`} />
                  {/* Balloon String */}
                  <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[1px] h-24 bg-gradient-to-b from-white/20 to-transparent" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </main>
  );
}
