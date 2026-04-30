import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/content";
import { MDXRemote } from "next-mdx-remote/rsc";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <Link href="/blog" className="text-sm text-indigo-600 hover:underline mb-6 inline-block">
        ← Quay lại Blog
      </Link>

      <div className="mb-6">
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag) => (
            <span key={tag} className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-medium">
              {tag}
            </span>
          ))}
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">{post.title}</h1>
        <p className="text-slate-500 text-sm">
          {new Date(post.date).toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      <hr className="border-slate-200 mb-8" />

      <article className="prose prose-slate max-w-none prose-headings:font-bold prose-a:text-indigo-600 prose-img:rounded-xl">
        <MDXRemote source={post.content} />
      </article>

      <hr className="border-slate-200 mt-12 mb-8" />

      <div className="bg-indigo-50 rounded-xl p-6 text-center">
        <p className="font-semibold text-slate-900 mb-2">Thấy bài viết hữu ích?</p>
        <p className="text-sm text-slate-600 mb-4">Theo dõi tôi để không bỏ lỡ những kiến thức mới nhất.</p>
        <Link href="/ve-toi" className="text-indigo-600 font-medium text-sm hover:underline">
          Tìm hiểu thêm về tôi →
        </Link>
      </div>
    </div>
  );
}
