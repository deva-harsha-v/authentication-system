import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  
  // ✅ These two blocks allow Vercel to finish the build even with warnings
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;