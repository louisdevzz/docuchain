/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env:{
    JWT_PINATA_CLOUD:process.env.JWT_PINATA_CLOUD,
    ALCHEMY:process.env.ALCHEMY
  }
};

export default nextConfig;
