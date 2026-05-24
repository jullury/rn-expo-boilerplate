import { useThemeTokens } from "@/hooks/use-theme-tokens";

export function useTheme() {
  const { semantic } = useThemeTokens();

  return {
    text: semantic.text.primary,
    background: semantic.bg.canvas,
    backgroundElement: semantic.bg.surface,
    backgroundSelected: semantic.bg.muted,
    textSecondary: semantic.text.secondary,
  };
}
