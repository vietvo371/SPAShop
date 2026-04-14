/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    localPatterns: [
      {
        pathname: "/images/**",
      },
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.chanan.vn',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'chanan.vn',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
