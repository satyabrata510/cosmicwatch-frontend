"use client";

/**
 * 3D Asteroid Component
 *
 * Renders an asteroid in the 3D scene using a GLTF model (based on NASA's Bennu).
 * Handles orbital animation, hazardous highlighting, and user interaction.
 */

import { Html, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const MODEL_PATH = "/models/asteroid_bennu.glb";

interface AsteroidProps {
  /** Semi-major axis (distance from Earth center in scene units) */
  orbitRadius: number;
  /** Orbital speed (radians per second) */
  speed: number;
  /** Asteroid body radius (scale factor) */
  size: number;
  /** Tint color of the asteroid */
  color: string;
  /** Name label */
  name: string;
  /** Is potentially hazardous */
  hazardous?: boolean;
  /** Initial orbital angle offset */
  angleOffset?: number;
  /** Orbit inclination in radians */
  inclination?: number;
  /** Orbit eccentricity 0-0.9 */
  eccentricity?: number;
  /** Selected callback */
  onSelect?: () => void;
}

export default function Asteroid({
  orbitRadius,
  speed,
  size,
  color,
  name,
  hazardous = false,
  angleOffset = 0,
  inclination = 0,
  eccentricity = 0,
  onSelect,
}: AsteroidProps) {
  const groupRef = useRef<THREE.Group>(null);
  const labelRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const angleRef = useRef(angleOffset);

  // Load NASA's Bennu asteroid model
  const { scene } = useGLTF(MODEL_PATH);

  // The raw Bennu model is ~1386 units across (bbox: -693 to +658).
  // NASA's site uses <model-viewer> which auto-normalizes.
  // We replicate that: divide by ~700 to get ~1 unit diameter,
  // then multiply by our `size` prop.
  const MODEL_BBOX_RADIUS = 700;

  // Clone scene so each asteroid instance gets its own copy,
  // and apply color tint material.
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshStandardMaterial({
          color: new THREE.Color(color),
          roughness: 0.85,
          metalness: 0.2,
        });
      }
    });
    return clone;
  }, [scene, color]);

  useFrame((_, delta) => {
    angleRef.current += speed * delta;

    if (groupRef.current) {
      // Elliptical orbit
      const a = orbitRadius;
      const b = orbitRadius * (1 - eccentricity);
      const x = a * Math.cos(angleRef.current);
      const z = b * Math.sin(angleRef.current);

      // Apply inclination
      const y = z * Math.sin(inclination);
      const zFinal = z * Math.cos(inclination);

      groupRef.current.position.set(x, y, zFinal);
      groupRef.current.rotation.x += delta * 0.5;
      groupRef.current.rotation.y += delta * 0.8;
    }

    // Keep glow + label tracking position (but NOT rotation)
    if (groupRef.current) {
      const pos = groupRef.current.position;
      if (glowRef.current) {
        glowRef.current.position.copy(pos);
      }
      if (labelRef.current) {
        labelRef.current.position.set(pos.x, pos.y + Math.max(size, 0.15) * 2 + 0.15, pos.z);
      }
    }
  });

  // Normalize model to unit size, then scale by `size` prop.
  // Ensure minimum visibility at 0.15 scene units.
  const normalizedScale = 1 / MODEL_BBOX_RADIUS;
  const scaleFactor = normalizedScale * Math.max(size, 0.15) * 1.5;

  return (
    <group>
      {/* Hazardous glow */}
      {hazardous && (
        <mesh ref={glowRef}>
          <sphereGeometry args={[Math.max(size, 0.15) * 3, 16, 16]} />
          <meshBasicMaterial color="#ff4444" transparent opacity={0.12} depthWrite={false} />
        </mesh>
      )}

      {/* NASA Bennu asteroid model */}
      <group
        ref={groupRef}
        scale={[scaleFactor, scaleFactor, scaleFactor]}
        onClick={(e) => {
          e.stopPropagation();
          onSelect?.();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "auto";
        }}
      >
        <primitive object={clonedScene} />
      </group>

      {/* Floating name label — tracks position only, no rotation */}
      <group ref={labelRef}>
        <Html center distanceFactor={10} style={{ pointerEvents: "none" }}>
          <div
            className={`whitespace-nowrap select-none text-[9px] font-body tracking-wider px-1.5 py-0.5 rounded-md ${
              hazardous
                ? "text-red-400/80 bg-red-500/10 border border-red-500/20"
                : "text-white/50 bg-white/[0.04] border border-white/[0.06]"
            }`}
          >
            {name.replace(/\(|\)/g, "").trim()}
          </div>
        </Html>
      </group>
    </group>
  );
}

// Pre-load the model so it doesn't block first render
useGLTF.preload(MODEL_PATH);
