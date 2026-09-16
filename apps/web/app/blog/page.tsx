import type { Metadata } from 'next';
import { siteConfig } from '@/lib/site-config';

export const metadata: Metadata = {
  title: `${siteConfig.brandName} -- Blog`,
};

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-reading px-gutter-mobile py-12 md:px-gutter-desktop">
      <h1 className="text-heading">Blog</h1>
      <p className="mt-4 text-muted-ink">Content coming soon.</p>
    </div>
  );
}
