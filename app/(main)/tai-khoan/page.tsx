import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCourseBySlug } from "@/lib/content";
import Icon from "@/components/ui/Icon";

export default async function TaiKhoanPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/dang-nhap");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "active");

  // Count completed lessons
  const { count: completedCount } = await supabase
    .from("lesson_progress")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  const displayName = profile?.full_name ?? user.email?.split("@")[0] ?? "Học viên";

  return (
    <>
      <section className="bg-gradient-to-b from-white to-soft pb-12 pt-14 sm:pt-16">
        <div className="container-x flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div className="flex items-center gap-4">
            <span className="grid h-14 w-14 flex-none place-items-center rounded-full bg-ink text-xl font-bold text-cyan">
              {displayName[0]?.toUpperCase()}
            </span>
            <div className="section-head sm !mb-0">
              <p className="kicker">My account</p>
              <h1>Xin chào, <span className="accent">{displayName}</span></h1>
              <p className="mt-1 text-[0.9rem] text-muted">
                {user.email}
                {profile?.phone && <> · {profile.phone}</>}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/tai-khoan/cap-nhat" className="btn btn-outline btn-sm">
              <Icon name="settings" className="h-4 w-4" /> Cập nhật tài khoản
            </Link>
            <form action="/api/auth/signout" method="POST">
              <button formAction="/api/auth/signout" className="btn btn-outline btn-sm hover:!border-[#b42318] hover:text-[#b42318]">
                <Icon name="logout" className="h-4 w-4" /> Đăng xuất
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="pb-24 pt-10">
        <div className="container-x">
          {/* Stats */}
          <div className="mb-14 grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div className="on-dark rounded-card bg-ink p-6">
              <p className="text-[2.4rem] font-bold leading-none tracking-[-0.04em] text-cyan">{enrollments?.length ?? 0}</p>
              <p className="mt-2 text-[0.9rem]">Khóa học đã đăng ký</p>
            </div>
            <div className="card p-6">
              <p className="text-[2.4rem] font-bold leading-none tracking-[-0.04em] text-cyan-ink">{completedCount ?? 0}</p>
              <p className="mt-2 text-[0.9rem]">Bài học đã hoàn thành</p>
            </div>
            <div className="card col-span-2 p-6 sm:col-span-1">
              <p className="text-[2.4rem] font-bold leading-none tracking-[-0.04em] text-cyan-ink">Trọn đời</p>
              <p className="mt-2 text-[0.9rem]">Thời hạn truy cập</p>
            </div>
          </div>

          {/* Enrolled Courses */}
          <header className="section-head sm">
            <p className="kicker">My courses</p>
            <h2>Khóa học <span className="accent">của bạn</span></h2>
          </header>

          {!enrollments || enrollments.length === 0 ? (
            <div className="card p-10 text-center">
              <span className="icon-tile mx-auto mb-4"><Icon name="grad" className="h-6 w-6" /></span>
              <h3 className="mb-2 font-bold">Bạn chưa có khóa học nào</h3>
              <p className="mb-6 text-[0.95rem]">Khám phá các khóa học thực chiến về TikTok Shop.</p>
              <Link href="/khoa-hoc" className="btn btn-dark btn-sm">
                Xem khóa học <Icon name="arrow-right" className="h-4 w-4" strokeWidth={2} />
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {enrollments.map((enrollment) => {
                const course = getCourseBySlug(enrollment.course_slug);
                const firstLesson = course?.modules?.[0]?.lessons?.[0]?.slug ?? "gioi-thieu";
                return (
                  <div key={enrollment.id} className="card card-hover flex flex-col p-7">
                    <div className="mb-4 flex items-center justify-between">
                      <span className="chip">Đang học</span>
                      <span className="text-[0.8rem] text-muted">
                        Đăng ký {new Date(enrollment.enrolled_at).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                    <h3 className="mb-1.5 text-[1.2rem] font-bold text-navy">
                      {course?.title ?? enrollment.course_slug}
                    </h3>
                    {course?.description && (
                      <p className="mb-6 line-clamp-2 text-[0.92rem]">{course.description}</p>
                    )}
                    <Link
                      href={`/khoa-hoc/${enrollment.course_slug}/hoc/${firstLesson}`}
                      className="btn btn-dark btn-sm mt-auto self-start"
                    >
                      Tiếp tục học <Icon name="arrow-right" className="h-4 w-4" strokeWidth={2} />
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
