import { productFacts } from "@/shared/site/product-facts";
import { cardProduct } from "@/shared/site/card-product";
const cardFeesDescription = productFacts.cards.annualFeeDollars === productFacts.cards.monthlyFeeDollars
  ? `$${productFacts.cards.annualFeeDollars} annual and monthly fees`
  : `$${productFacts.cards.annualFeeDollars} annual fee and $${productFacts.cards.monthlyFeeDollars} monthly fee`;
import { publicPageMetadata } from "@/shared/seo/metadata";

export const pageDetails = { title: "Card Services: Ledgix Secured Credit Card", description: `${cardProduct.name}: virtual ${cardProduct.creditType}, $${productFacts.cards.minimumDepositDollars} minimum deposit, ${cardFeesDescription}. ${productFacts.cards.repayment}.` } as const;
export const metadata = publicPageMetadata("/services/card-services", pageDetails);
import { publicPageJsonLd } from "@/shared/seo/structured-data-builders";
import { pageDetails as homeDetails } from "@/features/home/metadata";
import { serviceLabels } from "@/shared/site/service-language";
export const pageJsonLd = () => publicPageJsonLd("/services/card-services", pageDetails, homeDetails.description, serviceLabels.cards);
