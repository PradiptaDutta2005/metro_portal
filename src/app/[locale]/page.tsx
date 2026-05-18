"use client";

import { useTranslation } from "react-i18next";

export default function Hero() {
  const { t } = useTranslation("common");

  return (
    <section>
      <h1>{t("hero.title")}</h1>
      <p>{t("hero.subtitle")}</p>
      <button>{t("hero.getStarted")}</button>
      <button>{t("hero.watchDemo")}</button>
    </section>
  );
}
