import * as Device from "expo-device";
import { useTranslation } from "react-i18next";
import { Platform, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AnimatedIcon } from "@/components/animated-icon";
import { HintRow } from "@/components/hint-row";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { WebBadge } from "@/components/web-badge";
import { BottomTabInset, MaxContentWidth } from "@/constants/theme";
import { primitives } from "@/theme";

function getDevMenuHint(t: (key: string) => string) {
  if (Platform.OS === "web") {
    return <ThemedText type="small">{t("webDevtools")}</ThemedText>;
  }
  if (Device.isDevice) {
    return (
      <ThemedText type="small">
        {t("shakeDevicePrefix")} <ThemedText type="code">m</ThemedText>{" "}
        {t("inTerminalSuffix")}
      </ThemedText>
    );
  }
  const shortcut = Platform.OS === "android" ? "cmd+m (or ctrl+m)" : "cmd+d";
  return (
    <ThemedText type="small">
      {t("pressPrefix")} <ThemedText type="code">{shortcut}</ThemedText>
    </ThemedText>
  );
}

export default function HomeScreen() {
  const { t } = useTranslation("home");

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.heroSection}>
          <AnimatedIcon />
          <ThemedText type="title" style={styles.title}>
            {t("welcome")}
          </ThemedText>
        </ThemedView>

        <ThemedText type="code" style={styles.code}>
          {t("getStarted")}
        </ThemedText>

        <ThemedView type="backgroundElement" style={styles.stepContainer}>
          <HintRow
            title={t("tryEditing")}
            hint={<ThemedText type="code">src/app/index.tsx</ThemedText>}
          />
          <HintRow title={t("devTools")} hint={getDevMenuHint(t)} />
          <HintRow
            title={t("freshStart")}
            hint={<ThemedText type="code">{t("resetCommand")}</ThemedText>}
          />
        </ThemedView>

        {Platform.OS === "web" && <WebBadge />}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    flexDirection: "row",
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: primitives.spacing[24],
    alignItems: "center",
    gap: primitives.spacing[16],
    paddingBottom: BottomTabInset + primitives.spacing[16],
    maxWidth: MaxContentWidth,
  },
  heroSection: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    paddingHorizontal: primitives.spacing[24],
    gap: primitives.spacing[24],
  },
  title: {
    textAlign: "center",
  },
  code: {
    textTransform: "uppercase",
  },
  stepContainer: {
    gap: primitives.spacing[16],
    alignSelf: "stretch",
    paddingHorizontal: primitives.spacing[16],
    paddingVertical: primitives.spacing[24],
    borderRadius: primitives.spacing[24],
  },
});
