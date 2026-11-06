/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
  trailingSlash: true,
  output: 'export',
  experimental: {
    workerThreads: false,
    cpus: 1,
  },
};

module.exports = nextConfig;
