/** @type {import('next').NextConfig} */
const BASE_PATH = process.env.BASE_PATH ?? '';

const nextConfig = {
  productionBrowserSourceMaps: false,
  distDir: process.env.DIST_DIR || '.next',
  basePath: BASE_PATH,

  env: {
    NEXT_PUBLIC_BASE_PATH: BASE_PATH,
  },

  typescript: {
    ignoreBuildErrors: true,
  }
};
export default nextConfig;