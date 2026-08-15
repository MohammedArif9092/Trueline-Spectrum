/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Hide the Next.js dev-mode indicator (the round "N" badge in the corner).
  // It only ever renders under `next dev` and never in production builds.
  devIndicators: false,
  images: {
    // Hosts we OPTIMIZE. Any other valid image URL is still displayed, just
    // served un-optimized via <SmartImage> — so no wildcard host is needed and
    // Next.js image security stays enabled. Keep this in sync with
    // OPTIMIZABLE_IMAGE_HOSTS in src/lib/utils.ts.
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "picsum.photos" },
      // Google Drive public image content endpoint (converted from share links).
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
        ],
      },
    ];
  },
};

export default nextConfig;
