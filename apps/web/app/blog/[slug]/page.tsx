import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { BlogPostContent } from '@/components/blog-post-content';
import { getPublishedBlogPostBySlug } from '@/lib/blog-posts';
import { siteConfig } from '@/lib/site-config';

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPublishedBlogPostBySlug(slug);

  return {
    title: `${siteConfig.brandName} -- ${post?.title ?? 'Not found'}`,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPublishedBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-reading px-gutter-mobile py-12 md:px-gutter-desktop">
      <BlogPostContent post={post} />
    </div>
  );
}
