"use client";

/**
 * Orbit Ring Component
 *
 * Renders the orbital path of an asteroid using the `@react-three/drei` Line component.
 * Visualizes the elliptical orbit based on radius, eccentricity, and inclination.
 */

import { Line } from "@react-three/drei";
import { useMemo } from "react";

interface OrbitRingProps {
  radius: number;
  eccentricity?: number;
  inclination?: number;
  color?: string;
  hazardous?: boolean;
}

export default function OrbitRing({
  radius,
  eccentricity = 0,
  inclination = 0,
  color = "#ffffff",
  hazardous = false,
}: OrbitRingProps) {
  const points = useMemo(() => {
    const pts: [number, number, number][] = [];
    const segments = 128;
    const a = radius;
    const b = radius * (1 - eccentricity);

    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const x = a * Math.cos(angle);
      const z = b * Math.sin(angle);
      const y = z * Math.sin(inclination);
      const zFinal = z * Math.cos(inclination);
      pts.push([x, y, zFinal]);
    }

    return pts;
  }, [radius, eccentricity, inclination]);

  return (
    <Line
      points={points}
      color={hazardous ? "#ff4444" : color}
      lineWidth={hazardous ? 1.5 : 0.8}
      transparent
      opacity={hazardous ? 0.5 : 0.2}
      depthWrite={false}
    />
  );
}
