/** Public marketing examples. No transaction or bank inquiry is created. */
export const paymentExamples = {
  goods: {
    name: "Goods", context: "Homeware order", description: "Homeware set", amountCents: 6400,
    question: "How can I pay for the homeware set?", quantity: "1 set",
    benefit: "For the things you make and sell, online or in person.",
    orderReference: "ORDER-1048", purchaseDetail: "Homeware set · 1 set",
  },
  services: {
    name: "Services", context: "Design project", description: "Design services", amountCents: 48000,
    question: "Can you send the project payment details?", quantity: "Project payment",
    benefit: "For appointments, projects and a job well done.",
    orderReference: "PROJECT-2086", purchaseDetail: "Design services · Project payment",
  },
  information: {
    name: "Information", context: "Market research briefing", description: "Market research briefing", amountCents: 3500,
    question: "Can I get the briefing before our planning meeting?", quantity: "1 briefing",
    benefit: "For research, insights and advice your customers value.",
    orderReference: "BRIEF-3012", purchaseDetail: "Market research · 1 briefing",
  },
} as const;
export type PaymentExamplePurpose = keyof typeof paymentExamples;
