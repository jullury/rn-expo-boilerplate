import { DarkTheme, DefaultTheme, Slot, ThemeProvider } from "expo-router";
import { useColorScheme } from "react-native";

import { AppErrorBoundary } from "@/components/app-error-boundary";
import { AnimatedSplashOverlay } from "@/components/animated-icon";
import { AppProviders } from "@/providers/app-providers";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <AppErrorBoundary>
        <AppProviders>
          <AnimatedSplashOverlay />
          <Slot />
        </AppProviders>
      </AppErrorBoundary>
    </ThemeProvider>
  );
}
