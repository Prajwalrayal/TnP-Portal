/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
        domains: [
            "via.placeholder.com",
            "via.placeholder.co",
        ],
    },
    logging: {
        fetches: {
            fullUrl: true,
        },
    },
};

export default nextConfig;
