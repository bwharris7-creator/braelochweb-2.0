import Header from "@/components/Header";
import Footer from "@/components/Footer";

/** Site chrome for all public pages. /studio opts out by living outside this group. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
