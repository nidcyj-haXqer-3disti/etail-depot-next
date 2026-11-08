export const shopifyGuidePath = "/resources/shopify-gateway-integration";

export const shopifySetupSteps = [
  {
    "id": "open-settings",
    "title": "Open Settings",
    "text": "Sign in to the Shopify store you want to connect. On a computer, select Settings at the bottom of the menu. In the Shopify mobile app, open the menu, then Settings.",
    "file": "settings.webp",
    "width": 390,
    "height": 285,
    "alt": "Shopify navigation with a red arrow pointing to Settings.",
    "caption": "The screenshots show Shopify on a computer."
  },
  {
    "id": "open-payments",
    "title": "Open Payments",
    "text": "Select Payments in Settings. If you cannot add or change the payment provider, check that you are signed in as the store owner.",
    "file": "payments.webp",
    "width": 345,
    "height": 532,
    "alt": "Shopify Settings menu with Payments highlighted by a red arrow.",
    "caption": "Settings → Payments"
  },
  {
    "id": "find-provider",
    "title": "Find the provider list",
    "text": "In Settings → Payments, select See all other providers.",
    "choices": [
      {
        "condition": "Shopify Payments is already active",
        "action": "Select Manage, then Switch to a third-party provider. Shopify asks you to confirm the change."
      },
      {
        "condition": "You use another card payment provider",
        "action": "Select Choose another provider."
      },
      {
        "condition": "Shopify Payments is unavailable",
        "action": "Look for Choose a provider in Payment providers."
      }
    ],
    "note": "Already accepting payments? Confirm the switch with Trolleys first. Keep access to your previous provider for older orders and refunds.",
    "file": "other-providers.webp",
    "width": 915,
    "height": 565,
    "alt": "Payments settings showing See all other providers below Shopify Payments.",
    "caption": "See all other providers in Shopify Payments."
  },
  {
    "id": "select-cybersource",
    "title": "Choose Cybersource",
    "text": "Select Cybersource from the list. Do not choose Cybersource CAS, which is the separate app for testing.",
    "file": "choose-cybersource.webp",
    "width": 813,
    "height": 525,
    "alt": "Shopify provider list with a red arrow pointing to Cybersource.",
    "caption": "Choose Cybersource for your live store."
  },
  {
    "id": "install-app",
    "title": "Select Install",
    "note": "If Business Center is already open in another tab, sign out there before continuing.",
    "text": "Select Install to open the app permissions screen. If Cybersource is already installed, select Manage account and continue at step 7.",
    "file": "install.webp",
    "width": 1227,
    "height": 333,
    "alt": "Cybersource provider page with Install in the upper right corner.",
    "caption": "For a new installation, the next screen has a second Install button."
  },
  {
    "id": "review-access",
    "title": "Review app access",
    "text": "Check that the app is Cybersource by Visa Acceptance Solutions. Read the permissions it requests. Select Install only if you agree.",
    "note": "Shopify then opens the Cybersource sign in page.",
    "file": "permissions.webp",
    "width": 637,
    "height": 440,
    "alt": "Shopify app permission screen for Cybersource by Visa Acceptance Solutions, with an Install button.",
    "caption": "This second Install button grants the access shown on the screen."
  },
  {
    "id": "business-center-login",
    "title": "Open the Cybersource sign in page",
    "text": "Shopify opens the live Cybersource sign in page for this connection.",
    "actions": [
      "Check for ebc2.cybersource.com in the address bar.",
      "Keep this page open while you find your account details in the next step."
    ],
    "note": "This is a separate sign in from Shopify and your Trolleys merchant account.",
    "file": "business-center.webp",
    "width": 500,
    "height": 764,
    "alt": "Cybersource Business Center login with Organization ID, Username, Password and Log in.",
    "caption": "Cybersource Business Center. Find your sign in details in the next step."
  },
  {
    "id": "check-your-email",
    "title": "Check your email and sign in",
    "text": "Open the email from Trolleys, powered by Etail Depot, with your Cybersource account details.",
    "actions": [
      "Find your Organization ID and Username, then follow the password instructions in the email.",
      "Return to the Cybersource page. Enter those details in Organization ID, Username and Password.",
      "Select Log in. Do not choose Test login."
    ],
    "note": "Cannot find the email? Check your spam or junk folder, then ask Trolleys to help before continuing.",
    "artwork": "credentials-email"
  },
  {
    "id": "review-agreement",
    "title": "Review the account connection",
    "text": "The Onboarding Agreement links your Shopify store to your Cybersource account.",
    "actions": [
      "Under Tenant Merchant ID Mapping Information, check any existing account connection. If you do not recognize it, stop and ask Trolleys.",
      "Read the Access Terms. If you are authorized to accept them and agree, select I agree to the Access Terms.",
      "Select Enable Payer Authentication (3D Secure) only if Trolleys has confirmed it is enabled for your account and needed for this store.",
      "Select Confirm to return to Shopify."
    ],
    "note": "Selecting the 3D Secure checkbox does not enable that service on your merchant account. It must already be set up.",
    "file": "agreement.webp",
    "width": 1430,
    "height": 785,
    "alt": "Onboarding Agreement showing the merchant mapping, Access Terms, optional Payer Authentication and Confirm.",
    "caption": "The checkboxes shown are examples. Use the settings confirmed for your account."
  },
  {
    "id": "activate-provider",
    "title": "Choose payment methods and activate",
    "text": "After confirming the Cybersource connection, return to Shopify.",
    "actions": [
      "Select only the cards and payment methods Trolleys confirmed for your account.",
      "Select Activate. Save any changes if Shopify prompts you."
    ],
    "note": "Review the fees shown before activating. Shopify fees are separate from your gateway and processing fees.",
    "file": "activate.webp",
    "width": 911,
    "height": 661,
    "alt": "Cybersource marked Installed in Shopify with payment method switches and an Activate button.",
    "caption": "Installed does not confirm account setup. Activate makes Cybersource available at checkout."
  },
  {
    "id": "confirm-active",
    "title": "Confirm activation and payment settings",
    "text": "Return to Settings → Payments and look for Active beside Cybersource.",
    "note": "Next, verify a small live order in both accounts.",
    "file": "active.webp",
    "width": 883,
    "height": 657,
    "alt": "Cybersource marked Active in Shopify payment settings.",
    "caption": "Active means the connection is enabled. It does not confirm a successful payment or payout.",
    "actions": [
      "Review Payment capture method. Confirm when payments will be collected, using the setting agreed with Trolleys.",
      "Open the Cybersource settings for Apple Pay or Google Pay if they are enabled for your account. Save any changes."
    ]
  },
  {
    "id": "verify-integration",
    "title": "Verify the integration",
    "text": "Before taking customer orders, run one small live order. This is a real payment and fees may apply.",
    "ordered": true,
    "actions": [
      "Open your storefront, add an item to the cart and proceed to checkout.",
      "Enter shipping details and pay a small amount with a real card you are authorized to use.",
      "In Shopify, open Orders and select the order. Paid means the payment was captured; Authorized means it has not been captured yet. Under Timeline, expand the Cybersource payment, then Information from the gateway, and find the payment ID.",
      "In Business Center, go to Transaction Management → Transactions. Find the matching amount and currency, then open the transaction’s Request ID to see its details. The merchant reference number must match Shopify’s payment ID.",
      "Refund the full captured amount in Shopify to the original card and check Business Center. If the payment has not settled, it may be voided instead. For an authorization only, cancel the order and confirm its reversal in both accounts."
    ],
    "note": "If a payment or reversal is missing from either account, or the amount is wrong, contact Trolleys support before taking customer orders.",
    "artwork": "integration-verification"
  }
] as const;
