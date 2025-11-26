import type { Metadata } from "next";
import "./globals.css";
import StructuredData from "@/components/StructuredData";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from "next/script";

export const metadata: Metadata = {
  metadataBase: new URL('https://fusspflege-lena-schneider.de'),
  title: {
    default: "Fußpflege Sachsenheim | Lena Schneider | Kosmetische Fußpflege & Pediküre",
    template: "%s | Fußpflege Lena Schneider Sachsenheim"
  },
  description: "Professionelle kosmetische Fußpflege in Sachsenheim ✓ Präventive Nagelpilzbehandlung ✓ Präventive B/S Spangentechnik ✓ Fußreflexzonenmassage ✓ Termine nach Vereinbarung ☎ +49 176 34237368 ✓ Brunnenstraße 25",
  keywords: [
    // Primäre Keywords
    "Fußpflege Sachsenheim",
    "Kosmetische Fußpflege Sachsenheim",
    "Fußpflegerin Sachsenheim",
    "Pediküre Sachsenheim",

    // Service Keywords
    "Präventive Nagelpilz Behandlung Sachsenheim",
    "Präventive B/S Spangentechnik Sachsenheim",
    "Fußreflexzonenmassage Sachsenheim",
    "Smart Pediküre Sachsenheim",
    "Klassische Fußpflege Sachsenheim",
    "Shellac Sachsenheim",

    // Location Keywords
    "Fußpflege 74343",
    "Fußpflege Brunnenstraße",
    "Fußpflege Ludwigsburg Kreis",
    "Fußpflege Bietigheim-Bissingen",
    "Fußpflege Vaihingen Enz",
    "Fußpflege Markgröningen",

    // Problem Keywords
    "Hornhautentfernung Sachsenheim",
    "Nagelkorrektur Sachsenheim",
    "Eingewachsene Nägel Sachsenheim",
    "Hühneraugen Entfernung Sachsenheim",

    // Long-tail Keywords
    "Fußpflege Salon Sachsenheim",
    "Medizinische Fußpflege Sachsenheim",
    "Fußgesundheit Sachsenheim",
    "Fußpflege Termin Sachsenheim",
    "Fußpflege in meiner Nähe",
    "Beste Fußpflege Sachsenheim",
  ],
  authors: [{ name: "Lena Schneider", url: "https://fusspflege-lena-schneider.de" }],
  creator: "Lena Schneider",
  publisher: "Fußpflege Lena Schneider",
  category: "Health & Wellness",
  classification: "Beauty Salon, Foot Care",
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: "https://fusspflege-lena-schneider.de",
    siteName: "Fußpflege Lena Schneider Sachsenheim",
    title: "Fußpflege Sachsenheim | Lena Schneider | Kosmetische Fußpflege & Pediküre",
    description: "⭐ Professionelle kosmetische Fußpflege in Sachsenheim ✓ Präventive Nagelpilzbehandlung ✓ Präventive B/S Spangentechnik ✓ Fußreflexzonenmassage ✓ Termine nach Vereinbarung ☎ +49 176 34237368",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Fußpflege Lena Schneider - Professionelle kosmetische Fußpflege in Sachsenheim",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fußpflege Sachsenheim | Lena Schneider",
    description: "⭐ Professionelle kosmetische Fußpflege in Sachsenheim ✓ Termine nach Vereinbarung ☎ +49 176 34237368",
    images: ["/og-image.jpg"],
    creator: "@fusspflege_lena",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: "https://fusspflege-lena-schneider.de",
    languages: {
      'de-DE': 'https://fusspflege-lena-schneider.de',
    },
  },
  verification: {
    google: "google-site-verification-code", // TODO: In Google Search Console generieren und hier einfügen
    yandex: "yandex-verification-code", // Optional
  },
  other: {
    'apple-mobile-web-app-title': 'Fußpflege Sachsenheim',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="de">
      <head>
        {/* Google Analytics */}
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `}
            </Script>
          </>
        )}

        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />

        {/* Geo-Location Meta Tags for Local SEO */}
        <meta name="geo.region" content="DE-BW" />
        <meta name="geo.placename" content="Sachsenheim" />
        <meta name="geo.position" content="48.9615;9.0667" />
        <meta name="ICBM" content="48.9615, 9.0667" />

        {/* Additional Local Business Meta Tags */}
        <meta name="city" content="Sachsenheim" />
        <meta name="state" content="Baden-Württemberg" />
        <meta name="country" content="Germany" />
        <meta name="language" content="German" />
        <meta name="distribution" content="local" />
        <meta name="rating" content="general" />

        {/* Contact & Business Info */}
        <meta name="contact" content="info@fusspflege-lena-schneider.de" />
        <meta name="telephone" content="+4917634237368" />
        <meta name="address" content="Brunnenstraße 25, 74343 Sachsenheim" />

        {/* Additional SEO Meta Tags */}
        <meta name="format-detection" content="telephone=yes" />
        <meta name="theme-color" content="#0284c7" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />

        {/* DNS Prefetch for Performance */}
        <link rel="dns-prefetch" href="https://www.google.com" />
        <link rel="dns-prefetch" href="https://maps.googleapis.com" />
        <link rel="preconnect" href="https://api.telegram.org" />

        {/* Structured Data */}
        <StructuredData />
      </head>
      <body className="font-sans">
        {/* Skip navigation links for accessibility - BFSG compliant */}
        <div className="sr-only focus-within:not-sr-only focus-within:absolute focus-within:top-4 focus-within:left-4 focus-within:z-50 focus-within:flex focus-within:gap-2">
          <a
            href="#main-content"
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600 font-semibold"
          >
            Zum Hauptinhalt springen
          </a>
          <a
            href="#services"
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600 font-semibold"
          >
            Zu Leistungen springen
          </a>
          <a
            href="#booking"
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600 font-semibold"
          >
            Zur Terminbuchung springen
          </a>
        </div>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
        <SpeedInsights />
      </body>
    </html>
  );
}
