'use client';

import ContactForm from './ContactForm';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export default function Contact() {
  return (
    <section id="contact" className="bg-gradient-to-b from-white to-gray-50 py-16 sm:py-20" aria-labelledby="contact-heading">
      <div className="container">
        <div className="text-center mb-12">
          <div className="inline-block">
            <span className="text-primary-600 font-semibold text-xs sm:text-sm uppercase tracking-wider bg-primary-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full">
              Kontakt
            </span>
          </div>
          <h2 id="contact-heading" className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mt-4 mb-4">
            Kontaktieren Sie uns
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Füllen Sie das Formular aus oder rufen Sie uns an, um einen Termin zu vereinbaren.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Kontaktinformationen</h3>

              <div className="space-y-6">
                {/* Phone */}
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="text-primary-600" size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Telefon</h4>
                    <a
                      href="tel:+4917634237368"
                      className="text-primary-600 hover:text-primary-700 transition-colors"
                    >
                      +49 176 34237368
                    </a>
                    <p className="text-sm text-gray-500 mt-1">Mo - Fr: 9:00 - 16:00 Uhr</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="text-primary-600" size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">E-Mail</h4>
                    <a
                      href="mailto:info@fusspflege-lena-schneider.de"
                      className="text-primary-600 hover:text-primary-700 transition-colors break-all"
                    >
                      info@fusspflege-lena-schneider.de
                    </a>
                    <p className="text-sm text-gray-500 mt-1">Wir antworten innerhalb von 24h</p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="text-primary-600" size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Standort</h4>
                    <p className="text-gray-600">
                      Sachsenheim<br />
                      Baden-Württemberg, Deutschland
                    </p>
                  </div>
                </div>

                {/* Opening Hours */}
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="text-primary-600" size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Öffnungszeiten</h4>
                    <div className="text-gray-600 space-y-1">
                      <p>Montag - Freitag: 9:00 - 16:00 Uhr</p>
                      <p>Samstag: Nach Vereinbarung</p>
                      <p>Sonntag: Geschlossen</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-primary-50 p-6 rounded-xl border border-primary-100">
              <h4 className="font-semibold text-primary-900 mb-2">Schnelle Antwort</h4>
              <p className="text-sm text-primary-800">
                Für eine schnellere Bearbeitung Ihrer Anfrage empfehlen wir,
                Ihre Telefonnummer anzugeben. So können wir Sie direkt kontaktieren
                und Ihre Fragen schneller beantworten.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Nachricht senden</h3>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
