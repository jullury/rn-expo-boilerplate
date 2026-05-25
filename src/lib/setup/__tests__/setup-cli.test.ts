import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { runSetupWizard } from "@/lib/setup/cli";

describe("runSetupWizard", () => {
  it("supports provider prompt defaults from existing app.setup.json", async () => {
    const tempDir = await mkdtemp(path.join(os.tmpdir(), "setup-cli-"));

    try {
      await writeFile(
        path.join(tempDir, "app.setup.json"),
        JSON.stringify(
          {
            version: 1,
            provider: "convex",
            features: {
              auth: true,
              analytics: true,
              errorReporting: true,
              pushNotifications: false,
              payments: false,
            },
          },
          null,
          2,
        ),
        "utf8",
      );

      const prompts = {
        selectProvider: jest.fn().mockResolvedValue("firebase"),
        selectFeatures: jest.fn().mockResolvedValue({
          auth: true,
          analytics: false,
          errorReporting: true,
          pushNotifications: false,
          payments: false,
        }),
      };

      await runSetupWizard({ rootDir: tempDir, prompts, logger: jest.fn() });

      expect(prompts.selectProvider).toHaveBeenCalledWith("convex");

      const saved = JSON.parse(
        await readFile(path.join(tempDir, "app.setup.json"), "utf8"),
      );

      expect(saved.provider).toBe("firebase");
      expect(saved.features.analytics).toBe(false);
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });
});
