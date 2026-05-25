import { StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useFeatureFlags } from "@/lib/feature-flags/provider";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { useAppStore } from "@/store/app-store";
import { primitives } from "@/theme";

export function OfflineBanner() {
  const isOnline = useAppStore((state) => state.isOnline);
  const flags = useFeatureFlags();
  const { semantic } = useThemeTokens();
  const { t } = useTranslation("common");

  if (isOnline || !flags.enableOfflineBanner) {
    return null;
  }

  return (
    <ThemedView
      style={[
        styles.container,
        {
          backgroundColor: semantic.state.warning,
        },
      ]}
    >
      <ThemedText style={styles.text}>{t("offline")}</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingVertical: primitives.spacing[8],
    paddingHorizontal: primitives.spacing[12],
  },
  text: {
    color: "#0F172A",
    textAlign: "center",
    fontWeight: primitives.typography.weight.semibold,
  },
});
