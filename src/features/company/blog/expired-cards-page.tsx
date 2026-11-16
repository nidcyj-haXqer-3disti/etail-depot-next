import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { expiredCardsArticle } from "./expired-cards-content";

export function ExpiredCardsPage() {
  return <BlogArticlePage article={expiredCardsArticle}>
    <p>A card is approaching its expiry date. Somewhere in your billing software, that date becomes a reason to email the customer. Update your card, the message says, so your subscription can continue.</p>
    <p>It sounds helpful. But what if the payment provider already has the replacement details? Or the customer uses a different card for this subscription? You have asked someone to interrupt their day to fix a problem you have not yet established.</p>
    <p>Managing expired cards for recurring payments starts before the reminder. The question is whether the next agreed payment still depends on details that need the customer’s attention.</p>

    <section id="check-the-renewal-card" aria-labelledby="check-the-renewal-card-title">
      <h2 id="check-the-renewal-card-title">Check the card the renewal will actually use</h2>
      <p>The date on a physical card is only part of the story. Visa Account Updater lets participating issuers, acquirers and qualified merchants exchange updated account information for recurring and other saved-card payments. An eligible merchant may receive a new expiry date or account number without asking the customer to enter it again.</p>
      <p>That possibility is worth checking, but it is not a reason to assume every renewal is covered. Stripe says automatic card updates depend on issuers participating and supplying the information. Support varies internationally. Its update events can report a new expiry date and last four digits, giving a connected billing system a way to refresh its records.</p>
      <p>For a business sending its own reminders, a list exported last month may already be out of date. Review the current payment record before sending, rather than treating an old expiry list as a confirmed list of customers who need help. Our <Link href="/company/blog/credit-card-account-updater" prefetch={false}>account updater article</Link> explains the possible responses and their limits.</p>
      <p>Then check which saved method belongs to the renewal. A customer can have several cards on file. In Stripe, a subscription’s default payment method takes priority over the customer’s general default; changing only the latter can leave retries using the former. A new card visible somewhere in the account does not settle which card a particular subscription uses.</p>
      <p>The practical question for your billing provider is simple: what will this subscription use next, and are those details current? If your team cannot answer it from the available records, resolve that uncertainty before turning it into a customer warning.</p>
      <p>A card update also does not establish that a future payment will be approved. Keep the notice proportionate to what you know. An approaching expiry date calls for different language from an actual failed collection.</p>
    </section>

    <section id="explain-the-update" aria-labelledby="explain-the-update-title">
      <h2 id="explain-the-update-title">Tell the customer what the update will do</h2>
      <p>When action is needed, identify the subscription and the saved card using its last four digits. Include the next renewal date if your billing record confirms it. Explain that the customer is being asked to update payment details for that renewal, rather than implying they already owe an overdue balance.</p>
      <p>The distinction should survive the click. A page for updating a future payment method should say so. If the same page also requests payment of an outstanding invoice, make that amount and action clear before the customer proceeds.</p>
      <p>Provider behavior matters here. Stripe offers expiring-card emails and a hosted update page. Its documentation says the page can let a customer update the relevant subscription and pay outstanding invoices, where applicable; otherwise the new method is used on the next scheduled attempt. Check the actual flow your business uses before promising that updating a card will, or will not, trigger a payment.</p>
      <p>Direct customers to the secure billing page rather than asking for card details by email. Let them reach it through their usual account as well. When they finish, the confirmation should accurately describe what happened: details saved, a payment completed or another action still needed.</p>
      <p>If a renewal has already failed, use the recorded payment result to decide what happens next. Sending another expiry reminder may no longer fit. Our article on <Link href="/company/blog/dunning-emails" prefetch={false}>failed-payment emails</Link> covers that later conversation.</p>
      <p>Review a reminder from the customer’s side before enabling it. Is there still something to fix? Does the message identify it? Will the destination let them finish the task? A useful expiry warning earns the attention it asks for.</p>
    </section>
  </BlogArticlePage>;
}
