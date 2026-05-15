"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Float, Text } from "@react-three/drei";
import { useRef, useState, useMemo, useEffect } from "react";
import * as THREE from "three";

function StarBackground() {
  const ref = useRef<THREE.Points>(null!);
  const [sphere] = useState(() => {
    const positions = new Float32Array(5000 * 3);
    for (let i = 0; i < 5000; i++) {
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 1.5 * Math.pow(Math.random(), 0.5);
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
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <Text
        fontSize={0.2}
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
