'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { siteConfig, isNavItemCurrent } from '@/lib/site-config';
import { MobileMenu } from './mobile-menu';

/**
 * Shared site header rendered on every public route. Identifies the current
 * section via `aria-current="page"`, links to every public section, and
 * hands off to the labeled mobile disclosure menu below the desktop
 * breakpoint.
 */
export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header data-testid="site-header" className="border-b border-hairline bg-surface">
      <div className="mx-auto flex max-w-reading items-center justify-between px-gutter-mobile py-4 md:px-gutter-desktop">
        <Link
          href="/"
          data-testid="brand-link"
          className="inline-flex min-h-11 min-w-11 items-center text-lg font-bold text-ink no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-blue"
        >
          {siteConfig.brandName}
        </Link>

        <nav
          aria-label="Primary"
          data-testid="desktop-nav"
          className="hidden items-center gap-6 desktop:flex"
        >
          <ul className="flex items-center gap-6">
            {siteConfig.navItems.map((item) => {
              const current = isNavItemCurrent(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={current ? 'page' : undefined}
                    data-testid={`desktop-nav-link-${item.href}`}
                    className="inline-flex min-h-11 min-w-11 items-center justify-center text-ink hover:text-action-blue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-blue aria-[current=page]:font-bold aria-[current=page]:text-action-blue"
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <Link
            href={siteConfig.booksCta.href}
            aria-current={isNavItemCurrent(pathname, siteConfig.booksCta.href) ? 'page' : undefined}
            data-testid="desktop-books-cta"
            className="inline-flex min-h-11 min-w-11 items-center rounded-button bg-action-blue px-4 py-2 font-bold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-blue aria-[current=page]:ring-2 aria-[current=page]:ring-ink aria-[current=page]:ring-offset-2"
          >
            {siteConfig.booksCta.label}
          </Link>
        </nav>

        <MobileMenu pathname={pathname} />
      </div>
    </header>
  );
}
