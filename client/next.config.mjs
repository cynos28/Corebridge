/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
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
        source: "/:path*",       // what the user sees (public URL)
        destination: "/dashboard/:path*", // actual Next.js route
      },
    ];
  },
};

export default nextConfig;
