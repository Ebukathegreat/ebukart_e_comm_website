import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "files.stripe.com",
      },
    ],
  },
  productionBrowserSourceMaps: false,
};

export default nextConfig;
