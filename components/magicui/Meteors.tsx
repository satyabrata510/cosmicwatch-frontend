"use client";

/**
 * Meteors Effect Component
 *
 * An animated background effect simulating a meteor shower.
 * Adapted from Magic UI.
 */

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface MeteorsProps {
  number?: number;
  className?: string;
}

export default function Meteors({ number = 20, className }: MeteorsProps) {
  const [meteorStyles, setMeteorStyles] = useState<
    Array<{ top: string; left: string; delay: string; duration: string }>
  >([]);

  useEffect(() => {
    const styles = [...Array(number)].map(() => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
      duration: `${Math.random() * 3 + 2}s`,
    }));
    setMeteorStyles(styles);
  }, [number]);

  return (
    <>
      {meteorStyles.map((style, i) => (
        <span
          key={i}
          className={cn(
            "pointer-events-none absolute top-1/2 left-1/2 h-0.5 w-0.5 rotate-[215deg] animate-meteor rounded-full bg-white shadow-[0_0_0_1px_#ffffff10]",
            "before:content-[''] before:absolute before:top-1/2 before:-translate-y-1/2 before:w-[50px] before:h-[1px] before:bg-gradient-to-r before:from-[#6c63ff] before:to-transparent",
            className
          )}
          style={{
            top: style.top,
            left: style.left,
            animationDelay: style.delay,
            animationDuration: style.duration,
          }}
        />
      ))}
    </>
  );
}
