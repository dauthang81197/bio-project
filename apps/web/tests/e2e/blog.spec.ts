import { test, expect } from '@playwright/test';
import { siteConfig } from '@/lib/site-config';

test('the live blog index shows its empty state in the shared shell', async ({ page }) => {
  const response = await page.goto('/blog');

  expect(response?.status()).toBe(200);
  await expect(page.getByTestId('site-header')).toBeVisible();
  await expect(page).toHaveTitle(`${siteConfig.brandName} -- Blog`);
  await expect(page.getByRole('heading', { name: 'Blog', exact: true })).toBeVisible();
  await expect(page.getByTestId('blog-empty')).toContainText(
    'No posts have been published yet',
  );
  await expect(page.getByTestId('desktop-nav-link-/blog')).toHaveAttribute(
    'aria-current',
    'page',
  );
});

test('the live blog index remains readable without horizontal overflow at 320px', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto('/blog');

  await expect(page.getByRole('heading', { name: 'Blog', exact: true })).toBeVisible();
  await expect(page.getByTestId('blog-empty')).toBeVisible();
  const scrollWidth = await page.evaluate(
    () => document.documentElement.scrollWidth,
  );
  expect(scrollWidth).toBeLessThanOrEqual(320);
});

for (const slug of ['unknown-post', 'draft-post', 'unpublished-post']) {
  test(`${slug} receives the canonical content-safe not-found response`, async ({ page }) => {
    const response = await page.goto(`/blog/${slug}`);

    expect(response?.status()).toBe(404);
    await expect(page.getByTestId('site-header')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
    await expect(page.locator('body')).not.toContainText('[Private');
  });
}
