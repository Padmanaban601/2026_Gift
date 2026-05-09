"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ThreeBackground from "@/components/ThreeBackground";
import Link from "next/link";
import { ArrowRight, Sparkles, Stars, Heart } from "lucide-react";
import Countdown from "@/components/Countdown";

export default function Home() {
  const [greeting, setGreeting] = useState("");
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const hours = time.getHours();
    if (hours < 12) setGreeting("Good Morning");
    else if (hours < 17) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, [time]);

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

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6 pt-24 pb-12 bg-[#02040a]">
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
          <h1 className="text-6xl md:text-9xl font-serif font-bold text-white mb-8 tracking-tight leading-[0.9]">
            {greeting}, <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 [text-shadow:0_0_30px_rgba(168,85,247,0.4)]">
              Aditi
            </span>
          </h1>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          className="relative max-w-2xl mx-auto"
        >
          <div className="absolute -left-8 -top-4 text-6xl text-white/10 font-serif leading-none italic">“</div>
          <p className="text-xl md:text-3xl text-slate-400 font-light italic leading-relaxed mb-12">
            In a world of constant motion, <br className="hidden md:block" />
            your smile is the <span className="text-white">perfect light</span>.
          </p>
          <div className="absolute -right-8 -bottom-12 text-6xl text-white/10 font-serif leading-none italic rotate-180">“</div>
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
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * 100 + "%", 
              y: "110%",
              opacity: 0,
              rotate: Math.random() * 360
            }}
            animate={{ 
              y: "-10%",
              opacity: [0, 1, 1, 0],
              rotate: Math.random() * 360 + 180
            }}
            transition={{ 
              duration: Math.random() * 10 + 20, 
              repeat: Infinity,
              delay: Math.random() * 20,
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
        {[...Array(8)].map((_, i) => {
          const isLeft = i < 4;
          const sideX = isLeft ? 5 + Math.random() * 10 : 85 + Math.random() * 10;
          
          return (
            <motion.div
              key={`balloon-${i}`}
              style={{ left: `${sideX}%` }}
              initial={{ 
                y: "120%",
                rotate: Math.random() * 20 - 10
              }}
              animate={{ 
                y: "-20%",
                x: [0, isLeft ? 15 : -15, 0],
                rotate: [Math.random() * 20 - 10, Math.random() * 40 - 20, Math.random() * 20 - 10]
              }}
              whileHover={{ 
                scale: 1.1,
                x: isLeft ? 40 : -40,
                transition: { duration: 0.5, type: "spring" as const }
              }}
              transition={{ 
                duration: 20 + Math.random() * 10, 
                repeat: Infinity,
                delay: i * 1.5,
                ease: "linear"
              }}
              className="absolute cursor-pointer z-20"
            >
              <div className="relative">
                  {/* Balloon Body */}
                  <div 
                      className={`w-12 h-16 md:w-16 md:h-20 rounded-[50%_50%_50%_50%_/_40%_40%_60%_60%] shadow-xl backdrop-blur-[2px] border border-white/10 ${
                          i % 2 === 0 ? 'bg-gradient-to-br from-purple-500/30 to-purple-700/20' : 'bg-gradient-to-br from-pink-500/30 to-pink-700/20'
                      }`}
                  >
                      {/* Glossy Highlight */}
                      <div className="absolute top-3 left-3 w-3 h-5 bg-white/20 rounded-full blur-[2px] rotate-[25deg]" />
                  </div>
                  {/* Balloon Knot */}
                  <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 ${i % 2 === 0 ? 'bg-purple-500/40' : 'bg-pink-500/40'}`} />
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
