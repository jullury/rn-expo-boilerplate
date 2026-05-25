import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { GENERATED_MARKER } from "@/lib/setup/constants";
import type { SetupConfig } from "@/lib/setup/types";

export type GenerationResult = {
  created: string[];
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

  await mkdir(setupGeneratedDir, { recursive: true });
  await mkdir(providerGeneratedDir, { recursive: true });

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

  return { created };
}
