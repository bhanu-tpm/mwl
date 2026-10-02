import type { NextConfig } from "next";

// Baseline security headers. A full Content-Security-Policy is added in Phase 6.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Dev only: lets phones on the same Wi-Fi load the dev server (e.g. http://192.168.0.9:3000).
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*", "*.local"],
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
