"use client";

/**
 * 3D Solar System Scene
 *
 * A 3D scene rendered with React Three Fiber, featuring Earth and orbiting Near-Earth Objects (NEOs).
 * Handles lighting, camera controls, and orbit visualization.
 */

import { Html, OrbitControls, Stars } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useCallback, useMemo } from "react";
import * as THREE from "three";
import type { NeoObject } from "@/types";
import Asteroid from "./Asteroid";
import type { AsteroidData } from "./AsteroidInfoPanel";
import Earth from "./Earth";
import OrbitRing from "./OrbitRing";

// ── Helpers ───────────────────────────────────────────────

/** Map miss distance (km) → scene orbit radius clamped to 3–12 range */
function distToOrbit(missDistKm: number): number {
  // Use log scale so all objects stay visible on screen
  // NEOs range from ~300k km to ~75M km
  const logDist = Math.log10(Math.max(missDistKm, 100_000));
  // log10(100k)=5, log10(75M)=7.87  → map to 3..12
  const t = (logDist - 5) / 2.87;
  return 3 + Math.min(t, 1) * 9;
}

/** Map diameter (m) → scene body size */
function diamToSize(diameterM: number): number {
  return Math.max(0.06, Math.min(0.35, diameterM / 1500));
}

/** Deterministic pseudo-random from string */
function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

// ── Color palette for asteroids ───────────────────────────
const COLORS = [
  "#8B7355", // rocky brown
  "#A0A0A0", // metallic gray
  "#C4A882", // sandy
  "#7B6B5D", // dark brown
  "#9E9E9E", // silver
  "#B8860B", // dark goldenrod
  "#778899", // light slate gray
  "#DAA520", // goldenrod
];

interface SceneProps {
  neos: NeoObject[];
  onSelectAsteroid: (data: AsteroidData) => void;
}

function Scene({ neos, onSelectAsteroid }: SceneProps) {
  // Prepare asteroid data from NEO feed
  const asteroids = useMemo(() => {
    return neos.slice(0, 30).map((neo) => {
      const approach = neo.close_approach_data?.[0];
      const missKm = approach ? parseFloat(approach.miss_distance.kilometers) : 5_000_000;
      const velocity = approach
        ? parseFloat(approach.relative_velocity.kilometers_per_hour)
        : 50000;
      const diamMin = neo.estimated_diameter.meters.estimated_diameter_min;
      const diamMax = neo.estimated_diameter.meters.estimated_diameter_max;
      const avgDiam = (diamMin + diamMax) / 2;

      const h = hashStr(neo.id);
      const orbitRadius = distToOrbit(missKm);
      const speed = 0.1 + (h % 100) / 500; // 0.1–0.3 rad/s
      const angleOffset = ((h % 360) * Math.PI) / 180;
      const inclination = ((h % 30) - 15) * (Math.PI / 180); // ±15°
      const eccentricity = (h % 40) / 100; // 0–0.4
      const color = neo.is_potentially_hazardous_asteroid ? "#ff6b6b" : COLORS[h % COLORS.length];

      return {
        id: neo.id,
        name: neo.name,
        hazardous: neo.is_potentially_hazardous_asteroid,
        orbitRadius,
        speed,
        size: diamToSize(avgDiam),
        color,
        angleOffset,
        inclination,
        eccentricity,
        diameterMin: diamMin,
        diameterMax: diamMax,
        velocity,
        missDistance: missKm,
        approachDate: approach?.close_approach_date ?? "N/A",
      };
    });
  }, [neos]);

  const handleSelect = useCallback(
    (a: (typeof asteroids)[0]) => {
      onSelectAsteroid({
        id: a.id,
        name: a.name,
        hazardous: a.hazardous,
        diameterMin: a.diameterMin,
        diameterMax: a.diameterMax,
        velocity: a.velocity,
        missDistance: a.missDistance,
        approachDate: a.approachDate,
        orbitRadius: a.orbitRadius,
      });
    },
    [onSelectAsteroid]
  );

  return (
    <>
      {/* Lighting — brighter so Earth texture + asteroids are visible */}
      <ambientLight intensity={0.5} />
      <pointLight position={[8, 4, 8]} intensity={3} color="#fff5e0" />
      <pointLight position={[-6, -2, -4]} intensity={0.8} color="#4488ff" />
      <pointLight position={[0, 6, -6]} intensity={0.5} color="#ffffff" />

      {/* Background stars */}
      <Stars radius={100} depth={80} count={4000} factor={3} saturation={0.1} fade speed={0.3} />

      {/* Earth */}
      <Suspense
        fallback={
          <mesh>
            <sphereGeometry args={[1, 16, 16]} />
            <meshBasicMaterial color="#1a3a5c" wireframe />
          </mesh>
        }
      >
        <Earth />
      </Suspense>

      {/* Earth atmosphere glow */}
      <mesh>
        <sphereGeometry args={[1.02, 64, 64]} />
        <meshBasicMaterial color="#4488ff" transparent opacity={0.06} side={THREE.BackSide} />
      </mesh>

      {/* Earth label */}
      <Html position={[0, 1.3, 0]} center distanceFactor={8}>
        <div className="text-[10px] font-display text-blue-400/60 tracking-widest whitespace-nowrap select-none pointer-events-none">
          EARTH
        </div>
      </Html>

      {/* Orbit rings + asteroids */}
      {asteroids.map((a) => (
        <group key={a.id}>
          <OrbitRing
            radius={a.orbitRadius}
            eccentricity={a.eccentricity}
            inclination={a.inclination}
            hazardous={a.hazardous}
          />
          <Asteroid
            orbitRadius={a.orbitRadius}
            speed={a.speed}
            size={a.size}
            color={a.color}
            name={a.name}
            hazardous={a.hazardous}
            angleOffset={a.angleOffset}
            inclination={a.inclination}
            eccentricity={a.eccentricity}
            onSelect={() => handleSelect(a)}
          />
        </group>
      ))}

      {/* Camera controls */}
      <OrbitControls
        enablePan
        enableZoom
        enableRotate
        minDistance={2}
        maxDistance={40}
        autoRotate
        autoRotateSpeed={0.3}
        zoomSpeed={0.8}
      />
    </>
  );
}

interface SolarSystemSceneProps {
  neos: NeoObject[];
  onSelectAsteroid: (data: AsteroidData) => void;
}

export default function SolarSystemScene({ neos, onSelectAsteroid }: SolarSystemSceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 5, 12], fov: 50, near: 0.01, far: 200 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <Scene neos={neos} onSelectAsteroid={onSelectAsteroid} />
    </Canvas>
  );
}
