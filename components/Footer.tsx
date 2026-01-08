'use client';

import Link from 'next/link';
import { Phone, Mail, MapPin, ArrowUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { BUSINESS_INFO } from '@/lib/constants';

export default function Footer() {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling down 300px
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer role="contentinfo" className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="container py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-white text-xl font-bold mb-4">
              Fußpflege Lena Schneider
            </h3>
            <p className="text-sm leading-relaxed">
              Professionelle kosmetische Fußpflege in Erligheim bei Ella Schön.
              Für gesunde und gepflegte Füße in entspannter Salon-Atmosphäre.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Schnellzugriff</h3>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => {
                    const el = document.getElementById('about');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-primary-400 transition-colors text-sm"
                >
                  Über uns
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    const el = document.getElementById('services');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-primary-400 transition-colors text-sm"
                >
                  Leistungen
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    const el = document.getElementById('benefits');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-primary-400 transition-colors text-sm"
                >
                  Vorteile
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    const el = document.getElementById('contact');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-primary-400 transition-colors text-sm"
                >
                  Kontakt
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    const el = document.getElementById('booking');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-primary-400 transition-colors text-sm"
                >
                  Termin buchen
                </button>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Unsere Leistungen</h3>
            <ul className="space-y-3 text-sm">
              <li className="hover:text-primary-400 transition-colors">
                Präventive Kosmetische Fußpflege
              </li>
              <li className="hover:text-primary-400 transition-colors">
                Smart Pediküre
              </li>
              <li className="hover:text-primary-400 transition-colors">
                Klassische Fußpflege
              </li>
              <li className="hover:text-primary-400 transition-colors">
                Wellness-Fußreflexzonenmassage
              </li>
              <li className="hover:text-primary-400 transition-colors">
                Kosmetische Nagelkorrektur
              </li>
              <li className="hover:text-primary-400 transition-colors">
                Shellac nur entfernen
              </li>
              <li className="hover:text-primary-400 transition-colors">
                Nagelmodellage mit Gel
              </li>
              <li className="hover:text-primary-400 transition-colors">
                Kosmetische Paraffinbehandlung
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Kontakt</h3>
            <ul className="space-y-4">
              <li>
                <a
                  href={BUSINESS_INFO.contact.phoneHref}
                  className="flex items-start space-x-3 hover:text-primary-400 transition-colors text-sm"
                >
                  <Phone size={18} className="mt-0.5 flex-shrink-0" />
                  <span>{BUSINESS_INFO.contact.phoneFormatted}</span>
                </a>
              </li>
              <li>
                <a
                  href={BUSINESS_INFO.contact.emailHref}
                  className="flex items-start space-x-3 hover:text-primary-400 transition-colors text-sm"
                >
                  <Mail size={18} className="mt-0.5 flex-shrink-0" />
                  <span>{BUSINESS_INFO.contact.email}</span>
                </a>
              </li>
              <li className="flex items-start space-x-3 text-sm">
                <MapPin size={18} className="mt-0.5 flex-shrink-0" />
                <span>
                  {BUSINESS_INFO.address.street}<br />
                  {BUSINESS_INFO.address.postalCode} {BUSINESS_INFO.address.city}<br />
                  {BUSINESS_INFO.address.country}
                </span>
              </li>
            </ul>

            {/* Cancellation Policy */}
            <div className="mt-6 pt-6 border-t border-gray-700">
              <p className="text-xs text-amber-400 font-semibold leading-relaxed">
                Nicht rechtzeitig abgesagte Termine werden mit 25€ berechnet.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-400">
              © {currentYear} Fußpflege Lena Schneider. Alle Rechte vorbehalten.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <Link
                href="/impressum"
                className="hover:text-primary-400 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-gray-900 rounded px-2 py-1"
              >
                Impressum
              </Link>
              <Link
                href="/datenschutz"
                className="hover:text-primary-400 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-gray-900 rounded px-2 py-1"
              >
                Datenschutz
              </Link>
              <Link
                href="/barrierefreiheit"
                className="hover:text-primary-400 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-gray-900 rounded px-2 py-1"
              >
                Barrierefreiheit
              </Link>
              <button
                onClick={() => {
                  // Open cookie settings
                  if (typeof window !== 'undefined') {
                    localStorage.removeItem('cookieConsent');
                    window.location.reload();
                  }
                }}
                className="hover:text-primary-400 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-gray-900 rounded px-2 py-1"
              >
                Cookie-Einstellungen
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button - Only show when scrolled */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 w-11 h-11 sm:w-12 sm:h-12 bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center z-40 animate-in fade-in slide-in-from-bottom-4 duration-300 touch-manipulation group"
          aria-label="Nach oben scrollen"
        >
          <ArrowUp size={20} className="group-hover:-translate-y-0.5 transition-transform" aria-hidden="true" />
        </button>
      )}
    </footer>
  );
}
