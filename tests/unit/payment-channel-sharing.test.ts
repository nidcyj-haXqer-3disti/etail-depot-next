import {describe,expect,it} from "vitest";
import {paymentPublicationUrl,paymentShareMessage,paymentWebsiteButton} from "../../src/shared/payment-channel-sharing";
const id="00000000-0000-4000-8000-000000000081",origin="http://127.0.0.1:3100",path=`/checkout/${id}`;
describe("a shared payment link remains bound to its exact publication",()=>{
 it("accepts the current local origin and reviewed hosted origin only",()=>{expect(paymentPublicationUrl(path,id,origin)).toBe(origin+path);expect(paymentPublicationUrl(`https://etail-depot-next.netlify.app${path}`,id,origin)).toBe(`https://etail-depot-next.netlify.app${path}`);});
 it.each(["https://elsewhere.test"+path,origin+path+"?payment=other",origin+path+"#pay",origin+"/checkout/00000000-0000-4000-8000-000000000082","javascript:alert(1)","https://user:password@etail-depot-next.netlify.app"+path,"//elsewhere.test"+path])("rejects an unsafe or different locator %s",value=>expect(paymentPublicationUrl(value,id,origin)).toBeNull());
 it("keeps share text plain and escapes all HTML attribute metacharacters in website code",()=>{expect(paymentShareMessage("Studio","Blue cup","$12.50",origin+path)).toContain("Blue cup · $12.50");expect(paymentWebsiteButton('https://safe.test/<a>?q="x"&b=1')).toBe('<a href="https://safe.test/&lt;a&gt;?q=&quot;x&quot;&amp;b=1" target="_blank" rel="noopener noreferrer">Pay by card</a>');});
});
