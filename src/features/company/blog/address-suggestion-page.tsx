import { BlogArticlePage } from "./article-page";
import { addressSuggestionArticle } from "./address-suggestion-content";

export function AddressSuggestionPage() {
  return <BlogArticlePage article={addressSuggestionArticle}>
    <p>An address tool finds the building. The customer accepts the suggestion. The form fills itself in, the checkout looks complete and the apartment number is gone.</p>
    <p>The order can still look successful to everyone watching payments. The cost appears later, when a parcel cannot be delivered or support has to ask the customer for information they already entered. A checkout review that stops at the paid order would count this as success and miss the mistake that fulfillment inherits.</p>
    <p>Address assistance should reduce that work. It should not give a plausible suggestion more authority than the customer’s actual destination.</p>

    <section id="suggestion-is-not-instruction" aria-labelledby="suggestion-is-not-instruction-title">
      <h2 id="suggestion-is-not-instruction-title">Show what changed before accepting the change.</h2>
    <p>Autocomplete, address validation and delivery eligibility answer different questions. One suggests an address while the customer types. Another checks its components. The merchant still needs to determine whether the selected service can deliver the order there.</p>
    <p>Google’s checkout address-validation guidance distinguishes addresses that need correction, confirmation or acceptance. It also allows for retaining an entered address and flagging it for review where the merchant’s process supports that. A warning from an address service is information to handle, not proof that the customer does not know where they live.</p>
    <p>A proposed correction needs to show the complete address. Otherwise the customer may approve a familiar street while missing a changed ZIP code. Where the merchant can accept the original, keeping it should be a clear choice. Where it cannot, the buyer needs the actual reason and a way to resolve it.</p>
    <p>That choice does not require the business to ship beyond its coverage or disregard a fraud check. “We do not deliver to this destination” is a different message from “We could not confirm this address.” Conflating them can leave the shopper trying unrelated edits to solve a restriction that cannot be edited away.</p>
    </section>

    <section id="unit-details" aria-labelledby="unit-details-title">
      <h2 id="unit-details-title">Make room for the part of the address the building search missed.</h2>
    <p>Apartment, suite and unit details deserve recognizable wording. A generic “Address line 2” may mean little to a customer who sees one street address and considers the form finished. An optional control can be unobtrusive while still clearly available to the people who need it.</p>
    <p>The dangerous handoff can happen after the unit has been entered. In such an order, selecting a new street suggestion could replace several fields at once, including the apartment. The address tool may have improved its own match while making the delivery address worse. Following the unit into the saved order and the shipping label reveals whether that assistance preserved the destination the buyer confirmed.</p>
    <p>The U.S. Web Design System warns against limiting domestic addresses to one conventional format; rural areas and U.S. territories can require different details. A merchant’s address lookup should therefore have a way to handle valid destinations it misses. That does not expand the store’s delivery coverage. It keeps an incomplete suggestion list from becoming an accidental shipping policy.</p>
    <p>Payment approval will not catch every fulfillment mistake. A Trolleys merchant still needs the correct delivery destination in the order, and a shipping correction must not overwrite a separate billing address.</p>
    <p>The apartment number is a small detail on a screen and a decisive detail on a parcel. The merchant bears the cost when the checkout treats it as disposable.</p>
    </section>
  </BlogArticlePage>;
}
