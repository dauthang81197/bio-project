# Deferred Work

<!-- Append-only. Entries are added by build/review steps when a finding or goal is deferred rather than fixed immediately. Do not modify existing entries or look for duplicates when appending. -->

- source_spec: `_bmad-output/implementation-artifacts/spec-1-1-establish-the-public-site-shell.md`
  summary: Whether the public header nav should look different anywhere in the 768–1199px tablet band, or whether one drawer breakpoint at 1200px (current implementation) is acceptable.
  evidence: EXPERIENCE.md's responsive table only explicitly assigns "header menu becomes a drawer" to `<768px`; its `768–1199px` row describes the Book grid and admin sidebar, not the public header nav, leaving header-nav behavior in that band unsettled by the source docs. `epic-1-context.md`'s compiled restatement generalizes this into a blanket "two-column layout" claim that may itself over-reach EXPERIENCE.md. If the intent is that the header nav should differ from the mobile-drawer treatment somewhere in 768–1199px, this would be a medium-severity UX-fidelity gap in the current implementation (single 1200px breakpoint). Settling it needs a human/PRD-owner decision on the intended tablet-width header behavior.

- source_spec: `_bmad-output/implementation-artifacts/spec-1-1-establish-the-public-site-shell.md`
  summary: No CI workflow runs the project's build/lint/e2e checks automatically on push or PR.
  evidence: This story's intent (public site navigation shell) never implied CI; architecture's own "Deferred" list names CI/hosting/reverse-proxy selection as a separate concern to be made during implementation architecture. The repository had no CI before this change either, so this is a pre-existing gap, not one this story introduced. A dedicated test-framework/CI setup step exists in the broader BMad catalog for when the project is ready to wire it up.

- source_spec: `_bmad-output/implementation-artifacts/spec-1-2-publish-the-personal-information-page.md`
  summary: The Playwright suite's DOM-free unit tests (`tests/unit/`) pay for a full production build + server boot on every run, because `webServer` is global config rather than scoped to only the e2e project.
  evidence: `playwright.config.ts` has one `webServer` (`next build && next start`) and one `chromium` project covering both `tests/e2e/` and `tests/unit/`; `webServer` starts before any test runs regardless of whether that test uses the `page`/`browser` fixtures. Not a correctness issue -- all tests still pass and assert real behavior -- but as the unit suite grows this wastes CI/dev-loop time on unit-only runs. Fixing it means splitting into separate Playwright projects (one requiring `webServer`, one not), which is more than a one-line change; worth doing once the unit suite is large enough to matter.

- source_spec: `_bmad-output/implementation-artifacts/spec-1-2-publish-the-personal-information-page.md`
  summary: `SocialLink.href` is not runtime-validated against its "absolute URL" type comment, so a malformed or unsafe scheme (e.g. `javascript:`) would render as a normal external, `target="_blank"` link.
  evidence: `apps/web/components/personal-info-content.tsx` renders `link.href` directly with no scheme/format check. Not currently exploitable -- the only two call sites (`PUBLISHED_PERSONAL_INFO`, `PLACEHOLDER_PERSONAL_INFO`) are developer-edited static TypeScript literals, not admin- or user-submitted input; that input path doesn't exist until Epic 4's admin-editing stories. Worth adding an `https://` scheme guard (or equivalent) once a real, less-trusted content source is wired in.
