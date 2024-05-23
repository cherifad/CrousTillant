import withPWA from "next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // i18n: {
  //     locales: ['en', 'fr'],
  //     defaultLocale: 'fr',
  // },
  output: "standalone",
};

export default withPWA({
  dest: "public",
})(nextConfig);
