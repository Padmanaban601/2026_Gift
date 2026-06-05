"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import ThreeBackground from "@/components/ThreeBackground";
import Link from "next/link";

/* ─────────────────────────────────────────
   Types
───────────────────────────────────────── */
interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  vx: number;
  vy: number;
  rotation: number;
  shape: "circle" | "rect" | "heart" | "star";
}

interface Firework {
  id: number;
  x: number;
  y: number;
  color: string;
}

interface CandleFlame {
  id: number;
  delay: number;
  x: number;
}

/* ─────────────────────────────────────────
   Constants
───────────────────────────────────────── */
const CONFETTI_COLORS = [
  "#f472b6", "#c084fc", "#818cf8", "#34d399",
  "#fbbf24", "#fb7185", "#a78bfa", "#38bdf8",
  "#f9a8d4", "#e879f9", "#facc15", "#4ade80",
];

const CAKE_CANDLE_POSITIONS = [72, 110, 148, 186, 224];

/* ─────────────────────────────────────────
   Sub-components
───────────────────────────────────────── */

/** Animated SVG candle flame */
function CandleFlame({ x, blown, delay }: { x: number; blown: boolean; delay: number }) {
  return (
    <AnimatePresence>
      {!blown && (
        <motion.g
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{ opacity: 1, scaleY: 1 }}
          exit={{ opacity: 0, scaleY: 0, transition: { duration: 0.3 } }}
          style={{ transformOrigin: `${x}px 78px` }}
          transition={{ delay }}
        >
          {/* Outer glow */}
          <motion.ellipse
            cx={x} cy={76} rx={10} ry={14}
            fill="rgba(251,191,36,0.15)"
            animate={{ rx: [10, 14, 10], ry: [14, 18, 14] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut", delay }}
          />
          {/* Inner flame */}
          <motion.path
            d={`M${x},62 C${x + 8},68 ${x + 10},76 ${x},80 C${x - 10},76 ${x - 8},68 ${x},62 Z`}
            fill="url(#flameGrad)"
            animate={{
              d: [
                `M${x},62 C${x+8},68 ${x+10},76 ${x},80 C${x-10},76 ${x-8},68 ${x},62 Z`,
                `M${x},60 C${x+10},67 ${x+8},77 ${x},81 C${x-8},77 ${x-10},67 ${x},60 Z`,
                `M${x},62 C${x+7},69 ${x+9},75 ${x},80 C${x-9},75 ${x-7},69 ${x},62 Z`,
              ]
            }}
            transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut", delay: delay * 0.5 }}
          />
          {/* Core */}
          <motion.ellipse
            cx={x} cy={75} rx={3} ry={4}
            fill="white"
            fillOpacity={0.8}
            animate={{ ry: [4, 6, 4] }}
            transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay }}
          />
        </motion.g>
      )}
    </AnimatePresence>
  );
}

/** SVG Birthday Cake */
function BirthdayCake({
  blown,
  onKnifeComplete,
  knifeCut,
  phase,
}: {
  blown: boolean;
  onKnifeComplete: () => void;
  knifeCut: boolean;
  phase: string;
}) {
  return (
    <svg viewBox="0 55 296 250" className="w-full max-w-[340px] h-auto drop-shadow-2xl mx-auto">
      <defs>
        <linearGradient id="flameGrad" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="40%" stopColor="#f97316" />
          <stop offset="80%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#fef9c3" />
        </linearGradient>
        <linearGradient id="plateGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#e2e8f0" />
          <stop offset="100%" stopColor="#94a3b8" />
        </linearGradient>
        <linearGradient id="tier1Grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fce7f3" />
          <stop offset="100%" stopColor="#fbcfe8" />
        </linearGradient>
        <linearGradient id="tier2Grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f3e8ff" />
          <stop offset="100%" stopColor="#e9d5ff" />
        </linearGradient>
        <linearGradient id="tier3Grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fff1f2" />
          <stop offset="100%" stopColor="#ffe4e6" />
        </linearGradient>
        <linearGradient id="frostGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="white" stopOpacity="0.9" />
          <stop offset="100%" stopColor="white" stopOpacity="0.3" />
        </linearGradient>
        <filter id="softGlow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <clipPath id="cutClip">
          <rect x="0" y="0" width={knifeCut ? "148" : "296"} height="260" />
        </clipPath>
      </defs>

      {/* Plate */}
      <ellipse cx={148} cy={298} rx={130} ry={14} fill="url(#plateGrad)" opacity={0.6} />

      {/* ── TIER 3 (bottom) ── */}
      <rect x={18} y={220} width={260} height={70} rx={8} fill="url(#tier3Grad)" />
      {/* side drips */}
      {[40,80,120,160,200,240].map((dx) => (
        <path key={dx}
          d={`M${dx},220 Q${dx+6},234 ${dx+3},248 Q${dx-3},234 ${dx},220 Z`}
          fill="white" fillOpacity={0.7}
        />
      ))}
      {/* top frosting */}
      <path d="M18,222 Q38,210 58,222 Q78,210 98,222 Q118,210 138,222 Q158,210 178,222 Q198,210 218,222 Q238,210 258,222 Q278,210 278,222" fill="none" stroke="white" strokeWidth={6} strokeOpacity={0.8} />
      {/* dots */}
      {[50,90,130,170,210,250].map((dx) => (
        <circle key={dx} cx={dx} cy={240} r={4} fill="#f472b6" />
      ))}
      {[65,105,145,185,225].map((dx) => (
        <circle key={dx} cx={dx} cy={255} r={3} fill="#c084fc" />
      ))}
      {/* "Happy Birthday" text */}
      <text x={148} y={275} textAnchor="middle" fontFamily="Georgia, serif" fontSize={13} fill="#be185d" fontWeight="bold" letterSpacing={1}>
        Happy Birthday 🎂
      </text>

      {/* ── TIER 2 (middle) ── */}
      <rect x={46} y={155} width={204} height={68} rx={8} fill="url(#tier2Grad)" />
      {[68,108,148,188,228].map((dx) => (
        <path key={dx}
          d={`M${dx},155 Q${dx+5},166 ${dx+2},178 Q${dx-2},166 ${dx},155 Z`}
          fill="white" fillOpacity={0.7}
        />
      ))}
      <path d="M46,157 Q66,145 86,157 Q106,145 126,157 Q146,145 166,157 Q186,145 206,157 Q226,145 246,157 Q250,157 250,157" fill="none" stroke="white" strokeWidth={5} strokeOpacity={0.8} />
      {/* roses */}
      {[80,148,216].map((dx) => (
        <g key={dx}>
          <circle cx={dx} cy={178} r={8} fill="#f9a8d4" />
          <circle cx={dx} cy={178} r={5} fill="#f472b6" />
          <circle cx={dx} cy={178} r={2.5} fill="#be185d" />
        </g>
      ))}
      <text x={148} y={210} textAnchor="middle" fontFamily="Georgia, serif" fontSize={11} fill="#7e22ce" fontStyle="italic">
        Nandhithaa ♡
      </text>

      {/* ── TIER 1 (top) ── */}
      <rect x={84} y={100} width={128} height={58} rx={8} fill="url(#tier1Grad)" />
      {[100,130,160,190].map((dx) => (
        <path key={dx}
          d={`M${dx},100 Q${dx+4},110 ${dx+2},120 Q${dx-2},110 ${dx},100 Z`}
          fill="white" fillOpacity={0.7}
        />
      ))}
      <path d="M84,102 Q104,92 124,102 Q144,92 164,102 Q184,92 204,102 Q212,102 212,102" fill="none" stroke="white" strokeWidth={5} strokeOpacity={0.8} />
      {/* pearls */}
      {[100,120,140,160,180,200].map((dx) => (
        <circle key={dx} cx={dx} cy={130} r={3} fill="white" fillOpacity={0.9} />
      ))}
      <text x={148} y={148} textAnchor="middle" fontFamily="Georgia, serif" fontSize={10} fill="#9d174d">
        ✦ Sweet 21 ✦
      </text>

      {/* ── CANDLES ── */}
      {CAKE_CANDLE_POSITIONS.map((cx, i) => (
        <g key={cx}>
          {/* candle stick */}
          <rect x={cx - 5} y={78} width={10} height={24} rx={3}
            fill={i % 2 === 0 ? "#f472b6" : "#c084fc"} />
          {/* spiral stripe */}
          <line x1={cx - 2} y1={80} x2={cx + 2} y2={100} stroke="white" strokeWidth={1.5} strokeOpacity={0.5} />
          {/* wick */}
          <line x1={cx} y1={78} x2={cx} y2={74} stroke="#374151" strokeWidth={1.5} />
          {/* flame */}
          <CandleFlame x={cx} blown={blown} delay={i * 0.15} />
        </g>
      ))}

      {/* ── KNIFE (animated) ── */}
      <AnimatePresence>
        {phase === "cutting" && (
          <motion.g
            initial={{ x: 80, y: -120, rotate: -35, opacity: 0 }}
            animate={{
              x: [80, 60, 50, 50],
              y: [-120, -10, 60, 100],
              rotate: [-35, -15, 0, 0],
              opacity: [1, 1, 1, 1],
            }}
            transition={{ duration: 1.8, ease: [0.34, 1.56, 0.64, 1], times: [0, 0.3, 0.7, 1] }}
            onAnimationComplete={onKnifeComplete}
          >
            {/* Blade */}
            <polygon
              points="148,60 175,68 175,220 148,215"
              fill="url(#bladeGrad)"
              filter="url(#softGlow)"
            />
            {/* Blade shine */}
            <line x1={155} y1={70} x2={158} y2={215} stroke="white" strokeWidth={2} strokeOpacity={0.5} />
            {/* Handle */}
            <rect x={148} y={56} width={40} height={18} rx={6} fill="#92400e" />
            <rect x={150} y={58} width={36} height={8} rx={3} fill="#b45309" />
            <defs>
              <linearGradient id="bladeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#cbd5e1" />
                <stop offset="50%" stopColor="#f8fafc" />
                <stop offset="100%" stopColor="#94a3b8" />
              </linearGradient>
            </defs>
          </motion.g>
        )}
      </AnimatePresence>

      {/* Cut line effect */}
      <AnimatePresence>
        {knifeCut && (
          <motion.line
            x1={148} y1={100} x2={148} y2={290}
            stroke="white"
            strokeWidth={2}
            strokeOpacity={0}
            strokeDasharray="4 4"
            initial={{ strokeOpacity: 0.8, pathLength: 0 }}
            animate={{ strokeOpacity: [0.8, 0.4, 0], pathLength: 1 }}
            transition={{ duration: 1.2 }}
          />
        )}
      </AnimatePresence>
    </svg>
  );
}

/** Single confetti particle */
function ConfettiParticle({ p }: { p: Particle }) {
  const shapes = {
    circle: <circle cx={0} cy={0} r={p.size / 2} fill={p.color} />,
    rect: <rect x={-p.size / 2} y={-p.size / 2} width={p.size} height={p.size * 0.6} fill={p.color} rx={1} />,
    heart: (
      <path
        d="M0,-4 C4,-8 10,-6 10,0 C10,5 0,12 0,12 C0,12 -10,5 -10,0 C-10,-6 -4,-8 0,-4 Z"
        fill={p.color}
        transform={`scale(${p.size / 20})`}
      />
    ),
    star: (
      <polygon
        points="0,-6 1.8,-1.8 6,-1.8 2.7,1.2 3.7,6 0,3.5 -3.7,6 -2.7,1.2 -6,-1.8 -1.8,-1.8"
        fill={p.color}
        transform={`scale(${p.size / 12})`}
      />
    ),
  };

  return (
    <motion.svg
      width={p.size * 2}
      height={p.size * 2}
      viewBox={`${-p.size} ${-p.size} ${p.size * 2} ${p.size * 2}`}
      style={{ position: "absolute", left: p.x, top: p.y }}
      initial={{ opacity: 1, scale: 1, rotate: p.rotation }}
      animate={{
        x: [0, p.vx * 60, p.vx * 120],
        y: [0, p.vy * 40, p.vy * 120 + 400],
        rotate: [p.rotation, p.rotation + 360 * (Math.random() > 0.5 ? 1 : -1)],
        opacity: [1, 1, 0],
        scale: [1, 1.2, 0.8],
      }}
      transition={{ duration: 2.5 + Math.random() * 1.5, ease: "easeIn" }}
    >
      {shapes[p.shape]}
    </motion.svg>
  );
}

/** Firework burst */
function FireworkBurst({ fw }: { fw: Firework }) {
  const rays = Array.from({ length: 12 }, (_, i) => i);
  return (
    <motion.div
      style={{ position: "absolute", left: fw.x, top: fw.y }}
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 1.2, delay: 0.3 }}
    >
      {rays.map((i) => {
        const angle = (i / 12) * Math.PI * 2;
        const dist = 50 + Math.random() * 40;
        return (
          <motion.div
            key={i}
            style={{
              position: "absolute",
              width: 4,
              height: 4,
              borderRadius: "50%",
              backgroundColor: fw.color,
              boxShadow: `0 0 6px ${fw.color}`,
              left: 0,
              top: 0,
            }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{
              x: Math.cos(angle) * dist,
              y: Math.sin(angle) * dist,
              opacity: 0,
              scale: 0,
            }}
            transition={{ duration: 0.9 + Math.random() * 0.4, ease: "easeOut" }}
          />
        );
      })}
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   Main Page
───────────────────────────────────────── */
export default function CakeCuttingPage() {
  // phases: "idle" → "blowing" → "cutting" → "cut" → "celebrate"
  const [phase, setPhase] = useState<"idle" | "blowing" | "cutting" | "cut" | "celebrate">("idle");
  const [blown, setBlown] = useState(false);
  const [knifeCut, setKnifeCut] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [fireworks, setFireworks] = useState<Firework[]>([]);
  const [wishText, setWishText] = useState("");
  const [showWish, setShowWish] = useState(false);
  const [blowProgress, setBlowProgress] = useState(0);
  const blowTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fireworkTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  let particleCounter = useRef(0);
  let fireworkCounter = useRef(0);

  const wishMessages = useMemo(() => [
    "May all your dreams bloom like flowers 🌸",
    "Wishing you a year full of magic ✨",
    "You deserve every beautiful thing life offers 💖",
    "May happiness follow you everywhere you go 🌟",
    "Here's to another year of being absolutely amazing 🎉",
  ], []);

  /* ── Blow candles ── */
  const startBlowing = () => {
    if (phase !== "idle") return;
    setPhase("blowing");
    let progress = 0;
    blowTimerRef.current = setInterval(() => {
      progress += 4;
      setBlowProgress(progress);
      if (progress >= 100) {
        clearInterval(blowTimerRef.current!);
        setBlown(true);
        setBlowProgress(0);
        setPhase("cutting");
        setWishText(wishMessages[Math.floor(Math.random() * wishMessages.length)]);
      }
    }, 60);
  };

  /* ── Knife lands → trigger confetti ── */
  const onKnifeComplete = () => {
    setKnifeCut(true);
    setPhase("cut");
    spawnConfetti();
    setTimeout(() => {
      setPhase("celebrate");
      setShowWish(true);
      startFireworks();
    }, 800);
  };

  /* ── Spawn confetti ── */
  const spawnConfetti = () => {
    const shapes: Particle["shape"][] = ["circle", "rect", "heart", "star"];
    const newParticles: Particle[] = Array.from({ length: 120 }, () => {
      const id = particleCounter.current++;
      return {
        id,
        x: Math.random() * window.innerWidth,
        y: -20,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        size: 6 + Math.random() * 12,
        vx: (Math.random() - 0.5) * 4,
        vy: 1 + Math.random() * 3,
        rotation: Math.random() * 360,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
      };
    });
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 5000);
  };

  /* ── Fireworks ── */
  const startFireworks = () => {
    fireworkTimerRef.current = setInterval(() => {
      const newFw: Firework = {
        id: fireworkCounter.current++,
        x: Math.random() * window.innerWidth,
        y: Math.random() * (window.innerHeight * 0.6),
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      };
      setFireworks((prev) => [...prev.slice(-20), newFw]);
    }, 400);
    setTimeout(() => {
      clearInterval(fireworkTimerRef.current!);
    }, 8000);
  };

  /* ── Reset ── */
  const reset = () => {
    setPhase("idle");
    setBlown(false);
    setKnifeCut(false);
    setParticles([]);
    setFireworks([]);
    setShowWish(false);
    setBlowProgress(0);
    clearInterval(fireworkTimerRef.current!);
  };

  useEffect(() => {
    return () => {
      clearInterval(blowTimerRef.current!);
      clearInterval(fireworkTimerRef.current!);
    };
  }, []);

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#02040a] px-4 pt-20 pb-10">
      <ThreeBackground />

      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-pink-600/10 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, delay: 2 }}
          className="absolute bottom-1/4 right-1/4 w-1/2 h-1/2 bg-purple-600/10 rounded-full blur-[120px]"
        />
      </div>

      {/* Confetti Layer */}
      <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
        <AnimatePresence>
          {particles.map((p) => (
            <ConfettiParticle key={p.id} p={p} />
          ))}
        </AnimatePresence>
      </div>

      {/* Fireworks Layer */}
      <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
        <AnimatePresence>
          {fireworks.map((fw) => (
            <FireworkBurst key={fw.id} fw={fw} />
          ))}
        </AnimatePresence>
      </div>

      {/* ── Main Content ── */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="z-10 w-full max-w-2xl mx-auto flex flex-col items-center gap-6"
      >
        {/* Title */}
        <AnimatePresence mode="wait">
          {phase === "idle" && (
            <motion.div
              key="title-idle"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md mb-4">
                <span className="text-pink-400 text-lg">🎂</span>
                <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-slate-300">Birthday Celebration</span>
                <span className="text-pink-400 text-lg">🎂</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-3 tracking-tight leading-tight">
                Make a <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">Wish</span>
              </h1>
              <p className="text-slate-400 text-lg font-light italic">
                Blow out the candles & cut the cake, Nandhithaa! 🕯️
              </p>
            </motion.div>
          )}

          {phase === "blowing" && (
            <motion.div
              key="title-blowing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-2">
                Blowing candles...
              </h1>
              <p className="text-slate-400 italic mb-3">Hold on... 🌬️</p>
              {/* Progress bar */}
              <div className="w-64 mx-auto h-2 rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-pink-400 to-purple-500 rounded-full"
                  style={{ width: `${blowProgress}%` }}
                />
              </div>
            </motion.div>
          )}

          {(phase === "cutting" || phase === "cut") && (
            <motion.div
              key="title-cutting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-2">
                {phase === "cutting" ? "✨ Wish granted!" : "🎊 Cutting the Cake!"}
              </h1>
              <p className="text-slate-400 italic">
                {phase === "cutting" ? "Now let's cut the cake..." : "Here comes the celebration!"}
              </p>
            </motion.div>
          )}

          {phase === "celebrate" && (
            <motion.div
              key="title-celebrate"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="text-center"
            >
              <motion.h1
                className="text-5xl md:text-7xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-fuchsia-400 mb-2"
                animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                🎉 Happy Birthday!
              </motion.h1>
              <p className="text-slate-300 text-lg font-light italic">Nandhithaa ♡</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── THE CAKE ── */}
        <div className="relative w-full flex justify-center">
          {/* Plate glow */}
          <motion.div
            animate={phase === "celebrate" ? { opacity: [0.4, 0.8, 0.4] } : { opacity: 0.4 }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 w-72 h-12 bg-pink-500/20 rounded-full blur-2xl"
          />

          {/* Cake container with shake on cut */}
          <motion.div
            animate={knifeCut ? { x: [0, -6, 6, -4, 4, 0], y: [0, -4, 0] } : {}}
            transition={{ duration: 0.4 }}
          >
            <BirthdayCake
              blown={blown}
              onKnifeComplete={onKnifeComplete}
              knifeCut={knifeCut}
              phase={phase}
            />
          </motion.div>

          {/* Sparkles around cake after celebrate */}
          <AnimatePresence>
            {phase === "celebrate" && (
              <>
                {[...Array(8)].map((_, i) => {
                  const angle = (i / 8) * Math.PI * 2;
                  const r = 170;
                  return (
                    <motion.div
                      key={i}
                      className="absolute text-2xl"
                      style={{
                        left: `calc(50% + ${Math.cos(angle) * r}px)`,
                        top: `calc(50% + ${Math.sin(angle) * r * 0.5}px)`,
                      }}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{
                        opacity: [0, 1, 0],
                        scale: [0, 1.4, 0],
                        rotate: [0, 180],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.25,
                        ease: "easeInOut",
                      }}
                    >
                      {["✨", "⭐", "💖", "🌟", "💫", "🎊", "💕", "🌸"][i]}
                    </motion.div>
                  );
                })}
              </>
            )}
          </AnimatePresence>
        </div>

        {/* ── Wish message ── */}
        <AnimatePresence>
          {showWish && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.3 }}
              className="relative max-w-xl w-full px-8 py-6 rounded-[32px] bg-white/[0.04] border border-white/10 backdrop-blur-xl text-center overflow-hidden"
            >
              {/* shimmer */}
              <motion.div
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "linear", delay: 1 }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 pointer-events-none"
              />
              <p className="text-xl md:text-2xl text-white font-serif italic leading-relaxed">
                {wishText}
              </p>
              <div className="mt-4 flex justify-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <motion.span
                    key={i}
                    animate={{ scale: [1, 1.4, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
                    className="text-pink-400 text-lg"
                  >
                    ♥
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── CTA Buttons ── */}
        <div className="flex flex-wrap gap-4 justify-center mt-2">
          <AnimatePresence mode="wait">
            {phase === "idle" && (
              <motion.button
                key="blow-btn"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                onClick={startBlowing}
                className="relative group px-10 py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-lg shadow-[0_0_40px_rgba(236,72,153,0.4)] hover:shadow-[0_0_60px_rgba(236,72,153,0.6)] transition-all overflow-hidden"
              >
                <motion.div
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                />
                <span className="relative z-10 flex items-center gap-2">
                  🕯️ Blow the Candles
                </span>
              </motion.button>
            )}

            {phase === "celebrate" && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full">
                <motion.button
                  key="replay-btn"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={reset}
                  className="px-8 py-3 rounded-2xl bg-white/[0.06] border border-white/10 text-white font-bold backdrop-blur-md hover:bg-white/10 transition-all w-full sm:w-auto"
                >
                  🔄 Celebrate Again!
                </motion.button>
                <Link href="/constellation" passHref legacyBehavior>
                  <motion.a
                    key="next-btn"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.94 }}
                    className="px-8 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold shadow-[0_0_30px_rgba(236,72,153,0.3)] hover:shadow-[0_0_50px_rgba(236,72,153,0.5)] transition-all cursor-pointer text-center w-full sm:w-auto"
                  >
                    ✨ Continue the Journey
                  </motion.a>
                </Link>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Candle counter indicator */}
        <AnimatePresence>
          {!blown && phase === "idle" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              {CAKE_CANDLE_POSITIONS.map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                  className="w-2 h-2 rounded-full bg-amber-400"
                />
              ))}
              <span className="text-slate-500 text-xs ml-1 italic">5 candles burning</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </main>
  );
}
