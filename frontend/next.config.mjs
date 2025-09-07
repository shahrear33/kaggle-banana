/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        unoptimized: true,
        domains: ['localhost', 'dev-interior-backend-414327776143.us-central1.run.app'],
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
                hostname: 'dev-interior-backend-414327776143.us-central1.run.app',
                pathname: '/**',
            }
        ],
    },
};

export default nextConfig;
