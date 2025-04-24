import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack(config, { isServer }) {
    if (isServer) {
      config.externals = config.externals || [];

      // Skip bundling native canvas
      config.externals.push({
        canvas: "commonjs canvas",
      });
    }

    return config;
  },
};

export default nextConfig;
