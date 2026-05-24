/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import "@/global.css";

import { Platform } from "react-native";

import { fonts, primitives, semantic } from "@/theme";

export const Colors = {
  light: {
    text: semantic.light.text.primary,
    background: semantic.light.bg.canvas,
    backgroundElement: semantic.light.bg.surface,
    backgroundSelected: semantic.light.bg.muted,
    textSecondary: semantic.light.text.secondary,
  },
  dark: {
    text: semantic.dark.text.primary,
    background: semantic.dark.bg.canvas,
    backgroundElement: semantic.dark.bg.surface,
    backgroundSelected: semantic.dark.bg.muted,
    textSecondary: semantic.dark.text.secondary,
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = fonts;

export const Spacing = {
  half: primitives.spacing[2],
  one: primitives.spacing[4],
  two: primitives.spacing[8],
  three: primitives.spacing[16],
  four: primitives.spacing[24],
  five: primitives.spacing[32],
  six: primitives.spacing[64],
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
