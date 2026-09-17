"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const GOLD = "#f2c969";

function seededDust(index: number, axis: number) {
  const value = Math.sin(index * 12.9898 + axis * 78.233) * 43758.5453;
  return value - Math.floor(value);
}

function GoldDust({ count = 130 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const mouse = useRef({ x: 0, y: 0 });

  const positions = useMemo(() => {
    const array = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      array[i * 3] = (seededDust(i, 1) - 0.5) * 16;
      array[i * 3 + 1] = (seededDust(i, 2) - 0.5) * 9;
      array[i * 3 + 2] = (seededDust(i, 3) - 0.5) * 6;
    }
    return array;
  }, [count]);

  useEffect(() => {
    const onMove = (event: MouseEvent) => {
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame((_, delta) => {
    const points = pointsRef.current;
    if (!points) return;
    // Slow ambient drift plus a gentle lean toward the cursor.
    points.rotation.y += delta * 0.03;
    points.rotation.x = THREE.MathUtils.lerp(
      points.rotation.x,
      mouse.current.y * 0.12,
      0.04,
    );
    points.rotation.z = THREE.MathUtils.lerp(
      points.rotation.z,
      mouse.current.x * 0.06,
      0.04,
    );
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.055}
        color={GOLD}
        transparent
        opacity={0.5}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

/**
 * Decorative WebGL particle field for the hero — floating gold dust with
 * mouse-reactive drift. Rendered only on desktop pointer devices without
 * reduced motion (gated by the parent), lazy-loaded via next/dynamic.
 */
export default function HeroParticles() {
  return (
    <Canvas
      className="pointer-events-none"
      style={{ position: "absolute", inset: 0 }}
      camera={{ position: [0, 0, 6], fov: 50 }}
      dpr={[1, 1.5]}
      gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
      aria-hidden
    >
      <GoldDust />
    </Canvas>
  );
}
