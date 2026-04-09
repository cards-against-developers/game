import solid from "vite-plugin-solid";
import { defineConfig } from "vite";
import { execSync } from "node:child_process";

export default defineConfig(() => {
  const appBaseUrl = process.env.APP_BASE_URL;

  if (!appBaseUrl) {
    throw new Error(
      "Missing APP_BASE_URL. Set it explicitly for this deployment."
    );
  }

  const buildCommit =
    process.env.BUILD_COMMIT?.trim() ||
    execSync("git rev-parse --short HEAD", { encoding: "utf8" }).trim();
  const buildTimestamp =
    process.env.BUILD_TIMESTAMP?.trim() || new Date().toISOString();

  return {
    base: appBaseUrl,
    plugins: [solid()],
    define: {
      __APP_BUILD_COMMIT__: JSON.stringify(buildCommit),
      __APP_BUILD_TIMESTAMP__: JSON.stringify(buildTimestamp)
    }
  };
});
