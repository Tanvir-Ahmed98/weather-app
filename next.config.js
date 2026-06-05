const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.weather-ai.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
