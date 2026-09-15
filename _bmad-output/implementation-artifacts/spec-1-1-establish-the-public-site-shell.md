---
title: 'Establish the public site shell'
type: 'feature'
created: '2026-09-15'
status: 'done'
route: 'dispatch'
review_loop_iteration: 0
baseline_commit: 'e7967dadb50d82e83d856b07e1a39271faae0fc3'
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-1-context.md'
  - '{project-root}/_bmad-output/planning-artifacts/ux-designs/ux-book-ai-project-2026-09-15/DESIGN.md'
  - '{project-root}/_bmad-output/planning-artifacts/ux-designs/ux-book-ai-project-2026-09-15/EXPERIENCE.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The repository has no application code. Visitors need one consistent, responsive, accessible navigation shell across every public route before page content (info, blog, books, affiliates) can be built.

**Approach:** Bootstrap a pnpm-workspace monorepo with only `apps/web` (Next.js 16 App Router, TypeScript strict, Tailwind CSS) — no backend yet, since this story fetches no data. Build a root layout with a site header (name, nav to `/info` `/blog` `/book` `/tiktok`, primary Books CTA, keyboard-operable mobile menu) and stub pages for `/`, `/info`, `/blog`, `/book`, `/tiktok` so routing/navigation is fully wired. Real content per section arrives in later stories (1.2–1.4, 2.1); stubs show a plain "content coming soon" placeholder.

## Boundaries & Constraints

**Always:** Apply DESIGN.md tokens (colors, type, 8px unit, radii) via Tailwind theme config, never hardcoded hex in components. Header marks the current section with `aria-current="page"`. Mobile menu opens/closes via a labeled button, is keyboard-operable, traps focus while open, `Esc` closes it and returns focus to the trigger. Layout stays usable 320px through desktop with visible focus indicators. Nav labels/order and brand text live in one config module so later stories and real branding can swap them without touching layout code.

**Never:** Do not scaffold `apps/api`, `packages/contracts`, `packages/config`, or `db/migrations` here — add them when a story first needs persisted/admin data. Do not invent real bio or brand copy — PRD defers final branding to the owner pre-launch; use an obviously-placeholder brand string from the one config module. Do not build checkout or payment-status routes. Do not add a UI/headless-menu library — hand-roll the disclosure menu with plain ARIA.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Desktop nav | Viewport >= 1200px | Full inline nav, current route marked `aria-current` | N/A |
| Mobile menu closed | Viewport < 768px, not activated | Labeled menu button visible; links out of tab order | N/A |
| Mobile menu open | Button activated (click/Enter/Space) | Panel opens, `aria-expanded="true"`, focus enters panel | N/A |
| Mobile menu close via Esc | Panel open, `Esc` pressed | Panel closes, focus returns to trigger, `aria-expanded="false"` | N/A |
| Keyboard traversal | Tab from page top | Focus order matches reading order: logo -> nav -> Books CTA -> menu button | N/A |
| Unknown public route | Route outside the five stubs | Next.js not-found renders inside the shared shell (header stays) | N/A |

</frozen-after-approval>

## Code Map

- `pnpm-workspace.yaml`, root `package.json`, `.gitignore` -- new workspace root; repo currently has zero app code
- `apps/web/package.json`, `next.config.ts`, `tsconfig.json`, `postcss.config.mjs` -- Next.js 16 app, TS strict, per architecture Stack table
- `apps/web/app/globals.css` -- Tailwind entry; DESIGN.md tokens as theme values
- `apps/web/lib/site-config.ts` -- single source for brand placeholder string + nav item list (path, label)
- `apps/web/components/site-header.tsx` -- logo/name, desktop nav, Books CTA, `aria-current`
- `apps/web/components/mobile-menu.tsx` -- labeled disclosure button + panel, focus trap, `Esc` close
- `apps/web/app/layout.tsx` -- root layout: renders header, base typography/canvas background, `{children}`
- `apps/web/app/page.tsx` -- home stub: orientation text + links to the four sections
- `apps/web/app/info/page.tsx`, `blog/page.tsx`, `book/page.tsx`, `tiktok/page.tsx` -- "content coming soon" stubs

## Tasks & Acceptance

**Execution:**
- [x] `pnpm-workspace.yaml`, root `package.json`, `.gitignore` -- create workspace root -- monorepo shape from architecture, scoped to this story's needs
- [x] `apps/web/{package.json,next.config.ts,tsconfig.json}` -- scaffold Next.js 16 App Router app -- matches Stack pins
- [x] `apps/web/app/globals.css` + Tailwind theme -- encode DESIGN.md tokens -- single source, no hardcoded hex
- [x] `apps/web/lib/site-config.ts` -- nav items + placeholder brand string -- trivial branding swap pre-launch
- [x] `apps/web/components/site-header.tsx` -- desktop nav + `aria-current` -- AC1
- [x] `apps/web/components/mobile-menu.tsx` -- keyboard-operable disclosure menu -- AC1, AC2
- [x] `apps/web/app/layout.tsx` -- wire header into root layout -- shared shell on every route
- [x] `apps/web/app/{page,info/page,blog/page,book/page,tiktok/page}.tsx` -- stub routes -- nav links resolve, not 404

**Acceptance Criteria:**
- Given a visitor opens any public route, when it renders at 320px, 768px, and 1200px+, then the shared header identifies the current section and links to `/info`, `/blog`, `/book`, `/tiktok`, follows DESIGN.md tokens, and exposes a labeled mobile menu below 768px.
- Given a keyboard or screen-reader user navigates the shell, when focus moves through header and menu, then focus order follows reading order, current section is conveyed via `aria-current`, and the mobile menu opens/closes without a pointer.

## Implementation Notes

- Bootstrapped a pnpm workspace (`pnpm-workspace.yaml`, root `package.json`, `.gitignore`) containing only `apps/web` (Next.js 16.3.5, React 19.3.0, TypeScript 5.9.3 strict, Tailwind CSS 4.3.3), per the architecture Stack table. No `apps/api`, `packages/*`, or `db/*` were added.
- `apps/web/app/globals.css` encodes every DESIGN.md token (colors, Inter type stack, 8px spacing unit via `--spacing`, mobile/desktop gutters, card/button/badge radii, 1120px reading width) as a Tailwind v4 `@theme` block, plus a custom `--breakpoint-desktop: 1200px` used to switch between the inline nav and the mobile disclosure menu. Components reference these as utility classes (`bg-canvas`, `text-ink`, `rounded-button`, `max-w-reading`, ...) -- no hardcoded hex anywhere in `components/` or `app/`.
- `apps/web/lib/site-config.ts` is the single source for the placeholder brand string (`[Your Brand Name]`) and nav items (Info, Blog, TikTok as regular links; Books as a separate primary CTA), plus a shared `isNavItemCurrent()` helper used by both the desktop nav and the mobile panel so `aria-current="page"` logic isn't duplicated.
- `SiteHeader` (client component, needs `usePathname`) renders the logo, the desktop nav (`hidden desktop:flex`, so only visible >=1200px per the I/O matrix's "Desktop nav" row), the Books CTA, and `MobileMenu`.
- `MobileMenu` hand-rolls the disclosure pattern with plain ARIA (no headless-menu library): a labeled toggle button (`aria-expanded`, `aria-controls`) shows/hides a panel via the native `hidden` attribute (which removes its links from the tab order and the accessibility tree when closed, satisfying the "Mobile menu closed" row without extra `tabindex` bookkeeping). While open, a `keydown` listener traps `Tab`/`Shift+Tab` inside the panel's focusable elements and closes on `Escape`, returning focus to the trigger button. A `matchMedia('(min-width: 1200px)')` listener closes the panel if the viewport grows past the desktop breakpoint while it's open, so it can't linger as an off-screen focus trap.
- DOM order in the header is logo -> nav (items + Books CTA) -> mobile menu button, matching the "Keyboard traversal" row; only one of {nav, menu button} is visible/tabbable at a given width because the other is `display:none` via the responsive classes, so at any single breakpoint the reachable order collapses to what that row's per-breakpoint scenarios describe.
- Added `apps/web/app/not-found.tsx` (not explicitly named in the spec's Code Map, but required by the "Unknown public route" I/O matrix row): Next.js renders it inside the root layout automatically, so the shared header stays. Verified with a live request to an unmapped route (see Verification).
- Stub pages (`/info`, `/blog`, `/book`, `/tiktok`) render an `<h1>` plus a plain "Content coming soon." placeholder, with no invented bio/brand copy. `/` renders orientation text and links to all four sections.
- `eslint.config.mjs` imports `eslint-config-next/core-web-vitals` directly (Next 16's native flat-config export) rather than wrapping the legacy string-based config through `@eslint/eslintrc`'s `FlatCompat` -- the latter crashed (`TypeError: Converting circular structure to JSON`) because newer `eslint-plugin-react` flat configs don't survive that legacy bridge. `eslint` is pinned to `9.39.5` (not the just-released `10.x`) because `eslint-config-next@16.3.5`'s plugin peers (`eslint-plugin-import`, `eslint-plugin-react`, `eslint-plugin-jsx-a11y`) only support ESLint `<=9`.

## Review Triage Log

**Pass 1** (blind-hunter, edge-case-hunter, verification-gap; diff staged at baseline `e7967dadb50d82e83d856b07e1a39271faae0fc3`):

1. **medium / patch** — `mobile-menu.tsx` keys CTA styling on a hardcoded `item.href === '/book'` literal instead of `siteConfig.booksCta.href`, even though the module's own docstring and this spec's Boundaries require nav data to live in one config source. Verified at the cited line; `site-header.tsx`'s desktop CTA correctly reads from config, so the two would silently diverge on a route rename. (blind-hunter + verification-gap filed the same root cause independently — merged.)
2. **medium / patch** — Mobile panel nav links compute `current` but never apply it to their className (unlike desktop regular links, which get `aria-[current=page]:font-bold` styling); the desktop Books CTA also has no visual current-state differentiation. Verified by reading both components: only desktop regular links carry the conditional visual class. Sighted mobile users get no visible "you are here" cue, only `aria-current` for assistive tech.
3. **low / patch** — The Playwright suite never `page.goto()`s `/blog` or `/tiktok`; those stub pages are checked only as nav-link targets, never actually rendered end-to-end. Verified via grep: only `/`, `/info`, `/book`, and the 404 route are visited. The story's own task list requires stub routes to "resolve, not 404."
4. **medium / patch** — `MOBILE_VIEWPORT` in the test file is 375px, not the 320px the frozen AC explicitly names as a required width; no test asserts absence of horizontal overflow at any width. Verified via grep (`MOBILE_VIEWPORT = { width: 375, height: 800 }`). 320px is the narrowest, most overflow-prone width the AC calls out and it is not exercised.
5. **low / patch** — `apps/web/package.json` pins `@types/node` to `26.5.1`, ahead of both the root `engines.node >=20.9` floor and the architecture's 24.x LTS target. Verified by reading both package.json files. No current code exercises Node-26-only globals, so live risk is small, but the pin is inconsistent with the stated floor.
6. **low / patch** — No root-level `test` script wires up the new Playwright suite, breaking the `dev`/`build`/`lint` pattern the root `package.json` otherwise establishes. Verified by reading root `package.json`.
7. **low / patch** — The new root `.gitignore` omits `.idea/`/`.vscode/`; `.idea/` is untracked in the repo right now. Verified by reading `.gitignore` and the session's own git status.
8. **low / patch** — Mobile-menu auto-close-on-viewport-resize (the `matchMedia` listener, an implementer-added defensive behavior beyond the matrix) has no test coverage. Verification-gap finding, pre-verified per protocol: grep confirms no test pairs an open panel with a resize.
9. **low / patch** — Mobile-menu close-on-link-selection (`onClick={() => setIsOpen(false)}` on panel links) has no test coverage. Verification-gap finding, pre-verified per protocol: grep confirms no test clicks a panel link and checks the panel closes.
10. **medium / patch** — The resize-auto-close handler (`matchMedia` listener) does not restore focus to the trigger button, unlike the Escape handler, which does. Verified by reading `mobile-menu.tsx`: `handleChange` only calls `setIsOpen(false)`. If a panel link had focus when the viewport grows past 1200px, focus is dropped as the element is hidden — inconsistent with EXPERIENCE.md's accessibility floor ("focus is never removed for visual polish").
11. **maybe-false / defer** — Blind-hunter claims the mobile drawer covering the full 768–1199px band contradicts EXPERIENCE.md's responsive table. On closer reading, EXPERIENCE.md's `768–1199px` row describes the Book grid and admin sidebar specifically, not the public header nav — it is silent on header-nav behavior in that band (only `<768px` explicitly says "header menu becomes a drawer"). `epic-1-context.md`'s restatement generalizes this into a blanket "two-column layout" claim that may itself over-reach the source. Genuinely unsettled by the source docs; would need the human/PRD owner to say whether the header nav should look different anywhere in 768–1199px, or whether one drawer breakpoint at 1200px is acceptable. If true, this would be medium (real UX-fidelity gap, not a functional break) — recording as unverified per the maybe-false rule.
12. **false** — Blind-hunter flagged hardcoded stub/not-found copy ("Content coming soon.", "Page not found", etc.) as violating the localization-readiness requirement ("no hardcoded strings baked into logic"). Refuted: these are plain JSX text nodes with no logic coupling — trivially found and replaced by any future i18n extraction pass, which is exactly what that requirement guards against. They are also explicitly disposable per this spec's own Approach ("real content per section arrives in later stories").
13. **low / defer** — No CI workflow was added. Rejected as this story's problem: the intent (site navigation shell) never implied CI, architecture's own "Deferred" list names CI setup as a separate concern, and it is pre-existing (the repo had none before this change either).
14. **low / rejected** — Edge-case-hunter flagged the absence of click-outside-to-close on the mobile panel. Real but not required by the frozen Boundaries (which specify only a labeled toggle button and Esc as closing mechanisms); the panel remains closable via the visible toggle button, so this is not a block. Rejected per the low-severity rule: unlikely to strand a user (the toggle still works) and the fix (a new outside-click listener) is more than a trivial correction.

## Verification

**Commands:**
- `pnpm --filter web build` -- expected: production build succeeds, no type errors
- `pnpm --filter web lint` -- expected: no lint errors
- `pnpm --filter web exec playwright test` -- expected: full e2e suite passes against a real `next build && next start`, covering every row of the I/O & Edge-Case Matrix

**Manual checks (if no CLI):**
- Resize to 320px/768px/1200px; confirm nav switches per EXPERIENCE.md responsive table with no horizontal scroll.
- Tab through the header at each breakpoint; confirm visible focus rings, correct order, and `Esc` closes an open mobile menu, returning focus to its trigger.

**Matrix Test Audit: satisfied.** Every row of the I/O & Edge-Case Matrix is covered by an automated Playwright test that runs against a production build/start, not dev mode or manual/code-review-only verification:

| Matrix row | Test(s) in `apps/web/tests/e2e/site-shell.spec.ts` |
|---|---|
| Desktop nav (>=1200px) | `Matrix row 1 -- Desktop nav (>=1200px) > shows the full inline nav and marks the current section` |
| Mobile menu closed (<768px, not activated) | `Matrix row 2 -- Mobile menu closed (<768px, not activated) > shows a labeled menu button and keeps its links out of the tab order` |
| Mobile menu open (activated) | `Matrix row 3 -- Mobile menu open (activated)` x3: opens via click, via keyboard Enter, via keyboard Space |
| Mobile menu close via Esc | `Matrix row 4 -- Mobile menu close via Esc` x2: closes + returns focus to trigger; Tab/Shift+Tab stays trapped in the open panel |
| Keyboard traversal (reading order) | `Matrix row 5 -- Keyboard traversal follows reading order` x3: desktop (logo -> nav -> Books CTA), mobile (logo -> menu button), and a tablet (900px) check that the implementation's documented resolution of the matrix's undefined 768-1199px gap (treated as the mobile-menu state, see Implementation Notes) actually holds |
| Unknown public route | `Matrix row 6 -- Unknown public route > renders Next.js not-found inside the shared shell` |

Test infra: `@playwright/test` `1.63.0` added as a devDependency of `apps/web`; `apps/web/playwright.config.ts` drives the suite against `next build && next start -p 4173` via Playwright's `webServer` (Chromium only). `components/site-header.tsx` and `components/mobile-menu.tsx` gained `data-testid` attributes (`site-header`, `brand-link`, `desktop-nav`, `desktop-nav-link-{href}`, `desktop-books-cta`, `mobile-menu`, `mobile-menu-button`, `mobile-menu-panel`, `mobile-nav`, `mobile-nav-link-{href}`) purely to make the header's two nav variants and tab-order assertions unambiguous in tests; no visual or behavioral change.

**Results (this pass):**
- `pnpm --filter web build` -- passed: production build succeeded, no TypeScript errors, all 5 stub routes + `/_not-found` prerendered as static content.
- `pnpm --filter web lint` -- passed: no lint errors/warnings.
- `pnpm --filter web exec playwright test` (clean run, `.next` removed first so `webServer` performs a real fresh `next build && next start`) -- **11 passed, 0 failed** (~10s). Full pass list:
  - Matrix row 1 -- Desktop nav (>=1200px) > shows the full inline nav and marks the current section -- passed
  - Matrix row 2 -- Mobile menu closed (<768px, not activated) > shows a labeled menu button and keeps its links out of the tab order -- passed
  - Matrix row 3 -- Mobile menu open (activated) > opens via click: panel opens, aria-expanded=true, focus enters the panel -- passed
  - Matrix row 3 -- Mobile menu open (activated) > opens via keyboard (Enter on the focused trigger) -- passed
  - Matrix row 3 -- Mobile menu open (activated) > opens via keyboard (Space on the focused trigger) -- passed
  - Matrix row 4 -- Mobile menu close via Esc > closes on Escape and returns focus to the trigger -- passed
  - Matrix row 4 -- Mobile menu close via Esc > traps Tab inside the open panel (Shift+Tab from the first item wraps to the last) -- passed
  - Matrix row 5 -- Keyboard traversal follows reading order > desktop (>=1200px): logo -> nav -> Books CTA -- passed
  - Matrix row 5 -- Keyboard traversal follows reading order > mobile (<768px): logo -> menu button -- passed
  - Matrix row 5 -- Keyboard traversal follows reading order > tablet (768-1199px) does not fall between the two defined states -- passed
  - Matrix row 6 -- Unknown public route > renders Next.js not-found inside the shared shell -- passed
- One implementation-code fix came out of writing these tests: `noUncheckedIndexedAccess` had already forced null-guards on the focus-trap's `first`/`last` elements (see Implementation Notes); no further component-code changes were needed -- the two initial test failures were both test-authoring bugs (`expect(...).not.toMatch()` on a `null` value when focus legitimately moved to untagged page content), fixed in the test file itself, not by loosening any assertion against the matrix's expected behavior.
- Compiled CSS spot-checked: `--color-action-blue:#155eef;`, `.rounded-button{border-radius:var(--radius-button)}`, `.max-w-reading{max-width:var(--container-reading)}`, and the `1200px` custom breakpoint are all present, confirming DESIGN.md tokens flowed through the Tailwind `@theme` block rather than being hardcoded.

**Results (after review-patch pass, independently re-verified):**
- `pnpm --filter web lint` -- passed, clean.
- `pnpm --filter web build` (clean, `.next` removed first) -- passed, no type errors, same 5 stub routes + `/_not-found` prerendered as static content.
- `pnpm --filter web exec playwright test` (clean, `.next` removed first) -- **18 passed, 0 failed** (~11s). Suite grew from 11 to 18 tests: `MOBILE_VIEWPORT` corrected to 320px; added stub-route rendering checks for `/blog` and `/tiktok`; added a no-horizontal-overflow check at 320/900/1280px; added mobile-menu resize-auto-close and close-on-link-selection tests.
