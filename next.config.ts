import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",
  images: {
    unoptimized: true,
  },
  // Pin the workspace root: a stray lockfile in the home directory otherwise
  // makes Turbopack infer /Users/<user> as the root and scan the whole home.
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
