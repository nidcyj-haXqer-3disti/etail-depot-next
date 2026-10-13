import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { preparePlatformEmail, verifyPlatformEmailConfiguration } from "../../../tools/netlify-email-compat.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");

export function onBuild({ netlifyConfig }) {
  verifyPlatformEmailConfiguration(root, netlifyConfig);
  preparePlatformEmail(root, { requireGenerated: true });
  console.log("Preserved the enabled Emails integration and applied its reviewed request boundary.");
}

export function onPostBuild({ constants, netlifyConfig }) {
  verifyPlatformEmailConfiguration(root, netlifyConfig);
  if (!constants?.FUNCTIONS_DIST) throw new Error("Netlify did not provide its Functions distribution path.");
  const result = spawnSync(process.execPath, [path.join(root, "tools/verify-architecture.mjs"), "--artifacts", `--functions-dist=${constants.FUNCTIONS_DIST}`], { cwd: root, stdio: "inherit" });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error("The final public release and platform email artifacts did not pass verification.");
}
