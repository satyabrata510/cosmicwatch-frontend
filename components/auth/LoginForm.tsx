"use client";

/**
 * Login Form Component
 *
 * Handling user authentication via email and password.
 * Includes form validation, loading states, and error handling.
 */

import axios from "axios";
import { motion } from "framer-motion";
import { ArrowRight, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { useToast } from "@/components/ui/Toast";
import { fadeUp } from "@/lib/motion";
import { useAuthStore } from "@/stores/auth-store";
import type { ApiError } from "@/types";

export default function LoginForm() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const toast = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login({ email, password });
      toast.success("Welcome back!", "Login Successful");
      router.replace("/dashboard");
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data) {
        const apiError = err.response.data as ApiError;
        toast.error(apiError.message || "Invalid credentials", "Login Failed");
      } else {
        toast.error("Something went wrong. Please try again.", "Login Failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <motion.div initial="hidden" animate="visible" custom={1} variants={fadeUp}>
          <label
            htmlFor="email"
            className="block font-display text-xs text-white/70 tracking-wide mb-1.5"
          >
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/50" />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="astronaut@cosmicwatch.dev"
              required
              autoComplete="email"
              className="w-full h-10 pl-9 pr-3 rounded-lg bg-white/[0.06] border border-white/15 text-white/90 text-xs font-body placeholder:text-white/35 focus:outline-none focus:border-white/40 transition-colors"
            />
          </div>
        </motion.div>

        {/* Password */}
        <motion.div initial="hidden" animate="visible" custom={2} variants={fadeUp}>
          <label
            htmlFor="password"
            className="block font-display text-xs text-white/70 tracking-wide mb-1.5"
          >
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/50" />
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
              className="w-full h-10 pl-9 pr-3 rounded-lg bg-white/[0.06] border border-white/15 text-white/90 text-xs font-body placeholder:text-white/35 focus:outline-none focus:border-white/40 transition-colors"
            />
          </div>
        </motion.div>

        {/* Submit */}
        <motion.div initial="hidden" animate="visible" custom={3} variants={fadeUp}>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-10 rounded-lg font-body text-xs text-white/80 cursor-pointer transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style={{
              background:
                "linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 45%)",
            }}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <motion.span
                  className="inline-block h-3.5 w-3.5 border-2 border-white/20 border-t-white/60 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                Signing in...
              </span>
            ) : (
              <>
                Sign In
                <ArrowRight className="h-3.5 w-3.5" />
              </>
            )}
          </button>
        </motion.div>
      </form>

      {/* Footer link */}
      <motion.p
        className="text-center text-[10px] text-white/40 font-body"
        initial="hidden"
        animate="visible"
        custom={4}
        variants={fadeUp}
      >
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-white/60 hover:text-white/80 transition-colors">
          Create one
        </Link>
      </motion.p>
    </div>
  );
}
