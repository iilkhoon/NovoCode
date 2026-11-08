import type { NextConfig } from "next";

// WebContainers (brauzerdə Node.js) cross-origin isolation tələb edir.
const isolation = [
  { key: "Cross-Origin-Embedder-Policy", value: "credentialless" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const security = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), geolocation=(), microphone=(self)" },
];

const config: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: [...isolation, ...security] }];
  },
  outputFileTracingIncludes: { "/api/chat": ["./skills/**/*"] },
};
export default config;
