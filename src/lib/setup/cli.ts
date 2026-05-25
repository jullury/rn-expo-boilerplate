import { readFile } from "node:fs/promises";
import path from "node:path";

import { generateManagedArtifacts } from "@/lib/setup/generator";
import { safeParseSetupConfig } from "@/lib/setup/config-schema";
import type {
  SetupConfig,
  SetupFeatures,
  SetupProvider,
} from "@/lib/setup/types";

type SetupPrompts = {
  selectProvider: (defaultProvider: SetupProvider) => Promise<SetupProvider>;
  selectFeatures: (defaultFeatures: SetupFeatures) => Promise<SetupFeatures>;
};

type RunSetupWizardArgs = {
  rootDir?: string;
  prompts: SetupPrompts;
  logger?: (message: string) => void;
};

const defaultConfig: SetupConfig = {
  version: 1,
  provider: "supabase",
  features: {
    auth: true,
    analytics: true,
    errorReporting: true,
    pushNotifications: true,
    payments: false,
  },
};

async function loadExistingSetupConfig(rootDir: string): Promise<SetupConfig> {
  try {
    const raw = await readFile(path.join(rootDir, "app.setup.json"), "utf8");
    const parsed = safeParseSetupConfig(JSON.parse(raw));
    return parsed.success ? parsed.data : defaultConfig;
  } catch {
    return defaultConfig;
  }
}

export async function runSetupWizard({
  rootDir = process.cwd(),
  prompts,
  logger,
}: RunSetupWizardArgs) {
  const existing = await loadExistingSetupConfig(rootDir);

  const provider = await prompts.selectProvider(existing.provider);
  const features = await prompts.selectFeatures(existing.features);

  await generateManagedArtifacts(
    {
      version: 1,
      provider,
      features,
    },
    rootDir,
  );

  logger?.("Setup complete");
}
