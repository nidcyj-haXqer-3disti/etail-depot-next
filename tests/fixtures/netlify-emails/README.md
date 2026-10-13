# Reviewed Netlify Emails compilation

`index.mjs.txt` is the generated, non-executed test specimen for the pinned Netlify Emails 2.0.1 handler plus Etail's authenticated POST wrapper. It contains no credentials, templates or customer data. It is never a public application input.

The original handler is taken unchanged from the official npm package; its SHA-256 is `8d2cd139e7a586f66809dea8dfa0bbb8a360b4792dcc97ed80a4f90f1578f6f3`. Netlify's existing local `@netlify/zip-it-and-ship-it` 15.5.0 installation produced this specimen with its modern Functions runtime (NFT and its local-module transformation). That tool is not a project dependency and is not reintroduced for this fixture.

The verifier pins the entire compiled syntax model. It disregards whitespace/comments and normalizes only the checkout-dependent CommonJS module identifier. It does not remove executable statements. Any wrapper, vendor or bundling change requires a reviewed fixture and pin update; negative tests reject eager calls, modified vendor behavior, authentication bypasses and changed exports.

Official sources:
- https://registry.npmjs.org/@netlify/plugin-emails/-/plugin-emails-2.0.1.tgz
- https://github.com/netlify/build/tree/main/packages/zip-it-and-ship-it
