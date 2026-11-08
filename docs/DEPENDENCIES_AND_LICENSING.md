# Dependencies and licensing

The active website uses the versions pinned in [package.json](../package.json), [pnpm-lock.yaml](../pnpm-lock.yaml) and [.nvmrc](../.nvmrc). Use one lockfile. Read the installed Next.js documentation before a framework change; preserve the existing reviewed patch in [patches](../patches/).

A dependency upgrade needs a defined reason, review of affected runtime/build behavior, security checks and relevant verification. Do not add database, Identity, financial-processing or API dependencies because an older research document recommended them. The earlier [reuse assessment](../archive/project-history/docs/OPEN_SOURCE_ASSESSMENT.md) is historical, not the active dependency plan.

## Separate reuse scopes

- No repository-wide open-source licence has been selected. Public GitHub visibility does not grant one. Questions go to [compliance@etaildepot.com](mailto:compliance@etaildepot.com).
- Dependency licences apply to their own packages. Preserve their notices and review compatibility for a proposed use.
- Reference data has separate recorded source and licence scope in [tools/reference-release.json](../tools/reference-release.json) and [public/licenses](../public/licenses/). Independent 8583 implementation sources do not grant ISO republication permission. Keep excluded reproduced tables out of source and packages.
- Brand provenance describes the source of an asset, not network sponsorship, provider approval or permission for a new use. Preserve [the asset record](NETWORK_BRAND_ASSETS.md), original bytes and required attribution.
- Previously public archived workbooks and requirements are historical project material. Archiving does not create new reuse permission or turn them into private records.

Changes to reference sources, legal provisions or publication scope require the existing review and exact receipt checks. Do not recalculate a hash merely to bypass a failed source check.
