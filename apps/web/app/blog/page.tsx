import type { Metadata } from 'next';
import { BlogIndexContent } from '@/components/blog-index-content';
import { listPublishedBlogPosts } from '@/lib/blog-posts';
import { siteConfig } from '@/lib/site-config';

export const metadata: Metadata = {
  title: `${siteConfig.brandName} -- Blog`,
};

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-reading px-gutter-mobile py-12 md:px-gutter-desktop">
      <BlogIndexContent posts={listPublishedBlogPosts()} />
    </div>
  );
}
