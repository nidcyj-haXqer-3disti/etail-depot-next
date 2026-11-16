import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { currencyBalancesArticle } from "./currency-balances-content";

export function CurrencyBalancesPage() {
  return <BlogArticlePage article={currencyBalancesArticle}>
    <p>If an overseas customer pays you in euros and a supplier needs euros next month, converting the receipt into dollars and then buying euros again may add cost without helping either transaction.</p>
    <p>That is a practical reason to consider a multicurrency account. It lets you hold or manage more than one currency, subject to the product’s terms. The value comes from what your business can do with those balances.</p>
    <p>Start with the receipts and bills you expect. If most of your costs are in dollars, keeping every overseas receipt in its original currency could leave you short of the money needed for payroll while another balance sits unused. The account should serve your cash plan.</p>

    <section id="give-the-balance-a-purpose" aria-labelledby="give-the-balance-a-purpose-title">
      <h2 id="give-the-balance-a-purpose-title">Give the balance a purpose and a date</h2>
      <p>Take a hypothetical business that receives EUR 7,500 and has a confirmed EUR 6,000 supplier bill due next month. If its account supports both movements, retaining the euros needed for that bill can avoid converting that portion into dollars and back again. Receiving and sending fees may still apply.</p>
      <p>The remaining EUR 1,500 needs a separate decision. At an assumed USD 1.10 per euro, its dollar equivalent is USD 1,650. At USD 1.05, it is USD 1,575. Those are illustrative rates, excluding fees. The EUR balance has not changed, but its dollar equivalent has fallen by USD 75.</p>
      <p>Holding the currency did not remove exchange-rate exposure. It kept euros available for euro spending. Waiting for a better rate is a separate choice, with a possible downside and no guaranteed improvement.</p>
      <p>The dates matter as much as the amounts. A supplier bill due before the customer pays cannot be funded by that expected receipt yet. A bill due after your next payroll does not mean the same money is available for both. Separate confirmed balances from expected receipts and amounts already committed.</p>
      <p>Decide who can convert funds, who can approve a payment and when unused balances will be reviewed. Include account charges, transfer costs and the time spent reconciling another currency. An occasional foreign invoice may be easier to handle through an existing supported payment service than through a balance maintained all year.</p>
    </section>

    <section id="check-the-complete-payment" aria-labelledby="check-the-complete-payment-title">
      <h2 id="check-the-complete-payment-title">Check how the money gets in and out</h2>
      <p>A currency appearing in an app does not establish that every payment in that currency is supported. Holding money, receiving it from a customer, collecting a merchant payout and sending it to a supplier are separate capabilities. Confirm the particular movements your business needs.</p>
      <p>Wise’s account documentation makes a useful distinction: its receiving details are ways to pay into the account, rather than separate accounts for each set of details. It also explains that adding a currency does not change the account’s location or the legal terms determined by the registered address. A familiar currency symbol is not evidence that your company has opened a bank account in that country.</p>
      <p>For an incoming payment, establish which account details and payment method the sender must use, whether that source of funds is accepted and whether the money will stay in the intended currency. For the supplier bill, confirm that the account can make the required payment to that destination, with the right reference and enough time before the due date.</p>
      <p>Ask for the actual conversion quote and fees when a conversion is needed. A rate shown on a balance screen may be a valuation rather than the rate at which a transaction can be completed. Keep the quote and the completed transaction record so your accounts team can explain the difference.</p>
      <p>This is particularly important when connecting merchant services. A customer paying with a foreign-issued card does not establish that your merchant payout will arrive in that card’s currency. The charge, settlement and funding arrangements need to be checked separately.</p>
      <p>Trolleys, an Etail Depot service, helps merchants follow <Link href="/services/payouts" prefetch={false}>payment activity through to their bank deposit</Link>. Our current <Link href="/company/legal/payouts-and-reserves#scope" prefetch={false}>funding terms</Link> cover USD payouts to approved US bank accounts. Opening a multicurrency product elsewhere does not change those terms or automatically make it an eligible payout destination.</p>
      <p>Before changing a Trolleys payout account, contact <Link href="/company/contact#account-support" prefetch={false}>account support</Link> to confirm the approved process and destination requirements. Keep merchant account and gateway <Link href="/services/reconciliation" prefetch={false}>report reconciliation</Link> distinct from any later currency conversion or supplier transfer you arrange through another provider.</p>
    </section>

    <section id="know-who-holds-the-money" aria-labelledby="know-who-holds-the-money-title">
      <h2 id="know-who-holds-the-money-title">Know who holds the money</h2>
      <p>“Multicurrency account” describes a useful feature, but it does not identify the legal product. It may involve bank deposits or balances with a nonbank payment provider. Read the terms for the entity serving your business and the product you are actually using.</p>
      <p>Even bank products differ in access. HSBC’s UK international account range, for example, includes current accounts, savings accounts and fixed-term deposits. Its fixed-term product restricts withdrawals until maturity. Money intended for a supplier bill needs access conditions that fit the bill’s due date.</p>
      <p>For US deposit protection, the FDIC distinguishes an insured bank’s failure from a nonbank company’s failure. Eligible deposits held through a nonbank may qualify for pass-through coverage only when the required conditions are met. The insurance does not cover the insolvency or bankruptcy of the nonbank itself.</p>
      <p>Identify the bank or provider holding the funds, whose name the account is in and what protection applies to that arrangement. Verify any claimed bank insurance with the relevant scheme. An insurance claim and uninterrupted access to an app are different questions; the FDIC also notes that technology problems at a nonbank can interrupt access.</p>
      <p>Before moving recurring receipts or money needed for critical bills, confirm the setup and test the permitted payment route with an authorized, controlled transaction. Check the receiving record, fees and usable balance, then confirm that the intended outgoing payment works. A successful transfer in one currency does not validate every other currency or destination.</p>
      <p>A useful multicurrency account earns its place by making specific business payments easier to manage. Give each balance a purpose, an owner and a review date. Then judge the account by the costs it avoids and the obligations it helps you meet.</p>
    </section>
  </BlogArticlePage>;
}
