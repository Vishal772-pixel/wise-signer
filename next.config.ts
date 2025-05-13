import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', // static site export

  trailingSlash: true, // IPFS support

  images: {
    unoptimized: true,
  },
};

export default nextConfig;
