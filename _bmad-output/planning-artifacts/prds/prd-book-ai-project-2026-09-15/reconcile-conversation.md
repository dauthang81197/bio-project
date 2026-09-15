# Conversation Input Reconciliation

Date: 2026-09-15

Sources: current `prd.md`, `addendum.md`, all 10 entries in `.memlog.md`, and the conversation through the request to proceed now. This check reconciles inputs only; it does not approve assumptions or validate implementation.

## Per-decision disposition

| Log entry | User input and latest disposition | Current coverage | Result |
|---|---|---|---|
| 1 | Personal introduction, blog, ebook sales, PayPal; initial ReactJS/Node.js | Purpose, FR-1/2/4/6, confirmed technology constraints | Preserved; framework refinements from entry 2 take precedence. |
| 2 | Real launch; existing IT-question PDFs; /info, /book, /tiktok; example domain; Next.js/NestJS | Purpose, confirmed decisions, FR-1/3/4, addendum | Preserved. Domain correctly remains unconfirmed. |
| 3 | Guest purchase, email and phone, email fulfillment, dedicated admin | FR-5/7/8 | Preserved. Entries 5 and 10 resolve email-provider ambiguity and fulfillment format. |
| 4 | Initial admin scope: books, prices, orders, email history, personal profile, blog, affiliate links; expand later | FR-9 through FR-14, scope boundaries | Preserved. Specific fields/actions are marked assistant defaults; broader admin expansion is deferred. |
| 5 | Existing PayPal account; any valid email; tentative USD; initially nationwide | Confirmed decisions, FR-5/6, A-5, handoff | Preserved. USD remains a proposed initial setting based on tentative user intent. Merchant readiness is not assumed. Entry 6 overrides nationwide wording. |
| 6 | Worldwide audience | Confirmed decisions, users, FR-5, scope boundaries | Preserved without claiming payment support in every country. |
| 7 | English first; more languages later; email delivery; owner only admin | FR-8/15 | Preserved. English admin/email labels and localization technique remain A-16 defaults. |
| 8 | PDF attachment explicitly accepted | FR-7, addendum | Superseded by entry 10; correctly absent from current delivery requirements. |
| 9 | PDFs approximately 100 MB maximum; attachment feasibility conflict | Confirmed decisions, NFR-6, addendum | File size preserved; attachment blocker resolved by later link delivery. External download performance is not guaranteed. |
| 10 | Google Drive or other download link for initial release; advanced delivery later | FR-7/9, scope boundaries, addendum | Preserved. No exclusive storage vendor, binary upload, automated Drive integration, custom expiry, download counting, or link-sharing protection is imposed. |

## Latest instruction

The request to proceed now authorizes completing a reviewable planning artifact using visible assumptions. It does not itself select hosting, credentials, payment-account configuration, email provider, or authorize a live launch. The PRD's handoff and assumptions index support proceeding to UX/architecture without further requirement discovery in this turn.

## Assistant defaults and deferred scope

A-1 through A-19 are explicitly reversible defaults, not user-confirmed facts. They cover proposed routes, checkout granularity, payment/delivery recovery, admin editing details, authentication, release checks, and unrequested commerce exclusions. The user's explicit Next.js/NestJS, PayPal, guest email/phone checkout, worldwide English launch, core admin scope, and simple emailed link remain separate from these defaults.

One provenance gap remains: FR-7's unconditional requirement to replace a paid Order's saved link and retain change history is represented under A-8 in the assumptions index, but its requirement paragraph itself lacks the assumption marker. Label that paragraph `[ASSUMPTION A-8]` to make its assistant-proposed status unambiguous and preserve the user's limited initial admin commitment.

No user-decision coverage gaps or unresolved override conflicts found. Remaining provider, merchant, operational, content, and design decisions are already recorded in section 9; they are downstream planning/launch prerequisites, not omissions of stated user decisions.
