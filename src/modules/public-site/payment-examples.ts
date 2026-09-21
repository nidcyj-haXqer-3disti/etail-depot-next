/** Public marketing examples. No transaction or bank inquiry is created. */
export const paymentExamples = {
  goods: {
    name: "Goods", context: "Homeware order", description: "Homeware set", amountCents: 6400,
    question: "How can I pay for the homeware set?", quantity: "1 set",
    headline: "From your business to their doorstep.",
    benefit: "Share a payment request for the things you make and sell, whether your customer orders online or collects in person.",
    orderReference: "ORDER-1048", purchaseDetail: "Homeware set · 1 set",
  },
  services: {
    name: "Services", context: "Design project", description: "Design services", amountCents: 48000,
    question: "Can you send the project payment details?", quantity: "Project payment",
    headline: "Less chasing. More time for your work.",
    benefit: "Give customers a convenient way to pay for an appointment, a project or a job well done.",
    orderReference: "PROJECT-2086", purchaseDetail: "Design services · Project payment",
  },
  information: {
    name: "Information", context: "Market research briefing", description: "Market research briefing", amountCents: 3500,
    question: "Can I get the briefing before our planning meeting?", quantity: "1 briefing",
    headline: "Turn your expertise into business.",
    benefit: "Get paid for research, insights and advice, with a clear description that helps customers recognize their purchase.",
    orderReference: "BRIEF-3012", purchaseDetail: "Market research · 1 briefing",
  },
} as const;
export type PaymentExamplePurpose = keyof typeof paymentExamples;
