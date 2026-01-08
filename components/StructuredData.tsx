export default function StructuredData() {
  // LocalBusiness Schema - Главное для Local SEO
  const localBusinessData = {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    "@id": "https://fusspflege-lena-schneider.de/#business",
    "name": "Fußpflege Lena Schneider",
    "alternateName": "Fußpflege Erligheim bei Ella Schön",
    "description": "Professionelle kosmetische Fußpflege und Pediküre in Erligheim bei Ella Schön. Smart Pediküre, Klassische Fußpflege, Wellness-Fußreflexzonenmassage. Termine nach Vereinbarung.",
    "url": "https://fusspflege-lena-schneider.de",
    "telephone": "+4917634237368",
    "email": "info@fusspflege-lena-schneider.de",
    "priceRange": "€€",
    "currenciesAccepted": "EUR",
    "paymentAccepted": "Cash, Debit Card",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Löchgauer str. 17",
      "addressLocality": "Erligheim",
      "postalCode": "74391",
      "addressRegion": "Baden-Württemberg",
      "addressCountry": "DE"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 48.9615,
      "longitude": 9.0667
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "15:00",
        "validFrom": "2026-01-01",
        "validThrough": "2026-12-31"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "09:00",
        "closes": "15:00",
        "validFrom": "2026-01-01",
        "validThrough": "2026-12-31"
      }
    ],
    "image": [
      "https://fusspflege-lena-schneider.de/1.webp",
      "https://fusspflege-lena-schneider.de/2.webp"
    ],
    "sameAs": [
      "https://www.facebook.com/fusspflege.lena.schneider",
      "https://www.instagram.com/fusspflege.lena.schneider"
    ],
    "areaServed": [
      {
        "@type": "City",
        "name": "Erligheim"
      },
      {
        "@type": "City",
        "name": "Bönnigheim"
      },
      {
        "@type": "City",
        "name": "Besigheim"
      },
      {
        "@type": "City",
        "name": "Sachsenheim"
      },
      {
        "@type": "City",
        "name": "Bietigheim-Bissingen"
      },
      {
        "@type": "City",
        "name": "Freudental"
      },
      {
        "@type": "City",
        "name": "Löchgau"
      },
      {
        "@type": "City",
        "name": "Kirchheim am Neckar"
      },
      {
        "@type": "City",
        "name": "Walheim"
      },
      {
        "@type": "City",
        "name": "Mundelsheim"
      },
      {
        "@type": "City",
        "name": "Gemmrigheim"
      },
      {
        "@type": "City",
        "name": "Vaihingen an der Enz"
      },
      {
        "@type": "City",
        "name": "Markgröningen"
      },
      {
        "@type": "City",
        "name": "Ludwigsburg"
      },
      {
        "@type": "AdministrativeArea",
        "name": "Landkreis Ludwigsburg"
      }
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Unsere Leistungen",
      "itemListElement": [
        {
          "@type": "Offer",
          "price": "60",
          "priceCurrency": "EUR",
          "availability": "https://schema.org/InStock",
          "itemOffered": {
            "@type": "Service",
            "name": "Präventive Kosmetische Fußpflege",
            "description": "Sanfte, kosmetische Behandlung zur Verbesserung des Haut- und Nagelbildes. Unterstützt die natürliche Regeneration und sorgt für hygienisch gepflegte Füße.",
            "provider": {
              "@id": "https://fusspflege-lena-schneider.de/#business"
            }
          }
        },
        {
          "@type": "Offer",
          "price": "55",
          "priceCurrency": "EUR",
          "availability": "https://schema.org/InStock",
          "itemOffered": {
            "@type": "Service",
            "name": "Smart Pediküre",
            "description": "Moderne Form der Fußpflege: Hornhaut wird sanft entfernt, die Nägel werden geformt und die Haut mit Pflegeöl gepflegt",
            "provider": {
              "@id": "https://fusspflege-lena-schneider.de/#business"
            }
          }
        },
        {
          "@type": "Offer",
          "price": "37",
          "priceCurrency": "EUR",
          "availability": "https://schema.org/InStock",
          "itemOffered": {
            "@type": "Service",
            "name": "Klassische Fußpflege",
            "description": "Professionelle kosmetische Fußpflege für gesunde und gepflegte Füße",
            "provider": {
              "@id": "https://fusspflege-lena-schneider.de/#business"
            }
          }
        },
        {
          "@type": "Offer",
          "price": "35",
          "priceCurrency": "EUR",
          "availability": "https://schema.org/InStock",
          "itemOffered": {
            "@type": "Service",
            "name": "Wellness-Fußreflexzonenmassage",
            "description": "Entspannende Fußmassage zur Aktivierung der Reflexzonen und Selbstheilungskräfte",
            "provider": {
              "@id": "https://fusspflege-lena-schneider.de/#business"
            }
          }
        },
        {
          "@type": "Offer",
          "price": "29",
          "priceCurrency": "EUR",
          "availability": "https://schema.org/InStock",
          "itemOffered": {
            "@type": "Service",
            "name": "B/S Spangentechnik",
            "description": "Nagelkorrektur mit der bewährten B/S Spangentechnik für eingewachsene Fußnägel",
            "provider": {
              "@id": "https://fusspflege-lena-schneider.de/#business"
            }
          }
        }
      ]
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5.0",
      "reviewCount": "1",
      "bestRating": "5",
      "worstRating": "1"
    }
  };

  // Organization Schema
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://fusspflege-lena-schneider.de/#organization",
    "name": "Fußpflege Lena Schneider",
    "url": "https://fusspflege-lena-schneider.de",
    "logo": "https://fusspflege-lena-schneider.de/logo.png",
    "foundingDate": "2020",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+4917634237368",
      "contactType": "customer service",
      "areaServed": "DE",
      "availableLanguage": ["de", "German"],
      "hoursAvailable": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "15:00"
      }
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Löchgauer str. 17",
      "addressLocality": "Erligheim",
      "postalCode": "74391",
      "addressRegion": "Baden-Württemberg",
      "addressCountry": "DE"
    }
  };

  // Person Schema (Owner)
  const personData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": "https://fusspflege-lena-schneider.de/#person",
    "name": "Lena Schneider",
    "jobTitle": "Fußpflegerin",
    "worksFor": {
      "@id": "https://fusspflege-lena-schneider.de/#organization"
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Erligheim",
      "addressRegion": "Baden-Württemberg",
      "addressCountry": "DE"
    },
    "telephone": "+4917634237368",
    "email": "info@fusspflege-lena-schneider.de"
  };

  // WebSite Schema with SearchAction
  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://fusspflege-lena-schneider.de/#website",
    "url": "https://fusspflege-lena-schneider.de",
    "name": "Fußpflege Lena Schneider",
    "description": "Professionelle kosmetische Fußpflege in Erligheim bei Ella Schön",
    "publisher": {
      "@id": "https://fusspflege-lena-schneider.de/#organization"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://fusspflege-lena-schneider.de/?s={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    },
    "inLanguage": "de-DE"
  };

  // FAQPage Schema - Важно для Featured Snippets
  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Wo befindet sich die Fußpflege in Erligheim?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Unsere Fußpflege befindet sich in Erligheim bei Ella Schön, Löchgauer str. 17, 74391 Erligheim. Wir sind gut erreichbar für Kunden aus Bönnigheim, Besigheim, Sachsenheim, Bietigheim-Bissingen, Freudental, Löchgau und Umgebung."
        }
      },
      {
        "@type": "Question",
        "name": "Was kostet eine Fußpflege in Erligheim?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Die Preise beginnen bei 15€ für Fremdmodellage entfernen. Eine klassische Fußpflege kostet 37€, Smart Pediküre 55€, Kosmetische Nagelkorrektur 29€, Natürliche Maniküre 30€, Wellness-Fußreflexzonenmassage 35€ und Paraffinbehandlung ab 19€."
        }
      },
      {
        "@type": "Question",
        "name": "Brauche ich einen Termin für die Fußpflege?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ja, wir arbeiten ausschließlich nach Terminvereinbarung. Dies garantiert Ihnen eine individuelle Betreuung ohne Wartezeit. Termine können telefonisch unter +49 176 34237368 oder online über unsere Website gebucht werden."
        }
      },
      {
        "@type": "Question",
        "name": "Welche Leistungen bieten Sie an?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Wir bieten klassische Fußpflege, Smart Pediküre, Kosmetische Nagelkorrektur, Wellness-Fußreflexzonenmassage, Natürliche Maniküre und Paraffinbehandlung. Alle Behandlungen werden professionell und mit sterilen Instrumenten durchgeführt."
        }
      },
      {
        "@type": "Question",
        "name": "Wie lange dauert eine Behandlung?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Eine klassische Fußpflege dauert ca. 45 Minuten, Smart Pediküre ca. 50 Minuten, Wellness-Fußreflexzonenmassage ca. 30 Minuten, Natürliche Maniküre ca. 40 Minuten und Paraffinbehandlung ca. 30 Minuten."
        }
      },
      {
        "@type": "Question",
        "name": "Ist Parken in der Nähe möglich?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ja, in Erligheim bei Ella Schön stehen kostenlose Parkmöglichkeiten direkt vor dem Salon zur Verfügung. Der Salon ist gut mit dem Auto erreichbar."
        }
      },
      {
        "@type": "Question",
        "name": "Was ist der Unterschied zwischen Smart Pediküre und klassischer Fußpflege?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Die Smart Pediküre (55€, 50 Min.) ist eine moderne, umfassende Behandlung mit sanfter Hornhautentfernung, Nagelformung und Pflegeöl für langanhaltende Ergebnisse. Die klassische Fußpflege (37€, 45 Min.) konzentriert sich auf die grundlegende Nagel- und Hautpflege."
        }
      },
      {
        "@type": "Question",
        "name": "Kann ich auch aus Bönnigheim oder Bietigheim-Bissingen kommen?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ja, unser Salon in Erligheim ist ideal erreichbar für Kunden aus Bönnigheim (5 Min.), Bietigheim-Bissingen (10 Min.), Besigheim (8 Min.), Sachsenheim (7 Min.) und allen umliegenden Orten im Landkreis Ludwigsburg."
        }
      },
      {
        "@type": "Question",
        "name": "Bieten Sie auch Behandlungen bei eingewachsenen Nägeln an?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ja, wir bieten kosmetische Nagelkorrektur (29€ pro Nagel) für eingewachsene Zehennägel. Die Behandlung ist sanft, kaum sichtbar und lindert Beschwerden. Bei medizinischen Problemen empfehlen wir eine ärztliche Beratung."
        }
      },
      {
        "@type": "Question",
        "name": "Welche Zahlungsmethoden akzeptieren Sie?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Wir akzeptieren Barzahlung und EC-Karte. Kreditkarten werden derzeit nicht akzeptiert."
        }
      },
      {
        "@type": "Question",
        "name": "Was passiert bei Terminabsage?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Bitte sagen Sie Termine mindestens 24 Stunden vorher ab. Nicht rechtzeitig abgesagte Termine werden mit 25€ berechnet. Sie können per Telefon (+49 176 34237368) oder E-Mail absagen."
        }
      }
    ]
  };

  // Breadcrumb Schema
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://fusspflege-lena-schneider.de"
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />
    </>
  );
}
