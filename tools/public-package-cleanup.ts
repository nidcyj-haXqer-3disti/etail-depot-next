import { rmSync } from "node:fs";
import path from "node:path";

/** Remove only the generated outputs owned by the public-site packager. */
export function clearPublicPackageOutputs(netlifyDirectory: string): void {
  for (const entry of ["static", "edge-functions-dist", "public-build.json"]) {
    rmSync(path.join(netlifyDirectory, entry), { recursive: true, force: true });
  }
}
