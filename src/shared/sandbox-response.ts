import { z } from "zod";
export const sandboxOverviewSchema = z.object({ joined: z.boolean(), displayName: z.string(), memberCode: z.string().nullable() }).strict();
