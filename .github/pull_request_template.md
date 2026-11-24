## Outcome
Describe the user-visible change and its source requirement.

## Implementation
Name the affected business feature or engineering files. Explain changes to public pages, shared styling, approved destinations, documentation or build checks. Note any coordination needed for shared files.

## Verification
Record commands, exit statuses, source revision and relevant browser, accessibility and package evidence.

Review the Guidance change review job summary. For affected pilots, record corrections or why no related change is needed. State whether private skill references were checked locally and whether its instructions were reviewed against this candidate. Use the versioned handoff in `docs/GITHUB_DELIVERY.md`; include only public review status here, never private receipts or paths. Outside-pilot files still need ordinary review; the report is not factual or release approval.

## Limits
Identify checks not performed, including hosted vendor flows or production deployment.

## Release boundaries
- [ ] Only the approved repository and Netlify site are targeted.
- [ ] No local account application, financial APIs, database connection or new customer-data collection.
- [ ] No credentials, customer records or archived database files enter the deployment package.
- [ ] Public links, mobile layouts, accessibility and package checks pass.
- [ ] Current work context and the relevant receipt reflect the change; active documentation links resolve.
- [ ] Review and publication follow the user's authorization.
