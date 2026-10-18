/** Presentation choices for the same payment link; not separate payment methods. */
export const paymentChannels = [
  { id: "LINK", name: "Copy link", title: "Share a link with your customer.", detail: "Paste it into a message, email or website." },
  { id: "SMS", name: "Text", title: "Keep the conversation going.", detail: "Send the payment link in the conversation you already have." },
  { id: "EMAIL", name: "Email", title: "Put the details in their inbox.", detail: "Bring the purchase, amount and payment link together in an email." },
  { id: "SOCIAL", name: "Social", title: "Share in a post or message.", detail: "Share the same link in a post, profile or direct message." },
  { id: "QR", name: "QR code", title: "From a scan to checkout.", detail: "Put your payment QR code on a counter, sign or printed material." },
  { id: "WEB", name: "Website", title: "Make your website a way to pay.", detail: "Connect a link or button on your site to the payment page." },
] as const;

export type ChannelPresentation = (typeof paymentChannels)[number]["id"];
