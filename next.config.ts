import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // bundle-barrel-imports: Auto-transform barrel imports to direct imports
  // Avoids loading 1000+ unused modules from icon/component libs
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
    ],
  },
};

export default nextConfig;
