import withPWA from "next-pwa";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  // i18n: {
  //     locales: ['en', 'fr'],
  //     defaultLocale: 'fr',
  // },
  output: "standalone",
};

export default withNextIntl(
  withPWA({
    dest: "public",
  })(nextConfig)
);
