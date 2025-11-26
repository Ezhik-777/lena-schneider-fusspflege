'use client';

import { useState, useEffect } from 'react';
import { Menu, X, Phone } from 'lucide-react';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  const menuItems = [
    { label: 'Über uns', id: 'about' },
    { label: 'Leistungen', id: 'services' },
    { label: 'Vorteile', id: 'benefits' },
    { label: 'Kontakt', id: 'contact' },
    { label: 'Termin buchen', id: 'booking' },
  ];

  return (
    <header
      role="banner"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white shadow-md py-3.5 sm:py-4'
          : 'bg-white/95 backdrop-blur-sm py-4 sm:py-6'
      }`}
    >
      <div className="container px-5 sm:px-6">
        <div className="flex items-center justify-between min-h-[44px]">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => scrollToSection('hero')}
              aria-label="Zur Startseite - Fußpflege Lena Schneider"
              className="text-[1.0625rem] sm:text-xl md:text-2xl font-bold text-primary-700 hover:text-primary-800 transition-colors leading-tight min-h-[44px] flex items-center focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-lg px-2"
            >
              Fußpflege Lena Schneider
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8" aria-label="Hauptnavigation">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                aria-label={`Navigieren zu ${item.label}`}
                className="text-gray-700 hover:text-primary-600 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded px-2 py-1"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center space-x-3 xl:space-x-4">
            <a
              href="tel:+4917634237368"
              className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors touch-manipulation"
            >
              <Phone size={18} className="xl:w-5 xl:h-5" />
              <span className="font-semibold text-sm xl:text-base">+49 176 34237368</span>
            </a>
            <button
              onClick={() => scrollToSection('booking')}
              className="bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white px-5 xl:px-6 py-2.5 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg active:scale-95 touch-manipulation text-sm xl:text-base"
            >
              Termin vereinbaren
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Menü schließen" : "Menü öffnen"}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            className="lg:hidden p-2.5 text-gray-700 hover:text-primary-600 transition-colors touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded"
          >
            {isMobileMenuOpen ? <X size={28} className="sm:w-7 sm:h-7" aria-hidden="true" /> : <Menu size={28} className="sm:w-7 sm:h-7" aria-hidden="true" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div id="mobile-menu" className="lg:hidden mt-5 sm:mt-6 pb-5 sm:pb-6 border-t border-gray-200 pt-5 sm:pt-6 animate-in slide-in-from-top duration-300">
            <nav aria-label="Mobile Navigation" className="flex flex-col space-y-1 sm:space-y-4">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-gray-700 hover:text-primary-600 active:text-primary-700 transition-colors font-semibold text-left py-3.5 sm:py-2 touch-manipulation text-[1.0625rem] sm:text-lg min-h-[52px] flex items-center"
                >
                  {item.label}
                </button>
              ))}
              <a
                href="tel:+4917634237368"
                className="flex items-center space-x-3 text-primary-600 hover:text-primary-700 active:text-primary-800 transition-colors py-3.5 sm:py-2 touch-manipulation min-h-[52px]"
              >
                <Phone size={22} />
                <span className="font-bold text-[1.0625rem] sm:text-lg">+49 176 34237368</span>
              </a>
              <button
                onClick={() => scrollToSection('booking')}
                className="bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white px-6 py-4 sm:py-3 rounded-xl font-bold transition-all shadow-md active:scale-95 w-full touch-manipulation text-[1.0625rem] sm:text-lg min-h-[56px] mt-2"
              >
                Termin vereinbaren
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
