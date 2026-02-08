"use client";

/**
 * Auth Footer Link
 *
 * Displays a bottom link for switching between login and signup pages.
 */

import { motion } from "framer-motion";
import Link from "next/link";
import { fadeUp } from "@/lib/motion";

interface AuthFooterProps {
  text: string;
  linkText: string;
  href: string;
  /** Stagger index for fadeUp animation */
  index: number;
}

export default function AuthFooter({ text, linkText, href, index }: AuthFooterProps) {
  return (
    <motion.p
      className="text-center text-sm text-[#a0a0a0] mt-6"
      initial="hidden"
      animate="visible"
      custom={index}
      variants={fadeUp}
    >
      {text}{" "}
      <Link
        href={href}
        className="text-accent hover:text-accent-hover font-medium transition-colors"
      >
        {linkText}
      </Link>
    </motion.p>
  );
}
