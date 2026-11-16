import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { apiRateLimitsArticle } from "./api-rate-limits-content";

export function ApiRateLimitsPage() {
  return <BlogArticlePage article={apiRateLimitsArticle}>
    <p>Imagine opening your store’s dashboard on an ordinary morning. Orders are coming in at their usual pace, but your developer reports that the payment integration is sending too many requests. Nothing in the sales figures explains the warning.</p>
    <p>Behind the scenes, a reporting job is reading older transactions. Another process keeps checking unresolved orders. A job that stopped overnight has restarted from the beginning. The business has not suddenly sold more. Its software is asking the payment service to do more work.</p>
    <p>This is why API rate limits deserve a business conversation before they become a checkout problem. An API is the connection software uses to request an action or information. Its traffic includes more than the customers pressing Pay.</p>

    <section id="count-the-work-behind-the-sale" aria-labelledby="count-the-work-behind-the-sale-title">
      <h2 id="count-the-work-behind-the-sale-title">Count the work behind the sale</h2>
      <p>A rate limit controls how many requests a service admits within a period. A concurrency limit controls how many requests remain active at the same time. A system can meet one limit and still run into the other.</p>
      <p>Think of arrivals and unfinished work. If responses take longer, more requests can remain open even when your software has not increased the rate at which it sends them. Stripe documents these as separate limits and identifies whether its limiting response relates to request rate, concurrent work or a particular resource.</p>
      <p>One order is therefore a poor unit for estimating the whole integration’s workload. Your developer should account for the payment actions and lookups the software actually makes. Ask what runs automatically, how frequently it runs and whether a stopped job resumes from its last completed point or repeats everything.</p>
      <p>Averages can hide the moment that matters. A daily report may look comfortable while a scheduled import starts at the same time as a sales campaign. Review that combination before it happens. Ask which jobs can wait and which operations need prompt attention from the customer or your staff.</p>
      <p>Do not assume every operation shares one allowance. The provider may apply limits by account, operation or another boundary. Nor is an API request allowance the same as your approved processing volume or order amount. Changing one does not establish approval to change the other.</p>
      <p>For a Trolleys merchant, that means keeping the technical conversation connected to the business plan. Tell the account team about a material change in sales activity, and have the developer separately confirm the capacity and behavior of the actual gateway connection.</p>
    </section>

    <section id="more-retries-can-mean-less-progress" aria-labelledby="more-retries-can-mean-less-progress-title">
      <h2 id="more-retries-can-mean-less-progress-title">More retries can mean less progress</h2>
      <p>The HTTP status <code>429</code> means “Too Many Requests.” The standard allows the service to include a <code>Retry-After</code> instruction telling the caller how long to wait. It does not define one universal request allowance for every provider.</p>
      <p>Your developer still needs to read the provider’s explanation. Stripe, for example, distinguishes its rate limiting responses from some other 429 responses caused by a lock timeout. The number alone is not a complete diagnosis.</p>
      <p>Repeatedly asking the same question faster is rarely a useful response to a service asking you to slow down. For transaction searches, Cybersource recommends narrowing the request, reducing batch size where appropriate, honoring a supplied wait instruction and avoiding immediate repeated searches. Its guidance also distinguishes search performance from payment processing. A slow or limited search is not proof that a customer’s payment failed.</p>
      <p>The practical improvement may be unglamorous: fewer broad searches, a smaller background batch or a job that does not start again while its previous run is still active. When checkout and background tasks share capacity, ask your developer how nonurgent work is restrained so it does not crowd out customers.</p>
      <p>A queue also needs an owner. If deferred work is never revisited, a quieter error log can hide a growing pile of unfinished tasks. Track how long the oldest item has been waiting, whether the job is progressing and who will investigate work that cannot be completed.</p>
      <p>Payment retries need particular care. Cybersource warns that a missing response can leave a payment’s result unknown even after processing succeeded. Resending can duplicate the operation. Slowing down traffic does not resolve that uncertainty; the original attempt still needs its documented recovery process.</p>
      <p>Your team should be able to distinguish “this report will run later” from “this payment needs investigation.” Neither should silently become a fresh charge or a forgotten customer request.</p>
    </section>

    <section id="prepare-for-the-day-you-want" aria-labelledby="prepare-for-the-day-you-want-title">
      <h2 id="prepare-for-the-day-you-want-title">Prepare for the busy day you want to have</h2>
      <p>A successful promotion is a poor time to find out who maintains your payment connection. Before a launch or major campaign, agree who checks the integration, who can pause background jobs and who handles an account or gateway question.</p>
      <p>Test the customer experience as well as the software response. If work is delayed, does the buyer see a clear status? Can support find the order? Does the eventual result update it correctly? A system that avoids crashing but leaves people wondering whether they paid has more work to do.</p>
      <p>Use a controlled simulation or an arrangement approved by the provider for load testing. Stripe cautions that its sandbox has different limits and timing from live processing and recommends simulating API behavior for load tests. Passing a sandbox checkout is useful functional evidence; it does not certify the capacity of a production setup.</p>
      <p>Trolleys, an Etail Depot service, helps merchants prepare their approved account and payment connection. Our <Link href="/developers/testing" prefetch={false}>integration testing guidance</Link> covers interrupted checkout, delayed results and the account records used to verify an outcome. Your developer or plugin provider remains responsible for the software’s request scheduling and recovery behavior.</p>
      <p>If limits are appearing, bring the affected operation, environment, timestamps, request references and error details to our <Link href="/company/contact#integration" prefetch={false}>account and integration team</Link>. Keep private API credentials and card information out of the report. Evidence about the actual traffic helps separate an account question from an inefficient job or a connection that needs more capacity.</p>
      <p>A limit increase may be worth discussing where the provider permits it. It should come after understanding the workload, not in place of that understanding. More capacity will not make a job that endlessly repeats old work well designed.</p>
    </section>

    <p>The useful target is completed customer orders and reliable follow up. More requests are only valuable when they help your business get there.</p>
  </BlogArticlePage>;
}
