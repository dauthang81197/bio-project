import { test, expect } from '@playwright/test';
import { siteConfig } from '@/lib/site-config';

/**
 * Browser check of the live `/info` route. `PUBLISHED_PERSONAL_INFO` is
 * `null` until the owner publishes real content (see
 * apps/web/lib/personal-info.ts), so the live route must honestly render
 * the not-yet-published state, inside the shared site shell from story 1.1.
 */

test.describe('Live /info route -- not yet published', () => {
  test('renders the content-unavailable state inside the shared shell', async ({
    page,
  }) => {
    const response = await page.goto('/info');

    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(`${siteConfig.brandName} -- Info`);
    await expect(page.getByTestId('site-header')).toBeVisible();
    await expect(page.getByTestId('info-unavailable')).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Info', exact: true }),
    ).toBeVisible();
    await expect(page.getByText('has not been published yet')).toBeVisible();

    // No draft fields or published-only markup leaks through.
    await expect(page.getByTestId('info-published')).toHaveCount(0);
    await expect(page.getByTestId('info-social-links')).toHaveCount(0);
  });

  test('marks /info current in the shared nav', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/info');

    await expect(page.getByTestId('desktop-nav-link-/info')).toHaveAttribute(
      'aria-current',
      'page',
    );
  });
});
