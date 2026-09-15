---
title: "Personal Website and IT Ebook Store"
project: book-ai-project
status: final
created: 2026-09-15
updated: 2026-09-15
---

# PRD: Personal Website and IT Ebook Store

## 1. Purpose and Vision

Build the owner's personal website for a real commercial launch. Visitors can learn about the owner, read blog posts, browse affiliate links, and buy existing PDF ebooks containing IT knowledge questions. The owner manages content and sales from one admin area.

The immediate business objective is to sell existing books with PayPal and deliver access by email without customer registration. Personal information, blog posts, and affiliate links are also part of the initial release. Additional sections and management features can be defined later.

This PRD supplies functional scope and acceptance conditions for UX, architecture, and story planning. It is grounded in the owner's conversation, not customer research. Items marked [ASSUMPTION A-N] are reversible defaults proposed under the instruction to proceed, not claims of explicit owner approval. Technical constraints and research are in addendum.md.

Finalized for planning on 2026-09-15 after requirements reconciliation, rubric review, and editorial review. Proposed defaults have owners and revisit points in section 10. Live sales remain subject to the launch prerequisites in section 9.

## 2. Confirmed Decisions

- Worldwide target audience; English at launch, additional languages later.
- Public sections: /info, /book, and /tiktok, plus a blog.
- thanghub.com was an example; final branding and domain ownership are unconfirmed.
- Existing IT-question ebooks are PDFs up to approximately 100 MB.
- PayPal payments; the owner has an account and intends to sell in USD.
- Guest checkout collects email and phone number. Any valid email is accepted, not just Gmail.
- After successful payment, email the Book's owner-supplied Google Drive or other Download link. This replaces the earlier PDF attachment requirement.
- One Admin: the owner. Manage Books, prices, Orders, email history, personal information, blog posts, and Affiliate links.
- Frontend: Next.js (React). Backend: NestJS (Node.js).

## 3. Scope Boundaries

The first release covers FR-1 through FR-15 and the acceptance conditions above. Further admin features and languages are deferred as requested.

Proposed exclusions [ASSUMPTION A-18]: customer accounts, carts, coupons, bundles, subscriptions, multiple admin roles, analytics dashboards, an automated refund interface, and automated tax calculation. These are not requested launch commitments.

For the initial release, refunds and disputes are handled operationally through PayPal. Architecture must define reconciliation of later payment changes without erasing history or sending another Delivery email for a refund/reversal. Access revocation is not promised for an already-shared external link.

Refund terms, tax treatment, customer support, and data retention are pre-launch business items. The worldwide audience does not imply that every country or payment method is supported by the merchant account.


## 4. Users and Flow Context

- **Visitor:** reads personal information and blog posts, browses Books and Affiliate links.
- **Customer:** buys a Book as a guest and uses the Delivery email to access it.
- **Admin:** the owner, Thang, who maintains content and inspects sales and email history.

The owner established this purchase sequence: choose a Book, enter email and phone number, pay through PayPal, then receive a Download link by email. A detailed customer session, traffic source, and customer persona were not supplied. UX planning should elaborate the screen sequence without treating invented personas as research.

The owner described managing Books, prices, Orders, email history, personal information, blog posts, and Affiliate links. The detailed editing behavior below is proposed rather than a claim of observed use.

## 5. Glossary

- **Book:** a sellable PDF ebook with catalog information, price, and a Download link.
- **Order:** a purchase record containing the Book, customer contact details, and payment state.
- **Delivery email:** an email containing the Download link for a paid Order.
- **Download link:** an owner-supplied Google Drive or other URL used to obtain a Book.
- **Email attempt:** one attempt to send a Delivery email; provider acceptance is distinct from inbox delivery.
- **Affiliate link:** an owner-supplied external promotional URL displayed at /tiktok.

## 6. Functional Requirements

### Public Content

**FR-1 — Personal information.** Visitors can open /info to read the owner's introduction. Published admin changes appear on that page. Visitors cannot edit its content.

**FR-2 — Blog reading.** Visitors can browse published posts and read individual posts. Draft posts are not publicly accessible. [ASSUMPTION A-1] Use /blog and /blog/{slug}; the homepage introduces and links to the main sections. UX planning may revise these routes.

**FR-3 — Affiliate browsing.** /tiktok displays active Affiliate links with titles and external destinations. Selecting a link opens its configured destination; inactive links are absent from the public list. [ASSUMPTION A-2] Links are entered manually. The website does not import TikTok content or process payments for linked products.

### Book Sales and Delivery

**FR-4 — Catalog.** /book lists active Books with title, description, and selling price. The customer can identify the PDF being purchased. [ASSUMPTION A-3] Each checkout buys one Book, with no cart, quantity selection, discounts, or bundles. A Book without a valid price or Download link cannot become purchasable.

**FR-5 — Guest checkout.** Collect a valid email address and phone number without requiring a website account. Accept international phone formats and any valid email provider. Allow the customer to review and correct these details before paying. Show the Book, total, and currency. Use the checkout email for fulfillment even if it differs from the PayPal email. [ASSUMPTION A-4] No SMS verification is required.

**FR-6 — PayPal payment and Order state.** Customers pay through PayPal. [ASSUMPTION A-5] Use USD throughout the initial catalog and checkout, subject to merchant readiness before launch.

- The backend determines the payable amount from the Book and saves the agreed title, price, currency, and contact details on the Order. Browser-supplied price changes cannot alter the payable amount.
- Fulfillment starts only after the backend verifies completed payment for the correct Order, amount, currency, and intended merchant. Browser redirects and customer approval alone do not establish payment.
- Pending, cancelled, failed, and paid outcomes are distinguishable. Unpaid outcomes do not trigger a Delivery email.
- Repeated confirmation events and page refreshes do not duplicate fulfillment. Returning to the website from PayPal is not required to reconcile completed payment.
- [ASSUMPTION A-6] Keep payment and email states separate. An uncertain payment remains pending until reconciled; retrying the same payment attempt cannot cause another charge. Architecture defines reconciliation and retry behavior.
- Payment success stays visible if email sending fails. Show the Order reference and delivery status without asking the customer to pay again.

**FR-7 — Delivery email.** After verified payment, email the correct Book's Download link to the checkout email. Identify the Book and Order. Do not attach the PDF or expose the Download link in public catalog data or unpaid checkout responses.

- The Admin supplies a customer-accessible Google Drive or other Download link, without a manual permission-approval step. No website account is required to obtain the file.
- [ASSUMPTION A-7] Save the Download link on the Order when checkout starts, rejecting checkout if the Book is no longer available. Later Book edits do not silently change an existing Order.
- Log sending failures and uncertain outcomes separately from success. Email failure does not reverse payment.
- [ASSUMPTION A-8] Allow the Admin to resend for paid Orders with explicit confirmation and a new Email attempt. No bulk sending or unlimited automatic retries is required initially. Reconcile uncertain provider outcomes where supported; otherwise show that uncertainty before manual resend.
- [ASSUMPTION A-8] Resend uses the saved Order link. The Admin can explicitly replace that link for a paid Order before resending; retain the change history to support correction of broken or moved files.
- Custom expiry, per-customer download tokens, download counting, and prevention of link sharing are deferred. The website does not promise revocation of a link already emailed.

### Owner Administration

**FR-8 — Admin access.** Only the owner can use admin screens and operations. Backend checks reject unauthenticated access to management data and actions. Logout ends the session. [ASSUMPTION A-9] Use /admin with a single provisioned owner account and no public registration. Architecture selects authentication and recovery; demonstrate both before launch.

**FR-9 — Books and prices.** The Admin can create and edit Book title, description, price, and Download link, and activate or deactivate sales. [ASSUMPTION A-10] Require positive USD prices and valid HTTPS links. Deactivation prevents new checkout without deleting Orders. Changes do not rewrite saved Order details. Binary PDF uploads and automated Google Drive integration are not required.

**FR-10 — Orders.** The Admin can view Order history and details. [ASSUMPTION A-11] Show reference, creation time, Book, agreed amount/currency, checkout email, phone, payment state, PayPal reference when available, and related Email attempts. Support lookup by Order reference or email and filtering by payment state. This data is never public.

**FR-11 — Email history.** The Admin can inspect Email attempts with Order reference, recipient, time, provider reference when available, outcome, and actionable failure information. [ASSUMPTION A-12] Distinguish pending, provider-accepted, failed, and unknown outcomes. Show delivered/bounced only when provider evidence supports it. Apply FR-7's resend behavior; never label provider acceptance as confirmed inbox delivery.

**FR-12 — Personal information editing.** The Admin can edit and publish content shown at /info; visitors can see published changes. [ASSUMPTION A-13] Begin with display name, short introduction, biography, and optional social links. UX determines their presentation.

**FR-13 — Blog authoring.** The Admin can create, edit, publish, and unpublish posts. [ASSUMPTION A-14] Each post has a title, unique slug, body, and publication state. Unpublishing removes it from the public list and direct public access. UX and architecture select the editor.

**FR-14 — Affiliate management.** The Admin can add, edit, reorder, activate, and deactivate Affiliate links. [ASSUMPTION A-15] Store a title, HTTPS destination, and optional description. Reject invalid destinations on publication. Affiliate links remain separate from paid Book Download links.

### Language

**FR-15 — English-first release.** Public pages launch in English. [ASSUMPTION A-16] Admin labels and Delivery emails also use English; keep interface/email text replaceable for future localization. Additional languages, language switching, and automatic content translation are deferred. PDF language remains the owner's content decision.

## 7. Cross-Cutting Acceptance Conditions

These proposed engineering defaults [ASSUMPTION A-17] are inputs to architecture and testing.

- **NFR-1 — Payment integrity:** forged confirmations, mismatched amounts/currencies, and repeated events cannot authorize unpaid delivery or duplicate initial fulfillment.
- **NFR-2 — Access protection:** public requests cannot read customer contacts, management data, or paid Download links. Every protected operation checks Admin authorization. Secrets are absent from browser responses and application logs.
- **NFR-3 — Recovery:** Order and Email attempt states survive restarts. Paid Orders with unfinished fulfillment remain available for recovery. Email failures cannot erase payment records.
- **NFR-4 — Usability:** catalog, checkout, and admin essentials work at 360 px and 1440 px widths; core controls work with a keyboard, fields have labels, and validation identifies the affected field.
- **NFR-5 — Content safety:** stored content and links cannot execute unauthorized scripts. Customer contact details are absent from public URLs and general diagnostic logs.
- **NFR-6 — File access:** release testing uses a representative PDF near the expected 100 MB maximum and verifies download through the emailed link as an unauthenticated recipient. The application does not send PDF bytes through email or promise an external host's download speed.
- **NFR-7 — Fulfillment timing:** when the application and email provider are available, begin the initial Email attempt within 60 seconds of backend confirmation of completed payment. A paid Order whose Delivery email has not been accepted by the email provider is identifiable in the admin Order detail within five minutes of payment confirmation, including during provider failure. Record elapsed time and outcome; these are application targets, not a guarantee of arrival in the recipient's inbox. Architecture must define how unfinished work is recovered after an application outage.

## 8. Success and Release Evidence

The main outcome is a paid customer obtaining the correct existing Book. Revenue targets have not been supplied.

Proposed release measures [ASSUMPTION A-19]:

- **SM-1 — Purchase correctness:** every successful-payment case in the agreed test set produces one paid Order with the expected Book, amount, currency, and recipient; validates FR-4 through FR-7 and FR-10.
- **SM-2 — Usable delivery:** successful-delivery cases produce the correct link, verified from a recipient mailbox through PDF download. Include email failure and manual resend cases; validates FR-7 and FR-11.
- **SM-3 — Owner independence:** the Admin can complete FR-9 through FR-14 operations without editing application code.
- **SM-C1 — Payment counter-measure:** zero unpaid fulfillments or duplicate charges caused by repeated requests in the agreed failure/retry test set; balances SM-1.
- **SM-C2 — Delivery counter-measure:** failed or unknown Email attempts remain distinguishable from provider-accepted or delivered outcomes; balances SM-2.

Production measurement should record paid Orders, email failures/unknown outcomes, and support-reported bad links. Set business targets and an observation window after initial usage data rather than inventing conversion targets.

Under A-19, the implementation/QA owner creates and versions the acceptance test set alongside the implementation before release. Record the test-set revision, application revision, tested environment, and results in the release evidence. Thang reviews the customer purchase and admin scenarios before live sales; changes to scope require corresponding test updates.

## 9. Deferred Decisions and Handoff

These decisions do not prevent UX or architecture work. Launch prerequisites must be resolved before live sales.

| Item | Owner | Revisit condition |
|---|---|---|
| PayPal account country/type and ability to receive intended USD payments | Thang | Launch prerequisite: verify before enabling live payments |
| Email provider, sender domain, delivery evidence, and reconciliation | Architecture + Thang | Select during architecture; verify sender and recipient test before launch |
| Final domain, branding, personal content, support email, Book descriptions | Thang | Supply before publishing pages and Delivery emails |
| Authentication, owner provisioning, recovery, backup/restore, hosting | Architecture | Define before affected implementation; demonstrate recovery before launch |
| External file sharing permissions | Thang | Verify each Book before activating sales; use FR-7 for link corrections |
| Refund/support terms, contact-data retention, applicable tax/privacy requirements | Thang | Launch prerequisite: settle before live orders; return scope changes to this PRD |
| Detailed buyer screen sequence and visual design | UX + Thang | Resolve before UI stories, without invented customer research |
| Traffic expectations, launch date, budget, production service targets | Thang + Architecture | Resolve during hosting/sizing and revisit with usage evidence |
| Additional languages, protected downloads, expanded admin features | Thang | Revisit after initial launch when requirements are specified |

## 10. Assumptions Index

These defaults are visible and reversible, not user-confirmed facts.

| ID | Proposed default | Revisit owner / point |
|---|---|---|
| A-1 | Blog routes and homepage navigation | UX / route design |
| A-2 | Manual affiliate entry and external checkout | Thang / affiliate story planning |
| A-3 | One Book per checkout, no cart | Thang / checkout story planning |
| A-4 | Phone collection without SMS | Thang / checkout design |
| A-5 | USD initial sales | Thang / merchant readiness |
| A-6 | Separate payment/email states and reconciliation | Architecture / payment design |
| A-7 | Save Download link at checkout start | Architecture / Order design |
| A-8 | Manual resend and per-Order link correction | Thang / delivery admin stories |
| A-9 | Single provisioned owner account at /admin | Architecture / authentication design |
| A-10 | Book editing, positive prices, HTTPS links, activation | Thang / Book admin stories |
| A-11 | Order fields, lookup, and filtering | Thang / Order screen design |
| A-12 | Evidence-based Email attempt states | Architecture / email provider selection |
| A-13 | Personal-information fields | Thang / /info design |
| A-14 | Blog fields and publication behavior | Thang / blog design |
| A-15 | Affiliate fields and management actions | Thang / affiliate design |
| A-16 | English admin/emails and replaceable text | Architecture / localization |
| A-17 | Cross-cutting acceptance conditions | Architecture / test planning |
| A-18 | Exclude unrequested commerce/admin capabilities initially | Thang / scope check before stories |
| A-19 | Release measures without invented revenue targets | Thang + QA / release test planning |
