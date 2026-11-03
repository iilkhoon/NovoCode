import type { NextConfig } from "next";

// WebContainers (brauzerdə Node.js) cross-origin isolation tələb edir.
const isolation = [
  { key: "Cross-Origin-Embedder-Policy", value: "credentialless" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const config: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: isolation }];
  },
  outputFileTracingIncludes: { "/api/chat": ["./skills/**/*"] },
};
export default config;
