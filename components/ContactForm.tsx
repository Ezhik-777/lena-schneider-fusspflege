'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Send, Loader2, CheckCircle2, XCircle } from 'lucide-react';

interface ContactFormData {
  vorname: string;
  nachname: string;
  email: string;
  telefon?: string;
  nachricht: string;
  datenschutz: boolean;
}

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        reset();

        // Reset success message after 5 seconds
        setTimeout(() => {
          setSubmitStatus('idle');
        }, 5000);
      } else {
        setSubmitStatus('error');
        setErrorMessage(result.message || 'Ein Fehler ist aufgetreten');
      }
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage('Netzwerkfehler. Bitte versuchen Sie es erneut.');
      console.error('Contact form error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Name Row */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Vorname */}
          <div>
            <label htmlFor="vorname" className="block text-sm font-medium text-gray-700 mb-2">
              Vorname <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="vorname"
              {...register('vorname', {
                required: 'Vorname ist erforderlich',
                minLength: { value: 2, message: 'Mindestens 2 Zeichen' },
              })}
              className={`w-full px-4 py-3 border ${
                errors.vorname ? 'border-red-500' : 'border-gray-300'
              } rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all`}
              placeholder="Ihr Vorname"
            />
            {errors.vorname && (
              <p className="mt-1 text-sm text-red-500">{errors.vorname.message}</p>
            )}
          </div>

          {/* Nachname */}
          <div>
            <label htmlFor="nachname" className="block text-sm font-medium text-gray-700 mb-2">
              Nachname <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="nachname"
              {...register('nachname', {
                required: 'Nachname ist erforderlich',
                minLength: { value: 2, message: 'Mindestens 2 Zeichen' },
              })}
              className={`w-full px-4 py-3 border ${
                errors.nachname ? 'border-red-500' : 'border-gray-300'
              } rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all`}
              placeholder="Ihr Nachname"
            />
            {errors.nachname && (
              <p className="mt-1 text-sm text-red-500">{errors.nachname.message}</p>
            )}
          </div>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            E-Mail-Adresse <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            {...register('email', {
              required: 'E-Mail ist erforderlich',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Ungültige E-Mail-Adresse',
              },
            })}
            className={`w-full px-4 py-3 border ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            } rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all`}
            placeholder="ihre.email@beispiel.de"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Telefon (optional) */}
        <div>
          <label htmlFor="telefon" className="block text-sm font-medium text-gray-700 mb-2">
            Telefonnummer (optional)
          </label>
          <input
            type="tel"
            id="telefon"
            {...register('telefon', {
              pattern: {
                value: /^[\d\s\-\/()+ ]+$/,
                message: 'Ungültige Telefonnummer',
              },
            })}
            className={`w-full px-4 py-3 border ${
              errors.telefon ? 'border-red-500' : 'border-gray-300'
            } rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all`}
            placeholder="+49 176 12345678"
          />
          {errors.telefon && (
            <p className="mt-1 text-sm text-red-500">{errors.telefon.message}</p>
          )}
        </div>

        {/* Nachricht */}
        <div>
          <label htmlFor="nachricht" className="block text-sm font-medium text-gray-700 mb-2">
            Ihre Nachricht <span className="text-red-500">*</span>
          </label>
          <textarea
            id="nachricht"
            rows={6}
            {...register('nachricht', {
              required: 'Nachricht ist erforderlich',
              minLength: { value: 10, message: 'Mindestens 10 Zeichen' },
            })}
            className={`w-full px-4 py-3 border ${
              errors.nachricht ? 'border-red-500' : 'border-gray-300'
            } rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none`}
            placeholder="Schreiben Sie uns Ihre Nachricht..."
          />
          {errors.nachricht && (
            <p className="mt-1 text-sm text-red-500">{errors.nachricht.message}</p>
          )}
        </div>

        {/* Datenschutz */}
        <div>
          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              {...register('datenschutz', {
                required: 'Bitte akzeptieren Sie die Datenschutzerklärung',
              })}
              className="mt-1 w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <span className="text-sm text-gray-600">
              Ich habe die{' '}
              <a
                href="/datenschutz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 underline"
              >
                Datenschutzerklärung
              </a>{' '}
              gelesen und akzeptiere sie. <span className="text-red-500">*</span>
            </span>
          </label>
          {errors.datenschutz && (
            <p className="mt-1 text-sm text-red-500">{errors.datenschutz.message}</p>
          )}
        </div>

        {/* Status Messages */}
        {submitStatus === 'success' && (
          <div className="flex items-center space-x-3 p-4 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle2 className="text-green-600" size={24} />
            <div>
              <p className="font-semibold text-green-800">Nachricht erfolgreich gesendet!</p>
              <p className="text-sm text-green-600">Wir melden uns so schnell wie möglich bei Ihnen.</p>
            </div>
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="flex items-center space-x-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <XCircle className="text-red-600" size={24} />
            <div>
              <p className="font-semibold text-red-800">Fehler beim Senden</p>
              <p className="text-sm text-red-600">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white px-8 py-4 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              <span>Wird gesendet...</span>
            </>
          ) : (
            <>
              <Send size={20} />
              <span>Nachricht senden</span>
            </>
          )}
        </button>

        <p className="text-xs text-gray-500 text-center">
          <span className="text-red-500">*</span> Pflichtfelder
        </p>
      </form>
    </div>
  );
}
