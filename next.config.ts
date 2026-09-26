import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://admin.villagaz.com.br/api/:path*',
      },
      {
        source: '/produtos/:path*',
        destination: 'https://admin.villagaz.com.br/produtos/:path*',
      },
      {
        source: '/static/:path*',
        destination: 'https://admin.villagaz.com.br/static/:path*',
      },
      {
        source: '/media/:path*',
        destination: 'https://admin.villagaz.com.br/media/:path*',
      },
    ];
  },
};

export default nextConfig;