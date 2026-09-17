import { test, expect } from '@playwright/test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { BlogIndexContent } from '@/components/blog-index-content';
import { BlogPostContent } from '@/components/blog-post-content';
import { PersonalInfoContent } from '@/components/personal-info-content';

for (const [path, text] of [
  ['/info', 'This page has not been published yet.'],
  ['/blog', 'No posts have been published yet.'],
  ['/tiktok', 'No affiliate links are available right now.'],
] as const) {
  test(`${path} empty state keeps a route home`, async ({ page }) => {
    await page.goto(path);
    await expect(page.getByText(text, { exact: false })).toBeVisible();
    const home = page.getByRole('link', { name: 'Go back home' });
    await expect(home).toHaveAttribute('href', '/');
    await home.focus();
    await expect(home).toBeFocused();
    expect(await home.evaluate((el) => el.getBoundingClientRect().height)).toBeGreaterThanOrEqual(44);
  });
}

test('public routes remain usable at 320px and at 200% text size', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  for (const path of ['/', '/info', '/blog', '/tiktok', '/book']) {
    await page.goto(path);
    await expect(page.locator('main')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
    await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
    const menu = page.getByTestId('mobile-menu-button');
    await expect(menu).toBeVisible();
    await menu.focus();
    await expect(menu).toBeFocused();
    const box = await menu.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(320);
  }
});

test('reduced motion removes nonessential transitions', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto('/');
  const durations = await page.evaluate(() => {
    const probe = document.createElement('div');
    probe.style.transition = 'opacity 2s';
    probe.style.animation = 'fade 2s infinite';
    document.body.append(probe);
    const style = getComputedStyle(probe);
    const result = [style.transitionDuration, style.animationDuration, style.animationIterationCount];
    probe.remove();
    return result;
  });
  expect(durations).toEqual(['1e-05s', '1e-05s', '1']);
});

test('published content and navigation remain usable with long copy', async ({ page }) => {
  const longWord = 'L'.repeat(180);
  const samples = [
    renderToStaticMarkup(createElement(BlogIndexContent, { posts: [{ slug: 'sample', title: longWord, excerpt: longWord }] })),
    renderToStaticMarkup(createElement(BlogPostContent, { post: { slug: 'sample', title: longWord, excerpt: longWord, body: [longWord] } })),
    renderToStaticMarkup(createElement(PersonalInfoContent, { info: { displayName: longWord, introduction: longWord, biography: longWord, socialLinks: [{ label: longWord, href: 'https://example.com' }] } })),
  ];

  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto('/blog');
  for (const markup of samples) {
    await page.locator('main').evaluate((el, html) => { el.innerHTML = html; }, markup);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
  }

  const brand = page.getByTestId('brand-link');
  const menu = page.getByTestId('mobile-menu-button');
  expect(await brand.evaluate((el) => el.getBoundingClientRect().height)).toBeGreaterThanOrEqual(44);
  expect(await menu.evaluate((el) => el.getBoundingClientRect().height)).toBeGreaterThanOrEqual(44);
  await menu.click();
  for (const link of await page.getByTestId('mobile-nav').getByRole('link').all()) {
    expect(await link.evaluate((el) => el.getBoundingClientRect().height)).toBeGreaterThanOrEqual(44);
  }
});
