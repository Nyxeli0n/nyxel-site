import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'self'; object-src 'none'; base-uri 'self'",
          },
        ],
      },
      {
        source: "/:path((?!studio(?:/|$)).*)",
        headers: [{ key: "X-Frame-Options", value: "SAMEORIGIN" }],
      },
      {
        source: "/studio/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "frame-ancestors 'self' https://www.sanity.io https://sanity.io; object-src 'none'; base-uri 'self'",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
