import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 85],
    localPatterns: [{ pathname: "/images/**" }, { pathname: "/uploads/**" }],
  },
  poweredByHeader: false,
  experimental: {
    // Allow product photo uploads from the admin panel.
    serverActions: { bodySizeLimit: "12mb" },
    agentUpgrade: "security",
  },
  async redirects() {
    return [
      { source: "/book-a-demo", destination: "/enquiry?type=demo", permanent: false },
      { source: "/odi", destination: "/services#odi", permanent: false },
    ];
  },
};

export default nextConfig;
