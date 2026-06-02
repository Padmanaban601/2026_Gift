"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PawPrint {
  id: number;
  x: number;
  y: number;
  rotation: number;
  isLeft: boolean;
}

const PawIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 512 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M256 224c-53 0-96-43-96-96s43-96 96-96 96 43 96 96-43 96-96 96zm-134.4 32C68.3 256 24 213 24 160s44.3-96 97.6-96 97.6 43 97.6 96-44.3 96-97.6 96zm268.8 0c-53.3 0-97.6-43-97.6-96s44.3-96 97.6-96 97.6 43 97.6 96-44.3 96-97.6 96zM256 512c-74.4 0-138.8-38.3-178.6-96.5-12.8-18.7-20.2-40.8-21.2-64.2-.8-18.2 2-36.2 8.2-53.3 12.3-33.8 34.6-62.1 63.6-80.4 20-12.6 43-20.9 67-24.3 19.3-2.7 39.5-3.6 61-.6 21.5-3 41.7-2.1 61 .6 24 3.4 47 11.7 67 24.3 29 18.3 51.3 46.6 63.6 80.4 6.2 17.1 9 35.1 8.2 53.3-1 23.4-8.4 45.5-21.2 64.2-39.8 58.2-104.2 96.5-178.6 96.5z" />
  </svg>
);

export default function PawPrintCursor() {
  const [paws, setPaws] = useState<PawPrint[]>([]);
  const nextId = useRef(0);
  const lastPos = useRef({ x: 0, y: 0 });
  const isLeft = useRef(true);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      
      const dx = clientX - lastPos.current.x;
      const dy = clientY - lastPos.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Spawn a new paw print every 40 pixels moved
      if (distance > 40) {
        // Calculate rotation based on movement direction
        const angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90; // Add 90 so paws face forward
        
        const newPaw: PawPrint = {
          id: nextId.current++,
          x: clientX,
          y: clientY,
          rotation: angle,
          isLeft: isLeft.current,
        };

        setPaws((prev) => [...prev.slice(-19), newPaw]); // Keep max 20 to avoid lag
        
        lastPos.current = { x: clientX, y: clientY };
        isLeft.current = !isLeft.current; // Alternate left/right paw
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Periodically clean up old paws
  useEffect(() => {
    const interval = setInterval(() => {
      setPaws((prev) => {
        if (prev.length > 0) {
          return prev.slice(1);
        }
        return prev;
      });
    }, 400);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[99] overflow-hidden hidden md:block">
      <AnimatePresence>
        {paws.map((paw) => {
          // Offset slightly perpendicular to the direction of movement to simulate left/right steps
          const offsetDist = 12;
          const rad = (paw.rotation - 90) * (Math.PI / 180);
          const offsetX = paw.isLeft ? Math.cos(rad - Math.PI/2) * offsetDist : Math.cos(rad + Math.PI/2) * offsetDist;
          const offsetY = paw.isLeft ? Math.sin(rad - Math.PI/2) * offsetDist : Math.sin(rad + Math.PI/2) * offsetDist;

          return (
            <motion.div
              key={paw.id}
              initial={{ opacity: 0.6, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute text-pink-400/60 drop-shadow-[0_0_8px_rgba(236,72,153,0.5)]"
              style={{
                left: paw.x + offsetX,
                top: paw.y + offsetY,
                transform: `translate(-50%, -50%) rotate(${paw.rotation}deg)`,
                width: "20px",
                height: "20px",
              }}
            >
              <PawIcon className="w-full h-full" />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
