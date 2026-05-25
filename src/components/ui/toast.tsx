import { StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { primitives } from "@/theme";

type ToastProps = {
  message: string;
  variant?: "info" | "success" | "warning" | "danger";
};

const variantColor = {
  info: "#2563EB",
  success: "#16A34A",
  warning: "#D97706",
  danger: "#DC2626",
} as const;

export function Toast({ message, variant = "info" }: ToastProps) {
  return (
    <ThemedView
      style={[styles.container, { borderLeftColor: variantColor[variant] }]}
    >
      <ThemedText>{message}</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderLeftWidth: 4,
    borderRadius: primitives.radius.lg,
    paddingHorizontal: primitives.spacing[12],
    paddingVertical: primitives.spacing[12],
  },
});
