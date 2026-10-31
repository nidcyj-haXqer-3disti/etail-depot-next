import type { Metadata } from "next";
import snapshot from "./iso8583-independent-data.json";
import { canonicalOrigin, pageRobots, publicPageModified, socialImageForPage } from "./metadata";

export const ISO8583_PATH = "/guides/iso-8583";
export const REFERENCE_SOURCES = snapshot.sources;
export const MESSAGE_TYPES = snapshot.messages;
export const DATA_FIELDS = snapshot.fields;
export const SOURCE_NOTES = snapshot.sourceNotes;
export type MessageType = typeof MESSAGE_TYPES[number];
export type DataField = typeof DATA_FIELDS[number];
export type ReferenceEntry = MessageType | DataField;
export const REFERENCE_SECTIONS = [
  { slug: "messages", title: "Message types", description: "Read the version, purpose, function and origin of a message type listed in Moov’s implementation reference.", count: MESSAGE_TYPES.length },
  { slug: "fields", title: "Data fields", description: "Compare field containers in the pyiso8583 default and default_ascii starter profiles, including encoding, length prefixes and bitmap positions.", count: DATA_FIELDS.length },
  { slug: "encoding", title: "Bytes and encoding", description: "Understand the difference between a value, its encoded bytes and the length prefix used to frame it.", count: 0 },
] as const;
export type ReferenceSection = typeof REFERENCE_SECTIONS[number];
export function referenceSection(slug: string) { return REFERENCE_SECTIONS.find(section => section.slug === slug); }
export function referenceEntries(section: ReferenceSection): readonly ReferenceEntry[] { return section.slug === "messages" ? MESSAGE_TYPES : section.slug === "fields" ? DATA_FIELDS : []; }
export function referenceEntry(section: ReferenceSection, code: string) { return referenceEntries(section).find(entry => entry.code === code); }
export function referencePath(section?: ReferenceSection, entry?: ReferenceEntry) { return ISO8583_PATH + (section ? "/" + section.slug : "") + (entry ? "/" + entry.code : ""); }
export function isMessage(entry: ReferenceEntry): entry is MessageType { return "version" in entry; }
export function referenceSource(id: string) { return REFERENCE_SOURCES.find(source => source.id === id)!; }
export function sourceUrl(entry: ReferenceEntry) { return referenceSource(entry.source).url + `#L${entry.sourceLines[0]}-L${entry.sourceLines[1]}`; }
export function messageDigits(entry: MessageType) {
  return [
    { value: entry.code[0], label: "Version family", meaning: entry.version },
    { value: entry.code[1], label: "Message class", meaning: entry.className },
    { value: entry.code[2], label: "Function", meaning: entry.function.replace(" repeat", "") },
    { value: entry.code[3], label: "Origin indicator", meaning: entry.origin },
  ];
}
const classNotes: Record<string, [string, string]> = {
  authorization: ["Authorization messages exchange a decision about a proposed transaction. An authorization message is not a bank deposit record.", "Match the response to its request before interpreting the transaction result. The message type alone does not say whether the transaction was approved."],
  financial: ["Financial transaction messages carry a transaction for processing or report on it. The message function distinguishes a request from an advice or response.", "Keep the transaction record, response and settlement records separate. A financial message type does not by itself prove that funds reached a merchant’s bank."],
  file: ["File action messages concern a file operation in the connection’s protocol. The function digit still distinguishes an advice from its response.", "Read the implementation’s file operation and acknowledgement rules. A file action message does not, by itself, describe a customer purchase."],
  reversal: ["Reversal messages concern an earlier transaction. Their meaning depends on the original transaction and the connection’s reversal procedure.", "Match the original transaction before changing its state. A reversal message is not a general instruction to issue a separate refund or start another payment."],
  reconciliation: ["Reconciliation messages exchange information used to compare processing records. They belong to a different message class from authorization or a financial transaction.", "Compare the agreed period, totals and identifiers. Receipt of a reconciliation message alone does not confirm a bank deposit."],
  administration: ["Administrative messages support protocol administration. The origin indicator in this group identifies another origin category rather than specifically an acquirer or issuer.", "Use the connection’s operation code and administrative procedure to identify the task. Do not infer a customer payment result from this message class."],
  fees: ["Fee collection messages identify a fee related exchange. The function separates advice, response and notification messages.", "Read the fee identity, amount and accounting rules in the implementation contract. The message type does not supply a fee amount or authorize a merchant charge."],
  network: ["Network management messages concern the connection or its management operations. A network message is separate from a purchase authorization.", "Read the implementation’s management code and expected response. A successful connection check does not establish that a payment was approved."],
};
export function messageExplanation(entry: MessageType) {
  const [purpose, check] = classNotes[entry.group];
  const functionNote = entry.function === "request" ? "A request asks the receiving system to perform the operation defined for this message. Its response must be interpreted separately." : entry.function === "response" ? "A response belongs to a request exchange. Read the result fields and matching identifiers; the response function is not itself a success code." : entry.function === "advice response" ? "An advice response belongs to an advice exchange. Its result and acknowledgement requirements come from the connection specification." : entry.function === "notification" ? "A notification reports information using the connection’s notification procedure. Do not infer its delivery or acknowledgement guarantees from the message type alone." : "An advice carries information under the connection’s advice procedure. An advice is a distinct function, not another name for a request.";
  const originNote = entry.repeat ? "The final digit marks a repeat for the stated origin category. Follow the connection’s duplicate handling rules; do not create an unrelated new transaction when processing a repeated message." : "The origin indicator identifies the origin category of the exchange. In a response, it must not be read as a universal statement about which system sent the current packet.";
  return { purpose, check, functionNote, originNote };
}
export function relatedMessages(entry: MessageType) {
  return MESSAGE_TYPES.filter(item => item.code !== entry.code && item.version === entry.version && item.group === entry.group && item.code[3] === entry.code[3]).slice(0, 4);
}
export const FIELD_GROUPS: Record<string, string> = { identity: "Accounts and participants", amounts: "Amounts and currencies", dates: "Dates and times", security: "Card and security data", control: "Message control and reconciliation" };
const fieldNotes: Record<string, [string, string]> = {
  "1": ["This field represents the secondary bitmap in the starter profiles. It identifies fields beyond the primary bitmap.", "The binary profile uses eight bytes, while the ASCII profile uses sixteen hexadecimal characters. Those are two representations of the same number of bitmap bits."],
  "2": ["This container carries the primary account number in these profiles. Its two character length prefix allows the value to vary in length.", "Keep the value as text to preserve leading zeros. Use masked or synthetic data in documentation and diagnostics."],
  "3": ["The processing code occupies six ASCII bytes in these profiles. The library describes the container but does not supply its complete transaction and account code assignments.", "Obtain the code components from the connection specification. A six digit container does not establish the meaning of every six digit combination."],
  "4": ["This is the transaction amount container. Both starter profiles use twelve ASCII bytes without a length prefix.", "The bytes alone do not carry a decimal separator or currency interpretation. Read the transaction currency and the connection’s amount scaling rules together."],
  "5": ["This amount relates to settlement in the selected profiles. It is a separate field from the original transaction amount.", "Pair it with the settlement currency and the agreed conversion rules. Do not substitute the cardholder billing amount."],
  "6": ["This field identifies the amount for cardholder billing in the selected profiles.", "Read it with the cardholder billing currency. A merchant’s transaction currency and the cardholder’s billing currency need not be the same."],
  "7": ["The profile assigns ten ASCII bytes to the transmission date and time. It is separate from the local transaction date and time fields.", "The container does not declare a time zone or a full calendar format. Confirm both before ordering events from different systems."],
  "9": ["This is the settlement conversion rate container in the starter profiles.", "An eight byte container does not explain the implied decimal point or rate direction. Confirm those details before applying the rate."],
  "10": ["This rate container relates to cardholder billing in the starter profiles.", "Keep it separate from the settlement conversion rate. Scaling and rate direction require the implementation contract."],
  "11": ["The system trace audit number uses a fixed six byte container in these profiles. It is a protocol identifier rather than a general order number.", "Preserve leading zeros. Use the connection’s full matching key rather than assuming that six digits are unique across every date, terminal and institution."],
  "12": ["This field contains local transaction time in the selected profiles, separately from the local date.", "Combine it with the correct date and time zone rules. A time value alone cannot order transactions across a day boundary."],
  "13": ["This is the local transaction date container. The starter profile assigns four ASCII bytes.", "Confirm the date format and year handling in the connection specification. The container does not encode those decisions by itself."],
  "14": ["This field holds the expiration date representation used by the selected profile.", "Confirm the expected order of year and month and the applicable century handling. Field length alone is not a complete date specification."],
  "18": ["This field is labelled Merchant Type in the starter profiles and has a four byte container.", "The starter profiles do not supply the permitted merchant classification list. Use the classification source named by the acquiring connection."],
  "22": ["This three byte container is labelled Point of service entry mode. It is distinct from the point of service condition and capture fields.", "The library does not define all entry mode combinations. Use the network profile to interpret how card information was entered."],
  "23": ["The PAN sequence number has a separate three byte container in these profiles.", "Do not combine it with the account number or treat it as the transaction sequence. Its use depends on the card and connection profile."],
  "24": ["The selected starter profiles call field 24 Network International ID. Other message profiles may assign this field a different role.", "This page documents the starter profiles only. Confirm the field identity before treating it as a function code from another edition."],
  "25": ["This two byte field carries the point of service condition code in the selected profiles.", "Read its allowed values in the implementation specification. It is not interchangeable with the entry mode field."],
  "27": ["The profile label identifies the length of an authorizing ID response. The field itself has a one byte container.", "Keep the described response length distinct from the length of this field on the wire."],
  "32": ["This field identifies the acquiring institution in the selected profiles. Its value has a two character length prefix.", "Preserve its exact identifier, including leading zeros. Do not assume it is the same identifier used by an unrelated API or merchant account."],
  "33": ["This container identifies the forwarding institution in the selected profiles.", "An intermediary’s identifier is separate from the acquiring institution identifier. Use each in its defined routing role."],
  "37": ["The retrieval reference number uses a fixed twelve byte container in both starter profiles.", "Keep it with the related transaction identifiers. Its presence alone does not prove authorization, settlement or a bank deposit."],
  "38": ["This field is the authorization ID response container in the selected profiles.", "An authorization identifier and the response code are different fields. Do not use an identifier’s presence as the only approval check."],
  "39": ["The response code uses two ASCII bytes in both starter profiles. The library specifies its format, not the meaning of every response value.", "Do not insert a three or four digit action code into this two byte profile. Obtain the response meanings and permitted recovery actions from the connection specification."],
  "41": ["This fixed eight byte field identifies the card acceptor terminal in the selected profiles.", "Apply the connection’s padding and identifier rules. A terminal identifier is separate from a merchant or card acceptor identifier."],
  "42": ["The card acceptor ID occupies fifteen ASCII bytes in these profiles.", "Keep it distinct from the terminal ID and displayed business name. Formatting rules belong to the acquiring connection."],
  "43": ["This forty byte container holds card acceptor name and location information in the selected profiles.", "Check the required internal layout before combining text. The starter profile gives the total container length, not the positions of every name or location component."],
  "44": ["This is a variable length container for additional response data in the selected profiles.", "Its contents need the connection’s subfield definition. Do not interpret it solely from the two byte response code."],
  "46": ["The starter profile provides a variable length container labelled Additional Data ISO.", "The label is not a schema for its contents. This reference does not reproduce the standard’s additional data definitions."],
  "47": ["This container is available for additional data described by the national implementation in use.", "Resolve its internal structure from that implementation before parsing it. Its outer length does not establish the subfield layout."],
  "48": ["The starter profile provides a variable length container for private additional data.", "Private data requires an agreed schema between the systems. No universal subfield meaning is assigned here."],
  "49": ["This is the transaction currency container in the selected profiles.", "Read it together with the transaction amount. The amount’s scale still needs to follow the connection’s rules."],
  "50": ["This currency field relates to the settlement amount in the selected profiles.", "Keep transaction, settlement and cardholder billing currency roles separate when reconciling a record."],
  "51": ["This field identifies the currency associated with cardholder billing in the selected profiles.", "Do not infer the merchant settlement currency from this value."],
  "52": ["The default profile uses an eight byte binary container for the field labelled PIN. The ASCII profile represents it with sixteen characters.", "This is a representation comparison, not an instruction to send a plaintext PIN. Protection and key management requirements come from the approved security implementation."],
  "53": ["The profile labels this field Security related control information and allocates sixteen ASCII bytes.", "The container does not define security operations, key identifiers or cryptographic algorithms. Those require a separate security specification."],
  "54": ["This variable length container is labelled Additional Amounts in the selected profiles.", "Use the defined internal structure to associate each amount with its purpose and currency. The outer length is not a list of amount type assignments."],
  "55": ["ICC data uses a variable length container. The default profile carries binary bytes, while default_ascii carries an ASCII representation.", "The container is not an EMV tag dictionary. Interpret any tags using the relevant chip data specification and encoding rules."],
  "64": ["This field is labelled MAC and provides a message authentication code container in the selected profiles.", "Binary and ASCII profiles use different representations. The library’s field length does not select the authentication algorithm, covered bytes or key."],
  "65": ["The starter profile labels field 65 Bitmap Extended and allocates sixteen ASCII bytes.", "A field definition alone does not establish support for additional field numbers. Check the encoder’s supported range before treating this as a tertiary bitmap."],
  "70": ["This field carries the network management information code in the selected profiles.", "The message type identifies network management, while this field identifies an operation using the connection’s own code list."],
  "71": ["This field carries a message number in the selected profiles.", "Read the numbering and reset rules for the relevant exchange. A message number is distinct from the system trace audit number."],
  "72": ["The profile labels this field Message Number Last and gives it a variable length container.", "Confirm the exchange’s meaning of last and its sequence rules. The label alone is not a retransmission instruction."],
  "90": ["This field is labelled Original Data Elements and uses a fixed forty two byte container in these profiles.", "Use the implementation’s component positions to link back to an earlier transaction. The starter profile defines only the outer container."],
  "95": ["The replacement amounts container is fixed at forty two ASCII bytes in these profiles.", "Confirm its internal amount layout and how it relates to the original transaction. The container itself does not define a refund amount."],
  "96": ["This field is the message security code container in the selected profiles.", "The default profile uses eight binary bytes and default_ascii uses sixteen ASCII characters. Cryptographic interpretation requires the security profile."],
  "97": ["This container is labelled Amount Net Settlement in the selected profiles.", "Confirm the sign, currency and scaling rules. A net settlement message value is not evidence of receipt by a merchant’s bank."],
  "101": ["This variable length field carries a file name in the selected profiles.", "Read it as a protocol value. It does not authorize reading or writing a local filesystem path."],
  "102": ["This is the first account ID container in the selected profiles.", "The implementation decides which account role it represents. Do not assume it contains a card account number."],
  "103": ["This is the second account ID container in the selected profiles.", "Read the two account ID roles together using the implementation contract. Their order is not a universal debit and credit convention."],
  "104": ["This variable length container holds a transaction description in the selected profiles.", "Keep descriptive text separate from transaction identifiers and status fields. Check character encoding and length before transmission."],
  "128": ["Field 128 is another MAC container in the selected profiles, located in the secondary bitmap range.", "Do not infer interchangeability with field 64. The security profile determines the placement, algorithm and bytes covered."],
};
export function fieldExplanation(entry: DataField) {
  if (fieldNotes[entry.code]) return fieldNotes[entry.code];
  const n = Number(entry.code);
  if (n >= 74 && n <= 81) return [`The starter profiles assign this ten byte container to ${entry.title.toLowerCase()}. It describes a count rather than a currency amount.`, "Confirm the reconciliation period and which events enter the count. Compare counts separately from amount totals and reversals."];
  if (entry.group === "amounts") return [`This field is the ${entry.title.toLowerCase()} container in the selected profiles. Its role is separate from other transaction, settlement and fee amount fields.`, "Read the amount’s currency, sign and scale from the connection specification. A fixed container length does not establish those accounting rules."];
  if (entry.group === "dates") return [`The starter profiles allocate this container to ${entry.title.toLowerCase()}. This date has a separate role from transmission and local transaction dates.`, "Confirm calendar format, year handling and time zone where applicable. Do not infer them from the byte count alone."];
  if (entry.group === "security") return [`This field is labelled ${entry.title} in the selected profiles. Its representation is described below.`, "The field container does not grant permission to retain card or authentication data. Follow the security and data handling requirements for the actual connection."];
  return [`The starter profiles assign field ${entry.code} to ${entry.title.toLowerCase()}. The profile comparison below describes its outer container.`, "The library does not supply a complete list of allowed values or every internal component. Confirm those details in the specification for the connection you are implementing."];
}
export function bitmapPosition(field: string) {
  const n = Number(field), bitmap = n <= 64 ? "Primary" : "Secondary", position = n <= 64 ? n : n - 64;
  return { bitmap, position, byte: Math.floor((position - 1) / 8) + 1, bit: (position - 1) % 8 + 1 };
}
export function formatBytes(count: number, qualifier = "") {
  return `${count} ${qualifier}${count === 1 ? "byte" : "bytes"}`;
}
export function formatProfile(profile: DataField["profiles"]["default"]) {
  return { encoding: profile.data_enc === "b" ? "Binary" : "ASCII", size: formatBytes(profile.max_len), length: profile.len_type === 0 ? "Fixed length" : formatBytes(profile.len_type, "ASCII length "), variable: profile.len_type !== 0 };
}
export function referenceIdentity(section?: ReferenceSection, entry?: ReferenceEntry) {
  const path = referencePath(section, entry);
  const name = entry ? `${isMessage(entry) ? "MTI" : "Field"} ${entry.code}: ${entry.title}` : section?.title ?? "ISO 8583 implementation reference";
  const description = entry ? isMessage(entry) ? `Read MTI ${entry.code}, its ${entry.version} version indicator, ${entry.function} function and ${entry.origin.toLowerCase()} origin in Moov’s message reference. Includes interpretation and matching notes.` : `Inspect field ${entry.code}, ${entry.title.toLowerCase()}, in pyiso8583 starter profiles. Compare byte encoding, length prefixes, bitmap location and implementation limits.` : section?.description ?? "An independent ISO 8583 implementation reference with message types, field formats and byte examples, grounded in identified open source libraries.";
  return { path, name, title: `${name}${section ? " | ISO 8583 reference" : ""} | Etail Depot`, description };
}
export function iso8583Metadata(section?: ReferenceSection, entry?: ReferenceEntry): Metadata {
  const x = referenceIdentity(section, entry), url = canonicalOrigin + x.path;
  return { title: { absolute: x.title }, description: x.description, alternates: { canonical: url }, robots: pageRobots(x.path),
    openGraph: { type: "website", title: x.title, description: x.description, url, siteName: "Etail Depot", images: [socialImageForPage(x.path)] },
    twitter: { card: "summary_large_image", title: x.title, description: x.description, images: [socialImageForPage(x.path)] } };
}
export function iso8583JsonLd(section?: ReferenceSection, entry?: ReferenceEntry) {
  const x = referenceIdentity(section, entry), url = canonicalOrigin + x.path;
  const crumbs = [{ name: "Guides", path: "/guides" }, { name: "ISO 8583", path: ISO8583_PATH }];
  if (section) crumbs.push({ name: section.title, path: referencePath(section) });
  if (entry) crumbs.push({ name: entry.code, path: x.path });
  const citations = entry ? [sourceUrl(entry)] : REFERENCE_SOURCES.map(source => source.url);
  return JSON.stringify({ "@context": "https://schema.org", "@graph": [
    { "@type": entry || section?.slug === "encoding" ? "WebPage" : "CollectionPage", "@id": url + "#webpage", url, name: x.name, description: x.description, inLanguage: "en-US", dateModified: publicPageModified(x.path), citation: citations, isBasedOn: citations,
      publisher: { "@id": canonicalOrigin + "/#organization" }, isPartOf: { "@id": canonicalOrigin + "/#website" }, breadcrumb: { "@id": url + "#breadcrumb" } },
    { "@type": "BreadcrumbList", "@id": url + "#breadcrumb", itemListElement: crumbs.map((crumb, index) => ({ "@type": "ListItem", position: index + 1, name: crumb.name, item: canonicalOrigin + crumb.path })) },
    ...(!entry && section?.slug !== "encoding" ? [{ "@type": "ItemList", numberOfItems: section ? referenceEntries(section).length : REFERENCE_SECTIONS.length, itemListElement: (section ? referenceEntries(section).map(item => ({ name: item.title, url: canonicalOrigin + referencePath(section, item) })) : REFERENCE_SECTIONS.map(item => ({ name: item.title, url: canonicalOrigin + referencePath(item) }))).map((item, index) => ({ "@type": "ListItem", position: index + 1, ...item })) }] : []),
  ] }).replace(/</g, "\\u003c");
}
