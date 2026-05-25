import { Link, Redirect } from "expo-router";
import { useEffect } from "react";
import { Pressable, StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { trackScreen } from "@/lib/observability/analytics";
import { useAuthStore } from "@/store/auth-store";
import { primitives } from "@/theme";

export default function SignInScreen() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const setTokens = useAuthStore((state) => state.setTokens);

  useEffect(() => {
    trackScreen("sign_in");
  }, []);

  if (accessToken) {
    return <Redirect href="/" />;
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedView type="backgroundElement" style={styles.card}>
        <ThemedText type="subtitle">Sign in</ThemedText>
        <ThemedText themeColor="textSecondary">
          Minimal auth scaffold for the boilerplate.
        </ThemedText>

        <Pressable
          onPress={() =>
            void setTokens({
              accessToken: "demo-access-token",
              refreshToken: "demo-refresh-token",
            })
          }
          style={({ pressed }) => [styles.cta, pressed && styles.pressed]}
        >
          <ThemedText type="smallBold">Continue with demo session</ThemedText>
        </Pressable>

        <Link href="https://docs.expo.dev" asChild>
          <Pressable style={({ pressed }) => [pressed && styles.pressed]}>
            <ThemedText type="linkPrimary">Open Expo docs</ThemedText>
          </Pressable>
        </Link>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: primitives.spacing[24],
  },
  card: {
    width: "100%",
    maxWidth: 420,
    borderRadius: primitives.spacing[24],
    padding: primitives.spacing[24],
    gap: primitives.spacing[16],
  },
  cta: {
    paddingVertical: primitives.spacing[12],
    paddingHorizontal: primitives.spacing[16],
    borderRadius: primitives.spacing[12],
    alignItems: "center",
    backgroundColor: "#208AEF",
  },
  pressed: {
    opacity: 0.7,
  },
});
