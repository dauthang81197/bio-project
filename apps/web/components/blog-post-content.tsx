/** @jsxImportSource react */
import type { PublishedBlogPost } from '@/lib/blog-posts';

type BlogPostContentProps = {
  post: PublishedBlogPost;
};

export function BlogPostContent({ post }: BlogPostContentProps) {
  return (
    <article data-testid="blog-post">
      <h1 className="break-words text-heading">{post.title}</h1>
      <div className="mt-8 max-w-prose space-y-4 text-body" data-testid="blog-post-body">
        {post.body.map((paragraph, index) => (
          <p key={index} className="break-words">{paragraph}</p>
        ))}
      </div>
    </article>
  );
}
