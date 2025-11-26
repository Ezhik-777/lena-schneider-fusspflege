'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { BUSINESS_INFO, SERVICES } from '@/lib/constants';
import { getServiceDuration } from '@/lib/service-config';

interface BookingFormData {
  vorname: string;
  nachname: string;
  telefon: string;
  email: string;
  leistung: string;
  wunschtermin: string;
  wunschuhrzeit: string;
  nachricht: string;
  datenschutz: boolean;
}

interface TimeSlot {
  time: string;
  available: boolean;
  duration: number;
}

export default function BookingForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedService, setSelectedService] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<BookingFormData>();

  const services = [
    ...SERVICES.map(s => s.title),
    'Mehrere Leistungen',
  ];

  // Watch the date and service fields
  const watchedDate = watch('wunschtermin');
  const watchedService = watch('leistung');

  // Load available slots when date or service changes
  useEffect(() => {
    const shouldReload =
      watchedDate &&
      (watchedDate !== selectedDate || watchedService !== selectedService);

    if (shouldReload) {
      setSelectedDate(watchedDate);
      setSelectedService(watchedService || '');

      // Only load slots if we have a service selected (to calculate duration)
      if (watchedService) {
        loadAvailableSlots(watchedDate, watchedService);
      }
    }
  }, [watchedDate, watchedService]);

  const loadAvailableSlots = async (date: string, service: string) => {
    setIsLoadingSlots(true);
    try {
      // Get service duration to pass to API
      const duration = getServiceDuration(service);
      const response = await fetch(`/api/available-slots?date=${date}&duration=${duration}`);
      if (response.ok) {
        const data = await response.json();
        setAvailableSlots(data.slots || []);
      } else {
        console.error('Failed to load available slots');
        setAvailableSlots([]);
      }
    } catch (error) {
      console.error('Error loading slots:', error);
      setAvailableSlots([]);
    } finally {
      setIsLoadingSlots(false);
    }
  };

  // Format slot for display
  const formatTimeSlot = (slot: TimeSlot): string => {
    const [hours, minutes] = slot.time.split(':').map(Number);
    const endHours = hours + Math.floor(slot.duration / 60);
    const endMinutes = minutes + (slot.duration % 60);
    const endTime = `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
    return `${slot.time} - ${endTime}`;
  };

  const onSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setErrorMessage('');
        reset();
        // Scroll to success message
        setTimeout(() => {
          const element = document.getElementById('success-message');
          if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      } else {
        // Get error message from API
        const errorData = await response.json();
        setSubmitStatus('error');
        setErrorMessage(errorData.error || errorData.message || 'Ein unbekannter Fehler ist aufgetreten');

        // Scroll to error message
        setTimeout(() => {
          const element = document.getElementById('error-message');
          if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }
    } catch (error) {
      console.error('Booking error:', error);
      setSubmitStatus('error');
      setErrorMessage('Verbindungsfehler. Bitte überprüfen Sie Ihre Internetverbindung.');

      // Scroll to error message
      setTimeout(() => {
        const element = document.getElementById('error-message');
        if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="booking" className="bg-gradient-to-br from-gray-50 to-white">
      <div className="container px-5 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <div className="inline-block mb-4 sm:mb-4">
              <span className="text-primary-600 font-bold text-[0.8125rem] sm:text-sm uppercase tracking-wider bg-white px-4 sm:px-4 py-2 sm:py-2 rounded-full shadow-sm">
                Termin buchen
              </span>
            </div>
            <h2 className="text-[1.75rem] sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-4 px-2 leading-tight">
              Vereinbaren Sie jetzt Ihren <span className="text-primary-600">Wunschtermin</span>
            </h2>
            <p className="text-[1.0625rem] sm:text-lg text-gray-700 px-2 leading-relaxed font-medium">
              Füllen Sie das Formular aus, um Ihren Wunschtermin anzufragen.
            </p>
          </div>

          {/* Success Message */}
          {submitStatus === 'success' && (
            <div
              id="success-message"
              role="status"
              aria-live="polite"
              className="mb-6 sm:mb-8 bg-green-50 border-l-4 border-green-500 rounded-xl p-5 sm:p-5 md:p-6 flex items-start space-x-3 sm:space-x-3 animate-in slide-in-from-top"
            >
              <CheckCircle2 className="text-green-500 flex-shrink-0 mt-0.5 w-6 h-6 sm:w-6 sm:h-6" aria-hidden="true" />
              <div>
                <h3 className="text-[1rem] sm:text-base text-green-900 font-bold mb-1.5">
                  Vielen Dank für Ihre Anfrage!
                </h3>
                <p className="text-[0.9375rem] sm:text-sm text-green-700 leading-relaxed">
                  Wir haben Ihre Terminanfrage erhalten und werden uns in Kürze bei Ihnen melden.
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {submitStatus === 'error' && (
            <div
              id="error-message"
              role="alert"
              aria-live="assertive"
              className="mb-6 sm:mb-8 bg-red-50 border-l-4 border-red-500 rounded-xl p-5 sm:p-5 md:p-6 flex items-start space-x-3 sm:space-x-3 animate-in slide-in-from-top"
            >
              <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5 w-6 h-6 sm:w-6 sm:h-6" aria-hidden="true" />
              <div>
                <h3 className="text-[1rem] sm:text-base text-red-900 font-bold mb-1.5">Fehler beim Senden</h3>
                <p className="text-[0.9375rem] sm:text-sm text-red-700 leading-relaxed">
                  {errorMessage || 'Leider ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut oder rufen Sie uns direkt an.'}
                </p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl sm:rounded-2xl shadow-xl p-6 sm:p-6 md:p-8 lg:p-10 space-y-6 sm:space-y-6">
            {/* Persönliche Daten */}
            <div className="space-y-5 sm:space-y-6">
              <h3 className="text-[1.1875rem] sm:text-xl font-bold text-gray-900 border-b border-gray-200 pb-3 sm:pb-3">
                Persönliche Daten
              </h3>

              <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">
                <div>
                  <label htmlFor="vorname" className="block text-[0.9375rem] sm:text-sm font-bold text-gray-900 mb-2 sm:mb-2">
                    Vorname *
                  </label>
                  <input
                    {...register('vorname', { required: 'Vorname ist erforderlich' })}
                    type="text"
                    id="vorname"
                    autoComplete="given-name"
                    disabled={isSubmitting}
                    aria-invalid={!!errors.vorname}
                    aria-describedby={errors.vorname ? 'vorname-error' : undefined}
                    className={`w-full px-4 sm:px-4 py-4 sm:py-3.5 text-[1rem] sm:text-base border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all min-h-[52px] ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    placeholder="Erika"
                  />
                  {errors.vorname && (
                    <p id="vorname-error" role="alert" className="mt-2 text-[0.875rem] sm:text-sm text-red-600 font-medium">{errors.vorname.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="nachname" className="block text-[0.9375rem] sm:text-sm font-bold text-gray-900 mb-2">
                    Nachname
                  </label>
                  <input
                    {...register('nachname')}
                    type="text"
                    id="nachname"
                    autoComplete="family-name"
                    disabled={isSubmitting}
                    className={`w-full px-4 py-4 text-[1rem] sm:text-base border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all min-h-[52px] ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    placeholder="Musterfrau"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5 sm:gap-6">
                <div>
                  <label htmlFor="telefon" className="block text-[0.9375rem] sm:text-sm font-bold text-gray-900 mb-2">
                    Telefonnummer *
                  </label>
                  <input
                    {...register('telefon', {
                      required: 'Bitte geben Sie Ihre Telefonnummer ein',
                      validate: (value) => {
                        // Remove all spaces, dashes, parentheses
                        const cleaned = value.replace(/[\s\-()]/g, '');

                        // Check if it contains only numbers and optionally starts with +
                        if (!/^\+?[0-9]+$/.test(cleaned)) {
                          return 'Telefonnummer darf nur Ziffern, +, Leerzeichen, - und () enthalten';
                        }

                        // Check minimum length (at least 6 digits without +)
                        const digits = cleaned.replace(/^\+/, '');
                        if (digits.length < 6) {
                          return 'Telefonnummer muss mindestens 6 Ziffern enthalten';
                        }

                        // Check maximum length
                        if (digits.length > 15) {
                          return 'Telefonnummer darf maximal 15 Ziffern enthalten';
                        }

                        return true;
                      },
                    })}
                    type="tel"
                    id="telefon"
                    autoComplete="tel"
                    inputMode="tel"
                    disabled={isSubmitting}
                    aria-invalid={!!errors.telefon}
                    aria-describedby={errors.telefon ? 'telefon-error' : 'telefon-help'}
                    className={`w-full px-4 py-4 text-[1rem] sm:text-base border-2 ${errors.telefon ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all min-h-[52px] ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    placeholder="+49 176 12345678"
                  />
                  {errors.telefon && (
                    <p id="telefon-error" role="alert" className="mt-2 text-[0.875rem] sm:text-sm text-red-600 font-medium flex items-start gap-1">
                      <span className="text-base">⚠️</span>
                      <span>{errors.telefon.message}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-[0.9375rem] sm:text-sm font-bold text-gray-900 mb-2">
                    E-Mail (optional)
                  </label>
                  <input
                    {...register('email', {
                      validate: (value) => {
                        // If empty, it's valid (optional field)
                        if (!value || value.trim() === '') return true;

                        // If filled, validate format
                        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
                        if (!emailRegex.test(value)) {
                          return 'Bitte geben Sie eine gültige E-Mail-Adresse ein (z.B. name@beispiel.de)';
                        }

                        return true;
                      },
                    })}
                    type="email"
                    id="email"
                    autoComplete="email"
                    inputMode="email"
                    disabled={isSubmitting}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'email-error' : 'email-help'}
                    className={`w-full px-4 py-4 text-[1rem] sm:text-base border-2 ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all min-h-[52px] ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    placeholder="erika@beispiel.de"
                  />
                  {errors.email && (
                    <p id="email-error" role="alert" className="mt-2 text-[0.875rem] sm:text-sm text-red-600 font-medium flex items-start gap-1">
                      <span className="text-base">⚠️</span>
                      <span>{errors.email.message}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Termindetails */}
            <div className="space-y-5 sm:space-y-6">
              <h3 className="text-[1.1875rem] sm:text-xl font-bold text-gray-900 border-b border-gray-200 pb-3">
                Termindetails
              </h3>

              <div>
                <label htmlFor="leistung" className="block text-[0.9375rem] sm:text-sm font-bold text-gray-900 mb-2">
                  Gewünschte Leistung *
                </label>
                <select
                  {...register('leistung', { required: 'Bitte wählen Sie eine Leistung aus' })}
                  id="leistung"
                  disabled={isSubmitting}
                  aria-invalid={!!errors.leistung}
                  aria-describedby={errors.leistung ? 'leistung-error' : undefined}
                  className={`w-full px-4 py-4 text-[1rem] sm:text-base border-2 ${errors.leistung ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all min-h-[52px] ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <option value="">Bitte wählen...</option>
                  {services.map((service) => (
                    <option key={service} value={service}>
                      {service}
                    </option>
                  ))}
                </select>
                {errors.leistung && (
                  <p id="leistung-error" role="alert" className="mt-2 text-[0.875rem] sm:text-sm text-red-600 font-medium">{errors.leistung.message}</p>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-5 sm:gap-6">
                <div>
                  <label htmlFor="wunschtermin" className="block text-[0.9375rem] sm:text-sm font-bold text-gray-900 mb-2">
                    Wunschtermin *
                  </label>
                  <input
                    {...register('wunschtermin', {
                      required: 'Bitte wählen Sie ein Datum aus',
                      validate: (value) => {
                        if (!value) return 'Bitte wählen Sie ein Datum aus';
                        const selectedDate = new Date(value);
                        const minDate = new Date('2025-11-17');
                        minDate.setHours(0, 0, 0, 0);
                        return selectedDate >= minDate || 'Buchungen sind ab dem 17.11.2025 möglich';
                      }
                    })}
                    type="date"
                    id="wunschtermin"
                    min="2025-11-17"
                    disabled={isSubmitting}
                    aria-invalid={!!errors.wunschtermin}
                    aria-describedby={errors.wunschtermin ? 'wunschtermin-error' : undefined}
                    className={`w-full px-4 py-4 text-[1rem] sm:text-base border-2 ${errors.wunschtermin ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all min-h-[52px] ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  />
                  {errors.wunschtermin && (
                    <p id="wunschtermin-error" role="alert" className="mt-2 text-[0.875rem] sm:text-sm text-red-600 font-medium">{errors.wunschtermin.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="wunschuhrzeit" className="block text-[0.9375rem] sm:text-sm font-bold text-gray-900 mb-2">
                    Wunschuhrzeit *
                  </label>
                  <select
                    {...register('wunschuhrzeit', { required: 'Bitte wählen Sie eine Uhrzeit aus' })}
                    id="wunschuhrzeit"
                    disabled={isSubmitting || !selectedDate || !selectedService || isLoadingSlots}
                    aria-invalid={!!errors.wunschuhrzeit}
                    aria-describedby={errors.wunschuhrzeit ? 'wunschuhrzeit-error' : undefined}
                    className={`w-full px-4 py-4 text-[1rem] sm:text-base border-2 ${errors.wunschuhrzeit ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all min-h-[52px] ${(!selectedDate || !selectedService || isLoadingSlots) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {!selectedService ? (
                      <option value="">Bitte zuerst eine Leistung wählen...</option>
                    ) : !selectedDate ? (
                      <option value="">Bitte zuerst ein Datum wählen...</option>
                    ) : isLoadingSlots ? (
                      <option value="">Lade verfügbare Zeiten...</option>
                    ) : availableSlots.length === 0 ? (
                      <option value="">Keine verfügbaren Zeiten an diesem Tag</option>
                    ) : (
                      <>
                        <option value="">Bitte wählen...</option>
                        {availableSlots
                          .filter(slot => slot.available)
                          .map((slot) => (
                            <option key={slot.time} value={formatTimeSlot(slot)}>
                              {formatTimeSlot(slot)}
                            </option>
                          ))}
                      </>
                    )}
                  </select>
                  {errors.wunschuhrzeit && (
                    <p id="wunschuhrzeit-error" role="alert" className="mt-2 text-[0.875rem] sm:text-sm text-red-600 font-medium">{errors.wunschuhrzeit.message}</p>
                  )}
                  {selectedService && selectedDate && !isLoadingSlots && availableSlots.filter(s => s.available).length === 0 && (
                    <p className="mt-2 text-[0.875rem] sm:text-sm text-amber-600 font-medium">
                      An diesem Tag sind leider keine Termine verfügbar. Bitte wählen Sie ein anderes Datum.
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="nachricht" className="block text-[0.9375rem] sm:text-sm font-bold text-gray-900 mb-2">
                  Nachricht / Anmerkungen (optional)
                </label>
                <textarea
                  {...register('nachricht')}
                  id="nachricht"
                  rows={4}
                  className="w-full px-4 py-4 text-[1rem] sm:text-base border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all resize-none min-h-[120px]"
                  placeholder="Besondere Wünsche oder Anmerkungen..."
                ></textarea>
              </div>
            </div>

            {/* Honeypot - Anti-bot field (hidden from users) */}
            <div className="hidden" aria-hidden="true" style={{ position: 'absolute', left: '-9999px', height: 0, width: 0 }}>
              <label htmlFor="phone_verify">Telefon bestätigen</label>
              <input
                {...register('phone_verify' as any)}
                type="text"
                id="phone_verify"
                name="phone_verify"
                autoComplete="off"
                tabIndex={-1}
              />
            </div>

            {/* Datenschutz */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <input
                  {...register('datenschutz', {
                    required: 'Sie müssen die Datenschutzerklärung akzeptieren',
                  })}
                  type="checkbox"
                  id="datenschutz"
                  className="mt-1 w-5 h-5 text-primary-600 border-2 border-gray-300 rounded focus:ring-primary-500 flex-shrink-0"
                />
                <label htmlFor="datenschutz" className="text-[0.9375rem] sm:text-sm text-gray-700 leading-relaxed">
                  Ich habe die{' '}
                  <a
                    href="/datenschutz"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 underline font-bold"
                  >
                    Datenschutzerklärung
                  </a>{' '}
                  gelesen und akzeptiere diese. *
                </label>
              </div>
              {errors.datenschutz && (
                <p className="text-[0.875rem] sm:text-sm text-red-600 font-medium" role="alert">{errors.datenschutz.message}</p>
              )}
            </div>

            {/* Cancellation Policy Notice */}
            <div className="bg-amber-50 border-l-4 border-amber-500 rounded-xl p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0" aria-hidden="true">⏰</span>
                <div>
                  <h4 className="text-[0.9375rem] sm:text-sm font-bold text-amber-900 mb-1">
                    Hinweis zur Terminabsage
                  </h4>
                  <p className="text-[0.875rem] sm:text-sm text-amber-800 leading-relaxed">
                    Nicht rechtzeitig abgesagte Termine berechne ich Ihnen mit 25€. Bitte sagen Sie Termine mindestens 24 Stunden vorher ab.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-5 sm:pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 active:from-primary-800 active:to-accent-800 text-white px-7 sm:px-8 py-4.5 sm:py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 touch-manipulation active:scale-95 text-[1.0625rem] sm:text-base min-h-[56px]"
                aria-label={isSubmitting ? "Formular wird gesendet" : "Terminanfrage absenden"}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 sm:h-5 sm:w-5 border-b-2 border-white" aria-hidden="true"></div>
                    <span>Wird gesendet...</span>
                  </>
                ) : (
                  <>
                    <Send size={20} aria-hidden="true" />
                    <span>Terminanfrage senden</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-[0.875rem] sm:text-sm text-gray-600 text-center font-medium">
              * Pflichtfelder
            </p>
          </form>

          {/* Alternative Contact */}
          <div className="mt-10 sm:mt-12 text-center">
            <p className="text-[1rem] sm:text-base text-gray-700 mb-4 sm:mb-4 font-medium">Oder kontaktieren Sie uns direkt:</p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-4 justify-center">
              <a
                href={BUSINESS_INFO.contact.phoneHref}
                className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-6 py-4 sm:py-3 bg-white border-2 border-primary-600 text-primary-700 rounded-xl font-bold hover:bg-primary-50 active:bg-primary-100 transition-all touch-manipulation active:scale-95 text-[1rem] sm:text-base min-h-[56px]"
                aria-label={`Telefonnummer ${BUSINESS_INFO.contact.phoneFormatted} anrufen`}
              >
                <span aria-hidden="true" className="text-xl">📞</span> {BUSINESS_INFO.contact.phoneFormatted}
              </a>
              <a
                href={BUSINESS_INFO.contact.emailHref}
                className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-6 py-4 sm:py-3 bg-white border-2 border-primary-600 text-primary-700 rounded-xl font-bold hover:bg-primary-50 active:bg-primary-100 transition-all touch-manipulation active:scale-95 text-[1rem] sm:text-base min-h-[56px]"
                aria-label={`E-Mail an ${BUSINESS_INFO.contact.email} senden`}
              >
                <span aria-hidden="true" className="text-xl">✉️</span> {BUSINESS_INFO.contact.email}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
