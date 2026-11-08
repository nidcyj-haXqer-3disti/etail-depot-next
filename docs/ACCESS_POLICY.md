# Access boundaries

This is a public marketing website. It has no Etail account/session system or customer role model. Retired identity and permission specifications are preserved in [history](../archive/project-history/docs/ACCESS_POLICY.md), not implemented here.

| Area | Access boundary |
| --- | --- |
| Public pages and approved assets | Readable through the verified public route inventory and hosting boundary |
| Merchant account sign in and registration | Fixed vendor Welcome link with no forwarded input or referrer; the vendor handles access |
| GitHub contributions | Public repository visibility permits reading and proposals, not maintainer or release authority |
| Main branch and production publication | Reviewed source, applicable authorization, exact checks and the manual release process |
| Netlify Emails handler | Existing pinned authenticated POST handler only; no public UI call |
| Development source and build-check records | Public GitHub source where reviewed; never raw website downloads |
| Private records and credentials | Outside public source and deployment artifacts |

Do not add local login, roles, API keys, database connections or payment processing to simplify a vendor journey. Do not change vendor access, GitHub permissions, Netlify protection, Identity, DNS or unrelated resources as part of ordinary website work.

[Security requirements](SECURITY_AND_IDENTITY.md), [file placement](FILE_PUBLICATION_POLICY.md) and [publication procedure](NETLIFY_DEPLOYMENT.md) apply to all contributors.
