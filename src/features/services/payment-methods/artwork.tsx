import { PaymentChoiceArt } from "../components/merchant-record-art";
import s from "../shared/service-detail.module.css";

export function PaymentMethodsArt({ title, caption }: { title: string; caption: string }) {
  return <figure className={s.art} data-service-workflow="methods" aria-label={title}>
    <div className={s.scene}>
<PaymentChoiceArt />
    </div><figcaption>{caption}</figcaption>
  </figure>;
}
