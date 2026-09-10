import Image from "next/image";
import type { WorkspaceCard } from "@/modules/workspace/contracts";

export function CardPreview({card}:{card:WorkspaceCard}) {
 return <div className={`ws-card-art ${card.status==="FROZEN"?"is-frozen":""}`} aria-label={`${card.nickname}, ${card.status.toLowerCase()}, ending ${card.lastFour}`}><div className="ws-card-art-top"><strong>etail<span>depot</span></strong><span>{card.relationship==="PRIMARY"?"PRIMARY":"SECONDARY"}</span></div><Image className="ws-card-symbol" src="/brand/symbol.png" alt="" width={400} height={400}/><div className="ws-chip" aria-hidden="true"><span/><span/><span/></div><div className="ws-card-number">•••• &nbsp; •••• &nbsp; {card.lastFour}</div><div className="ws-card-art-bottom"><span>{card.holderName}</span><span>{card.format==="VIRTUAL"?"VIRTUAL":"CARD"}</span></div></div>;
}
