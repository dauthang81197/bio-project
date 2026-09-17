/** @jsxImportSource react */
import { test, expect } from '@playwright/test';
import { renderToStaticMarkup } from 'react-dom/server';
import Loading from '@/components/public-loading';
import ErrorPage from '@/app/error';
import InfoLoading from '@/app/info/loading';
import BlogLoading from '@/app/blog/(index)/loading';
import TikTokLoading from '@/app/tiktok/loading';
import BooksLoading from '@/app/book/loading';

test('loading state has a named semantic status and hidden skeleton', () => {
  const html = renderToStaticMarkup(<Loading />);
  expect(html).toContain('role="status"');
  expect(html).toContain('aria-label="Loading page"');
  expect(html).toContain('Loading page');
  expect(html).toContain('aria-hidden="true"');
});

for (const [section, RouteLoading] of [
  ['Info', InfoLoading],
  ['Blog', BlogLoading],
  ['TikTok', TikTokLoading],
  ['Books', BooksLoading],
] as const) {
  test(`${section} route loading boundary identifies its section`, () => {
    const html = renderToStaticMarkup(<RouteLoading />);
    expect(html).toContain(`aria-label="Loading ${section}"`);
    expect(html).toContain('aria-hidden="true"');
  });
}

test('unexpected error offers recovery without exposing exception details', () => {
  let retried = false;
  const reset = () => { retried = true; };
  const element = ErrorPage({ error: new Error('private failure detail'), reset });
  const html = renderToStaticMarkup(element);
  expect(html).toContain('role="alert"');
  expect(html).toContain('Try again');
  expect(html).toContain('Go back home');
  expect(html).not.toContain('private failure detail');

  const actions = element.props.children[2];
  const retryButton = actions.props.children[0];
  retryButton.props.onClick();
  expect(retried).toBe(true);
});
