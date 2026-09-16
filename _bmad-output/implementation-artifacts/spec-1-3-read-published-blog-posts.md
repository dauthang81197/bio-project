---
title: 'Read published blog posts'
type: 'feature'
created: '2026-09-16'
status: 'done'
route: 'dispatch'
review_loop_iteration: 0
baseline_commit: 'af26a3bbe272228c9180d3a008b70b166e20df2d'
context:
  - '{project-root}/_bmad-output/specs/spec-read-published-blog-posts/SPEC.md'
  - '{project-root}/_bmad-output/specs/spec-read-published-blog-posts/brownfield.md'
  - '{project-root}/_bmad-output/implementation-artifacts/epic-1-context.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** `/blog` is still a placeholder, so visitors cannot browse or read the owner's writing. Public routes must expose published posts while making unknown, draft, and unpublished posts indistinguishable through the normal not-found experience.

**Approach:** Introduce one typed, swappable server-side blog source and pure presentation components for the index and post body. Because no owner-authored posts exist, keep the live source empty and exercise published/non-public behavior with clearly fake test fixtures; route public lookup misses through Next.js `notFound()`.

## Boundaries & Constraints

**Always:** Filter publication state before projecting records into public DTOs or rendering them. Public output contains only slug, title, excerpt, and plain-text body paragraphs. Reuse the shared shell, metadata naming, design tokens, `max-w-reading`/narrow prose widths, canonical not-found surface, visible focus behavior, and English replaceable interface copy. Preserve source order deterministically; do not invent date/byline fields that requirements do not request.

**Never:** Do not invent real posts or expose draft title, excerpt, body, publication state, or admin/private fields. Do not render raw HTML or add Markdown/MDX, NestJS, PostgreSQL, admin editing, comments, tags, search, pagination, or localization UI. Do not alter Story 1.1–1.2 behavior or add asynchronous loading/network machinery for a synchronous local source.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Mixed records | Published, draft, and unpublished records | `/blog` exposes only published titles/excerpts/slug links in source order | Non-public fields never reach public DTOs |
| Empty live source | No published records | `/blog` renders a truthful empty state inside the shared shell | No blank page, invented content, or raw error |
| Published slug | Exact published slug | `/blog/{slug}` renders title and every body paragraph as text | N/A |
| Non-public or unknown slug | Draft, unpublished, or absent slug | Canonical not-found response with no post content | All miss reasons call `notFound()` |
| Unsafe-looking body text | Text containing markup/script characters | Characters render as escaped text | Never use raw-HTML rendering |

</frozen-after-approval>

## Code Map

- `apps/web/lib/blog-posts.ts` -- add private complete-record fixtures, empty live collection, public DTO types, and publication-filtered list/lookup queries.
- `apps/web/components/blog-index-content.tsx` -- add a pure semantic list/empty-state renderer; follow the React JSX pragma precedent used by server-rendered Playwright unit tests.
- `apps/web/components/blog-post-content.tsx` -- add a pure readable article renderer that maps body paragraphs to React text nodes.
- `apps/web/app/blog/page.tsx` -- replace the placeholder and wire the live published-list query into the index component while preserving metadata/layout conventions.
- `apps/web/app/blog/[slug]/page.tsx` -- add the server-rendered detail route, await Next.js route params, look up only published posts, and call `notFound()` on every miss.
- `apps/web/app/not-found.tsx` -- reuse unchanged as the canonical miss surface.
- `apps/web/tests/unit/blog-posts.test.tsx` -- cover filtering/projection, index/detail rendering, escaped text, empty state, and non-public lookup misses using `renderToStaticMarkup`.
- `apps/web/tests/e2e/blog.spec.ts` -- cover the live empty index, title/current nav, and canonical 404/no-leak behavior.
- `apps/web/tests/e2e/site-shell.spec.ts` -- replace the stale `/blog` placeholder expectation with the new empty-state expectation.

## Tasks & Acceptance

**Execution:**
- [x] `apps/web/lib/blog-posts.ts` -- implement the typed source and public query boundary -- publication filtering happens before public projection.
- [x] `apps/web/components/blog-index-content.tsx`, `apps/web/components/blog-post-content.tsx` -- implement accessible pure renderers -- all matrix states are DOM-testable without a browser.
- [x] `apps/web/app/blog/page.tsx`, `apps/web/app/blog/[slug]/page.tsx` -- wire index/detail routes and canonical not-found behavior -- complete the visitor flow.
- [x] `apps/web/tests/unit/blog-posts.test.tsx`, `apps/web/tests/e2e/blog.spec.ts`, `apps/web/tests/e2e/site-shell.spec.ts` -- automate every matrix row and update the prior shell regression assertion.

**Acceptance Criteria:**
- Given a visitor navigates the public blog at 320px or desktop width using keyboard or pointer input, when the index or a published post renders, then content remains readable, semantic, focus-visible, and inside the established public shell.
- Given public blog output is inspected, when mixed publication-state fixtures are queried, then no draft/unpublished content, admin controls, customer data, or private/download links are present.

## Implementation Notes

- Added an empty live blog source plus test-injected mixed-state records. Both list and slug queries filter `publicationState` before projecting public fields.
- Added semantic index/detail components. Post paragraphs render as React text nodes; the unsafe-looking fixture proves markup is escaped. Blog links retain the shared visible-focus treatment and 44px minimum target height.
- Added `/blog/[slug]` with awaited Next.js 16 route params, dynamic metadata, and a single `notFound()` path for every lookup miss.
- Added direct unit coverage for all source/rendering matrix rows and browser coverage for the live empty state, metadata/current navigation, 320px overflow, and canonical content-safe 404s. Updated the Story 1.1 route regression from the old placeholder copy.
- Matrix Test Audit: satisfied. Mixed records, empty live source, published slug, non-public/unknown slug, and unsafe-looking body text each ran in the final Playwright suite and passed.
- Verification result: lint passed; Webpack production build compiled, type-checked, and generated all routes; full Playwright suite passed 38/38. The default Turbopack build command cannot bind its internal port in this execution environment, so production compile evidence used Next.js's supported `--webpack` backend.

## Spec Change Log

## Review Triage Log

- **low / defer (blind 1)** — The untracked root `package-lock.json` conflicts with the pnpm-owned lockfile if committed. It predates this story and was explicitly preserved, so it is recorded as deferred repository hygiene rather than changed here.
- **false (blind 2)** — Restored `_bmad/config.user.toml` contains the already-public project/user label `Thang` and communication preferences, not a credential or hidden personal override; it is the exact runtime version recovered from project history at the user's request.
- **low / reject (blind 3)** — The BMAD runtime dominates the baseline diff, but it was a separately requested prerequisite restored verbatim from commit `1997e08`; splitting commits is a VCS-recording concern, not a Story 1.3 implementation defect.
- **false (blind 4)** — `blog-posts.ts` has no client importer: both presentation imports are `import type`, and value imports exist only in App Router server pages/tests. No private record enters a client bundle in the current graph.
- **low / reject (blind 5)** — Duplicate or URL-unsafe slugs could misroute future developer-authored records, but the live collection is empty, all current fixtures are unique URL-safe slugs, and Epic 4 owns the less-trusted authoring input. Runtime guards would add branches for an undemonstrated state.
- **false (blind 6)** — Public projections are newly allocated objects and every body consumer treats `readonly string[]` as immutable; no reachable caller mutates the returned body or backing fixture.
- **low / reject (blind 7)** — Metadata and page rendering each perform a lookup, but the approved source is an in-memory array. A request cache becomes relevant only when a future persistence adapter makes reads costly or stateful.
- **low / reject (blind 8)** — Live E2E draft/unpublished names share the unknown path because live data is intentionally empty, while unit tests inject real draft/unpublished records through the same query used by the route and prove both are filtered.
- **false (blind 9)** — The E2E no-leak marker supplements, rather than replaces, the unit assertions: injected private title/excerpt/body/admin values are absent from projected DTOs, and route misses render only the unchanged canonical not-found surface.
- **low / reject (blind 10)** — Positive published behavior is verified at the source and render boundaries, and the actual route composition type-checks in a production build. A positive live browser route would require violating the approved empty live source or adding test-only runtime state.
- **low / reject (blind 11)** — The direct 320px route test covers the only live state; long published fixture rendering is covered by the responsive token/layout classes and DOM tests. Adding test-only published runtime data would conflict with the empty-live-source constraint.
- **low / reject (blind 12)** — Focus styling is asserted on the only new interactive element, a native anchor; existing browser shell tests already prove keyboard traversal and global focus behavior. A dedicated browser focus test would duplicate established behavior.
- **false (blind 13)** — `in-review` is the workflow's current transient spec state; sprint synchronization to `review` occurs when review completes, so `in-progress` during the review pass is not stale tracking.
- **false (blind 14)** — The notes say every matrix row ran in the full Playwright suite, not that every row is browser E2E. Published and unsafe-body rows ran as unit tests; live empty/not-found rows ran in a browser.
- **low / reject (edge 1)** — Invalid slug delimiters are not reachable from the empty live source or current typed fixtures. Validation belongs at Epic 4's authoring/publication boundary, where invalid external input first exists.
- **low / reject (edge 2)** — Duplicate published slugs are absent from all current sources. A runtime uniqueness guard now would protect only hypothetical future manually edited data and is better enforced by Epic 4 persistence/publication constraints.
- **low / reject (edge 3)** — Route-level draft/unpublished E2E names collapse to unknown as claimed, but query tests inject actual non-public records and the route imports only that tested public lookup. The residual wiring gap is negligible.
- **low / reject (verification-gap 1)** — Replacing the index route query with `[]` would evade tests, but the route is a one-line composition whose query and component are independently verified and production-compiled. Closing the gap requires test-only data injection or route mocking that adds more complexity than this low-risk wiring warrants.
- **low / reject (verification-gap 2)** — An always-404 detail route would evade positive tests, but lookup, published rendering, route parameter types, and production route compilation are separately verified. A positive route test cannot use the contractually empty live source without adding a test-only seam, so the low-probability gap is rejected.

## Verification

**Commands:**
- `pnpm --filter web lint` -- expected: no lint errors.
- `pnpm --filter web build` -- expected: production build succeeds and routes compile without type errors.
- `pnpm --filter web exec playwright test` -- expected: every new matrix case and all Story 1.1–1.2 regressions pass.
