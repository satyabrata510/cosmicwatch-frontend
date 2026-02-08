"use client";

/**
 * 3D Earth Component
 *
 * Renders a rotating 3D Earth sphere with a day map texture.
 * Serves as the central anchor for the orbit visualization.
 */

import { useFrame, useLoader } from "@react-three/fiber";
import { useRef } from "react";
import type { Mesh } from "three";
import { TextureLoader } from "three";

export default function Earth() {
  const meshRef = useRef<Mesh>(null);
  const dayMap = useLoader(TextureLoader, "/textures/earth_daymap.jpg");

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial map={dayMap} roughness={0.8} metalness={0.1} />
    </mesh>
  );
}
