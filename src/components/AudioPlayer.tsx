"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Music, Music4 } from "lucide-react";
import { usePathname } from "next/navigation";
import { useApp } from "./ClientLayout";

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { isUnlocked } = useApp();
  const pathname = usePathname();

  // Map each page/section to its designated audio track
  const getAudioSrc = (path: string): string => {
    if (path === "/") {
      return "/assets/home_instrumental.m4a";
    }
    if (path === "/message" || path === "/cake") {
      return "/assets/_Raja_Rani_Happy_Birthday_Dialogue_Ringtone_(by Fringster.com).mp3";
    }
    if (path === "/constellation") {
      return "/assets/AUD-20260604-WA0001_.mp3";
    }
    if (path === "/aura") {
      return "/assets/AUD-20260604-WA0002_.mp3";
    }
    if (path === "/bouquet") {
      return "/assets/AUD-20260605-WA0000_.mp3";
    }
    if (path === "/typography") {
      return "/assets/AUD-20260605-WA0001_.mp3";
    }
    if (path.startsWith("/experience/")) {
      return "/assets/AUD-20260605-WA0002_.mp3";
    }
    // remaining pages (/finale, /qna)
    return "/assets/AUD-20260605-WA0003_.mp3";
  };

  const currentSrc = getAudioSrc(pathname);

  // Initialize and handle track switching dynamically when pathname changes
  useEffect(() => {
    if (typeof window === "undefined" || !isUnlocked) return;

    if (audioRef.current) {
      const isSameSrc = audioRef.current.src.endsWith(encodeURI(currentSrc)) || audioRef.current.src.endsWith(currentSrc);
      if (isSameSrc) {
        if (isPlaying && audioRef.current.paused) {
          audioRef.current.play().catch(err => console.log("Playback failed:", err));
        }
        return;
      }
      audioRef.current.pause();
    }

    if (!currentSrc) {
      audioRef.current = null;
      return;
    }

    const newAudio = new Audio(currentSrc);
    newAudio.loop = true;
    newAudio.volume = 0.8;
    audioRef.current = newAudio;

    if (isPlaying) {
      newAudio.play().catch(err => console.log("Playback failed on track switch:", err));
    }
  }, [currentSrc, isUnlocked, isPlaying]);

  // Attempt autoplay when unlocked or when switching pages
  useEffect(() => {
    if (isUnlocked && audioRef.current && audioRef.current.paused) {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.log("Autoplay prevented:", err);
        });
    }
  }, [isUnlocked, currentSrc]);

  // Clean up audio playback on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(err => console.log("Playback failed:", err));
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Do not render the player until the app is unlocked, and hide it on pages without a track
  if (!isUnlocked || !currentSrc) return null;

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
