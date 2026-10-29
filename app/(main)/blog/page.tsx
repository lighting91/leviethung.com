import type { Metadata } from "next";
import { getAllPosts } from "@/lib/content";
import PageHero from "@/components/ui/PageHero";
import PostCard from "@/components/ui/PostCard";

export const metadata: Metadata = {
  title: "Blog",
  description: "Kiến thức thực chiến về TikTok Shop, KOC, livestream và nội dung bán hàng.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <>
      <PageHero
        kicker="Insights"
        title="Blog"
        accent="thực chiến"
        lead="Kiến thức về TikTok Shop, KOC, livestream và nội dung bán hàng — viết từ kinh nghiệm vận hành thật."
      />

      <section className="section">
        <div className="container-x">
          {posts.length === 0 ? (
            <div className="card reveal mx-auto max-w-xl p-10 text-center">
              <p className="text-lg font-semibold text-ink">Chưa có bài viết nào.</p>
              <p className="mt-2 text-[0.95rem]">Nội dung sẽ sớm được cập nhật!</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => <PostCard key={post.slug} post={post} />)}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
