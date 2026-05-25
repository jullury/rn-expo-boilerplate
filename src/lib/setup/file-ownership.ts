import { copyFile, readFile } from "node:fs/promises";

import { GENERATED_MARKER } from "@/lib/setup/constants";

export async function shouldOverwriteManagedFile(filePath: string) {
  try {
    const content = await readFile(filePath, "utf8");
    return content.includes(GENERATED_MARKER);
  } catch {
    return true;
  }
}

export async function backupManagedFile(filePath: string) {
  await copyFile(filePath, `${filePath}.setup.bak`);
}
