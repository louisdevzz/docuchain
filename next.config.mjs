/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env:{
    JWT_PINATA_CLOUD:process.env.JWT_PINATA_CLOUD,
    ALCHEMY:process.env.ALCHEMY,
    JWT_TOKEN:process.env.JWT_TOKEN,
    TOKEN_PINATA: process.env.TOKEN_PINATA,
    WEB_PATH: process.env.WEB_PATH
  }
};

export default nextConfig;
