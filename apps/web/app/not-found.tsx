import Link from 'next/link';
import type { Metadata } from 'next';
import { siteConfig } from '@/lib/site-config';

export const metadata: Metadata = {
  title: `${siteConfig.brandName} -- Not found`,
};

/**
 * Rendered by Next.js inside the root layout for any unmatched route, so
 * the shared header stays in place.
 */
export default function NotFound() {
  return (
    <div className="mx-auto max-w-reading px-gutter-mobile py-12 md:px-gutter-desktop">
      <h1 className="text-heading">Page not found</h1>
      <p className="mt-4 text-muted-ink">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <p className="mt-4">
        <Link href="/" className="font-bold text-action-blue">
          Go back home
        </Link>
      </p>
    </div>
  );
}
