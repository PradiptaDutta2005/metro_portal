"use client";

import i18next from "i18next";
import { I18nextProvider } from "react-i18next";

export default function I18nProvider({
  locale,
  resources,
  children,
}: {
  locale: string;
  resources: any;
  children: React.ReactNode;
}) {
  if (!i18next.isInitialized) {
    i18next.init({
      lng: locale,
      fallbackLng: "en",
      resources,
    });
  }

  return <I18nextProvider i18n={i18next}>{children}</I18nextProvider>;
}
