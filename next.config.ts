import type { NextConfig } from 'next';

const config: NextConfig = {
  output: 'export',
  poweredByHeader: false,
  // Keep route specific artwork out of the shared stylesheet.
  experimental: { cssChunking: 'graph' },
  // Original local assets are already sized/compressed; no image server is required.
  images: { unoptimized: true },
};
export default config;
