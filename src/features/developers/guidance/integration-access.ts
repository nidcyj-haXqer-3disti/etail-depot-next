import type { DocArticle } from "@/shared/ui/reading-guide/types";

export const integrationAccessArticle: DocArticle = {
    "introduction": "Confirm the merchant accounts, permissions and connection specifications for your setup.",
    "prerequisites": [
      "The services and operations your integration needs",
      "The business and account references already available to your team",
      "Contacts for engineering and payment operations"
    ],
    "sections": [
      { "id": "integration-access-specifications", "title": "Request your account specifications", "paragraphs": ["Account permissions and the operations available to your connection.", "The specifications and access instructions for your account."], "link": { "label": "Contact the integration team", "href": "/company/contact#integration" } },
      {
        "id": "connection-map",
        "title": "Map your connections",
        "paragraphs": [
          "A portal login does not grant API access. Confirm which services and operations your business needs; reporting access alone does not permit refunds, adjustments or funding instructions."
        ],
        "flow": "access"
      },
      {
        "id": "account-mapping",
        "title": "Keep account identities distinct",
        "paragraphs": [
          "Map your business record to the identifiers assigned for the application, processing and reporting services. Store sandbox and production mappings separately."
        ],
        "table": {
          "caption": "Account mapping",
          "headers": [
            "Record",
            "How to use it"
          ],
          "rows": [
            [
              "Your business ID",
              "Your stable identifier for the business using your platform. On your server, check whether the user who is signed in has access to it."
            ],
            [
              "Application and program",
              "The application reference and any program identifier assigned to it. Keep the review decision and setup results with that application."
            ],
            [
              "Processing account",
              "The merchant or organization identifiers assigned for processing. Keep distinct identifiers separate where the integration requires more than one."
            ],
            [
              "Reporting account",
              "The account or tenant that controls reporting access and the merchant whose records may be read. Confirm the account references in your integration documentation."
            ],
            [
              "Environment",
              "Keep a separate mapping for sandbox and production. A matching label or identifier is not evidence that the two environments are interchangeable."
            ]
          ],
          "codeColumn": false
        },
        "steps": [
          {
            "title": "Check account permissions on your server",
            "text": "Start from the authenticated user and your own business record. Determine the permitted merchant and operation before making an external request."
          },
          {
            "title": "Check the returned account",
            "text": "Compare the response with the expected merchant mapping. Do not display a record from a different merchant, even when the API request itself succeeded."
          }
        ],
        "outcome": "Changing a merchant ID in a browser request cannot change which account that user is authorized to access."
      },
      {
        "id": "credentials",
        "title": "Protect credentials and permissions",
        "paragraphs": [
          "Store secrets in your backend’s protected configuration. Keep them out of browser bundles, URLs, analytics and application logs. Use credentials only for their assigned service and environment."
        ],
        "details": [
          {
            "title": "Rotate or revoke a key",
            "text": "Use the authorized process for managing keys. Verify the replacement in the correct environment before retiring an uncompromised old key. If a secret is exposed, restrict affected access and follow the incident procedure. Send only the key identifier in a support request, never its secret value."
          },
          {
            "title": "Keep webhook security separate",
            "text": "Incoming events may use separate verification keys or encryption settings. Follow the event documentation; an outbound API credential does not authenticate an incoming notification."
          }
        ]
      },
      {
        "id": "verify-access",
        "title": "Verify access before changing records",
        "paragraphs": [
          "Begin with the documented account lookup without changing records. Confirm both the intended merchant and refused access to other merchants. An HTTP status alone does not establish a payment result or application decision."
        ],
        "table": {
          "caption": "Verify access and outcomes",
          "headers": [
            "Check",
            "What to establish"
          ],
          "rows": [
            [
              "Identity",
              "The connection returns the records for the intended merchant and environment."
            ],
            [
              "Permissions",
              "Access outside the assigned merchant or permitted operation is refused."
            ],
            [
              "Request acceptance",
              "A successful connection or accepted request is distinguished from the application decision or payment result."
            ],
            [
              "Uncertain operation",
              "An operation with an uncertain result can be traced using its original reference before another attempt."
            ]
          ]
        },
        "note": {
          "title": "Resolve an uncertain operation before retrying",
          "text": "Authentication failure, validation failure and a lost response need different recovery. If the service may have accepted the operation, recover its result before submitting another one."
        }
      },
      {
        "id": "implementation-handoff",
        "title": "Request the connection specifications",
        "rows": [
          {
            "title": "Access and authentication",
            "text": "Credential format, authentication procedure, key rotation and revocation, permitted operations and separate environment settings."
          },
          {
            "title": "Accounts and checkout",
            "text": "Merchant mappings, website origins, enabled methods, submission and capture responsibilities, and the authoritative payment lookup."
          },
          {
            "title": "Events and recovery",
            "text": "Event field and status definitions, delivery verification or encryption, acknowledgment, retry rules, reporting availability and rate limits."
          },
          {
            "title": "Support contacts",
            "text": "Keep support contacts for access incidents, unresolved payments, refunds, disputes and funding questions up to date."
          }
        ],
        "paragraphs": [
          "Ask our integration team for the specifications for your account. Keep the approved version and configuration with the connection."
        ]
      }
    ]
  };
