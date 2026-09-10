import { publicRobots } from "@/modules/public-site/metadata";

// Re-evaluate the release boundary at the deployed environment, rather than carrying a preview cache forward.
export const dynamic = "force-dynamic";
export default publicRobots;
