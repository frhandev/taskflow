import type { NextConfig } from "next";

const backendUrl = process.env.BACKEND_INTERNAL_URL;

if (!backendUrl) {
  throw new Error("Backend URL is required.");
}

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path",
        destination: `${backendUrl.replace(/\/$/, "")}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
