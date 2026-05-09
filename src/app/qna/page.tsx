"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ThreeBackground from "@/components/ThreeBackground";
import Link from "next/link";
import { ArrowLeft, Sparkles, Smile } from "lucide-react";

const noMessages = [
  "No",
  "Are you sure? 🥺",
  "Wait, really? 🤨",
  "Think about it! 🙄",
  "Another chance... 😤",
  "Nice try! 🏃‍♀️💨",
];

const headingMessages = [
  "Did you like this surprise?",
  "Wait, are you really trying to click No? 😂",
  "Okay, now you're just pressing it on purpose! 🧐",
  "This button is highly illegal to press! 🚨",
  "I'm giving you one last chance to be nice! 🥺",
  "That's it! Catch me if you can! 🏃‍♀️💨",
];

export default function FunQuestionPage() {
  const [noClicks, setNoClicks] = useState(0);
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const [yesClicked, setYesClicked] = useState(false);

  const handleNoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (noClicks < noMessages.length - 1) {
      setNoClicks(noClicks + 1);
    } else {
      moveNoButton();
    }
  };

  const moveNoButton = () => {
    if (yesClicked) return;
    
    // Generate random coordinates to make the button jump away
    // Using a wider range to make it truly unclickable
    const randomX = (Math.random() - 0.5) * 400; 
    const randomY = (Math.random() - 0.5) * 300; 
    
    setNoPosition({ x: randomX, y: randomY });
  };

  const handleNoHover = () => {
    // Only start running away on hover when it reaches the final state
    if (noClicks >= noMessages.length - 1) {
      moveNoButton();
    }
  };

  // The Yes button gets bigger every time she clicks No
  const yesScale = 1 + noClicks * 0.4;

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center py-24 px-6 bg-[#02040a] overflow-hidden">
      <div className="fixed inset-0 z-50 opacity-[0.03] pointer-events-none bg-[url('data:image/svg+xml,%3Csvg%20viewBox%3D%220%200%20200%20200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cfilter%20id%3D%22noiseFilter%22%3E%3CfeTurbulence%20type%3D%22fractalNoise%22%20baseFrequency%3D%220.65%22%20numOctaves%3D%223%22%20stitchTiles%3D%22stitch%22%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20filter%3D%22url(%23noiseFilter)%22%2F%3E%3C%2Fsvg%3E')]" />
      
      <ThreeBackground />

      <div className="z-10 w-full max-w-2xl mx-auto relative text-center">
        <AnimatePresence mode="wait">
          {!yesClicked ? (
            <motion.div
              key="question"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center"
            >
              <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md mb-8">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-bold uppercase tracking-[0.3em] text-slate-300">Just Be Honest</span>
                <Sparkles className="w-4 h-4 text-pink-400" />
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-16 tracking-tight min-h-[120px] flex items-center justify-center">
                {headingMessages[Math.min(noClicks, headingMessages.length - 1)]}
              </h1>

              <div className="relative w-full min-h-[300px] flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
                <motion.button
                  onClick={() => setYesClicked(true)}
                  animate={{ scale: yesScale }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="px-12 py-4 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold text-xl shadow-[0_0_30px_rgba(236,72,153,0.3)] hover:shadow-[0_0_50px_rgba(236,72,153,0.5)] z-20 flex-shrink-0"
                >
                  Yes!
                </motion.button>

                <motion.button
                  animate={noClicks >= noMessages.length - 1 ? { 
                    x: noPosition.x, 
                    y: noPosition.y 
                  } : { x: 0, y: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  onHoverStart={handleNoHover}
                  onClick={handleNoClick}
                  className="px-8 py-4 rounded-full bg-white/5 border border-white/10 text-slate-300 font-bold text-lg backdrop-blur-md hover:bg-white/10 hover:text-white transition-colors z-10 whitespace-nowrap flex-shrink-0"
                >
                  {noMessages[Math.min(noClicks, noMessages.length - 1)]}
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.5, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
              className="flex flex-col items-center"
            >
              <div className="w-24 h-24 mb-8 bg-gradient-to-tr from-pink-400 to-purple-500 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(236,72,153,0.5)]">
                <Smile className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 tracking-tight">
                Yay! I knew it! 🎉
              </h1>
              <p className="text-xl md:text-2xl text-pink-200/90 font-light max-w-md mx-auto leading-relaxed mb-12">
                You have excellent taste. <br/> 
                Keep that beautiful smile going all day!
              </p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onViewportEnter={() => {
                   fetch(`https://formspree.io/f/${process.env.NEXT_PUBLIC_FORMSPREE_ID}`, {
                     method: "POST",
                     headers: { "Content-Type": "application/json" },
                     body: JSON.stringify({
                       subject: "Aditi said YES! 😍",
                       message: "Aditi liked the surprise and clicked Yes!",
                       timestamp: new Date().toLocaleString()
                     })
                   }).catch(console.error);
                }}
                transition={{ delay: 1 }}
              >
                <Link href="/constellation">
                  <button className="px-10 py-4 rounded-full bg-white text-slate-950 font-bold hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all flex items-center gap-3 group">
                    <span>See what the stars say</span>
                    <Sparkles className="w-5 h-5 text-purple-600 group-hover:rotate-12 transition-transform" />
                  </button>
                </Link>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Luxury Background Layers */}
      <div className="fixed inset-0 pointer-events-none -z-20">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute top-[20%] left-[-10%] w-[60%] h-[60%] bg-purple-600/10 rounded-full blur-[160px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 18, repeat: Infinity, delay: 2 }}
          className="absolute bottom-[20%] right-[-10%] w-[60%] h-[60%] bg-pink-600/10 rounded-full blur-[160px]" 
        />
      </div>
    </main>
  );
}
