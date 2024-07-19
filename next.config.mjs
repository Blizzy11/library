/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["geist"],
  i18n: {
    locales: ["id-ID", "en-US"],
    defaultLocale: "id-ID",
  },
};

export default nextConfig;
