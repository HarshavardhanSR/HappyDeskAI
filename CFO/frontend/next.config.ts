import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  // API routes are handled by app/api/[...path]/route.ts
  // which adds Clerk authentication tokens
};

export default nextConfig;
