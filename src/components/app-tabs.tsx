import { NativeTabs } from "expo-router/unstable-native-tabs";
import { useTranslation } from "react-i18next";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

export default function AppTabs() {
  const { semantic } = useThemeTokens();
  const { t } = useTranslation("tabs");

  return (
    <NativeTabs
      backgroundColor={semantic.bg.canvas}
      indicatorColor={semantic.bg.surface}
      labelStyle={{ selected: { color: semantic.text.primary } }}
    >
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>{t("home")}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={require("@/assets/images/tabIcons/home.png")}
          renderingMode="template"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="explore">
        <NativeTabs.Trigger.Label>{t("explore")}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={require("@/assets/images/tabIcons/explore.png")}
          renderingMode="template"
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
