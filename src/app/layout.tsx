import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Craft Brewery in Kennett Square, PA`,
    template: `%s — ${site.name}`,
  },
  description: site.tagline,
  openGraph: {
    siteName: site.name,
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/images/beer-garden.webp",
        width: 2500,
        height: 1875,
        alt: "The Braeloch Brewing beer garden at dusk",
      },
    ],
  },
};

/** Brewery/LocalBusiness structured data (PLAN.md §6). */
const breweryJsonLd = {
  "@context": "https://schema.org",
  "@type": "Brewery",
  name: site.name,
  url: site.url,
  telephone: site.phone,
  email: site.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.street,
    addressLocality: site.address.city,
    addressRegion: site.address.state,
    postalCode: site.address.zip,
    addressCountry: "US",
  },
  servesCuisine: "American",
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Wednesday", "Thursday"], opens: "16:00", closes: "21:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Friday", "Saturday"], opens: "12:00", closes: "23:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Sunday", opens: "12:00", closes: "20:00" },
  ],
  sameAs: Object.values(site.social),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breweryJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
