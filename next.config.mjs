/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'resources.cryptocompare.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'api.qrserver.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'randomuser.me',
                port: '',
                pathname: '/**',
            }
        ],
    },
};

export default nextConfig;
