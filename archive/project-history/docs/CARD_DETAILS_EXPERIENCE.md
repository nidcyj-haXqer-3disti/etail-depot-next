# Card details and secured-credit artwork — D149

21 September 2026. The user asks to redesign **The details, up front.** and **How secured credit works.** on `/card-services` so both sections fit the existing product page.

## Visual structure

- Three calm, aligned offer cards cover the minimum security deposit, annual/monthly fees and repayment. Shared icon frames, spacing and warm green/cream colors connect the facts to the existing wallet artwork.
- A separate deposit panel sits beside an illustrated purchase cycle: use the digital wallet card, review the statement, pay in full. On smaller screens the deposit appears first, followed by the purchase sequence.
- The wallet illustration reuses the existing Ledgix card face and supplied logo. Statement and repayment screens follow one explicitly labeled $64 example. They are static artwork, not customer transactions or controls.
- Figure text provides the meaningful explanation. Decorative interface details are hidden from assistive technology. The ordered purchase steps preserve reading order without implying that the deposit pays the purchase bill.

## Facts and limits

The existing product-fact registry remains the source for the $200 minimum deposit, $0 annual and monthly fees and full monthly repayment. Earlier or daily repayment remains optional. Cards are coming soon. Final eligibility, limits, other charges and deposit-return terms remain disclosed as pending before applications open.

This redesign introduces no deposit-to-limit ratio, custody guarantee, issuer commitment, approval promise, interest assumption or deposit-return timing. The deposit backs the account; purchases create a separate balance to repay. No backend, database, payment, issuance or wallet-provisioning operation is added.

## Responsive review

Initial visual checks caught clipped small-screen statement/repayment papers and an amount that exceeded its available width under increased text spacing. Artwork panels now use content-driven height, labels can wrap within the paper, and narrow-screen amounts fit their frame. The deposit switches to a stacked layout before its description becomes cramped. Initial diagnostics are retained alongside final evidence.

See [current status](../planning/STATUS.md) for actual commands, outcomes and review limits. Publication is a separate step; D149 does not deploy the local candidate.
