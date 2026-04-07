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
      },
    ],
  },
};

export default nextConfig;
