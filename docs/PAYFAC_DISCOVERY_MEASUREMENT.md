# PayFac documentation and discovery measurement

Prepared 30 October 2026 for the local Stage 4 candidate. This is a measurement specification and an exact URL register, not a traffic or ranking report. The candidate has not been published. No analytics script, cookie, session replay or external event transmission was added.

## Page purpose

Commercial pages explain the service, conditions and buying decision. Documentation explains how to carry out a task and what assigned integration details to request. ISO references explain codes and implementation concepts with their source and licence notes. Those are different kinds of demand and must not share a single conversion denominator.

Each documentation article has one compact link to its relevant service or use case. Its topic navigation and useful workflows remain. There are no repeated contact panels or promotional links added to ISO code pages. The documentation overview lists nine unique articles in two task groups. Refunds and disputes share one article even though the overview offers separate section entrances.

## Exact cohorts

The current `exact-urls.csv` in `artifacts/payfac-growth-pages-20261030/` assigns every candidate content URL exactly once. Earlier stage measurement registers remain historical. Use canonical paths only. Fragments do not represent additional pages. Privacy and Terms remain excluded from search.

| Cohort | Exact membership | Primary interpretation |
| --- | --- | --- |
| Merchant services | Merchant services, Online businesses, Merchant onboarding, Payment methods, ACH payments, Changing payment providers, Payouts and reconciliation, Refunds and disputes, Pricing | Merchant service evaluation |
| Software platforms | Software platforms, Platform payment models, Payment partnerships | Platform partnership evaluation |
| Brand and trust | Home, Payment facilitator, Company, Trust, Contact | Brand identity, service model and contact routing |
| Card services | Card services | Separate card inquiry demand; applications remain closed |
| Documentation | Documentation overview and its nine task articles | Integration and operational learning |
| Payment references | Guides and both ISO collections, including set, field and code pages | Technical reference use |
| Account support | Help | Existing customer assistance |
| Legal | Privacy and Terms | Legal information, excluded from search |

Do not classify a visitor's occupation or intent from a page view alone. These are content cohorts, not inferred personal profiles.

## Measurements and evidence

| Measure | Source and calculation | Limits and current state |
| --- | --- | --- |
| Search impressions and clicks | Export Google Search Console and Bing Webmaster page data separately. Join canonical page URLs to the cohort register. Sum clicks and impressions, then calculate CTR as total clicks divided by total impressions. | Hosted baseline not collected in this local stage. Missing data is unknown, not zero. Do not add daily or page average positions without weighting. |
| Search queries | Review branded and nonbranded queries separately, then inspect queries associated with commercial and reference pages. Keep the reporting period, search type, country and device filters with each export. | Query exports can omit data and may not reconcile to page totals. Proposed search topics are not verified demand volumes. |
| Google AI search visibility | Use available Search Console reporting and record the reporting surface used. | Google's AI Overviews and AI Mode traffic is included in overall Web performance. Do not label all organic traffic as AI traffic or claim a separate AI visibility score from this dataset. |
| Merchant application handoff | If approved measurement later exists, count clicks to the fixed `https://trolleys.ai` entrance separately from page views. | No click collector is installed. A click does not establish application submission, approval or activation. Do not append tracking parameters or forward user input to the portal. |
| Qualified platform inquiries | The commercial owner records aggregate inquiries that include a software business, merchant activity, geography and payment flow, then a fit decision. | An email link click is not a sent email or a qualified inquiry. Keep personal details and merchant records outside this public repository. |
| Activation and business outcomes | Reconcile qualified inquiries to aggregate outcomes supplied by the service team. | Requires actual operational evidence and an agreed owner. Do not infer it from a documentation visit or vendor capability. |
| Documentation use | Report documentation page clicks from search separately. Where lawfully available, use hosting aggregate page requests as a different metric. | A server request is not necessarily a person, session, completed task or business lead. Exclude local previews, internal checks and identifiable bots where the data permits. |
| Reference reach | Report ISO collection and code page traffic separately from commercial traffic. | Reference growth does not demonstrate merchant acquisition. Reference traffic stays in the total site report but outside commercial conversion rates. |

## Baseline procedure for the eventual release

1. Before a separately authorized publication, export the last 28 complete days from both search tools. Record export time, reporting timezone, data delay and all filters. Retain the raw exports separately from the normalized workbook.
2. Mark the deployment time and exact commit. The thirteen new commercial routes have no comparable prior page history; classify them as new rather than reporting an infinite growth rate.
3. After 28 complete days following publication, repeat the same filters and cohort assignment. Record indexing status for the principal commercial routes and any indexing errors separately from traffic.
4. Compare clicks, impressions, CTR and recorded inquiry outcomes by cohort. Treat the comparison as observational: crawl timing, seasonality and external activity can also change results.
5. Prioritize the pages that attract relevant queries but fail to communicate a useful next action. Keep operational documentation and technical references useful even when they do not directly produce sales.

No target conversion rate, ranking improvement or response time is assumed. No monitoring automation is scheduled. A hosted baseline remains a release follow up, not a completed measurement in Stage 4.

## Technical baseline and primary guidance

The Stage 4 artifact records exact URLs, canonicals, search eligibility, titles, descriptions, documentation service destinations, internal path and fragment validity, and preservation of reference data and notices. It records local verification independently of future search performance.

[Google link guidance](https://developers.google.com/search/docs/crawling-indexing/links-crawlable) supports ordinary crawlable anchors and descriptive link text. [Google AI feature guidance](https://developers.google.com/search/docs/appearance/ai-features) describes the same underlying search requirements and the reporting limits above. Meeting technical requirements does not guarantee crawling, indexing, ranking or inclusion in AI answers.

## Customer inquiry path, 31 October 2026

The local customer contact refinement distinguishes readiness from interest. Merchant services and Pricing offer an inquiry before an application. Software platforms has its own inquiry context. The provider change page keeps its canonical URL while navigation uses Switch merchant services. The Contact page asks for a website and a short description at first contact. Account review, approval and activation remain separate.

The two sales email links retain their fixed subjects, Software payment partnership and Payment options review, so received messages can be grouped by inquiry type. No visitor input, URL parameters or referral information is copied into the links or forwarded to the merchant portal. Copy email writes only the displayed public company address when requested. It does not transmit an event, read the clipboard, submit an inquiry or count a conversion.

Evaluate the change using received inquiries and their outcomes, not local test results. Record aggregate counts for merchant inquiries, platform inquiries, qualified conversations and completed account outcomes in the operator's existing business records. Use actual Search Console and Bing page data for discovery, with documentation and reference traffic reported separately. A copy or email link click cannot prove that an email was sent. No traffic baseline or conversion lift was established in this work, and no tracking script or collector was installed.

The customer journey review and before and after screenshots are in /Users/yu/Downloads/etail-depot-next/outputs/customer-contact-refinement-20261031/. The review uses representative customer needs; it is not a test with real customers.
