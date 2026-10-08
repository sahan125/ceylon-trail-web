import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tpdzdhcwhciagrtlerm.supabase.co",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
