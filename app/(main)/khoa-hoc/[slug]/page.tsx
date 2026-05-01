import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllCourses, getCourseBySlug, getInstructorInfo } from "@/lib/content";
import { createClient } from "@/lib/supabase/server";

interface Props {
  params: Promise<{ slug: string }>;
}

function formatPrice(n: number) {
  return n.toLocaleString("vi-VN") + "đ";
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

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-slate-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 lg:py-20">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs bg-orange-600/20 text-orange-400 px-2.5 py-1 rounded-full font-medium">
                {course.level}
              </span>
              {course.duration && (
                <span className="text-xs text-slate-400">{course.duration}</span>
              )}
              {totalLessons > 0 && (
                <span className="text-xs text-slate-400">• {totalLessons} bài học</span>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">{course.title}</h1>
            <p className="text-slate-300 text-lg mb-8">{course.description}</p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div>
                {course.original_price && (
                  <p className="text-slate-500 line-through text-sm">{formatPrice(course.original_price)}</p>
                )}
                <p className="text-3xl font-bold text-orange-400">
                  {course.price ? formatPrice(course.price) : "Liên hệ"}
                </p>
                {course.original_price && course.price && (
                  <p className="text-xs text-green-400 mt-0.5">
                    Tiết kiệm {formatPrice(course.original_price - course.price)}
                  </p>
                )}
              </div>

              {isEnrolled ? (
                <Link
                  href={`/khoa-hoc/${slug}/hoc/${firstLesson}`}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors"
                >
                  Tiếp tục học →
                </Link>
              ) : (
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href={`/khoa-hoc/${slug}/thanh-toan`}
                    className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors text-lg"
                  >
                    {course.cta_text ?? "Đăng ký ngay"} →
                  </Link>
                  {firstFreeLesson && (
                    <Link
                      href={`/khoa-hoc/${slug}/hoc/${firstFreeLesson.slug}`}
                      className="text-orange-300 hover:text-white border border-orange-500/40 hover:border-orange-400 font-medium px-6 py-3.5 rounded-xl transition-colors text-sm"
                    >
                      ▶ Học thử miễn phí
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-10">

            {/* Pain points */}
            {course.pain_points && course.pain_points.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-slate-900 mb-5">Khóa học này giải quyết:</h2>
                <ul className="space-y-3">
                  {course.pain_points.map((p, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-700">
                      <span className="text-orange-500 mt-0.5 flex-shrink-0 font-bold">✓</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Curriculum */}
            {course.modules && course.modules.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-slate-900 mb-5">
                  Nội dung khóa học
                  <span className="ml-2 text-sm font-normal text-slate-500">
                    ({course.modules.length} module · {totalLessons} bài học)
                  </span>
                </h2>
                <div className="space-y-3">
                  {course.modules.map((mod, mi) => (
                    <div key={mi} className="border border-slate-200 rounded-xl overflow-hidden">
                      <div className="bg-slate-50 px-5 py-3.5 flex items-center justify-between">
                        <h3 className="font-semibold text-slate-800 text-sm">{mod.title}</h3>
                        <span className="text-xs text-slate-500">{mod.lessons?.length ?? 0} bài</span>
                      </div>
                      <ul className="divide-y divide-slate-100">
                        {mod.lessons?.map((lesson) => {
                          const inner = (
                            <>
                              {lesson.free_preview ? (
                                <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M8 5v14l11-7z" />
                                </svg>
                              ) : (
                                <svg className="w-4 h-4 text-slate-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                              )}
                              <span className="text-sm flex-1 leading-snug">{lesson.title}</span>
                              <div className="flex items-center gap-2 flex-shrink-0">
                                {lesson.free_preview && (
                                  <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-medium">Xem thử</span>
                                )}
                                {lesson.duration && (
                                  <span className="text-xs text-slate-400">{lesson.duration}</span>
                                )}
                              </div>
                            </>
                          );

                          return lesson.free_preview ? (
                            <li key={lesson.slug}>
                              <Link
                                href={`/khoa-hoc/${slug}/hoc/${lesson.slug}`}
                                className="flex items-center gap-3 px-5 py-3 hover:bg-green-50 transition-colors group text-slate-700 hover:text-green-700"
                              >
                                {inner}
                              </Link>
                            </li>
                          ) : (
                            <li key={lesson.slug} className="flex items-center gap-3 px-5 py-3 text-slate-500">
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
                <h2 className="text-xl font-bold text-slate-900 mb-5">Bonus kèm theo</h2>
                <div className="space-y-3">
                  {course.bonuses.map((bonus, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 bg-orange-50 rounded-xl border border-orange-100">
                      <span className="text-2xl flex-shrink-0">🎁</span>
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900">{bonus.title}</h4>
                        {bonus.description && (
                          <p className="text-sm text-slate-600 mt-0.5">{bonus.description}</p>
                        )}
                      </div>
                      {bonus.value && (
                        <span className="text-sm font-semibold text-orange-600 flex-shrink-0">
                          {bonus.value.toLocaleString("vi-VN")}đ
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Instructor */}
            {instructor && (
              <section>
                <h2 className="text-xl font-bold text-slate-900 mb-5">Giảng viên</h2>
                <div className="flex items-start gap-5 p-5 bg-slate-50 rounded-xl">
                  {instructor.avatar ? (
                    <img src={instructor.avatar} alt={instructor.name} className="w-16 h-16 rounded-full object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl font-bold text-orange-600">{instructor.name[0]}</span>
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-slate-900">{instructor.name}</h3>
                    <p className="text-sm text-orange-600 mb-2">{instructor.title}</p>
                    <p className="text-sm text-slate-600 leading-relaxed">{instructor.bio}</p>
                  </div>
                </div>
              </section>
            )}

            {/* FAQ */}
            {course.faq && course.faq.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-slate-900 mb-5">Câu hỏi thường gặp</h2>
                <div className="space-y-3">
                  {course.faq.map((item, i) => (
                    <div key={i} className="border border-slate-200 rounded-xl p-5">
                      <h4 className="font-semibold text-slate-900 mb-2">{item.question}</h4>
                      <p className="text-sm text-slate-600 leading-relaxed">{item.answer}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                {course.original_price && (
                  <p className="text-slate-400 line-through text-sm mb-1">{formatPrice(course.original_price)}</p>
                )}
                <p className="text-3xl font-bold text-orange-600 mb-1">
                  {course.price ? formatPrice(course.price) : "Liên hệ"}
                </p>
                {course.original_price && course.price && (
                  <p className="text-sm text-green-600 font-medium mb-5">
                    Tiết kiệm {formatPrice(course.original_price - course.price)}
                  </p>
                )}

                {isEnrolled ? (
                  <Link
                    href={`/khoa-hoc/${slug}/hoc/${firstLesson}`}
                    className="block w-full text-center bg-green-600 hover:bg-green-700 text-white font-semibold py-3.5 rounded-xl transition-colors"
                  >
                    Tiếp tục học →
                  </Link>
                ) : (
                  <div className="space-y-2">
                    <Link
                      href={`/khoa-hoc/${slug}/thanh-toan`}
                      className="block w-full text-center bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3.5 rounded-xl transition-colors"
                    >
                      {course.cta_text ?? "Đăng ký ngay"}
                    </Link>
                    {firstFreeLesson && (
                      <Link
                        href={`/khoa-hoc/${slug}/hoc/${firstFreeLesson.slug}`}
                        className="block w-full text-center text-orange-600 hover:text-orange-700 border border-orange-200 hover:border-orange-400 font-medium py-2.5 rounded-xl transition-colors text-sm"
                      >
                        ▶ Học thử miễn phí
                      </Link>
                    )}
                  </div>
                )}

                <div className="mt-5 space-y-2.5 text-sm text-slate-600">
                  <div className="flex items-center gap-2"><span>✅</span><span>Học trọn đời</span></div>
                  <div className="flex items-center gap-2"><span>✅</span><span>Bảo hành 30 ngày</span></div>
                  <div className="flex items-center gap-2"><span>✅</span><span>Chứng chỉ hoàn thành</span></div>
                  {course.slots_remaining && (
                    <div className="flex items-center gap-2 text-red-600 font-medium">
                      <span>⚡</span><span>Chỉ còn {course.slots_remaining} suất</span>
                    </div>
                  )}
                </div>

                {totalLessons > 0 && (
                  <div className="mt-5 pt-5 border-t border-slate-100 space-y-2.5">
                    <div className="flex justify-between text-sm text-slate-600">
                      <span>Bài học</span>
                      <span className="font-medium">{totalLessons} bài</span>
                    </div>
                    <div className="flex justify-between text-sm text-slate-600">
                      <span>Cấp độ</span>
                      <span className="font-medium">{course.level}</span>
                    </div>
                    {course.duration && (
                      <div className="flex justify-between text-sm text-slate-600">
                        <span>Thời gian</span>
                        <span className="font-medium">{course.duration}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm text-slate-600">
                      <span>Module</span>
                      <span className="font-medium">{course.modules?.length ?? 0}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related courses */}
      {relatedCourses.length > 0 && (
        <div className="bg-slate-50 border-t border-slate-200">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Khóa học liên quan</h2>
            <div className="grid sm:grid-cols-3 gap-5">
              {relatedCourses.map((rc) => (
                <Link
                  key={rc.slug}
                  href={`/khoa-hoc/${rc.slug}`}
                  className="bg-white rounded-xl border border-slate-200 p-5 hover:border-orange-300 hover:shadow-sm transition-all group"
                >
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{rc.level}</span>
                  <h3 className="font-semibold text-slate-900 mt-3 mb-1 group-hover:text-orange-600 transition-colors text-sm">
                    {rc.title}
                  </h3>
                  <p className="text-sm font-semibold text-orange-600">
                    {rc.price ? rc.price.toLocaleString("vi-VN") + "đ" : "Liên hệ"}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
