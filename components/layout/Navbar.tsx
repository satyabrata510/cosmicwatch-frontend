"use client";

/**
 * Main Navigation Bar
 *
 * The primary navigation component, utilizing the FloatingNav for a responsive,
 * sticky header. Includes links to key pages and authentication controls.
 */

import { AnimatePresence, motion } from "framer-motion";
import { LogOut, Menu, X } from "lucide-react";
import Link from "next/link";
import FloatingNav from "@/components/aceternity/FloatingNav";
import Button from "@/components/ui/Button";
import Logo from "@/components/ui/Logo";
import { useAuthStore } from "@/stores/auth-store";
import { useUIStore } from "@/stores/ui-store";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { isMobileMenuOpen: mobileOpen, toggleMobileMenu, closeMobileMenu } = useUIStore();

  return (
    <FloatingNav>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Logo size="md" />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm">
                    Dashboard
                  </Button>
                </Link>
                <span className="text-sm text-[#a0a0a0]">
                  Welcome, <span className="text-white font-medium">{user?.name}</span>
                </span>
                <Button variant="ghost" size="sm" onClick={logout}>
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Log In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button variant="primary" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-[#a0a0a0] hover:text-white transition-colors cursor-pointer"
            onClick={toggleMobileMenu}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-white/5 py-4 space-y-3 overflow-hidden"
            >
              {isAuthenticated ? (
                <>
                  <Link href="/dashboard" onClick={closeMobileMenu}>
                    <Button variant="ghost" size="sm" className="w-full justify-start">
                      Dashboard
                    </Button>
                  </Link>
                  <p className="text-sm text-[#a0a0a0] px-2">
                    Signed in as <span className="text-white font-medium">{user?.name}</span>
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => {
                      logout();
                      closeMobileMenu();
                    }}
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={closeMobileMenu}>
                    <Button variant="ghost" size="sm" className="w-full justify-start">
                      Log In
                    </Button>
                  </Link>
                  <Link href="/signup" onClick={closeMobileMenu}>
                    <Button variant="primary" size="sm" className="w-full justify-start">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </FloatingNav>
  );
}
