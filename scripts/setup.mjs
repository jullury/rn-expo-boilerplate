#!/usr/bin/env node

import { printSetupSummary } from "./setup/output.mjs";
import { selectFeatures, selectProvider } from "./setup/prompts.mjs";
import { runSetup } from "./setup/run.mjs";

async function main() {
  const { previous, next } = await runSetup({
    prompts: {
      selectProvider,
      selectFeatures,
    },
  });

  printSetupSummary(next, previous);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
