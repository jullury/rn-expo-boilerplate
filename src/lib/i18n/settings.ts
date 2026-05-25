import { getLocales } from "expo-localization";

import {
  deleteLocalItem,
  getLocalItem,
  setLocalItem,
} from "@/lib/storage/local";
import type { AppLocale } from "@/lib/i18n/resources";

export const SUPPORTED_LOCALES: AppLocale[] = ["en", "fr"];
export const DEFAULT_LOCALE: AppLocale = "en";
const LANGUAGE_KEY = "settings.language";

export function getSupportedLocale(locale?: string | null): AppLocale {
  if (!locale) {
    return DEFAULT_LOCALE;
  }

  const primaryTag = locale.split("-")[0]?.toLowerCase();
  if (primaryTag && SUPPORTED_LOCALES.includes(primaryTag as AppLocale)) {
    return primaryTag as AppLocale;
  }

  return DEFAULT_LOCALE;
}

export async function getPersistedLocale() {
  const persisted = await getLocalItem(LANGUAGE_KEY);
  return getSupportedLocale(persisted);
}

export async function setPersistedLocale(locale: AppLocale) {
  await setLocalItem(LANGUAGE_KEY, locale);
}

export async function clearPersistedLocale() {
  await deleteLocalItem(LANGUAGE_KEY);
}

export function getDeviceLocale() {
  const locale = getLocales()[0]?.languageTag;
  return getSupportedLocale(locale);
}

export function isRTL(locale: string) {
  return ["ar", "he", "fa", "ur"].includes(locale.split("-")[0] ?? "");
}

export function getDirection(locale: string): "ltr" | "rtl" {
  return isRTL(locale) ? "rtl" : "ltr";
}
