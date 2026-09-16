---
title: 'Publish the personal information page'
type: 'feature'
created: '2026-09-15'
status: 'done'
route: 'dispatch'
review_loop_iteration: 0
baseline_commit: 'df0643caf7504145dd2e52b6aaf3bce25a836a7b'
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-1-context.md'
  - '{project-root}/_bmad-output/planning-artifacts/ux-designs/ux-book-ai-project-2026-09-15/DESIGN.md'
  - '{project-root}/_bmad-output/planning-artifacts/ux-designs/ux-book-ai-project-2026-09-15/EXPERIENCE.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** `/info` (from story 1.1) is still a "Content coming soon" stub. FR1 requires it to show the owner's published display name, introduction, biography, and social links, or a proper not-yet-published state when nothing is published.

**Approach:** Add a single typed personal-info content module and a presentational component that branches on published-vs-not-yet-published data. No real owner content exists yet, so wire the live route to the not-yet-published branch honestly; cover the published branch with its own test fixture rather than inventing content for the live page. No backend/database is introduced — the content source stays a static, swappable TypeScript module until an Epic 4 admin-editing story needs persistence, matching story 1.1's precedent.

## Boundaries & Constraints

**Always:** Personal info stays behind one typed source (`apps/web/lib/personal-info.ts`) the page reads, so swapping in a real API later touches one file. Social links get the external-link treatment (`target="_blank"`, `rel="noopener noreferrer"`, a visible external indicator), matching EXPERIENCE.md's external-link pattern. Reuse existing layout conventions (`max-w-reading` outer container, `max-w-prose` body copy) and design tokens — no new tokens or components beyond what this page needs.

**Never:** Do not invent real biography, introduction, or social-link copy — ship the not-yet-published state live; the published branch is exercised only by its own test fixture, never by the live route. Do not scaffold `apps/api` or a database — story 1.1's deferral still holds; nothing here needs persistence yet. Do not build admin editing UI — that is Epic 4 scope.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Published info supplied | `PersonalInfo` object with all fields | Renders display name, introduction, biography, social links; no admin-control or customer-data markup | N/A |
| Not yet published | Content source is `null` | Renders a content-unavailable message; no draft fields rendered | N/A |
| Social link present | `socialLinks` entry with label + URL | Rendered as visibly-external (`target="_blank"`, `rel="noopener noreferrer"`, external indicator) | N/A |
| No social links configured | `socialLinks: []` | Page renders name/intro/bio without a broken or empty social-links section | N/A |

</frozen-after-approval>

## Code Map

- `apps/web/lib/personal-info.ts` -- `PersonalInfo` type; `PUBLISHED_PERSONAL_INFO` (the live source, currently `null`); `PLACEHOLDER_PERSONAL_INFO` fixture used only by tests
- `apps/web/components/personal-info-content.tsx` -- pure presentational component, branches on `info: PersonalInfo | null`
- `apps/web/app/info/page.tsx` -- replaces the story-1.1 stub; wires `PUBLISHED_PERSONAL_INFO` into `PersonalInfoContent`
- `apps/web/playwright.config.ts` -- broaden `testDir` from `./tests/e2e` to `./tests` so a new DOM-free unit dir is also picked up
- `apps/web/tests/unit/personal-info-content.test.tsx` -- new; branch coverage via `react-dom/server`'s `renderToStaticMarkup`, no browser needed
- `apps/web/tests/e2e/personal-info.spec.ts` -- new; browser check of the live (not-yet-published) `/info` route inside the shared shell from story 1.1

## Tasks & Acceptance

**Execution:**
- [x] `apps/web/lib/personal-info.ts` -- define the type, live source, and test fixture -- single content source, real content deferred to the owner
- [x] `apps/web/components/personal-info-content.tsx` -- build both branches -- AC1, AC2
- [x] `apps/web/app/info/page.tsx` -- replace stub with real wiring -- ships the not-yet-published state honestly
- [x] `apps/web/playwright.config.ts` -- `testDir: './tests'` -- picks up the new unit test dir alongside e2e
- [x] `apps/web/tests/unit/personal-info-content.test.tsx` -- assert all four matrix rows via `renderToStaticMarkup` -- no browser required
- [x] `apps/web/tests/e2e/personal-info.spec.ts` -- assert the live `/info` renders the not-yet-published state inside the shared shell

**Acceptance Criteria:**
- Given published personal information exists, when a visitor opens `/info`, then the page displays the published display name, introduction, biography, and configured social links, and no admin editing controls, customer data, or private links are present in the response.
- Given personal information has not yet been published, when a visitor opens `/info`, then the page shows a useful empty/content-unavailable state and does not expose draft fields.

## Implementation Notes

- `apps/web/lib/personal-info.ts` is the single content source: `PersonalInfo`/`SocialLink` types, `PUBLISHED_PERSONAL_INFO` (live source, `null`), and `PLACEHOLDER_PERSONAL_INFO` (obviously-fake fixture used only by tests, never wired into the live route).
- `PersonalInfoContent` is a pure presentational component branching on `info: PersonalInfo | null`. Not-yet-published branch renders a content-unavailable message with no draft fields. Published branch renders name/introduction/biography (`max-w-prose` body copy) plus a social-links `<nav>`, rendered only when `socialLinks` is non-empty. Each social link gets `target="_blank"`, `rel="noopener noreferrer"`, and a visible external indicator (↗ plus `sr-only` "(opens in a new tab)" text, not color alone).
- `apps/web/app/info/page.tsx` replaces the story-1.1 stub: wraps `PersonalInfoContent` with `PUBLISHED_PERSONAL_INFO` inside the existing `max-w-reading`/gutter container, matching other pages' layout convention.
- `apps/web/playwright.config.ts`'s `testDir` broadened from `./tests/e2e` to `./tests` so the new `tests/unit/` directory is picked up by the same suite.
- `apps/web/tests/unit/personal-info-content.test.tsx` covers all 4 I/O matrix rows via `react-dom/server`'s `renderToStaticMarkup` -- no browser needed; confirmed near-instant execution (single-digit/low-double-digit ms per test) versus the e2e tests, indicating no browser context was spun up for them.
- Both `personal-info-content.tsx` and its unit test file needed a `/** @jsxImportSource react */` pragma: without it, Playwright's test loader rewrites `.tsx` JSX to its own component-testing `jsx-runtime` (meant for `@playwright/experimental-ct-react`), which `renderToStaticMarkup` cannot render ("Objects are not valid as a React child"). The pragma is a standard per-file override and is harmless for the Next.js build, which already defaults to React's `jsxImportSource`. Worth remembering for any future `.tsx` file that mixes real React rendering with Playwright's test runner.
- `apps/web/tests/e2e/personal-info.spec.ts` is a browser check that the live (not-yet-published) `/info` route renders inside the shared shell from story 1.1, and that the header marks `/info` current.

## Verification

**Commands:**
- `pnpm --filter web build` -- expected: production build succeeds, no type errors
- `pnpm --filter web lint` -- expected: no lint errors
- `pnpm --filter web exec playwright test` -- expected: full suite (unit + e2e) passes, covering every I/O matrix row

**Manual checks (if no CLI):**
- Open `/info` and confirm it currently shows the not-yet-published state, styled consistently with the rest of the site (not a raw error).

**Matrix Test Audit: satisfied.** Every row of the I/O & Edge-Case Matrix is covered by an automated test:

| Matrix row | Test(s) |
|---|---|
| Published info supplied | `tests/unit/personal-info-content.test.tsx` -- "renders display name, introduction, biography, and social links"; "renders no admin-control or customer-data markup" |
| Not yet published | `tests/unit/personal-info-content.test.tsx` -- "renders a content-unavailable message and no draft fields"; `tests/e2e/personal-info.spec.ts` -- "renders the content-unavailable state inside the shared shell" (live route) |
| Social link present | `tests/unit/personal-info-content.test.tsx` -- "renders as visibly external: target=_blank, rel=noopener noreferrer, external indicator" |
| No social links configured | `tests/unit/personal-info-content.test.tsx` -- "renders name/intro/bio without a broken or empty social-links section" |

**Results (independently re-verified):**
- `pnpm --filter web lint` -- passed, clean.
- `pnpm --filter web build` (clean, `.next` removed first) -- passed, no type errors, `/info` still prerenders as static content.
- `pnpm --filter web exec playwright test` (clean, `.next` removed first) -- **25 passed, 0 failed** (~13s): all pre-existing story-1.1 tests still green, plus 5 new unit tests and 2 new e2e tests for this story.

**Results (after review-patch pass, independently re-verified):**
- `pnpm --filter web lint` -- passed, clean.
- `pnpm --filter web build` (clean, `.next` removed first) -- passed, no type errors, `/info` still prerenders as static content.
- `pnpm --filter web exec playwright test` (clean, `.next` removed first) -- **26 passed, 0 failed** (~17s). Suite grew from 25 to 26: added a "non-null but incomplete record falls back to unavailable" unit test, a `focus-visible` class assertion, and a page-title assertion.

## Review Triage Log

**Pass 1** (blind-hunter, edge-case-hunter, verification-gap; diff staged at baseline `df0643caf7504145dd2e52b6aaf3bce25a836a7b`; verification-gap found no gaps):

1. **low / defer** — Unit tests (`tests/unit/`) pay for a full production build + server boot (`playwright.config.ts`'s single `webServer` + single `chromium` project) even though they need no browser. Verified: `webServer` is global config, not project-scoped, so it always runs first. Real CI/dev-speed cost, not a correctness issue; the fix (splitting projects/webServer scope) is more than a one-line change.
2. **low / patch** — The social link's `focus-visible` styling has no test coverage. Verified the classes exist in the component; native `<a href>` elements are keyboard-reachable regardless, so this is about verifying the visual affordance, not fixing broken keyboard access. Trivial fix: assert the class substring in the existing unit test.
3. **medium / patch** — No guard against a non-null-but-empty/whitespace published record. Verified: `PersonalInfoContent` only checks `if (!info)`, never validates field contents. `personal-info.ts`'s own doc comment tells a future editor this is the one file to change from `null` to a real object — an incomplete edit (e.g. forgetting `biography`) would silently ship a blank-looking "published" page instead of falling back to the unavailable state. (blind-hunter + edge-case-hunter filed the same root cause independently — merged.)
4. **low / patch** — `socialLinks.map` keys on `link.href` with no uniqueness guard. Verified at the cited line. Duplicate hrefs (a plausible future copy-paste mistake) would cause a React key collision. (blind-hunter + edge-case-hunter filed the same root cause independently — merged.)
5. **low / defer** — `SocialLink.href` isn't runtime-validated against its "absolute URL" doc comment (e.g. a `javascript:` scheme would render as a normal external link). Verified no such check exists. Not exploitable today — the only two call sites are developer-edited static TS literals, not admin/user-submitted input (that path doesn't exist until Epic 4). Worth hardening once real input arrives; not blocking now.
6. **false** — Edge-case-hunter claims `info.socialLinks` could be `undefined` at runtime despite the required type, crashing the page (`TypeError` reading `.length`). Refuted: the only two call sites, `PUBLISHED_PERSONAL_INFO` and `PLACEHOLDER_PERSONAL_INFO`, are fully-typed static literals checked by `tsc` in strict mode (build passes clean); no runtime or external data source exists yet that could supply a `PersonalInfo` bypassing that check.
7. **low / patch** — Neither new test asserts the page's `<title>` metadata (`${siteConfig.brandName} -- Info`). Verified via grep: no `toHaveTitle` or similar check exists. A title regression would go uncaught. Trivial fix: one assertion in the e2e test.
8. **low / patch** — Every social link renders with the identical `data-testid="info-social-link"`, precluding per-link targeting in tests or debugging. Verified at the cited line. Low current risk since the component has no per-link conditional logic (all links get identical treatment from the same template), but still a trivial fix: suffix the testid with the link's index.
