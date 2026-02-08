"use client";

/**
 * Auth Error Banner
 *
 * An animated error message component used in authentication forms
 * to display validation or API errors.
 */

import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { scaleIn } from "@/lib/motion";

interface AuthErrorProps {
  message: string;
}

export default function AuthError({ message }: AuthErrorProps) {
  return (
    <motion.div
      variants={scaleIn}
      initial="hidden"
      animate="visible"
      className="flex items-center gap-2 p-3 mb-6 rounded-xl bg-danger/10 border border-danger/20 text-danger text-sm"
    >
      <AlertCircle className="h-4 w-4 flex-shrink-0" />
      {message}
    </motion.div>
  );
}
