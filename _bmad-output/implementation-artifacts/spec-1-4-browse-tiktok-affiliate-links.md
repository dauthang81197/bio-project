---
title: 'Browse TikTok affiliate links'
type: 'feature'
created: '2026-09-16'
status: 'done'
route: 'dispatch'
review_loop_iteration: 0
baseline_commit: '6c56bd5118846a9d02af7585f9b37780f515d834'
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-1-context.md'
  - '{project-root}/_bmad-output/implementation-artifacts/spec-1-3-read-published-blog-posts.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** `/tiktok` is still a placeholder, so visitors cannot browse the owner's affiliate recommendations. The public page must expose only active links with safe, valid destinations and must never attach customer or checkout data to outbound URLs.

**Approach:** Introduce one typed, swappable server-side affiliate source and a pure presentation component. Because no owner-supplied affiliate content exists, keep the live source empty and exercise active/inactive/invalid records with clearly fake test fixtures; defensively filter records before projecting them into public DTOs.

## Boundaries & Constraints

**Always:** A visible record has a nonblank title, an active state, and a parseable absolute `https:` destination without embedded credentials. Preserve source order and the configured destination exactly, including benign owner-supplied query parameters. Public output may contain only title, destination, and an optional nonblank description. External actions open in a new tab with `noopener noreferrer`, visible `↗`, screen-reader new-tab text, visible focus, and a minimum 44px target. Reuse the shared shell, design tokens, card/list patterns, responsive gutters, metadata naming, and English replaceable interface copy.

**Never:** Do not invent real products or destinations; append tracking/customer/checkout parameters; expose inactive, invalid, admin, private, paid-download, or customer fields; render raw HTML; import TikTok content; or add redirects, analytics, checkout/payment behavior, NestJS/PostgreSQL, admin management, asynchronous loading, or Story 1.5 state infrastructure.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Mixed records | Active-valid, inactive, malformed, non-HTTPS, credentialed, or blank-title records | Only active valid records appear, in source order, as narrow public DTOs | Invalid/private records are omitted before rendering |
| Empty live source | No valid active records | `/tiktok` renders a truthful empty state inside the shared shell | No blank page, invented content, or raw error |
| Optional description | Valid records with and without description | Description renders only when nonblank | No empty description element |
| External activation | Valid destination with configured query parameters | Anchor uses the exact destination and external-link treatment | No customer/checkout/tracking data is added |
| Unsafe-looking copy | Title or description contains markup/script characters | Copy renders as escaped text | Never use raw-HTML rendering |

</frozen-after-approval>

## Code Map

- `apps/web/lib/affiliate-links.ts` -- add private complete-record shape, empty live collection, narrow public DTO, URL/title validation, and active-valid projection query.
- `apps/web/components/affiliate-links-content.tsx` -- add pure semantic list/empty-state rendering; reuse Story 1.2 external-link treatment and Story 1.3 card/list layout.
- `apps/web/app/tiktok/page.tsx` -- replace the placeholder and wire the live public query into the component while preserving metadata/container conventions.
- `apps/web/tests/unit/affiliate-links.test.tsx` -- cover every matrix row with mixed fake fixtures and `renderToStaticMarkup`; include the React JSX-source pragma.
- `apps/web/tests/e2e/tiktok.spec.ts` -- cover the live empty route, shell/title/current navigation, and 320px overflow.
- `apps/web/tests/e2e/site-shell.spec.ts` -- replace the stale `/tiktok` placeholder assertion with the new empty-state copy; leave other shell regressions unchanged.

## Tasks & Acceptance

**Execution:**
- [x] `apps/web/lib/affiliate-links.ts` -- implement the typed public boundary -- inactive/invalid/private data is removed before projection.
- [x] `apps/web/components/affiliate-links-content.tsx` -- implement semantic empty/list branches and accessible external actions -- matrix behavior is DOM-testable.
- [x] `apps/web/app/tiktok/page.tsx` -- wire the live source into the existing public route -- complete the visitor surface without backend scope.
- [x] `apps/web/tests/unit/affiliate-links.test.tsx`, `apps/web/tests/e2e/tiktok.spec.ts`, `apps/web/tests/e2e/site-shell.spec.ts` -- automate every matrix row and replace the prior placeholder regression.

**Acceptance Criteria:**
- Given a visitor uses `/tiktok` at 320px or desktop width with keyboard or pointer input, when the empty state or affiliate list renders, then it remains readable, semantic, focus-visible, and inside the established public shell.
- Given public affiliate output and rendered anchors are inspected, when mixed records are queried, then only active valid public fields appear and configured URLs contain no added checkout/customer/tracking data.

## Implementation Notes

- Added an empty live affiliate source plus test-injected mixed records. The public query rejects inactive, blank-title, malformed, non-HTTPS, credentialed, and whitespace-padded destinations before projecting only title, destination, and an optional nonblank description.
- Added semantic empty/list rendering with escaped React text, exact configured destinations, visible external indicators, screen-reader new-tab copy, `noopener noreferrer`, visible focus treatment, and 44px minimum targets.
- Wired `/tiktok` to the live query and retained the shared metadata/container conventions. Updated the stale site-shell assertion and added direct route coverage for the live empty state, current navigation, and 320px overflow.
- Matrix Test Audit: satisfied. Mixed records, empty live source, optional descriptions, exact external activation, and unsafe-looking copy all ran in the final Playwright suite and passed.
- Verification result: lint passed; Webpack production build compiled, type-checked, and generated all routes; full Playwright suite passed 46/46. The default Turbopack build cannot bind its internal port in this execution environment, so production compile and browser evidence used Next.js's supported `--webpack` backend and a prebuilt local server.
- Review patches were applied for trimmed copy, 44px link width, long-token wrapping, and duplicate-key stability. Final verification: lint passed; Webpack production build passed; Playwright passed 47/47. No new deferred work was added.

## Spec Change Log

## Review Triage Log

- **medium / patch (blind 1)** — `min-h-11` guarantees 44px height but a one-character valid title can produce a link narrower than 44px. Add a 44px minimum width without changing the public surface.
- **medium / patch (blind 2)** — Owner-supplied title/description may be one long unbroken token and overflow a 320px card. Add wrapping utilities to the rendered copy/action.
- **false (blind 3)** — Exporting the complete input type for typed test injection does not expose records in public output; only projected DTOs reach the renderer, and there is no client value import of the source.
- **low / patch (blind 4)** — Validation trims copy only to test nonblank values, then projects the original strings. Normalize title and nonblank description during projection while preserving destination exactly as required.
- **low / patch (blind 5)** — Two otherwise valid duplicate recommendations produce the same React key. Include the deterministic source index in the presentation key, matching the established personal-info pattern.
- **low / reject (blind 6)** — The live route is intentionally empty by approved intent; source filtering and populated rendering are directly tested, while route composition is production-compiled. A populated browser route requires prohibited test-only live data or a new injection surface.
- **false (blind 7)** — The external-activation contract is the exact configured `href` plus native-anchor `target`, `rel`, visible indicator, and screen-reader text; all are asserted. Clicking an external network destination would not add evidence about code-owned behavior.
- **low / reject (blind 8)** — The live 320px state is browser-tested and populated rendering is covered statically. Review's real long-token risk is patched directly; a populated browser state would require test-only runtime data.
- **low / reject (blind 9)** — Native-anchor semantics plus explicit focus/target classes are tested and global shell browser tests already prove keyboard focus behavior. A dedicated populated browser seam would add more complexity than this residual integration risk warrants.
- **false (blind 10)** — `in-review` is the current transient workflow state; sprint status moves to `review` only after this review completes.
- **low / reject (blind 11)** — Verification notes already record the actual Webpack fallback and outcome. Editing the build's own approved verification section is not a code fix, and the default command remains the repository's intended non-sandbox command.
- **false (blind 12)** — Root `package-lock.json` predates Story 1.4, remains untracked, and is already recorded in the deferred ledger; it is not part of this story's implementation.
- **false (blind 13)** — `_bmad/` predates Story 1.4, remains untracked, and was explicitly restored as local runtime in the previous workflow; it will not be staged with this story.
- **false (blind 14)** — `_bmad/config.user.toml` is likewise untracked restored runtime state, not a Story 1.4 version-control addition.
- **low / patch (edge 1)** — Duplicate title/destination pairs yield duplicate keys; verified at the map call. Add the map index to the key without changing visible output.
- **low / reject (verification-gap 1)** — Browser tests cannot reach an active link because approved live data must remain empty. Static rendering asserts the native link and focus/size classes; after the 44px width patch, a browser-only fixture seam would cost more than the remaining risk.

## Verification

**Commands:**
- `pnpm --filter web lint` -- expected: no lint errors.
- `pnpm --filter web build` -- expected: production build succeeds and routes compile without type errors.
- `pnpm --filter web exec playwright test` -- expected: every matrix case and all Story 1.1–1.3 regressions pass.
