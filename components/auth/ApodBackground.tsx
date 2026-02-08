"use client";

/**
 * Static Background Component
 *
 * Displays a fixed fullscreen space background image with dark overlay and vignette
 * for legibility across all authenticated routes.
 */

export default function SpaceBackground() {
  return (
    <>
      {/* Full-bleed background image */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url(/background/bg-1.jpg)",
        }}
      />
      {/* Dark overlay + vignette for legibility */}
      <div className="fixed inset-0 z-0 bg-black/65" />
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)",
        }}
      />
    </>
  );
}
