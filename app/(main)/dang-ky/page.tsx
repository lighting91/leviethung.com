import { redirect } from "next/navigation";

// Sign-up is Google-only now: the first Google sign-in creates the account.
export default async function DangKyPage({ searchParams }: { searchParams: Promise<{ redirect?: string }> }) {
  const { redirect: next } = await searchParams;
  redirect(next ? `/dang-nhap?redirect=${encodeURIComponent(next)}` : "/dang-nhap");
}
