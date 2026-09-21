import Image from "next/image";
import { Icon } from "./icon";
import "./product-use-cases.css";

type UseCase = { title: string; description: string; icon: string };

function ProductUseCases({ id, title, image, imageAlt, cases }: {
  id: string;
  title: string;
  image: string;
  imageAlt: string;
  cases: readonly UseCase[];
}) {
  return <section className="product-use-cases page-container" aria-labelledby={id}>
    <div className="product-use-cases-copy">
      <h2 id={id}>{title}</h2>
      <ul className="product-use-cases-list">
        {cases.map(item => <li key={item.title}>
          <span className="product-use-case-icon"><Icon name={item.icon} /></span>
          <div><h3>{item.title}</h3><p>{item.description}</p></div>
        </li>)}
      </ul>
    </div>
    <figure className="product-use-cases-photo">
      <Image src={image} alt={imageAlt} fill sizes="(max-width: 360px) calc(100vw - 36px), (max-width: 850px) calc(100vw - 48px), (max-width: 1100px) 46vw, (max-width: 1248px) 45vw, 560px" />
    </figure>
  </section>;
}

export function PaymentUseCases() {
  return <ProductUseCases
    id="payment-use-cases-title"
    title="For your next booking, invoice or sale."
    image="/marketing/work-and-payment-v1.webp"
    imageAlt="A designer and client reviewing work together"
    cases={[
      { title: "Bookings & deposits", description: "Send a payment link for an agreed deposit or booking amount by text or email.", icon: "message" },
      { title: "Invoices for completed work", description: "Show the work completed, amount due and payment link on one invoice.", icon: "document" },
      { title: "Pop-ups & social orders", description: "Display a QR code in person or share a link in a message. Customers pay on their phone.", icon: "qr" },
    ]}
  />;
}
