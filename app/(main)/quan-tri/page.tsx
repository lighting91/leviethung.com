import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin, type AdminEnrollment, type AdminOrder, type AdminUser } from "@/lib/admin";
import { getAllCourses } from "@/lib/content";
import { formatPrice } from "@/components/ui/CourseCard";
import Icon from "@/components/ui/Icon";
import ConfirmButton from "./ConfirmButton";
import { grantCourse, markOrderPaid, revokeCourse } from "./actions";

export const metadata: Metadata = { title: "Quản trị", robots: { index: false, follow: false } };

interface Props {
  searchParams: Promise<{ tab?: string; q?: string; status?: string }>;
}

function fmtDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const orderStatus: Record<AdminOrder["status"], { label: string; cls: string }> = {
  pending: { label: "Chờ thanh toán", cls: "bg-star/20 text-navy" },
  paid: { label: "Đã thanh toán", cls: "bg-cyan/15 text-navy" },
  refunded: { label: "Đã hoàn tiền", cls: "bg-soft text-muted" },
};

export default async function QuanTriPage({ searchParams }: Props) {
  const { supabase } = await requireAdmin();
  const { tab = "hoc-vien", q = "", status = "pending" } = await searchParams;

  const [usersRes, enrollRes, ordersRes] = await Promise.all([
    supabase.rpc("admin_list_users"),
    supabase.from("enrollments").select("id, user_id, course_slug, status, enrolled_at"),
    supabase.from("orders").select("*").order("created_at", { ascending: false }),
  ]);
  const users = (usersRes.data ?? []) as AdminUser[];
  const enrollments = (enrollRes.data ?? []) as AdminEnrollment[];
  const orders = (ordersRes.data ?? []) as AdminOrder[];
  const loadError = usersRes.error ?? enrollRes.error ?? ordersRes.error;

  const courses = getAllCourses();
  const courseTitle = (slug: string) => courses.find((c) => c.slug === slug)?.title ?? slug;

  const activeEnrollments = enrollments.filter((e) => e.status === "active");
  const pendingOrders = orders.filter((o) => o.status === "pending");
  const revenue = orders.filter((o) => o.status === "paid").reduce((sum, o) => sum + (o.amount ?? 0), 0);

  const needle = q.trim().toLowerCase();
  const shownUsers = needle
    ? users.filter((u) =>
        [u.full_name, u.email, u.phone].some((v) => v?.toLowerCase().includes(needle))
      )
    : users;
  const shownOrders = status === "all" ? orders : orders.filter((o) => o.status === status);

  const stats = [
    { label: "Học viên", value: users.length.toLocaleString("vi-VN") },
    { label: "Lượt đang học", value: activeEnrollments.length.toLocaleString("vi-VN") },
    { label: "Đơn chờ thanh toán", value: pendingOrders.length.toLocaleString("vi-VN") },
    { label: "Doanh thu đã thu", value: formatPrice(revenue) },
  ];

  const tabCls = (active: boolean) =>
    `inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[0.92rem] font-semibold transition-colors ${
      active ? "bg-ink text-white" : "bg-white text-ink border border-line hover:border-ink"
    }`;

  return (
    <>
      <section className="bg-gradient-to-b from-white to-soft pb-10 pt-12 sm:pt-16">
        <div className="container-x">
          <header className="section-head !mb-8">
            <p className="kicker">Admin</p>
            <h1>Quản <span className="accent">trị</span></h1>
          </header>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {stats.map((s, i) => (
              <div key={s.label} className={i === 0 ? "on-dark rounded-card bg-ink p-5 sm:p-6" : "card p-5 sm:p-6"}>
                <p className={`text-[1.7rem] font-bold leading-none tracking-[-0.03em] sm:text-[2.1rem] ${i === 0 ? "text-cyan" : "text-cyan-ink"}`}>
                  {s.value}
                </p>
                <p className="mt-2 text-[0.88rem]">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-24 pt-8">
        <div className="container-x">
          {loadError && (
            <p className="alert-error mb-6" role="alert">
              Chưa tải được dữ liệu quản trị: {loadError.message}
            </p>
          )}

          <nav className="mb-8 flex flex-wrap gap-2.5" aria-label="Mục quản trị">
            <Link href="/quan-tri?tab=hoc-vien" className={tabCls(tab !== "don-hang")}>
              <Icon name="users" className="h-[18px] w-[18px]" /> Học viên
            </Link>
            <Link href="/quan-tri?tab=don-hang" className={tabCls(tab === "don-hang")}>
              <Icon name="bank" className="h-[18px] w-[18px]" /> Đơn hàng
              {pendingOrders.length > 0 && (
                <span className="rounded-full bg-star px-2 text-xs font-bold text-ink">{pendingOrders.length}</span>
              )}
            </Link>
          </nav>

          {tab !== "don-hang" ? (
            <>
              <form className="mb-6 flex flex-wrap gap-3" action="/quan-tri">
                <input type="hidden" name="tab" value="hoc-vien" />
                <input
                  name="q"
                  defaultValue={q}
                  placeholder="Tìm theo tên, email, số điện thoại"
                  className="input max-w-md flex-1 !bg-white border-line"
                  aria-label="Tìm học viên"
                />
                <button className="btn btn-dark btn-sm" type="submit">Tìm</button>
                {q && <Link href="/quan-tri?tab=hoc-vien" className="btn btn-outline btn-sm">Xóa lọc</Link>}
              </form>

              <p className="mb-4 text-[0.9rem] text-muted">{shownUsers.length} học viên</p>
              <div className="grid gap-4">
                {shownUsers.map((u) => {
                  const mine = enrollments.filter((e) => e.user_id === u.id);
                  const activeSlugs = mine.filter((e) => e.status === "active").map((e) => e.course_slug);
                  const grantable = courses.filter((c) => !activeSlugs.includes(c.slug));
                  return (
                    <article key={u.id} className="card grid gap-5 p-5 sm:p-6 lg:grid-cols-[1.1fr_1fr_auto] lg:items-start">
                      <div className="flex min-w-0 gap-3.5">
                        <span className="grid h-11 w-11 flex-none place-items-center rounded-full bg-ink font-bold text-cyan">
                          {(u.full_name || u.email || "?")[0].toUpperCase()}
                        </span>
                        <div className="min-w-0">
                          <p className="flex flex-wrap items-center gap-2 font-bold text-navy">
                            {u.full_name || "(chưa có tên)"}
                            {u.is_admin && <span className="chip">Admin</span>}
                          </p>
                          <p className="truncate text-[0.88rem]">{u.email}</p>
                          {u.phone && <p className="text-[0.88rem]">{u.phone}</p>}
                          <p className="mt-1 text-[0.78rem] text-muted">
                            Tham gia {fmtDate(u.created_at)} · Đăng nhập gần nhất {fmtDate(u.last_sign_in_at)} · {u.lessons_done} bài đã học
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {mine.length === 0 && <span className="text-[0.88rem] text-muted">Chưa có khóa học</span>}
                        {mine.map((e) =>
                          e.status === "active" ? (
                            <form key={e.id} action={revokeCourse} className="inline-flex items-center gap-1 rounded-full bg-cyan/15 py-1 pl-3 pr-1 text-[0.82rem] font-semibold text-navy">
                              <input type="hidden" name="enrollment_id" value={e.id} />
                              {courseTitle(e.course_slug)}
                              <ConfirmButton
                                message={`Thu hồi khóa "${courseTitle(e.course_slug)}" của ${u.full_name || u.email}?`}
                                className="grid h-6 w-6 place-items-center rounded-full text-navy hover:bg-white"
                              >
                                <Icon name="close" className="h-3.5 w-3.5" strokeWidth={2.4} />
                                <span className="sr-only">Thu hồi</span>
                              </ConfirmButton>
                            </form>
                          ) : (
                            <span key={e.id} className="rounded-full bg-soft px-3 py-1 text-[0.82rem] text-muted line-through">
                              {courseTitle(e.course_slug)}
                            </span>
                          )
                        )}
                      </div>

                      {grantable.length > 0 ? (
                        <form action={grantCourse} className="flex flex-wrap gap-2">
                          <input type="hidden" name="user_id" value={u.id} />
                          <select name="course_slug" className="input !w-auto !bg-white border-line !py-2 text-[0.88rem]" aria-label="Chọn khóa học">
                            {grantable.map((c) => (
                              <option key={c.slug} value={c.slug}>{c.title}</option>
                            ))}
                          </select>
                          <button type="submit" className="btn btn-dark btn-sm">Cấp quyền</button>
                        </form>
                      ) : (
                        <span className="text-[0.85rem] text-muted">Đã có tất cả khóa</span>
                      )}
                    </article>
                  );
                })}
              </div>
            </>
          ) : (
            <>
              <div className="mb-6 flex flex-wrap gap-2">
                {[
                  ["pending", "Chờ thanh toán"],
                  ["paid", "Đã thanh toán"],
                  ["all", "Tất cả"],
                ].map(([value, label]) => (
                  <Link
                    key={value}
                    href={`/quan-tri?tab=don-hang&status=${value}`}
                    className={`chip !px-4 !py-1.5 !text-[0.85rem] ${status === value ? "!bg-ink !text-white" : "!bg-white border border-line"}`}
                  >
                    {label}
                  </Link>
                ))}
              </div>

              <p className="mb-4 text-[0.9rem] text-muted">{shownOrders.length} đơn hàng</p>
              <div className="grid gap-4">
                {shownOrders.map((o) => (
                  <article key={o.id} className="card grid gap-4 p-5 sm:p-6 md:grid-cols-[1.2fr_1fr_auto] md:items-center">
                    <div className="min-w-0">
                      <p className="font-mono text-[0.95rem] font-bold text-ink">{o.transfer_content}</p>
                      <p className="truncate text-[0.88rem]">{o.user_name || "—"} · {o.user_email}</p>
                      <p className="text-[0.78rem] text-muted">
                        Tạo {fmtDate(o.created_at)}{o.paid_at ? ` · Thanh toán ${fmtDate(o.paid_at)}` : ""}
                      </p>
                    </div>
                    <div>
                      <p className="text-[0.92rem] font-semibold text-navy">{courseTitle(o.course_slug)}</p>
                      <p className="text-[1.15rem] font-bold text-cyan-deep">{formatPrice(o.amount)}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2.5 md:justify-end">
                      <span className={`rounded-full px-3 py-1 text-[0.8rem] font-semibold ${orderStatus[o.status].cls}`}>
                        {orderStatus[o.status].label}
                      </span>
                      {o.status === "pending" && (
                        <form action={markOrderPaid}>
                          <input type="hidden" name="order_id" value={o.id} />
                          <ConfirmButton
                            message={`Xác nhận đã nhận ${formatPrice(o.amount)} cho đơn ${o.transfer_content}? Học viên sẽ được mở khóa học ngay.`}
                            className="btn btn-dark btn-sm"
                          >
                            Xác nhận đã thanh toán
                          </ConfirmButton>
                        </form>
                      )}
                    </div>
                  </article>
                ))}
                {shownOrders.length === 0 && <p className="card p-8 text-center text-muted">Không có đơn hàng nào.</p>}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
