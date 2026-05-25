import { createInstance } from "i18next";
import { initReactI18next } from "react-i18next";

import { resources } from "@/lib/i18n/resources";
import {
  DEFAULT_LOCALE,
  getDeviceLocale,
  getPersistedLocale,
  setPersistedLocale,
  SUPPORTED_LOCALES,
} from "@/lib/i18n/settings";

type LocaleUnion = (typeof SUPPORTED_LOCALES)[number];

const i18n = createInstance();

let initialized = false;

export async function initI18n() {
  if (initialized) {
    return i18n;
  }

  const persistedLocale = await getPersistedLocale();
  const deviceLocale = getDeviceLocale();
  const locale = persistedLocale ?? deviceLocale ?? DEFAULT_LOCALE;

  await i18n.use(initReactI18next).init({
    compatibilityJSON: "v4",
    resources,
    lng: locale,
    fallbackLng: DEFAULT_LOCALE,
    defaultNS: "common",
    interpolation: {
      escapeValue: false,
    },
  });

  initialized = true;
  return i18n;
}

export async function setLanguage(locale: LocaleUnion) {
  await setPersistedLocale(locale);
  await i18n.changeLanguage(locale);
}

export default i18n;
