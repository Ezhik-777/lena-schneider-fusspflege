import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, AlertCircle, Mail, Phone } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Barrierefreiheitserklärung',
  description: 'Erklärung zur Barrierefreiheit gemäß Barrierefreiheitsstärkungsgesetz (BFSG) für Fußpflege Lena Schneider',
};

export default function BarrierefreiheitPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container py-6">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded px-2 py-1"
          >
            <ArrowLeft size={20} aria-hidden="true" />
            <span>Zurück zur Startseite</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-12">
        <article className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Erklärung zur Barrierefreiheit
          </h1>

          <p className="text-sm text-gray-600 mb-8">
            Stand: {new Date().toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' })}
          </p>

          {/* Introduction */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Einleitung</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Fußpflege Lena Schneider ist bemüht, die eigene Website im Einklang mit dem
              Barrierefreiheitsstärkungsgesetz (BFSG) und der europäischen Richtlinie (EU) 2019/882
              (European Accessibility Act) barrierefrei zugänglich zu machen.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Diese Erklärung zur Barrierefreiheit gilt für die Website{' '}
              <strong className="text-primary-600">fusspflege-lena-schneider.de</strong>.
            </p>
          </section>

          {/* Compliance Status */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Stand der Vereinbarkeit mit den Anforderungen
            </h2>

            <div className="bg-green-50 border-l-4 border-green-500 p-6 mb-6">
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="text-green-600 flex-shrink-0 mt-1" size={24} aria-hidden="true" />
                <div>
                  <h3 className="font-bold text-green-900 mb-2">
                    Teilweise konform
                  </h3>
                  <p className="text-green-800 leading-relaxed">
                    Diese Website ist mit den Anforderungen der EN 301 549 V3.2.1 (2021-03)
                    teilweise vereinbar. Die nachstehend aufgeführten Anforderungen werden
                    noch nicht oder nur teilweise erfüllt.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Implemented Features */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Umgesetzte Barrierefreiheitsmaßnahmen
            </h2>

            <div className="space-y-4">
              <FeatureItem
                icon={<CheckCircle2 className="text-green-600" size={20} />}
                title="Semantisches HTML"
                description="Verwendung von HTML5-Strukturelementen (header, main, nav, section, footer) für bessere Navigation mit Screenreadern."
              />
              <FeatureItem
                icon={<CheckCircle2 className="text-green-600" size={20} />}
                title="ARIA-Labels und Landmarks"
                description="Umfassende ARIA-Beschriftungen für interaktive Elemente und Navigationsbereiche."
              />
              <FeatureItem
                icon={<CheckCircle2 className="text-green-600" size={20} />}
                title="Tastaturnavigation"
                description="Alle interaktiven Elemente sind per Tastatur erreichbar und bedienbar."
              />
              <FeatureItem
                icon={<CheckCircle2 className="text-green-600" size={20} />}
                title="Focus-Indikatoren"
                description="Deutlich sichtbare Fokus-Indikatoren bei Tastaturnavigation (2px Ring in Primärfarbe)."
              />
              <FeatureItem
                icon={<CheckCircle2 className="text-green-600" size={20} />}
                title="Farbkontraste"
                description="Mindestens WCAG 2.1 Level AA konform (Kontrastverhältnis 4.5:1 für normalen Text, 3:1 für großen Text)."
              />
              <FeatureItem
                icon={<CheckCircle2 className="text-green-600" size={20} />}
                title="Responsive Design"
                description="Optimiert für alle Bildschirmgrößen und Geräte inkl. Zoom bis 200%."
              />
              <FeatureItem
                icon={<CheckCircle2 className="text-green-600" size={20} />}
                title="Formular-Accessibility"
                description="Labels für alle Formularfelder, Fehlermeldungen mit ARIA-Beschreibungen."
              />
              <FeatureItem
                icon={<CheckCircle2 className="text-green-600" size={20} />}
                title="Touch-Targets"
                description="Mindestgröße von 44x44 Pixeln für alle interaktiven Elemente (mobil)."
              />
              <FeatureItem
                icon={<CheckCircle2 className="text-green-600" size={20} />}
                title="Skip-Links"
                description="Sprungmarken zum Überspringen von Navigationsbereichen."
              />
            </div>
          </section>

          {/* Known Limitations */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Bekannte Einschränkungen und Ausnahmen
            </h2>

            <div className="bg-amber-50 border-l-4 border-amber-500 p-6">
              <div className="flex items-start space-x-3">
                <AlertCircle className="text-amber-600 flex-shrink-0 mt-1" size={24} aria-hidden="true" />
                <div>
                  <h3 className="font-bold text-amber-900 mb-2">
                    In Bearbeitung
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-amber-800">
                    <li>Vollständige Screenreader-Kompatibilität wird kontinuierlich verbessert</li>
                    <li>Einige Bilder verfügen noch über keine ausführlichen Alternativtexte</li>
                    <li>Google Maps Integration hat eingeschränkte Accessibility-Unterstützung</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Testing */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Erstellung dieser Erklärung und Prüfung
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Diese Erklärung wurde am{' '}
              <strong>{new Date().toLocaleDateString('de-DE')}</strong> erstellt.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Die Einschätzung basiert auf einer Selbstbewertung durch Fußpflege Lena Schneider.
            </p>
            <p className="text-gray-700 leading-relaxed">
              <strong>Getestete Kombinationen:</strong>
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mb-4">
              <li>Chrome/Edge auf Windows mit NVDA Screenreader</li>
              <li>Safari auf macOS mit VoiceOver</li>
              <li>Firefox mit Tastaturnavigation</li>
              <li>Mobile Browser (iOS Safari, Android Chrome)</li>
            </ul>
          </section>

          {/* Feedback */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Barrieren melden: Wir sind für Sie da!
            </h2>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-l-4 border-primary-600 rounded-lg p-6 mb-6">
              <p className="text-gray-800 leading-relaxed mb-4 font-medium">
                <strong className="text-primary-700">Ihre Meinung ist uns wichtig!</strong> Wir möchten, dass
                unsere Website für alle Besucher zugänglich ist. Sollten Sie auf Barrieren oder Schwierigkeiten
                bei der Nutzung unserer Website stoßen, freuen wir uns über Ihr Feedback.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Bitte kontaktieren Sie uns direkt – wir nehmen Ihre Anliegen ernst und sind stets bemüht,
                Probleme schnell und unkompliziert zu lösen. Gemeinsam finden wir eine Lösung!
              </p>
              <p className="text-gray-700 leading-relaxed">
                ✓ Schnelle Reaktion innerhalb von 2 Werktagen<br />
                ✓ Persönlicher Ansprechpartner<br />
                ✓ Konstruktive Lösungen im Dialog
              </p>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-lg p-6 space-y-5 shadow-sm">
              <h3 className="font-bold text-lg text-gray-900 mb-4">So erreichen Sie uns:</h3>

              <div className="flex items-start space-x-3">
                <Mail className="text-primary-600 flex-shrink-0 mt-1" size={22} aria-hidden="true" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">E-Mail (bevorzugt)</h4>
                  <a
                    href="mailto:info@fusspflege-lena-schneider.de?subject=Barrierefreiheit%20-%20Feedback&body=Hallo%20Team%20Fußpflege%20Lena%20Schneider,%0D%0A%0D%0AIch%20möchte%20Sie%20auf%20folgende%20Barriere%20aufmerksam%20machen:%0D%0A%0D%0A[Bitte%20beschreiben%20Sie%20hier%20das%20Problem]%0D%0A%0D%0AVielen%20Dank!"
                    className="text-primary-600 hover:text-primary-700 underline focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded inline-block"
                  >
                    info@fusspflege-lena-schneider.de
                  </a>
                  <p className="text-sm text-gray-600 mt-1">
                    Betreff: "Barrierefreiheit - Feedback"
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Phone className="text-primary-600 flex-shrink-0 mt-1" size={22} aria-hidden="true" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Telefon</h4>
                  <a
                    href="tel:+4917634237368"
                    className="text-primary-600 hover:text-primary-700 underline focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded inline-block text-lg font-semibold"
                  >
                    +49 176 34237368
                  </a>
                  <p className="text-sm text-gray-600 mt-1">
                    Mo-Fr: 9:00-18:00 Uhr, Sa: 9:00-14:00 Uhr
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-5">
              <p className="text-green-900 text-sm leading-relaxed">
                <strong>💚 Unser Versprechen:</strong> Wir behandeln jedes Feedback vertraulich und
                respektvoll. Ihr Hinweis hilft uns, unsere Website für alle zu verbessern.
                Sie erhalten innerhalb von <strong>2 Werktagen</strong> eine erste Rückmeldung von uns.
              </p>
            </div>
          </section>

          {/* Enforcement */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Schlichtungsverfahren – wenn der direkte Weg nicht funktioniert
            </h2>

            <div className="bg-amber-50 border-l-4 border-amber-400 rounded-lg p-6 mb-4">
              <p className="text-amber-900 leading-relaxed mb-3">
                <strong>Unser Ziel ist immer eine einvernehmliche Lösung!</strong>
              </p>
              <p className="text-gray-700 leading-relaxed mb-3">
                Wir sind davon überzeugt, dass wir gemeinsam im persönlichen Gespräch die beste
                Lösung für Sie finden können. Barrierefreiheit ist uns wichtig, und wir setzen
                alles daran, unsere Website kontinuierlich zu verbessern.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Sollten Sie dennoch mit unserer Antwort nicht zufrieden sein oder keine
                zufriedenstellende Lösung erreichen, steht Ihnen selbstverständlich der Weg
                zur offiziellen Schlichtungsstelle offen:
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-300 rounded-lg p-6">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="text-2xl">⚖️</span>
                Schlichtungsstelle nach § 16 BGG
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4 text-sm">
                Diese Stelle ist zuständig, wenn keine Einigung zwischen Ihnen und uns
                zustande kommt:
              </p>
              <div className="bg-white rounded-lg p-5 border border-gray-200">
                <p className="text-gray-800 leading-relaxed mb-2 font-semibold">
                  Bundesfachstelle Barrierefreiheit
                </p>
                <p className="text-gray-700 text-sm leading-relaxed mb-1">
                  bei der Bundesanstalt für Arbeitsschutz und Arbeitsmedizin
                </p>
                <p className="text-gray-700 text-sm leading-relaxed mb-3">
                  Nöldnerstraße 40-42<br />
                  10317 Berlin
                </p>
                <div className="space-y-1 text-sm">
                  <p className="text-gray-700">
                    <strong>E-Mail:</strong>{' '}
                    <a
                      href="mailto:info@bundesfachstelle-barrierefreiheit.de"
                      className="text-primary-600 hover:text-primary-700 underline focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded"
                    >
                      info@bundesfachstelle-barrierefreiheit.de
                    </a>
                  </p>
                  <p className="text-gray-700">
                    <strong>Website:</strong>{' '}
                    <a
                      href="https://www.bundesfachstelle-barrierefreiheit.de"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700 underline focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded"
                    >
                      www.bundesfachstelle-barrierefreiheit.de
                    </a>
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-5">
              <p className="text-blue-900 text-sm leading-relaxed">
                <strong>💡 Hinweis:</strong> Die Schlichtungsstelle ist ein kostenfreies und
                unabhängiges Angebot. Sie kann bei Konflikten vermitteln und zu einer
                außergerichtlichen Einigung beitragen. Wir sind jederzeit offen für einen
                konstruktiven Dialog!
              </p>
            </div>
          </section>

          {/* Commitment */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Unser Engagement für Barrierefreiheit
            </h2>

            <div className="bg-gradient-to-r from-primary-50 to-cyan-50 rounded-lg p-6 mb-6 border-l-4 border-primary-600">
              <p className="text-gray-800 leading-relaxed mb-4 font-medium">
                Barrierefreiheit ist für uns kein Pflichtprogramm, sondern eine Herzensangelegenheit!
                Wir möchten, dass jeder Mensch unsere Dienstleistungen problemlos finden und buchen kann.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Deshalb arbeiten wir kontinuierlich daran, unsere Website zugänglicher zu machen.
                Wir prüfen regelmäßig die Einhaltung der Standards und nehmen Verbesserungen vor,
                um allen Nutzerinnen und Nutzern den bestmöglichen Zugang zu ermöglichen.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white border-2 border-primary-200 rounded-lg p-5">
                <div className="text-3xl mb-3">🤝</div>
                <h3 className="font-bold text-gray-900 mb-2">Partnerschaftlicher Ansatz</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Wir sehen Barrierefreiheit als gemeinsame Aufgabe. Ihr Feedback hilft uns,
                  besser zu werden. Gemeinsam schaffen wir Lösungen, die funktionieren.
                </p>
              </div>

              <div className="bg-white border-2 border-primary-200 rounded-lg p-5">
                <div className="text-3xl mb-3">🔄</div>
                <h3 className="font-bold text-gray-900 mb-2">Kontinuierliche Verbesserung</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Barrierefreiheit ist kein Endzustand. Wir lernen ständig dazu und
                  passen unsere Website an neue Erkenntnisse und Technologien an.
                </p>
              </div>

              <div className="bg-white border-2 border-primary-200 rounded-lg p-5">
                <div className="text-3xl mb-3">⚡</div>
                <h3 className="font-bold text-gray-900 mb-2">Schnelle Umsetzung</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Wenn Sie auf ein Problem stoßen, reagieren wir schnell. Viele
                  Verbesserungen können wir innerhalb weniger Tage umsetzen.
                </p>
              </div>

              <div className="bg-white border-2 border-primary-200 rounded-lg p-5">
                <div className="text-3xl mb-3">💬</div>
                <h3 className="font-bold text-gray-900 mb-2">Offener Dialog</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Wir sind jederzeit gesprächsbereit und freuen uns über jeden
                  Hinweis. Nur so können wir besser werden!
                </p>
              </div>
            </div>

            <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-300 rounded-lg p-6">
              <p className="text-green-900 leading-relaxed font-medium text-center">
                <strong className="text-lg">✨ Unser Versprechen an Sie:</strong><br />
                <span className="text-gray-800 mt-2 inline-block">
                  Wir gehen jeden konstruktiven Hinweis ernsthaft an und suchen gemeinsam mit Ihnen
                  nach praktikablen Lösungen. Barrierefreiheit verbessern wir nicht nur auf dem Papier,
                  sondern dort, wo es zählt – in der täglichen Nutzung unserer Website.
                </span>
              </p>
            </div>
          </section>
        </article>
      </main>
    </div>
  );
}

interface FeatureItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureItem({ icon, title, description }: FeatureItemProps) {
  return (
    <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
      <div className="flex-shrink-0 mt-0.5" aria-hidden="true">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
        <p className="text-gray-700 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
