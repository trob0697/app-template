import type { NextConfig } from "next";

const ENV = process.env.ENV!;
const API_URL =
  ENV === "PRODUCTION"
    ? process.env.NEXT_PUBLIC_API_URL!
    : "http://express-backend:4000";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${API_URL}/:path*`,
      },
    ];
  },
};

export default nextConfig;
