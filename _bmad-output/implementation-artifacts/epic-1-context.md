# Epic 1 Context: Explore ThangHub and personal content

<!-- Compiled from planning artifacts. Edit freely. Regenerate with compile-epic-context if planning docs change. -->

## Goal

Visitors can read the owner's personal information, browse and read published blog posts, and open active TikTok affiliate links, all through a consistent, responsive, accessible public site shell. This epic delivers a complete content-focused public experience that can launch on its own before commerce (Epic 2) is enabled, and it establishes the shared navigation and page-state patterns that later epics build on.

## Stories

- Story 1.1: Establish the public site shell
- Story 1.2: Publish the personal information page
- Story 1.3: Read published blog posts
- Story 1.4: Browse TikTok affiliate links
- Story 1.5: Apply public accessibility and responsive states

## Requirements & Constraints

- `/info` shows only published owner content (display name, introduction, biography, social links); visitors cannot edit it, and draft/unpublished fields are never exposed. When nothing is published, show a content-unavailable state rather than an error.
- `/blog` lists only published posts (title, summary/excerpt, link to slug); `/blog/{slug}` renders title and body. Draft or unpublished posts are never listed or directly reachable — an unknown/draft/unpublished slug returns a normal not-found result with no draft content leaked.
- `/tiktok` lists only active, valid affiliate links (title + external destination). Inactive or invalid links are never shown. Activating a link opens the destination as clearly external and does not pass any checkout/customer data.
- Shared header/navigation links `/info`, `/blog`, `/book`, `/tiktok`, identifies the current section programmatically, and includes a labeled mobile menu operable without a pointer.
- All public pages must remain usable at 320px width up through desktop, keyboard-operable, and support 200% text zoom with visible focus and reduced-motion handling.
- Loading, empty, unavailable, and network-error states must use text plus semantic status (not color alone), preserve page structure, and offer retry/navigation where appropriate.
- Public interface copy is English-first; text must stay replaceable for future localization (no hardcoded strings baked into logic).
- Public responses must never include customer data, admin data, draft content, or paid Download links — this epic is read-only content, but the exposure discipline (public vs. admin DTOs) applies from the start.

## Technical Decisions

- Modular monolith: Next.js renders all public pages and reads data through the API (or an approved server-side client); it never writes to the database. NestJS owns all content storage/mutations, including the personal-info, blog, and affiliate records this epic reads.
- Public DTOs expose only published/active content fields — no admin metadata, no draft state, no private link data — per the architecture's public/admin exposure separation.
- Next.js and NestJS are served behind one HTTPS origin (`/api/*` routed to NestJS); no cross-origin concerns for this epic.
- Shared API contract conventions apply to any data this epic fetches: opaque string IDs, ISO 8601 UTC timestamps, stable error codes with human-safe messages.
- Design tokens (from DESIGN.md): warm canvas background `#F7F5EF`, white surfaces, ink `#18212B` text, muted-ink `#5B6673` for metadata, action-blue `#155EEF` reserved for links/primary actions/focus, hairline `#D8DEE6` for separators. Typography is Inter/system-sans; headings 700 weight, body 400 weight/1.6 line-height. 8px spacing unit, 20px mobile / 32px desktop gutters, 1120px max reading width. Card radius 8px, button/input radius 6px, badge radius pill.
- Quiet editorial minimalism: content and readability come first; avoid decorative motion, gradients, fake scarcity, or dense dashboard treatments on public pages.

## UX & Interaction Patterns

- Public information architecture: `/` (home, orients and links to sections), `/info`, `/blog`, `/blog/{slug}`, `/tiktok`, all reached from the shared header (also linking to `/book`, owned by Epic 2).
- Site header: logo/name at left, links to Info/Blog/Books/TikTok, one primary Books action; mobile nav opens from a labeled menu button.
- Voice and tone: direct, calm, transparent English microcopy; no invented biography, testimonials, or counts — use real owner content only.
- State patterns applicable here: cold load uses a skeleton matching the final surface (no blank page); empty blog/info/affiliate lists explain what's empty and offer the next permitted action; not-found/inactive content (unpublished posts, inactive links) shows a normal not-found surface without leaking draft data; network errors preserve state and offer retry.
- Accessibility floor: WCAG 2.2 AA target; every interactive element has a visible label and keyboard path; focus indicators meet contrast requirements and are never removed for visual polish; touch targets ≥44px; tables/cards have accessible names; reduced-motion preference removes nonessential transitions.
- Responsive behavior: `<768px` single-column with header menu as a drawer; `768–1199px` two-column layout where space permits; `>=1200px` full public grid.
- External affiliate links must visibly indicate they leave the site (clear external-link treatment).
