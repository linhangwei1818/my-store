import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as (typeof routing.locales)[number])) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: {
      common: (await import(`../messages/${locale}/common.json`)).default,
      home: (await import(`../messages/${locale}/home.json`)).default,
      product: (await import(`../messages/${locale}/product.json`)).default,
      cart: (await import(`../messages/${locale}/cart.json`)).default,
      checkout: (await import(`../messages/${locale}/checkout.json`)).default,
      contact: (await import(`../messages/${locale}/contact.json`)).default,
    },
  };
});
