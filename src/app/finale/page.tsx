"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ThreeBackground from "@/components/ThreeBackground";
import { Lock, Fingerprint, ShieldCheck, Gift } from "lucide-react";
import Link from "next/link";

export default function FinalePage() {
  const [isLocked, setIsLocked] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const birthdayDate = new Date("2026-06-06T00:00:00").getTime();

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = birthdayDate - now;

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [birthdayDate]);

  const startScan = () => {
    setIsScanning(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 2;
      setScanProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsLocked(false);
          setIsScanning(false);
          // Send notification
          fetch(`https://formspree.io/f/${process.env.NEXT_PUBLIC_FORMSPREE_ID}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              subject: "Aditi unlocked the Vault! 🔐",
              message: "Aditi successfully scanned her fingerprint and unlocked the final secret.",
              timestamp: new Date().toLocaleString()
            })
          }).catch(console.error);
        }, 500);
      }
    }, 50);
  };

  return (
    <main className="relative h-screen bg-[#02040a] flex flex-col items-center justify-center pt-16 md:pt-24 pb-20 overflow-hidden px-6">
      <ThreeBackground />
      
      <div className="z-10 w-full max-w-4xl mx-auto relative">
        <AnimatePresence mode="wait">
          {isLocked ? (
            <motion.div
              key="locked"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
              className="flex flex-col items-center text-center"
            >
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-white/[0.02] border border-white/10 backdrop-blur-2xl flex items-center justify-center mb-12 relative group"
              >
                <div className="absolute inset-0 rounded-full bg-purple-500/10 blur-2xl group-hover:bg-purple-500/20 transition-all" />
                <Lock className="w-12 h-12 md:w-16 md:h-16 text-white/40" />
              </motion.div>

              <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 tracking-tight">
                The Future Vault
              </h1>
              <p className="text-slate-400 text-lg font-light italic mb-12 max-w-md">
                This is a digital time capsule. It contains the final secret, locked until your special day.
              </p>

              {/* Countdown */}
              <div className="grid grid-cols-4 gap-4 md:gap-8 mb-16 w-full max-w-xl">
                {Object.entries(timeLeft).map(([label, value]) => (
                  <div key={label} className="flex flex-col items-center">
                    <span className="text-3xl md:text-5xl font-mono font-bold text-white mb-1">
                      {value.toString().padStart(2, '0')}
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-bold">{label}</span>
                  </div>
                ))}
              </div>

              {/* Biometric Trigger */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startScan}
                disabled={isScanning}
                className="relative group overflow-hidden px-12 py-5 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-xl flex items-center gap-4 transition-all hover:bg-white/5 active:bg-white/10"
              >
                <div className="relative">
                  <Fingerprint className={`w-8 h-8 ${isScanning ? "text-purple-400 animate-pulse" : "text-white/40 group-hover:text-white/60"}`} />
                  {isScanning && (
                    <motion.div 
                      initial={{ top: 0 }}
                      animate={{ top: "100%" }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="absolute left-0 right-0 h-0.5 bg-purple-500 shadow-[0_0_10px_purple]"
                    />
                  )}
                </div>
                <div className="text-left">
                  <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Identity Verification</p>
                  <p className="text-white font-bold tracking-wide">
                    {isScanning ? `Scanning ${scanProgress}%` : "Scan to Authenticate"}
                  </p>
                </div>
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="unlocked"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center text-center"
            >
              <div className="w-24 h-24 bg-gradient-to-tr from-emerald-400 to-cyan-500 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.4)] mb-8">
                <ShieldCheck className="w-12 h-12 text-white" />
              </div>
              
              <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 tracking-tight">
                Identity Verified
              </h1>
              
              <div className="p-8 md:p-12 rounded-[40px] bg-white/[0.03] border border-white/10 backdrop-blur-2xl max-w-2xl w-full mb-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Gift className="w-32 h-32 text-white" />
                </div>
                
                <p className="text-2xl md:text-3xl text-white font-serif leading-relaxed mb-8">
                  &quot;The greatest gift is not what&apos;s inside the vault, but the journey you take to get there.&quot;
                </p>
                <p className="text-slate-400 text-lg font-light italic leading-relaxed">
                  Aditi, you&apos;ve completed the digital journey. Your future is as bright as the stars you connected and as vibrant as the aura we scanned. 
                  <br/><br/>
                  On June 6th, return here. Something more awaits.
                </p>
              </div>

              <div className="flex gap-6">
                <Link href="/">
                    <button className="px-10 py-4 rounded-full bg-white text-slate-950 font-bold hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all">
                        Back to Home
                    </button>
                </Link>
                <button 
                    onClick={() => setIsLocked(true)}
                    className="px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white/50 hover:text-white transition-all font-bold uppercase text-xs tracking-widest"
                >
                    Relock Vault
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Decorative Glows */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[20%] left-[-10%] w-[50%] h-[50%] bg-purple-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[50%] bg-cyan-600/5 rounded-full blur-[120px]" />
      </div>
    </main>
  );
}
