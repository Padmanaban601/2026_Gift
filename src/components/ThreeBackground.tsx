"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Float, Text } from "@react-three/drei";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { createPRNG } from "@/lib/pureRandom";

function StarBackground() {
  const ref = useRef<THREE.Points>(null!);
  const [sphere] = useState(() => {
    // Detect screen width to reduce points count on mobile devices for performance
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const pointsCount = isMobile ? 1500 : 5000;
    const prng = createPRNG(456);
    const positions = new Float32Array(pointsCount * 3);
    for (let i = 0; i < pointsCount; i++) {
      const theta = 2 * Math.PI * prng();
      const phi = Math.acos(2 * prng() - 1);
      const r = 1.5 * Math.pow(prng(), 0.5);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    return positions;
  });

  const mouse = useRef([0, 0]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current = [
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1
      ];
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 10 + (mouse.current[1] * 0.05);
    ref.current.rotation.y -= delta / 15 + (mouse.current[0] * 0.05);
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#a855f7"
          size={0.002}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
}

function FloatingContent({ name }: { name: string }) {
  const [fontSize, setFontSize] = useState(0.2);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 480) {
        setFontSize(0.08);
      } else if (window.innerWidth < 768) {
        setFontSize(0.12);
      } else {
        setFontSize(0.2);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <Text
        fontSize={fontSize}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        position={[0, 0.3, 0]}
      >
        {name}
      </Text>
    </Float>
  );
}

export default function ThreeBackground({ name }: { name?: string }) {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <StarBackground />
        {name && <FloatingContent name={name} />}
      </Canvas>
    </div>
  );
}
