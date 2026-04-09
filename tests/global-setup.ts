import { rmSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

export default function globalSetup(): void {
  const testResultsDir = resolve("test-results");
  rmSync(testResultsDir, { recursive: true, force: true });
  mkdirSync(testResultsDir, { recursive: true });
}
