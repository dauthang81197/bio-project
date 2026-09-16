/** @jsxImportSource react */
import { test, expect } from '@playwright/test';
import { renderToStaticMarkup } from 'react-dom/server';
import { BlogIndexContent } from '@/components/blog-index-content';
import { BlogPostContent } from '@/components/blog-post-content';
import {
  getPublishedBlogPostBySlug,
  listPublishedBlogPosts,
  type BlogPostRecord,
} from '@/lib/blog-posts';

const FIXTURES: readonly BlogPostRecord[] = [
  {
    slug: 'published-one',
    title: '[Test] Published one',
    excerpt: '[Test] First public excerpt.',
    body: ['[Test] First paragraph.', '<script>alert("not executable")</script>'],
    publicationState: 'published',
    adminNotes: '[Private] published admin note',
  },
  {
    slug: 'draft-post',
    title: '[Private draft title]',
    excerpt: '[Private draft excerpt]',
    body: ['[Private draft body]'],
    publicationState: 'draft',
    adminNotes: '[Private draft note]',
  },
  {
    slug: 'published-two',
    title: '[Test] Published two',
    excerpt: '[Test] Second public excerpt.',
    body: ['[Test] Second body.'],
    publicationState: 'published',
  },
  {
    slug: 'unpublished-post',
    title: '[Private unpublished title]',
    excerpt: '[Private unpublished excerpt]',
    body: ['[Private unpublished body]'],
    publicationState: 'unpublished',
  },
];

test('mixed records are filtered before public projection and preserve source order', () => {
  const posts = listPublishedBlogPosts(FIXTURES);

  expect(posts).toEqual([
    {
      slug: 'published-one',
      title: '[Test] Published one',
      excerpt: '[Test] First public excerpt.',
    },
    {
      slug: 'published-two',
      title: '[Test] Published two',
      excerpt: '[Test] Second public excerpt.',
    },
  ]);
  expect(JSON.stringify(posts)).not.toMatch(/draft|unpublished|adminNotes|Private/);
});

test('the index renders a semantic list with descriptive post links', () => {
  const html = renderToStaticMarkup(
    <BlogIndexContent posts={listPublishedBlogPosts(FIXTURES)} />,
  );

  expect(html).toContain('<ul');
  expect(html).toContain('<article');
  expect(html).toContain('href="/blog/published-one"');
  expect(html).toContain('Read post: [Test] Published one');
  expect(html).toContain('focus-visible:outline');
  expect(html).not.toContain('[Private');
});

test('an empty collection renders the truthful empty state', () => {
  const html = renderToStaticMarkup(<BlogIndexContent posts={[]} />);

  expect(html).toContain('No posts have been published yet');
  expect(html).not.toContain('<ul');
});

test('a published slug renders every body paragraph as escaped text', () => {
  const post = getPublishedBlogPostBySlug('published-one', FIXTURES);
  expect(post).not.toBeNull();

  const html = renderToStaticMarkup(<BlogPostContent post={post!} />);
  expect(html).toContain('[Test] First paragraph.');
  expect(html).toContain('&lt;script&gt;alert(&quot;not executable&quot;)&lt;/script&gt;');
  expect(html).not.toContain('<script>');
  expect(html).not.toContain('adminNotes');
});

for (const slug of ['draft-post', 'unpublished-post', 'missing-post']) {
  test(`public lookup treats ${slug} as a miss`, () => {
    expect(getPublishedBlogPostBySlug(slug, FIXTURES)).toBeNull();
  });
}
