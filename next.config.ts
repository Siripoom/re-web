import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'media.discordapp.net',
      },
      {
        protocol: 'https',
        hostname: 'img.freepik.com',
      },
      {
        protocol: 'https',
        hostname: 'klrazjwxssysrpuqmtbf.supabase.co',
      },
    ],
  },
  
  rules: {
    "no-console": "off", // Example of disabling the 'no-console' rule
    "react/no-unescaped-entities": "off", // Another example of disabling a rule
  },
};

export default nextConfig;
