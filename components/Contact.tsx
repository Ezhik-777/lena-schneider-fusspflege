'use client';

import { Mail, Phone, MapPin, Clock, Navigation } from 'lucide-react';
import { BUSINESS_INFO } from '@/lib/constants';

export default function Contact() {
  const googleMapsUrl = `https://maps.google.com/?q=${encodeURIComponent(BUSINESS_INFO.address.fullAddress)}`;

  return (
    <section id="contact" className="bg-gradient-to-b from-white via-gray-50 to-white py-16 sm:py-20 lg:py-24" aria-labelledby="contact-heading">
      <div className="container">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-block animate-fade-in">
            <span className="text-primary-600 font-semibold text-xs sm:text-sm uppercase tracking-wider bg-primary-50 px-4 py-2 rounded-full shadow-sm">
              Kontakt & Anfahrt
            </span>
          </div>
          <h2 id="contact-heading" className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mt-6 mb-4 animate-slide-up">
            Besuchen Sie uns in <span className="text-primary-600">Erligheim</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto animate-slide-up">
            Wir freuen uns auf Ihren Besuch in unserem gemütlichen Salon!
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-12">
          {/* Phone */}
          <a
            href={BUSINESS_INFO.contact.phoneHref}
            className="group bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
          >
            <div className="w-14 h-14 bg-gradient-to-br from-primary-100 to-primary-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Phone className="text-primary-600" size={26} />
            </div>
            <h3 className="font-bold text-gray-900 mb-2 text-lg">Telefon</h3>
            <p className="text-primary-600 font-semibold text-lg mb-2">
              {BUSINESS_INFO.contact.phoneFormatted}
            </p>
            <p className="text-sm text-gray-500">{BUSINESS_INFO.hours.weekdays}</p>
          </a>

          {/* Email */}
          <a
            href={BUSINESS_INFO.contact.emailHref}
            className="group bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
          >
            <div className="w-14 h-14 bg-gradient-to-br from-primary-100 to-primary-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Mail className="text-primary-600" size={26} />
            </div>
            <h3 className="font-bold text-gray-900 mb-2 text-lg">E-Mail</h3>
            <p className="text-primary-600 font-semibold text-xs break-words hover:underline leading-relaxed">
              {BUSINESS_INFO.contact.email}
            </p>
          </a>

          {/* Location */}
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
          >
            <div className="w-14 h-14 bg-gradient-to-br from-primary-100 to-primary-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <MapPin className="text-primary-600" size={26} />
            </div>
            <h3 className="font-bold text-gray-900 mb-2 text-lg">Adresse</h3>
            <p className="text-gray-700 font-medium leading-relaxed">
              {BUSINESS_INFO.address.street}<br />
              {BUSINESS_INFO.address.postalCode} {BUSINESS_INFO.address.city}<br />
              {BUSINESS_INFO.address.country}
            </p>
            <p className="text-primary-600 text-sm mt-2 flex items-center group-hover:underline">
              <Navigation size={14} className="mr-1" />
              Route anzeigen
            </p>
          </a>

          {/* Opening Hours */}
          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
            <div className="w-14 h-14 bg-gradient-to-br from-primary-100 to-primary-50 rounded-xl flex items-center justify-center mb-4">
              <Clock className="text-primary-600" size={26} />
            </div>
            <h3 className="font-bold text-gray-900 mb-3 text-lg">Öffnungszeiten</h3>
            <div className="text-gray-700 space-y-2 text-sm font-medium">
              <div className="flex justify-between">
                <span>Mo - Fr:</span>
                <span className="text-primary-600">9:00 - 16:00</span>
              </div>
              <div className="flex justify-between">
                <span>Sa:</span>
                <span className="text-gray-500">Nach Vereinbarung</span>
              </div>
              <div className="flex justify-between">
                <span>So:</span>
                <span className="text-gray-400">Geschlossen</span>
              </div>
            </div>
          </div>
        </div>

        {/* Google Maps Embed */}
        <div className="max-w-6xl mx-auto mb-12">
          <div className="bg-white p-4 rounded-2xl shadow-xl border border-gray-100">
            <div className="aspect-video rounded-xl overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.5!2d9.0667!3d48.9615!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDjCsDU3JzQxLjQiTiA5wrAwNCcwMC4xIkU!5e0!3m2!1sde!2sde!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Standort: Löchgauer str. 17, 74391 Erligheim"
              ></iframe>
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="bg-gradient-to-br from-primary-50 to-cyan-50 p-6 sm:p-8 rounded-2xl border-2 border-primary-100 shadow-lg">
            <h4 className="font-bold text-primary-900 mb-3 flex items-center text-lg">
              <Clock className="mr-2 flex-shrink-0" size={22} />
              Terminvereinbarung erforderlich
            </h4>
            <p className="text-primary-800 leading-relaxed">
              Alle Behandlungen finden <strong>ausschließlich nach vorheriger Terminabsprache</strong> statt.
              Termine außerhalb der regulären Öffnungszeiten sind nach Absprache möglich.
            </p>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 sm:p-8 rounded-2xl border-2 border-amber-200 shadow-lg">
            <h4 className="font-bold text-amber-900 mb-3 text-lg">
              Stornierungsbedingungen
            </h4>
            <p className="text-amber-800 leading-relaxed">
              Bitte sagen Sie Termine <strong>mindestens 24 Stunden vorher</strong> ab.
              Nicht rechtzeitig abgesagte Termine werden mit <strong className="text-amber-900">25€</strong> berechnet.
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
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 active:from-primary-800 active:to-primary-900 text-white px-8 sm:px-10 py-4 sm:py-5 rounded-xl font-bold transition-all shadow-xl hover:shadow-2xl active:scale-95 text-base sm:text-lg group"
          >
            Jetzt Termin vereinbaren
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
