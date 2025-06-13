import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: "export", // Temporarily disabled for development with dynamic routes
  trailingSlash: true,
  images: {
    unoptimized: true,
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Compression
  compress: true,

  // Power optimizations
  poweredByHeader: false,

  // Bundle analyzer - disabled for static export compatibility
  // ...(process.env.ANALYZE === "true"
  //   ? {
  //       webpack: (config) => {
  //         const BundleAnalyzerPlugin = require("@next/bundle-analyzer");
  //         config.plugins.push(
  //           new BundleAnalyzerPlugin({
  //             enabled: true,
  //             openAnalyzer: false,
  //           })
  //         );
  //         return config;
  //       },
  //     }
  //   : {}),

  // Experimental features
  experimental: {
    optimizePackageImports: [
      "@tanstack/react-query",
      "framer-motion",
      "@headlessui/react",
      "@heroicons/react",
    ],
  },

  // Note: Headers are not supported with static export
  // Security headers should be configured at the web server level
};

export default nextConfig;
