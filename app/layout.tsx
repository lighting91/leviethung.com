import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin", "vietnamese"] });

export const metadata: Metadata = {
  title: {
    default: "Lê Việt Hùng — TikTok Marketing & Digital Content",
    template: "%s | Lê Việt Hùng",
  },
  description:
    "Blog, tài nguyên và khóa học về TikTok Marketing, Content Creation dành cho thương hiệu Việt.",
  openGraph: {
    siteName: "Lê Việt Hùng",
    locale: "vi_VN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${inter.className} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-slate-900">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
