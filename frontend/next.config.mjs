/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        unoptimized: true,
        domains: ['localhost', 'ca700c857d88.ngrok-free.app'],
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
                hostname: 'cc4c770d2bfb.ngrok-free.app',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'ca700c857d88.ngrok-free.app',
                pathname: '/**',
            }
        ],
    },
};

export default nextConfig;
