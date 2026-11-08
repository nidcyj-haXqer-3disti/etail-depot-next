# D134 — Court lessons for payment records and online acceptance

Research reviewed 21 September 2026. Scope: six selected US judicial opinions, read from court or GovInfo publications. This is a focused product-design review, not an all-history survey, legal opinion, case-law citator check or certification that a template is enforceable. No complete later-history or negative-treatment investigation has been performed. Counsel must verify current controlling law for the actual merchant, customer, product and jurisdiction before launch.

The cases answer different questions. Issuer billing-error duties, merchant–processor contract obligations and online contract formation are not interchangeable with a card network's private chargeback decision. A judgment about one does not automatically resolve the others. None establishes a universal invoice, receipt or agreement that defeats every dispute, or a lawful price for an optional documentation service.

## 1. Unauthorized use: DBI Architects v. American Express

**Court/date/citation:** D.C. Circuit, 9 November 2004; *DBI Architects, P.C. v. American Express Travel-Related Services Co.*, 388 F.3d 886, No. 03-7132. [Official opinion](https://media.cadc.uscourts.gov/opinions/docs/2004/11/03-7132a.pdf), especially slip pp. 8–13.

**Facts/posture:** An accounting manager fraudulently obtained a corporate card and paid personal charges with company funds. The corporation appealed summary judgment for Amex.

**Holding:** Failure to inspect statements alone did not create apparent authority; repeated payments after notice did on these facts. The court remanded the §1643 claim to determine when authority arose and otherwise affirmed. Unauthorized-use protection was distinct from billing-error procedures.

**Product inference:** Preserve authority, notices, objections and payment chronology; silence alone is not authorization.

**Limit:** This corporate issuer/cardholder case does not make a merchant invoice proof of authorization. Later payments did not automatically validate every earlier charge. Nor does this erase separate consumer billing-error rights.

## 2. Non-delivery versus quality: Rigby v. FIA Card Services

**Court/date/citation:** Eleventh Circuit, 19 September 2012; *Rigby v. FIA Card Services, N.A.*, 490 F. App'x 230, No. 12-10053, unpublished. [Official opinion](https://media.ca11.uscourts.gov/opinions/unpub/files/201210053.pdf), especially pp. 7–12.

**Facts/posture:** A buyer alleged that a $4,995 travel-club purchase never supplied access credentials. The issuer restored the charge. The appeal challenged dismissal with prejudice.

**Holding:** Taking pleaded facts as true, non-acceptance/non-delivery, timely notice and deficient investigation stated an FCBA claim; dismissal was reversed. Acceptance of performance differs from contract formation. Quality complaints about accepted services were distinguished.

**Product inference:** Record promised and actual performance separately from agreement to purchase. A signed non-cancellation clause did not establish that the promised membership access was delivered.

**Limit:** Unpublished and pleading-stage, not a proven damages victory. Exclusion from this FCBA category does not eliminate other contractual, statutory or network remedies.

## 3. Merchant–processor obligations: PayJunction v. Glasser Images

**Court/date/citation:** Middle District of Georgia, 3 March 2022; *Messiahic, Inc. d/b/a PayJunction v. Glasser Images, LLC*, No. 4:21-cv-204-CDL, ECF 20. [Official GovInfo order](https://www.govinfo.gov/content/pkg/USCOURTS-gamd-4_21-cv-00204/pdf/USCOURTS-gamd-4_21-cv-00204-1.pdf), especially pp. 7–14.

**Facts/posture:** A photography business closed, producing chargebacks and unpaid processing obligations. Defendants did not answer; well-pleaded allegations were treated as admitted on default.

**Holding:** Default judgment awarded $977,241.14 on contract, guaranty and fee claims. A permanent injunction required preserving and supplying relevant records and responding by chargeback-notice deadlines.

**Product inference:** Maintain retrievable originals and response ownership, including after business closure. Generating templates alone cannot satisfy the obligations to supply relevant records and respond to processor notices.

**Limit:** This default judgment applies a specific merchant agreement and guaranty; it did not adjudicate each customer's chargeback. Its five-day production order is not a universal network deadline.

## 4. Notice and affirmative action: Berman v. Freedom Financial Network

**Court/date/citation:** Ninth Circuit, 5 April 2022; *Berman v. Freedom Financial Network, LLC*, 30 F.4th 849, No. 20-16900. [Official opinion](https://cdn.ca9.uscourts.gov/datastore/opinions/2022/04/05/20-16900.pdf), majority discussion at pp. 10–16.

**Facts/posture:** Lead-generation pages placed small gray terms notices near large continuation buttons. Defendants appealed denial of arbitration and reconsideration in a marketing-communications suit.

**Holding:** The majority affirmed. Without actual knowledge, inquiry notice required conspicuous terms notice and unambiguous assent. These pages failed both: proximity alone did not explain that clicking accepted the terms.

**Product inference:** Use readable terms and explicit acceptance wording; preserve the actual screen/version and keep marketing choices separate. Evaluate both desktop and mobile layouts at their actual display size.

**Limit:** This formation ruling applied California/New York principles. It did not decide payment authorization, fulfillment or the underlying marketing claim. Clear assent does not make every contract term lawful.

## 5. A contrasting screen: Meyer v. Uber

**Court/date/citation:** Second Circuit, 17 August 2017; *Meyer v. Uber Technologies, Inc.*, 868 F.3d 66, Nos. 16-2750-cv and 16-2752-cv. [Official GovInfo opinion](https://www.govinfo.gov/content/pkg/USCOURTS-ca2-16-02750/pdf/USCOURTS-ca2-16-02750-0.pdf), especially pp. 24–31.

**Facts/posture:** A smartphone user disputed arbitration after registering through a payment screen. The appeal challenged denial of arbitration; the record included registration screens and account records.

**Holding:** Applying California law, the court found reasonable notice and assent: an uncluttered screen placed conspicuous linked terms and agreement language beside registration. It vacated and remanded; waiver remained for the district court.

**Product inference:** Preserve the actual screen, device presentation, terms version and user event. The court considered spatial and temporal association of the notice with the registration action.

**Limit:** Different layouts, laws or records may change the outcome. This is not universal approval of fine print; its separate waiver discussion is not presented as today's standard.

## 6. Misdescribed consent: Sgouros v. TransUnion

**Court/date/citation:** Seventh Circuit, 25 March 2016; *Sgouros v. TransUnion Corp.*, 817 F.3d 1029, No. 15-1371. [Official GovInfo opinion](https://www.govinfo.gov/content/pkg/USCOURTS-ca7-15-01371/pdf/USCOURTS-ca7-15-01371-0.pdf), especially pp. 9–13.

**Facts/posture:** A credit-score buyer encountered a service-agreement scroll box. Nearby text framed clicking as permission to obtain personal information. TransUnion appealed denial of arbitration.

**Holding:** Applying Illinois law, the court affirmed. The interface did not adequately explain that clicking accepted the service agreement. Its prominent explanation actively misdirected attention to a different consent, despite an acceptance-style button.

**Product inference:** Identify each action plainly; do not disguise agreement acceptance as payment authorization, data permission or channel selection. The surrounding language matters as much as the action button's label.

**Limit:** Fact-specific, not a ban on scroll boxes or approval of every checkbox. Contract formation alone does not prove identity, payment authority or fulfillment.

## Implications for the proposed Trolleys service

These are design recommendations inferred from the selected decisions, not court-mandated UI specifications:

- Keep **agreement acceptance**, **payment authorization/capture**, **delivery of the purchased item or service**, **receipt availability**, and **dispute submission** as separate recorded events.
- Make terms readable before acceptance. Let customers retain the exact version; do not treat a post-payment receipt as acceptance of new restrictions.
- Preserve the original sale description and the relevant actual facts. Do not create missing evidence from template text, fill a signature automatically, or turn a document selection into an admission of delivery.
- Give operators a path to recognize a valid complaint and provide the appropriate remedy. Documentation supports accurate decisions; it does not justify defending every case.
- Preserve the processor notice, its reason and deadline. A document bundle's creation is not proof it was submitted or received by the processor.
- Treat Invoice, enhanced Payment receipt and Agreement as complementary optional tools. Their prices do not establish stronger legal rights, higher win rates or an evidence hierarchy. Required basic receipts and statutory rights remain independent of paid selections.

## Research limits and excluded leads

This review prioritizes an unauthorized-use case, an actual FCBA non-delivery dispute, a merchant-processing contract order and three contrasting formation opinions. It does not estimate chargeback success, survey all MCCs or industries, review every state, or verify the current terms of a Trolleys vendor contract. Default, pleading, summary-judgment and arbitration rulings must not be represented as equivalent trial victories.

Searches also surfaced *Beaumont v. Citibank* through citations, but it is not independently summarized here because this pass did not obtain its own official opinion. The suggested *Langenbach v. Munn* was not verified as a relevant primary case and is not used. No facts or holdings are inferred from case titles, secondary summaries or an AI-generated case brief. Before operational use, legal review needs a current citator/docket check, controlling-jurisdiction analysis and the actual transaction/processor documents.
