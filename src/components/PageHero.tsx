/** Consistent page-top band: forest green, gold eyebrow, display title. */
export default function PageHero({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="bg-forest text-cream">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <p className="text-sm font-semibold uppercase tracking-widest text-gold">{eyebrow}</p>
        <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">{title}</h1>
        {subtitle && <p className="mt-4 max-w-2xl text-lg text-cream/80">{subtitle}</p>}
      </div>
    </section>
  );
}
