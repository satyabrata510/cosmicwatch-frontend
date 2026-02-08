"use client";

/**
 * Auth Header Component
 *
 * Displays the application logo, title, and subtitle.
 * Used at the top of authentication forms (login/signup).
 */

import { motion } from "framer-motion";
import Logo from "@/components/ui/Logo";
import { fadeUp } from "@/lib/motion";

interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

export default function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <motion.div
      className="text-center mb-8"
      initial="hidden"
      animate="visible"
      custom={0}
      variants={fadeUp}
    >
      <div className="flex justify-center mb-5">
        <Logo size="lg" />
      </div>
      <h1 className="text-2xl sm:text-3xl font-bold text-white">{title}</h1>
      <p className="text-sm text-[#a0a0a0] mt-2">{subtitle}</p>
    </motion.div>
  );
}
