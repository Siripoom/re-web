import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["images.unsplash.com", "media.discordapp.net", "img.freepik.com"],
  },
  rules: {
    "no-console": "off", // Example of disabling the 'no-console' rule
    "react/no-unescaped-entities": "off", // Another example of disabling a rule
  },
};

export default nextConfig;
