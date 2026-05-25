import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { generateManagedArtifacts } from "@/lib/setup/generator";

describe("custom provider generation", () => {
  it("creates custom adapter stub when provider is custom", async () => {
    const tempDir = await mkdtemp(path.join(os.tmpdir(), "setup-custom-"));

    try {
      await generateManagedArtifacts(
        {
          version: 1,
          provider: "custom",
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

      const adapterStub = await readFile(
        path.join(tempDir, "src/lib/api/providers/custom/adapter.ts"),
        "utf8",
      );

      expect(adapterStub).toContain("TODO");
      expect(adapterStub).toContain('id: "custom"');
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });
});
