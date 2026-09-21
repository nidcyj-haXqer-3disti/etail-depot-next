# Payment receipt and enhanced record template

D133 · Version 0.1 · Internal draft for acquirer and lawyer review

The basic customer receipt is included regardless of optional document purchases. The proposed 0.1% enhanced service organizes attachments, transaction history and exports. It does not sell the customer access to a required receipt. Validate the final receipt fields and display rules with the processor for each applicable card brand/region.

## Customer receipt

---

# Payment receipt [RECEIPT_NUMBER]

**[SELLER_TRADING_NAME]**  
[SELLER_CITY, STATE/PROVINCE, COUNTRY]  
[BUSINESS_ADDRESS, if applicable]  
[SUPPORT_EMAIL] · [SUPPORT_PHONE]

Payment recorded: [VERIFIED_CAPTURE_DATE_TIME_AND_TIME_ZONE]  
Order: [ORDER_REFERENCE]  
Invoice: [INVOICE_REFERENCE, if any]  
Transaction reference: [SAFE_PROVIDER_REFERENCE]  
Transaction type: Purchase  
Payment method: [CARD_NETWORK] ending [PROVIDER_SUPPLIED_LAST_FOUR]  
Statement description: [CONFIRMED_DESCRIPTOR]  
[PROCESSOR-REQUIRED AUTHORIZATION/TERMINAL FIELDS, supplied through the approved receipt integration]

| Items paid for | Quantity | Amount |
| --- | ---: | ---: |
| [ITEM_OR_SERVICE_DESCRIPTION] | [QUANTITY] | [LINE_TOTAL] |

Subtotal: [SUBTOTAL]  
Discount: [DISCOUNT, if applicable]  
Delivery: [DELIVERY_CHARGE, if applicable]  
Tax: [TAX_DETAILS, where applicable]  
**Amount paid: [CAPTURED_AMOUNT] [ISO_CURRENCY]**

[PARTIAL PAYMENT ONLY: This payment applies to order [ORDER_REFERENCE], whose total is [ORDER_TOTAL]. Amount remaining: [VERIFIED_REMAINING_BALANCE].]

**Delivery or service**  
[AGREED_FULFILLMENT_DETAILS_AND_CURRENT_FACTUAL_STATUS]

**Refunds and support**  
[APPLICABLE_REFUND_POLICY_SUMMARY_AND_VERSION_LINK]. For help, contact [SUPPORT_EMAIL_OR_PHONE] and quote [RECEIPT_NUMBER]. This receipt records payment, not confirmation that you have received or accepted the goods or services. Your rights under applicable law and card-network rules are unchanged.

---

## Linked refund receipt

Issue a separate dated record; do not overwrite the purchase receipt.

> **Refund [REFUND_REFERENCE]**  
> Original payment: [PAYMENT_REFERENCE]  
> Status: [ACTUAL_PROVIDER_STATUS_IN_PLAIN_LANGUAGE]  
> [IF SUCCESSFULLY PROCESSED: Refund processed on [DATE_TIME] for [AMOUNT] [CURRENCY] to [SAFE_MASKED_PAYMENT_METHOD].]  
> [IF REQUESTED/PENDING: Refund requested on [DATE_TIME] for [AMOUNT] [CURRENCY]. It has not yet been confirmed as processed.]  
> Reason/items: [DESCRIPTION]  
> Processor reference: [SAFE_REFUND_REFERENCE, when available]  
> [VERIFIED_PROVIDER_BANK_POSTING_GUIDANCE, if available; otherwise omit a promised arrival date.]

## Restricted enhanced record

This is an internal merchant evidence index, not additional fine print added to the customer's receipt.

| Record group | Stored linkage |
| --- | --- |
| Original sale | Order, itemization, invoice and exact quoted terms |
| Acceptance | Agreement version and actual affirmative acceptance event, if selected and completed |
| Payment history | Verified authorization/capture/reversal/refund identifiers and event times; each state separate |
| Fulfillment | Real shipping/pickup/service records; author/source/date for each attachment |
| Communication | Relevant support/cancellation/refund correspondence, with unnecessary personal data removed |
| Accounting | Gross payment, tax, processor fees, document-service fees and payout reconciliation, when available |
| Integrity | Source, creation time, revision linkage, access/export history and missing-evidence flags |

Export only material relevant to the dispute and permitted by the processor. A completed export is not a filed dispute response or a successful defense. Keep unsubmitted, submitted and accepted-by-processor states separate.

## Generation safeguards

- “Amount paid” requires verified captured payment, not a mere authorization hold. Failed attempts must not produce a paid receipt. A later reversal is recorded explicitly.
- Prefer the processor's authoritative receipt for all network-required fields; preserve it in the enhanced package. Amounts and masked card identifiers must come from provider data, not merchant input.
- A tokenized wallet may use different displayed last digits from a plastic or underlying card. Do not replace provider-supplied values with guessed card digits.
- Never add signatures, identity verification, delivery confirmation or acceptance events that did not occur. Do not place new contract restrictions on a post-payment receipt.
- A refund requested is not a refund processed; a refund processed is not evidence of the bank's posting date.

Mastercard §3.13 covers completed card-not-present and e-commerce receipt delivery. Its field rules include merchant identification, transaction type, masked account information, item details/tax, amount/currency and date, with additional conditional fields. This template intentionally depends on the provider's validated implementation rather than claiming to replace it. [Mastercard Transaction Processing Rules](https://www.mastercard.com/content/dam/mccom/shared/business/support/rules-pdfs/transaction-processing-rules.pdf)
