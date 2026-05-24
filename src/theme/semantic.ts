export const semantic = {
  light: {
    bg: {
      canvas: "#FFFFFF",
      surface: "#F8FAFC",
      muted: "#F1F5F9",
      inverse: "#0F172A",
    },
    text: {
      primary: "#0F172A",
      secondary: "#334155",
      tertiary: "#64748B",
      inverse: "#FFFFFF",
      link: "#2563EB",
    },
    border: {
      default: "#CBD5E1",
      subtle: "#E2E8F0",
      strong: "#94A3B8",
    },
    icon: {
      primary: "#0F172A",
      secondary: "#475569",
      inverse: "#FFFFFF",
    },
    state: {
      info: "#2563EB",
      success: "#16A34A",
      warning: "#D97706",
      danger: "#DC2626",
    },
    focus: {
      ring: "#3B82F6",
    },
  },
  dark: {
    bg: {
      canvas: "#020617",
      surface: "#0F172A",
      muted: "#1E293B",
      inverse: "#F8FAFC",
    },
    text: {
      primary: "#F8FAFC",
      secondary: "#CBD5E1",
      tertiary: "#94A3B8",
      inverse: "#0F172A",
      link: "#60A5FA",
    },
    border: {
      default: "#334155",
      subtle: "#1E293B",
      strong: "#475569",
    },
    icon: {
      primary: "#F8FAFC",
      secondary: "#CBD5E1",
      inverse: "#0F172A",
    },
    state: {
      info: "#60A5FA",
      success: "#4ADE80",
      warning: "#FBBF24",
      danger: "#F87171",
    },
    focus: {
      ring: "#93C5FD",
    },
  },
} as const;
