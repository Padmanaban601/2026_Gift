"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX, Music } from "lucide-react";
import { useApp } from "./ClientLayout";

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { isUnlocked } = useApp();

  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new Audio("/assets/birthday.webm");
      audioRef.current.loop = true;
      audioRef.current.volume = 0.5; // Set volume to 50% for song
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Try to play automatically once the user passes the lock screen
  useEffect(() => {
    if (isUnlocked && audioRef.current && !isPlaying) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch((err) => {
            // Autoplay was prevented by the browser. The user will have to manually click the button.
            console.log("Autoplay prevented:", err);
          });
      }
    }
  }, [isUnlocked]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Do not render the player until the app is unlocked
  if (!isUnlocked) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 1 }}
      className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-[100]"
    >
      <button
        onClick={togglePlay}
        className="group relative flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-white/70 hover:text-white transition-all hover:bg-white/10 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
        title={isPlaying ? "Mute Music" : "Play Music"}
      >
        {isPlaying ? (
          <Music className="w-5 h-5 md:w-6 md:h-6 animate-pulse" />
        ) : (
          <Music className="w-5 h-5 md:w-6 md:h-6 opacity-50" />
        )}
        
        {/* Glow effect when playing */}
        {isPlaying && (
          <span className="absolute inset-0 rounded-full border border-purple-500/50 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]" />
        )}
      </button>
    </motion.div>
  );
}
