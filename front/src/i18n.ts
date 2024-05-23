import { NextIntlClientProvider } from "next-intl";
import { getRequestConfig } from "next-intl/server";

export const locales = ["en", "fr"] as const;

export default getRequestConfig(async () => {
  // Provide a static locale, fetch a user setting,
  // read from `cookies()`, `headers()`, etc.
  // const userLang = navigator.language;

  const locale = "fr";

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
