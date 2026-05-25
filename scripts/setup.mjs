#!/usr/bin/env node

import { printSetupSummary } from "./setup/output.mjs";
import { selectFeatures, selectProvider } from "./setup/prompts.mjs";
import { runSetup } from "./setup/run.mjs";

async function main() {
  const config = await runSetup({
    prompts: {
      selectProvider,
      selectFeatures,
    },
  });

  printSetupSummary(config);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
