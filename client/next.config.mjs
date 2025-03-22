/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "images.pexels.com",
      },
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
