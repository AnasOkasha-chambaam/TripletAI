import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "fimgs.net",
      },
    ],
  },
};

export default nextConfig;

// Makes the Cloudflare bindings declared in wrangler.jsonc (ASSETS, IMAGES)
// available during `next dev`, so local dev matches the Worker. Deliberately
// after the default export and outside the config object — it is a side effect,
// not configuration.
initOpenNextCloudflareForDev();

