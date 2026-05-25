jest.mock("expo-localization", () => ({
  getLocales: () => [{ languageTag: "en-US" }],
}));

// eslint-disable-next-line import/first
import { getDirection, getSupportedLocale } from "@/lib/i18n/settings";

describe("i18n settings", () => {
  it("falls back to en for unsupported locale", () => {
    expect(getSupportedLocale("de-DE")).toBe("en");
  });

  it("returns rtl direction for arabic locales", () => {
    expect(getDirection("ar-SA")).toBe("rtl");
  });
});
