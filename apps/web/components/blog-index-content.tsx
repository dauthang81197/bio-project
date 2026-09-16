/** @jsxImportSource react */
import Link from 'next/link';
import type { BlogPostSummary } from '@/lib/blog-posts';

type BlogIndexContentProps = {
  posts: readonly BlogPostSummary[];
};

const copy = {
  heading: 'Blog',
  empty: 'No posts have been published yet. Check back soon.',
  readPost: 'Read post',
} as const;

export function BlogIndexContent({ posts }: BlogIndexContentProps) {
  return (
    <div data-testid="blog-index">
      <h1 className="text-heading">{copy.heading}</h1>
      {posts.length === 0 ? (
        <p className="mt-4 max-w-prose text-muted-ink" data-testid="blog-empty">
          {copy.empty}
        </p>
      ) : (
        <ul className="mt-8 grid gap-4" data-testid="blog-post-list">
          {posts.map((post) => (
            <li key={post.slug}>
              <article className="rounded-card border border-hairline bg-surface p-4 md:p-6">
                <h2 className="text-xl font-bold">{post.title}</h2>
                <p className="mt-2 max-w-prose text-muted-ink">{post.excerpt}</p>
                <p className="mt-4">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-block min-h-11 py-2 font-bold text-action-blue underline hover:no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-blue"
                  >
                    {copy.readPost}: {post.title}
                  </Link>
                </p>
              </article>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
