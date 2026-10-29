import Link from "next/link";
import Icon from "@/components/ui/Icon";
import type { Post } from "@/lib/content";

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("vi-VN", { year: "numeric", month: "long", day: "numeric" });
}

export default function PostCard({ post }: { post: Post }) {
  return (
    <Link href={`/blog/${post.slug}`} className="card card-hover reveal group flex flex-col overflow-hidden">
      {post.thumbnail && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={post.thumbnail} alt="" className="aspect-[16/9] w-full object-cover" loading="lazy" />
      )}
      <div className="flex flex-1 flex-col p-7">
        <div className="mb-3 flex flex-wrap gap-2">
          {post.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="chip">{tag}</span>
          ))}
        </div>
        <h3 className="mb-2 line-clamp-2 text-[1.15rem] font-bold leading-snug text-navy transition-colors group-hover:text-cyan-deep">
          {post.title}
        </h3>
        <p className="mb-5 line-clamp-3 text-[0.92rem]">{post.excerpt}</p>
        <div className="mt-auto flex items-center justify-between border-t border-dashed border-line pt-4 text-[0.82rem] text-muted">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span className="inline-flex items-center gap-1 font-semibold text-ink">
            Đọc bài <Icon name="arrow-right" className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={2} />
          </span>
        </div>
      </div>
    </Link>
  );
}
