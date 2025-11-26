/**
 * Единый источник контактных данных для всего сайта
 * Single source of truth for all contact information
 */

export const BUSINESS_INFO = {
  name: "Fußpflege Sachsenheim",
  owner: "Elena Schneider",

  contact: {
    phone: "+49 176 34237368",
    phoneFormatted: "+49 176 34237368",
    phoneHref: "tel:+4917634237368",
    email: "info@fusspflege-lena-schneider.de",
    emailHref: "mailto:info@fusspflege-lena-schneider.de",
  },

  address: {
    street: "Brunnenstraße 25",
    postalCode: "74343",
    city: "Sachsenheim",
    region: "Baden-Württemberg",
    country: "Deutschland",
    fullAddress: "Brunnenstraße 25, 74343 Sachsenheim",
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
    title: "Fußpflege Lena Schneider | Kosmetische Fußpflege & Pediküre in Sachsenheim",
    description: "Professionelle kosmetische Fußpflege in Sachsenheim ✓ Nagelpilzbehandlung ✓ B/S Spangentechnik ✓ Fußreflexzonenmassage ✓ Termine nach Vereinbarung",
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
    id: "praventive-fusspflege",
    title: "Präventive Kosmetische Fußpflege",
    description: "Sanfte, kosmetische Behandlung zur Verbesserung des Haut- und Nagelbildes. Unterstützt die natürliche Regeneration und sorgt für hygienisch gepflegte Füße.",
    price: "60 €",
    duration: "ca. 20 Min.",
    icon: "🌿",
  },
  {
    id: "smart-pediküre",
    title: "Smart Pediküre",
    description: "Moderne Form der Fußpflege: Hornhaut wird sanft entfernt, die Nägel werden geformt und die Haut mit Pflegeöl gepflegt",
    price: "55 €",
    duration: "ca. 50 Min.",
    icon: "✨",
  },
  {
    id: "klassische-fußpflege",
    title: "Klassische Fachfußpflege mit Peeling",
    description: "Professionelle kosmetische Fußpflege für gesunde und gepflegte Füße",
    price: "49 €",
    duration: "ca. 45 Min.",
    icon: "🦶",
    note: "Aufpreis für Shellac: +9€",
  },
  {
    id: "massage",
    title: "Fußreflexzonenmassage",
    description: "Entspannende Massage für Stressabbau",
    price: "35 €",
    duration: "ca. 30 Min.",
    icon: "💆",
  },
  {
    id: "nagelkorrektur",
    title: "Kosmetische Nagelkorrektur",
    description: "Sanfte kosmetische Methode zur Nagelkorrektur",
    price: "29 €",
    duration: "ca. 10 Min.",
    icon: "🔧",
    note: "Ohne Fußpflege",
  },
  {
    id: "shellac-entfernen",
    title: "Shellac nur entfernen",
    description: "Professionelle und schonende Entfernung von Shellac-Lack",
    price: "15 €",
    duration: "ca. 15-20 Min.",
    icon: "🧴",
  },
  {
    id: "nagelmodellage",
    title: "Nagelmodellage mit Gel",
    description: "Professionelle Gel-Nagelmodellage für gepflegte und schöne Hände",
    price: "45 €",
    duration: "ca. 60 Min.",
    icon: "💅",
  },
  {
    id: "paraffinbehandlung",
    title: "Kosmetische Paraffinbehandlung",
    description: "Wohltuende Wärmebehandlung für gepflegte, geschmeidige Haut. Das Paraffinbad spendet intensive Feuchtigkeit und macht Hände oder Füße wunderbar weich. Ideal bei trockener oder beanspruchter Haut – für ein spürbar zartes Hautgefühl.",
    price: "Hände: 19 € | Füße: 19 € | Kombi: 35 €",
    duration: "ca. 20 Min.",
    icon: "💅",
    note: "Nur kosmetische Pflegebehandlung – keine medizinische Anwendung",
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
