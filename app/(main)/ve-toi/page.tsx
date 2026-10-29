import type { Metadata } from "next";
import Link from "next/link";
import { getHomeSettings, getInstructorInfo } from "@/lib/content";
import { site } from "@/lib/site";
import Icon, { type IconName } from "@/components/ui/Icon";
import SectionHead from "@/components/ui/SectionHead";
import CountUp from "@/components/ui/CountUp";
import PlaybookCta from "@/components/ui/PlaybookCta";
import ContactSection from "@/components/ui/ContactSection";

export const metadata: Metadata = {
  title: "Về tôi",
  description:
    "Lê Viết Hưng — Founder SMUFT Agency, 8+ năm thương mại điện tử từ Seller đến Enabler. TikTok Shop, quản lý KOC, livestream và đào tạo.",
};

const pillars: { title: string; body: React.ReactNode }[] = [
  {
    title: "Mục tiêu",
    body: (
      <>
        Giúp người bán và thương hiệu Việt vận hành TikTok Shop <strong>có hệ thống</strong> — tăng doanh thu nhưng không đánh đổi lợi nhuận.
      </>
    ),
  },
  {
    title: "Tầm nhìn",
    body: (
      <>
        Xây dựng nguồn kiến thức <strong>thực chiến</strong> về TikTok Shop, KOC và livestream mà ai cũng có thể học và áp dụng.
      </>
    ),
  },
  {
    title: "Sứ mệnh",
    body: (
      <>
        Đóng gói kinh nghiệm từ dự án thật thành <strong>khóa học, tài liệu và quy trình</strong> — để bạn đi nhanh hơn, ít sai hơn.
      </>
    ),
  },
];

const work: { icon: IconName; title: string; desc: string }[] = [
  { icon: "store", title: "Vận hành TikTok Shop & Shopee", desc: "Tối ưu sản phẩm, giá, chương trình và vận hành gian hàng để tăng trưởng bền vững." },
  { icon: "users", title: "Quản lý KOC/KOL", desc: "Xây dựng mạng lưới, booking và đo lường hiệu quả hợp tác Brand – KOC – Agency." },
  { icon: "live", title: "Vận hành livestream", desc: "Kịch bản nội dung, chương trình ưu đãi, kỹ thuật và báo cáo sau mỗi phiên live." },
  { icon: "grad", title: "Đào tạo & coaching", desc: "Đào tạo đội ngũ inhouse về vận hành sàn, livestream và nội dung bán hàng." },
];

export default function VeToiPage() {
  const instructor = getInstructorInfo();
  const { about, stats } = getHomeSettings();
  const achievements = instructor?.achievements.length ? instructor.achievements : about.checks;

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white to-soft pb-24 pt-14 max-md:pb-16 sm:pt-20">
        <div className="container-x grid items-center gap-14 md:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="eyebrow reveal mb-[22px]">About me</p>
            <h1 className="reveal mb-6 text-[clamp(2.3rem,6vw,4.4rem)] font-medium uppercase leading-[1.02] tracking-[-0.045em]">
              Lê Viết Hưng
              <span className="block bg-gradient-to-r from-cyan-ink via-cyan-2 to-cyan bg-clip-text font-bold text-transparent">
                Founder SMUFT
              </span>
            </h1>
            <p className="reveal mb-8 max-w-[540px] text-[1.05rem] sm:text-[1.12rem]">
              {instructor?.bio ||
                "Hơn 8 năm kinh nghiệm thương mại điện tử, từ Seller đến Enabler. Founder SMUFT Agency."}
            </p>
            <div className="reveal flex flex-wrap gap-3.5">
              <a href={site.zalo.url} target="_blank" rel="noopener noreferrer" className="btn btn-dark">
                <Icon name="chat" className="h-[18px] w-[18px]" strokeWidth={2} /> Chat Zalo
              </a>
              <a href={site.smuft} target="_blank" rel="noopener" className="btn btn-outline">
                SMUFT Agency <Icon name="arrow-right" className="h-4 w-4" strokeWidth={2} />
              </a>
            </div>
          </div>
          <div className="reveal relative mx-auto w-full max-w-[480px]">
            <div className="aspect-[4/4.6] overflow-hidden rounded-[28px] bg-[#dfe7ee] shadow-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={instructor?.avatar ?? site.portrait}
                alt="Lê Viết Hưng"
                width={1000}
                height={1500}
                fetchPriority="high"
                className="h-full w-full object-cover object-[center_18%]"
              />
            </div>
            {about.quote && (
              <blockquote className="absolute -bottom-8 left-3 right-3 rounded-card bg-ink p-5 text-[0.92rem] italic leading-relaxed text-[#d5d9df] shadow-float sm:-left-8 sm:right-10">
                <span className="mb-1 block text-[2rem] font-bold not-italic leading-none text-cyan">“</span>
                {about.quote}
              </blockquote>
            )}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="section">
        <div className="container-x grid gap-14 md:grid-cols-[1fr_1.1fr]">
          <div>
            <SectionHead kicker="My story" title="Hành trình" accent="của tôi" />
            <div className="reveal space-y-4 text-[1.02rem]">
              <p>
                Hơn 8 năm trong thương mại điện tử, tôi đi từ vai trò <strong>Seller</strong> — trực tiếp bán hàng — đến vai trò <strong>Enabler</strong>: giúp các thương hiệu khác bán hàng hiệu quả trên Shopee và TikTok Shop.
              </p>
              <p>
                Cùng đội ngũ <strong>SMUFT Agency</strong>, tôi đã đồng hành với hơn 30 doanh nghiệp: tư vấn chiến lược, vận hành gian hàng, booking KOL/KOC và livestream bán hàng.
              </p>
              <p>
                Trang này là nơi tôi đóng gói lại những gì đã kiểm chứng — thành bài viết, tài liệu và khóa học — để bạn áp dụng ngay, không phải tự mò mẫm.
              </p>
            </div>
          </div>
          <div className="reveal self-start rounded-card bg-soft p-7 sm:p-9">
            <p className="mb-5 text-[0.78rem] font-bold uppercase tracking-[0.18em] text-muted">Dấu ấn</p>
            <ul className="grid gap-3.5">
              {achievements.map((a) => (
                <li key={a} className="flex gap-3 text-[0.97rem] leading-[1.55]">
                  <Icon name="check" className="mt-0.5 h-5 w-5 flex-none text-cyan-ink" strokeWidth={2.4} />
                  <span className="text-ink">{a}</span>
                </li>
              ))}
            </ul>
            {stats.items.length > 0 && (
              <div className="mt-7 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-line pt-6">
                {stats.items.slice(0, 4).map((s) => (
                  <div key={s.label}>
                    <div className="whitespace-nowrap text-[1.9rem] font-bold leading-none tracking-[-0.04em] text-cyan-ink">
                      {s.prefix}<CountUp value={s.value} />{s.suffix}
                    </div>
                    <p className="mt-1.5 text-[0.82rem] leading-snug text-muted">{s.label}</p>
                  </div>
                ))}
              </div>
            )}
            <p className="mt-5 text-[0.8rem] text-muted">Số liệu từ các dự án SMUFT Agency.</p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="section bg-soft">
        <div className="container-x">
          <SectionHead kicker="Why" title="Điều tôi" accent="theo đuổi" />
          <div className="grid gap-10 md:grid-cols-3">
            {pillars.map((p) => (
              <article key={p.title} className="reveal">
                <h3 className="mb-3.5 flex items-center gap-3 text-[1.3rem] font-semibold text-cyan-deep">
                  <Icon name="arrow" className="h-[34px] w-[34px] flex-none text-navy" />
                  {p.title}
                </h3>
                <p>{p.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* What I do */}
      <section className="section">
        <div className="container-x">
          <SectionHead kicker="What I do" title="Tôi" accent="làm gì" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {work.map((w) => (
              <article key={w.title} className="card card-hover reveal p-7">
                <span className="icon-tile mb-4"><Icon name={w.icon} className="h-6 w-6" /></span>
                <h3 className="mb-2 text-[1.1rem] font-bold text-navy">{w.title}</h3>
                <p className="text-[0.93rem]">{w.desc}</p>
              </article>
            ))}
          </div>
          <div className="mt-12 flex flex-wrap gap-3.5">
            <Link href="/khoa-hoc" className="btn btn-dark">Xem khóa học</Link>
            <Link href="/tai-nguyen" className="btn btn-outline">Tài nguyên miễn phí</Link>
          </div>
        </div>
      </section>

      <section className="section pt-0" aria-label="Tài liệu miễn phí">
        <div className="container-x">
          <PlaybookCta />
        </div>
      </section>

      <ContactSection />
    </>
  );
}
