import { NativeTabs } from "expo-router/unstable-native-tabs";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

export default function AppTabs() {
  const { semantic } = useThemeTokens();

  return (
    <NativeTabs
      backgroundColor={semantic.bg.canvas}
      indicatorColor={semantic.bg.surface}
      labelStyle={{ selected: { color: semantic.text.primary } }}
    >
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={require("@/assets/images/tabIcons/home.png")}
          renderingMode="template"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="explore">
        <NativeTabs.Trigger.Label>Explore</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={require("@/assets/images/tabIcons/explore.png")}
          renderingMode="template"
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
