import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { internationalCardQuotesArticle } from "./international-card-quotes-content";

export function InternationalCardQuotesPage() {
  return <BlogArticlePage article={internationalCardQuotesArticle}>
    <p>The store prices everything in US dollars. Its bank account is in the United States. The owner has never switched on a currency converter. An international card charge can still be entirely consistent with the agreement.</p>
    <p>The missing fact is where the customer’s card was issued. That can differ from the merchant’s country without any currency conversion taking place. A customer visiting the United States or buying from abroad may use that card at the same dollar checkout as everyone else.</p>
    <p>This is a small distinction with consequences for how a merchant evaluates a new market.</p>
    <p>Under Trolleys’ <Link href="/company/legal/fees#calculation" prefetch={false}>calculation terms</Link>, the international-card distinction follows the card’s issuing country as identified in processor data. A currency conversion supplement applies when conversion actually occurs. Reading the two together prevents a merchant from assuming that a dollar payment must be domestic or that every international card payment requires conversion.</p>
    <p>Other providers also distinguish card origin in their pricing. The specific charge and its treatment belong to the account’s agreement. A sales summary grouped only by transaction currency will not necessarily provide enough detail to reproduce it.</p>
    <p>That means a domestic-only forecast can understate the cost of an international expansion even when the website keeps its existing currency. A quote should reflect the expected payment mix, rather than quietly carrying the domestic assumption into a new market.</p>
    <p>Card origin does not describe the whole customer relationship. A visitor paying with a card issued abroad may collect locally, with no international delivery to fund. A buyer overseas may create shipping and return costs as well as payment costs. Either may buy at full price or return regularly. Assigning every international card payment the same commercial value hides the differences the merchant actually needs to price.</p>
    <p>The useful analysis follows the market as a whole: what the store earns after the additional costs, whether customers can complete checkout reliably and whether the business can fulfill its promise. Comparing only the processing percentage can make a profitable market look undesirable or make a difficult market look deceptively easy.</p>
    <p>For a merchant considering expansion, the provider conversation should happen before advertising is scaled. Describe where customers will be, what they will buy and how they will pay. Confirm the approved scope and price it. Currency display, payment acceptance and account approval are related decisions with different answers.</p>
    <p>Growth is easier to judge when the owner can explain why a new customer costs more to serve and what the business earns in return. An unexplained international fee obscures that decision. A clearly priced one becomes part of it.</p>
  </BlogArticlePage>;
}
