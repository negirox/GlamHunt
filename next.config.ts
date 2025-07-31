import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/models.json',
        destination: '/_next/static/models.json',
      },
    ]
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      const fs = require('fs');
      const path = require('path');
      
      const modelsPath = path.join(process.cwd(), 'src/lib/models.json');
      const staticPath = path.join(process.cwd(), '.next/static/models.json');
      
      // Ensure the static directory exists
      fs.mkdirSync(path.dirname(staticPath), { recursive: true });
      // Copy the file
      fs.copyFileSync(modelsPath, staticPath);
    }
    return config;
  },
};

export default nextConfig;
