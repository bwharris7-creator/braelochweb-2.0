import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

/**
 * Branded 404. Lives at the root (outside the (site) group), so it pulls in
 * the site chrome explicitly.
 */
export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex flex-1 items-center justify-center px-4 py-24">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-gold-dark">404</p>
          <h1 className="mt-3 font-display text-4xl font-bold text-forest sm:text-5xl">
            This one&rsquo;s not on tap
          </h1>
          <p className="mx-auto mt-4 max-w-md text-charcoal/70">
            The page you&rsquo;re looking for got 86&rsquo;d — or never existed.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/"
              className="rounded-md bg-gold px-8 py-3 font-semibold text-forest transition-all hover:-translate-y-1 hover:bg-gold-dark hover:shadow-card-hover"
            >
              Back to the taproom
            </Link>
            <Link
              href="/beer"
              className="rounded-md border-2 border-forest px-8 py-3 font-semibold text-forest transition-colors hover:bg-forest hover:text-cream"
            >
              See what is on tap
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
