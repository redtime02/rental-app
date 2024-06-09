/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "a0.muscache.com",
        protocol: "https",
        port: "",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
      },
    ],
  },
};

export default nextConfig;
