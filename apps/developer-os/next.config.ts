import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // project-supervisor ships TypeScript source (NodeNext `.js` specifiers); compile it here.
  transpilePackages: ["@factory/project-supervisor"],
  serverExternalPackages: ["rivetkit", "@rivetkit/rivetkit-napi"],
  webpack(config) {
    config.resolve.extensionAlias = {
      ".js": [".ts", ".tsx", ".js"],
      ".mjs": [".mts", ".mjs"],
    };
    return config;
  },
};

export default nextConfig;
