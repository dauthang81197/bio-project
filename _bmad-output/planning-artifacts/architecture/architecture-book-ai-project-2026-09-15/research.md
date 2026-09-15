# Architecture research notes

Checked 2026-09-15. These sources support the spine; exact dependency patches belong in the lockfile.

- Next.js official installation docs: `create-next-app` defaults include TypeScript, Tailwind CSS, ESLint, App Router, and Turbopack; current minimum Node.js is 20.9. https://nextjs.org/docs/app/getting-started/installation
- Node.js official releases: use the current Node.js LTS line for production; the spine records 24.x LTS as the selected 2026 line. https://nodejs.org/en/about/previous-releases
- NestJS official documentation: NestJS is a TypeScript Node.js framework with modules, controllers, providers, and adapters suited to the API boundary. https://docs.nestjs.com/
- PostgreSQL official documentation describes `FOR UPDATE SKIP LOCKED` as suitable for avoiding contention among queue-like consumers; this supports a database-backed outbox worker. https://www.postgresql.org/docs/current/sql-select.html
- PayPal official standard checkout documentation separates browser approval from server-side order capture; webhooks require verification and duplicate-safe processing. https://developer.paypal.com/studio/checkout/standard/integrate and https://developer.paypal.com/api/rest/webhooks/rest/
- OWASP session guidance recommends HTTPS, `Secure`, `HttpOnly`, and explicit `SameSite` cookie attributes; SameSite is defense in depth and not a replacement for CSRF protection. https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html and https://cheatsheetseries.owasp.org/cheatsheets/CSRF_Prevention_Cheat_Sheet.html

No package installation or production-provider selection was performed. Exact patch versions, email provider, hosting, backups, and alerting remain implementation decisions.
