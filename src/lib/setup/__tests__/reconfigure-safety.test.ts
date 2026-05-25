import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { generateManagedArtifacts } from "@/lib/setup/generator";

describe("generateManagedArtifacts reconfigure safety", () => {
  it("creates .setup.bak when managed marker is missing", async () => {
    const tempDir = await mkdtemp(path.join(os.tmpdir(), "setup-safe-"));

    try {
      const targetFile = path.join(
        tempDir,
        "src/lib/setup/generated/provider-selection.ts",
      );

      await mkdir(path.dirname(targetFile), { recursive: true });

      await writeFile(
        targetFile,
        "export const selectedProvider = 'manual';\n",
      );

      await generateManagedArtifacts(
        {
          version: 1,
          provider: "firebase",
          features: {
            auth: true,
            analytics: false,
            errorReporting: true,
            pushNotifications: false,
            payments: false,
          },
        },
        tempDir,
      );

      const original = await readFile(targetFile, "utf8");
      const backup = await readFile(`${targetFile}.setup.bak`, "utf8");

      expect(original).toContain("manual");
      expect(backup).toContain("manual");
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });
});
