import { execFile } from "node:child_process";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

describe("project:health script", () => {
  const healthScript = path.join(process.cwd(), "scripts/health.mjs");

  it("returns score 100 when required setup artifacts exist", async () => {
    const tempDir = await mkdtemp(path.join(os.tmpdir(), "setup-health-"));

    try {
      await mkdir(path.join(tempDir, "src/lib/setup/generated"), {
        recursive: true,
      });
      await writeFile(
        path.join(tempDir, "app.setup.json"),
        JSON.stringify({ version: 1 }, null, 2),
        "utf8",
      );
      await writeFile(
        path.join(tempDir, "src/lib/setup/generated/provider-selection.ts"),
        "export const selectedProvider = 'supabase' as const;\n",
        "utf8",
      );
      await writeFile(
        path.join(tempDir, "src/lib/setup/generated/feature-flags.ts"),
        "export const setupEnabledFeatures = {};\n",
        "utf8",
      );
      await writeFile(
        path.join(tempDir, "src/lib/setup/generated/env-contract.ts"),
        "export const setupEnvContract = { requiredKeys: [] } as const;\n",
        "utf8",
      );
      await mkdir(path.join(tempDir, ".github/workflows"), { recursive: true });
      await writeFile(
        path.join(tempDir, ".github/workflows/security.yml"),
        "name: Security\n",
        "utf8",
      );
      await writeFile(
        path.join(tempDir, "package.json"),
        JSON.stringify(
          {
            scripts: {
              "project:setup": "node ./scripts/setup.mjs",
              "project:health": "node ./scripts/health.mjs",
            },
          },
          null,
          2,
        ),
        "utf8",
      );

      const { stdout } = await execFileAsync("node", [healthScript], {
        cwd: tempDir,
      });
      const payload = JSON.parse(stdout) as {
        schemaVersion: number;
        score: number;
        passed: number;
        total: number;
        recommendations: string[];
      };

      expect(payload.schemaVersion).toBe(2);
      expect(payload.score).toBe(100);
      expect(payload.passed).toBe(payload.total);
      expect(payload.recommendations).toEqual([]);
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });

  it("returns non-zero and recommendations when required artifacts are missing", async () => {
    const tempDir = await mkdtemp(path.join(os.tmpdir(), "setup-health-"));

    try {
      await expect(
        execFileAsync("node", [healthScript], {
          cwd: tempDir,
        }),
      ).rejects.toThrow();
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });
});
