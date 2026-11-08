# D215 DNS deployment handoff

> **Completed and verified — 14 October 2026:** the current public website is live at **https://etaildepot.com**, with www/default-Netlify public redirects and trusted HTTPS. PR #41 / source `d8632ae1d0114989fd66149b003954a4d8ba2d3d` is published as ready/current deploy `6acf885a922b0f7283693c75`. Only two Cloudflare web destinations changed; all other 52 records, nameservers, mail and old-project resources are preserved. Separately approved inactive-Netlify-zone deletion resolved certificate provisioning. All 177 HTTP checks, 49 unique browser cases and 24 accessibility cases pass, with one intentional skip and a separately recorded successful ordinary retry after a managed-connection 403. Eighteen matched screenshots are unchanged; 21 alignment states pass. No further DNS work or scheduled cutover remains. The checkpoint below is historical; see current status and `artifacts/d215-domain/` for final evidence and limits.

## Historical preparation checkpoint

Prepared 14 October 2026. **At this earlier checkpoint, deployment was paused until DNS access became available.** The user asked for a dedicated subagent to finish this migration later. This document preserves the work and its limits; it does not schedule monitoring, grant new permissions or authorize a deployment now.

Resume through the `dns_deployment` subagent, or give a replacement agent this document together with [current context](CURRENT_WORK_CONTEXT.md), [status](../planning/STATUS.md), [source precedence](SOURCE_PRECEDENCE.md), [project targets](../project-targets.json) and the [deployment runbook](NETLIFY_DEPLOYMENT.md). Recheck live state when resuming; the observations below are a dated checkpoint.

## Objective and current state

Serve the existing six-page public website at **https://etaildepot.com**, with `www.etaildepot.com` redirecting to the apex and the old Netlify address preserving public bookmarks. Keep the website's design, offers, legal substance and public-only architecture unchanged.

| Item | Verified checkpoint |
| --- | --- |
| Destination | `etail-depot-next`, site `cbbb6c24-9dbc-43a2-9234-e4357b5b5280` |
| Old project | `etail-depot-webapp`, site `e1f23aa8-d7d1-41cd-9f76-8bcbdf05a658` |
| Netlify team | `685ae8f4e6ce519ecf6b267d` |
| Repository | `nidcyj-haXqer-3disti/etail-depot-next`, ID `1361184741` |
| Domain assignments | Apex and www moved to the destination; apex is primary and www is its redirect alias |
| Old project preservation | Project and published deploy `68633c7986befd00082a45f4` remain intact |
| Current public release | D214, deploy `6acf12b74fe02b69c92bcc60`, source `03585117285172fc1238bf1e3e72187c91a4856e` |
| Working public address | https://etail-depot-next.netlify.app |
| Authoritative DNS | Cloudflare; website records still point to the previous website |
| Custom-domain readiness | Traffic switch and valid Netlify HTTPS are pending DNS access and record updates |
| Source preparation | [PR #41](https://github.com/nidcyj-haXqer-3disti/etail-depot-next/pull/41) is draft and unmerged; no D215 deployment or runtime-origin change |

The successful Netlify association is **not** a completed traffic or certificate cutover. A separate Netlify DNS zone exists but is not authoritative and is not a complete replacement for the Cloudflare zone. Do not switch to it.

Evidence is retained locally in `artifacts/d215-domain/assignment-readback.json`, `dns-before-authorized.json`, `dns-after-netlify-assignment.json` and `draft-release-receipt.json`. The original draft receipt contains an earlier in-progress CI snapshot; current status and the later CI readback supersede it.

## Access required before resuming

The user currently lacks Cloudflare access. An authorized administrator must either grant suitable access to the existing `etaildepot.com` zone or make the exact reviewed web-record changes themselves. The user should enter passwords and verification codes only on the provider's website; do not request credentials in chat or store them in this handoff.

Registrar access alone does not let us edit Cloudflare's current zone. Moving nameservers or DNS providers is a **different operation**: it requires a separate user approval, a complete authoritative-zone inventory, a mail/service preservation plan and a reviewed DNSSEC/cutover plan. Public DNS lookups below are a checkpoint, not a complete zone export. Do not infer or reconstruct missing records and proceed with a provider move.

When access is ready, first verify the authenticated account, exact zone, permissions, current web records, TTLs and proxy settings. Refresh the Netlify project/deploy and GitHub PR/source identities as well. Browser tabs, session handles and old element indices are not durable evidence.

## Narrow authorization and preservation requirements

D215 explicitly permits only the apex/www website assignments and required web DNS changes from the recorded source project to the recorded destination, plus the current website's canonical metadata and safe routing changes. The user explicitly approved the domain-only exception after the initial removal was blocked under the older excluded-project restriction. The completed association need not be repeated.

Preserve:

- Cloudflare nameservers, MX, TXT, CAA and all unrelated DNS records, including mail routing, SPF, DKIM, DMARC and service-verification records. Do not repair unrelated existing DNS issues during this task.
- The old project's code, deploy, default hostname, data, Identity, settings and access. No database migration, deletion, restoration or reconnection belongs to this change.
- The destination's enabled Netlify Emails extension, saved configuration, existing secrets and protected authenticated POST handler. Do not expose its preview UI or send a test email.
- Existing visitor access, account ownership, provider integrations, plans and billing. No new project, DNS zone, paid service, account, build hook or replacement resource.
- Trolleys' fixed `https://trolleys.ai` destination and Ledgix's coming-soon status. No financial onboarding, processing, card issuance or vendor action.

The current preparation turn performs no DNS/environment changes, merge or publication. Resume the paused migration only when access is ready and the user asks to continue; the recorded authorization does not require another identical permission question. If new facts require a broader operation, stop that dependent action and explain the specific additional scope.

## DNS baseline and intended website records

Read-only baseline, unchanged after Netlify reassignment:

| Record | Value |
| --- | --- |
| Apex NS | `brenna.ns.cloudflare.com.` and `chance.ns.cloudflare.com.` |
| Apex A | `34.111.179.208` |
| Apex AAAA | None observed |
| www CNAME | `sites.framer.app.` |
| www resolved IPv4 | `31.43.160.6`, `31.43.161.6` through that CNAME |
| Apex MX | Priority 10 `mx1-us1.ppe-hosted.com.`; priority 20 `mx2-us1.ppe-hosted.com.` |
| Apex CAA | None observed |

Exact TXT values are preserved in the local baseline evidence. Compare them without reordering assumptions; do not remove either observed SPF entry or other verification data. The lack of an observed apex AAAA/CAA answer is not proof that every subdomain has been inventoried.

For external DNS, Netlify's previously reviewed guidance supports an apex flattened CNAME/ALIAS to `apex-loadbalancer.netlify.com`, or its documented fallback A record `75.2.60.5`, and a www CNAME to `etail-depot-next.netlify.app`. Before editing, recheck the destination's current domain instructions and [official external-DNS guidance](https://docs.netlify.com/manage/domains/configure-domains/configure-external-dns/). Select one correct apex method; do not add conflicting apex A/AAAA/CNAME destinations. Inspect the actual Cloudflare proxy setting rather than inferring it from public answers; use Netlify's current supported DNS-only configuration without changing unrelated Cloudflare rules.

Capture each affected record's complete previous type, value, TTL and proxy state before changing it. The only intended DNS changes are the website destinations for `etaildepot.com` and `www.etaildepot.com`.

## Staged completion

1. **Re-establish the checkpoint.** Read the current files and live provider state; confirm the domain assignments are still correct, the old project remains intact and the currently published public website is healthy. Confirm Cloudflare account/zone access or coordinate the exact change with its authorized administrator. Record a fresh complete read of affected records and a preservation baseline for mail/unrelated records.
2. **Prepare the exact release while holding publication.** Review PR #41 against current main. If main or the candidate changed, reconcile through the normal feature-branch review and repeat relevant source/CI/package checks. Do not activate the old-host redirect yet. Keep automatic Git publication held and the PR draft until custom-domain readiness is established.
3. **Change only the two website DNS destinations.** Use the currently verified Netlify external-DNS targets. Preserve nameservers and every mail/unrelated record. Read back the saved Cloudflare values and query authoritative/public DNS. Record actual propagation; do not treat elapsed time as success.
4. **Establish custom-domain HTTPS before releasing redirects.** Use Netlify's domain verification/certificate flow for both apex and www. Confirm valid, trusted, hostname-matching HTTPS and that the custom domain serves the existing D214 public website, not the old website. A temporary old canonical in D214 is expected during this stage. Do not bypass TLS validation or publish the default-host redirect while the apex is unready.
5. **Align production origin and release the reviewed source.** Read only necessary nonsecret production settings. `netlify.toml` supplies build `ETAIL_PUBLIC_ORIGIN=https://etaildepot.com`; production **Functions scope**, which also supplies Edge variables, must match. Preserve `APP_ENV`, search context, site binding, preview restrictions, all secrets and unrelated configuration. Perform this runtime-origin change as part of the ready release, then complete reviewed PR merge, merged-source CI and the destination's manual Netlify Git deployment. Do not upload static files alone or omit the protected Emails handler.
6. **Verify exact publication.** Record the ready/current deploy ID, merged commit, tree and package fingerprint; confirm the hosted build, plugin protection, artifact boundary and secret scan. Then run the read-only acceptance below. Fix within the approved scope through a reviewed forward release; do not mask a failing check.
7. **Close the handoff.** Update current context/status and decision records with actual final DNS, certificate, release and acceptance evidence. Keep failures, retries and limitations. Report completion only when website traffic, HTTPS, canonical routing and preserved records are verified.

## Reviewed source and release gates

Prepared candidate:

- GitHub head: `6e22d715307771613578c32de8d1d3721d0ce579`.
- Tree: `f16e45c52163f20e9ba787f995bd94ce9ae70459`; local equivalent commit `21498414723a96d3678e7b00b2438a2f6fe94614`.
- Final package fingerprint: `07ff2cfdbe1aa5ca8d0fd3f6347de58a6a1d8fadf634be19a9a28c79e3f29465`.
- Exact-head CI: push [38527711695](https://github.com/nidcyj-haXqer-3disti/etail-depot-next/actions/runs/38527711695) and PR [38527719067](https://github.com/nidcyj-haXqer-3disti/etail-depot-next/actions/runs/38527719067) both completed successfully, confirmed by the parent agent's fresh read-only check on 14 October 2026.
- Local verification: full `pnpm verify` passed, including 238 unit tests, 65 browser cases plus one intentional skip, 24 accessibility cases, 26 tooling cases, source security, zero dependency advisories, production/preview search guards and package boundaries. Independent source review passed. After removing an unused progress field, the final package was rebuilt and artifact-verified.

Use Node **24.19.0**, pnpm **11.19.0** and the frozen single lockfile. Required candidate checks remain `pnpm verify:public`, `pnpm test:seo:production`, `pnpm package:netlify` and `pnpm verify:package` (`pnpm verify` runs the sequence). Do not run shared-output build/check commands concurrently. Before release, build and verify a fresh isolated extraction of the exact reviewed source; old local output does not certify a different commit.

The candidate changes canonical origin and guards redirects from the exact production default host. It preserves retirement handling before canonical routing, strips obsolete query input, permits public fragment retention, rejects writes and excludes Netlify platform endpoints. Preview/wrong-site contexts stay protected. Keep these properties in review and acceptance.

D214's protected Emails handler SHA256 is `2dffbfc202e26e5997249fda9350986d5d76bd4b50d229740c644f7168225d34`; the D215 candidate introduces no handler change. Expected package remains six public pages, 83 static files, one native Edge boundary and the sole protected Emails function exception. Confirm against the final package, not just this historical expectation.

## Live acceptance and evidence

Prepared harness: `artifacts/d215-domain/acceptance/README.md`. It has **not run against the D215 cutover**. Its release identity fields deliberately remain unset. Fill them only after independently confirming the ready/current deployment and exact source/tree/fingerprint, then use its documented commands sequentially and with paced requests.

- Verify trusted TLS for apex, www and the default hostname, with no certificate-validation bypass.
- Verify apex serves all six routes; www reaches the apex; the exact old Netlify hostname redirects public GET/HEAD bookmarks safely. Verify old product aliases, valid fragments, query stripping, no loops and no redirect to the old project.
- Verify NS/MX/TXT/CAA remain identical to the preserved baseline and inspect affected Cloudflare records directly. Record new A/AAAA/CNAME answers; website checks do not prove mailbox delivery.
- Run the prepared 72 domain GET/HEAD checks and 105 apex HTTP checks for exact page content/assets, canonicals/schema/robots/sitemap, internal destinations, security headers, legal noindex, retired routes and protected Emails read rejection. Investigate platform www redirect precedence where relevant.
- Run the 50 listed browser cases: expected 49 passes and one intentional desktop skip, including 24 accessibility cases, responsive artwork/logo/wallet/fee behavior, 18 full-page captures and 21 Help/legal alignment states. These are expectations, not completed results.
- Preserve noindex for Privacy, Terms, 404, retirement, local and preview contexts; only the four approved discovery pages are eligible. Do not claim actual search indexing or ranking.
- Do not send live POSTs, emails, account requests, payment details or vendor submissions. The acceptance harness is read-only. No new same-candidate hosted preview is planned; record that preview coverage is source/local unless a separate real preview is later approved and verified.

## Rollback and stop conditions

Before cutover, retain the previous web-record values and complete affected-record settings, D214 deploy/source identity and the destination's previous production-origin setting. These are the rollback inputs; no archived database restoration is involved.

If certificate or domain readiness fails before D215 publication, keep the existing public deployment available at its Netlify address and diagnose DNS/TLS. If necessary, restore only the web records changed in this attempt using the captured baseline. Do not alter nameservers, mail records, account access or old resources to force progress.

If D215 is published and must be rolled back, first prevent its default-host redirect from sending users to an unready or restored old website: coordinate the prior verified public deploy and matching production-origin setting on the same destination site before reversing web DNS. Preserve the enabled protected Emails integration. Recheck both hostnames after every rollback stage and record any propagation window. Do not silently move domain assignments back or broaden the rollback into a provider migration.

Stop dependent changes for mismatched site/zone/source identity, missing access, unexpected DNS records requiring broader scope, failed release checks, invalid TLS or incomplete preservation evidence. Keep completed safe preparation; state exactly what remains blocked. This handoff establishes no automatic monitoring or future scheduled execution.
