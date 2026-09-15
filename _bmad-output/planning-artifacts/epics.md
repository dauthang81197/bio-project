---
stepsCompleted: [1, 2, 3]
inputDocuments:
  - _bmad-output/planning-artifacts/prds/prd-book-ai-project-2026-09-15/prd.md
  - _bmad-output/planning-artifacts/prds/prd-book-ai-project-2026-09-15/addendum.md
  - _bmad-output/planning-artifacts/architecture/architecture-book-ai-project-2026-09-15/ARCHITECTURE-SPINE.md
  - _bmad-output/planning-artifacts/ux-designs/ux-book-ai-project-2026-09-15/DESIGN.md
  - _bmad-output/planning-artifacts/ux-designs/ux-book-ai-project-2026-09-15/EXPERIENCE.md
---

# book-ai-project - Delivery Plan

## Overview

This document records the confirmed requirements extracted from the PRD, UX contract, and architecture spine. Epic and story design follows after this inventory is confirmed.

## Requirements Inventory

### Functional Requirements

- **FR1 — Personal information:** Visitors can read published owner information at `/info`; visitors cannot edit it.
- **FR2 — Blog reading:** Visitors can browse and read published posts; drafts and unpublished posts are not public. Proposed routes are `/blog` and `/blog/{slug}`.
- **FR3 — Affiliate browsing:** `/tiktok` displays active affiliate links with titles and external destinations; inactive or invalid links are not public.
- **FR4 — Book catalog:** `/book` lists active Books with title, description, USD selling price, and a purchase action. Books without valid price or Download link cannot be purchased.
- **FR5 — Guest checkout:** Customers enter a valid international email and phone number without creating an account, review the Book/total/currency, and submit to PayPal.
- **FR6 — Payment and Order state:** NestJS determines the price, verifies PayPal payment server-side, records Order snapshots, distinguishes pending/cancelled/failed/paid states, and prevents duplicate charges or fulfillment.
- **FR7 — Delivery email:** After verified payment, email the owner-supplied Google Drive or other Download link with Book and Order details. Do not attach PDFs. Track failures/unknown outcomes and allow controlled admin resend.
- **FR8 — Admin access:** Only the owner can access protected admin screens and operations; unauthenticated requests are rejected.
- **FR9 — Books and prices:** Admin can create/edit title, description, positive USD price, Download link, and active state without rewriting historical Orders.
- **FR10 — Orders:** Admin can view order history/details, customer contact, payment state, PayPal reference, and related email attempts, with lookup/filtering.
- **FR11 — Email history:** Admin can inspect attempts, recipient, timestamps, provider reference, outcomes, and failure details; provider acceptance is distinct from inbox delivery.
- **FR12 — Personal information editing:** Admin can edit and publish display name, introduction, biography, and social links shown at `/info`.
- **FR13 — Blog authoring:** Admin can create/edit/publish/unpublish posts with title, unique slug, body, and publication state.
- **FR14 — Affiliate management:** Admin can add/edit/reorder/activate/deactivate affiliate links with title, valid HTTPS destination, and optional description.
- **FR15 — English-first release:** Public pages, checkout, admin labels, and delivery emails launch in English; text remains replaceable for future localization.

### NonFunctional Requirements

- **NFR1 — Payment integrity:** Forged confirmations, mismatched amount/currency, and repeated events cannot authorize unpaid delivery or duplicate initial fulfillment.
- **NFR2 — Access protection:** Public requests cannot read customer contacts, admin data, or paid links; every protected operation checks admin authorization; secrets are not sent to browser or logs.
- **NFR3 — Recovery:** Order and Email attempt state survives restarts; paid Orders with unfinished fulfillment remain recoverable; email failure cannot erase payment records.
- **NFR4 — Usability:** Catalog, checkout, and admin work at 360px and 1440px; controls are keyboard-operable; fields have labels and useful validation.
- **NFR5 — Content safety:** Stored content and links cannot execute unauthorized scripts; customer contact values are not in public URLs or general logs.
- **NFR6 — File access:** Test a representative PDF near 100 MB through the emailed external link as an unauthenticated recipient; the application does not send PDF bytes through email.
- **NFR7 — Fulfillment timing:** When dependencies are available, begin the first email attempt within 60 seconds of verified payment; identify paid Orders without provider-accepted email within five minutes.

### Additional Requirements

- Use a modular monolith: Next.js owns rendering/browser interaction; NestJS owns domain mutations, payment verification, admin authorization, and fulfillment.
- PostgreSQL is the system of record; use reviewed SQL migrations and a `pg` client.
- Use a transactional outbox and worker lease/retry model for email fulfillment.
- Keep immutable Order snapshots for Book title, price, currency, checkout email, phone, and Download link.
- Use PayPal and email provider adapters behind application ports; provider callbacks are verified and idempotent.
- Use a server-held owner session with a Secure, HttpOnly, SameSite `__Host-` cookie over HTTPS, plus CSRF/Origin protections.
- Use a shared TypeScript API contract, stable error codes, opaque IDs, ISO 8601 UTC timestamps, and integer minor-unit money values.
- Deploy Next.js and NestJS behind one HTTPS origin; route `/api/*` to NestJS.
- Validate environment variables at startup; keep secrets in deployment secret storage.
- Use structured redacted logs and metrics for payment reconciliation, fulfillment latency, and email outcomes.
- Initial stack direction: Node.js 24.x LTS, Next.js 16.x, NestJS 12.x, TypeScript 5.x strict mode, PostgreSQL 18.x, `pg` 8.x, and pnpm 12.x. Lockfile owns exact patches at bootstrap.
- Deferred: exact email provider, hosting/reverse proxy, backup/alerting choices, customer accounts, carts, coupons, bundles, subscriptions, multiple admin roles, analytics dashboards, automated tax/refund interface, protected download tokens/expiry, and additional locales.

### UX Design Requirements

- **UX-DR1 — Design tokens:** Implement the DESIGN.md palette, typography, 8px spacing unit, radii, responsive gutters, component states, and semantic colors.
- **UX-DR2 — Public information architecture:** Implement `/`, `/info`, `/blog`, `/blog/{slug}`, `/book`, checkout/status surfaces, and `/tiktok` with shared navigation.
- **UX-DR3 — Admin information architecture:** Implement `/admin/login`, dashboard, Books, Orders, Email history, Personal info, Blog, and Affiliates surfaces.
- **UX-DR4 — Checkout behavior:** Validate email/phone inline, preserve form data through PayPal redirect, prevent duplicate submit, and show server-authoritative payment status.
- **UX-DR5 — Delivery states:** Clearly distinguish pending, paid, delivery pending, provider-accepted, failed, and unknown email outcomes; provide Order reference and truthful recovery guidance.
- **UX-DR6 — Content states:** Support loading, empty, validation error, network error, inactive/not-found, draft/unpublished, and offline states defined in EXPERIENCE.md.
- **UX-DR7 — Admin interactions:** Support keyboard-accessible tables, filters/pagination, explicit destructive confirmations, controlled resend, and link correction history.
- **UX-DR8 — Accessibility:** Target WCAG 2.2 AA, visible labels/errors, focus management, semantic tables, `aria-live` status updates, 44px touch targets, 200% text zoom, and reduced motion.
- **UX-DR9 — Responsive behavior:** Support 320px+ mobile layouts, 768–1199px intermediate behavior, and 1200px+ desktop layouts with admin drawer/sidebar changes.
- **UX-DR10 — English-first copy:** Use direct, calm English microcopy and keep text replaceable for future localization.

### FR Coverage Map

- FR1 → Epic 1 — Personal information page
- FR2 → Epic 1 — Published blog reading
- FR3 → Epic 1 — Affiliate browsing
- FR4 → Epic 2 — Book catalog
- FR5 → Epic 2 — Guest checkout
- FR6 → Epic 2 — PayPal payment and Order state
- FR7 → Epic 2 — Delivery email and controlled resend behavior
- FR8 → Epic 3 — Owner-only admin access
- FR9 → Epic 3 — Book and price administration
- FR10 → Epic 3 — Order history and details
- FR11 → Epic 3 — Email history and resend visibility
- FR12 → Epic 4 — Personal information editing
- FR13 → Epic 4 — Blog authoring
- FR14 → Epic 4 — Affiliate management
- FR15 → Epic 4 — English-first content and future localization readiness
- NFR1–NFR3, NFR7 → Epic 2 payment/fulfillment stories and Epic 3 recovery/admin stories
- NFR2, NFR5 → Epic 3 admin security stories and all content mutation stories
- NFR4, NFR6 → Epic 1–4 UX implementation and release validation stories
- UX-DR1–UX-DR10 → Distributed across the four epics according to their surfaces

## Planned Work

### Epic 1: Explore ThangHub and personal content

Visitors can read the owner's information, browse published blog posts, and open active affiliate links. This epic can launch as a content-focused site before commerce is enabled.
**FRs covered:** FR1, FR2, FR3.

### Epic 2: Buy and receive IT ebooks

Customers can browse Books, complete guest checkout with PayPal, and receive the correct owner-supplied Download link by email after verified payment.
**FRs covered:** FR4, FR5, FR6, FR7.

### Epic 3: Operate the store safely

The owner can sign in to the admin area, manage Books and prices, inspect Orders and Email attempts, and recover delivery issues without changing code.
**FRs covered:** FR8, FR9, FR10, FR11.

### Epic 4: Manage the brand and content

The owner can update personal information, author and publish blog posts, manage Affiliate links, and keep English-first content ready for later localization.
**FRs covered:** FR12, FR13, FR14, FR15.

Natural dependencies: Epic 1 provides shared public navigation; Epic 2 uses that shell but is a complete purchase flow; Epic 3 operates Order data from Epic 2 and can use fixtures while developed; Epic 4 depends on protected admin access but is complete for its content domain. Security, recovery, responsive behavior, and accessibility remain acceptance criteria within the relevant stories rather than separate technical epics.

## Epic 1: Explore ThangHub and personal content

### Story 1.1: Establish the public site shell

As a visitor,
I want consistent navigation and responsive public page structure,
So that I can move between the owner's information, blog, books, and affiliate sections.

**Acceptance Criteria:**

**Given** a visitor opens any public route
**When** the page renders at mobile, tablet, or desktop width
**Then** the shared header/navigation identifies the current section and links to `/info`, `/blog`, `/book`, and `/tiktok`
**And** the layout follows DESIGN.md tokens, remains usable at 320px width, and has a labeled mobile menu.

**Given** a keyboard or screen-reader user navigates the shell
**When** focus moves through the header and menu
**Then** focus order follows reading order, the current section is conveyed programmatically, and the menu can be opened and closed without a pointer.

### Story 1.2: Publish the personal information page

As a visitor,
I want to read the owner's introduction and social links,
So that I can understand who runs ThangHub.

**Acceptance Criteria:**

**Given** published personal information exists
**When** a visitor opens `/info`
**Then** the page displays the published display name, introduction, biography, and configured social links
**And** no admin editing controls, customer data, or private links are present in the response.

**Given** personal information has not yet been published
**When** a visitor opens `/info`
**Then** the page shows a useful empty/content-unavailable state and does not expose draft fields.

### Story 1.3: Read published blog posts

As a visitor,
I want to browse and read published blog posts,
So that I can learn from the owner's writing.

**Acceptance Criteria:**

**Given** published posts exist
**When** a visitor opens `/blog`
**Then** the page lists each published post with title, summary or excerpt, and a link to its unique slug
**And** draft or unpublished posts are absent.

**Given** a visitor opens a published post slug
**When** the post is available
**Then** `/blog/{slug}` renders its title and body in a readable layout with English interface copy
**And** an unknown, draft, or unpublished slug returns a normal not-found result without draft content.

### Story 1.4: Browse TikTok affiliate links

As a visitor,
I want to browse the owner's affiliate recommendations,
So that I can open products the owner promotes.

**Acceptance Criteria:**

**Given** active valid Affiliate links exist
**When** a visitor opens `/tiktok`
**Then** each visible link has a title and clear external destination action
**And** inactive or invalid links are not displayed.

**Given** a visitor activates an Affiliate link
**When** the external destination opens
**Then** the browser indicates that the destination is external and the configured URL is used without passing customer checkout data.

### Story 1.5: Apply public accessibility and responsive states

As a visitor,
I want public pages to remain understandable across devices and states,
So that I can use the site with different screens and input methods.

**Acceptance Criteria:**

**Given** a public page is loading, empty, unavailable, or has a network error
**When** the state is shown
**Then** it uses text plus semantic status, preserves the page structure, and offers an appropriate retry or navigation action.

**Given** a visitor uses keyboard navigation, 200% text zoom, or reduced-motion settings
**When** they use public content
**Then** all controls remain reachable, labels remain readable, focus is visible, and nonessential transitions are removed.

## Epic 2: Buy and receive IT ebooks

### Story 2.1: Browse the book catalog

As a customer,
I want to see available IT ebooks and their USD prices,
So that I can choose a book to buy.

**Acceptance Criteria:**

**Given** active Books have a valid positive price and Download link
**When** a customer opens `/book`
**Then** each Book shows its title, description, USD price, and purchase action
**And** the external Download link is not exposed before payment.

**Given** a Book is inactive, missing a valid price, or missing a Download link
**When** the catalog is requested
**Then** that Book cannot be purchased and is not shown as an active purchasable item.

### Story 2.2: Create a guest checkout Order

As a customer,
I want to enter my email and phone without creating an account,
So that I can pay for one Book quickly.

**Acceptance Criteria:**

**Given** a customer selects an active Book
**When** they open checkout and submit a valid email and international phone number
**Then** the system shows the Book, server-derived USD total, contact details, and a PayPal action
**And** the customer can correct details before payment.

**Given** the browser submits a modified price or an invalid contact value
**When** the NestJS API creates the Order
**Then** the API rejects the request or uses the catalog price and returns field-level errors without creating an invalid payable Order.

**Given** checkout creation is submitted twice due to a retry
**When** the server receives the requests with the same idempotency key
**Then** it returns one local Order and does not create duplicate fulfillment work.

### Story 2.3: Verify PayPal payment server-side

As a customer,
I want the site to confirm my PayPal payment accurately,
So that I know the purchase is paid and will be delivered.

**Acceptance Criteria:**

**Given** a local Order exists
**When** PayPal approval or a PayPal webhook indicates a payment event
**Then** NestJS verifies the provider event/capture, merchant, Order reference, amount, and USD currency before marking the Order paid
**And** browser redirect success alone cannot mark the Order paid.

**Given** the payment is pending, cancelled, failed, mismatched, forged, or repeated
**When** the event is processed
**Then** the appropriate non-paid or pending state is retained, no Delivery email is created for unpaid states, and repeated events are idempotent.

**Given** a verified paid Order is stored
**When** the payment transaction commits
**Then** an outbox fulfillment job is created atomically and the customer can see an Order reference without being asked to pay again.

### Story 2.4: Send the paid book Download link

As a paid customer,
I want to receive the book's Download link by email,
So that I can obtain the PDF without creating a website account.

**Acceptance Criteria:**

**Given** the Order is verified paid and has a saved Download link
**When** the fulfillment worker claims the outbox job
**Then** it sends an English Delivery email naming the Book and Order and containing the saved link
**And** it does not attach the PDF or expose the link in public catalog responses.

**Given** the email provider accepts, rejects, times out, or returns an unknown outcome
**When** the worker records the result
**Then** the Email attempt records the outcome and timestamp separately from payment state, and paid fulfillment remains recoverable.

**Given** the application and provider are available
**When** payment is verified
**Then** the first Email attempt begins within 60 seconds and a paid Order without provider-accepted email is visible for recovery within five minutes.

### Story 2.5: Show truthful payment and delivery status

As a customer,
I want to understand whether payment and email delivery succeeded,
So that I do not pay twice or assume an email arrived when it did not.

**Acceptance Criteria:**

**Given** a customer returns from PayPal or opens the Order status surface
**When** the backend state is pending, paid, cancelled, failed, delivery pending, accepted, failed, or unknown
**Then** the status page shows the corresponding plain-language state and Order reference
**And** refreshing or revisiting the page does not mutate payment or create a new Email attempt.

**Given** payment succeeded but email delivery failed or is unknown
**When** the customer views status
**Then** the page says payment succeeded, explains that delivery needs attention, and gives the configured support instruction without requesting another payment.

## Epic 3: Operate the store safely

### Story 3.1: Authenticate the owner admin

As the owner,
I want a protected admin sign-in,
So that customer, order, and content management data is private.

**Acceptance Criteria:**

**Given** an unauthenticated request targets an admin page or API
**When** the request is received
**Then** the page routes to sign-in or the API returns an authorization error without revealing protected data.

**Given** the owner submits valid credentials
**When** authentication succeeds over HTTPS
**Then** the server creates an authenticated session using a Secure, HttpOnly, SameSite `__Host-` cookie and the owner can access admin surfaces.

**Given** an admin mutation arrives without valid session and CSRF/Origin checks
**When** NestJS evaluates the request
**Then** it rejects the mutation; logout invalidates the server-held session.

### Story 3.2: Manage Books and prices

As the owner,
I want to add and manage Books, prices, and Download links,
So that I can control what customers can buy.

**Acceptance Criteria:**

**Given** the owner is authenticated
**When** they create or edit a Book with title, description, positive USD price, HTTPS Download link, and active state
**Then** the Book is saved and validation errors identify invalid fields.

**Given** the owner deactivates a Book or edits its current price/link
**When** a visitor browses or an existing Order is opened
**Then** new checkout uses the active catalog state while historical Order snapshots remain unchanged.

**Given** a Book is missing a valid price or Download link
**When** the owner tries to activate it
**Then** activation is rejected with an actionable validation message.

### Story 3.3: Inspect Order history

As the owner,
I want to view and search Orders,
So that I can reconcile sales and answer customer questions.

**Acceptance Criteria:**

**Given** the owner opens admin Orders
**When** the page loads
**Then** it shows reference, time, Book snapshot, amount/currency, checkout email, phone, payment state, PayPal reference, and related Email attempts.

**Given** the owner enters an Order reference or email or selects a payment-state filter
**When** the search is submitted
**Then** only matching private Orders are returned with pagination where needed.

**Given** a public request attempts to access Order history
**When** the API receives it
**Then** it returns no customer or payment data.

### Story 3.4: Inspect email history and resend a paid Order

As the owner,
I want to inspect Email attempts and resend a paid delivery,
So that I can recover from a failed or uncertain email.

**Acceptance Criteria:**

**Given** the owner opens Email history
**When** attempts are listed
**Then** each row shows Order reference, recipient, timestamp, provider reference when available, outcome, and actionable failure information.

**Given** a paid Order has a failed or unknown Email attempt
**When** the owner confirms Resend
**Then** the system creates a new explicit Email attempt and uses the saved Order Download link by default.

**Given** the owner replaces a broken Download link before resend
**When** they confirm the replacement and resend
**Then** the new attempt uses the replacement, preserves the prior Order link/history, and records who changed it and when.

**Given** an unpaid Order is selected
**When** the owner requests resend
**Then** the action is rejected and no Email attempt is created.

### Story 3.5: Recover fulfillment work after interruption

As the owner,
I want paid Orders with unfinished fulfillment to remain visible and recoverable,
So that an application or email outage does not lose a sale.

**Acceptance Criteria:**

**Given** the application restarts with an unclaimed or leased outbox job
**When** the worker resumes
**Then** eligible work is reclaimed safely without two workers processing the same lease simultaneously.

**Given** a provider outcome is unknown
**When** recovery inspects the job
**Then** it keeps the outcome unknown, records correlation data, and does not automatically create unbounded retries or duplicate fulfillment.

**Given** the owner opens a paid Order with unfinished work
**When** the admin detail loads
**Then** the Order and Email attempt state are visible within the defined five-minute recovery target.

## Epic 4: Manage the brand and content

### Story 4.1: Edit and publish personal information

As the owner,
I want to edit and publish my personal information,
So that `/info` stays current without code changes.

**Acceptance Criteria:**

**Given** the owner is authenticated
**When** they edit display name, short introduction, biography, or social links and publish
**Then** the public `/info` page shows the new published values.

**Given** the owner saves invalid or incomplete social-link data
**When** validation runs
**Then** the affected field is identified and the previous published content remains unchanged.

### Story 4.2: Author and publish blog posts

As the owner,
I want to create, edit, publish, and unpublish posts,
So that I can maintain the blog from admin.

**Acceptance Criteria:**

**Given** the owner creates a post with title, unique slug, and body
**When** they save it as a draft
**Then** the post is editable in admin and absent from public routes.

**Given** a valid draft is published
**When** a visitor opens `/blog`
**Then** the post appears and `/blog/{slug}` renders its title and body.

**Given** a published post is unpublished or its slug conflicts
**When** the owner submits the change
**Then** publication is removed or rejected with an actionable error, and no unintended draft content becomes public.

### Story 4.3: Manage affiliate links

As the owner,
I want to add, reorder, activate, and deactivate Affiliate links,
So that `/tiktok` reflects my current recommendations.

**Acceptance Criteria:**

**Given** the owner enters a title, valid HTTPS destination, and optional description
**When** they save and activate the link
**Then** it appears in the configured order on `/tiktok`.

**Given** a destination is invalid, non-HTTPS, or the link is inactive
**When** public affiliate data is requested
**Then** it is rejected or omitted and cannot be used as an active public link.

**Given** the owner changes order or deactivates a link
**When** a visitor reloads `/tiktok`
**Then** the public list reflects the current active order without exposing admin-only metadata.

### Story 4.4: Keep English content ready for future localization

As the owner,
I want public/admin labels and delivery email copy to be centralized,
So that additional languages can be added later without rewriting feature logic.

**Acceptance Criteria:**

**Given** a visitor, customer, or owner sees system-generated labels and messages
**When** the current English locale is loaded
**Then** the text comes from the localization/content layer and matches the UX tone.

**Given** a future locale is added
**When** locale resources are extended
**Then** the existing routes and payment/order state logic can use the new text without changing domain rules.

**Given** a Book's PDF has its own language
**When** it is sold
**Then** the system does not claim that the PDF language is translated by the website.

## Coverage Notes

- FR1–FR3 are covered by Stories 1.2–1.4; UX-DR1–UX-DR3 and UX-DR8–UX-DR10 are covered across Epic 1.
- FR4–FR7 are covered by Stories 2.1–2.5; NFR1, NFR3, NFR6, and NFR7 are covered by Stories 2.2–2.5.
- FR8–FR11 are covered by Stories 3.1–3.5; NFR2, NFR3, NFR5, and UX-DR7 are covered by Epic 3.
- FR12–FR15 are covered by Stories 4.1–4.4.
- All stories use the shared Next.js/NestJS contract, PostgreSQL state, PayPal/email adapters, and design tokens from the architecture and UX spines.

## Requirement Traceability

| Story | Requirements |
|---|---|
| 1.1 | UX-DR1, UX-DR2, UX-DR8, UX-DR9 |
| 1.2 | FR1, UX-DR2, UX-DR6 |
| 1.3 | FR2, UX-DR2, UX-DR6, UX-DR10 |
| 1.4 | FR3, UX-DR2, UX-DR6 |
| 1.5 | NFR4, NFR5, UX-DR8, UX-DR9 |
| 2.1 | FR4, UX-DR1, UX-DR2, UX-DR6 |
| 2.2 | FR5, UX-DR4, NFR1, NFR4 |
| 2.3 | FR6, NFR1, NFR3, UX-DR4, UX-DR5 |
| 2.4 | FR7, NFR3, NFR6, NFR7, UX-DR5 |
| 2.5 | FR6, FR7, UX-DR5, UX-DR6 |
| 3.1 | FR8, NFR2, NFR5, UX-DR3, UX-DR8 |
| 3.2 | FR9, NFR2, NFR5, UX-DR3, UX-DR7 |
| 3.3 | FR10, NFR2, NFR3, UX-DR3, UX-DR7 |
| 3.4 | FR11, NFR2, NFR3, UX-DR3, UX-DR5, UX-DR7 |
| 3.5 | FR10, FR11, NFR3, NFR7, UX-DR5, UX-DR7 |
| 4.1 | FR12, NFR2, NFR5, UX-DR3, UX-DR6 |
| 4.2 | FR13, NFR2, NFR5, UX-DR3, UX-DR6, UX-DR10 |
| 4.3 | FR14, NFR2, NFR5, UX-DR3, UX-DR6 |
| 4.4 | FR15, UX-DR10 |
