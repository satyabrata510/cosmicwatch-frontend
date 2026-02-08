/**
 * Explore Page
 *
 * Provides an interactive 3D visualization of Near-Earth Object orbits
 * using NASA JPL data and React Three Fiber.
 */

import ExploreShell from "@/components/explore/ExploreShell";

export const metadata = {
  title: "3D Orbit Explorer — Cosmic Watch",
  description:
    "Interactive 3D visualization of Near-Earth Object orbits using NASA data and Three.js",
};

export default function ExplorePage() {
  return <ExploreShell />;
}
