"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "./ClientLayout";
import { LogOut, Heart, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const { logout } = useApp();
  const pathname = usePathname();
  const router = useRouter();

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    if (pathname === '/cake') {
      router.push('/message');
    } else if (pathname === '/qna') {
      router.push('/finale');
    } else if (pathname === '/finale') {
      router.push('/experience/rain');
    } else if (pathname === '/experience/rain') {
      router.push('/experience/zen');
    } else if (pathname === '/experience/zen') {
      router.push('/experience/lantern');
    } else if (pathname === '/experience/lantern') {
      router.push('/typography');
    } else if (pathname === '/typography') {
      router.push('/bouquet');
    } else if (pathname === '/bouquet') {
      router.push('/aura');
    } else if (pathname === '/aura') {
      router.push('/constellation');
    } else if (pathname === '/constellation') {
      router.push('/cake');
    } else if (pathname === '/message') {
      router.push('/');
    } else {
      router.back();
    }
  };

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-[60] py-4 sm:py-6"
    >
      {/* Mobile Back Button (Absolute Left) */}
      <AnimatePresence>
        {pathname !== "/" && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleBack}
            className="md:hidden absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md text-slate-300 hover:text-white transition-all duration-300 z-20"
          >
            <ArrowLeft className="w-4 h-4" />
          </motion.button>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 relative w-full h-[40px]">
        
        {/* Desktop Left Section (Flex) & Mobile Logo (Centered) */}
        <div className="flex items-center gap-3 sm:gap-4 absolute left-1/2 -translate-x-1/2 md:static md:transform-none z-10">
          
          {/* Desktop Back Button */}
          <AnimatePresence>
            {pathname !== "/" && (
              <motion.button
                initial={{ opacity: 0, width: 0, scale: 0.8, marginRight: 0 }}
                animate={{ opacity: 1, width: "auto", scale: 1, marginRight: 8 }}
                exit={{ opacity: 0, width: 0, scale: 0.8, marginRight: 0 }}
                whileHover={{ scale: 1.1, x: -2 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleBack}
                className="hidden md:flex p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md text-slate-300 hover:text-white transition-all duration-300 overflow-hidden"
              >
                <ArrowLeft className="w-5 h-5 flex-shrink-0" />
              </motion.button>
            )}
          </AnimatePresence>
          <Link href="/" className="group flex items-center gap-2 sm:gap-3">
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="p-2 sm:p-2.5 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-white/10 backdrop-blur-xl shadow-lg shadow-purple-500/10"
            >
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-white fill-white/10 group-hover:fill-pink-500 transition-all duration-500" />
            </motion.div>
            <div className="relative flex items-center">
              <span className="text-white font-serif font-bold tracking-tight text-base sm:text-lg leading-none">For You</span>
              <span className="absolute top-full left-0 text-[9px] sm:text-[10px] text-purple-400 font-bold uppercase tracking-widest mt-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Magic Inside</span>
            </div>
          </Link>
        </div>

        <div className="flex items-center ml-auto z-10">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={logout}
            className="flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-white/[0.03] hover:bg-red-500/10 border border-white/5 hover:border-red-500/20 text-slate-400 hover:text-red-400 transition-all duration-300 group"
          >
            <span className="hidden sm:block text-[10px] sm:text-xs font-bold uppercase tracking-widest">Exit</span>
            <div className="p-1 sm:p-1.5 rounded-md sm:rounded-lg bg-white/5 group-hover:bg-red-500/20">
              <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
}
