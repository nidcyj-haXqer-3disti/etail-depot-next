import { expect,test } from "vitest";
import { DEVELOPER_NAVIGATION,DEVELOPER_PATHS,DOCUMENTATION_REDIRECTS } from "../../src/shared/site/developer-paths";
import { developerJsonLd,developerMetadata } from "../../src/features/developers/metadata";
import { isPublicContentPath,isIndexablePath } from "../../src/shared/site/public-page-inventory";
import { publicPageRedirect,managedContentRoute } from "../../src/shared/site/public-routes";
import { publicNavigationGroups,publicFooterGroups } from "../../src/shared/site/site-navigation";

test("the eight planned Developer pages share exact menu and footer destinations",()=>{
 expect(DEVELOPER_NAVIGATION.map(page=>page.label)).toEqual(["Getting started","API reference","SDKs","Webhooks","Testing","Developer tools","Changelog","API status"]);
 expect(publicNavigationGroups.find(group=>group.id==="developers")?.sections[0].links).toEqual(DEVELOPER_NAVIGATION);
 expect(publicFooterGroups.find(group=>group.label==="Developers")?.links).toEqual(DEVELOPER_NAVIGATION);
 for(const page of DEVELOPER_NAVIGATION){
  expect(isPublicContentPath(page.href)).toBe(true);expect(isIndexablePath(page.href)).toBe(false);
  const schema=JSON.parse(developerJsonLd(page.slug));
  expect(schema.url).toBe(`https://etaildepot.com${page.href}`);
  expect(developerMetadata(page.slug).alternates?.canonical).toBe(schema.url);
 }
 expect(isPublicContentPath("/docs")).toBe(false);
 expect(isIndexablePath("/resources/merchant-account-setup")).toBe(true);
});

test("old documentation pages redirect only known document aliases to current pages",()=>{
 expect(Object.keys(DOCUMENTATION_REDIRECTS)).toHaveLength(10);
 for(const [old,destination] of Object.entries(DOCUMENTATION_REDIRECTS)){
  expect(isPublicContentPath(old)).toBe(false);expect(isPublicContentPath(destination)).toBe(true);
  for(const suffix of ["","/",".html","/index.html"])expect(publicPageRedirect(old+suffix)).toBe(destination);
  for(const suffix of ["/api",".txt","/__next._full.txt","/unknown"]){expect(publicPageRedirect(old+suffix)).toBeNull();expect(managedContentRoute(old+suffix)).toBe(true);}
 }
 for(const path of DEVELOPER_PATHS)expect(publicPageRedirect(path)).toBeNull();
 for(const path of ["/developers/unknown","/developers/api-reference/secret","/developers%2Fsecret"]){expect(managedContentRoute(path)).toBe(true);expect(isPublicContentPath(path)).toBe(false);}
});
