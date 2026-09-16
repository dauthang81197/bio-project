/**
 * Single source of truth for the `/info` page's content.
 *
 * The owner has not published personal information yet, so
 * `PUBLISHED_PERSONAL_INFO` -- the value the live route reads -- is `null`
 * and `/info` renders its not-yet-published state honestly. When the owner
 * supplies real content, replace the `null` below with a `PersonalInfo`
 * object; nothing else needs to change. A later Epic 4 admin-editing story
 * may replace this static module with a real data source, but the shape
 * (`PersonalInfo`) should stay stable for callers.
 */

export type SocialLink = {
  /** Visible label for the link, e.g. "GitHub" or "X (Twitter)". */
  label: string;
  /** Absolute external URL the link points to. */
  href: string;
};

export type PersonalInfo = {
  /** Owner's published display name. */
  displayName: string;
  /** Short published introduction, shown near the top of the page. */
  introduction: string;
  /** Longer published biography copy. */
  biography: string;
  /** Published social links, in display order. May be empty. */
  socialLinks: SocialLink[];
};

/**
 * The live content source `/info` reads. `null` until the owner publishes
 * real personal information -- do not invent content here to fill it in.
 */
export const PUBLISHED_PERSONAL_INFO: PersonalInfo | null = null;

/**
 * Fixture used only by tests to exercise the published branch of
 * `PersonalInfoContent`. Never wired into the live route -- values are
 * obviously-placeholder text, not real owner content.
 */
export const PLACEHOLDER_PERSONAL_INFO: PersonalInfo = {
  displayName: '[Placeholder Owner Name]',
  introduction: '[Placeholder introduction copy for test fixtures only.]',
  biography:
    '[Placeholder biography copy for test fixtures only. Not real owner content.]',
  socialLinks: [
    { label: '[Placeholder GitHub]', href: 'https://example.com/placeholder-github' },
    { label: '[Placeholder X]', href: 'https://example.com/placeholder-x' },
  ],
};
