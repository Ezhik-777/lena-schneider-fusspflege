import { useState, useEffect } from 'react';

interface CookiePreferences {
  necessary: boolean;
  functional: boolean;
  analytics: boolean;
}

const CONSENT_STORAGE_KEY = 'cookieConsent';

function notifyConsentChange(preferences: CookiePreferences) {
  window.dispatchEvent(
    new CustomEvent('cookie-consent-updated', {
      detail: preferences,
    }),
  );
}

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always true, cannot be disabled
    functional: false,
    analytics: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!consent) {
      setTimeout(() => setShowBanner(true), 1000);
    } else {
      try {
        const saved = JSON.parse(consent);
        setPreferences(saved);
        notifyConsentChange(saved);
      } catch (e) {
        console.error('Error parsing cookie preferences:', e);
        localStorage.removeItem(CONSENT_STORAGE_KEY);
        setTimeout(() => setShowBanner(true), 1000);
      }
    }
  }, []);

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(prefs));
    setPreferences(prefs);
    setShowBanner(false);
    setShowSettings(false);
    notifyConsentChange(prefs);
  };

  const acceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      functional: true,
      analytics: true,
    };
    savePreferences(allAccepted);
  };

  const acceptNecessary = () => {
    const necessaryOnly: CookiePreferences = {
      necessary: true,
      functional: false,
      analytics: false,
    };
    savePreferences(necessaryOnly);
  };

  const saveCustom = () => {
    savePreferences(preferences);
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-warm-white border-t-2 border-gold-light shadow-2xl animate-in slide-in-from-bottom duration-500">
        <div className="container py-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            {/* Content */}
            <div className="flex-1">
              <h3 className="text-lg font-display text-olive mb-2">
                Diese Website verwendet Cookies
              </h3>
              <p className="text-text-muted text-sm leading-relaxed">
                Wir verwenden Cookies, um Inhalte zu personalisieren, Funktionen für soziale
                Medien anbieten zu können und die Zugriffe auf unsere Website zu analysieren.
                Weitere Informationen finden Sie in unserer{' '}
                <a
                  href="/datenschutz"
                  className="text-sage hover:text-sage-dark underline font-semibold"
                >
                  Datenschutzerklärung
                </a>
                .
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <button
                onClick={() => setShowSettings(true)}
                className="px-6 py-3 bg-sage-50 hover:bg-sage-100 text-olive rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 whitespace-nowrap"
              >
                {/* Settings gear SVG icon */}
                <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Einstellungen</span>
              </button>
              <button
                onClick={acceptNecessary}
                className="px-6 py-3 border-2 border-sage text-olive hover:bg-sage-50 rounded-lg font-semibold transition-colors whitespace-nowrap"
              >
                Nur notwendige
              </button>
              <button
                onClick={acceptAll}
                className="px-6 py-3 bg-terracotta hover:bg-terracotta-dark text-white rounded-lg font-semibold transition-colors shadow-md whitespace-nowrap"
              >
                Alle akzeptieren
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cookie Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 animate-in fade-in duration-300">
          <div className="bg-warm-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
            {/* Header */}
            <div className="sticky top-0 bg-warm-white border-b border-gold-light/30 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-2xl font-display text-olive">Cookie-Einstellungen</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="p-2 hover:bg-sage-50 rounded-lg transition-colors"
                aria-label="Schließen"
              >
                {/* X close SVG icon */}
                <svg className="w-6 h-6 text-olive" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-6 space-y-6">
              <p className="text-text-muted">
                Wir verwenden Cookies, um Ihre Erfahrung auf unserer Website zu verbessern.
                Sie können auswählen, welche Cookie-Kategorien Sie zulassen möchten.
              </p>

              {/* Necessary Cookies */}
              <div className="border border-gold-light/30 rounded-lg p-5 bg-sage-50">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-olive mb-1 flex items-center">
                      <span className="mr-2">&#10003;</span>
                      Notwendige Cookies
                    </h3>
                    <p className="text-sm text-text-muted">
                      Diese Cookies sind für die Grundfunktionen der Website erforderlich und
                      können nicht deaktiviert werden.
                    </p>
                  </div>
                  <div className="ml-4">
                    <div className="w-12 h-6 bg-sage rounded-full flex items-center justify-end px-1">
                      <div className="w-4 h-4 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>
                <div className="text-xs text-text-muted space-y-1">
                  <p>&#8226; Speicherung Ihrer Cookie-Präferenzen</p>
                  <p>&#8226; Session-Management</p>
                  <p>&#8226; Sicherheitsfunktionen</p>
                </div>
              </div>

              {/* Functional Cookies */}
              <div className="border border-gold-light/30 rounded-lg p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-olive mb-1">Funktionale Cookies</h3>
                    <p className="text-sm text-text-muted">
                      Diese Cookies ermöglichen erweiterte Funktionalität und Personalisierung,
                      wie z.B. das Speichern von Einstellungen.
                    </p>
                  </div>
                  <div className="ml-4">
                    <button
                      onClick={() =>
                        setPreferences((prev) => ({
                          ...prev,
                          functional: !prev.functional,
                        }))
                      }
                      className={`w-12 h-6 rounded-full transition-colors flex items-center px-1 ${
                        preferences.functional
                          ? 'bg-sage justify-end'
                          : 'bg-gray-300 justify-start'
                      }`}
                    >
                      <div className="w-4 h-4 bg-white rounded-full"></div>
                    </button>
                  </div>
                </div>
                <div className="text-xs text-text-muted space-y-1">
                  <p>&#8226; Speicherung von Präferenzen</p>
                  <p>&#8226; Personalisierte Inhalte</p>
                  <p>&#8226; Verbesserte Benutzererfahrung</p>
                </div>
              </div>

              {/* Analytics Cookies */}
              <div className="border border-gold-light/30 rounded-lg p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-olive mb-1">Analyse-Cookies</h3>
                    <p className="text-sm text-text-muted">
                      Diese Cookies helfen uns zu verstehen, wie Besucher mit der Website
                      interagieren, indem Informationen anonym gesammelt werden.
                    </p>
                  </div>
                  <div className="ml-4">
                    <button
                      onClick={() =>
                        setPreferences((prev) => ({
                          ...prev,
                          analytics: !prev.analytics,
                        }))
                      }
                      className={`w-12 h-6 rounded-full transition-colors flex items-center px-1 ${
                        preferences.analytics
                          ? 'bg-sage justify-end'
                          : 'bg-gray-300 justify-start'
                      }`}
                    >
                      <div className="w-4 h-4 bg-white rounded-full"></div>
                    </button>
                  </div>
                </div>
                <div className="text-xs text-text-muted space-y-1">
                  <p>&#8226; Google Analytics</p>
                  <p>&#8226; Besucherstatistiken</p>
                  <p>&#8226; Leistungsoptimierung</p>
                </div>
              </div>

              <div className="bg-sage-50 border-l-4 border-sage p-4 rounded">
                <p className="text-sm text-text-muted">
                  <strong className="text-olive">Hinweis:</strong> Ihre Auswahl gilt für 12 Monate. Sie können Ihre
                  Einstellungen jederzeit über den Link im Footer ändern.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-cream border-t border-gold-light/30 px-6 py-4 flex flex-col sm:flex-row gap-3 rounded-b-2xl">
              <button
                onClick={acceptNecessary}
                className="flex-1 px-6 py-3 border-2 border-sage text-olive hover:bg-sage-50 rounded-lg font-semibold transition-colors"
              >
                Nur notwendige
              </button>
              <button
                onClick={saveCustom}
                className="flex-1 px-6 py-3 bg-sage hover:bg-sage-dark text-white rounded-lg font-semibold transition-colors shadow-md"
              >
                Auswahl speichern
              </button>
              <button
                onClick={acceptAll}
                className="flex-1 px-6 py-3 bg-terracotta hover:bg-terracotta-dark text-white rounded-lg font-semibold transition-colors shadow-md"
              >
                Alle akzeptieren
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
