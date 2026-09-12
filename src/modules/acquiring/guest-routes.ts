import {SecurityError} from "../../platform/security/origin";
/** Public and private checkout documents must not leak their locators through referrers or caches. */
export const guestResponseHeaders={"Referrer-Policy":"no-referrer","X-Robots-Tag":"noindex, nofollow","X-Content-Type-Options":"nosniff"};
export function requireNoGuestQuery(request:Request){if(new URL(request.url).searchParams.size)throw new SecurityError("INVALID_REQUEST",422);}
