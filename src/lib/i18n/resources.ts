export const resources = {
  en: {
    common: {
      appErrorTitle: "Something went wrong",
    },
    auth: {
      signInTitle: "Sign in",
      signInDescription: "Minimal auth scaffold for the boilerplate.",
      demoSessionCta: "Continue with demo session",
      expoDocsLink: "Open Expo docs",
    },
  },
  fr: {
    common: {
      appErrorTitle: "Une erreur est survenue",
    },
    auth: {
      signInTitle: "Se connecter",
      signInDescription:
        "Structure d'authentification minimale du boilerplate.",
      demoSessionCta: "Continuer avec la session démo",
      expoDocsLink: "Ouvrir la documentation Expo",
    },
  },
} as const;

export type AppLocale = keyof typeof resources;
