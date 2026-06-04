import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Atmosphere imagery will be optimized here once assets land (doc 11 §B6).
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
