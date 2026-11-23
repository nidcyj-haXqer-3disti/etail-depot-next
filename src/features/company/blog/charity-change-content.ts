import type { BlogArticle } from "./content";

export const charityChangeArticle: BlogArticle = {
  "path": "/company/blog/charity-registration-payment-account",
  "title": "The charity’s records changed. What does the donation page now promise?",
  "description": "A charity’s name, registrations and activities can change separately. Keep payment approval and donor-facing claims tied to the current organization.",
  "summary": "The page should explain who receives the contribution today, not rely on an old certificate to answer every question.",
  "searchTitle": "Charity Registration Changes and Your Payment Account",
  "relatedPaths": [
    "/company/blog/business-name-change-payment-verification",
    "/company/blog/merchant-application-company-representative"
  ],
  "author": {
    "name": "Etail Depot",
    "type": "Organization",
    "url": "/company/about"
  },
  "sections": [
    {
      "id": "which-record",
      "title": "Separate the records that answer different questions."
    },
    {
      "id": "donor-and-account",
      "title": "Make the current organization recognizable to the donor."
    }
  ],
  "sources": [
    {
      "label": "IRS: Material changes for exempt organizations",
      "href": "https://www.irs.gov/charities-non-profits/exempt-organizations-material-changes"
    },
    {
      "label": "IRS: Reporting an exempt organization’s name change",
      "href": "https://www.irs.gov/charities-non-profits/charitable-organizations/change-of-name-exempt-organizations"
    },
    {
      "label": "Trolleys: Business information and approved account scope",
      "href": "/company/legal/merchant-services#approval"
    },
    {
      "label": "Trolleys: Activities requiring written approval",
      "href": "/company/legal/acceptable-use#review"
    },
    {
      "label": "Trolleys: Selling and accepting payments",
      "href": "/company/legal/merchant-services#acceptance"
    }
  ]
};
