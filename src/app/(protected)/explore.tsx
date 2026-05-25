import { Image } from "expo-image";
import { SymbolView } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { Platform, Pressable, ScrollView, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ExternalLink } from "@/components/external-link";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Collapsible } from "@/components/ui/collapsible";
import { WebBadge } from "@/components/web-badge";
import { BottomTabInset, MaxContentWidth } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { primitives } from "@/theme";

export default function TabTwoScreen() {
  const { t } = useTranslation(["explore", "common"]);
  const safeAreaInsets = useSafeAreaInsets();
  const insets = {
    ...safeAreaInsets,
    bottom: safeAreaInsets.bottom + BottomTabInset + primitives.spacing[16],
  };
  const { semantic } = useThemeTokens();

  const contentPlatformStyle = Platform.select({
    android: {
      paddingTop: insets.top,
      paddingLeft: insets.left,
      paddingRight: insets.right,
      paddingBottom: insets.bottom,
    },
    web: {
      paddingTop: primitives.spacing[64],
      paddingBottom: primitives.spacing[24],
    },
  });

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: semantic.bg.canvas }]}
      contentInset={insets}
      contentContainerStyle={[styles.contentContainer, contentPlatformStyle]}
    >
      <ThemedView style={styles.container}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="subtitle">{t("explore:title")}</ThemedText>
          <ThemedText style={styles.centerText} themeColor="textSecondary">
            {t("explore:subtitle")}
          </ThemedText>

          <ExternalLink href="https://docs.expo.dev" asChild>
            <Pressable style={({ pressed }) => pressed && styles.pressed}>
              <ThemedView type="backgroundElement" style={styles.linkButton}>
                <ThemedText type="link">{t("explore:expoDocs")}</ThemedText>
                <SymbolView
                  tintColor={semantic.text.primary}
                  name={{
                    ios: "arrow.up.right.square",
                    android: "link",
                    web: "link",
                  }}
                  size={12}
                />
              </ThemedView>
            </Pressable>
          </ExternalLink>
        </ThemedView>

        <ThemedView style={styles.sectionsWrapper}>
          <Collapsible title={t("explore:routingTitle")}>
            <ThemedText type="small">
              {t("explore:routingLine1Prefix")}{" "}
              <ThemedText type="code">src/app/index.tsx</ThemedText> and{" "}
              <ThemedText type="code">src/app/explore.tsx</ThemedText>
            </ThemedText>
            <ThemedText type="small">
              {t("explore:routingLine2Prefix")}{" "}
              <ThemedText type="code">src/app/_layout.tsx</ThemedText>{" "}
              {t("explore:routingLine2Suffix")}
            </ThemedText>
            <ExternalLink href="https://docs.expo.dev/router/introduction">
              <ThemedText type="linkPrimary">
                {t("common:learnMore")}
              </ThemedText>
            </ExternalLink>
          </Collapsible>

          <Collapsible title={t("explore:platformTitle")}>
            <ThemedView
              type="backgroundElement"
              style={styles.collapsibleContent}
            >
              <ThemedText type="small">
                {t("explore:platformBody1")}{" "}
                <ThemedText type="smallBold">w</ThemedText>{" "}
                {t("explore:platformBody2")}
              </ThemedText>
              <Image
                source={require("@/assets/images/tutorial-web.png")}
                style={styles.imageTutorial}
              />
            </ThemedView>
          </Collapsible>

          <Collapsible title={t("explore:imagesTitle")}>
            <ThemedText type="small">
              {t("explore:imagesBody1")}{" "}
              <ThemedText type="code">@2x</ThemedText>{" "}
              {t("explore:imagesBody2")}{" "}
              <ThemedText type="code">@3x</ThemedText>{" "}
              {t("explore:imagesBody3")}
            </ThemedText>
            <Image
              source={require("@/assets/images/react-logo.png")}
              style={styles.imageReact}
            />
            <ExternalLink href="https://reactnative.dev/docs/images">
              <ThemedText type="linkPrimary">
                {t("common:learnMore")}
              </ThemedText>
            </ExternalLink>
          </Collapsible>

          <Collapsible title={t("explore:colorModeTitle")}>
            <ThemedText type="small">
              {t("explore:colorModeBody")}{" "}
              <ThemedText type="code">useColorScheme()</ThemedText>{" "}
              {t("explore:colorModeBody2")}
            </ThemedText>
            <ExternalLink href="https://docs.expo.dev/develop/user-interface/color-themes/">
              <ThemedText type="linkPrimary">
                {t("common:learnMore")}
              </ThemedText>
            </ExternalLink>
          </Collapsible>

          <Collapsible title={t("explore:animationsTitle")}>
            <ThemedText type="small">
              {t("explore:animationsBody1")}{" "}
              <ThemedText type="code">
                src/components/ui/collapsible.tsx
              </ThemedText>{" "}
              {t("explore:animationsBody2")}{" "}
              <ThemedText type="code">react-native-reanimated</ThemedText>{" "}
              {t("explore:animationsBody3")}
            </ThemedText>
          </Collapsible>
        </ThemedView>
        {Platform.OS === "web" && <WebBadge />}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  container: {
    maxWidth: MaxContentWidth,
    flexGrow: 1,
  },
  titleContainer: {
    gap: primitives.spacing[16],
    alignItems: "center",
    paddingHorizontal: primitives.spacing[24],
    paddingVertical: primitives.spacing[64],
  },
  centerText: {
    textAlign: "center",
  },
  pressed: {
    opacity: 0.7,
  },
  linkButton: {
    flexDirection: "row",
    paddingHorizontal: primitives.spacing[24],
    paddingVertical: primitives.spacing[8],
    borderRadius: primitives.spacing[32],
    justifyContent: "center",
    gap: primitives.spacing[4],
    alignItems: "center",
  },
  sectionsWrapper: {
    gap: primitives.spacing[32],
    paddingHorizontal: primitives.spacing[24],
    paddingTop: primitives.spacing[16],
  },
  collapsibleContent: {
    alignItems: "center",
  },
  imageTutorial: {
    width: "100%",
    aspectRatio: 296 / 171,
    borderRadius: primitives.spacing[16],
    marginTop: primitives.spacing[8],
  },
  imageReact: {
    width: 100,
    height: 100,
    alignSelf: "center",
  },
});
