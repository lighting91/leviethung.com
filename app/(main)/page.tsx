import Link from "next/link";
import {
  getAllCourses,
  getAllPosts,
  getHomeSettings,
  getPlatformIcon,
  getTestimonialsByTag,
} from "@/lib/content";
import { site } from "@/lib/site";
import Icon, { type IconName } from "@/components/ui/Icon";
import SectionHead from "@/components/ui/SectionHead";
import CountUp from "@/components/ui/CountUp";
import CourseCard from "@/components/ui/CourseCard";
import CurriculumPreview from "@/components/ui/CurriculumPreview";
import PostCard from "@/components/ui/PostCard";
import TestimonialCard from "@/components/ui/TestimonialCard";
import PlaybookCta from "@/components/ui/PlaybookCta";
import ContactSection from "@/components/ui/ContactSection";

const services: { icon: IconName; title: string; desc: string; items: string[]; href: string; label: string; external?: boolean }[] = [
  {
    icon: "grad",
    title: "Khóa học thực chiến",
    desc: "Chương trình học có lộ trình, học tuần tự từng bài, áp dụng được ngay vào kênh và gian hàng của bạn.",
    items: ["Lộ trình từ nền tảng đến tăng trưởng", "Học thử miễn phí trước khi đăng ký", "Học trọn đời, xem lại bất kỳ lúc nào"],
    href: "/khoa-hoc",
    label: "Xem khóa học",
  },
  {
    icon: "download",
    title: "Tài nguyên miễn phí",
    desc: "Playbook, template và checklist đúc kết từ các dự án thật — tải về là dùng được.",
    items: ["TikTok Cosmetic One-Shot Playbook", "Template & checklist vận hành", "Cập nhật thường xuyên"],
    href: "/tai-nguyen",
    label: "Xem tài nguyên",
  },
  {
    icon: "store",
    title: "Tư vấn & vận hành cùng SMUFT",
    desc: "Doanh nghiệp cần người làm cùng: đội ngũ SMUFT Agency triển khai trọn gói từ chiến lược đến vận hành.",
    items: ["Vận hành Shopee & TikTok Shop", "Booking KOL/KOC, vận hành livestream", "Đào tạo nhân sự inhouse"],
    href: site.smuft,
    label: "Tìm hiểu SMUFT",
    external: true,
  },
];

function StatValue({ prefix, value, suffix }: { prefix?: string; value: number; suffix?: string }) {
  return (
    <>
      {prefix}
      <CountUp value={value} />
      {suffix}
    </>
  );
}

function PlatformTag({ platform }: { platform: string }) {
  const icon = getPlatformIcon(platform);
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white py-[7px] pl-2 pr-3.5 text-[0.88rem] font-semibold text-ink">
      {icon ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={icon} alt="" width={26} height={26} className="h-[26px] w-[26px] object-contain" />
      ) : (
        <Icon name="store" className="h-5 w-5 text-cyan-ink" />
      )}
      {platform}
    </span>
  );
}

export default function HomePage() {
  const home = getHomeSettings();
  const courses = getAllCourses();
  const posts = getAllPosts().slice(0, 3);
  const testimonials = getTestimonialsByTag("home");
  const { hero, stats, about, cases, partners } = home;
  const heroImage = hero.image ?? site.portrait;

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    url: site.url,
    image: `${site.url}${heroImage}`,
    jobTitle: "Founder",
    worksFor: { "@type": "Organization", name: "SMUFT Agency", url: site.smuft },
    sameAs: [site.facebook, site.tiktok],
    email: site.email,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />

      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white to-soft pb-24 pt-16 max-md:pb-[72px] max-md:pt-10">
        <div
          aria-hidden="true"
          className="absolute inset-y-0 left-[max(24px,calc((100vw-1180px)/2+24px))] hidden w-px bg-line md:block"
        />
        <div className="container-x grid items-center gap-14 md:grid-cols-[1.05fr_0.95fr]">
          <div className="relative md:pl-[26px]">
            <p className="eyebrow reveal mb-[22px]">{hero.eyebrow}</p>
            <h1 className="reveal mb-[26px] text-[clamp(2.3rem,11vw,3rem)] font-medium uppercase leading-[1.02] tracking-[-0.045em] sm:text-[clamp(2.7rem,6.2vw,5rem)]">
              {hero.title}
              <span className="block bg-gradient-to-r from-cyan-ink via-cyan-2 to-cyan bg-clip-text font-bold text-transparent">
                {hero.title_accent}
              </span>
            </h1>
            <p className="reveal mb-[34px] max-w-[540px] text-[1.02rem] sm:text-[1.12rem]">{hero.subtitle}</p>
            <div className="reveal mb-10 flex flex-wrap gap-3.5">
              <a href={site.playbook} download className="btn btn-dark max-sm:flex-auto">
                <Icon name="download" className="h-[18px] w-[18px]" strokeWidth={2} />
                Tải Playbook miễn phí
              </a>
              <Link href="/khoa-hoc" className="btn btn-outline max-sm:flex-auto">
                Xem khóa học
              </Link>
            </div>
            <div className="reveal flex flex-wrap items-center gap-x-[18px] gap-y-3 text-[0.88rem] text-muted">
              <span>Vận hành thực chiến trên</span>
              <PlatformTag platform="TikTok Shop" />
              <PlatformTag platform="Shopee" />
            </div>
          </div>

          <div className="reveal relative mx-auto w-full max-w-[560px] md:max-w-none">
            <div className="aspect-[4/4.4] overflow-hidden rounded-[28px] bg-[#dfe7ee] shadow-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={heroImage}
                alt="Lê Viết Hưng — Founder SMUFT Agency"
                width={1000}
                height={1500}
                fetchPriority="high"
                className="h-full w-full object-cover object-[center_18%]"
              />
            </div>
            {hero.float_cards[0] && (
              <div className="absolute bottom-4 left-3 max-w-[180px] rounded-card bg-white px-4 py-3 shadow-float sm:max-w-[230px] sm:px-[22px] sm:py-[18px] md:-left-9 md:bottom-14">
                <strong className="block text-[1.5rem] font-bold leading-[1.1] tracking-[-0.03em] text-cyan-ink sm:text-[2rem]">
                  {hero.float_cards[0].value}
                </strong>
                <span className="mt-1 block text-[0.78rem] leading-[1.45] sm:text-[0.86rem]">{hero.float_cards[0].label}</span>
              </div>
            )}
            {hero.float_cards[1] && (
              <div className="absolute right-3 top-4 max-w-[180px] rounded-card bg-ink px-4 py-3 shadow-float sm:max-w-[230px] sm:px-[22px] sm:py-[18px] md:-right-5 md:top-10">
                <strong className="block text-[1.5rem] font-bold leading-[1.1] tracking-[-0.03em] text-cyan sm:text-[2rem]">
                  {hero.float_cards[1].value}
                </strong>
                <span className="mt-1 block text-[0.78rem] leading-[1.45] text-[#d5d9df] sm:text-[0.86rem]">{hero.float_cards[1].label}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ============ STATS ============ */}
      {stats.items.length > 0 && (
        <section className="section" id="con-so">
          <div className="container-x">
            <SectionHead kicker="What we achieved" title="Con số" accent="ấn tượng" />
            <div className="grid items-stretch gap-14 md:grid-cols-2">
              {stats.highlight && (
                <div className="on-dark reveal relative flex min-h-[340px] flex-col justify-end overflow-hidden rounded-card bg-ink p-7 md:min-h-[420px] md:p-9">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)] bg-[size:44px_44px]"
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(54,209,214,.35),transparent_65%)]"
                  />
                  <p className="relative mb-auto text-[0.82rem] font-semibold uppercase tracking-[0.16em] text-[#a3acb9]">
                    SMUFT Agency
                  </p>
                  <div className="relative">
                    <div className="text-[clamp(4rem,10vw,6.5rem)] font-bold leading-none tracking-[-0.05em] text-cyan">
                      <StatValue {...stats.highlight} />
                    </div>
                    <p className="mt-3 max-w-[320px] text-[1.05rem] font-medium leading-snug text-white">{stats.highlight.label}</p>
                  </div>
                </div>
              )}
              <div>
                <p className="reveal mb-[18px] text-[1.08rem]">{stats.intro}</p>
                {stats.items.map((s) => (
                  <div
                    key={s.label}
                    className="reveal grid items-center gap-1.5 border-t border-line py-[18px] last:border-b sm:grid-cols-[170px_1fr] sm:gap-5 sm:py-[22px]"
                  >
                    <div className="whitespace-nowrap text-[2.2rem] font-bold leading-none tracking-[-0.04em] text-cyan-ink sm:text-[2.6rem]">
                      <StatValue {...s} />
                    </div>
                    <p className="text-[0.98rem]">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ============ ABOUT ============ */}
      <section className="section bg-soft" id="ve-hung">
        <div className="container-x">
          <SectionHead kicker="Who I am" title="Về" accent="Lê Viết Hưng" />
          <article className="reveal grid overflow-hidden rounded-card bg-white md:grid-cols-[0.85fr_1.15fr]">
            <div className="aspect-[4/3.2] bg-gradient-to-b from-[#e9ebee] to-[#cfd4da] md:aspect-auto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={about.image ?? site.portrait}
                alt="Lê Viết Hưng"
                className="h-full w-full object-cover object-top"
                loading="lazy"
              />
            </div>
            <div className="p-6 sm:p-8 lg:p-10">
              <p className="text-[0.78rem] font-bold uppercase tracking-[0.18em] text-muted">{about.role}</p>
              <h3 className="mb-2.5 mt-1 text-[1.65rem] font-bold tracking-[-0.02em] text-cyan-ink">Mr. Lê Viết Hưng</h3>
              <p className="mb-4 text-[0.95rem]">{about.intro}</p>
              <ul className="mb-5 grid gap-2.5">
                {about.checks.map((c) => (
                  <li key={c} className="flex gap-2.5 text-[0.92rem] leading-[1.55]">
                    <Icon name="check" className="mt-0.5 h-5 w-5 flex-none text-cyan-ink" strokeWidth={2.4} />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
              {about.quote && (
                <blockquote className="mb-6 border-l-[3px] border-cyan py-0.5 pl-4 text-[0.92rem] italic text-ink">
                  “{about.quote}”
                </blockquote>
              )}
              <div className="flex flex-wrap gap-3">
                <Link href="/ve-toi" className="btn btn-dark btn-sm">Đọc thêm về tôi</Link>
                <a href={site.smuft} target="_blank" rel="noopener" className="btn btn-outline btn-sm">
                  SMUFT Agency <Icon name="arrow-right" className="h-4 w-4" strokeWidth={2} />
                </a>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* ============ SERVICES ============ */}
      <section className="section" id="dich-vu">
        <div className="container-x">
          <SectionHead kicker="What I do" title="Tôi có thể" accent="giúp gì cho bạn" />
          <div className="grid gap-6 md:grid-cols-3">
            {services.map((s) => {
              const body = (
                <>
                  <div className="mb-3.5 flex items-center gap-3.5">
                    <span className="icon-tile"><Icon name={s.icon} className="h-6 w-6" /></span>
                    <h3 className="text-[1.18rem] font-bold text-navy">{s.title}</h3>
                  </div>
                  <p className="mb-[18px] text-[0.95rem]">{s.desc}</p>
                  <ul className="dot-list mb-6 border-t border-dashed border-line pt-[18px]">
                    {s.items.map((i) => <li key={i}>{i}</li>)}
                  </ul>
                  <span className="mt-auto inline-flex items-center gap-1.5 text-[0.92rem] font-semibold text-ink">
                    {s.label}
                    <Icon name="arrow-right" className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={2} />
                  </span>
                </>
              );
              const cls = "card card-hover reveal group flex flex-col p-7";
              return s.external ? (
                <a key={s.title} href={s.href} target="_blank" rel="noopener" className={cls}>{body}</a>
              ) : (
                <Link key={s.title} href={s.href} className={cls}>{body}</Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ COURSES ============ */}
      {courses.length > 0 && (
        <section className="section bg-soft" id="khoa-hoc">
          <div className="container-x">
            <div className="mb-[52px] flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <SectionHead kicker="Courses" title="Khóa học" accent="nổi bật" className="!mb-0" />
              <Link href="/khoa-hoc" className="btn btn-outline btn-sm reveal self-start md:self-auto">
                Tất cả khóa học <Icon name="arrow-right" className="h-4 w-4" strokeWidth={2} />
              </Link>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {courses.slice(0, 4).map((c) => <CourseCard key={c.slug} course={c} />)}
              {courses.length === 1 && <CurriculumPreview course={courses[0]} />}
            </div>
          </div>
        </section>
      )}

      {/* ============ CASE STUDIES ============ */}
      {cases.length > 0 && (
        <section className="section" id="case-study">
          <div className="container-x">
            <SectionHead
              kicker="What we achieved"
              accent="Case study"
              lead="Một số dự án tiêu biểu SMUFT Agency đã triển khai cho khách hàng trên Shopee và TikTok Shop."
            />
            <div className="grid gap-7 lg:grid-cols-2">
              {cases.map((c) => {
                const icon = getPlatformIcon(c.platform);
                return (
                  <article
                    key={c.name}
                    className={`reveal grid items-start gap-7 rounded-card bg-soft p-6 sm:p-7 ${c.image ? "sm:grid-cols-[140px_1fr] xl:grid-cols-[170px_1fr]" : ""}`}
                  >
                    {c.image && (
                      <div className="phone mx-auto w-full max-w-[180px]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={c.image} alt={`${c.name} trên ${c.platform}`} width={468} height={1013} loading="lazy" />
                      </div>
                    )}
                    <div>
                      <div className="mb-2.5 flex items-center gap-2.5">
                        {icon ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={icon} alt={c.platform} width={30} height={30} className="h-[30px] w-[30px] object-contain" />
                        ) : (
                          <span className="chip">{c.platform}</span>
                        )}
                        <h3 className="text-[1.35rem] font-bold text-navy">{c.name}</h3>
                      </div>
                      {c.handle && (
                        <p className="-mt-1.5 mb-2.5 text-[0.88rem] text-muted">
                          {c.handle_url ? (
                            <a href={c.handle_url} target="_blank" rel="noopener noreferrer" className="font-semibold text-cyan-deep hover:underline">{c.handle}</a>
                          ) : (
                            c.handle
                          )}{" "}
                          · {c.platform} Creator
                        </p>
                      )}
                      <p className="mb-[18px] text-[0.95rem]">{c.summary}</p>
                      <dl className="grid grid-cols-[repeat(auto-fit,minmax(128px,1fr))] gap-x-[18px] gap-y-4">
                        {c.metrics.map((m) => (
                          <div key={m.label}>
                            <dt className="whitespace-nowrap text-[1.38rem] font-bold leading-[1.15] tracking-[-0.02em] text-cyan-ink">{m.value}</dt>
                            <dd className="mt-[3px] text-[0.82rem] leading-[1.4] text-muted">{m.label}</dd>
                          </div>
                        ))}
                      </dl>
                      {c.kols.length > 0 && (
                        <>
                          <p className="mb-3 mt-[22px] text-[0.95rem] font-bold text-navy">Mở rộng mạng lưới KOL</p>
                          <ul className="grid grid-cols-2 gap-3">
                            {c.kols.map((k) => (
                              <li key={k.name} className="flex items-center gap-2.5 text-[0.78rem] leading-[1.35] text-muted">
                                {k.avatar ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img src={k.avatar} alt="" width={42} height={42} className="h-[42px] w-[42px] flex-none rounded-full object-cover" loading="lazy" />
                                ) : (
                                  <span className="grid h-[42px] w-[42px] flex-none place-items-center rounded-full bg-ink text-xs font-bold text-cyan">{k.name[0]}</span>
                                )}
                                <span>
                                  <strong className="block text-[0.85rem] text-ink">{k.name}</strong>
                                  {k.handle}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
            <p className="reveal mt-[22px] text-[0.85rem] text-muted">
              *CIR (Cost to Income Ratio) = Tổng chi phí hoạt động / Tổng doanh thu. Số liệu do SMUFT Agency thực hiện cho khách hàng.
            </p>
          </div>
        </section>
      )}

      {/* ============ PARTNERS ============ */}
      {partners.length > 0 && (
        <section className="section bg-soft" id="doi-tac">
          <div className="container-x">
            <div className="mb-11 grid items-end gap-10 md:grid-cols-2">
              <SectionHead kicker="What we achieved" title="Thương hiệu" accent="đã đồng hành" className="!mb-0" />
              <p className="reveal text-[1.02rem]">
                Những thương hiệu trong và ngoài nước đã tin tưởng chọn SMUFT Agency làm đối tác chiến lược trong lĩnh vực thương mại điện tử và tiếp thị số.
              </p>
            </div>
            <div className="reveal grid grid-cols-3 gap-2.5 sm:grid-cols-5 sm:gap-[18px] max-sm:[&>*:nth-child(10):last-child]:col-start-2">
              {partners.map((p) => {
                const tile = p.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.logo} alt={p.name} width={180} height={180} className="aspect-square w-full object-cover" loading="lazy" />
                ) : (
                  <span className="grid h-24 place-items-center p-3 text-center text-[0.95rem] font-bold leading-tight text-navy sm:h-28">{p.name}</span>
                );
                const cls = "block overflow-hidden rounded-card-sm bg-white shadow-[0_1px_0_var(--color-line)] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-card";
                return p.url ? (
                  <a key={p.name} href={p.url} target="_blank" rel="noopener nofollow" title={p.name} className={cls}>{tile}</a>
                ) : (
                  <span key={p.name} className={cls}>{tile}</span>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ============ TESTIMONIALS ============ */}
      {testimonials.length > 0 && (
        <section className="section" id="feedback">
          <div className="container-x">
            <SectionHead kicker="Feedback" title="Đối tác nói gì" accent="về Hưng" />
            <div className="columns-1 gap-6 md:columns-2 lg:columns-3">
              {testimonials.map((t) => <TestimonialCard key={t.slug} t={t} />)}
            </div>
          </div>
        </section>
      )}

      {/* ============ PLAYBOOK ============ */}
      <section className="section pt-0" aria-label="Tài liệu miễn phí">
        <div className="container-x">
          <PlaybookCta />
        </div>
      </section>

      {/* ============ BLOG ============ */}
      {posts.length > 0 && (
        <section className="section bg-soft" id="blog">
          <div className="container-x">
            <div className="mb-[52px] flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <SectionHead kicker="Insights" title="Bài viết" accent="mới nhất" className="!mb-0" />
              <Link href="/blog" className="btn btn-outline btn-sm reveal self-start md:self-auto">
                Xem tất cả <Icon name="arrow-right" className="h-4 w-4" strokeWidth={2} />
              </Link>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((p) => <PostCard key={p.slug} post={p} />)}
            </div>
          </div>
        </section>
      )}

      <ContactSection />
    </>
  );
}
