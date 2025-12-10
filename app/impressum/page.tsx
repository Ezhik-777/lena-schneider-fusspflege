import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Impressum - Fußpflege Erligheim bei Ella Schön',
  description: 'Rechtliche Informationen und Impressum von Fußpflege Lena Schneider in Erligheim',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ImpressumPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container py-6">
          <Link
            href="/"
            className="text-2xl font-bold text-primary-700 hover:text-primary-800 transition-colors"
          >
            ← Fußpflege Lena Schneider
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="container py-16">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Impressum</h1>

          <div className="prose prose-lg max-w-none space-y-8">
            {/* Angaben gemäß § 5 TMG */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Angaben gemäß § 5 TMG
              </h2>
              <div className="space-y-2 text-gray-700">
                <p className="font-semibold">Fußpflege Lena Schneider</p>
                <p>Inhaberin: Elena Schneider</p>
                <p>Löchgauer str. 17</p>
                <p>74391 Erligheim</p>
              </div>
            </section>

            {/* Kontakt */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Kontakt</h2>
              <div className="space-y-2 text-gray-700">
                <p>
                  <strong>Telefon:</strong> +49 176 34237368
                </p>
                <p>
                  <strong>E-Mail:</strong>{' '}
                  <a
                    href="mailto:info@fusspflege-lena-schneider.de"
                    className="text-primary-600 hover:text-primary-700 underline"
                  >
                    info@fusspflege-lena-schneider.de
                  </a>
                </p>
              </div>
            </section>

            {/* Berufsbezeichnung */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Berufsbezeichnung und Tätigkeit
              </h2>
              <div className="text-gray-700">
                <p>Kosmetische Fußpflegerin</p>
                <p>Tätigkeitsbereich: Kosmetische Fußpflege (nicht medizinisch)</p>
              </div>
            </section>

            {/* Umsatzsteuer */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Umsatzsteuer-Identifikationsnummer
              </h2>
              <div className="text-gray-700 space-y-3">
                <p>
                  Gemäß § 19 Abs. 1 Umsatzsteuergesetz (UStG) wird die Umsatzsteuer
                  nicht erhoben (Kleinunternehmerregelung).
                </p>
                <p>
                  Aufgrund der Anwendung der Kleinunternehmerregelung wird in Rechnungen
                  keine Umsatzsteuer ausgewiesen.
                </p>
                <p className="text-sm italic text-gray-600">
                  Eine Umsatzsteuer-Identifikationsnummer (USt-IdNr.) ist daher nicht vorhanden.
                </p>
              </div>
            </section>

            {/* EU-Streitschlichtung */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                EU-Streitschlichtung
              </h2>
              <div className="text-gray-700">
                <p>
                  Die Europäische Kommission stellt eine Plattform zur
                  Online-Streitbeilegung (OS) bereit:
                </p>
                <p>
                  <a
                    href="https://ec.europa.eu/consumers/odr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 underline"
                  >
                    https://ec.europa.eu/consumers/odr
                  </a>
                </p>
                <p className="mt-4">
                  Unsere E-Mail-Adresse finden Sie oben im Impressum.
                </p>
              </div>
            </section>

            {/* Verbraucherstreitbeilegung */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Verbraucherstreitbeilegung / Universalschlichtungsstelle
              </h2>
              <div className="text-gray-700">
                <p>
                  Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren
                  vor einer Verbraucherschlichtungsstelle teilzunehmen.
                </p>
              </div>
            </section>

            {/* Haftung für Inhalte */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Haftung für Inhalte
              </h2>
              <div className="text-gray-700 space-y-4">
                <p>
                  Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte
                  auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach
                  §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet,
                  übermittelte oder gespeicherte fremde Informationen zu überwachen oder
                  nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit
                  hinweisen.
                </p>
                <p>
                  Verpflichtungen zur Entfernung oder Sperrung der Nutzung von
                  Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt.
                  Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der
                  Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden
                  von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend
                  entfernen.
                </p>
              </div>
            </section>

            {/* Haftung für Links */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Haftung für Links
              </h2>
              <div className="text-gray-700 space-y-4">
                <p>
                  Unser Angebot enthält Links zu externen Websites Dritter, auf deren
                  Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden
                  Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten
                  Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten
                  verantwortlich.
                </p>
                <p>
                  Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche
                  Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der
                  Verlinkung nicht erkennbar. Eine permanente inhaltliche Kontrolle der
                  verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer
                  Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von
                  Rechtsverletzungen werden wir derartige Links umgehend entfernen.
                </p>
              </div>
            </section>

            {/* Urheberrecht */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Urheberrecht</h2>
              <div className="text-gray-700 space-y-4">
                <p>
                  Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen
                  Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung,
                  Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der
                  Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des
                  jeweiligen Autors bzw. Erstellers.
                </p>
                <p>
                  Downloads und Kopien dieser Seite sind nur für den privaten, nicht
                  kommerziellen Gebrauch gestattet. Soweit die Inhalte auf dieser Seite
                  nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter
                  beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet.
                  Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden,
                  bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von
                  Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.
                </p>
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Quelle: Erstellt mit dem{' '}
              <a
                href="https://www.e-recht24.de/impressum-generator.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 underline"
              >
                Impressum Generator von eRecht24
              </a>
            </p>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center mt-8">
          <Link
            href="/"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold"
          >
            ← Zurück zur Startseite
          </Link>
        </div>
      </main>
    </div>
  );
}
