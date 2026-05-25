import { StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { primitives } from "@/theme";

type ErrorStateProps = {
  title: string;
  description: string;
  onRetry?: () => void;
};

export function ErrorState({ title, description, onRetry }: ErrorStateProps) {
  const { t } = useTranslation("common");

  return (
    <ThemedView type="backgroundElement" style={styles.container}>
      <ThemedText type="subtitle" style={styles.center}>
        {title}
      </ThemedText>
      <ThemedText style={styles.center}>{description}</ThemedText>
      {onRetry ? <Button label={t("retry")} onPress={onRetry} /> : null}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: primitives.radius.xl,
    padding: primitives.spacing[24],
    gap: primitives.spacing[12],
  },
  center: {
    textAlign: "center",
  },
});
