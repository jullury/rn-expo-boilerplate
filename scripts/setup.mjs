#!/usr/bin/env node

import { printSetupSummary } from "./setup/output.mjs";
import { selectFeatures, selectProvider } from "./setup/prompts.mjs";
import { runSetup } from "./setup/run.mjs";

const config = await runSetup({
  prompts: {
    selectProvider,
    selectFeatures,
  },
});

printSetupSummary(config);
