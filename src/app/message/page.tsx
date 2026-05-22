"use client";

import { motion } from "framer-motion";
import ThreeBackground from "@/components/ThreeBackground";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function MessagePage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5, type: "spring" as const },
    },
  };

  return (
    <main className="relative min-h-screen flex flex-col items-center pt-20 md:pt-32 pb-24 px-6 bg-[#02040a] overflow-x-hidden">
      {/* Noise Texture Replacement */}
      <div className="fixed inset-0 z-50 opacity-[0.03] pointer-events-none bg-[url('data:image/svg+xml,%3Csvg%20viewBox%3D%220%200%20200%20200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cfilter%20id%3D%22noiseFilter%22%3E%3CfeTurbulence%20type%3D%22fractalNoise%22%20baseFrequency%3D%220.65%22%20numOctaves%3D%223%22%20stitchTiles%3D%22stitch%22%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20filter%3D%22url(%23noiseFilter)%22%2F%3E%3C%2Fsvg%3E')]" />
      
      <ThreeBackground />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="z-10 w-full max-w-3xl mx-auto relative"
      >
        {/* Subtle Glow Behind Text */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-xl h-[500px] bg-gradient-to-b from-purple-500/10 to-pink-500/10 rounded-full blur-[100px] -z-10 pointer-events-none" />
        
        <motion.div variants={itemVariants} className="text-center mb-20">
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md mb-8">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-slate-300">A Personal Note</span>
            <Sparkles className="w-4 h-4 text-pink-400" />
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-4 tracking-tight [text-shadow:_0_0_20px_var(--theme-glow)]">
            Happy Birthday
          </h1>
          <h2 className="text-2xl md:text-3xl font-serif text-pink-300/90 mb-6 tracking-wide [text-shadow:_0_0_15px_var(--theme-glow)]">
            இனிய பிறந்தநாள் வாழ்த்துக்கள்
          </h2>
        </motion.div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-2 md:-left-12 top-4 bottom-4 w-[1px] bg-gradient-to-b from-transparent via-purple-500/30 to-transparent hidden sm:block" />
          
          <div className="space-y-16 text-lg md:text-2xl text-slate-300 font-light leading-relaxed px-4 sm:px-0">
            <motion.div variants={itemVariants} className="relative group">
              <span className="absolute left-[-21px] md:left-[calc(-3rem-5px)] top-3 w-2.5 h-2.5 rounded-full bg-purple-500/50 border border-purple-400/50 hidden sm:block group-hover:scale-150 group-hover:bg-purple-400 transition-all duration-300 shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
              <p>
                Wishing a very Happy Birthday to someone with the brightest smile and the most wonderful character. 
                It&apos;s a joy to celebrate you and the amazing person you are today.
              </p>
            </motion.div>
            <motion.div variants={itemVariants} className="relative group">
              <span className="absolute left-[-21px] md:left-[calc(-3rem-5px)] top-3 w-2.5 h-2.5 rounded-full bg-pink-500/50 border border-pink-400/50 hidden sm:block group-hover:scale-150 group-hover:bg-pink-400 transition-all duration-300 shadow-[0_0_10px_rgba(236,72,153,0.5)]" />
              <p>
                Your smile has a magical way of lighting up everything around you—keep it shining bright today and forever.
              </p>
            </motion.div>
            <motion.div variants={itemVariants} className="relative group">
              <span className="absolute left-[-21px] md:left-[calc(-3rem-5px)] top-3 w-2.5 h-2.5 rounded-full bg-purple-500/50 border border-purple-400/50 hidden sm:block group-hover:scale-150 group-hover:bg-purple-400 transition-all duration-300 shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
              <p>
                May this year bring you infinite joy, success, and the same beautiful light you bring to everyone around you.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="relative group">
              <span className="absolute left-[-21px] md:left-[calc(-3rem-5px)] top-3 w-2.5 h-2.5 rounded-full bg-purple-500/50 border border-purple-400/50 hidden sm:block group-hover:scale-150 group-hover:bg-purple-400 transition-all duration-300 shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
              <p className="text-xl md:text-2xl text-pink-200/90 leading-relaxed">
                உன் அழகான புன்னகையும் நல்ல குணமும் எப்பொழுதும் மாறாமல் இருக்கட்டும்.
              </p>
            </motion.div>
          </div>
        </div>

        <motion.div variants={itemVariants} className="mt-32 text-center pb-20">
          <p className="text-2xl md:text-3xl font-serif text-white/90 italic mb-8">Warmest wishes,</p>
          <div className="flex justify-center items-center gap-6">
            <div className="w-16 h-[1px] bg-gradient-to-r from-transparent to-white/30" />
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sparkles className="w-8 h-8 text-pink-500 drop-shadow-[0_0_15px_rgba(236,72,153,0.5)]" />
            </motion.div>
            <div className="w-16 h-[1px] bg-gradient-to-l from-transparent to-white/30" />
          </div>
          
          <div className="mt-20">
             <Link href="/qna" className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-slate-300 hover:text-white group hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                <span className="text-sm tracking-[0.2em] uppercase font-bold">One More Thing</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
             </Link>
          </div>
        </motion.div>
      </motion.div>

      {/* Luxury Background Layers */}
      <div className="fixed inset-0 pointer-events-none -z-20">
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute top-[20%] left-[-10%] w-[60%] h-[60%] bg-purple-600/10 rounded-full blur-[160px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 18, repeat: Infinity, delay: 2 }}
          className="absolute bottom-[20%] right-[-10%] w-[60%] h-[60%] bg-pink-600/10 rounded-full blur-[160px]" 
        />
      </div>
    </main>
  );
}
