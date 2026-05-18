import { getDictionary } from "../../lib/i18n";
import I18nProvider from "../../components/I18nProvider";

export async function generateStaticParams() {
  return [{ locale: "en" }, { locale: "hi" }];
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  // ✅ Don't create <html>/<body>, just wrap children
  return (
    <I18nProvider locale={locale} resources={{ [locale]: { common: dict } }}>
      {children}
    </I18nProvider>
  );
}
