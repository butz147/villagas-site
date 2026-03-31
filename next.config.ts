import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://159.223.111.33:8000/api/:path*',
      },
      {
        source: '/produtos/:path*',
        destination: 'http://159.223.111.33:8000/produtos/:path*',
      },
      {
        source: '/static/:path*',
        destination: 'http://159.223.111.33:8000/static/:path*',
      },
      {
        source: '/media/:path*',
        destination: 'http://159.223.111.33:8000/media/:path*',
      },
    ];
  },
};

export default nextConfig;