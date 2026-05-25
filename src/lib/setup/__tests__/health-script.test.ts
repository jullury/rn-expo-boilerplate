import { execFile } from "node:child_process";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
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

      const { stdout } = await execFileAsync("node", [healthScript, "--json"], {
        cwd: tempDir,
      });
      const payload = JSON.parse(stdout) as {
        schemaVersion: number;
        mode: string;
        score: number;
        passed: number;
        total: number;
        recommendations: {
          check: string;
          severity: string;
          recommendation: string;
        }[];
      };

      expect(payload.schemaVersion).toBe(2);
      expect(payload.mode).toBe("strict");
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
      try {
        await execFileAsync("node", [healthScript, "--json"], { cwd: tempDir });
        throw new Error("Expected health script to fail");
      } catch (error) {
        const e = error as { stdout?: string };
        const payload = JSON.parse(e.stdout ?? "{}") as {
          score: number;
          recommendations: { severity: string }[];
        };
        expect(payload.score).toBeLessThan(100);
        expect(payload.recommendations.length).toBeGreaterThan(0);
        expect(
          payload.recommendations.some((r) => r.severity === "critical"),
        ).toBe(true);
      }
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });

  it("supports --output-file for JSON output", async () => {
    const tempDir = await mkdtemp(path.join(os.tmpdir(), "setup-health-"));
    const outputPath = path.join(tempDir, "health.json");

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

      await execFileAsync(
        "node",
        [healthScript, "--json", "--output-file", outputPath],
        {
          cwd: tempDir,
        },
      );

      const payload = JSON.parse(await readFile(outputPath, "utf8")) as {
        schemaVersion: number;
        mode: string;
        score: number;
      };
      expect(payload.schemaVersion).toBe(2);
      expect(payload.mode).toBe("strict");
      expect(payload.score).toBe(100);
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });

  it("prints human-readable summary by default", async () => {
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
      expect(stdout).toContain("Project Health");
      expect(stdout).toContain("Score");
      expect(stdout).toContain("Checks");
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });

  it("supports --warn mode to keep exit code zero for unhealthy projects", async () => {
    const tempDir = await mkdtemp(path.join(os.tmpdir(), "setup-health-"));

    try {
      const { stdout } = await execFileAsync(
        "node",
        [healthScript, "--json", "--warn"],
        {
          cwd: tempDir,
        },
      );

      const payload = JSON.parse(stdout) as {
        mode: string;
        score: number;
      };
      expect(payload.mode).toBe("warn");
      expect(payload.score).toBeLessThan(100);
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });
});
