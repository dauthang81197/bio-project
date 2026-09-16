import type { Metadata } from 'next';
import { AffiliateLinksContent } from '@/components/affiliate-links-content';
import { listActiveAffiliateLinks } from '@/lib/affiliate-links';
import { siteConfig } from '@/lib/site-config';

export const metadata: Metadata = {
  title: `${siteConfig.brandName} -- TikTok`,
};

export default function TikTokPage() {
  return (
    <div className="mx-auto max-w-reading px-gutter-mobile py-12 md:px-gutter-desktop">
      <AffiliateLinksContent links={listActiveAffiliateLinks()} />
    </div>
  );
}
