import type { Metadata } from "next";
import AuthShell from "@/components/ui/AuthShell";
import GoogleSignInButton from "@/components/ui/GoogleSignInButton";
import Icon from "@/components/ui/Icon";
import { safeNext } from "@/lib/auth";

export const metadata: Metadata = { title: "Đăng nhập" };

interface Props {
  searchParams: Promise<{ redirect?: string; error?: string }>;
}

export default async function DangNhapPage({ searchParams }: Props) {
  const { redirect, error } = await searchParams;

  return (
    <AuthShell
      kicker="Welcome"
      title="Đăng nhập"
      subtitle="Dùng tài khoản Google để vào học. Lần đầu đăng nhập sẽ tự tạo tài khoản, không cần mật khẩu."
      footer={<>Bằng việc tiếp tục, bạn đồng ý để chúng tôi dùng tên và email Google của bạn cho tài khoản học viên.</>}
    >
      {error && (
        <div className="alert-error mb-4" role="alert">
          Đăng nhập chưa thành công. Vui lòng thử lại.
        </div>
      )}
      <GoogleSignInButton next={safeNext(redirect)} />
      <ul className="mt-6 grid gap-2 text-[0.88rem] text-muted">
        <li className="flex items-start gap-2"><Icon name="shield" className="mt-1 h-4 w-4 flex-none text-cyan-deep" />Không lưu mật khẩu trên website</li>
        <li className="flex items-start gap-2"><Icon name="check" className="mt-1 h-4 w-4 flex-none text-cyan-deep" strokeWidth={2.4} />Học viên cũ: đăng nhập bằng đúng Gmail đã đăng ký để giữ khóa học</li>
      </ul>
    </AuthShell>
  );
}
