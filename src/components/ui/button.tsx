import {
  Pressable,
  StyleSheet,
  type PressableProps,
  type ViewStyle,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { primitives } from "@/theme";

type ButtonProps = Omit<PressableProps, "style"> & {
  label: string;
  variant?: "primary" | "secondary";
  containerStyle?: ViewStyle;
};

export function Button({
  label,
  variant = "primary",
  containerStyle,
  ...rest
}: ButtonProps) {
  const { semantic } = useThemeTokens();

  const backgroundColor =
    variant === "primary" ? semantic.state.info : semantic.bg.surface;
  const textColor =
    variant === "primary" ? semantic.text.inverse : semantic.text.primary;

  return (
    <Pressable
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.base,
        { backgroundColor, opacity: pressed ? 0.7 : 1 },
        containerStyle,
      ]}
      {...rest}
    >
      <ThemedText style={[styles.label, { color: textColor }]}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: primitives.radius.lg,
    paddingHorizontal: primitives.spacing[16],
    paddingVertical: primitives.spacing[12],
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontWeight: primitives.typography.weight.semibold,
  },
});
