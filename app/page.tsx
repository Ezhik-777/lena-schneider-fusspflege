export default function RelocationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center">
        {/* Decorative element */}
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
        </div>

        {/* Main heading */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Wir ziehen um!
        </h1>

        {/* Subheading */}
        <p className="text-lg md:text-xl text-gray-700 mb-6">
          Liebe Kundinnen und Kunden,
        </p>

        {/* Main message */}
        <div className="text-left space-y-4 mb-8 text-gray-700">
          <p>
            wir haben aufregende Neuigkeiten! Unsere Fußpflegepraxis zieht um und wir freuen uns sehr,
            Sie bald in unseren neuen, modernen Räumlichkeiten begrüßen zu dürfen.
          </p>

          <p>
            Während des Umzugs ist unsere Praxis vorübergehend geschlossen. Wir nutzen diese Zeit,
            um alles für Sie perfekt vorzubereiten.
          </p>

          <p className="font-semibold text-blue-600">
            Wir informieren Sie zeitnah über:
          </p>

          <ul className="list-disc list-inside space-y-2 pl-4">
            <li>Unsere neue Adresse</li>
            <li>Den Termin der Wiedereröffnung</li>
            <li>Die neuen Möglichkeiten zur Terminbuchung</li>
          </ul>

          <p>
            Vielen Dank für Ihr Verständnis und Ihre Treue. Wir freuen uns darauf,
            Sie bald in unserem neuen Ambiente verwöhnen zu dürfen!
          </p>
        </div>

        {/* Contact info */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 mb-6">
          <p className="text-gray-700 mb-2">
            <strong>Bei Fragen erreichen Sie uns unter:</strong>
          </p>
          <a
            href="tel:+4915167899109"
            className="text-blue-600 hover:text-blue-700 font-semibold text-lg inline-block"
          >
            +49 151 67899109
          </a>
        </div>

        {/* Signature */}
        <p className="text-gray-800 font-semibold text-lg">
          Herzliche Grüße,<br />
          Ihr Team von Lena Schneider Fußpflege
        </p>

        {/* Footer note */}
        <p className="text-sm text-gray-500 mt-8">
          Diese Seite wird aktualisiert, sobald wir weitere Informationen haben.
        </p>
      </div>
    </div>
  );
}
