import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCourseBySlug } from "@/lib/content";

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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Xin chào, {displayName} 👋</h1>
          <p className="text-slate-500 text-sm mt-1">{user.email}</p>
          {profile?.phone && (
            <p className="text-slate-400 text-sm">{profile.phone}</p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/tai-khoan/cap-nhat"
            className="text-sm text-slate-600 hover:text-orange-600 transition-colors border border-slate-200 rounded-lg px-4 py-2"
          >
            Cập nhật tài khoản
          </Link>
          <form action="/api/auth/signout" method="POST">
            <button
              formAction="/api/auth/signout"
              className="text-sm text-slate-500 hover:text-red-600 transition-colors border border-slate-200 rounded-lg px-4 py-2"
            >
              Đăng xuất
            </button>
          </form>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
        <div className="bg-orange-50 rounded-xl p-5">
          <p className="text-3xl font-bold text-orange-600">{enrollments?.length ?? 0}</p>
          <p className="text-sm text-slate-600 mt-1">Khóa học đã đăng ký</p>
        </div>
        <div className="bg-slate-50 rounded-xl p-5">
          <p className="text-3xl font-bold text-slate-700">{completedCount ?? 0}</p>
          <p className="text-sm text-slate-600 mt-1">Bài học đã hoàn thành</p>
        </div>
        <div className="bg-green-50 rounded-xl p-5 col-span-2 sm:col-span-1">
          <p className="text-3xl font-bold text-green-600">∞</p>
          <p className="text-sm text-slate-600 mt-1">Ngày truy cập</p>
        </div>
      </div>

      {/* Enrolled Courses */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4">Khóa học của bạn</h2>

        {!enrollments || enrollments.length === 0 ? (
          <div className="bg-slate-50 rounded-2xl p-10 text-center">
            <div className="text-4xl mb-3">🎓</div>
            <h3 className="font-semibold text-slate-700 mb-2">Bạn chưa có khóa học nào</h3>
            <p className="text-slate-500 text-sm mb-5">Khám phá các khóa học TikTok Marketing</p>
            <Link
              href="/khoa-hoc"
              className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors text-sm"
            >
              Xem khóa học →
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {enrollments.map((enrollment) => {
              const course = getCourseBySlug(enrollment.course_slug);
              const firstLesson = course?.modules?.[0]?.lessons?.[0]?.slug ?? "gioi-thieu";
              return (
                <div
                  key={enrollment.id}
                  className="bg-white rounded-xl border border-slate-200 p-5 hover:border-orange-300 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-full font-medium">
                      Đang học
                    </span>
                    <span className="text-xs text-slate-400">
                      {new Date(enrollment.enrolled_at).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1">
                    {course?.title ?? enrollment.course_slug}
                  </h3>
                  {course?.description && (
                    <p className="text-xs text-slate-500 mb-3 line-clamp-2">{course.description}</p>
                  )}
                  <Link
                    href={`/khoa-hoc/${enrollment.course_slug}/hoc/${firstLesson}`}
                    className="text-sm text-orange-600 font-medium hover:underline"
                  >
                    Tiếp tục học →
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
