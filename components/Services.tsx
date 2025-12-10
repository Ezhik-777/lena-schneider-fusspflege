'use client';

import { Clock, Euro, Sparkles, Footprints, Leaf, Waves, Droplet, Scissors, WandSparkles, Flame } from 'lucide-react';

// Type definitions for services
interface ServiceBase {
  icon: any;
  title: string;
  description: string;
  duration: string;
  price: string;
  features: string[];
  note?: string;
}

interface SimpleService extends ServiceBase {
  priceDetails?: false;
}

interface PriceOptionsService extends ServiceBase {
  priceDetails: true;
  priceOptions: Array<{
    label: string;
    price: string;
  }>;
}

type Service = SimpleService | PriceOptionsService;

export default function Services() {
  const services: Service[] = [
    {
      icon: Sparkles,
      title: 'Smart Pediküre',
      description: 'Moderne Form der Fußpflege: Hornhaut wird sanft entfernt, die Nägel werden geformt und die Haut mit Pflegeöl gepflegt. Das sorgt für glatte, gepflegte Füße und ein langanhaltendes Frischegefühl.',
      duration: '50 Min.',
      price: '55 €',
      features: [
        'Sanfte Hornhautentfernung',
        'Nägel formen',
        'Hautpflege mit Pflegeöl',
        'Langanhaltendes Frischegefühl',
      ],
    },
    {
      icon: Footprints,
      title: 'Klassische Fachfußpflege mit Peeling',
      description: 'Professionelle kosmetische Fußpflege für gesunde und gepflegte Füße.',
      duration: '45 Min.',
      price: '49 €',
      note: 'Aufpreis für Shellac: +11€',
      features: [
        'Nägel schneiden/kürzen',
        'Nagelhautentfernung',
        'Hornhautentfernung',
        'Pflege der Nägel und Füße',
      ],
    },
    {
      icon: Waves,
      title: 'Fußreflexzonenmassage',
      description: 'Entspannende Massage für Stressabbau.',
      duration: '30 Min.',
      price: '35 €',
      features: [
        'Stressabbau und Entspannung',
      ],
    },
    {
      icon: Scissors,
      title: 'Kosmetische Nagelkorrektur',
      description: 'Sanfte kosmetische Methode zur Nagelkorrektur.',
      duration: '10 Min.',
      price: '29 €',
      note: 'Ohne Fußpflege',
      features: [
        'Sanfte kosmetische Methode',
        'Kaum sichtbar',
        'Pro Nagel',
      ],
    },
    {
      icon: Droplet,
      title: 'Fremdmodellage entfernen',
      description: 'Professionelle und schonende Entfernung von Shellac-Lack.',
      duration: '10-15 Min.',
      price: '15 €',
      features: [
        'Schonende Entfernung',
        'Schnell und effektiv',
        'Ohne Beschädigung der Nägel',
      ],
    },
    {
      icon: WandSparkles,
      title: 'Natürliche Maniküre ohne Verlängerung',
      description: 'Naturnagel-Maniküre für gepflegte und schöne Hände.',
      duration: '40 Min.',
      price: '30 €',
      note: 'Aufpreis für Shellac 11 €',
      features: [
        'Nägel werden gekürzt, gefeilt und in Form gebracht',
        'Nagelhaut wird sanft entfernt',
        'Poliert und geölt',
      ],
    },
    {
      icon: Flame,
      title: 'Kosmetische Paraffinbehandlung',
      description: 'Wohltuende Wärmebehandlung für gepflegte, geschmeidige Haut. Das Paraffinbad spendet intensive Feuchtigkeit und macht Hände oder Füße wunderbar weich. Ideal bei trockener oder beanspruchter Haut – für ein spürbar zartes Hautgefühl.',
      duration: '30 Min.',
      price: 'ab 19',
      priceDetails: true,
      note: 'Nur kosmetische Pflegebehandlung – keine medizinische Anwendung',
      features: [
        'Intensive Feuchtigkeitspflege',
        'Wunderbar weiche Haut',
        'Ideal bei trockener Haut',
      ],
      priceOptions: [
        { label: 'Hände', price: '19 €' },
        { label: 'Füße', price: '19 €' },
        { label: 'Kombi', price: '35 €' },
      ],
    },
  ];

  return (
    <section id="services" className="bg-gray-50" aria-labelledby="services-heading">
      <div className="container px-5 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 md:mb-16">
          <div className="inline-block mb-4 sm:mb-4">
            <span className="text-primary-600 font-bold text-[0.8125rem] sm:text-sm uppercase tracking-wider bg-white px-4 sm:px-4 py-2 sm:py-2 rounded-full shadow-sm">
              Unsere Leistungen
            </span>
          </div>
          <h2 id="services-heading" className="text-[1.75rem] sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-4 px-2 leading-tight">
            Professionelle Kosmetische Fußpflegedienstleistungen
          </h2>
          <p className="text-[1.0625rem] sm:text-lg text-gray-700 px-2 leading-relaxed font-medium">
            Von professioneller Pflege bis zur entspannenden Massage -
            wir bieten alles für gesunde und gepflegte Füße.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group hover:-translate-y-1 flex flex-col"
            >
              {/* Card Header */}
              <div className="bg-gradient-to-br from-primary-50 to-accent-50 p-5 sm:p-5 md:p-6 text-center">
                <div className="w-16 h-16 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-3 bg-white rounded-full flex items-center justify-center shadow-md">
                  <service.icon className="text-primary-600" size={32} aria-hidden="true" />
                </div>
                <h3 className="text-[1.1875rem] sm:text-xl font-bold text-gray-900 mb-2 leading-tight">
                  {service.title}
                </h3>
              </div>

              {/* Card Body */}
              <div className="p-5 sm:p-5 md:p-6 space-y-4 sm:space-y-4 flex flex-col flex-grow">
                <p className="text-[0.9375rem] sm:text-base text-gray-700 leading-relaxed font-medium">
                  {service.description}
                </p>

                {/* Note */}
                {service.note && (
                  <p className="text-[0.8125rem] sm:text-sm text-gray-500 italic">
                    {service.note}
                  </p>
                )}

                {/* Features */}
                <ul className="space-y-2.5 sm:space-y-2 flex-grow">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start space-x-2.5 text-[0.875rem] sm:text-sm text-gray-700">
                      <span className="text-accent-500 mt-0.5 flex-shrink-0 text-base font-bold">✓</span>
                      <span className="leading-snug">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Divider */}
                <div className="border-t border-gray-200 pt-4 sm:pt-4 mt-auto">
                  {/* Price Options for Paraffinbehandlung */}
                  {'priceOptions' in service && service.priceDetails ? (
                    <>
                      <div className="flex items-center space-x-2 sm:space-x-2 text-[0.875rem] sm:text-sm text-gray-600 font-medium mb-3">
                        <Clock size={16} className="sm:w-4 sm:h-4" />
                        <span>{service.duration}</span>
                      </div>
                      <div className="space-y-2">
                        {service.priceOptions.map((option, idx) => (
                          <div key={idx} className="flex items-center justify-between bg-gradient-to-r from-primary-50 to-accent-50 rounded-lg px-3 py-2">
                            <span className="text-[0.875rem] sm:text-sm font-semibold text-gray-700">{option.label}</span>
                            <span className="text-[1rem] sm:text-base font-bold text-primary-600">{option.price}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 sm:space-x-2 text-[0.875rem] sm:text-sm text-gray-600 font-medium">
                        <Clock size={16} className="sm:w-4 sm:h-4" />
                        <span>{service.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-[1.125rem] sm:text-lg font-bold text-primary-600">
                        <Euro size={18} className="sm:w-[18px] sm:h-[18px]" />
                        <span>{service.price.replace('ab ', '').replace(' €', '')}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* New Customer Discount Banner */}
        <div className="mt-8 sm:mt-8 bg-gradient-to-br from-accent-50 to-primary-50 rounded-2xl sm:rounded-2xl p-6 sm:p-6 md:p-8 border-2 border-accent-200">
          <div className="text-center max-w-2xl mx-auto">
            <div className="text-4xl sm:text-4xl mb-4 sm:mb-4">🎉</div>
            <h3 className="text-[1.375rem] sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-3 leading-tight">
              Neukunden-Rabatt
            </h3>
            <p className="text-[1.75rem] sm:text-3xl font-bold text-primary-600 mb-2 sm:mb-2">
              10% Rabatt
            </p>
            <p className="text-[1rem] sm:text-base text-gray-700 font-semibold">
              auf Ihre erste Behandlung
            </p>
          </div>
        </div>

        {/* Models Wanted Banner */}
        <div className="mt-6 sm:mt-6 bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl sm:rounded-2xl p-6 sm:p-6 md:p-8 border-2 border-pink-200">
          <div className="text-center max-w-2xl mx-auto">
            <div className="text-4xl sm:text-4xl mb-4 sm:mb-4">💅✨</div>
            <h3 className="text-[1.375rem] sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-4 leading-tight">
              Ich suche Modelle für eine Nagelmodellage mit Gel!
            </h3>
            <p className="text-[1.125rem] sm:text-xl text-gray-700 mb-2 sm:mb-2 font-semibold">
              Der Preis beträgt nur <span className="text-pink-600 font-bold">45 €</span>
            </p>
            <p className="text-[1.125rem] sm:text-xl text-gray-700 font-semibold">
              und zusätzlich gibt es <span className="text-pink-600 font-bold">15 % Rabatt</span>
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-10 sm:mt-10 md:mt-12">
          <p className="text-[1rem] sm:text-base text-gray-700 mb-5 sm:mb-6 px-4 font-medium leading-relaxed">
            Haben Sie Fragen zu unseren Leistungen? Kontaktieren Sie uns gerne!
          </p>
          <button
            onClick={() => {
              const element = document.getElementById('booking');
              if (element) element.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white px-7 sm:px-8 py-4 sm:py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl active:scale-95 touch-manipulation text-[1.0625rem] sm:text-base min-h-[56px]"
            aria-label="Zum Buchungsformular scrollen und Termin vereinbaren"
          >
            Jetzt Termin vereinbaren
          </button>
        </div>
      </div>
    </section>
  );
}
