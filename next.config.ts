import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // Plugin install link renders the home page instead of 404.
      {
        source: "/wordpress/kreebi-ai-builder/install",
        destination: "/",
      },
      {
        source: "/wordpress/kreebi-ai-builder/install/",
        destination: "/",
      },
    ];
  },
};

export default nextConfig;
