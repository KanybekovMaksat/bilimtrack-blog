import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  skipTrailingSlashRedirect: true,
  i18n: {
    locales: ["ru"],
    defaultLocale: "ru",
    localeDetection: false,
  },
  // Pin the workspace root (a parent package-lock.json exists upstream).
  turbopack: {
    root: __dirname,
  },
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: "https://api.bilimtrack.com/api/v1/:path*",
      },
    ];
  },
};

export default nextConfig;
