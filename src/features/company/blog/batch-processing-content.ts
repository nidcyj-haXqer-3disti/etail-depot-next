import type { BlogArticle } from "./content";

/** Archive G0132, adapted with current batch reporting and reconciliation guidance. */
export const batchProcessingArticle: BlogArticle = {
  path: "/company/blog/how-batch-payment-processing-works",
  title: "Batch payment processing: how to check your daily records",
  description: "Batch processing groups transactions for a particular step. To check your daily payments, first identify what the batch contains, which period it covers and how its records connect to your merchant account.",
  summary: "Understand payment batches, cutoff times and transaction results, then learn how to match records and investigate differences without repeating successful payments.",
  searchTitle: "How batch payment processing works for merchants",
  relatedPaths: ["/company/blog/payment-processing-systems", "/company/blog/card-authorization"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [
    { id: "which-batch", title: "Identify what the batch represents" },
    { id: "cutoff", title: "Check the cutoff and reporting period" },
    { id: "match-transactions", title: "Match the individual transactions" },
    { id: "check-results", title: "Read the processing results" },
    { id: "resolve-differences", title: "Resolve differences before retrying" },
  ],
  sources: [
    { label: "Cybersource: Payment Batch Detail report", href: "https://developer.cybersource.com/docs/cybs/en-us/reporting/user/all/ebc/reporting-ug/c_Reports_Available_in_the_Business_Center/c_Payment_Batch_Detail.html" },
    { label: "Cybersource: Batch dates and report timing", href: "https://developer.cybersource.com/docs/cybs/en-us/reporting/user/all/ebc/reporting-ug/Creating_Accessing_Downloadable_Reports/c_Modifying_Custom_Report_Subscriptions/Config_Pay_Batch_Detail_Report_Batch_Times.html" },
    { label: "Cybersource: Batch Upload Reply File", href: "https://developer.cybersource.com/docs/cybs/en-us/reporting/user/all/ebc/reporting-ug/c_Reports_Available_in_the_Business_Center/c_Batch_Upload_Reply_File.html" },
    { label: "Cybersource: Capture processing and reconciliation", href: "https://developer.cybersource.com/docs/cybs/en-us/payments/developer/gpn/rest/payments/payments-intro/payments-services-intro/payments-intro-processing-capture.html" },
    { label: "Adyen: Payable batches and merchant payouts", href: "https://docs.adyen.com/account/getting-paid" },
  ],
};
