/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Local images from /public are served automatically.
    // Keep picsum only as fallback for development placeholder testing.
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
    ],
    // Allow large portrait photos
    deviceSizes: [640, 828, 1080, 1200, 1920],
  },
};

module.exports = nextConfig;
