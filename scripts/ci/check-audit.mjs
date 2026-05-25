#!/usr/bin/env node
import { readFileSync } from "node:fs";
import path from "node:path";

function loadJson(filePath) {
  const abs = path.resolve(process.cwd(), filePath);
  return JSON.parse(readFileSync(abs, "utf8"));
}

function extractAdvisoryIds(report) {
  if (report && typeof report === "object") {
    if (report.advisories && typeof report.advisories === "object") {
      return Object.keys(report.advisories);
    }
    if (report.vulnerabilities && typeof report.vulnerabilities === "object") {
      const ids = [];
      for (const vuln of Object.values(report.vulnerabilities)) {
        if (!vuln || typeof vuln !== "object") continue;
        if (Array.isArray(vuln.via)) {
          for (const via of vuln.via) {
            if (via && typeof via === "object" && "source" in via) {
              ids.push(String(via.source));
            }
          }
        }
      }
      return Array.from(new Set(ids));
    }
  }
  return [];
}

function main() {
  const reportPath = process.argv[2];
  if (!reportPath) {
    console.error("Usage: node scripts/ci/check-audit.mjs <audit-report.json>");
    process.exit(1);
  }

  const report = loadJson(reportPath);
  const allowlist = loadJson("scripts/ci/audit-allowlist.json");
  const advisories = extractAdvisoryIds(report);
  const known = new Set(allowlist.known_advisories ?? []);

  const unknown = advisories.filter((id) => !known.has(id));
  if (unknown.length > 0) {
    console.error(`Unknown advisories: ${unknown.join(", ")}`);
    process.exit(1);
  }

  console.log("All advisories known and accounted for.");
}

main();
