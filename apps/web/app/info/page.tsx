import type { Metadata } from 'next';
import { PersonalInfoContent } from '@/components/personal-info-content';
import { PUBLISHED_PERSONAL_INFO } from '@/lib/personal-info';
import { siteConfig } from '@/lib/site-config';

export const metadata: Metadata = {
  title: `${siteConfig.brandName} -- Info`,
};

export default function InfoPage() {
  return (
    <div className="mx-auto max-w-reading px-gutter-mobile py-12 md:px-gutter-desktop">
      <PersonalInfoContent info={PUBLISHED_PERSONAL_INFO} />
    </div>
  );
}
