---
title: 'Apply public accessibility and responsive states'
type: 'feature'
created: '2026-09-17'
status: 'in-review'
route: 'dispatch'
baseline_commit: '64b8668d271c2fb6b7517f9647eba882a450d10d'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-1-context.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Public content pages already render their main content, but loading and unexpected error states have no designed surface. Existing empty and unavailable states lack a navigation action, and some links have small touch targets or can become hard to use at narrow widths and 200% zoom.

**Approach:** Add consistent public page-state surfaces and close observable accessibility and responsive gaps across the existing Epic 1 routes. Verify actual keyboard, zoom, motion, and viewport behavior in a browser.

## Boundaries & Constraints

**Always:** Preserve the shared header, main landmark, page identity, English-first copy, safe public data boundaries, and the existing normal not-found behavior for unknown or unpublished content. Loading presents text and a skeleton resembling the destination content; empty or unavailable states explain the situation and offer a valid navigation action; unexpected rendering or data failures offer retry and a route home. State messages must have suitable semantics without repeatedly interrupting screen-reader users. Controls remain operable at 320px and 200% zoom with visible focus and at least 44px targets. Respect reduced-motion preference.

**Never:** Invent owner content, simulate a failed backend in the live app, add a production test-only fault switch, expose draft or private data, or implement Epic 2 checkout and Epic 4 authoring. Do not replace a not-found response with a generic error or imply that a payment occurred.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Loading | Public route segment is pending | Shared shell remains; labeled status and content-shaped skeleton appear | No blank or flashing error surface |
| Empty or unavailable | No published info, posts, or affiliate links | Existing truthful message and a relevant navigation action remain readable | No invented content or raw error |
| Unexpected failure | Public route throws during rendering or fetching | Shared shell, human-readable error, retry action, and home navigation | Do not expose exception details; retry invokes recovery |
| Unknown or unpublished | Invalid route or non-public blog slug | Existing normal not-found result | No content or metadata leak |
| Constrained use | 320px viewport, 200% zoom, keyboard, reduced motion | No obstructed content or horizontal page overflow; focus and labels visible; controls usable | Nonessential motion removed |

</frozen-after-approval>

## Code Map

- `apps/web/app/layout.tsx`, `components/site-header.tsx`, `components/mobile-menu.tsx`, `app/globals.css` -- shared landmarks, navigation, focus and reduced-motion base; preserve menu behavior and established tokens.
- `apps/web/app/not-found.tsx`, `app/info/page.tsx`, `app/blog/(index)/page.tsx`, `app/blog/[slug]/page.tsx`, `app/tiktok/page.tsx` -- public route conventions; keep 404 behavior intact.
- `apps/web/components/personal-info-content.tsx`, `blog-index-content.tsx`, `affiliate-links-content.tsx` -- existing truthful empty states; add navigation affordances and adjust touch/overflow only where needed.
- `apps/web/components/public-loading.tsx`, route-local `loading.tsx` files, `app/error.tsx` -- Next.js loading and client error boundaries; route-local loading preserves HTTP 404 for unpublished blog slugs.
- `apps/web/tests/e2e/` and `apps/web/tests/unit/` -- existing Playwright patterns; test generated state surfaces and real viewport, keyboard, zoom, and motion behavior.

## Tasks & Acceptance

**Execution:**
- [x] `apps/web/components/public-loading.tsx`, route-local `loading.tsx` files, `apps/web/app/error.tsx` -- implement semantic loading and recoverable unexpected-error surfaces inside the shared layout.
- [x] `apps/web/components/personal-info-content.tsx`, `apps/web/components/blog-index-content.tsx`, `apps/web/components/affiliate-links-content.tsx`, `apps/web/app/not-found.tsx` -- make state guidance actionable and keep controls usable at touch and zoom sizes.
- [x] `apps/web/app/globals.css` and affected public components -- fix measured overflow, focus, contrast, or motion gaps without changing the established visual system; existing CSS focus and reduced-motion rules were retained after browser verification.
- [x] `apps/web/tests/e2e/` and focused unit tests -- cover the matrix, including retry/error rendering without a production fault switch, plus route regressions.

**Acceptance Criteria:**
- Given a visitor encounters loading or an unexpected public route failure, when the state appears, then the shared page structure, meaningful state text, and appropriate next action remain available.
- Given a visitor uses keyboard navigation, 200% text zoom, or reduced motion on an Epic 1 route, when they browse its content and actions, then controls remain reachable, named, visible, and usable without horizontal page overflow or unnecessary motion.

## Implementation Notes

- Added a reusable labeled loading skeleton and scoped its Next.js boundaries to `/info`, `/tiktok`, `/book`, and the blog index. Moved the blog index into a route group so the loading boundary does not stream unknown blog slugs as HTTP 200; browser tests confirm canonical 404 remains intact.
- Added a client error boundary with retry and home actions. Static rendering tests verify safe copy and invoke the retry callback without a production fault switch.
- Added home navigation to truthful empty states and enlarged public link targets. Existing global focus and reduced-motion CSS already met the tested behavior, so no CSS change was needed.
- Matrix Test Audit: loading and error rows passed focused unit tests; empty, not-found, and constrained-use rows passed browser tests. The full Playwright suite passed 54/54.

## Spec Change Log

## Review Triage Log

| Finding | Verdict and evidence | Route |
| --- | --- | --- |
| Blind hunter: CSS `zoom` does not verify text enlargement | medium. The test changed the root element's CSS zoom, while the acceptance criterion calls for 200% text size. Replaced it with root font-size enlargement and checked menu visibility and focus. | patch |
| Blind hunter: reduced-motion check targets an element without a transition | medium. The menu button declares no transition, so the old assertion could pass without testing suppression of a real transition. Added a probe with explicit animation and transition. | patch |
| Blind hunter: route loading and error transitions lack browser integration checks | medium. The tests render components directly and do not exercise a pending navigation or a thrown route render. Route loading imports now have focused unit checks; browser transition and recovery checks remain unverified because Playwright cannot spawn in this environment. | bad_spec |
| Blind hunter: no home or blog slug loading boundary | false. The home route is synchronous, and a slug loading boundary risks streaming an unknown or unpublished slug as HTTP 200, contrary to the frozen 404 requirement. | rejected |
| Blind hunter: `break-all` splits ordinary words | low. The affected headings, paragraphs, and links used `break-all`; replaced it with `break-words` to keep normal words intact and wrap long tokens. | patch |
| Blind hunter: 320px test omits control reachability | medium. It only checked document width; the revised text-size test checks menu visibility, bounds, and focus. | patch |
| Edge case hunter: claimed 200% text zoom not tested | medium. Same root cause as the first finding; the old CSS zoom assertion did not enlarge the root font size. | patch |
| Verification gap: route loading boundaries unverified | medium. The original unit test rendered only the shared default loading component, so removing a route `loading.tsx` would evade it. Added unit checks for all four route loading modules; pending navigation still needs browser verification. | bad_spec |

Review remains open: Playwright exits with `spawn EPERM` even when unit tests run without a web server, and `next build` compiles but exits with `spawn EPERM` during its TypeScript stage. Lint and standalone `tsc --noEmit` pass. Browser transition and recovery behavior therefore remains unverified.

## Verification

**Commands:**
- `pnpm --filter web lint` -- expected: no lint errors.
- `pnpm --filter web build` -- expected: production routes and types compile.
- `pnpm --filter web exec playwright test` -- expected: new state and accessibility checks plus existing regressions pass.
