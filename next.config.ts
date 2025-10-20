import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  poweredByHeader: false,

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
        ],
      },
    ];
  },

  async redirects() {
    return [
      {
        source: '/markdown-editor',
        destination: '/',
        permanent: true,
      },
      {
        source: '/editor',
        destination: '/',
        permanent: true,
      },
      {
        source: '/preview',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
