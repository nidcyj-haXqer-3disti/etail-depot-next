import { SceneMotion } from "./platform-art-motion";
import { IndustryWorkflow } from "./industry-workflow";
import { industryCases } from "./industries";
import s from "./platform-use-cases.module.css";

function CommerceScene() {
  return <figure className={s.scene} data-platform-scene="commerce" aria-label="Commerce order. Cotton Supply sells two cotton towel sets for $150, linked to order 1048.">
    <div className={s.sceneHeader}><span>Cotton Supply</span><span>Order</span></div>
    <div className={s.commerceLayout}>
      <svg className={s.product} viewBox="0 0 210 210" fill="none" aria-hidden="true">
        <ellipse cx="102" cy="177" rx="81" ry="12" fill="#304d3b" opacity=".1" />
        <path d="m28 105 116-17 40 34-4 48-117 18-35-35v-48Z" fill="#aeb79a" />
        <path d="m28 105 116-17 40 34-117 20-39-37Z" fill="#e4e4cd" /><path d="m67 142 117-20-4 48-117 18 4-46Z" fill="#c9cfb7" />
        <path d="m33 74 113-17 39 34-3 42-116 20-33-32V74Z" fill="#d1c5aa" />
        <path d="m33 74 113-17 39 34-116 20-36-37Z" fill="#f5efdc" /><path d="m69 111 116-20-3 42-116 20 3-42Z" fill="#e5dbc3" />
        <path d="m80 115 2 28m7-29 2 28m7-30 2 28m7-30 2 28m7-30 2 28m7-30 2 28m7-30 2 28m7-30 2 28m7-30 2 28" stroke="#c6b99b" strokeOpacity=".6" />
        <path d="m43 77 101-15 27 25M37 113l21 20m17 22 97-16" stroke="white" strokeOpacity=".65" strokeWidth="2" />
        <path d="m103 65 19-3 30 35-18 3-31-35Z" fill="#45624d" /><path d="m134 100 18-3v25l-18 3v-25Z" fill="#304d3b" />
      </svg>
      <div className={`${s.paper} ${s.orderPaper}`}><span className={s.kicker}>Order #1048</span><strong className={s.recordTitle}>Cotton towel set</strong><span className={s.muted}>2 × $75.00</span><div className={s.total}><span>Order total</span><strong>$150.00</strong></div><span className={s.recordChip}>Seller · Cotton Supply</span></div>
    </div>
    <div className={s.reference}><span>Order #1048</span><span className={s.linkLine} aria-hidden="true" /><span>Payment record</span></div>
  </figure>;
}

function FreightScene() {
  return <figure className={`${s.scene} ${s.freight}`} data-platform-scene="freight" aria-label="Freight invoice from Pacific Freight. Shipment FT 02854 travels from Los Angeles to Phoenix. Invoice INV 08421 is $1,250.">
    <div className={s.sceneHeader}><span>Pacific Freight</span><span>Shipment</span></div>
    <div className={s.map}>
      <svg viewBox="0 0 520 145" preserveAspectRatio="none" aria-hidden="true"><path d="M0 125 65 80 135 91 205 15 305 39 380 0M45 0l76 63 2 82M295 0l-44 82 82 63M424 0l-23 67 119 27" fill="none" stroke="#bfcfc9" strokeWidth="1" /><path className={s.route} d="M67 107C139 112 161 36 242 42S340 112 451 44" fill="none" stroke="#426c60" strokeWidth="3" strokeDasharray="5 7" /><circle cx="67" cy="107" r="7" fill="#2e574a" stroke="#eef4ef" strokeWidth="4" /><circle cx="451" cy="44" r="7" fill="#2e574a" stroke="#eef4ef" strokeWidth="4" /></svg>
      <span className={s.origin}>Los Angeles</span><span className={s.destination}>Phoenix</span><span className={s.routeTag}>FT 02854</span>
    </div>
    <div className={`${s.paper} ${s.invoiceStrip}`}><div><span className={s.kicker}>Invoice INV 08421</span><strong className={s.recordTitle}>Freight charges</strong></div><strong className={s.amount}>$1,250.00</strong></div>
    <div className={s.reference}><span>Shipment reference</span><span className={s.linkLine} aria-hidden="true" /><span>Invoice payment</span></div>
  </figure>;
}

function TravelScene() {
  return <figure className={`${s.scene} ${s.travel}`} data-platform-scene="travel" aria-label="Atlas Travel booking TR 0428 for Lisbon and Porto, with a separate planning fee of $250.">
    <div className={s.sceneHeader}><span>Atlas Travel</span><span>Booking</span></div>
    <div className={s.travelLayout}>
      <div className={s.destinationArt} aria-hidden="true"><svg viewBox="0 0 200 205" fill="none"><circle cx="141" cy="39" r="25" fill="#dcc5a0" /><path d="M0 135c43-28 75-7 106-15s62-36 94-24v109H0V135Z" fill="#a9bba5" /><path d="M14 92h56v113H14V92Z" fill="#dfd0b5" /><path d="m6 92 36-29 36 29H6Z" fill="#ab7257" /><path d="M76 62h58v143H76V62Z" fill="#f6ebd5" /><path d="m68 62 37-30 37 30H68Z" fill="#b78362" /><path d="M140 110h45v95h-45v-95Z" fill="#d8bba0" /><path d="m134 110 29-23 29 23h-58Z" fill="#a36c54" /><path d="M28 111h14v20H28Zm19 0h14v20H47ZM88 82h13v19H88Zm25 0h13v19h-13ZM88 116h13v19H88Zm25 0h13v19h-13ZM151 126h12v18h-12Zm15 0h12v18h-12Z" fill="#547366" /><path d="M90 205v-43a15 15 0 0 1 30 0v43" fill="#47705e" /><path d="M0 184c50-18 101 13 200-5v26H0v-21Z" fill="#e2d8bf" /></svg></div>
      <div className={`${s.paper} ${s.bookingPaper}`}><span className={s.kicker}>Booking TR 0428</span><strong className={s.destinationTitle}>Lisbon<br />&amp; Porto</strong><span className={s.muted}>Custom itinerary</span><div className={s.total}><span>Planning fee</span><strong>$250.00</strong></div></div>
    </div>
    <div className={s.reference}><span>Booking reference</span><span className={s.linkLine} aria-hidden="true" /><span>Planning fee</span></div>
  </figure>;
}

function LegalScene() {
  return <figure className={`${s.scene} ${s.legal}`} data-platform-scene="legal" aria-label="Harrison Law invoice INV 0348 for $900 in earned legal fees, associated with matter MT 0084 and an operating account.">
    <div className={s.sceneHeader}><span>Harrison Law</span><span>Invoice</span></div>
    <div className={s.legalLayout}>
      <div className={s.matterFolder}><span>Matter MT 0084</span><svg viewBox="0 0 110 135" aria-hidden="true"><path d="M15 5h57l25 24v101H15V5Z" fill="#f9f7ed" /><path d="M72 5v24h25" fill="#c4d0bc" /><path d="M29 48h53M29 60h53M29 72h38M29 92h53M29 104h32" stroke="#bdc8b5" strokeWidth="3" /></svg></div>
      <div className={`${s.paper} ${s.legalPaper}`}><span className={s.kicker}>Invoice INV 0348</span><strong className={s.recordTitle}>Earned legal fees</strong><strong className={s.legalAmount}>$900.00</strong><span className={s.recordChip}>Operating account</span></div>
    </div>
    <div className={s.reference}><span>Matter MT 0084</span><span className={s.linkLine} aria-hidden="true" /><span>Invoice INV 0348</span></div>
  </figure>;
}

const cases = [
  { key: "marketplaces", title: "Commerce marketplaces", Scene: CommerceScene, benefit: "Keep each seller’s orders and payments together, from purchase through return.", scope: "Seller transfers, split payments and holding funds require a separately approved setup." },
  { key: "freight", title: "Freight platforms", Scene: FreightScene, benefit: "Keep customer payments connected to the right shipment and invoice.", scope: "Partial payments and allocation depend on the integration. Carrier payments, factoring and credit are separate arrangements." },
  { key: "travel", title: "Travel platforms", Scene: TravelScene, benefit: "Keep planning fees and booking payments linked to the trip and the business collecting them.", scope: "Supplier payments, escrow and supplier failure protection are outside this acceptance service." },
  { key: "legal", title: "Legal software", Scene: LegalScene, benefit: "Connect earned-fee payments to the client invoice, matter and operating account.", scope: "Ask whether trust and IOLTA accounts can be supported for your setup. Client trust funds, retainers and settlement distributions require a separately approved arrangement." },
] as const;

export function PlatformUseCases() {
  return <section className="ec-industry-section" id="industries" aria-labelledby="platforms-section-3-title">
    <span className="ec-anchor" id="industries-title" />
    <div className="ec-container">
      <div className="ec-section-heading ec-split-heading"><div><span className="ec-category">Platform use cases</span><h2 id="platforms-section-3-title">Payments that fit your software.</h2></div><p>Connect each payment to the order, shipment, booking or client invoice.</p></div>
      <SceneMotion className={`ec-industry-grid industry-cases ${s.grid}`}>
        {cases.map(({ key, title, Scene, benefit, scope }) => <article id={industryCases[key].slug} key={key} className={s.useCase}>
          <h3 className={s.caseTitle}>{title}</h3>
          <Scene />
          <div className={`ec-industry-copy ${s.copy}`}><p>{benefit}</p><p className="ec-industry-scope">{scope}</p><IndustryWorkflow page={industryCases[key]} /></div>
        </article>)}
      </SceneMotion>
    </div>
  </section>;
}
