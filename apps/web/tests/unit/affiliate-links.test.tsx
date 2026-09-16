/** @jsxImportSource react */
import { test, expect } from '@playwright/test';
import { renderToStaticMarkup } from 'react-dom/server';
import { AffiliateLinksContent } from '@/components/affiliate-links-content';
import {
  listActiveAffiliateLinks,
  type AffiliateLinkRecord,
} from '@/lib/affiliate-links';

const FIXTURES: readonly AffiliateLinkRecord[] = [
  {
    title: '[Test] Active one',
    destination: 'https://example.test/item-one?owner_ref=kept',
    description: '[Test] First description.',
    state: 'active',
    adminNotes: '[Private] admin note',
    customerId: '[Private] customer',
    checkoutToken: '[Private] checkout',
    paidDownloadUrl: 'https://example.test/private-download',
  },
  {
    title: '[Private] Inactive',
    destination: 'https://example.test/inactive',
    state: 'inactive',
  },
  {
    title: '[Private] Malformed',
    destination: 'not-a-url',
    state: 'active',
  },
  {
    title: '[Private] HTTP',
    destination: 'http://example.test/insecure',
    state: 'active',
  },
  {
    title: '[Private] JavaScript scheme',
    destination: 'javascript:alert(1)',
    state: 'active',
  },
  {
    title: '[Private] Data scheme',
    destination: 'data:text/html,not-safe',
    state: 'active',
  },
  {
    title: '[Private] Protocol relative',
    destination: '//example.test/not-absolute',
    state: 'active',
  },
  {
    title: '[Private] Whitespace destination',
    destination: ' https://example.test/padded ',
    state: 'active',
  },
  {
    title: '[Private] Credentialed',
    destination: 'https://user:password@example.test/private',
    state: 'active',
  },
  {
    title: '   ',
    destination: 'https://example.test/blank-title',
    state: 'active',
  },
  {
    title: '[Test] Active two',
    destination: 'https://example.test/item-two',
    description: '   ',
    state: 'active',
  },
];

test('mixed records are validated before narrow public projection and preserve source order', () => {
  const links = listActiveAffiliateLinks(FIXTURES);

  expect(links).toEqual([
    {
      title: '[Test] Active one',
      destination: 'https://example.test/item-one?owner_ref=kept',
      description: '[Test] First description.',
    },
    {
      title: '[Test] Active two',
      destination: 'https://example.test/item-two',
    },
  ]);
  expect(JSON.stringify(links)).not.toMatch(
    /Private|adminNotes|customerId|checkoutToken|paidDownloadUrl/,
  );
});

test('valid destinations are preserved exactly without added parameters', () => {
  const [link] = listActiveAffiliateLinks(FIXTURES);

  expect(link?.destination).toBe(
    'https://example.test/item-one?owner_ref=kept',
  );
});

test('the list renders semantic cards and accessible external actions', () => {
  const html = renderToStaticMarkup(
    <AffiliateLinksContent links={listActiveAffiliateLinks(FIXTURES)} />,
  );

  expect(html).toContain('<ul');
  expect(html).toContain('<article');
  expect(html).toContain(
    'href="https://example.test/item-one?owner_ref=kept"',
  );
  expect(html).toContain('target="_blank"');
  expect(html).toContain('rel="noopener noreferrer"');
  expect(html).toContain('↗');
  expect(html).toContain('opens in a new tab');
  expect(html).toContain('min-h-11');
  expect(html).toContain('min-w-11');
  expect(html).toContain('break-all');
  expect(html).toContain('focus-visible:outline');
  expect(html).not.toContain('[Private]');
});

test('copy is trimmed while the destination remains exact', () => {
  expect(listActiveAffiliateLinks([{
    title: '  [Test] Title  ',
    description: '  [Test] Description  ',
    destination: 'https://example.test/item?owner_ref=kept',
    state: 'active',
  }])).toEqual([{
    title: '[Test] Title',
    description: '[Test] Description',
    destination: 'https://example.test/item?owner_ref=kept',
  }]);
});

test('blank optional descriptions do not render an empty description element', () => {
  const html = renderToStaticMarkup(
    <AffiliateLinksContent links={listActiveAffiliateLinks(FIXTURES)} />,
  );

  expect(html).toContain('[Test] First description.');
  expect(html).not.toContain('>   </p>');
});

test('an empty collection renders the truthful empty state', () => {
  const html = renderToStaticMarkup(<AffiliateLinksContent links={[]} />);

  expect(html).toContain('No affiliate links are available right now');
  expect(html).not.toContain('<ul');
});

test('unsafe-looking copy renders as escaped text', () => {
  const html = renderToStaticMarkup(
    <AffiliateLinksContent
      links={[
        {
          title: '<script>not executable</script>',
          destination: 'https://example.test/safe',
          description: '<img src=x onerror=alert(1)>',
        },
      ]}
    />,
  );

  expect(html).toContain('&lt;script&gt;not executable&lt;/script&gt;');
  expect(html).toContain('&lt;img src=x onerror=alert(1)&gt;');
  expect(html).not.toContain('<script>');
  expect(html).not.toContain('<img');
});
