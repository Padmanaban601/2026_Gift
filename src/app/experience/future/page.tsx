"use client";

import { motion } from "framer-motion";
import ThreeBackground from "@/components/ThreeBackground";
import { useEffect } from "react";
import { Newspaper, Calendar, TrendingUp, Award, Globe, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

const headlines = [
  {
    category: "GLOBAL IMPACT",
    title: "Aditi Named 'Person of the Year' for Extraordinary Leadership",
    date: "June 6, 2030",
    description: "The world celebrates the visionary achievements of Aditi, whose innovations have transformed millions of lives.",
    icon: Globe,
    color: "text-blue-400"
  },
  {
    category: "LIFESTYLE",
    title: "The 'Aditi Smile' Becomes a Universal Symbol of Positivity",
    date: "May 12, 2032",
    description: "Scientific studies confirm that a single smile from Aditi can brighten even the darkest of days.",
    icon: Sparkles,
    color: "text-pink-400"
  },
  {
    category: "ACHIEVEMENT",
    title: "Aditi Receives Lifetime Excellence Award for Kindness",
    date: "January 24, 2035",
    description: "In a grand ceremony, Aditi was recognized for her unwavering commitment to making the world a kinder place.",
    icon: Award,
    color: "text-purple-400"
  }
];

export default function FuturePage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8 }
    }
  };

  return (
    <main className="relative min-h-screen bg-[#02040a] pt-20 md:pt-32 pb-24 px-6 overflow-x-hidden">
      <ThreeBackground />
      
      <div className="z-10 w-full max-w-5xl mx-auto relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 border-b border-white/10 pb-12">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
            >
                <div className="flex items-center gap-3 text-purple-400 font-bold tracking-[0.4em] uppercase text-xs mb-4">
                    <Newspaper className="w-5 h-5" />
                    <span>The Future Gazette</span>
                </div>
                <h1 className="text-5xl md:text-8xl font-serif font-bold text-white tracking-tighter">
                    June 6, 2030
                </h1>
            </motion.div>
            
            <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-right"
            >
                <p className="text-slate-400 font-light italic text-lg md:text-xl max-w-xs">
                    "Predicting the greatness that already exists within you."
                </p>
            </motion.div>
        </div>

        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
            {headlines.map((item, i) => (
                <motion.div
                    key={i}
                    variants={itemVariants}
                    className="group relative p-8 rounded-[32px] bg-white/[0.02] border border-white/10 backdrop-blur-xl hover:bg-white/[0.05] transition-all hover:-translate-y-2"
                >
                    <div className={`p-3 rounded-2xl bg-white/[0.03] border border-white/5 w-fit mb-6 ${item.color}`}>
                        <item.icon className="w-6 h-6" />
                    </div>
                    
                    <span className="text-[10px] font-bold tracking-[0.3em] text-slate-500 uppercase mb-4 block">
                        {item.category}
                    </span>
                    
                    <h2 className="text-2xl font-serif font-bold text-white mb-4 leading-tight group-hover:text-purple-300 transition-colors">
                        {item.title}
                    </h2>
                    
                    <p className="text-slate-400 font-light text-sm leading-relaxed mb-8">
                        {item.description}
                    </p>
                    
                    <div className="flex items-center gap-2 text-[10px] font-mono text-slate-600 border-t border-white/5 pt-6">
                        <Calendar className="w-3 h-3" />
                        <span>ESTABLISHED FUTURE REALITY</span>
                    </div>
                </motion.div>
            ))}

            {/* Main Feature Card */}
            <motion.div
                variants={itemVariants}
                className="md:col-span-2 lg:col-span-3 p-8 md:p-12 rounded-[40px] bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-white/10 backdrop-blur-2xl relative overflow-hidden group"
            >
                <div className="relative z-10">
                    <div className="flex items-center gap-2 text-pink-400 font-bold text-xs uppercase tracking-widest mb-6">
                        <TrendingUp className="w-4 h-4" />
                        <span>Analysis</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-8 max-w-2xl leading-tight">
                        Aditi's Trajectory: Infinite Potential Meets Unmatched Kindness.
                    </h2>
                    <p className="text-xl text-slate-300 font-light max-w-3xl leading-relaxed mb-12 italic">
                        "The data is clear. Aditi's impact on the world is exponential. Every person she meets is left better than before. The future is not just bright; it is Aditi-shaped."
                    </p>
                    
                    <Link href="/finale">
                        <button className="px-12 py-5 rounded-full bg-white text-slate-950 font-bold hover:shadow-[0_0_50px_rgba(255,255,255,0.3)] transition-all flex items-center gap-3">
                            <span>Ready for the Finale</span>
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </Link>
                </div>
                
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Sparkles className="w-64 h-64 text-white" />
                </div>
            </motion.div>
        </motion.div>

        <div className="mt-24 text-center">
            <p className="text-slate-500 text-[10px] uppercase tracking-[0.5em] font-bold">End of Future Report</p>
        </div>
      </div>
    </main>
  );
}
