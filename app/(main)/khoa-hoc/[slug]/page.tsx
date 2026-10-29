import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllCourses, getCourseBySlug, getInstructorInfo } from "@/lib/content";
import { createClient } from "@/lib/supabase/server";
import Icon from "@/components/ui/Icon";
import SectionHead from "@/components/ui/SectionHead";
import CourseCard, { formatPrice } from "@/components/ui/CourseCard";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllCourses().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const course = getCourseBySlug(slug);
  if (!course) return {};
  return { title: course.title, description: course.description };
}

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params;
  const course = getCourseBySlug(slug);
  if (!course) notFound();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let isEnrolled = false;
  if (user) {
    const { data } = await supabase
      .from("enrollments")
      .select("id")
      .eq("user_id", user.id)
      .eq("course_slug", slug)
      .eq("status", "active")
      .single();
    isEnrolled = !!data;
  }

  const instructor = getInstructorInfo();
  const allCourses = getAllCourses();
  const relatedCourses = course.related_courses?.length
    ? allCourses.filter((c) => course.related_courses!.includes(c.slug))
    : allCourses.filter((c) => c.slug !== slug).slice(0, 3);

  const totalLessons = course.modules?.reduce((sum, m) => sum + (m.lessons?.length ?? 0), 0) ?? 0;
  const firstLesson = course.modules?.[0]?.lessons?.[0]?.slug ?? "gioi-thieu";
  const firstFreeLesson = course.modules
    ?.flatMap((m) => m.lessons ?? [])
    .find((l) => l.free_preview);
  const savings = course.original_price && course.price ? course.original_price - course.price : 0;

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="on-dark relative overflow-hidden bg-ink">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.04)_1px,transparent_1px)] bg-[size:44px_44px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(54,209,214,.28),transparent_65%)]"
        />
        <div className="container-x relative py-16 lg:py-24">
          <div className="max-w-3xl">
            <Link href="/khoa-hoc" className="mb-6 inline-flex items-center gap-1.5 text-[0.88rem] font-semibold text-[#a3acb9] hover:text-cyan">
              <Icon name="chevron-left" className="h-4 w-4" strokeWidth={2} /> Tất cả khóa học
            </Link>
            <div className="mb-5 flex flex-wrap items-center gap-2.5 text-[0.85rem] text-[#a3acb9]">
              <span className="chip chip-dark">{course.level}</span>
              {course.duration && (
                <span className="inline-flex items-center gap-1.5"><Icon name="clock" className="h-4 w-4" />{course.duration}</span>
              )}
              {totalLessons > 0 && (
                <span className="inline-flex items-center gap-1.5"><Icon name="play" className="h-4 w-4" />{totalLessons} bài học</span>
              )}
            </div>
            <h1 className="mb-5 text-[clamp(2.1rem,5vw,3.6rem)] font-bold leading-[1.08] tracking-[-0.035em]">{course.title}</h1>
            <p className="mb-9 text-[1.08rem] leading-relaxed">{course.description}</p>

            <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
              <div className="leading-tight">
                {course.original_price && (
                  <p className="text-sm text-[#8b95a3] line-through">{formatPrice(course.original_price)}</p>
                )}
                <p className="text-[2.2rem] font-bold tracking-[-0.03em] text-cyan">
                  {course.price ? formatPrice(course.price) : "Liên hệ"}
                </p>
                {savings > 0 && <p className="mt-1 text-[0.82rem] text-[#a3acb9]">Tiết kiệm {formatPrice(savings)}</p>}
              </div>

              {isEnrolled ? (
                <Link href={`/khoa-hoc/${slug}/hoc/${firstLesson}`} className="btn btn-accent px-8 text-base">
                  Tiếp tục học <Icon name="arrow-right" className="h-[18px] w-[18px]" strokeWidth={2} />
                </Link>
              ) : (
                <div className="flex flex-wrap items-center gap-3">
                  <Link href={`/khoa-hoc/${slug}/thanh-toan`} className="btn btn-accent px-8 text-base">
                    {course.cta_text ?? "Đăng ký ngay"}
                  </Link>
                  {firstFreeLesson && (
                    <Link href={`/khoa-hoc/${slug}/hoc/${firstFreeLesson.slug}`} className="btn btn-ghost-light">
                      <Icon name="play" className="h-[18px] w-[18px]" strokeWidth={2} /> Học thử miễn phí
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="container-x py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-3">
          {/* Main content */}
          <div className="space-y-16 lg:col-span-2">
            {/* Pain points */}
            {course.pain_points && course.pain_points.length > 0 && (
              <section>
                <SectionHead kicker="Problems we solve" title="Khóa học" accent="giải quyết" className="sm" />
                <ul className="grid gap-4 sm:grid-cols-2">
                  {course.pain_points.map((p, i) => (
                    <li key={i} className="reveal flex items-start gap-3 rounded-card-sm bg-soft p-5 text-[0.95rem] leading-[1.55] text-ink">
                      <Icon name="check" className="mt-0.5 h-5 w-5 flex-none text-cyan-ink" strokeWidth={2.4} />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Curriculum */}
            {course.modules && course.modules.length > 0 && (
              <section>
                <SectionHead
                  kicker="Curriculum"
                  title="Nội dung"
                  accent="khóa học"
                  lead={`${course.modules.length} module · ${totalLessons} bài học`}
                  className="sm"
                />
                <div className="space-y-4">
                  {course.modules.map((mod, mi) => (
                    <div key={mi} className="card reveal overflow-hidden">
                      <div className="flex items-center justify-between gap-4 bg-soft px-5 py-4">
                        <h3 className="flex items-center gap-3 text-[0.98rem] font-bold text-navy">
                          <span className="grid h-7 w-7 flex-none place-items-center rounded-full bg-ink text-[0.75rem] text-cyan">{mi + 1}</span>
                          {mod.title}
                        </h3>
                        <span className="flex-none text-[0.82rem] text-muted">{mod.lessons?.length ?? 0} bài</span>
                      </div>
                      <ul className="divide-y divide-line">
                        {mod.lessons?.map((lesson) => {
                          const inner = (
                            <>
                              <Icon
                                name={lesson.free_preview ? "play" : "lock"}
                                className={`h-[18px] w-[18px] flex-none ${lesson.free_preview ? "text-cyan-ink" : "text-[#b8bec7]"}`}
                              />
                              <span className="flex-1 text-[0.93rem] leading-snug">{lesson.title}</span>
                              <span className="flex flex-none items-center gap-2.5">
                                {lesson.free_preview && <span className="chip">Xem thử</span>}
                                {lesson.duration && <span className="text-[0.8rem] text-muted">{lesson.duration}</span>}
                              </span>
                            </>
                          );

                          return lesson.free_preview ? (
                            <li key={lesson.slug}>
                              <Link
                                href={`/khoa-hoc/${slug}/hoc/${lesson.slug}`}
                                className="flex items-center gap-3 px-5 py-3.5 text-ink transition-colors hover:bg-cyan/10"
                              >
                                {inner}
                              </Link>
                            </li>
                          ) : (
                            <li key={lesson.slug} className="flex items-center gap-3 px-5 py-3.5 text-body">
                              {inner}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Bonuses */}
            {course.bonuses && course.bonuses.length > 0 && (
              <section>
                <SectionHead kicker="Bonus" title="Quà tặng" accent="kèm theo" className="sm" />
                <div className="space-y-3">
                  {course.bonuses.map((bonus, i) => (
                    <div key={i} className="card reveal flex items-start gap-4 p-5">
                      <span className="icon-tile"><Icon name="gift" className="h-6 w-6" /></span>
                      <div className="flex-1">
                        <h3 className="font-bold text-navy">{bonus.title}</h3>
                        {bonus.description && <p className="mt-0.5 text-[0.92rem]">{bonus.description}</p>}
                      </div>
                      {bonus.value && (
                        <span className="flex-none text-[0.95rem] font-bold text-cyan-deep">{formatPrice(bonus.value)}</span>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Instructor */}
            {instructor && (
              <section>
                <SectionHead kicker="Instructor" title="Giảng" accent="viên" className="sm" />
                <div className="reveal grid overflow-hidden rounded-card bg-soft sm:grid-cols-[200px_1fr]">
                  {instructor.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={instructor.avatar} alt={instructor.name} className="h-64 w-full object-cover object-top sm:h-full" />
                  ) : (
                    <div className="grid h-40 place-items-center bg-ink text-4xl font-bold text-cyan sm:h-full">{instructor.name[0]}</div>
                  )}
                  <div className="p-6 sm:p-7">
                    <p className="text-[0.78rem] font-bold uppercase tracking-[0.18em] text-muted">{instructor.title}</p>
                    <h3 className="mb-2 mt-1 text-[1.5rem] font-bold tracking-[-0.02em] text-cyan-ink">{instructor.name}</h3>
                    <p className="mb-4 text-[0.95rem]">{instructor.bio}</p>
                    {instructor.achievements.length > 0 && (
                      <ul className="mb-5 grid gap-2">
                        {instructor.achievements.map((a) => (
                          <li key={a} className="flex gap-2.5 text-[0.9rem] leading-[1.5]">
                            <Icon name="check" className="mt-0.5 h-[18px] w-[18px] flex-none text-cyan-ink" strokeWidth={2.4} />
                            <span>{a}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    <Link href="/ve-toi" className="inline-flex items-center gap-1.5 text-[0.9rem] font-semibold text-ink hover:text-cyan-deep">
                      Tìm hiểu thêm <Icon name="arrow-right" className="h-4 w-4" strokeWidth={2} />
                    </Link>
                  </div>
                </div>
              </section>
            )}

            {/* FAQ */}
            {course.faq && course.faq.length > 0 && (
              <section>
                <SectionHead kicker="FAQ" title="Câu hỏi" accent="thường gặp" className="sm" />
                <div className="space-y-3">
                  {course.faq.map((item, i) => (
                    <details key={i} className="card reveal group p-0 [&_summary::-webkit-details-marker]:hidden">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 font-semibold text-ink">
                        {item.question}
                        <Icon name="chevron-down" className="h-5 w-5 flex-none text-cyan-ink transition-transform group-open:rotate-180" strokeWidth={2} />
                      </summary>
                      <p className="px-6 pb-5 text-[0.95rem] leading-relaxed">{item.answer}</p>
                    </details>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-[calc(var(--nav-h)+24px)]">
              <div className="card p-6 shadow-card sm:p-7">
                {course.original_price && (
                  <p className="mb-1 text-sm text-muted line-through">{formatPrice(course.original_price)}</p>
                )}
                <p className="mb-1 text-[2rem] font-bold tracking-[-0.03em] text-cyan-ink">
                  {course.price ? formatPrice(course.price) : "Liên hệ"}
                </p>
                {savings > 0 && <p className="mb-5 text-sm font-medium text-navy">Tiết kiệm {formatPrice(savings)}</p>}

                {isEnrolled ? (
                  <Link href={`/khoa-hoc/${slug}/hoc/${firstLesson}`} className="btn btn-dark btn-block">
                    Tiếp tục học <Icon name="arrow-right" className="h-[18px] w-[18px]" strokeWidth={2} />
                  </Link>
                ) : (
                  <div className="space-y-2.5">
                    <Link href={`/khoa-hoc/${slug}/thanh-toan`} className="btn btn-dark btn-block">
                      {course.cta_text ?? "Đăng ký ngay"}
                    </Link>
                    {firstFreeLesson && (
                      <Link href={`/khoa-hoc/${slug}/hoc/${firstFreeLesson.slug}`} className="btn btn-outline btn-block">
                        <Icon name="play" className="h-[18px] w-[18px]" strokeWidth={2} /> Học thử miễn phí
                      </Link>
                    )}
                  </div>
                )}

                <ul className="mt-6 space-y-2.5 text-[0.92rem]">
                  {["Học trọn đời", "Bảo hành 30 ngày", "Chứng chỉ hoàn thành"].map((perk) => (
                    <li key={perk} className="flex items-center gap-2.5">
                      <Icon name="check" className="h-[18px] w-[18px] flex-none text-cyan-ink" strokeWidth={2.4} />
                      {perk}
                    </li>
                  ))}
                  {course.slots_remaining && (
                    <li className="flex items-center gap-2.5 font-semibold text-[#b42318]">
                      <Icon name="clock" className="h-[18px] w-[18px] flex-none" strokeWidth={2} />
                      Chỉ còn {course.slots_remaining} suất
                    </li>
                  )}
                </ul>

                {totalLessons > 0 && (
                  <dl className="mt-6 space-y-2.5 border-t border-line pt-5 text-[0.9rem]">
                    <div className="flex justify-between"><dt className="text-muted">Bài học</dt><dd className="font-semibold text-ink">{totalLessons} bài</dd></div>
                    <div className="flex justify-between"><dt className="text-muted">Cấp độ</dt><dd className="font-semibold text-ink">{course.level}</dd></div>
                    {course.duration && (
                      <div className="flex justify-between"><dt className="text-muted">Thời gian</dt><dd className="font-semibold text-ink">{course.duration}</dd></div>
                    )}
                    <div className="flex justify-between"><dt className="text-muted">Module</dt><dd className="font-semibold text-ink">{course.modules?.length ?? 0}</dd></div>
                  </dl>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Related courses */}
      {relatedCourses.length > 0 && (
        <section className="section bg-soft">
          <div className="container-x">
            <SectionHead kicker="Related" title="Khóa học" accent="liên quan" />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {relatedCourses.map((rc) => <CourseCard key={rc.slug} course={rc} />)}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
