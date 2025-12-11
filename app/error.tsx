'use client';

import { useEffect } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to error reporting service (e.g., Sentry)
    if (process.env.NODE_ENV === 'production') {
      console.error('Application error:', error.message, error.digest);
    }
  }, [error]);

  return (
    <html lang="de">
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
          <div className="max-w-lg w-full">
            {/* Error Card */}
            <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center">
              {/* Icon */}
              <div className="mb-6 flex justify-center">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="text-red-600 w-10 h-10" />
                </div>
              </div>

              {/* Heading */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Etwas ist schiefgelaufen
              </h1>

              {/* Message */}
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Es tut uns leid, aber es ist ein unerwarteter Fehler aufgetreten.
                Bitte versuchen Sie es erneut oder kehren Sie zur Startseite zurück.
              </p>

              {/* Error Details (development only) */}
              {process.env.NODE_ENV === 'development' && (
                <div className="mb-8 p-4 bg-gray-100 rounded-lg text-left">
                  <p className="text-sm font-mono text-gray-700 break-all">
                    {error.message}
                  </p>
                  {error.digest && (
                    <p className="text-xs text-gray-500 mt-2">
                      Error ID: {error.digest}
                    </p>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={reset}
                  className="inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl active:scale-95 min-h-[52px]"
                  aria-label="Seite neu laden"
                >
                  <RefreshCw size={20} />
                  <span>Erneut versuchen</span>
                </button>

                <a
                  href="/"
                  className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 active:bg-gray-100 text-primary-700 border-2 border-primary-600 px-6 py-3 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg active:scale-95 min-h-[52px]"
                  aria-label="Zur Startseite"
                >
                  <Home size={20} />
                  <span>Zur Startseite</span>
                </a>
              </div>

              {/* Contact Info */}
              <div className="mt-10 pt-8 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-3">
                  Problem besteht weiterhin? Kontaktieren Sie uns:
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center text-sm">
                  <a
                    href="tel:+4917634237368"
                    className="text-primary-600 hover:text-primary-700 font-semibold hover:underline"
                  >
                    📞 +49 176 34237368
                  </a>
                  <span className="hidden sm:inline text-gray-400">•</span>
                  <a
                    href="mailto:info@fusspflege-lena-schneider.de"
                    className="text-primary-600 hover:text-primary-700 font-semibold hover:underline"
                  >
                    ✉️ info@fusspflege-lena-schneider.de
                  </a>
                </div>
              </div>
            </div>

            {/* Bottom Text */}
            <p className="text-center text-gray-500 text-sm mt-6">
              Fußpflege Lena Schneider • Erligheim
            </p>
          </div>
        </div>
      </body>
    </html>
  );
}
