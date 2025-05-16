import { AWS_S3_BUCKET } from "@/lib/credentials";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: `${AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com`,
      },
    ],
  },
};

export default nextConfig;
