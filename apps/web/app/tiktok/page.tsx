import type { Metadata } from 'next';
import { siteConfig } from '@/lib/site-config';

export const metadata: Metadata = {
  title: `${siteConfig.brandName} -- TikTok`,
};

export default function TikTokPage() {
  return (
    <div className="mx-auto max-w-reading px-gutter-mobile py-12 md:px-gutter-desktop">
      <h1 className="text-heading">TikTok</h1>
      <p className="mt-4 text-muted-ink">Content coming soon.</p>
    </div>
  );
}
