# Reviewed Guides preview

This is the accepted local twenty-guide version, organized under ten sections. It includes the refined reading layout and wording, the existing product artwork and the restored homepage photograph.

The source is preserved here for code review. It does **not** replace the deployed application. The production routes, sitemap, dependencies, Netlify configuration and active website source are unchanged.

## Reproduce locally

Use the repository's pinned Node 24.19.0 and pnpm 11.19.0:

```sh
pnpm install --frozen-lockfile
node tools/guide-review/build.mjs --check
node --test tools/guide-review/preview-assets.test.mjs
node tools/guide-review/build.mjs
node tools/guide-review/preview.mjs
```

Open <http://127.0.0.1:3223/> or <http://127.0.0.1:3223/guides>.

The builder verifies 102 exact baseline files from commit `2097a2da9660cb537ee061d25aeac6e9816ea419`, applies only the 29 source overrides in `manifest.json`, and builds in the ignored `artifacts/guides-review` directory. It never edits the active application. The temporary TypeScript configuration limits compilation to the isolated source; root checks are not relaxed.

The server binds only to loopback. It accepts GET and HEAD, serves a frozen file allowlist, and sends noindex and no-store headers. Source, research, archived articles and sitemaps are not served. Original marketing assets are included by exact file and hash, and the extensionless social image is served as PNG.

To rebuild, first stop the review server and preserve or remove only the generated `artifacts/guides-review` directory. The builder refuses to overwrite an existing review.

## Review status

The accepted source was reviewed across 27 pages at 1440, 390 and 320px, including all twenty guides. Asset checks covered 16 images. Payment examples, wallet switching, sharing illustrations, fee calculations, navigation and mobile layouts passed targeted checks. The original homepage photo was intact; its omission from the local server's allowlist caused the missing image.

This GitHub review bundle excludes earlier search experiments, withdrawn articles, competitor source caches, research workbooks, credentials and generated exports. No next batch is included.

Production integration remains a separate step: adapt the reviewed content into the active route/metadata/structured-data policy, refresh release tests, and obtain deployment authorization. Do not deploy this local review server or treat its intentionally disabled indexing as a production configuration.
