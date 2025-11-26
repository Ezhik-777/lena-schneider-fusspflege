'use client';

import { useState, useEffect } from 'react';
import { Menu, X, Phone, Calendar } from 'lucide-react';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Track active section for highlighting
      const sections = ['hero', 'about', 'services', 'benefits', 'contact'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) setActiveSection(current);
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
  ];

  return (
    <header
      role="banner"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/98 backdrop-blur-md shadow-lg py-3 sm:py-3.5'
          : 'bg-white/95 backdrop-blur-sm py-4 sm:py-5'
      }`}
    >
      <div className="container px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo - Improved with gradient */}
          <button
            onClick={() => scrollToSection('hero')}
            aria-label="Zur Startseite - Fußpflege Lena Schneider"
            className="group flex items-center space-x-2 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-lg px-2 -ml-2"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <span className="text-white font-bold text-sm sm:text-base">LS</span>
            </div>
            <span className="text-base sm:text-lg md:text-xl font-bold bg-gradient-to-r from-primary-700 to-primary-600 bg-clip-text text-transparent group-hover:from-primary-800 group-hover:to-primary-700 transition-all leading-tight hidden sm:block">
              Lena Schneider
            </span>
          </button>

          {/* Desktop Navigation - Enhanced with active states */}
          <nav className="hidden lg:flex items-center space-x-1" aria-label="Hauptnavigation">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                aria-label={`Navigieren zu ${item.label}`}
                className={`relative px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeSection === item.id
                    ? 'text-primary-700 bg-primary-50'
                    : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                }`}
              >
                {item.label}
                {activeSection === item.id && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-primary-600 rounded-full"></span>
                )}
              </button>
            ))}
          </nav>

          {/* Desktop CTA - Enhanced styling */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="tel:+4917634237368"
              className="group flex items-center gap-2 px-4 py-2 text-primary-700 hover:text-primary-800 hover:bg-primary-50 rounded-lg transition-all duration-200 font-medium"
            >
              <Phone size={18} className="group-hover:rotate-12 transition-transform" />
              <span className="text-sm">+49 176 34237368</span>
            </a>
            <button
              onClick={() => scrollToSection('booking')}
              className="group flex items-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-6 py-2.5 rounded-lg font-semibold transition-all duration-200 shadow-lg shadow-primary-600/30 hover:shadow-xl hover:shadow-primary-700/40 hover:-translate-y-0.5"
            >
              <Calendar size={18} className="group-hover:scale-110 transition-transform" />
              <span className="text-sm">Termin buchen</span>
            </button>
          </div>

          {/* Mobile: Phone + Menu */}
          <div className="flex lg:hidden items-center gap-2">
            <a
              href="tel:+4917634237368"
              className="p-2.5 text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-all"
              aria-label="Anrufen"
            >
              <Phone size={22} />
            </a>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Menü schließen" : "Menü öffnen"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              className="p-2.5 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-all min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              {isMobileMenuOpen ? (
                <X size={24} className="transition-transform rotate-90" />
              ) : (
                <Menu size={24} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu - Enhanced with animations */}
        {isMobileMenuOpen && (
          <div
            id="mobile-menu"
            className="lg:hidden mt-4 pt-4 border-t border-gray-200 animate-in slide-in-from-top-2 fade-in duration-300"
          >
            <nav aria-label="Mobile Navigation" className="flex flex-col gap-2">
              {menuItems.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  style={{ animationDelay: `${index * 50}ms` }}
                  className={`animate-in slide-in-from-left fade-in duration-300 text-left px-4 py-3.5 rounded-lg font-semibold transition-all ${
                    activeSection === item.id
                      ? 'bg-primary-600 text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-50 active:bg-gray-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}

              <div className="h-px bg-gray-200 my-2"></div>

              <button
                onClick={() => scrollToSection('booking')}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-4 rounded-xl font-bold shadow-lg shadow-primary-600/30 active:scale-98 transition-all animate-in slide-in-from-bottom fade-in duration-300"
                style={{ animationDelay: '200ms' }}
              >
                <Calendar size={20} />
                <span>Jetzt Termin buchen</span>
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
