import type { Metadata } from 'next';
import { siteConfig } from '@/lib/site-config';

export const metadata: Metadata = {
  title: `${siteConfig.brandName} -- Info`,
};

export default function InfoPage() {
  return (
    <div className="mx-auto max-w-reading px-gutter-mobile py-12 md:px-gutter-desktop">
      <h1 className="text-heading">Info</h1>
      <p className="mt-4 text-muted-ink">Content coming soon.</p>
    </div>
  );
}
