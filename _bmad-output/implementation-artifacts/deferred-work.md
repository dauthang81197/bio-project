# Deferred Work

<!-- Append-only. Entries are added by build/review steps when a finding or goal is deferred rather than fixed immediately. Do not modify existing entries or look for duplicates when appending. -->

- source_spec: `_bmad-output/implementation-artifacts/spec-1-1-establish-the-public-site-shell.md`
  summary: Whether the public header nav should look different anywhere in the 768–1199px tablet band, or whether one drawer breakpoint at 1200px (current implementation) is acceptable.
  evidence: EXPERIENCE.md's responsive table only explicitly assigns "header menu becomes a drawer" to `<768px`; its `768–1199px` row describes the Book grid and admin sidebar, not the public header nav, leaving header-nav behavior in that band unsettled by the source docs. `epic-1-context.md`'s compiled restatement generalizes this into a blanket "two-column layout" claim that may itself over-reach EXPERIENCE.md. If the intent is that the header nav should differ from the mobile-drawer treatment somewhere in 768–1199px, this would be a medium-severity UX-fidelity gap in the current implementation (single 1200px breakpoint). Settling it needs a human/PRD-owner decision on the intended tablet-width header behavior.

- source_spec: `_bmad-output/implementation-artifacts/spec-1-1-establish-the-public-site-shell.md`
  summary: No CI workflow runs the project's build/lint/e2e checks automatically on push or PR.
  evidence: This story's intent (public site navigation shell) never implied CI; architecture's own "Deferred" list names CI/hosting/reverse-proxy selection as a separate concern to be made during implementation architecture. The repository had no CI before this change either, so this is a pre-existing gap, not one this story introduced. A dedicated test-framework/CI setup step exists in the broader BMad catalog for when the project is ready to wire it up.
