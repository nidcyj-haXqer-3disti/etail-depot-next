import { commerceProduct } from "../shared/ui/artwork/artwork-assets";
import Image from "next/image";
import "./commerce-product-art.css";

/** Original product concept, paired with the visible order description. */
export function CommerceProductArt() {
  return <Image src={commerceProduct} width={576} height={384} alt="" aria-hidden="true" unoptimized loading="eager" />;
}
