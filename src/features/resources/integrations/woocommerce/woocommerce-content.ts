export const woocommerceGuidePath = "/resources/woocommerce-gateway-integration";

// Deliberately nonfunctional examples. Never replace these with account credentials.
export const wooExample = {
  organization: "example_company",
  username: "store_admin",
  file: "example_store.p12",
  path: "/srv/htdocs/wp-content/.certificates/example_store.p12",
} as const;
export type WooCommerceStep = {
  id: string; title: string; actions: readonly { title: string; text: string }[]; note?: string;
  location: "wordpress" | "email" | "cybersource" | "hosting" | "storefront" | "both";
  menu: string;
  screenshot?: "store" | "plugin" | "payments" | "login" | "keys" | "certificate" | "storage" | "credentials" | "settings" | "checkout" | "records" | "refund";
  artwork?: "email" | "file-transfer" | "api-copy" | "certificate-download" | "certificate-settings"; caption: string;
};
export const woocommerceSetupSteps: readonly WooCommerceStep[] = [
  {
    "id": "prepare-wordpress",
    "title": "Open your WordPress store",
    "location": "wordpress",
    "menu": "Plugins → Installed Plugins",
    "actions": [
      {
        "title": "Open WP Admin",
        "text": "Sign in to WordPress.com, select your store, then choose WP Admin."
      },
      {
        "title": "Activate WooCommerce",
        "text": "In Plugins → Installed Plugins, find WooCommerce. If missing, add WooCommerce by Automattic and activate it."
      },
      {
        "title": "Check store details",
        "text": "Open WooCommerce Settings. Confirm your address, currency, product, cart and checkout."
      }
    ],
    "note": "Back up your website. Keep your current payment option available until the new checkout works.",
    "screenshot": "store",
    "caption": "Open Settings beneath WooCommerce to check your store details."
  },
  {
    "id": "install-plugin",
    "title": "Install Visa Acceptance Solutions",
    "location": "wordpress",
    "menu": "Plugins → Add Plugin",
    "actions": [
      {
        "title": "Search for Visa Acceptance Solutions",
        "text": "Choose the plugin by Visa Acceptance Solutions, without “SMB” in its name."
      },
      {
        "title": "Install Now, then Activate",
        "text": "If already active, continue."
      }
    ],
    "screenshot": "plugin",
    "caption": "Visa Acceptance Solutions 3.0.0. Select Configure Payment Settings to open its settings."
  },
  {
    "id": "open-payment-settings",
    "title": "Open your WooCommerce payment settings",
    "location": "wordpress",
    "menu": "WooCommerce → Settings → Payments",
    "actions": [
      {
        "title": "Find Visa Acceptance Solutions",
        "text": "Select Manage beside it. Keep this payment settings tab open."
      }
    ],
    "screenshot": "payments",
    "caption": "Select Manage beside Visa Acceptance Solutions."
  },
  {
    "id": "check-your-email",
    "title": "Find your account email",
    "location": "email",
    "menu": "Your inbox → Account email from Trolleys",
    "actions": [
      {
        "title": "Open the Trolleys email",
        "text": "Find your Cybersource Organization ID and Username. Follow the email to set your Cybersource password."
      }
    ],
    "note": "Missing the email? Contact Trolleys before continuing. Do not create another merchant account.",
    "artwork": "email",
    "caption": "Example account email. Use the details sent to you."
  },
  {
    "id": "sign-in-business-center",
    "title": "Sign in to Cybersource",
    "location": "cybersource",
    "menu": "Live Business Center → Log in",
    "actions": [
      {
        "title": "Enter Organization ID and Username",
        "text": "Use the details from your Trolleys email."
      },
      {
        "title": "Enter your Cybersource password",
        "text": "Select Log in and complete any verification."
      }
    ],
    "note": "Use your Cybersource password, not your WordPress password. Do not select Test login.",
    "screenshot": "login",
    "caption": "Live Cybersource sign in. Use the details from your account email."
  },
  {
    "id": "create-shared-secret",
    "title": "Copy and paste your API details",
    "location": "cybersource",
    "menu": "Payment Configuration → Key Management",
    "actions": [],
    "artwork": "api-copy",
    "caption": ""
  },
  {
    "id": "download-certificate",
    "title": "Download your .p12 file",
    "location": "cybersource",
    "menu": "Key Management → Generate key → REST – API Response MLE",
    "actions": [],
    "artwork": "certificate-download",
    "caption": ""
  },
  {
    "id": "store-certificate",
    "title": "Upload your .p12 file with Cyberduck",
    "location": "hosting",
    "menu": "WordPress.com file access → Cyberduck → Your store’s files",
    "actions": [],
    "artwork": "file-transfer",
    "caption": "Cyberduck transfers the certificate from your computer to your WordPress.com store."
  },
  {
    "id": "enter-credentials",
    "title": "Use your uploaded .p12 file",
    "location": "wordpress",
    "menu": "WooCommerce → Settings → Payments → Visa Acceptance Solutions → Manage",
    "actions": [],
    "artwork": "certificate-settings",
    "caption": ""
  },
  {
    "id": "save-settings",
    "title": "Choose payment options and save",
    "location": "wordpress",
    "menu": "Visa Acceptance Solutions → Save changes",
    "actions": [
      {
        "title": "Enable the gateway",
        "text": "Choose Embedded or Sidebar for the checkout display."
      },
      {
        "title": "Check collection settings",
        "text": "Use the Charge Virtual-Only Orders and Capture Paid Orders settings confirmed by Trolleys."
      },
      {
        "title": "Save changes",
        "text": "Leave Debug Mode Off and fraud protection on. Check for a success message and Registered Webhooks."
      }
    ],
    "note": "If saving fails or the expected webhook entry is missing, contact Trolleys before accepting orders.",
    "screenshot": "settings",
    "caption": "Enable the gateway and select Save changes at the bottom."
  },
  {
    "id": "place-test-order",
    "title": "Place one small live order",
    "location": "storefront",
    "menu": "Your storefront → Cart → Checkout",
    "actions": [
      {
        "title": "Add a low value item to your cart",
        "text": "Arrange this payment check with Trolleys first."
      },
      {
        "title": "Pay with your own card",
        "text": "Enter your details and complete any bank verification. Pay once; wait for Order received."
      }
    ],
    "note": "This makes a real charge and may incur fees. Never use sandbox card numbers in Production.",
    "screenshot": "checkout",
    "caption": "The WooCommerce payment interface. Your store theme may differ."
  },
  {
    "id": "match-payment",
    "title": "Check the payment in both accounts",
    "location": "both",
    "menu": "WooCommerce Orders → Order notes · Business Center Transactions",
    "actions": [
      {
        "title": "Open WooCommerce → Orders",
        "text": "Open the new order. Find its payment reference in Order notes."
      },
      {
        "title": "Open Cybersource → Transaction Management → Transactions",
        "text": "Find the Request ID. Match the order reference, amount and currency."
      }
    ],
    "note": "Authorization is approval, not collection. Pending is not complete. If records disagree, contact Trolleys before taking more orders.",
    "screenshot": "records",
    "caption": "Match the boxed reference and amount. Card Credit appears after a refund."
  },
  {
    "id": "verify-refund",
    "title": "Verify the refund",
    "location": "both",
    "menu": "WooCommerce Orders → Refund · Business Center Transactions",
    "actions": [
      {
        "title": "Refund the captured payment",
        "text": "Open the WooCommerce order. Select Refund, enter the amount, then Refund via Visa Acceptance Solutions."
      },
      {
        "title": "Check both accounts",
        "text": "For a full refund, WooCommerce shows Refunded and zero Net Payment. Find the matching credit in Cybersource Transactions."
      }
    ],
    "note": "For an authorization only, ask Trolleys about a reversal. A manual refund does not return money through the gateway. Bank posting may take longer.",
    "screenshot": "refund",
    "caption": "A full refund shows the refunded amount and zero Net Payment."
  }
];
