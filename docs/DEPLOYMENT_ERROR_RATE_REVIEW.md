# D123 — reported Netlify error percentage

21 September 2026, Asia/Tokyo. The user reported “Errors 9.51%.” Read-only inspection of the bound Netlify project's Overview and Observability confirmed an HTTP request error percentage, with a changing last-hour denominator. The exact earlier 9.51% snapshot was not available.

## Observed production window

At approximately 00:37 JST, the last-hour view contained 1,012 requests:

| HTTP status | Requests |
| --- | ---: |
| 200 OK | 812 |
| 304 Not Modified | 67 |
| 307 Temporary Redirect | 13 |
| 404 Not Found | 16 |
| 410 Gone | 4 |
| 499 Client Disconnected | 100 |
| 5xx server errors | 0 |

The displayed 10.28% reconciles to `(100 + 4) / 1,012`. Netlify classifies 404 separately from client errors. Subsequent reads had more 304 responses while the error counts remained unchanged. This is a request metric, not the percentage of broken pages or unsuccessful customer visits.

The 100 disconnected requests grouped by user agent were:

- 89 Macintosh HeadlessChrome/153 requests, median duration 151 ms.
- 1 Linux HeadlessChrome/153 request, median duration 14 ms.
- 10 iOS NetworkingExtension requests, median duration 713 ms.

The individual list showed many background Next.js `?_rsc=` requests canceled together during 00:32:19–00:32:32 JST. Sample request `01M2ZQ4T4EWSSB9XEM4SR2F1P4` was a HeadlessChrome `/help?_rsc=…` request at 00:32:21.26, lasting 239 ms. These timestamps overlap the recorded D122 final visual run, 00:32:14.975–00:32:32.493 JST. Its harness closes pages after each scenario. This supports test teardown/prefetch cancellation as an explanation for sampled automated traffic; the existing logs do not correlate every request ID, so attribution of all 90 automated requests is not claimed.

The iOS requests at 00:35:04–00:35:05 requested preview/image/icon assets and ended after approximately 320–842 ms. Their precise initiating action and cancellation reason are unverified. A 499 can also occur when a client times out; status alone is not proof that every cancellation is harmless.

## Verification traffic and decision

D122's existing hosted scripts intentionally requested retired financial/API endpoints, producing exactly four 410 responses. Its recorded runs also deliberately generated seven 404 checks. These expected negative checks must keep their truthful status codes; returning success would hide missing/retired resources and weaken the public-only boundary.

No server-error response or application exception was established by this report. D122's completed live SEO and 14 loaded-page desktop/mobile checks remain the application evidence; no new broad probe was run merely to change the metric. No application code, retry/prefetch behavior, database, provider settings, visitor access or deployment was changed. Production remains deploy `6aaffadab7fae6eb884df1af` on site `cbbb6c24-9dbc-43a2-9234-e4357b5b5280`.

Future release checks should record pending requests at page teardown and distinguish canceled background loads from failed customer navigation. A later browser-only window or an actual failing page would provide better evidence of a customer-facing issue than this mixed verification window. No ongoing monitoring is implied.

## Evidence

- Signed-in Netlify [Observability](https://app.netlify.com/projects/etail-depot-next/analytics-and-metrics/observability), read through its visible UI; no private IP addresses retained in this record.
- Existing local evidence: `artifacts/d122-checks/hosted-visual/summary.json`, `hosted-visual.mjs`, `verify-hosted-seo.mjs`, `menu-readiness.json` and publication receipt.
- Netlify [status groups](https://docs.netlify.com/manage/monitoring/observability/reference/status-group/) and [Observability overview](https://docs.netlify.com/manage/monitoring/observability/overview/). Legacy [Function Metrics](https://docs.netlify.com/manage/monitoring/function-metrics/) uses a different Errors definition (5xx only).
- [Cloudflare's 499 explanation](https://developers.cloudflare.com/support/troubleshooting/http-status-codes/4xx-client-error/error-499/) provides general client-disconnection semantics; Netlify's own UI explicitly labels these requests “Client Disconnected.”

Documentation-only validation: `git diff --check` and local evidence-link checks. No application suite rerun or deployment is warranted by this diagnosis alone.
