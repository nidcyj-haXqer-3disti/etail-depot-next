import { articleMetadata } from "@/features/company/blog/metadata";
import { volumeCommitmentArticle } from "@/features/company/blog/volume-commitment-content";

export const metadata = articleMetadata(volumeCommitmentArticle);
export { VolumeCommitmentPage as default } from "@/features/company/blog/volume-commitment-page";
