/**
 * Typed, swappable server-side source for public blog reads.
 *
 * The live collection stays empty until the owner supplies real posts. The
 * complete record type is intentionally separate from the public DTOs so the
 * publication decision is made before any record is projected for rendering.
 */

export type BlogPostRecord = {
  slug: string;
  title: string;
  excerpt: string;
  body: readonly string[];
  publicationState: 'published' | 'draft' | 'unpublished';
  adminNotes?: string;
};

export type BlogPostSummary = Pick<BlogPostRecord, 'slug' | 'title' | 'excerpt'>;

export type PublishedBlogPost = BlogPostSummary &
  Pick<BlogPostRecord, 'body'>;

const LIVE_BLOG_POSTS: readonly BlogPostRecord[] = [];

function isPublished(post: BlogPostRecord): boolean {
  return post.publicationState === 'published';
}

function toSummary(post: BlogPostRecord): BlogPostSummary {
  return { slug: post.slug, title: post.title, excerpt: post.excerpt };
}

function toPublishedPost(post: BlogPostRecord): PublishedBlogPost {
  return { ...toSummary(post), body: post.body };
}

export function listPublishedBlogPosts(
  source: readonly BlogPostRecord[] = LIVE_BLOG_POSTS,
): BlogPostSummary[] {
  return source.filter(isPublished).map(toSummary);
}

export function getPublishedBlogPostBySlug(
  slug: string,
  source: readonly BlogPostRecord[] = LIVE_BLOG_POSTS,
): PublishedBlogPost | null {
  const post = source.filter(isPublished).find((candidate) => candidate.slug === slug);

  return post ? toPublishedPost(post) : null;
}
