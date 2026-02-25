import { useState, useEffect, useCallback } from 'react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { label: 'Leistungen', href: '#services' },
  { label: '\u00dcber uns', href: '#about' },
  { label: 'Kontakt', href: '#contact' },
];

function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleLinkClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      onClose();
      const id = href.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    },
    [onClose]
  );

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-olive/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Menu Panel */}
      <div
        className={`fixed top-16 sm:top-20 left-0 right-0 z-50 lg:hidden transition-all duration-300 ease-in-out ${
          isOpen
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation"
      >
        <div className="bg-cream shadow-lg border-t border-gold-light/30">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
            <ul className="space-y-0">
              {navItems.map((item, index) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={(e) => handleLinkClick(e, item.href)}
                    className={`block py-4 text-olive font-body text-lg hover:text-sage transition-colors duration-200 ${
                      index < navItems.length - 1
                        ? 'border-b border-gold-light/30'
                        : ''
                    }`}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>

            {/* Phone Link */}
            <a
              href="tel:+4917634237368"
              className="flex items-center gap-3 py-4 mt-2 text-text-muted font-body hover:text-sage transition-colors duration-200 border-b border-gold-light/30"
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span>0176 3423 7368</span>
            </a>

            {/* CTA Button */}
            <div className="pt-4 pb-2">
              <a
                href="#booking"
                onClick={(e) => handleLinkClick(e, '#booking')}
                className="block w-full text-center bg-terracotta hover:bg-terracotta-dark text-white rounded-organic-sm px-6 py-4 font-body font-bold text-base transition-colors duration-200"
              >
                Termin buchen
              </a>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}

export function MobileMenuToggle() {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  return (
    <>
      {/* Hamburger / Close Button */}
      <button
        onClick={handleToggle}
        className="flex items-center justify-center w-10 h-10 text-olive hover:text-sage transition-colors duration-200"
        aria-label={isOpen ? 'Navigation schlie\u00dfen' : 'Navigation \u00f6ffnen'}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <svg
            className="w-6 h-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg
            className="w-6 h-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        )}
      </button>

      {/* Mobile Menu */}
      <MobileMenu isOpen={isOpen} onClose={handleClose} />
    </>
  );
}

export default MobileMenu;
