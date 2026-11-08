import { MerchantApplicationArt } from "./merchant-application-art";

export function MerchantOnboardingArt({ title, caption }: { title: string; caption: string }) {
  return <MerchantApplicationArt title={title} caption={caption} />;
}
