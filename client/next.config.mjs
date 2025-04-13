/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
    remotePatterns: [
{
        protocol: 'https',
        hostname: 'images.pexels.com',
        pathname: '/photos/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/public/uploads/**',
      }
    ],
  },
  async rewrites() {
    return [
      {
        source: "/:path*", 
        destination: "/dashboard/:path*",
      },
    ];
  },
};

export default nextConfig;
