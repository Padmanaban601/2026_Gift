"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Heart {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  color: string;
  wobble: number;
  rotate: number;
}

const HEART_COLORS = [
  "text-pink-400",
  "text-rose-400",
  "text-fuchsia-400",
  "text-purple-400",
  "text-pink-300",
  "text-rose-300",
];

function HeartSVG({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}

let heartIdCounter = 0;

export default function FloatingHearts() {
  const [hearts, setHearts] = useState<Heart[]>([]);

  useEffect(() => {
    const spawnHeart = () => {
      const id = heartIdCounter++;
      const newHeart: Heart = {
        id,
        x: Math.random() * 100,
        size: Math.random() * 16 + 10, // 10px – 26px
        duration: Math.random() * 8 + 10, // 10s – 18s
        delay: 0,
        opacity: Math.random() * 0.35 + 0.15, // 0.15 – 0.5
        color: HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)],
        wobble: Math.random() * 40 - 20, // -20 to +20 horizontal drift
        rotate: Math.random() * 60 - 30, // -30 to +30 deg rotation
      };

      setHearts((prev) => [...prev, newHeart]);

      // Remove after animation completes
      setTimeout(() => {
        setHearts((prev) => prev.filter((h) => h.id !== id));
      }, (newHeart.duration + 1) * 1000);
    };

    // Spawn hearts continuously at random intervals
    let timeoutId: ReturnType<typeof setTimeout>;
    const scheduleNext = () => {
      const interval = Math.random() * 1200 + 400; // 400ms – 1600ms
      timeoutId = setTimeout(() => {
        spawnHeart();
        scheduleNext();
      }, interval);
    };

    // Initial burst of hearts so screen isn't empty
    for (let i = 0; i < 6; i++) {
      setTimeout(spawnHeart, i * 300);
    }

    scheduleNext();

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <AnimatePresence>
        {hearts.map((heart) => (
          <motion.div
            key={heart.id}
            className={`absolute ${heart.color}`}
            style={{
              left: `${heart.x}%`,
              bottom: "-40px",
              width: heart.size,
              height: heart.size,
              opacity: heart.opacity,
            }}
            initial={{
              y: 0,
              x: 0,
              rotate: 0,
              scale: 0.4,
              opacity: 0,
            }}
            animate={{
              y: [0, -window.innerHeight - 80],
              x: [0, heart.wobble, -heart.wobble * 0.5, heart.wobble * 0.7],
              rotate: [0, heart.rotate, -heart.rotate * 0.5],
              scale: [0.4, 1, 0.9, 0.7],
              opacity: [0, heart.opacity, heart.opacity, 0],
            }}
            transition={{
              duration: heart.duration,
              ease: "easeInOut",
              times: [0, 0.1, 0.85, 1],
            }}
            exit={{ opacity: 0 }}
          >
            <HeartSVG className="w-full h-full drop-shadow-[0_0_6px_rgba(236,72,153,0.6)]" />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
