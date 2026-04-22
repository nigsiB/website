import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.nigsib.com" }],
        destination: "https://nigsib.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
