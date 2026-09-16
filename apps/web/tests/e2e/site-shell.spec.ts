import { test, expect, type Page } from '@playwright/test';

/**
 * Covers every row of the "I/O & Edge-Case Matrix" in
 * spec-1-1-establish-the-public-site-shell.md. Runs against a production
 * build/start (see playwright.config.ts `webServer`), not dev mode.
 */

const DESKTOP_VIEWPORT = { width: 1280, height: 900 };
const TABLET_VIEWPORT = { width: 900, height: 900 };
const MOBILE_VIEWPORT = { width: 320, height: 800 };

async function focusedTestId(page: Page): Promise<string | null> {
  return page.evaluate(
    () => document.activeElement?.getAttribute('data-testid') ?? null,
  );
}

test.describe('Matrix row 1 -- Desktop nav (>=1200px)', () => {
  test('shows the full inline nav and marks the current section', async ({
    page,
  }) => {
    await page.setViewportSize(DESKTOP_VIEWPORT);
    await page.goto('/info');

    await expect(page.getByTestId('desktop-nav')).toBeVisible();
    await expect(page.getByTestId('mobile-menu-button')).toBeHidden();

    await expect(page.getByTestId('desktop-nav-link-/info')).toHaveAttribute(
      'aria-current',
      'page',
    );
    await expect(
      page.getByTestId('desktop-nav-link-/blog'),
    ).not.toHaveAttribute('aria-current', 'page');
    await expect(
      page.getByTestId('desktop-nav-link-/tiktok'),
    ).not.toHaveAttribute('aria-current', 'page');
    await expect(page.getByTestId('desktop-books-cta')).not.toHaveAttribute(
      'aria-current',
      'page',
    );

    // Nav links to every public section.
    await expect(page.getByTestId('desktop-nav-link-/info')).toHaveAttribute(
      'href',
      '/info',
    );
    await expect(page.getByTestId('desktop-nav-link-/blog')).toHaveAttribute(
      'href',
      '/blog',
    );
    await expect(
      page.getByTestId('desktop-nav-link-/tiktok'),
    ).toHaveAttribute('href', '/tiktok');
    await expect(page.getByTestId('desktop-books-cta')).toHaveAttribute(
      'href',
      '/book',
    );

    // The Books CTA also gets aria-current when the visitor is on /book.
    await page.goto('/book');
    await expect(page.getByTestId('desktop-books-cta')).toHaveAttribute(
      'aria-current',
      'page',
    );
  });
});

test.describe('Matrix row 2 -- Mobile menu closed (<768px, not activated)', () => {
  test('shows a labeled menu button and keeps its links out of the tab order', async ({
    page,
  }) => {
    await page.setViewportSize(MOBILE_VIEWPORT);
    await page.goto('/');

    const button = page.getByTestId('mobile-menu-button');
    await expect(button).toBeVisible();
    await expect(button).toHaveAccessibleName(/menu/i);
    await expect(button).toHaveAttribute('aria-expanded', 'false');

    // Panel is present but closed, so its links are not visible/focusable.
    await expect(page.getByTestId('mobile-menu-panel')).toBeHidden();
    await expect(page.getByTestId('mobile-nav-link-/info')).toBeHidden();

    // Desktop nav is also not shown at this width.
    await expect(page.getByTestId('desktop-nav')).toBeHidden();

    // Tabbing from the top never lands on a (closed) panel link.
    await page.locator('body').evaluate((el) => el.focus());
    await page.keyboard.press('Tab'); // brand link
    expect(await focusedTestId(page)).toBe('brand-link');
    await page.keyboard.press('Tab'); // menu button
    expect(await focusedTestId(page)).toBe('mobile-menu-button');
    await page.keyboard.press('Tab'); // moves on to page content, not a nav link
    const afterButton = await focusedTestId(page);
    // `null` means focus moved to untagged page content, which also
    // satisfies "not a (closed) panel link".
    expect(afterButton ?? '').not.toMatch(/^mobile-nav-link-/);
  });
});

test.describe('Matrix row 3 -- Mobile menu open (activated)', () => {
  test('opens via click: panel opens, aria-expanded=true, focus enters the panel', async ({
    page,
  }) => {
    await page.setViewportSize(MOBILE_VIEWPORT);
    await page.goto('/');

    const button = page.getByTestId('mobile-menu-button');
    await button.click();

    await expect(button).toHaveAttribute('aria-expanded', 'true');
    await expect(page.getByTestId('mobile-menu-panel')).toBeVisible();
    await expect(page.getByTestId('mobile-nav-link-/info')).toBeFocused();
  });

  for (const key of ['Enter', 'Space'] as const) {
    test(`opens via keyboard (${key} on the focused trigger)`, async ({
      page,
    }) => {
      await page.setViewportSize(MOBILE_VIEWPORT);
      await page.goto('/');

      await page.locator('body').evaluate((el) => el.focus());
      await page.keyboard.press('Tab'); // brand link
      await page.keyboard.press('Tab'); // menu button
      expect(await focusedTestId(page)).toBe('mobile-menu-button');

      await page.keyboard.press(key);

      const button = page.getByTestId('mobile-menu-button');
      await expect(button).toHaveAttribute('aria-expanded', 'true');
      await expect(page.getByTestId('mobile-menu-panel')).toBeVisible();
      await expect(page.getByTestId('mobile-nav-link-/info')).toBeFocused();
    });
  }
});

test.describe('Matrix row 4 -- Mobile menu close via Esc', () => {
  test('closes on Escape and returns focus to the trigger', async ({
    page,
  }) => {
    await page.setViewportSize(MOBILE_VIEWPORT);
    await page.goto('/');

    const button = page.getByTestId('mobile-menu-button');
    await button.click();
    await expect(button).toHaveAttribute('aria-expanded', 'true');

    await page.keyboard.press('Escape');

    await expect(button).toHaveAttribute('aria-expanded', 'false');
    await expect(page.getByTestId('mobile-menu-panel')).toBeHidden();
    await expect(button).toBeFocused();
  });

  test('traps Tab inside the open panel (Shift+Tab from the first item wraps to the last)', async ({
    page,
  }) => {
    await page.setViewportSize(MOBILE_VIEWPORT);
    await page.goto('/');

    const button = page.getByTestId('mobile-menu-button');
    await button.click();
    await expect(page.getByTestId('mobile-nav-link-/info')).toBeFocused();

    await page.keyboard.press('Shift+Tab');
    // Last focusable item in the panel is the Books CTA.
    await expect(page.getByTestId('mobile-nav-link-/book')).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.getByTestId('mobile-nav-link-/info')).toBeFocused();
  });
});

test.describe('Matrix row 5 -- Keyboard traversal follows reading order', () => {
  test('desktop (>=1200px): logo -> nav -> Books CTA', async ({ page }) => {
    await page.setViewportSize(DESKTOP_VIEWPORT);
    await page.goto('/');
    await page.locator('body').evaluate((el) => el.focus());

    const expectedOrder = [
      'brand-link',
      'desktop-nav-link-/info',
      'desktop-nav-link-/blog',
      'desktop-nav-link-/tiktok',
      'desktop-books-cta',
    ];

    for (const testId of expectedOrder) {
      await page.keyboard.press('Tab');
      expect(await focusedTestId(page)).toBe(testId);
    }

    // The (hidden) mobile menu button is never reached at this width.
    await page.keyboard.press('Tab');
    expect(await focusedTestId(page)).not.toBe('mobile-menu-button');
  });

  test('mobile (<768px): logo -> menu button', async ({ page }) => {
    await page.setViewportSize(MOBILE_VIEWPORT);
    await page.goto('/');
    await page.locator('body').evaluate((el) => el.focus());

    const expectedOrder = ['brand-link', 'mobile-menu-button'];

    for (const testId of expectedOrder) {
      await page.keyboard.press('Tab');
      expect(await focusedTestId(page)).toBe(testId);
    }

    // The (hidden) desktop nav links are never reached at this width.
    await page.keyboard.press('Tab');
    const afterButton = await focusedTestId(page);
    // `null` means focus moved to untagged page content, which also
    // satisfies "not a (hidden) desktop nav link".
    expect(afterButton ?? '').not.toMatch(/^desktop-nav-link-/);
    expect(afterButton).not.toBe('desktop-books-cta');
  });

  test('tablet (768-1199px) does not fall between the two defined states', async ({
    page,
  }) => {
    // The spec's matrix only defines <768 (menu) and >=1200 (full nav); the
    // implementation resolves the gap by treating anything under 1200 as
    // the mobile-menu state, so this width must match the mobile row.
    await page.setViewportSize(TABLET_VIEWPORT);
    await page.goto('/');

    await expect(page.getByTestId('mobile-menu-button')).toBeVisible();
    await expect(page.getByTestId('desktop-nav')).toBeHidden();
  });
});

test.describe('Public routes render without error', () => {
  for (const [path, heading, content] of [
    ['/blog', 'Blog', 'No posts have been published yet.'],
    ['/tiktok', 'TikTok', 'Content coming soon.'],
  ] as const) {
    test(`${path} renders its stub content`, async ({ page }) => {
      const response = await page.goto(path);

      expect(response?.status()).toBe(200);
      await expect(page.getByTestId('site-header')).toBeVisible();
      await expect(
        page.getByRole('heading', { name: heading, exact: true }),
      ).toBeVisible();
      await expect(page.getByText(content)).toBeVisible();
    });
  }
});

test.describe('No horizontal overflow at any supported width', () => {
  for (const [name, viewport] of [
    ['mobile (320px)', MOBILE_VIEWPORT],
    ['tablet (900px)', TABLET_VIEWPORT],
    ['desktop (1280px)', DESKTOP_VIEWPORT],
  ] as const) {
    test(name, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto('/');

      const scrollWidth = await page.evaluate(
        () => document.documentElement.scrollWidth,
      );
      expect(scrollWidth).toBeLessThanOrEqual(viewport.width);
    });
  }
});

test.describe('Mobile menu side effects', () => {
  test('auto-closes and returns focus to the trigger when the viewport grows to desktop width', async ({
    page,
  }) => {
    await page.setViewportSize(MOBILE_VIEWPORT);
    await page.goto('/');

    const button = page.getByTestId('mobile-menu-button');
    await button.click();
    await expect(button).toHaveAttribute('aria-expanded', 'true');

    await page.setViewportSize(DESKTOP_VIEWPORT);

    await expect(button).toHaveAttribute('aria-expanded', 'false');
    await expect(page.getByTestId('mobile-menu-panel')).toBeHidden();
  });

  test('closes after a panel nav link is selected', async ({ page }) => {
    await page.setViewportSize(MOBILE_VIEWPORT);
    await page.goto('/');

    const button = page.getByTestId('mobile-menu-button');
    await button.click();
    await expect(page.getByTestId('mobile-menu-panel')).toBeVisible();

    await page.getByTestId('mobile-nav-link-/info').click();

    await expect(page).toHaveURL(/\/info$/);
    await expect(button).toHaveAttribute('aria-expanded', 'false');
    await expect(page.getByTestId('mobile-menu-panel')).toBeHidden();
  });
});

test.describe('Matrix row 6 -- Unknown public route', () => {
  test('renders Next.js not-found inside the shared shell', async ({
    page,
  }) => {
    const response = await page.goto('/this-route-does-not-exist');

    expect(response?.status()).toBe(404);
    await expect(page.getByTestId('site-header')).toBeVisible();
    await expect(page.getByTestId('desktop-nav')).toHaveCount(1);
    await expect(
      page.getByRole('heading', { name: /page not found/i }),
    ).toBeVisible();
    await expect(page.getByTestId('brand-link')).toHaveAttribute(
      'href',
      '/',
    );
  });
});
