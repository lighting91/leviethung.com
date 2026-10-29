import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import RevealObserver from "@/components/ui/RevealObserver";
import { site } from "@/lib/site";
import "./globals.css";

const beVietnam = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-be-vietnam",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Lê Viết Hưng — Founder SMUFT · TikTok Shop & KOC",
    template: "%s | Lê Viết Hưng",
  },
  description:
    "Lê Viết Hưng — Founder SMUFT Agency, 8+ năm thương mại điện tử. Kiến thức thực chiến, tài nguyên và khóa học về TikTok Shop, quản lý KOC và livestream bán hàng.",
  openGraph: {
    siteName: "Lê Viết Hưng",
    locale: "vi_VN",
    type: "website",
    images: [{ url: site.portrait, width: 1000, height: 1500, alt: "Lê Viết Hưng" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // `js` is added before paint so reveal-on-scroll never hides content when JS is off.
    <html lang="vi" className={`${beVietnam.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className="min-h-full flex flex-col bg-white text-body">
        {children}
        <RevealObserver />
      </body>
    </html>
  );
}
