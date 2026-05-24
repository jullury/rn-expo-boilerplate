import { Platform } from "react-native";

export const fonts = {
  sans: Platform.select({
    ios: "System",
    android: "sans-serif",
    default: "System",
  })!,
  serif: Platform.select({
    ios: "Times New Roman",
    android: "serif",
    default: "serif",
  })!,
  mono: Platform.select({
    ios: "Menlo",
    android: "monospace",
    default: "monospace",
  })!,
  rounded: Platform.select({
    ios: "SF Pro Rounded",
    android: "sans-serif-medium",
    default: "System",
  })!,
} as const;
