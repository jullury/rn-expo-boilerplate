import { readFile } from "node:fs/promises";
import path from "node:path";

describe("setup command naming", () => {
  it("exposes project:setup script for pnpm run invocation", async () => {
    const packageJsonPath = path.join(process.cwd(), "package.json");
    const raw = await readFile(packageJsonPath, "utf8");
    const pkg = JSON.parse(raw) as {
      scripts?: Record<string, string>;
    };

    expect(pkg.scripts?.["project:setup"]).toBe("node ./scripts/setup.mjs");
  });

  it("exposes project:health script for pnpm run invocation", async () => {
    const packageJsonPath = path.join(process.cwd(), "package.json");
    const raw = await readFile(packageJsonPath, "utf8");
    const pkg = JSON.parse(raw) as {
      scripts?: Record<string, string>;
    };

    expect(pkg.scripts?.["project:health"]).toBe("node ./scripts/health.mjs");
  });
});
