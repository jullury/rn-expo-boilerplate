export const resources = {
  en: {
    common: {
      appErrorTitle: "Something went wrong",
      learnMore: "Learn more",
    },
    tabs: {
      home: "Home",
      explore: "Explore",
    },
    auth: {
      signInTitle: "Sign in",
      signInDescription: "Minimal auth scaffold for the boilerplate.",
      demoSessionCta: "Continue with demo session",
      expoDocsLink: "Open Expo docs",
      emailLabel: "Email",
      passwordLabel: "Password",
      emailPlaceholder: "you@example.com",
      passwordPlaceholder: "********",
      errors: {
        invalidEmail: "Enter a valid email",
        passwordMin: "Password must be at least 8 characters",
      },
    },
    home: {
      welcome: "Welcome to Expo",
      getStarted: "get started",
      tryEditing: "Try editing",
      devTools: "Dev tools",
      freshStart: "Fresh start",
      resetCommand: "npm run reset-project",
      webDevtools: "use browser devtools",
      shakeDevicePrefix: "shake device or press",
      inTerminalSuffix: "in terminal",
      pressPrefix: "press",
    },
    explore: {
      title: "Explore",
      subtitle:
        "This starter app includes example\ncode to help you get started.",
      expoDocs: "Expo documentation",
      routingTitle: "File-based routing",
      routingLine1Prefix: "This app has two screens:",
      routingLine2Prefix: "The layout file in",
      routingLine2Suffix: "sets up the tab navigator.",
      platformTitle: "Android, iOS, and web support",
      platformBody1:
        "You can open this project on Android, iOS, and the web. To open the web version, press",
      platformBody2: "in the terminal running this project.",
      imagesTitle: "Images",
      imagesBody1: "For static images, you can use the",
      imagesBody2: "and",
      imagesBody3: "suffixes to provide files for different screen densities.",
      colorModeTitle: "Light and dark mode components",
      colorModeBody: "This template has light and dark mode support. The",
      colorModeBody2:
        "hook lets you inspect what the user's current color scheme is, and so you can adjust UI colors accordingly.",
      animationsTitle: "Animations",
      animationsBody1:
        "This template includes an example of an animated component. The",
      animationsBody2: "component uses the powerful",
      animationsBody3: "library to animate opening this hint.",
    },
  },
  fr: {
    common: {
      appErrorTitle: "Une erreur est survenue",
      learnMore: "En savoir plus",
    },
    tabs: {
      home: "Accueil",
      explore: "Explorer",
    },
    auth: {
      signInTitle: "Se connecter",
      signInDescription:
        "Structure d'authentification minimale du boilerplate.",
      demoSessionCta: "Continuer avec la session démo",
      expoDocsLink: "Ouvrir la documentation Expo",
      emailLabel: "E-mail",
      passwordLabel: "Mot de passe",
      emailPlaceholder: "vous@exemple.com",
      passwordPlaceholder: "********",
      errors: {
        invalidEmail: "Saisissez un e-mail valide",
        passwordMin: "Le mot de passe doit contenir au moins 8 caractères",
      },
    },
    home: {
      welcome: "Bienvenue sur Expo",
      getStarted: "commencer",
      tryEditing: "Essayez de modifier",
      devTools: "Outils dev",
      freshStart: "Nouveau départ",
      resetCommand: "npm run reset-project",
      webDevtools: "utilisez les outils de développement du navigateur",
      shakeDevicePrefix: "secouez l'appareil ou appuyez sur",
      inTerminalSuffix: "dans le terminal",
      pressPrefix: "appuyez sur",
    },
    explore: {
      title: "Explorer",
      subtitle:
        "Cette application de démarrage inclut du code\nd'exemple pour vous aider à commencer.",
      expoDocs: "Documentation Expo",
      routingTitle: "Routage basé sur les fichiers",
      routingLine1Prefix: "Cette application a deux écrans :",
      routingLine2Prefix: "Le fichier de layout dans",
      routingLine2Suffix: "configure le navigateur à onglets.",
      platformTitle: "Support Android, iOS et web",
      platformBody1:
        "Vous pouvez ouvrir ce projet sur Android, iOS et le web. Pour ouvrir la version web, appuyez sur",
      platformBody2: "dans le terminal qui exécute ce projet.",
      imagesTitle: "Images",
      imagesBody1:
        "Pour les images statiques, vous pouvez utiliser les suffixes",
      imagesBody2: "et",
      imagesBody3:
        "pour fournir des fichiers adaptés aux différentes densités d'écran.",
      colorModeTitle: "Composants mode clair et sombre",
      colorModeBody:
        "Ce modèle prend en charge le mode clair et sombre. Le hook",
      colorModeBody2:
        "vous permet de vérifier le thème actuel de l'utilisateur afin d'ajuster les couleurs de l'interface.",
      animationsTitle: "Animations",
      animationsBody1:
        "Ce modèle inclut un exemple de composant animé. Le composant",
      animationsBody2: "utilise la puissante bibliothèque",
      animationsBody3: "pour animer l'ouverture de cet indice.",
    },
  },
} as const;

export type AppLocale = keyof typeof resources;
