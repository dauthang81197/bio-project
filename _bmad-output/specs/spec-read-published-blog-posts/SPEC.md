---
id: SPEC-read-published-blog-posts
companions:
  - brownfield.md
  - ../../planning-artifacts/architecture/architecture-book-ai-project-2026-09-15/ARCHITECTURE-SPINE.md
  - ../../planning-artifacts/ux-designs/ux-book-ai-project-2026-09-15/DESIGN.md
  - ../../planning-artifacts/ux-designs/ux-book-ai-project-2026-09-15/EXPERIENCE.md
sources:
  - ../../planning-artifacts/epics.md
  - ../../implementation-artifacts/epic-1-context.md
  - ../../planning-artifacts/prds/prd-book-ai-project-2026-09-15/prd.md
---

> **Canonical contract.** This SPEC and the files in `companions:` are the complete, preservation-validated contract for what to build, test, and validate. Source documents listed in frontmatter are for traceability only.

# Read Published Blog Posts

## Why

Visitors currently reach a placeholder at `/blog`, so they cannot browse or read the owner's writing. Story 1.3 must establish a safe public reading experience while keeping draft and unpublished content private and avoiding invented owner content.

## Capabilities

- **CAP-1**
  - **intent:** A visitor can browse published posts at `/blog` and choose one by its unique slug.
  - **success:** Every visible item shows a title, summary or excerpt, and working post link; draft and unpublished posts are absent.
- **CAP-2**
  - **intent:** A visitor can read a published post at `/blog/{slug}`.
  - **success:** A published slug renders its title and complete body in a readable layout with English interface copy.
- **CAP-3**
  - **intent:** A visitor cannot discover or read non-public posts through public routes.
  - **success:** Unknown, draft, and unpublished slugs all render the normal not-found result without exposing title, excerpt, body, publication state, or admin metadata.
- **CAP-4**
  - **intent:** A visitor can understand when no posts have been published yet.
  - **success:** An empty public blog preserves the shared page structure and displays a useful, truthful empty state rather than invented posts, a blank page, or a raw error.

## Constraints

- Public rendering receives only published-reading fields; draft bodies, admin data, customer data, private links, and paid download links must never enter public output.
- Blog content must not execute unauthorized scripts; raw unsanitized HTML is prohibited.
- Reuse the shared public shell, design tokens, readable-width conventions, normal not-found surface, visible keyboard focus, and responsive behavior defined by the adopted UX companions.
- Public interface copy is English-first and replaceable; owner-authored content must be supplied by the owner rather than invented.
- Until Epic 4 introduces persistence and authoring, all blog reads pass through one typed, swappable server-side source and the live source remains empty.

## Non-goals

- Admin authoring, publishing controls, NestJS/PostgreSQL persistence, editor selection, Markdown/MDX support, comments, tags, search, pagination, localization UI, and real owner-authored posts.

## Success signal

Automated checks demonstrate that published fixtures appear in the index and resolve by slug, while an empty live source shows the intended empty state and unknown/draft/unpublished slugs all produce the same content-safe not-found response. The production build, lint, and complete existing test suite remain green.

## Assumptions

- Plain-text paragraphs are sufficient for Story 1.3; the rich-content storage and editor format will be selected with Epic 4's blog-authoring work.
