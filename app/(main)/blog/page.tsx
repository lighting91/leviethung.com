import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/content";

export const metadata: Metadata = {
  title: "Blog",
  description: "Bài viết về TikTok Marketing, Content Creation và xây dựng thương hiệu số.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Blog</h1>
        <p className="text-slate-500">Kiến thức thực chiến về TikTok Marketing và Content Creation.</p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-slate-400 text-lg">Chưa có bài viết nào.</p>
          <p className="text-slate-400 text-sm mt-2">Nội dung sẽ sớm được cập nhật!</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="bg-white rounded-xl border border-slate-200 p-6 hover:border-orange-300 hover:shadow-sm transition-all group"
            >
              <div className="flex flex-wrap gap-2 mb-3">
                {post.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="text-xs bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full font-medium">
                    {tag}
                  </span>
                ))}
              </div>
              <h2 className="font-semibold text-slate-900 group-hover:text-orange-600 transition-colors mb-2 text-lg line-clamp-2">
                {post.title}
              </h2>
              <p className="text-sm text-slate-500 line-clamp-3 mb-4">{post.excerpt}</p>
              <p className="text-xs text-slate-400">
                {new Date(post.date).toLocaleDateString("vi-VN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
