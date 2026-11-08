# Invoice template

D133 · Version 0.1 · Internal draft for lawyer and tax review

Use for a specific sale of ordinary goods or services. Bracketed fields are placeholders, not approved defaults. Do not render incomplete conditional sections. This is a billing document, not a payment receipt or substitute for required contract terms. The following customer copy is an original template; it has not been approved by counsel.

---

# Invoice [INVOICE_NUMBER]

**[SELLER_TRADING_NAME]**  
[SELLER_LEGAL_NAME, if different]  
[BUSINESS_ADDRESS]  
[SUPPORT_EMAIL] · [SUPPORT_PHONE]

Issued: [ISSUE_DATE]  
Payment due: [DUE_DATE]  
Order: [ORDER_REFERENCE]  
Customer: [CUSTOMER_NAME_OR_BUSINESS]  
[BILLING_ADDRESS, if needed for this transaction]  
Currency: [ISO_CURRENCY]

| Description | Quantity | Unit price | Line total |
| --- | ---: | ---: | ---: |
| [SPECIFIC_GOOD_OR_SERVICE; scope/period where applicable] | [QUANTITY] | [UNIT_PRICE] | [LINE_TOTAL] |

| Summary | Amount |
| --- | ---: |
| Subtotal | [SUBTOTAL] |
| Discount [DESCRIPTION, if applicable] | [DISCOUNT] |
| Delivery [if applicable] | [DELIVERY_CHARGE] |
| Tax [TYPE/RATE/JURISDICTION, where applicable] | [TAX_AMOUNT] |
| Order total | [ORDER_TOTAL] |
| Prior payments or credits | [APPLIED_AMOUNT] |
| **Amount due now** | **[AMOUNT_DUE]** |

**What happens next**  
[GOODS: Expected shipment date and delivery method, or agreed pickup place/date.]  
[SERVICES: Agreed scope, service date/period, location and material deliverables.]

**Payment**  
Review your order and pay [AMOUNT_DUE] [ISO_CURRENCY] through [APPROVED_HOSTED_PAYMENT_LINK]. Your card statement will show [CONFIRMED_STATEMENT_DESCRIPTOR]. We will provide a payment receipt after successful payment.

**Changes, cancellation and refunds**  
[CLEAR MERCHANT-SPECIFIC TERMS: request method, applicable dates, return conditions, who pays return delivery, any lawful cancellation amount and refund handling.] The terms agreed for order [ORDER_REFERENCE] are available at [SCOPED_ORDER_TERMS_LINK_OR_ATTACHED_VERSION]. This invoice does not change those terms without your agreement.

Questions about this invoice? Contact [SUPPORT_EMAIL_OR_PHONE] and quote [INVOICE_NUMBER]. You may also contact your card issuer about your rights or a disputed charge.

---

## Conditional modules

**Deposit for a future order**

> The order total is [ORDER_TOTAL]. This invoice requests a deposit of [DEPOSIT_DUE] toward that total. The remaining [REMAINING_BALANCE] is due [DATE_OR_DEFINED_EVENT]. The deposit will be applied to the order price. [PLAIN APPROVED DEPOSIT REFUND/CANCELLATION TERMS]. Paying this deposit does not authorize later automatic charges.

Keep an advance payment distinct from escrow, a card security deposit or a completed service. Do not label a deposit nonrefundable without an applicable, disclosed and reviewed basis. Later payments need their own valid authorization.

**Remaining balance**

> This invoice is for the remaining balance of order [ORDER_REFERENCE]. Previous payment receipts: [REFERENCES_AND_AMOUNTS]. The amount due is [AMOUNT_DUE].

**Agreed change**

> Revision [REVISION_ID] dated [DATE] replaces invoice [PRIOR_INVOICE_REFERENCE] for billing purposes. Change: [DESCRIPTION]. Customer agreement to any changed purchase terms: [ACCEPTANCE_REFERENCE]. The prior invoice and payment history remain available.

## Generation and evidence rules

Product-required data: stable invoice/order IDs; seller; customer reference; dated itemization; currency; internally reconciled totals; due date; fulfillment promise; applicable terms reference; scoped checkout destination. Additional legal tax fields and numbering must be configured for the actual merchant jurisdictions.

Do not mark an invoice “Paid” because a link was opened, an agreement accepted or a card authorized. Calculate the amount due from verified payments, refunds and approved credits without erasing earlier transactions. A credit note adjusts billing; it does not prove money was returned.

Do not add Trolleys' merchant document-service fee to the customer's invoice automatically. This package does not authorize card surcharges, convenience fees or tax treatment of such charges. Preserve the rendered invoice version and any later correction. For delivery disputes, attach independent fulfillment records rather than treating the invoice itself as proof.

## Review basis

This invoice is proposed product structure, not a universal statutory form. IRS guidance recognizes several supporting documents and sometimes a combination of records to substantiate a purchase. [IRS supporting records](https://www.irs.gov/businesses/small-businesses-self-employed/what-kind-of-records-should-i-keep)
