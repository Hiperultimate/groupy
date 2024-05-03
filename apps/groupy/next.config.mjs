// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { PrismaPlugin } from "@prisma/nextjs-monorepo-workaround-plugin";

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import("./src/env.mjs"));

/** @type {import("next").NextConfig} */

const config = {
  reactStrictMode: true,

  /**
   * If you have the "experimental: { appDir: true }" setting enabled, then you
   * must comment the below `i18n` config out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: `*.supabase.co`,
      },
      // Using unsplash to test different sizes of images
      {
        protocol: "https",
        hostname: `*.unsplash.com`,
      },
    ],
  },
  // eslint: {ignoreDuringBuilds: true},
  transpilePackages: ["@groupy/db_prisma"],

  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins = [...config.plugins, new PrismaPlugin()];
    }

    return config;
  },
};

export default config;
