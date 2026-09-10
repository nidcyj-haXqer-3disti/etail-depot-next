import {afterAll,expect,it} from "vitest";
import {closeDatabase} from "../../src/platform/database/client";
import {getWorkspace} from "../../src/modules/workspace/service";
import {cardPrimary,issuePracticeCard} from "../helpers/cardholder";
afterAll(closeDatabase);
it("concurrent service navigation completes without nested database-connection starvation",async()=>{
 const owner=await cardPrimary("Parallel card navigation");
 const serviceId=owner.serviceId;
 const issued=await issuePracticeCard(owner.personId,serviceId,owner.personId,"Concurrent read card","100");
 const results=await Promise.all(Array.from({length:16},()=>getWorkspace(owner.personId,serviceId)));
 expect(results).toHaveLength(16);
 for(const result of results){expect(result.cardholderRole).toBe("PRIMARY");expect(result.service.id).toBe(serviceId);expect(result.cards.map(card=>card.id)).toEqual([issued.card.id]);expect(result.cards.every(card=>card.holderId===owner.personId)).toBe(true);}
},15000);
