import { Link, Redirect } from "expo-router";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet } from "react-native";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import {
  signInSchema,
  type SignInValues,
} from "@/features/auth/schemas/sign-in";
import { trackScreen } from "@/lib/observability/analytics";
import { useAuthStore } from "@/store/auth-store";
import { primitives } from "@/theme";

export default function SignInScreen() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const setTokens = useAuthStore((state) => state.setTokens);
  const { t } = useTranslation("auth");
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    trackScreen("sign_in");
  }, []);

  if (accessToken) {
    return <Redirect href="/" />;
  }

  const onSubmit = async () => {
    await setTokens({
      accessToken: "demo-access-token",
      refreshToken: "demo-refresh-token",
    });
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView type="backgroundElement" style={styles.card}>
        <ThemedText type="subtitle">{t("signInTitle")}</ThemedText>
        <ThemedText themeColor="textSecondary">
          {t("signInDescription")}
        </ThemedText>

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label={t("emailLabel")}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              textContentType="emailAddress"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              error={
                errors.email?.message ? t(errors.email.message) : undefined
              }
              placeholder={t("emailPlaceholder")}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label={t("passwordLabel")}
              secureTextEntry
              textContentType="password"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              error={
                errors.password?.message
                  ? t(errors.password.message)
                  : undefined
              }
              placeholder={t("passwordPlaceholder")}
            />
          )}
        />

        <Button
          label={t("demoSessionCta")}
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
        />

        <Link href="https://docs.expo.dev" asChild>
          <Pressable style={({ pressed }) => [pressed && styles.pressed]}>
            <ThemedText type="linkPrimary">{t("expoDocsLink")}</ThemedText>
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
  pressed: {
    opacity: 0.7,
  },
});
