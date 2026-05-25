import { forwardRef } from "react";
import { StyleSheet, TextInput, type TextInputProps, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { primitives } from "@/theme";

type InputProps = TextInputProps & {
  label?: string;
  error?: string;
};

export const Input = forwardRef<TextInput, InputProps>(function Input(
  { label, error, style, ...rest },
  ref,
) {
  const { semantic } = useThemeTokens();

  return (
    <View style={styles.wrapper}>
      {label ? <ThemedText type="small">{label}</ThemedText> : null}
      <TextInput
        ref={ref}
        style={[
          styles.input,
          {
            borderColor: error ? "#D94848" : semantic.border.default,
            color: semantic.text.primary,
            backgroundColor: semantic.bg.surface,
          },
          style,
        ]}
        placeholderTextColor={semantic.text.tertiary}
        {...rest}
      />
      {error ? (
        <ThemedText type="small" style={styles.errorText}>
          {error}
        </ThemedText>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    gap: primitives.spacing[8],
  },
  input: {
    minHeight: 44,
    borderWidth: 1,
    borderRadius: primitives.radius.md,
    paddingHorizontal: primitives.spacing[12],
    paddingVertical: primitives.spacing[8],
  },
  errorText: {
    color: "#D94848",
  },
});
