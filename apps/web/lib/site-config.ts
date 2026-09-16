/**
 * Single source of truth for brand text and primary navigation.
 *
 * The owner has not supplied final branding yet (PRD defers real bio/brand
 * copy to a pre-launch step), so `brandName` is an obviously-placeholder
 * string. Swap it -- and the nav labels/order below -- here only; layout
 * and header components read from this module and never hardcode copy.
 */

export type NavItem = {
  /** Visible label for the link. */
  label: string;
  /** Route the link points to. */
  href: string;
};

export const siteConfig = {
  /** Obviously-placeholder brand string; real branding lands pre-launch. */
  brandName: '[Your Brand Name]',

  /** Regular header navigation, in display/tab order. */
  navItems: [
    { label: 'Info', href: '/info' },
    { label: 'Blog', href: '/blog' },
    { label: 'TikTok', href: '/tiktok' },
  ] as NavItem[],

  /** Primary call-to-action, rendered distinctly from the regular nav links. */
  booksCta: {
    label: 'Books',
    href: '/book',
  } as NavItem,
} as const;

/** All header destinations (regular nav + CTA), used for "current section" checks. */
export const allNavDestinations: NavItem[] = [...siteConfig.navItems, siteConfig.booksCta];

/**
 * Whether `href` identifies the section the visitor is currently on, given
 * the active pathname. Used to set `aria-current="page"` on header links.
 */
export function isNavItemCurrent(pathname: string, href: string): boolean {
  if (href === '/') {
    return pathname === '/';
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}
