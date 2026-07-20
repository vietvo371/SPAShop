/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  images: {
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    qualities: [70, 75, 80, 85, 90, 95, 100],
    formats: ['image/avif', 'image/webp'],
    localPatterns: [
      {
        pathname: "/images/**",
      },
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/login',
        destination: '/admin/login',
        permanent: true,
      },
      // Route cũ đã được Google index — giữ 301 để không mất SEO.
      {
        source: '/cau-chuyen-chan-an',
        destination: '/gioi-thieu',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
