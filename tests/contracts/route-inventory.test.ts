import { readdirSync,readFileSync } from "node:fs";
import { join } from "node:path";
import { expect,it } from "vitest";
import { generateFoundationOpenApi } from "../../src/platform/http/contracts";

it("every implemented API method has an executable contract and every contract has a route",()=>{
  const actual:string[]=[];
  function walk(directory:string){for(const entry of readdirSync(directory,{withFileTypes:true})){
    const path=join(directory,entry.name);if(entry.isDirectory()){walk(path);continue;}if(entry.name!=="route.ts")continue;
    const route=path.replace(/^src\/app/,"").replace(/\/route\.ts$/,"").replace(/\[([^\]]+)\]/g,"{$1}");
    for(const match of readFileSync(path,"utf8").matchAll(/export\s+(?:async\s+)?function\s+(GET|POST|PUT|PATCH|DELETE)\s*\(/g))actual.push(`${match[1]!.toLowerCase()} ${route}`);
  }}
  walk("src/app/api");
  const declared=Object.entries(generateFoundationOpenApi().paths).flatMap(([path,methods])=>Object.keys(methods).map(method=>`${method} ${path}`));
  expect(actual.sort()).toEqual(declared.sort());
});
