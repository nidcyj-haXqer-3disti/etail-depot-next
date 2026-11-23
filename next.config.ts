import type { NextConfig } from 'next';

const config: NextConfig = {
  output: 'export',
  poweredByHeader: false,
  // Keep route CSS isolated as the Blog grows, with a minimal request cost
  // to group shared styles without pulling in unrelated page families.
  experimental: { cssChunking: { type: 'graph', requestCost: 1 } },
  // Original local assets are already sized/compressed; no image server is required.
  images: { unoptimized: true },
};
export default config;
