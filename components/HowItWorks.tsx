'use client';

import { Calendar, Mail, Home, Sparkles, Lightbulb } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Termin vereinbaren',
      description:
        'Buchen Sie online über unser Formular oder rufen Sie uns direkt an. Wir finden gemeinsam einen passenden Termin.',
      icon: Calendar,
    },
    {
      number: '02',
      title: 'Bestätigung erhalten',
      description:
        'Sie erhalten eine Terminbestätigung per E-Mail oder SMS mit allen wichtigen Informationen und der Salonadresse.',
      icon: Mail,
    },
    {
      number: '03',
      title: 'Zum Salon kommen',
      description:
        'Besuchen Sie uns zu Ihrem vereinbarten Termin in unserem gemütlichen Salon in Sachsenheim.',
      icon: Home,
    },
    {
      number: '04',
      title: 'Behandlung genießen',
      description:
        'Entspannen Sie sich in angenehmer Atmosphäre, während ich die vereinbarte Behandlung professionell durchführe.',
      icon: Sparkles,
    },
    {
      number: '05',
      title: 'Beratung & Pflege',
      description:
        'Nach der Behandlung erhalten Sie individuelle Pflegetipps und Empfehlungen für zu Hause.',
      icon: Lightbulb,
    },
  ];

  return (
    <section id="how-it-works" className="bg-gradient-to-br from-primary-50 via-white to-accent-50">
      <div className="container">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block mb-4">
            <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider bg-white px-4 py-2 rounded-full shadow-sm">
              So funktioniert's
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            In 5 einfachen Schritten zu <span className="text-primary-600">gepflegten Füßen</span>
          </h2>
          <p className="text-lg text-gray-600">
            Von der Terminbuchung bis zum Salonbesuch - so einfach geht's.
          </p>
        </div>

        {/* Steps */}
        <div className="relative max-w-5xl mx-auto">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-16 left-0 right-0 h-1 bg-gradient-to-r from-primary-200 via-accent-200 to-primary-200"></div>

          {/* Steps Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-4">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {/* Step Card */}
                <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                  {/* Number Badge */}
                  <div className="relative z-10 w-12 h-12 bg-gradient-to-br from-primary-600 to-accent-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
                    <span className="text-white font-bold text-lg">
                      {step.number}
                    </span>
                  </div>

                  {/* Icon */}
                  <div className="w-14 h-14 mx-auto mb-3 bg-gradient-to-br from-primary-50 to-accent-50 rounded-full flex items-center justify-center">
                    <step.icon className="text-primary-600" size={28} />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed flex-grow">
                    {step.description}
                  </p>
                </div>

                {/* Connector Arrow for mobile */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden flex justify-center my-4">
                    <div className="text-primary-400 text-2xl">↓</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-700 font-medium mb-6 text-lg">
            Bereit für Ihren Besuch in unserem Salon?
          </p>
          <button
            onClick={() => {
              const element = document.getElementById('booking');
              if (element) element.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white px-10 py-4 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Jetzt Termin buchen
          </button>
        </div>
      </div>
    </section>
  );
}
