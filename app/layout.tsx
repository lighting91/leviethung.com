import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "vietnamese"] });

export const metadata: Metadata = {
  title: {
    default: "Lê Viết Hưng — TikTok Marketing & Digital Content",
    template: "%s | Lê Viết Hưng",
  },
  description:
    "Blog, tài nguyên và khóa học về TikTok Marketing, Content Creation dành cho thương hiệu Việt.",
  openGraph: {
    siteName: "Lê Viết Hưng",
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
        {children}
      </body>
    </html>
  );
}
