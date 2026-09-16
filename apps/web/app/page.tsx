import Link from 'next/link';
import type { Metadata } from 'next';
import { siteConfig } from '@/lib/site-config';

export const metadata: Metadata = {
  title: `${siteConfig.brandName} -- Home`,
};

export default function HomePage() {
  return (
    <div className="mx-auto max-w-reading px-gutter-mobile py-12 md:px-gutter-desktop">
      <h1 className="text-heading">{siteConfig.brandName}</h1>
      <p className="mt-4 max-w-prose text-muted-ink">
        Personal information, blog posts, and books all live here. Use the
        links below -- or the header above -- to get to any section.
      </p>

      <ul className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
        <li>
          <Link
            href="/info"
            className="inline-block rounded-card border border-hairline bg-surface px-4 py-3 font-bold text-ink hover:text-action-blue"
          >
            Read the personal info page
          </Link>
        </li>
        <li>
          <Link
            href="/blog"
            className="inline-block rounded-card border border-hairline bg-surface px-4 py-3 font-bold text-ink hover:text-action-blue"
          >
            Browse the blog
          </Link>
        </li>
        <li>
          <Link
            href="/book"
            className="inline-block rounded-card border border-hairline bg-surface px-4 py-3 font-bold text-ink hover:text-action-blue"
          >
            Browse the books
          </Link>
        </li>
        <li>
          <Link
            href="/tiktok"
            className="inline-block rounded-card border border-hairline bg-surface px-4 py-3 font-bold text-ink hover:text-action-blue"
          >
            See TikTok affiliate links
          </Link>
        </li>
      </ul>
    </div>
  );
}
