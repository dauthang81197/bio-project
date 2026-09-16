# Brownfield Implementation Contract

## Existing seams

- `apps/web/app/blog/page.tsx` already owns `/blog`, supplies page metadata, and currently renders the shared-shell placeholder.
- `apps/web/app/not-found.tsx` is the canonical public not-found surface rendered inside the root layout.
- `apps/web/app/layout.tsx`, `apps/web/components/site-header.tsx`, `apps/web/app/globals.css`, and `apps/web/lib/site-config.ts` provide the established shell, tokens, navigation state, metadata naming, readable widths, focus treatment, and English copy conventions.
- The repository currently contains only `apps/web`; do not scaffold `apps/api`, a database, or a content-management surface for this story.

## Required implementation shape

- Add one typed server-side blog source that separates public queries from its complete fixture records. Public list and slug lookup operations must return only published posts and only public reading fields.
- Keep the live collection empty until the owner supplies real content. Use clearly fake fixtures in tests to exercise published, draft, unpublished, empty, and unknown-slug behavior.
- Add `/blog/[slug]` as a server-rendered route. A lookup miss for any reason calls Next.js `notFound()` so unknown and non-public posts share the canonical response.
- Represent the initial body as plain-text paragraphs and render it as React text nodes. Do not use `dangerouslySetInnerHTML`, add a Markdown/MDX parser, or choose Epic 4's editor/storage format here.
- Render the index as a semantic list of articles with descriptive links. Render the post body within the existing prose-width convention. Preserve 320px usability, 200% text zoom, keyboard access, visible focus, and reduced-motion behavior inherited from the shell.
- Keep interface strings separate from filtering/routing logic so later localization can replace them without changing publication rules.

## Behavioral matrix

| Scenario | Public result | Required evidence |
|---|---|---|
| Published posts exist | `/blog` lists each title, excerpt, and unique-slug link | Component/query test plus route test |
| No published posts exist | `/blog` shows a useful empty state inside the shell | Live-route end-to-end test |
| Published slug requested | Detail route renders title and every body paragraph | Route/component test |
| Unknown slug requested | Canonical not-found page | Route test |
| Draft or unpublished slug requested | Same canonical not-found page, with no private fields/content | Query test and route-level assertion |
| Mixed publication states | Index and public lookup expose published records only | Unit test at the source boundary |

## Verification

- `pnpm --filter web lint`
- `pnpm --filter web build`
- `pnpm --filter web exec playwright test`
- Matrix audit: every behavioral-matrix row maps to at least one automated test, and existing Story 1.1–1.2 checks remain green.
