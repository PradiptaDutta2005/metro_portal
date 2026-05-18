import type { UserConfig } from "next-i18next";

const config: UserConfig = {
  i18n: {
    defaultLocale: "en",
    locales: ["en", "hi"], // extend later if you add Malayalam
  },
};

export default config;
