/** @jsxImportSource react */
// The pragma above pins this file's JSX to React's runtime. Without it,
// Playwright's test loader (which also transforms this file when the unit
// test imports it) rewrites JSX to its own component-testing jsx-runtime,
// producing objects `react-dom/server` can't render. Harmless for the
// Next.js build, which already defaults to the same source.
import type { PersonalInfo } from '@/lib/personal-info';

type PersonalInfoContentProps = {
  /** Published personal info, or `null` when nothing has been published. */
  info: PersonalInfo | null;
};

/**
 * Pure presentational component for `/info`. Branches on `info`: renders
 * the published owner content, or a content-unavailable state when nothing
 * has been published. Never renders admin controls, draft fields, or
 * customer data -- this is a public, read-only surface.
 */
export function PersonalInfoContent({ info }: PersonalInfoContentProps) {
  // Guard against a non-null-but-incomplete record (e.g. a future edit to
  // PUBLISHED_PERSONAL_INFO that forgets a field): only treat `info` as
  // published when the required fields are actually non-empty, otherwise
  // fall back to the unavailable branch rather than rendering a blank page.
  const isPublished =
    !!info &&
    info.displayName.trim() !== '' &&
    info.introduction.trim() !== '' &&
    info.biography.trim() !== '';

  if (!isPublished) {
    return (
      <div data-testid="info-unavailable">
        <h1 className="text-heading">Info</h1>
        <p className="mt-4 max-w-prose text-muted-ink">
          This page has not been published yet. Check back soon.
        </p>
      </div>
    );
  }

  return (
    <div data-testid="info-published">
      <h1 className="text-heading">{info.displayName}</h1>
      <p className="mt-4 max-w-prose text-body">{info.introduction}</p>
      <p className="mt-4 max-w-prose text-body">{info.biography}</p>

      {info.socialLinks.length > 0 && (
        <nav aria-label="Social links" data-testid="info-social-links" className="mt-6">
          <ul className="flex flex-wrap gap-4">
            {info.socialLinks.map((link, index) => (
              <li key={`${link.href}-${index}`}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid={`info-social-link-${index}`}
                  className="text-action-blue underline hover:no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-blue"
                >
                  {link.label}
                  <span aria-hidden="true"> ↗</span>
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
