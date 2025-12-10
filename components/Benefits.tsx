'use client';

import { Home, Clock, Heart, Shield, Star, Calendar } from 'lucide-react';

export default function Benefits() {
  const benefits = [
    {
      icon: Home,
      title: 'Gemütliches Ambiente',
      description:
        'Entspannen Sie in angenehmer Salon-Atmosphäre. Ein Ort zum Wohlfühlen und Abschalten.',
    },
    {
      icon: Clock,
      title: 'Ohne Wartezeiten',
      description:
        'Feste Termine nur für Sie. Keine Wartezeiten - pünktlich und zuverlässig.',
    },
    {
      icon: Heart,
      title: 'Persönliche Betreuung',
      description:
        'Individuelle Behandlung in ruhiger Umgebung. Volle Aufmerksamkeit nur für Sie.',
    },
    {
      icon: Shield,
      title: 'Höchste Hygiene',
      description:
        'Sterilisierte Instrumente und professionelle Arbeitsmaterialien nach medizinischen Standards.',
    },
    {
      icon: Calendar,
      title: 'Flexible Termine',
      description:
        'Terminvereinbarung nach Ihren Wünschen - auch abends oder am Wochenende möglich.',
    },
    {
      icon: Star,
      title: 'Erstklassige Qualität',
      description:
        'Professionelle Behandlung mit modernsten Methoden und hochwertigen Produkten.',
    },
  ];

  return (
    <section id="benefits" className="bg-white">
      <div className="container">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-block mb-3 sm:mb-4">
            <span className="text-primary-600 font-semibold text-xs sm:text-sm uppercase tracking-wider bg-primary-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full">
              Ihre Vorteile
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 px-4">
            Warum Fußpflege Sachsenheim die <span className="text-primary-600">richtige Wahl</span> ist
          </h2>
          <p className="text-base sm:text-lg text-gray-600 px-4">
            Genießen Sie professionelle Fußpflege in angenehmer Salon-Atmosphäre -
            entspannend, individuell und ohne Stress.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="group p-5 sm:p-6 md:p-8 rounded-xl bg-gradient-to-br from-gray-50 to-white hover:from-primary-50 hover:to-accent-50 transition-all duration-300 border border-gray-200 hover:border-primary-200 hover:shadow-lg touch-manipulation"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary-100 group-hover:bg-primary-600 rounded-xl flex items-center justify-center mb-4 sm:mb-5 transition-colors">
                  <Icon
                    className="text-primary-600 group-hover:text-white transition-colors"
                    size={24}
                    aria-hidden="true"
                  />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                  {benefit.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Banner */}
        <div className="mt-12 sm:mt-16 bg-gradient-to-r from-primary-600 to-accent-600 rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-12 text-center shadow-xl">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4 px-4">
            Besuchen Sie uns in Erligheim!
          </h3>
          <p className="text-primary-50 text-sm sm:text-base md:text-lg mb-5 sm:mb-6 max-w-2xl mx-auto px-4">
            Buchen Sie jetzt Ihren Termin und genießen Sie professionelle
            Fußpflege in entspannter Salon-Atmosphäre.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <button
              onClick={() => {
                const element = document.getElementById('booking');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-white hover:bg-gray-100 active:bg-gray-200 text-primary-700 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl active:scale-95 touch-manipulation text-sm sm:text-base"
              aria-label="Zum Buchungsformular scrollen"
            >
              Termin vereinbaren
            </button>
            <a
              href="tel:+4917634237368"
              className="bg-primary-700 hover:bg-primary-800 active:bg-primary-900 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl active:scale-95 border-2 border-white/20 touch-manipulation text-sm sm:text-base"
              aria-label="Telefonnummer +49 176 34237368 anrufen"
            >
              Direkt anrufen
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
