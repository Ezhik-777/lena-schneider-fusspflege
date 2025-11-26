'use client';

import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export default function Contact() {
  return (
    <section id="contact" className="bg-gradient-to-b from-white to-gray-50 py-16 sm:py-20" aria-labelledby="contact-heading">
      <div className="container">
        <div className="text-center mb-12">
          <div className="inline-block">
            <span className="text-primary-600 font-semibold text-xs sm:text-sm uppercase tracking-wider bg-primary-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full">
              Kontakt & Anfahrt
            </span>
          </div>
          <h2 id="contact-heading" className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mt-4 mb-4">
            Besuchen Sie uns in <span className="text-primary-600">Sachsenheim</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Rufen Sie uns an oder besuchen Sie unseren gemütlichen Salon in Sachsenheim.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {/* Phone */}
          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <Phone className="text-primary-600" size={24} />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Telefon</h3>
            <a
              href="tel:+4917634237368"
              className="text-primary-600 hover:text-primary-700 transition-colors font-semibold block mb-2"
            >
              +49 176 34237368
            </a>
            <p className="text-sm text-gray-500">Mo - Fr: 9:00 - 16:00 Uhr</p>
          </div>

          {/* Email */}
          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <Mail className="text-primary-600" size={24} />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">E-Mail</h3>
            <a
              href="mailto:info@fusspflege-lena-schneider.de"
              className="text-primary-600 hover:text-primary-700 transition-colors text-sm break-all block"
            >
              info@fusspflege-lena-schneider.de
            </a>
          </div>

          {/* Location */}
          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <MapPin className="text-primary-600" size={24} />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Standort</h3>
            <p className="text-gray-600">
              Sachsenheim<br />
              Baden-Württemberg<br />
              Deutschland
            </p>
          </div>

          {/* Opening Hours */}
          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <Clock className="text-primary-600" size={24} />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Öffnungszeiten</h3>
            <div className="text-gray-600 space-y-1 text-sm">
              <p>Mo - Fr: 9:00 - 16:00</p>
              <p>Sa: Nach Vereinbarung</p>
              <p>So: Geschlossen</p>
            </div>
          </div>
        </div>

        {/* Important Note */}
        <div className="mt-8 max-w-4xl mx-auto">
          <div className="bg-primary-50 p-6 rounded-xl border border-primary-100">
            <h4 className="font-semibold text-primary-900 mb-2 flex items-center">
              <Clock className="mr-2" size={20} />
              Terminvereinbarung
            </h4>
            <p className="text-sm text-primary-800">
              Behandlungen finden ausschließlich nach vorheriger Terminabsprache statt.
              Termine außerhalb der Öffnungszeiten sind nach Absprache möglich.
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-12 text-center">
          <a
            href="#booking"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-block bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white px-8 py-4 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg active:scale-95 text-lg"
          >
            Jetzt Termin vereinbaren
          </a>
        </div>
      </div>
    </section>
  );
}
