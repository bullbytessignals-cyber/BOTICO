import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
    ],
  },
  experimental: {
    // Allow larger image uploads through Server Actions (default is 1MB).
    serverActions: {
      bodySizeLimit: "4mb",
    },
  },
};

export default nextConfig;
