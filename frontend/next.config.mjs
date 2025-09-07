/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        unoptimized: true,
        domains: ['localhost', 'afeffd77ed5d.ngrok-free.app'],
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
                hostname: 'afeffd77ed5d.ngrok-free.app',
                pathname: '/**',
            }
        ],
    },
};

export default nextConfig;
