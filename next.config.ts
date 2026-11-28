import type { NextConfig } from "next";

// Dịch Mượt (công cụ dịch truyện) is a separate static Vercel project, built with
// base /dich-truyen/ and served at leviethung.com/dich-truyen through these rewrites.
const DICH_TRUYEN_ORIGIN = "https://dich-truyen-plum.vercel.app";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      { source: "/dich-truyen", destination: `${DICH_TRUYEN_ORIGIN}/dich-truyen` },
      { source: "/dich-truyen/:path*", destination: `${DICH_TRUYEN_ORIGIN}/dich-truyen/:path*` },
    ];
  },
};

export default nextConfig;
