/** @jsxImportSource react */
import type { PublicAffiliateLink } from '@/lib/affiliate-links';

type AffiliateLinksContentProps = {
  links: readonly PublicAffiliateLink[];
};

const copy = {
  heading: 'TikTok',
  empty: 'No affiliate links are available right now. Check back soon.',
  opensInNewTab: 'opens in a new tab',
} as const;

export function AffiliateLinksContent({ links }: AffiliateLinksContentProps) {
  return (
    <div data-testid="affiliate-links-content">
      <h1 className="text-heading">{copy.heading}</h1>
      {links.length === 0 ? (
        <p
          className="mt-4 max-w-prose text-muted-ink"
          data-testid="affiliate-links-empty"
        >
          {copy.empty}
        </p>
      ) : (
        <ul className="mt-8 grid gap-4" data-testid="affiliate-links-list">
          {links.map((link, index) => (
            <li key={`${index}:${link.title}:${link.destination}`}>
              <article className="rounded-card border border-hairline bg-surface p-4 md:p-6">
                <h2 className="break-words text-xl font-bold">{link.title}</h2>
                {link.description ? (
                  <p className="mt-2 max-w-prose break-words text-muted-ink">
                    {link.description}
                  </p>
                ) : null}
                <p className="mt-4">
                  <a
                    href={link.destination}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 min-w-11 max-w-full items-center break-all py-2 font-bold text-action-blue underline hover:no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-blue"
                  >
                    {link.title} <span aria-hidden="true">↗</span>
                    <span className="sr-only"> ({copy.opensInNewTab})</span>
                  </a>
                </p>
              </article>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
