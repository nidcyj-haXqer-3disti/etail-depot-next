# Validation of the Guides review source

21 October 2026. The user authorized pushing the reviewed local website version to GitHub. This change preserves that review source separately from the active application; it does not authorize merging or deployment.

The accepted version contains twenty guides in ten sections and twenty-seven total pages. The exact source is recorded in `manifest.json`; the baseline is commit `2097a2da9660cb537ee061d25aeac6e9816ea419`. The reconstructed build has the same rendered page content as the accepted local version. Generated Next build IDs and chunk names can differ without changing that content.

Checks completed locally:

- All 102 baseline inputs and 29 source overrides match their recorded hashes.
- All original active application, dependency, lockfile, artwork and Netlify files remain unchanged.
- Independent review of the added source finds no credentials, research caches or dependency on historical artifact folders.
- The isolated review build and TypeScript check pass.
- Five asset regression tests pass, including marketing images, content types and rejected unsafe files/symlinks.
- Ninety-nine focused parity checks pass: all 27 rendered page bodies match the accepted preview; 16 image assets match and decode; twenty guide links, ten sections, navigation and private boundaries work.
- Existing application checks pass: 281 unit tests, 75 browser tests (one existing intentional skip), and 39 accessibility cases. Architecture, source-security and dependency audit checks pass; the audit reports no known vulnerabilities.

The lint run has no errors and two existing unused-import warnings in the exact preview metadata override, where indexing is deliberately disabled. The source is preserved exactly instead of changing approved snapshot bytes merely to remove warnings.

The first verification attempt stopped before checks because a shared dependency symlink did not match the baseline package. An isolated frozen-lockfile installation from the existing cache succeeded. Browser testing initially encountered the sandbox's loopback restriction and then an occupied port 3100. The verified older preview was temporarily stopped, the checks passed, and that preview was restored. The accepted preview on port 3222 was not interrupted.

The active website's production metadata, host-context protections, Netlify packaging and packaged-artifact boundary checks also pass locally. The package contains only the eleven existing public pages and approved platform handler; review files are absent. No deployment credentials are added. Netlify's existing automatic-build hold remains in place.

Mobile review uses Chromium viewport emulation at 390px and 320px, alongside desktop at 1440px. This is not a physical-device, legal-effectiveness or search-ranking certification. Production integration of the sixteen additional articles remains separate from preserving this review source.
