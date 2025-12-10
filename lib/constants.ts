/**
 * Единый источник контактных данных для всего сайта
 * Single source of truth for all contact information
 */

export const BUSINESS_INFO = {
  name: "Unser Salon bei Ella Schön",
  location: "Erligheim",
  owner: "Elena Schneider",

  contact: {
    phone: "+49 176 34237368",
    phoneFormatted: "+49 176 34237368",
    phoneHref: "tel:+4917634237368",
    email: "info@fusspflege-lena-schneider.de",
    emailHref: "mailto:info@fusspflege-lena-schneider.de",
  },

  address: {
    street: "Löchgauer str. 17",
    postalCode: "74391",
    city: "Erligheim",
    region: "Baden-Württemberg",
    country: "Deutschland",
    fullAddress: "Löchgauer str. 17, 74391 Erligheim",
  },

  geo: {
    latitude: 48.9615,
    longitude: 9.0667,
  },

  hours: {
    weekdays: "Mo - Fr: 09:00 - 16:00 Uhr",
    saturday: "Sa: Nach Vereinbarung",
    sunday: "So: Geschlossen",
    note: "Termine nach Vereinbarung auch außerhalb der Öffnungszeiten möglich",
  },

  social: {
    facebook: "https://facebook.com/fusspflege.lena.schneider",
    instagram: "https://instagram.com/fusspflege.lena.schneider",
    linkedin: "https://linkedin.com", // Optional
  },

  seo: {
    domain: "https://fusspflege-lena-schneider.de",
    title: "Fußpflege bei Ella Schön | Kosmetische Fußpflege & Pediküre in Erligheim",
    description: "Professionelle kosmetische Fußpflege in Erligheim bei Ella Schön ✓ Smart Pediküre ✓ Klassische Fachfußpflege ✓ Fußreflexzonenmassage ✓ Termine nach Vereinbarung",
  },

  legal: {
    vatId: null, // Keine USt-IdNr. - Kleinunternehmer gemäß § 19 UStG
    kleinunternehmer: true, // Kleinunternehmerregelung nach § 19 UStG
    registrationCourt: null, // Nicht erforderlich für Einzelunternehmer
    registrationNumber: null, // Nicht erforderlich für Einzelunternehmer
  },
} as const;

// Service-Kategorien
export const SERVICES = [
  {
    id: "smart-pediküre",
    title: "Smart Pediküre",
    description: "Moderne Form der Fußpflege: Hornhaut wird sanft entfernt, die Nägel werden geformt und die Haut mit Pflegeöl gepflegt. Das sorgt für glatte, gepflegte Füße und ein langanhaltendes Frischegefühl.",
    price: "55 €",
    duration: "50 Min.",
    icon: "✨",
    benefits: [
      "Sanfte Hornhautentfernung",
      "Nägel formen",
      "Hautpflege mit Pflegeöl",
      "Langanhaltendes Frischegefühl"
    ],
  },
  {
    id: "klassische-fußpflege",
    title: "Klassische Fachfußpflege mit Peeling",
    description: "Professionelle kosmetische Fußpflege für gesunde und gepflegte Füße.",
    price: "49 €",
    duration: "45 Min.",
    icon: "🦶",
    note: "Aufpreis für Shellac: +11€",
    benefits: [
      "Nägel schneiden/kürzen",
      "Nagelhautentfernung",
      "Hornhautentfernung",
      "Pflege der Nägel und Füße"
    ],
  },
  {
    id: "massage",
    title: "Fußreflexzonenmassage",
    description: "Entspannende Massage für Stressabbau.",
    price: "35 €",
    duration: "30 Min.",
    icon: "🌊",
    benefits: ["Stressabbau und Entspannung"],
  },
  {
    id: "nagelkorrektur",
    title: "Kosmetische Nagelkorrektur",
    description: "Sanfte kosmetische Methode zur Nagelkorrektur.",
    price: "29 €",
    duration: "10 Min.",
    icon: "✂️",
    note: "Ohne Fußpflege",
    benefits: [
      "Sanfte kosmetische Methode",
      "Kaum sichtbar",
      "Pro Nagel"
    ],
  },
  {
    id: "fremdmodellage-entfernen",
    title: "Fremdmodellage entfernen",
    description: "Professionelle und schonende Entfernung von Shellac-Lack.",
    price: "15 €",
    duration: "10-15 Min.",
    icon: "💧",
    benefits: [
      "Schonende Entfernung",
      "Schnell und effektiv",
      "Ohne Beschädigung der Nägel"
    ],
  },
  {
    id: "natuerliche-manikuere",
    title: "Natürliche Maniküre ohne Verlängerung",
    description: "Naturnagel-Maniküre für gepflegte und schöne Hände.",
    price: "30 €",
    duration: "40 Min.",
    icon: "💅",
    note: "Aufpreis für Shellac 11 €",
    benefits: [
      "Nägel werden gekürzt, gefeilt und in Form gebracht",
      "Nagelhaut wird sanft entfernt",
      "Poliert und geölt"
    ],
  },
  {
    id: "paraffinbehandlung",
    title: "Kosmetische Paraffinbehandlung",
    description: "Wohltuende Wärmebehandlung für gepflegte, geschmeidige Haut. Das Paraffinbad spendet intensive Feuchtigkeit und macht Hände oder Füße wunderbar weich. Ideal bei trockener oder beanspruchter Haut – für ein spürbar zartes Hautgefühl.",
    price: "ab 19 €",
    duration: "30 Min.",
    icon: "🔥",
    note: "Nur kosmetische Pflegebehandlung – keine medizinische Anwendung",
    priceOptions: [
      { label: "Hände", price: "19 €" },
      { label: "Füße", price: "19 €" },
      { label: "Kombi", price: "35 €" }
    ],
    benefits: [
      "Intensive Feuchtigkeitspflege",
      "Wunderbar weiche Haut",
      "Ideal bei trockener Haut"
    ],
  },
] as const;

// Öffnungszeiten strukturiert
export const OPENING_HOURS = [
  {
    days: "Montag - Freitag",
    hours: "09:00 - 16:00 Uhr",
  },
  {
    days: "Samstag",
    hours: "Nach Vereinbarung",
  },
  {
    days: "Sonntag",
    hours: "Geschlossen",
  },
] as const;
