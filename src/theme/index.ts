import { fonts } from "./fonts";
import { primitives } from "./primitives";
import { semantic } from "./semantic";

export { fonts, primitives, semantic };

export type ThemeName = "light" | "dark";
export type ThemeSemantic = (typeof semantic)[ThemeName];
export type ThemeTokens = {
  semantic: ThemeSemantic;
  primitives: typeof primitives;
  fonts: typeof fonts;
};
