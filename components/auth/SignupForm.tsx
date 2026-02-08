"use client";

/**
 * Signup Form Component
 *
 * A registration form with client-side validation and a planet-explorer visual style.
 * Handles user registration via the `useAuthStore`.
 */

import axios from "axios";
import { motion } from "framer-motion";
import { ArrowRight, Lock, Mail, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { useToast } from "@/components/ui/Toast";
import { fadeUp } from "@/lib/motion";
import { useAuthStore } from "@/stores/auth-store";
import type { ApiError } from "@/types";

const ROLES = ["USER", "RESEARCHER"] as const;
type Role = (typeof ROLES)[number];

const ROLE_LABELS: Record<Role, string> = {
  USER: "Enthusiast",
  RESEARCHER: "Researcher",
};

export default function SignupForm() {
  const router = useRouter();
  const register = useAuthStore((s) => s.register);
  const toast = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<Role>("USER");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    if (name.trim().length < 2) errors.name = "Min 2 characters";
    if (password.length < 8) {
      errors.password = "Min 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      errors.password = "Need upper, lower & number";
    }
    if (password !== confirmPassword) errors.confirmPassword = "No match";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsLoading(true);
    try {
      await register({ name: name.trim(), email, password, role });
      toast.success("Account created! Redirecting...", "Welcome");
      router.replace("/dashboard");
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data) {
        const apiError = err.response.data as ApiError;
        toast.error(apiError.message || "Registration failed", "Signup Failed");
      } else {
        toast.error("Something went wrong. Please try again.", "Signup Failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const inputCls =
    "w-full h-10 pl-9 pr-3 rounded-lg bg-white/[0.06] border border-white/15 text-white/90 text-xs font-body placeholder:text-white/35 focus:outline-none focus:border-white/40 transition-colors";
  const errorCls = "text-[10px] text-red-400/80 mt-0.5 font-body";

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Name */}
        <motion.div initial="hidden" animate="visible" custom={1} variants={fadeUp}>
          <label
            htmlFor="name"
            className="block font-display text-xs text-white/70 tracking-wide mb-1"
          >
            Name
          </label>
          <div className="relative">
            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/50" />
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              required
              autoComplete="name"
              className={inputCls}
            />
          </div>
          {fieldErrors.name ? <p className={errorCls}>{fieldErrors.name}</p> : null}
        </motion.div>

        {/* Email */}
        <motion.div initial="hidden" animate="visible" custom={2} variants={fadeUp}>
          <label
            htmlFor="email"
            className="block font-display text-xs text-white/70 tracking-wide mb-1"
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
              className={inputCls}
            />
          </div>
        </motion.div>

        {/* Password */}
        <motion.div initial="hidden" animate="visible" custom={3} variants={fadeUp}>
          <label
            htmlFor="password"
            className="block font-display text-xs text-white/70 tracking-wide mb-1"
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
              autoComplete="new-password"
              className={inputCls}
            />
          </div>
          {fieldErrors.password ? <p className={errorCls}>{fieldErrors.password}</p> : null}
        </motion.div>

        {/* Confirm */}
        <motion.div initial="hidden" animate="visible" custom={4} variants={fadeUp}>
          <label
            htmlFor="confirmPassword"
            className="block font-display text-xs text-white/70 tracking-wide mb-1"
          >
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/50" />
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="new-password"
              className={inputCls}
            />
          </div>
          {fieldErrors.confirmPassword ? (
            <p className={errorCls}>{fieldErrors.confirmPassword}</p>
          ) : null}
        </motion.div>

        {/* Role selector */}
        <motion.div initial="hidden" animate="visible" custom={5} variants={fadeUp}>
          <label className="block font-display text-xs text-white/70 tracking-wide mb-1">
            I am a...
          </label>
          <div className="grid grid-cols-2 gap-2">
            {ROLES.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`h-9 rounded-lg text-[11px] font-body cursor-pointer transition-all duration-200 ${
                  role === r
                    ? "border border-white/30 text-white/80 bg-white/[0.08]"
                    : "border border-white/10 text-white/50 bg-white/[0.02] hover:border-white/20"
                }`}
              >
                {ROLE_LABELS[r]}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Submit */}
        <motion.div initial="hidden" animate="visible" custom={6} variants={fadeUp}>
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
                Creating account...
              </span>
            ) : (
              <>
                Create Account
                <ArrowRight className="h-3.5 w-3.5" />
              </>
            )}
          </button>
        </motion.div>
      </form>

      {/* Footer */}
      <motion.p
        className="text-center text-[10px] text-white/40 font-body"
        initial="hidden"
        animate="visible"
        custom={7}
        variants={fadeUp}
      >
        Already have an account?{" "}
        <Link href="/login" className="text-white/60 hover:text-white/80 transition-colors">
          Sign in
        </Link>
      </motion.p>
    </div>
  );
}
