import { mkdir, writeFile } from "node:fs/promises";
import { generateFoundationOpenApi } from "../src/platform/http/contracts";
await mkdir("contracts/generated",{recursive:true});
await writeFile("contracts/generated/foundation-openapi.json",JSON.stringify(generateFoundationOpenApi(),null,2)+"\n");
console.log("Generated foundation OpenAPI; planned full-product inventory remains separate.");
