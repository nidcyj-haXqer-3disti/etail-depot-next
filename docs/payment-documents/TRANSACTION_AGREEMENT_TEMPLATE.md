# Transaction agreement template

D133 · Version 0.1 · Internal original draft for lawyer review

Scope: a single US general-commerce purchase. No recurring billing, automatic future charges, lending, arbitration, liability release, statutory-rights waiver or choice-of-law/forum default is supplied. Special industries and jurisdictions require their own reviewed modules. A merchant must complete accurate terms before presenting the document; a lawyer must review them and the acceptance workflow before launch.

## Customer agreement

---

# Your purchase agreement

Agreement: [AGREEMENT_ID] · Version [VERSION]  
Date: [ISSUE_DATE] · Order: [ORDER_REFERENCE]

**Seller**  
[SELLER_LEGAL_NAME] trading as [SELLER_TRADING_NAME]  
[BUSINESS_ADDRESS]  
[SUPPORT_EMAIL] · [SUPPORT_PHONE]

**Customer**  
[CUSTOMER_NAME_OR_BUSINESS]  
[TRANSACTION_CONTACT]  
[IF A BUSINESS: representative's name and role]

### 1. Your order

You are purchasing [PRECISE_ITEMS_OR_SERVICE_SCOPE], as described in the order summary attached to this agreement. The summary identifies the quantities, included work, relevant specifications and any expressly excluded work.

### 2. Price and payment

The order total is [TOTAL] [CURRENCY], including [ITEMIZED_TAX_AND_OTHER_CUSTOMER_CHARGES]. The amount due now is [AMOUNT_DUE_NOW]. [IF APPLICABLE: A remaining balance of [AMOUNT] is due [DATE_OR_DEFINED_EVENT].]

Payment is made through the checkout presented for this order. Accepting this agreement does not by itself charge your card or authorize another payment. We will provide a receipt for each successful payment. Your card statement will show [CONFIRMED_DESCRIPTOR].

### 3. Delivery or service

[GOODS: Goods will be shipped by [DATE] using [METHOD] to [CUSTOMER_CONFIRMED_DESTINATION], with [EXPECTED_DELIVERY_WINDOW]. OR goods will be available for pickup at [PLACE] on [DATE/TIME].]

[SERVICES: We will provide [DELIVERABLES] on/during [DATE/PERIOD] at/by [LOCATION_OR_DELIVERY_METHOD]. Any customer information or access reasonably needed is [SPECIFIC_DEPENDENCIES].]

We will tell you about a material delay and explain your available choices, including cancellation or refund rights that apply. A shipping update, page view or payment receipt does not by itself establish that you received or accepted the order.

### 4. Changes, cancellation and returns

To request a change, cancellation or return, contact [WORKING_METHOD]. [CLEAR_APPROVED_RULES: applicable deadlines; method; return destination and delivery costs; treatment of completed work; any lawful and proportionate cancellation amount; refund process.]

Material changes to price, scope or timing require your agreement. Your statutory cancellation, refund, warranty and other consumer rights apply even where this agreement does not list them.

### 5. Problems with the order

Please contact [SUPPORT_METHOD] if something is missing, incorrect or not as agreed so we can help. Contacting us is not a condition of exercising any right to contact your card issuer, raise a billing error or dispute a payment. This agreement does not remove those rights or make a payment non-disputable.

### 6. Record of your agreement

You can review and save this agreement and the attached order summary before accepting. Your acceptance applies to the version shown above. We will make a copy available to you at [ACTUAL_DELIVERY_OR_DOWNLOAD_METHOD].

**[Unchecked checkbox]** I have reviewed and agree to this purchase agreement, including the order, price, delivery or service details, and cancellation and refund terms.

[NAME_FIELD, if used]  
[IF BUSINESS: I am authorized to place this order for [CUSTOMER_BUSINESS].]

**Agree and continue to payment**

---

## Conditional deposit clause

> You are paying [DEPOSIT_AMOUNT] toward the total price of [ORDER_TOTAL]. The deposit [CLEAR PURPOSE]. It will be applied to the order price. If [CANCELLATION_EVENT], [SPECIFIC REVIEWED REFUND/TREATMENT]. The balance of [BALANCE] is due [DATE_OR_EVENT]. We will not automatically charge that balance based solely on your acceptance of this agreement.

Do not default to “all deposits nonrefundable.” This clause must be lawful for the merchant, industry and customer jurisdiction, plainly disclosed and consistent with the actual sale.

## Acceptance implementation requirements

These are design requirements, not evidence that an e-signature provider exists.

- Render the final complete agreement and order summary before payment; let the customer correct errors and retain a copy. Material changes invalidate earlier acceptance for the changed terms and require a new affirmative action.
- Save agreement ID/version, the exact rendered content, referenced attachments, the displayed acceptance text, transaction linkage, customer reference, event time with time zone, and the actual affirmative action. Retain a content hash as an integrity check, not a claim of signer identity.
- Keep consent separate from payment authorization and marketing. No prechecked boxes, agreement inferred from email opening, signature inserted automatically, or retroactive acceptance.
- Record only actual verification methods. An IP address, browser record, typed name or link access is not conclusive proof of identity. Collect device/network data only where justified, disclosed and lawful.
- If a law requires information in writing and the provider relies on electronic delivery, counsel must determine E-SIGN/UETA applicability, disclosures, affirmative consent, access demonstration, withdrawal/paper-copy process and exceptions. The checkbox above alone is not asserted to satisfy every electronic-record requirement.
- Customer copies must remain readable and accessible. Withdrawal of electronic delivery consent, where applicable, must follow the disclosed process without erasing a previously valid transaction record.

Federal E-SIGN preserves substantive rights and addresses electronic records, retention and consumer consent where written information is legally required. Electronic form alone is not a complete enforceability analysis. [15 USC §7001](https://www.govinfo.gov/content/pkg/USCODE-2023-title15/pdf/USCODE-2023-title15-chap96.pdf), [FTC electronic-signature guidance](https://www.ftc.gov/legal-library/browse/advisory-opinions/advisory-opinion-zalenski-05-24-01)

CFPB's Regulation Z includes billing errors involving goods or services not accepted or delivered as agreed; its commentary states that merchant contact is not a prerequisite to notifying the creditor for that category. This template preserves that distinction. [CFPB §1026.13(a)(3)](https://www.consumerfinance.gov/rules-policy/regulations/1026/13/)

For covered merchandise orders, FTC rules require a reasonable shipment basis and appropriate delay consent or refunds. Merchant terms cannot replace those obligations. [FTC Mail, Internet, or Telephone Order Merchandise Rule](https://www.ftc.gov/legal-library/browse/rules/mail-internet-or-telephone-order-merchandise-rule)
