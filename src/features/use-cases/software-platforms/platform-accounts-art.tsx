import { BrandImage } from "@/shared/brand/brand-image";
import { AccountsMotion } from "./platform-art-motion";
import { Icon } from "@/shared/ui/icon";
import s from "./platform-accounts-art.module.css";

type MerchantMarkKind = "cotton" | "freight" | "travel" | "legal" | "market" | "logistics";

/** Original two-tone emblems for the fictional businesses in the artwork. */
function MerchantMark({ kind }: { kind: MerchantMarkKind }) {
  return <svg className={s.emblemMark} viewBox="0 0 48 48" fill="none" aria-hidden="true" focusable="false" data-merchant-mark={kind}>
    {kind === "cotton" && <>
      <path d="M24 28v14m0-5c-8 0-13-4-14-9 7 0 12 3 14 9Zm0-3c7 0 12-4 14-9-7 0-12 4-14 9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M24 5a9 9 0 0 0-8.5 6A9 9 0 0 0 7 20c0 7 7 12 17 12s17-5 17-12a9 9 0 0 0-8.5-9A9 9 0 0 0 24 5Z" fill="currentColor" />
      <path d="M24 9c-5 0-7 5-7 10s3 9 7 10c4-1 7-5 7-10s-2-10-7-10Z" fill="var(--mark-accent)" />
    </>}
    {kind === "freight" && <>
      <path d="M5 10h23v28H5V10Z" fill="currentColor" /><path d="M28 16h8l7 10v12H28V16Z" fill="var(--mark-accent)" />
      <path d="M31 20h3l5 7h-8v-7Z" fill="white" fillOpacity=".75" /><path d="M10 17h13M10 23h13" stroke="white" strokeOpacity=".45" strokeWidth="2" />
      <circle cx="13" cy="37" r="5" fill="currentColor" stroke="white" strokeWidth="2" /><circle cx="35" cy="37" r="5" fill="currentColor" stroke="white" strokeWidth="2" />
    </>}
    {kind === "travel" && <>
      <circle cx="24" cy="24" r="18" stroke="var(--mark-accent)" strokeWidth="4" />
      <path d="m33 13-5 15-15 7 6-16 14-6Z" fill="currentColor" /><path d="m19 19 9 9-15 7 6-16Z" fill="var(--mark-accent)" /><circle cx="24" cy="24" r="2" fill="white" />
    </>}
    {kind === "legal" && <>
      <path d="m5 14 19-9 19 9H5ZM7 38h34v5H7v-5ZM10 19h6v16h-6V19Zm22 0h6v16h-6V19Z" fill="currentColor" />
      <path d="M21 19h6v16h-6V19Z" fill="var(--mark-accent)" /><path d="M8 16h32" stroke="var(--mark-accent)" strokeWidth="2" />
    </>}
    {kind === "market" && <>
      <path d="M9 20h30v22H9V20Z" fill="currentColor" /><path d="M8 7h32l4 13H4L8 7Z" fill="var(--mark-accent)" />
      <path d="m18 7-2 13m14-13 2 13" stroke="white" strokeOpacity=".65" strokeWidth="2" /><path d="M16 29h16v13H16V29Z" fill="white" fillOpacity=".8" /><path d="M24 29v13" stroke="currentColor" strokeWidth="2" />
    </>}
    {kind === "logistics" && <>
      <path d="m5 15 19-9 19 9v21l-19 9-19-9V15Z" fill="currentColor" /><path d="m5 15 19-9 19 9-19 9-19-9Z" fill="var(--mark-accent)" />
      <path d="m15 10 18 9v9" stroke="white" strokeOpacity=".7" strokeWidth="2" /><path d="M24 25v16" stroke="white" strokeOpacity=".4" strokeWidth="2" />
    </>}
  </svg>;
}

const businesses = [
  { name: "Cotton Retail", company: "Cotton Retail LLC", industry: "Retail", kind: "cotton", accounts: [
    { dba: "Cotton Supply", mid: "824630170001" }, { dba: "Cotton Bedding", mid: "824630170002" },
  ] },
  { name: "Pacific Freight", company: "Pacific Freight LLC", industry: "Transport", kind: "freight", accounts: [
    { dba: "Pacific Ocean", mid: "824630170003" }, { dba: "Pacific Air Cargo", mid: "824630170004" }, { dba: "Pacific Road", mid: "824630170005" },
  ] },
  { name: "Atlas Travel", company: "Atlas Travel LLC", industry: "Travel services", kind: "travel", accounts: [
    { dba: "Atlas Journeys", mid: "824630170006" }, { dba: "Atlas Tours", mid: "824630170007" },
  ] },
  { name: "Harrison Law", company: "Harrison Law PLLC", industry: "Legal services", kind: "legal", accounts: [
    { dba: "Harrison Counsel", mid: "824630170008" }, { dba: "Harrison Estates", mid: "824630170009" },
  ] },
  { name: "Union Market", company: "Union Market LLC", industry: "Retail", kind: "market", accounts: [
    { dba: "Union Home", mid: "824630170010" }, { dba: "Union Kitchen", mid: "824630170011" }, { dba: "Union Outdoor", mid: "824630170012" },
  ] },
  { name: "Route Logistics", company: "Route Logistics LLC", industry: "Transport", kind: "logistics", accounts: [
    { dba: "Route Freight", mid: "824630170013" }, { dba: "Route Express", mid: "824630170014" },
  ] },
] as const;

export function PlatformAccountsArt() {
  return <figure className={s.figure} data-attention-art="platform" data-platform-accounts aria-label="Businesses and their merchant accounts. Select a business to view its legal company, DBAs and merchant IDs.">
    <AccountsMotion className={s.window}>
      <div className={s.bar}><span className={s.brand}><BrandImage brand="symbol" alt="" width={800} height={484} className="" /><strong>Merchant accounts</strong></span></div>
      <div className={s.workspace}>
        <div className={s.directory} role="radiogroup" aria-label="Businesses" aria-describedby="platform-account-selection-hint">
          <div className={s.directoryHeading}>Businesses</div>
          {businesses.map((business,index) => <label className={s.business} data-business-entry data-business-kind={business.kind} key={business.kind}>
            <input className={s.selector} type="radio" name="platform-example-business" value={business.kind} defaultChecked={index===0} data-example-selector aria-controls={`platform-company-${business.kind}`} aria-label={`${business.name}, ${business.accounts.length} merchant accounts`} />
            <span className={s.emblem}><MerchantMark kind={business.kind} /></span>
            <span className={s.businessCopy}><strong>{business.name}</strong><span data-business-industry>{business.industry}</span></span>
            <span className={s.businessArrow} aria-hidden="true"><Icon name="arrow" /></span>
          </label>)}
          <span className={s.selectionHint} id="platform-account-selection-hint">Select a business to view its accounts.</span>
        </div>
        <div className={s.details} aria-live="off">
          {businesses.map(business => <div className={s.detail} id={`platform-company-${business.kind}`} data-business-panel={business.kind} data-business-kind={business.kind} key={business.kind}>
            <div className={s.companyHeader}>
              <span className={s.companyEmblem}><MerchantMark kind={business.kind} /></span>
              <div><span className={s.label}>Legal company</span><strong className={s.company}>{business.company}</strong></div>
            </div>
            <div className={s.accountsHeading}>Merchant accounts</div>
            <div className={s.accounts}>
              {business.accounts.map(account => <div className={s.account} data-example-merchant-account key={account.mid}>
                <dl className={s.accountName}><dt>DBA</dt><dd>{account.dba}</dd></dl>
                <span className={s.status}><Icon name="check" />Active</span>
                <dl className={s.mid}><dt>Merchant ID</dt><dd>{account.mid}</dd></dl>
              </div>)}
            </div>
          </div>)}
        </div>
      </div>
    </AccountsMotion>
    <figcaption>Account structure and views depend on your approved setup and permissions.</figcaption>
  </figure>;
}
