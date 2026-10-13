import type { NextConfig } from 'next';

const config: NextConfig = {
  output: 'export',
  poweredByHeader: false,
  // Original local assets are already sized/compressed; no image server is required.
  images: { unoptimized: true },
};
export default config;
