import { Platform, Text, type TextProps } from "react-native";

import type { ThemeColor } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { semantic } from "@/theme";

type SemanticTextColorKey = keyof (typeof semantic)["light"]["text"];

export type ThemedTextProps = TextProps & {
  type?:
    | "default"
    | "title"
    | "small"
    | "smallBold"
    | "subtitle"
    | "link"
    | "linkPrimary"
    | "code";
  themeColor?: ThemeColor | SemanticTextColorKey;
};

export function ThemedText({
  style,
  type = "default",
  themeColor,
  ...rest
}: ThemedTextProps) {
  const { semantic, primitives, fonts } = useThemeTokens();
  const theme = useTheme();

  const color =
    themeColor === "primary" ||
    themeColor === "secondary" ||
    themeColor === "tertiary" ||
    themeColor === "inverse" ||
    themeColor === "link"
      ? semantic.text[themeColor]
      : theme[themeColor ?? "text"];

  const variantStyles = {
    small: {
      fontSize: primitives.typography.size.sm,
      lineHeight: primitives.typography.lineHeight.sm,
      fontWeight: primitives.typography.weight.medium,
    },
    smallBold: {
      fontSize: primitives.typography.size.sm,
      lineHeight: primitives.typography.lineHeight.sm,
      fontWeight: primitives.typography.weight.bold,
    },
    default: {
      fontSize: primitives.typography.size.md,
      lineHeight: primitives.typography.lineHeight.md,
      fontWeight: primitives.typography.weight.medium,
    },
    title: {
      fontSize: primitives.typography.size.xxl,
      lineHeight: primitives.typography.lineHeight.xxl,
      fontWeight: primitives.typography.weight.semibold,
    },
    subtitle: {
      fontSize: primitives.typography.size.xl,
      lineHeight: primitives.typography.lineHeight.xl,
      fontWeight: primitives.typography.weight.semibold,
    },
    link: {
      fontSize: primitives.typography.size.sm,
      lineHeight: primitives.typography.lineHeight.md,
    },
    linkPrimary: {
      fontSize: primitives.typography.size.sm,
      lineHeight: primitives.typography.lineHeight.md,
      color: semantic.text.link,
    },
    code: {
      fontFamily: fonts.mono,
      fontWeight: (Platform.select({ android: "700" }) ?? "500") as
        | "400"
        | "500"
        | "600"
        | "700"
        | "bold"
        | "normal",
      fontSize: primitives.typography.size.xs,
      lineHeight: primitives.typography.lineHeight.xs,
    },
  } as const;

  return (
    <Text
      style={[
        { color },
        type === "default" && variantStyles.default,
        type === "title" && variantStyles.title,
        type === "small" && variantStyles.small,
        type === "smallBold" && variantStyles.smallBold,
        type === "subtitle" && variantStyles.subtitle,
        type === "link" && variantStyles.link,
        type === "linkPrimary" && variantStyles.linkPrimary,
        type === "code" && variantStyles.code,
        style,
      ]}
      {...rest}
    />
  );
}
