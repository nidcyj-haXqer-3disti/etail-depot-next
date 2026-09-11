# Cardholder experience redesign — D66

11 September 2026. The user requested a total Cardholder service redesign after the dashboard made another person's card look like a different, non-purchasing card product. This is an experience redesign of the existing two-service application, preserving every card, person, request, permission and financial record.

## Experience contract

The public reference is Amex’s [mobile account experience](https://www.americanexpress.com/en-us/support/digital/amex-mobile-app/) and [Additional Card Member guidance](https://www.americanexpress.com/en-us/support/additional-card-member/faqs/), checked on 11 September 2026. They support keeping card identity, balance, activity and controls together, and giving additional holders their own access while the primary reviews attributed spending. Etail retains its stricter requirement that secondary members see only their own permitted cards and data. This is a workflow interpretation of published guidance, not access to Amex’s authenticated current dashboard, private architecture or a parity percentage.

The service has a personal spending experience and a clearly labelled management experience. **Your cards** means cards in the signed-in person's name across their permitted relationships. **Cards you manage** means other people's cards for which the signed-in primary has current oversight. These are views of ownership, never new products, roles, services or permission presets. Primary/secondary and virtual/physical remain separate facts.

Home shows a selected own card, its available balance, recent activity and the permitted purchase/freeze actions. It never silently selects someone else's card. A deliberately selected managed card shows its named holder, the primary's management role, controls and activity, and explains that the named holder makes purchases. No disabled purchase form appears for an observer. An own-card restriction explains its actual server-owned reason and relevant next step. A secondary sees only their own permitted cards and has no management navigation.

Cards provides persistent ownership and text filters, applied on the server before pagination. Exact authorized totals distinguish own cards, other people's cards and matching results. The interface never totals money or invents eligibility. Selected resource, filter, pagination, modal closing and browser navigation retain the user's context; an unavailable selection is never replaced silently.

Cardholders is a primary-only people directory. Each person has their named cards, access, invitations and history. Invitation starts with one ordinary cardholder flow; optional restrictions live under access settings. The current server-permitted actions constrain every default. Editing preserves current grants until the primary reviews and explicitly saves changes. Acceptance remains separate from card creation. Requests clearly separate saved work, needs-attention, created cards and canceled history, with one Add card form and one issuance command.

Activity, reports, notification preferences and support remain reachable with the selected card or explicit service context. Existing saved filters, support/operator handoff, frozen-card recovery, immutable history and uncertain-command retries remain intact. Customer copy describes money as practice funds where relevant; no live billing, real card, message delivery or invented spending-limit function is added.

## Ownership and data

The existing policy engine, `getCardProjection`, Cardholder dashboard reader, access service and card commands remain the sole owners. The read model gains a truthful purchase-availability reason and full-scope ownership/search counts. No schema migration, seed, reset, provider change, financial write, new card kind or expanded permission is needed. UI changes consume those projections.

## Acceptance

- Own primary and secondary cards show personal spending actions when permitted. Another person's card shows oversight without a purchase form, including direct URLs.
- Permission-restricted, frozen, empty-balance and incomplete-setup own cards display distinct server-backed explanations. A primary cannot spend as another holder or remove restrictions they cannot control.
- Cards/search/ownership filters work beyond the first page and survive reload/back/close. Counts and results remain scoped, including people in multiple primary relationships.
- Primary invites a person, reviews actual permissions, sees acceptance/waiting, creates through the existing request and finds the exact issued card. Restricted invitation and edit flows preserve least privilege.
- Secondary waiting, no-own-card primary, multiple cards, revoked/unavailable selection, failed commands and same-command recovery remain truthful.
- Desktop, 390px and 320px show legible card identity, balance and next actions; keyboard/focus, axe, overflow and task navigation are checked against the built application.

[Verification evidence](CARDHOLDER_REDESIGN_EVIDENCE.md) records the completed local implementation, passing checks and remaining release boundaries. D65's pushed candidate and pending deployment approval remain separate; this request does not approve changing Netlify's production branch.
