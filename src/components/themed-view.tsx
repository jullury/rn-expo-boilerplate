import { View, type ViewProps } from "react-native";

import type { ThemeColor } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { semantic } from "@/theme";

type SemanticBackgroundKey = keyof (typeof semantic)["light"]["bg"];

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  type?: ThemeColor | SemanticBackgroundKey;
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  type,
  ...otherProps
}: ThemedViewProps) {
  const scheme = useColorScheme();
  const { semantic } = useThemeTokens();

  const colorScheme = scheme === "unspecified" ? "light" : scheme;
  const colorFromProps = colorScheme === "light" ? lightColor : darkColor;

  const backgroundColor =
    colorFromProps ??
    (type === "canvas" ||
    type === "surface" ||
    type === "muted" ||
    type === "inverse"
      ? semantic.bg[type]
      : type === "background"
        ? semantic.bg.canvas
        : type === "backgroundElement"
          ? semantic.bg.surface
          : type === "backgroundSelected"
            ? semantic.bg.muted
            : semantic.bg.canvas);

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
