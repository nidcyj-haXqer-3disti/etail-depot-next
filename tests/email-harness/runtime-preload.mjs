import { register } from "tsx/esm/api";

// One preload also survives the development server's child-process startup.
// The imported transport performs the same pinned, local-only environment checks.
register();
await import("./provider-preload.ts");
