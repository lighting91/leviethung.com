import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactFab from "@/components/ui/ContactFab";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a className="skip-link" href="#main">Bỏ qua điều hướng</a>
      <Header />
      <main id="main" className="flex-1 pt-[var(--nav-h)]">{children}</main>
      <Footer />
      <ContactFab />
    </>
  );
}
