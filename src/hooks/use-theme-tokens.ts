import { useColorScheme } from "@/hooks/use-color-scheme";
import { fonts, primitives, semantic, type ThemeName } from "@/theme";

export function useThemeTokens() {
  const scheme = useColorScheme();
  const themeName: ThemeName = scheme === "unspecified" ? "light" : scheme;

  return {
    themeName,
    semantic: semantic[themeName],
    primitives,
    fonts,
  };
}
