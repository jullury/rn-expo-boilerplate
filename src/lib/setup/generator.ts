import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

import { GENERATED_MARKER } from "@/lib/setup/constants";
import type { SetupConfig } from "@/lib/setup/types";

export type GenerationResult = {
  created: string[];
};

const FEATURE_TO_DIR: Record<keyof SetupConfig["features"], string> = {
  auth: "auth",
  analytics: "analytics",
  errorReporting: "error-reporting",
  pushNotifications: "push-notifications",
  payments: "payments",
};

function providerSelectionContent(config: SetupConfig) {
  return `${GENERATED_MARKER}
export const selectedProvider = ${JSON.stringify(config.provider)} as const;
`;
}

function featureFlagsContent(config: SetupConfig) {
  return `${GENERATED_MARKER}
export const setupEnabledFeatures = ${JSON.stringify(config.features, null, 2)} as const;
`;
}

function adapterResolverContent() {
  return `${GENERATED_MARKER}
import { convexAdapter } from "@/lib/api/providers/convex/adapter";
import { firebaseAdapter } from "@/lib/api/providers/firebase/adapter";
import { supabaseAdapter } from "@/lib/api/providers/supabase/adapter";
import { selectedProvider } from "@/lib/setup/generated/provider-selection";

const providerMap = {
  supabase: supabaseAdapter,
  convex: convexAdapter,
  firebase: firebaseAdapter,
} as const;

export function resolveApiProviderAdapter() {
  return providerMap[selectedProvider] ?? supabaseAdapter;
}
`;
}

export async function generateManagedArtifacts(
  config: SetupConfig,
  rootDir = process.cwd(),
): Promise<GenerationResult> {
  const created: string[] = [];

  const setupGeneratedDir = path.join(rootDir, "src/lib/setup/generated");
  const providerGeneratedDir = path.join(
    rootDir,
    "src/lib/api/providers/generated",
  );
  const featuresGeneratedDir = path.join(rootDir, "src/features/generated");
  const appGeneratedDir = path.join(rootDir, "src/app/generated");

  await mkdir(setupGeneratedDir, { recursive: true });
  await mkdir(providerGeneratedDir, { recursive: true });
  await mkdir(featuresGeneratedDir, { recursive: true });
  await mkdir(appGeneratedDir, { recursive: true });

  const setupFile = path.join(rootDir, "app.setup.json");
  await writeFile(setupFile, `${JSON.stringify(config, null, 2)}\n`, "utf8");
  created.push("app.setup.json");

  const providerSelectionFile = path.join(
    setupGeneratedDir,
    "provider-selection.ts",
  );
  await writeFile(
    providerSelectionFile,
    providerSelectionContent(config),
    "utf8",
  );
  created.push("src/lib/setup/generated/provider-selection.ts");

  const featureFlagsFile = path.join(setupGeneratedDir, "feature-flags.ts");
  await writeFile(featureFlagsFile, featureFlagsContent(config), "utf8");
  created.push("src/lib/setup/generated/feature-flags.ts");

  const adapterResolverFile = path.join(
    providerGeneratedDir,
    "adapter-resolver.ts",
  );
  await writeFile(adapterResolverFile, adapterResolverContent(), "utf8");
  created.push("src/lib/api/providers/generated/adapter-resolver.ts");

  for (const [feature, enabled] of Object.entries(config.features) as [
    keyof SetupConfig["features"],
    boolean,
  ][]) {
    const featureDirName = FEATURE_TO_DIR[feature];
    const featureDir = path.join(featuresGeneratedDir, featureDirName);
    const appDir = path.join(appGeneratedDir, featureDirName);

    if (!enabled) {
      await rm(featureDir, { recursive: true, force: true });
      await rm(appDir, { recursive: true, force: true });
      continue;
    }

    await mkdir(featureDir, { recursive: true });
    await mkdir(appDir, { recursive: true });

    await writeFile(
      path.join(featureDir, "index.ts"),
      `${GENERATED_MARKER}\nexport const ${feature}Enabled = true;\n`,
      "utf8",
    );
    created.push(`src/features/generated/${featureDirName}/index.ts`);

    await writeFile(
      path.join(appDir, "index.ts"),
      `${GENERATED_MARKER}\nexport const ${feature}RouteEnabled = true;\n`,
      "utf8",
    );
    created.push(`src/app/generated/${featureDirName}/index.ts`);
  }

  return { created };
}
