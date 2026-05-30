"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Music, Music4 } from "lucide-react";
import { usePathname } from "next/navigation";
import { useApp } from "./ClientLayout";

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const homeAudioRef = useRef<HTMLAudioElement | null>(null);
  const journeyAudioRef = useRef<HTMLAudioElement | null>(null);
  const { isUnlocked } = useApp();
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  // Initialize audio files
  useEffect(() => {
    if (typeof window !== "undefined") {
      homeAudioRef.current = new Audio("/assets/_Raja_Rani_Happy_Birthday_Dialogue_Ringtone_(by Fringster.com).mp3");
      homeAudioRef.current.loop = true;
      homeAudioRef.current.volume = 0.8; // Set volume for dialogue visibility

      journeyAudioRef.current = new Audio("/assets/journey.m4a");
      journeyAudioRef.current.loop = true;
      journeyAudioRef.current.volume = 0.8;
    }
    
    return () => {
      if (homeAudioRef.current) {
        homeAudioRef.current.pause();
        homeAudioRef.current = null;
      }
      if (journeyAudioRef.current) {
        journeyAudioRef.current.pause();
        journeyAudioRef.current = null;
      }
    };
  }, []);

  // Handle cross-page audio switching
  useEffect(() => {
    if (!isUnlocked) return;

    const currentAudio = isHomePage ? homeAudioRef.current : journeyAudioRef.current;
    const inactiveAudio = isHomePage ? journeyAudioRef.current : homeAudioRef.current;

    // Stop the inactive audio
    if (inactiveAudio && !inactiveAudio.paused) {
      inactiveAudio.pause();
      inactiveAudio.currentTime = 0;
    }

    // Play the active audio if it should be playing
    if (isPlaying && currentAudio && currentAudio.paused) {
      currentAudio.play().catch(err => console.log("Failed to switch tracks:", err));
    }
  }, [isHomePage, isPlaying, isUnlocked]);

  // Try to play automatically once the user passes the lock screen
  useEffect(() => {
    if (isUnlocked) {
      const activeAudio = isHomePage ? homeAudioRef.current : journeyAudioRef.current;
      if (activeAudio && activeAudio.paused) {
        activeAudio.play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch((err) => {
            // Autoplay was prevented by browser
            console.log("Autoplay prevented:", err);
          });
      }
    }
  }, [isUnlocked, isHomePage]);

  const togglePlay = () => {
    const currentAudio = isHomePage ? homeAudioRef.current : journeyAudioRef.current;
    if (currentAudio) {
      if (isPlaying) {
        currentAudio.pause();
      } else {
        currentAudio.play().catch(err => console.log("Playback failed:", err));
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
          <Music4 className="w-5 h-5 md:w-6 md:h-6 opacity-50" />
        )}
        
        {/* Glow effect when playing */}
        {isPlaying && (
          <span className="absolute inset-0 rounded-full border border-purple-500/50 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]" />
        )}
      </button>
    </motion.div>
  );
}
