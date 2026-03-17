/**
 * Единый источник контактных данных для всего сайта
 * Single source of truth for all contact information
 */

export const BUSINESS_INFO = {
  name: "Fußpflege Lena Schneider bei Ella Schön",
  location: "Erligheim",
  owner: "Elena Schneider",
  alternateNames: [
    "Fußpflege Erligheim bei Ella Schön",
    "Unser Salon bei Ella Schön",
  ],

  contact: {
    phoneFormatted: "+49 176 34237368",
    phoneHref: "tel:+4917634237368",
    email: "info@fusspflege-lena-schneider.de",
    emailHref: "mailto:info@fusspflege-lena-schneider.de",
  },

  address: {
    street: "Löchgauer Str. 17",
    postalCode: "74391",
    city: "Erligheim",
    region: "Baden-Württemberg",
    country: "Deutschland",
    fullAddress: "Löchgauer Str. 17, 74391 Erligheim",
  },

  geo: {
    latitude: 48.9615,
    longitude: 9.0667,
  },

  hours: {
    weekdays: "Mo - Fr: 09:00 - 15:00 Uhr",
    saturday: "Sa: Geschlossen",
    sunday: "So: Geschlossen",
    note: "Termine nur Mo–Fr nach Vereinbarung",
  },

  priceRange: "25-60 EUR",
  paymentAccepted: ["Cash", "Debit Card"],
  areaServed: [
    "Erligheim",
    "Bönnigheim",
    "Besigheim",
    "Sachsenheim",
    "Bietigheim-Bissingen",
    "Freudental",
    "Löchgau",
    "Kirchheim am Neckar",
    "Walheim",
    "Mündelsheim",
    "Gemmrigheim",
    "Vaihingen an der Enz",
    "Markgröningen",
    "Ludwigsburg",
    "Landkreis Ludwigsburg",
  ],

  social: {
    instagram: "https://www.instagram.com/kosmetikfus",
    tiktok: "https://www.tiktok.com/@lena.fupflege.erl",
    googleBusiness: "https://share.google/r9i2S2iSLp7LsbW4g",
  },

  seo: {
    domain: "https://fusspflege-lena-schneider.de",
    title: "Fußpflege bei Ella Schön | Kosmetische Fußpflege & Pediküre in Erligheim",
    description: "Professionelle kosmetische Fußpflege in Erligheim bei Ella Schön. Smart Pediküre, klassische Fußpflege und Maniküre. Termine nach Vereinbarung.",
    locale: "de_DE",
    themeColor: "#8B9E7E",
  },

  legal: {
    vatId: null, // Keine USt-IdNr. - Kleinunternehmer gemäß § 19 UStG
    kleinunternehmer: true, // Kleinunternehmerregelung nach § 19 UStG
    registrationCourt: null, // Nicht erforderlich für Einzelunternehmer
    registrationNumber: null, // Nicht erforderlich für Einzelunternehmer
  },
} as const;

export const SITE_ASSETS = {
  ogImage: "/og-image.jpg",
  favicon: "/favicon.svg",
  appleTouchIcon: "/icon-192x192.png",
  manifest: "/manifest.json",
  ogImageWidth: 1200,
  ogImageHeight: 630,
} as const;

// Service-Kategorien (für Buchungsformular)
export const SERVICES = [
  {
    id: "smart-pediküre",
    title: "Smart Pediküre",
    description: "Moderne Form der Fußpflege: Hornhaut wird sanft entfernt, die Nägel werden geformt und die Haut mit Pflegeöl gepflegt.",
    price: "60 €",
    duration: "50 Min.",
    benefits: [
      "Sanfte Hornhautentfernung",
      "Nägel formen",
      "Hautpflege mit Pflegeöl",
      "Langanhaltendes Frischegefühl"
    ],
  },
  {
    id: "klassische-fußpflege",
    title: "Klassische Fußpflege",
    description: "Professionelle kosmetische Fußpflege für gesunde und gepflegte Füße.",
    price: "37 €",
    duration: "45 Min.",
    benefits: [
      "Nägel schneiden/kürzen",
      "Nagelhautentfernung",
      "Hornhautentfernung",
      "Pflege der Nägel und Füße"
    ],
  },
  {
    id: "verwöhnpaket",
    title: "Verwöhnpaket",
    description: "Das rundum-sorglos-Paket für gepflegte Füße.",
    price: "59 €",
    duration: "60 Min.",
    benefits: [
      "Klassische Fußpflege",
      "Peeling",
      "Entspannende Massage"
    ],
  },
  {
    id: "nagelkorrektur",
    title: "Kosmetische Nagelkorrektur",
    description: "Sanfte kosmetische Methode zur Nagelkorrektur.",
    price: "29 €",
    duration: "10 Min.",
    note: "Pro Nagel, ohne Fußpflege",
    benefits: [
      "Sanfte kosmetische Methode",
      "Kaum sichtbar",
      "Pro Nagel"
    ],
  },
  {
    id: "manikuere",
    title: "Maniküre",
    description: "Nägel kürzen, feilen.",
    price: "25,50 €",
    duration: "30 Min.",
    benefits: [
      "Nägel kürzen",
      "Feilen und formen"
    ],
  },
  {
    id: "neumodellage",
    title: "Neumodellage / Gel / Tips",
    description: "Professionelle Neumodellage mit Gel oder Tips.",
    price: "55 €",
    duration: "90 Min.",
    benefits: [
      "Neuaufbau",
      "Gel oder Tips",
      "Formgebung nach Wunsch"
    ],
  },
  {
    id: "auffuellen-bis-4",
    title: "Auffüllen / Refill bis 4 Wochen",
    description: "Professionelles Auffüllen der Nägel.",
    price: "45 €",
    duration: "60 Min.",
    benefits: ["Nachfüllen", "Form anpassen"],
  },
  {
    id: "auffuellen-ab-5",
    title: "Auffüllen / Refill ab 5 Wochen",
    description: "Professionelles Auffüllen der Nägel.",
    price: "55 €",
    duration: "60 Min.",
    benefits: ["Nachfüllen", "Form anpassen"],
  },
  {
    id: "japanische-manikuere",
    title: "Japanische Maniküre",
    description: "Natürliche Pflege für gesunde, glänzende Nägel ohne Gel oder Acryl.",
    price: "50 €",
    duration: "45 Min.",
    benefits: [
      "Ohne Gel oder Acryl",
      "Natürliche Pflege",
      "Gesunde, glänzende Nägel"
    ],
  },
] as const;

// Display-Kategorien für die Services-Sektion
export const SERVICE_CATEGORIES = [
  {
    id: "fusspflege",
    title: "Fußpflege Preise",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6 text-white flex-shrink-0"><path d="M7 21c0 0 1-3 1-6s-1-5-1-7c0-3 2-6 5-6s5 3 5 6c0 2-1 4-1 7s1 6 1 6"/><circle cx="9.5" cy="16" r="0.5" fill="currentColor"/><circle cx="14.5" cy="16" r="0.5" fill="currentColor"/><circle cx="10" cy="13" r="0.5" fill="currentColor"/><circle cx="14" cy="13" r="0.5" fill="currentColor"/><circle cx="12" cy="10" r="0.5" fill="currentColor"/></svg>`,
    services: [
      {
        title: "Klassische Fußpflege",
        price: "37,00 €",
        description: "Professionelle kosmetische Fußpflege für gesunde und gepflegte Füße.",
        addons: [
          { label: "Aufpreis mit Shellac / Farbgel", price: "+18,00 €" },
          { label: "Aufpreis mit French", price: "+20,00 €" },
          { label: "Nagellack", price: "+8,00 €" },
          { label: "Nagellackentfernung", price: "+9,00 €" },
          { label: "Fremdmodellage entfernen", price: "+12,00 €" },
          { label: "Intensive Hornhautentfernung", price: "+15,00 €" },
        ]
      },
      {
        title: "Smart Pediküre",
        price: "60,00 €",
        description: "Moderne Form der Fußpflege: Hornhaut wird sanft entfernt, die Nägel werden geformt und die Haut mit Pflegeöl gepflegt. Das sorgt für glatte, gepflegte Füße und ein langanhaltendes Frischegefühl.",
        highlight: true,
      },
      {
        title: "Kosmetische Nagelkorrektur",
        price: "29,00 €",
        note: "Kaum sichtbare, sanfte Methode. Pro Nagel (ohne Fußpflege)",
      },
      {
        title: "Verwöhnpaket",
        price: "59,00 €",
        description: "inkl. Fußpflege, Peeling, Massage",
      },
    ]
  },
  {
    id: "manikuere",
    title: "Maniküre Preise",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6 text-white flex-shrink-0"><path d="M18 11V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2"/><path d="M14 10V4a2 2 0 0 0-2-2 2 2 0 0 0-2 2v2"/><path d="M10 10.5V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 17"/></svg>`,
    services: [
      {
        title: "Maniküre",
        price: "25,50 €",
        description: "Nägel kürzen, feilen.",
      },
      {
        title: "Neumodellage / Gel / Tips",
        price: "55,00 €",
      },
      {
        title: "Auffüllen",
        priceOptions: [
          { label: "bis 4 Wochen", price: "45,00 €" },
          { label: "ab 5 Wochen", price: "55,00 €" },
        ],
      },
      {
        title: "Japanische Maniküre",
        price: "50,00 €",
        description: "Natürliche Pflege für gesunde, glänzende Nägel ohne Gel oder Acryl.",
        highlight: true,
      },
    ]
  }
];

// Öffnungszeiten strukturiert
export const OPENING_HOURS = [
  {
    days: "Montag - Freitag",
    hours: "09:00 - 15:00 Uhr",
    schemaDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  },
  {
    days: "Samstag",
    hours: "Geschlossen",
    schemaDays: ["Saturday"],
  },
  {
    days: "Sonntag",
    hours: "Geschlossen",
    schemaDays: ["Sunday"],
  },
] as const;

export const FAQ_ITEMS = [
  {
    question: "Wo befindet sich die Fußpflege in Erligheim?",
    answer: `Unser Salon befindet sich in ${BUSINESS_INFO.address.street}, ${BUSINESS_INFO.address.postalCode} ${BUSINESS_INFO.address.city}. Inhaberin ist ${BUSINESS_INFO.owner}.`,
  },
  {
    question: "Was kostet eine Fußpflege in Erligheim?",
    answer: "Die klassische Fußpflege kostet 37 EUR, die Smart Pediküre 60 EUR und das Verwöhnpaket inklusive Peeling und Massage 59 EUR.",
  },
  {
    question: "Welche Maniküre-Leistungen werden angeboten?",
    answer: "Wir bieten Maniküre, Neumodellage mit Gel oder Tips, Auffüllen/Refill sowie japanische Maniküre an.",
  },
  {
    question: "Brauche ich einen Termin für die Fußpflege?",
    answer: `Ja, wir arbeiten ausschließlich nach Terminvereinbarung. Sie können telefonisch (${BUSINESS_INFO.contact.phoneFormatted}), per E-Mail (${BUSINESS_INFO.contact.email}) oder über das Online-Buchungsformular anfragen.`,
  },
  {
    question: "Wann hat die Fußpflege geöffnet?",
    answer: "Reguläre Termine sind Montag bis Freitag von 09:00 bis 15:00 Uhr möglich. Samstag und Sonntag ist geschlossen.",
  },
  {
    question: "Was ist die Smart Pediküre?",
    answer: "Die Smart Pediküre ist unsere empfohlene moderne Fußpflege mit sanfter Hornhautentfernung, geformten Nägeln und pflegendem Öl für ein langanhaltend gepflegtes Gefühl.",
  },
  {
    question: "Gibt es Gutscheine?",
    answer: "Ja, Gutscheine sind erhältlich. Fragen Sie uns einfach direkt an.",
  },
  {
    question: "Was muss ich zur Fußpflege mitbringen?",
    answer: "Bitte bringen Sie ein kleines Handtuch zur Fußpflege mit.",
  },
  {
    question: "Wie sind die Stornierungsbedingungen?",
    answer: "Bitte sagen Sie Ihren Termin mindestens 24 Stunden vorher ab. Nicht rechtzeitig abgesagte Termine können mit 25 EUR berechnet werden.",
  },
] as const;
