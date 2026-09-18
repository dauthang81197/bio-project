'use client';

import Link from 'next/link';
import { useEffect, useId, useRef, useState } from 'react';
import { allNavDestinations, isNavItemCurrent, siteConfig } from '@/lib/site-config';

/** Matches the `desktop` breakpoint declared in globals.css (`--breakpoint-desktop`). */
const DESKTOP_QUERY = '(min-width: 1200px)';

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

type MobileMenuProps = {
  pathname: string;
};

/**
 * Labeled disclosure menu for narrow viewports. Hand-rolled with plain ARIA
 * (no headless-menu library): a labeled toggle button controls a panel that
 * traps focus while open, closes on Escape, and returns focus to the
 * trigger on close.
 */
export function MobileMenu({ pathname }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // If the viewport grows into the desktop breakpoint while the panel is
  // open, close it so it doesn't linger as an off-screen focus trap.
  useEffect(() => {
    const mediaQueryList = window.matchMedia(DESKTOP_QUERY);
    const handleChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };
    mediaQueryList.addEventListener('change', handleChange);
    return () => mediaQueryList.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const panel = panelRef.current;
    if (!panel) {
      return;
    }

    const getFocusable = () =>
      Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));

    getFocusable()[0]?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setIsOpen(false);
        buttonRef.current?.focus();
        return;
      }

      if (event.key !== 'Tab') {
        return;
      }

      const focusable = getFocusable();
      if (focusable.length === 0) {
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) {
        return;
      }

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <div className="relative shrink-0 desktop:hidden" data-testid="mobile-menu">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        data-testid="mobile-menu-button"
        onClick={() => setIsOpen((open) => !open)}
        className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-button border border-hairline bg-surface px-3 py-2 font-bold text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-blue"
      >
        {isOpen ? 'Close menu' : 'Menu'}
      </button>

      <div
        id={panelId}
        ref={panelRef}
        hidden={!isOpen}
        data-testid="mobile-menu-panel"
        className="absolute inset-x-0 top-full z-10 border-b border-hairline bg-surface px-gutter-mobile py-4 shadow-[0_4px_16px_rgba(24,33,43,.06)]"
      >
        <nav aria-label="Primary" data-testid="mobile-nav">
          <ul className="flex flex-col gap-4">
            {allNavDestinations.map((item) => {
              const current = isNavItemCurrent(pathname, item.href);
              const isCta = item.href === siteConfig.booksCta.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={current ? 'page' : undefined}
                    onClick={() => setIsOpen(false)}
                    data-testid={`mobile-nav-link-${item.href}`}
                    className={
                      isCta
                        ? 'inline-flex min-h-11 min-w-11 items-center rounded-button bg-action-blue px-4 py-2 font-bold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-blue aria-[current=page]:ring-2 aria-[current=page]:ring-ink aria-[current=page]:ring-offset-2'
                        : 'flex min-h-11 min-w-11 items-center text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-blue aria-[current=page]:font-bold aria-[current=page]:text-action-blue'
                    }
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
}
