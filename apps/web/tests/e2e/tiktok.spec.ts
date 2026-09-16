import { test, expect } from '@playwright/test';
import { siteConfig } from '@/lib/site-config';

test('the live TikTok page shows its empty state in the shared shell', async ({
  page,
}) => {
  const response = await page.goto('/tiktok');

  expect(response?.status()).toBe(200);
  await expect(page.getByTestId('site-header')).toBeVisible();
  await expect(page).toHaveTitle(`${siteConfig.brandName} -- TikTok`);
  await expect(
    page.getByRole('heading', { name: 'TikTok', exact: true }),
  ).toBeVisible();
  await expect(page.getByTestId('affiliate-links-empty')).toContainText(
    'No affiliate links are available right now',
  );
  await expect(page.getByTestId('desktop-nav-link-/tiktok')).toHaveAttribute(
    'aria-current',
    'page',
  );
});

test('the live TikTok page remains readable without horizontal overflow at 320px', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto('/tiktok');

  await expect(
    page.getByRole('heading', { name: 'TikTok', exact: true }),
  ).toBeVisible();
  await expect(page.getByTestId('affiliate-links-empty')).toBeVisible();
  const scrollWidth = await page.evaluate(
    () => document.documentElement.scrollWidth,
  );
  expect(scrollWidth).toBeLessThanOrEqual(320);
});
