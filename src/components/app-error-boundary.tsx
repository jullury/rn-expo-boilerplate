import { PropsWithChildren } from "react";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import { StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import i18n from "@/lib/i18n";
import { captureError } from "@/lib/observability/crash-reporting";
import { primitives } from "@/theme";

function toError(error: unknown) {
  if (error instanceof Error) {
    return error;
  }
  return new Error("Unknown runtime error");
}

function ErrorFallback({ error }: FallbackProps) {
  const normalizedError = toError(error);

  return (
    <ThemedView style={styles.container}>
      <ThemedView type="backgroundElement" style={styles.card}>
        <ThemedText type="subtitle">
          {i18n.t("common:appErrorTitle")}
        </ThemedText>
        <ThemedText themeColor="textSecondary">
          {normalizedError.message}
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

export function AppErrorBoundary({ children }: PropsWithChildren) {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, info) => {
        captureError(toError(error), {
          componentStack: info.componentStack,
        });
      }}
    >
      {children}
    </ErrorBoundary>
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
    gap: primitives.spacing[12],
  },
});
