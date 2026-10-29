import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/content";
import { MDXRemote } from "next-mdx-remote/rsc";
import Icon from "@/components/ui/Icon";
import { formatDate } from "@/components/ui/PostCard";
import PlaybookCta from "@/components/ui/PlaybookCta";
import { site } from "@/lib/site";

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
    <>
      <section className="bg-gradient-to-b from-white to-soft pb-12 pt-12 sm:pt-16">
        <div className="container-x max-w-[860px]">
          <Link href="/blog" className="mb-8 inline-flex items-center gap-1.5 text-[0.9rem] font-semibold text-ink hover:text-cyan-deep">
            <Icon name="chevron-left" className="h-4 w-4" strokeWidth={2} /> Quay lại Blog
          </Link>
          <div className="mb-5 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className="chip">{tag}</span>
            ))}
          </div>
          <h1 className="mb-5 text-[clamp(1.9rem,4.4vw,3rem)] font-bold leading-[1.12] tracking-[-0.03em]">{post.title}</h1>
          <div className="flex items-center gap-3 text-[0.9rem] text-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={site.portrait} alt="" width={40} height={40} className="h-10 w-10 rounded-full object-cover object-top" />
            <span>
              <strong className="block text-[0.92rem] text-ink">{site.name}</strong>
              <time dateTime={post.date}>{formatDate(post.date)}</time>
            </span>
          </div>
        </div>
      </section>

      <section className="pb-24 pt-12">
        <div className="container-x max-w-[860px]">
          {post.thumbnail && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={post.thumbnail} alt="" className="mb-10 w-full rounded-card object-cover" />
          )}
          <article className="prose prose-lg prose-slate max-w-none prose-headings:tracking-[-0.02em] prose-p:text-body prose-li:text-body prose-img:rounded-card">
            <MDXRemote source={post.content} />
          </article>

          <div className="card mt-14 flex flex-col items-start gap-5 p-7 sm:flex-row sm:items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={site.portrait} alt="" width={64} height={64} className="h-16 w-16 flex-none rounded-full object-cover object-top" />
            <div className="flex-1">
              <p className="text-[0.78rem] font-bold uppercase tracking-[0.18em] text-muted">Tác giả</p>
              <p className="text-[1.1rem] font-bold text-navy">{site.name}</p>
              <p className="text-[0.92rem]">Founder SMUFT Agency · 8+ năm thương mại điện tử, TikTok Shop & KOC.</p>
            </div>
            <Link href="/ve-toi" className="btn btn-outline btn-sm">Về tôi</Link>
          </div>

          <div className="mt-10">
            <PlaybookCta />
          </div>
        </div>
      </section>
    </>
  );
}
