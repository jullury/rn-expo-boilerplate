import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm, stat } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

describe("project:setup CLI flags", () => {
  const setupScript = path.join(process.cwd(), "scripts/setup.mjs");

  it("supports --dry-run and --json without writing files", async () => {
    const tempDir = await mkdtemp(path.join(os.tmpdir(), "setup-flags-"));

    try {
      const { stdout } = await execFileAsync(
        "node",
        [
          setupScript,
          "--yes",
          "--dry-run",
          "--json",
          "--provider",
          "firebase",
          "--features",
          "auth,analytics",
        ],
        { cwd: tempDir },
      );

      const payload = JSON.parse(stdout) as {
        mode: string;
        provider: string;
        features: Record<string, boolean>;
      };

      expect(payload.mode).toBe("dry-run");
      expect(payload.provider).toBe("firebase");
      expect(payload.features.auth).toBe(true);
      expect(payload.features.analytics).toBe(true);
      expect(payload.features.errorReporting).toBe(false);

      await expect(
        stat(path.join(tempDir, "app.setup.json")),
      ).rejects.toThrow();
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });

  it("supports non-interactive provider/features apply mode", async () => {
    const tempDir = await mkdtemp(path.join(os.tmpdir(), "setup-flags-"));

    try {
      await execFileAsync(
        "node",
        [
          setupScript,
          "--yes",
          "--provider",
          "custom",
          "--features",
          "auth,errorReporting",
        ],
        { cwd: tempDir },
      );

      const saved = JSON.parse(
        await readFile(path.join(tempDir, "app.setup.json"), "utf8"),
      ) as {
        provider: string;
        features: Record<string, boolean>;
      };

      expect(saved.provider).toBe("custom");
      expect(saved.features.auth).toBe(true);
      expect(saved.features.errorReporting).toBe(true);
      expect(saved.features.analytics).toBe(false);
      expect(saved.features.pushNotifications).toBe(false);
      expect(saved.features.payments).toBe(false);
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });
});
