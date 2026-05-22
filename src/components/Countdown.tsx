"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function Countdown({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();
      let timeLeft: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

      if (difference > 0) {
        timeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }

      return timeLeft;
    };

    const handle = requestAnimationFrame(() => {
      setTimeLeft(calculateTimeLeft());
    });
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => {
      cancelAnimationFrame(handle);
      clearInterval(timer);
    };
  }, [targetDate]);

  const items = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  return (
    <div className="flex gap-3 md:gap-6 justify-center items-center mt-12 mb-8">
      {items.map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            delay: 2.5 + index * 0.1,
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1]
          }}
          className="flex flex-col items-center"
        >
          <div className="group relative">
            {/* Background Glow */}
            <div className="absolute -inset-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative w-16 h-20 md:w-24 md:h-28 flex flex-col items-center justify-center backdrop-blur-2xl bg-white/[0.03] border border-white/10 rounded-[24px] overflow-hidden shadow-[0_4px_24px_-1px_rgba(0,0,0,0.2),inset_0_0_20px_0_rgba(255,255,255,0.02)]">
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={item.value}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="text-3xl md:text-5xl font-serif font-bold text-white tabular-nums tracking-tighter"
                >
                  {String(item.value).padStart(2, "0")}
                </motion.span>
              </AnimatePresence>
              
              {/* Decorative Line */}
              <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-white/[0.03]" />
              
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
            </div>
          </div>
          
          <span className="text-[9px] md:text-[11px] uppercase tracking-[0.3em] text-slate-500 mt-4 font-bold">
            {item.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
