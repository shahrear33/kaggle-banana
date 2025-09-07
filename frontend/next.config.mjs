/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        unoptimized: true,
        domains: ['localhost', '8fa83e4a13b2.ngrok-free.app'],
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '8000',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: '*.ngrok-free.app',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: '8fa83e4a13b2.ngrok-free.app',
                pathname: '/**',
            }
        ],
    },
};

export default nextConfig;
