'use client';

import Image from 'next/image';
import { Award, Heart, Shield, Users } from 'lucide-react';

export default function About() {
  const credentials = [
    {
      icon: Award,
      title: 'Mehrfach Zertifiziert',
      description: 'Professionelle Zertifizierungen in kosmetischer Fußpflege',
    },
    {
      icon: Users,
      title: 'Professionell',
      description: 'Qualifizierte Ausbildung und individuelle Betreuung',
    },
    {
      icon: Heart,
      title: 'Mit Leidenschaft',
      description: 'Individuelle und einfühlsame Betreuung',
    },
    {
      icon: Shield,
      title: 'Höchste Hygiene',
      description: 'Sterilisierte Instrumente nach medizinischen Standards',
    },
  ];

  return (
    <section id="about" className="bg-white" aria-labelledby="about-heading">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center">
          {/* Owner Photo */}
          <div className="order-2 md:order-1">
            <div className="relative">
              {/* Designer Frame */}
              <div className="aspect-[4/5] rounded-[1.5rem] sm:rounded-[2rem] shadow-2xl hover:shadow-primary-300/40 transition-all duration-500">
                {/* Outer frame with gradient */}
                <div className="w-full h-full rounded-[1.5rem] sm:rounded-[2rem] p-[4px] sm:p-[6px] bg-gradient-to-br from-primary-400 via-accent-300 to-primary-300">
                  {/* Inner white border */}
                  <div className="w-full h-full rounded-[1.35rem] sm:rounded-[1.85rem] p-[2px] sm:p-[3px] bg-white">
                    {/* Image container */}
                    <div className="w-full h-full rounded-[1.2rem] sm:rounded-[1.7rem] overflow-hidden relative shadow-lg">
                      <Image
                        src="/nails-work.jpg"
                        alt="Lena Schneider - Professionelle Fußpflege und Nagelmodellage in Erligheim bei Ella Schön"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* Decorative elements - hide on mobile */}
              <div className="hidden sm:block absolute -z-10 -bottom-6 -right-6 w-48 sm:w-72 h-48 sm:h-72 bg-accent-200 rounded-full opacity-20 blur-3xl" aria-hidden="true"></div>
              <div className="hidden sm:block absolute -z-10 -top-6 -left-6 w-24 sm:w-32 h-24 sm:h-32 bg-primary-200 rounded-full opacity-30 blur-2xl" aria-hidden="true"></div>
            </div>
          </div>

          {/* Content */}
          <div className="order-1 md:order-2 space-y-5 sm:space-y-6">
            <div className="space-y-3 sm:space-y-4">
              <div className="inline-block">
                <span className="text-primary-600 font-semibold text-xs sm:text-sm uppercase tracking-wider bg-primary-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full">
                  Über uns
                </span>
              </div>
              <h2 id="about-heading" className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                Willkommen bei <span className="text-primary-600">Unser Salon bei Ella Schön in Erligheim</span>
              </h2>
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                Herzlich willkommen in Unser Beauty-Salon bei Ella Schön in Erligheim! Ich bin Lena und
                mit mehreren professionellen Zertifizierungen biete ich Ihnen qualifizierte
                Fußpflegedienstleistungen in entspannter Atmosphäre.
              </p>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Mein Ziel ist es, Ihnen nicht nur gesunde und gepflegte Füße zu schenken,
                sondern auch eine Auszeit vom Alltag zu bieten. Jede Behandlung wird
                individuell auf Ihre Bedürfnisse abgestimmt - in einem gemütlichen Ambiente,
                wo Sie sich wohlfühlen können.
              </p>
            </div>

            {/* Credentials Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-4 sm:pt-6">
              {credentials.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={index}
                    className="flex items-start space-x-2 sm:space-x-3 p-3 sm:p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors touch-manipulation"
                  >
                    <div className="w-9 h-9 sm:w-10 sm:h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="text-primary-600" size={18} aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm sm:text-base text-gray-900 mb-0.5 sm:mb-1">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 leading-snug">{item.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
