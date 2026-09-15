# PRD extract for UX and architecture

Source: `../../../prds/prd-book-ai-project-2026-09-15/prd.md`, its `addendum.md`, and its `.memlog.md`; extracted 2026-09-15. The finalized PRD permits planning; it does not establish implemented or tested behavior.

## Confirmed constraints

- Real commercial personal website plus existing IT-question PDF ebook sales; worldwide target audience; English public launch, later languages deferred.
- Next.js frontend and NestJS backend; PayPal payment. Owner has an account, but ability to accept intended USD payments needs verification. USD is intended and retains assumption A-5 status.
- Required public sections: `/info`, `/book`, `/tiktok`, and a blog. `thanghub.com` is only an example; domain and branding are unconfirmed.
- Guest purchase: choose Book → collect any valid email and international phone → review/correct contacts → PayPal → email purchased Book link. No website customer registration. Detailed sessions, traffic sources, personas, and observed customer behavior were not supplied.
- PDFs reach approximately 100 MB. Latest owner decision supersedes attachments: Delivery email carries an owner-supplied Google Drive or other download URL. No custom link expiry, tokens, download counting, sharing prevention, or automated Drive integration is required.
- Sole Admin is owner Thang. Scope: Books/prices, Orders, email history, personal information, blog posts, Affiliate links.

## Required information architecture surfaces

### Public and buyer

- `/info`: published owner introduction/personal information.
- `/book`: active Books with title, description, price and sufficient identity of the purchased PDF; inactive/unavailable Books cannot begin new checkout.
- Book purchase surface: Book, total/currency, labeled email and phone, field errors, contact review/correction, PayPal handoff, payment outcome and delivery status with Order reference. Separate detail/checkout routes are a UX decision, not a confirmed requirement.
- `/tiktok`: active titled external Affiliate links; independent from paid Book download URLs.
- Blog listing and post reading; drafts and unpublished posts inaccessible publicly. `/blog`, `/blog/{slug}`, and a homepage linking main sections are A-1 defaults.
- Delivery email: purchased Book identity, Order reference and correct saved download link. English email is A-16.

### Admin

- Protected entry, session/logout and recovery experience; `/admin` and provisioned sole account are A-9. Architecture selects authentication/recovery.
- Books: create/edit title, description, price, private Download link; activate/deactivate. Positive USD and valid HTTPS rules are A-10. No binary upload UI required.
- Orders list/detail: proposed A-11 reference/date/Book/agreed amount/currency/contact/payment state/PayPal reference/related email attempts; lookup by reference or email and filter by payment state.
- Email history/detail: recipient, Order reference, time, provider reference, evidence-based outcome and actionable failure information. A-8 manual resend requires confirmation; link correction is explicit for a paid Order with history and uses corrected saved link on resend.
- Personal information editing/publishing; A-13 display name, short introduction, biography, optional social links.
- Blog create/edit/publish/unpublish; A-14 title, unique slug, body, publication state. Editor choice remains open.
- Affiliates add/edit/reorder/activate/deactivate; A-15 title, HTTPS destination, optional description.

## Critical states and truthfulness

- Payment: pending (including uncertain), cancelled, failed, paid. Backend verification must match Order, amount, currency and intended merchant. Return from PayPal or approval alone cannot show payment as verified.
- Uncertain payment remains pending until reconciled. Retry of the same attempt must not create another charge. Repeated events and refresh must not duplicate initial fulfillment. Reconciliation cannot depend on browser return.
- Payment and email are separate axes (A-6). Paid stays visibly successful when email fails; show Order reference and delivery status without asking for another payment.
- Email attempts: pending, provider-accepted, failed, unknown (A-12); delivered/bounced only with provider evidence. Never call provider acceptance confirmed inbox delivery. Surface uncertain outcomes before manual resend.
- Paid Order link can be corrected explicitly before resend with change history (A-8). Book edits must not silently rewrite agreed Order data or its saved link (A-7).
- Draft/unpublished blog posts, inactive Affiliates, inactive Books, invalid price/link, contact validation, unauthenticated Admin, expired/logged-out session, and protected-data rejection require coherent UI handling. Exact visual treatments are design proposals.
- Later refunds/disputes are operationally handled in PayPal; reconciliation preserves history and does not send another Delivery email. Revocation of an already-shared URL is not promised.

## Architecture inputs

- Backend-authoritative price and durable agreed Book title/price/currency/contacts on Order. A-7 saves the download link when checkout starts and rejects unavailable Books.
- Private download links excluded from public catalog and unpaid responses; customer contacts and admin data protected; authorization on every protected action; secrets absent from client responses/logs.
- Durable Orders and Email attempts; recover paid unfinished fulfillment after restart/outage. Idempotent payment confirmation and initial fulfillment; evidence-based provider reconciliation and controlled manual resend.
- A-17 timing: initial email attempt begins within 60 seconds of verified payment while dependencies are available; paid fulfillment lacking provider acceptance identifiable in Admin Order detail within five minutes, even provider failure. Not inbox-arrival promises or measured performance.
- A-17 usability: core catalog/checkout/admin at 360 px and 1440 px; keyboard-operable core controls, explicit labels and field-specific validation.
- Sanitize content/links; exclude contact details from public URLs and general logs. Design a secure guest Order-status access mechanism without assuming customer accounts.
- Replaceable interface/email text for future localization (A-16); additional language controls deferred.
- Test unauthenticated download of representative near-100-MB PDF using emailed external link; application sends neither PDF bytes in email nor promises host download speed.
- Hosting, persistence, queue/recovery, authentication/provisioning/recovery, backup/restore, editor, email provider/sender domain/evidence and integration details require architectural decisions.

## Reversible assumptions to preserve

A-1 routes/homepage; A-2 manual Affiliate entry/external purchase; A-3 one Book per checkout/no cart; A-4 no SMS; A-5 USD; A-6 separate payment/email/reconciliation; A-7 saved link; A-8 controlled manual resend/link correction; A-9 provisioned sole Admin; A-10 Book field/activation rules; A-11 Order fields/search/filter; A-12 evidence-based email states; A-13 personal fields; A-14 blog fields/publication; A-15 Affiliate fields/actions; A-16 English Admin/email and replaceable text; A-17 cross-cutting acceptance; A-18 scope exclusions; A-19 proposed release measures/versioned test evidence. These are planning defaults, not explicit user approvals or research findings.

A-18 excludes unrequested carts, coupons, bundles, subscriptions, multiple Admin roles, analytics dashboards, automated refund UI and automated tax calculation. No customer accounts are confirmed; remaining exclusions retain proposed status.

## Unresolved choices and launch dependencies

- User visual choices absent: style references, mood, palette, typography, logo, imagery/cover availability, density, layout, navigation presentation, motion and desired visual differentiation. Do not invent approval for these.
- Brand/domain, owner copy, Book descriptions, support email and actual content assets need owner input before publishing. Detailed buyer screen sequence remains UX + owner work.
- Merchant country/type/payment readiness; external link permissions; sender verification; refund/support/privacy/tax/retention decisions are live-launch dependencies. Worldwide audience is not verified payment availability everywhere.
- Traffic, budget, launch date and production service targets remain open for sizing. No revenue/conversion targets were supplied.
- Owner reviews purchase/Admin scenarios before live sales; QA versions test set and records app revision/environment/results (A-19). Planning review is not implementation evidence.
