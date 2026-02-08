"use client";

/**
 * Auth Info Panel
 *
 * A side panel for authentication pages that displays informational facts or tips.
 * Uses a "planet-explorer" aesthetic.
 */

interface AuthInfoPanelProps {
  sections: { heading: string; body: string }[];
}

export default function AuthInfoPanel({ sections }: AuthInfoPanelProps) {
  return (
    <>
      {sections.map((s) => (
        <div key={s.heading}>
          <h2
            className="font-display text-sm text-white/70 tracking-wide"
            style={{ transform: "scaleY(0.85)" }}
          >
            {s.heading}
          </h2>
          <p className="mt-1 leading-relaxed">{s.body}</p>
        </div>
      ))}
    </>
  );
}
