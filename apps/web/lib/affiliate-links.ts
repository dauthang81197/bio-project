/**
 * Typed, swappable server-side source for public affiliate-link reads.
 *
 * The live collection stays empty until the owner supplies real links. The
 * complete record type is separate from the public DTO so state and URL
 * validation happen before any record is projected for rendering.
 */

export type AffiliateLinkRecord = {
  title: string;
  destination: string;
  description?: string;
  state: 'active' | 'inactive';
  adminNotes?: string;
  customerId?: string;
  checkoutToken?: string;
  paidDownloadUrl?: string;
};

export type PublicAffiliateLink = {
  title: string;
  destination: string;
  description?: string;
};

const LIVE_AFFILIATE_LINKS: readonly AffiliateLinkRecord[] = [];

function hasSafeDestination(destination: string): boolean {
  if (destination !== destination.trim()) {
    return false;
  }

  try {
    const url = new URL(destination);

    return (
      url.protocol === 'https:' &&
      url.username === '' &&
      url.password === ''
    );
  } catch {
    return false;
  }
}

function isPubliclyVisible(link: AffiliateLinkRecord): boolean {
  return (
    link.state === 'active' &&
    link.title.trim().length > 0 &&
    hasSafeDestination(link.destination)
  );
}

function toPublicAffiliateLink(
  link: AffiliateLinkRecord,
): PublicAffiliateLink {
  const description = link.description?.trim();

  return {
    title: link.title.trim(),
    destination: link.destination,
    ...(description ? { description } : {}),
  };
}

export function listActiveAffiliateLinks(
  source: readonly AffiliateLinkRecord[] = LIVE_AFFILIATE_LINKS,
): PublicAffiliateLink[] {
  return source.filter(isPubliclyVisible).map(toPublicAffiliateLink);
}
