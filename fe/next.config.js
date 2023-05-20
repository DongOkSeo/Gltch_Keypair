/** @type {import('next').NextConfig} */
const { i18n } = require("./next-i18next.config");
const nextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  i18n,
  compiler: {
    emotion: true,
  },
  reactStrictMode: false,
  swcMinify: false,
  staticPageGenerationTimeout: 900,
  images: {
    domains: ["tokens.1inch.io", "assets.coingecko.com"],
  },
};

module.exports = nextConfig;
