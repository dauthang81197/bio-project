---
name: book-ai-project
status: final
created: 2026-09-15
updated: 2026-09-15
sources:
  - ../../prds/prd-book-ai-project-2026-09-15/prd.md
---

# Experience spine

## Foundation

Responsive web product built with Next.js. `DESIGN.md` is the visual identity reference. The initial public language is English. The owner is the only administrator; customers do not create accounts. The public site and admin area share the visual system but have different information density.

## Information Architecture

| Surface | Route | Reached from | Purpose |
|---|---|---|---|
| Home | `/` | domain root | Orient visitors and link to main sections |
| Personal information | `/info` | header | Read the owner's profile and social links |
| Blog index | `/blog` | header/home | Browse published posts |
| Blog post | `/blog/{slug}` | blog index | Read one published post |
| Book catalog | `/book` | header/home | Browse active Books and prices |
| Checkout | `/book/{id}/checkout` | Book card | Enter contact details and start PayPal payment |
| Payment result | `/payment/{orderReference}` | PayPal return or direct status lookup | Show payment and delivery status without exposing the link publicly |
| TikTok affiliate page | `/tiktok` | header/home | Browse active Affiliate links |
| Admin login | `/admin/login` | direct navigation | Authenticate the owner |
| Admin dashboard | `/admin` | admin sidebar | Show actionable order/email summaries |
| Admin management | `/admin/books`, `/admin/orders`, `/admin/emails`, `/admin/info`, `/admin/blog`, `/admin/affiliates` | sidebar | Manage each initial capability |

`[ASSUMPTION UX-1]` The routes above implement the PRD's named surfaces and keep the blog conventional. Architecture may preserve route names while changing internal component boundaries.

## Voice and Tone

Microcopy is direct, calm, and transparent. Use “Payment confirmed. We sent your download link to {email}.” Use “Payment is still being confirmed” for pending states. Use “Payment succeeded, but we could not send the email yet. Keep this order reference and contact support.” Do not claim an email reached an inbox when the provider only accepted it.

## Component Patterns

| Component | Behavioral rules |
|---|---|
| Book card | Shows active Book metadata and price; purchase action starts checkout; never exposes Download link |
| Checkout form | Validates email and international phone inline; preserves entered data through PayPal redirect; prevents duplicate submit while request is pending |
| PayPal action | Creates an Order from server-side price; disabled while create/capture request is pending; returns to status surface |
| Payment status | Handles pending, paid, cancelled, failed, delivery pending, email accepted, email failed, and unknown states with text and next action |
| Admin table | Supports keyboard navigation, explicit row actions, empty/loading/error states, and pagination when needed |
| Resend action | Available only for paid Orders; requires confirmation; creates a new Email attempt and shows its outcome |
| Blog editor | Draft/published state is explicit; unpublished posts are absent from public routes |
| External link | Opens the configured Affiliate link with clear external-link text; invalid/inactive links are not public |

## State Patterns

| State | Behavior |
|---|---|
| Cold load | Skeleton that matches the final surface; no blank page |
| Empty catalog/blog/admin list | Explain what is empty and offer the next permitted action |
| Validation error | Keep entered values, identify the field, explain the correction |
| Network error | Preserve form state and offer retry; never imply a payment was cancelled without server evidence |
| Payment pending | Show order reference and “still confirming”; polling or refresh must be idempotent |
| Payment paid, email pending | Show “Payment confirmed; preparing your email” and tell customer not to pay again |
| Email failed/unknown | Show support path and order reference; admin can inspect and resend |
| Admin unauthorized | Return a generic sign-in response without revealing whether an account exists |
| Not found/inactive | Do not expose inactive Books, unpublished posts, or private links; show a normal not-found surface |
| Offline | Disable payment submission and destructive admin mutations; preserve drafts where the browser can do so safely |

## Interaction Primitives

- All state changes use explicit buttons or form submissions; GET requests never mutate state.
- Focus moves to the first invalid field, dialog heading, or status announcement when a state changes.
- `Esc` closes the topmost dialog or drawer; it never abandons unsaved content without warning.
- PayPal return handling is safe to refresh and safe to revisit; backend state is authoritative.
- Admin destructive or irreversible actions require a confirmation dialog with the object name and consequence.
- Long tables use pagination or server-side filtering; no infinite scroll for Orders or email history.

## Accessibility Floor

- Target WCAG 2.2 AA for public and admin web surfaces.
- Every input has a visible label, programmatic error association, and a keyboard path.
- Focus indicators meet contrast requirements from `DESIGN.md`; focus is never removed for visual polish.
- Status changes use an `aria-live` region where appropriate, but do not interrupt typing.
- Touch targets are at least 44px; responsive layouts remain usable at 320px width and 200% text zoom.
- Tables have header associations; card actions have names that identify the Book or Order.
- Reduced-motion preference removes nonessential transitions.

## Responsive & Platform

| Width | Behavior |
|---|---|
| `< 768px` | Single-column public layouts; header menu becomes a drawer; admin tables stack row details and keep primary actions visible |
| `768–1199px` | Two-column Book grid where space permits; admin sidebar may collapse to a labeled drawer |
| `>= 1200px` | Full public grid and persistent admin sidebar; order/email tables may show all planned columns |

Responsive web is the first platform. No native app or offline purchase flow is planned.

## Key Flows

### Flow 1 — Guest purchase and delivery

1. A visitor opens `/book` and selects a Book.
2. The visitor reviews the Book and opens checkout.
3. They enter an email and phone number; the form validates both and shows the USD total.
4. They select PayPal; the server creates the Order using the catalog price and redirects to PayPal.
5. PayPal approval returns the visitor to the Payment result surface; the backend verifies capture independently.
6. **Climax:** the status surface identifies the paid Book and confirms that the Delivery email is being sent or has been accepted by the provider. The customer knows not to pay again.
7. The Delivery email contains the owner-supplied Download link. The customer opens it without a site account.

Failure paths: cancelled/failed payment shows no fulfillment; pending payment remains pending; email failure shows the Order reference and support instruction. A repeated return or webhook does not create a second Email attempt unless the Admin explicitly resends.

### Flow 2 — Owner corrects and resends delivery

1. The Admin signs in at `/admin` and opens Orders or Email history.
2. They filter for paid Orders with failed or unknown Email attempts.
3. They open an Order, review the saved Book and recipient, and optionally replace the Download link with explicit confirmation.
4. They choose Resend; the system creates a new Email attempt and returns its state.
5. **Climax:** the Order shows the new attempt and the admin can distinguish provider acceptance from confirmed inbox delivery.

Failure path: if sending remains unknown, the admin sees the uncertainty and does not create unlimited automatic retries.

### Flow 3 — Owner publishes content

1. The Admin opens Personal info, Blog, or Affiliate links.
2. They edit a record, preview or review the intended public state, and save.
3. Blog posts and Affiliate links require explicit publication/activation; personal information uses an explicit publish action.
4. **Climax:** the public route reflects the published content while drafts, inactive links, and unpublished posts remain hidden.
