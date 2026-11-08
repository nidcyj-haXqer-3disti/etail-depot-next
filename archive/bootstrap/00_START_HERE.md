# Etail Depot Next — start here

This release is a public website with links to separately hosted services. Trolleys is the payment destination. Ledgix cards are coming soon. Six public pages share one header, footer and design system.

Read [project targets](project-targets.json), [source precedence](docs/SOURCE_PRECEDENCE.md), [public website architecture](docs/PUBLIC_SITE_ARCHITECTURE.md), [README](README.md) and [current status](planning/STATUS.md).

The internal Etail login, dashboards, APIs and financial backend are retired. Their source remains in Git history; immutable database definitions are preserved in [the database archive](archive/database/README.md). Existing databases are unchanged and are not used by this website. Older master prompts and product designs are retained as dated history.

Use the commands in the README to check and package this application. No database, account credentials, data migration or provider setup is required to run it locally. Publication is a separate action against the exact approved Netlify site.
