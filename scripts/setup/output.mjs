export function printSetupSummary(config) {
  console.log("\nSetup complete.");
  console.log(`Provider: ${config.provider}`);
  console.log("Features:");
  for (const [key, enabled] of Object.entries(config.features)) {
    console.log(`- ${key}: ${enabled ? "enabled" : "disabled"}`);
  }
  console.log("\nNext steps:");
  console.log("- Review app.setup.json");
  console.log("- Configure provider env vars");
  console.log("- Run: pnpm lint && pnpm typecheck && pnpm test");
}
