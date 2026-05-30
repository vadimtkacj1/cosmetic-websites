'use client';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { localISODate } from '@/lib/booking-date';
import { useSiteContent } from '@/components/i18n/LocaleProvider';

interface DaySlots {
  enabled: boolean;
  slots: string[];
}
type WeekSchedule = Record<number, DaySlots>;

interface BookingContextValue {
  openBooking: () => void;
}

const BookingContext = createContext<BookingContextValue | null>(null);

export function useBooking(): BookingContextValue {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking must be used within <BookingProvider>');
  return ctx;
}

type Status = 'idle' | 'sending' | 'success' | 'error';

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const { booking: t } = useSiteContent();
  const [open, setOpen] = useState(false);
  const [schedule, setSchedule] = useState<WeekSchedule | null>(null);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const openBooking = useCallback(() => setOpen(true), []);
  const close = useCallback(() => setOpen(false), []);

  // Load availability once, lazily on first open.
  useEffect(() => {
    if (!open || schedule) return;
    fetch('/api/public/slots', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { schedule: WeekSchedule } | null) => {
        if (d?.schedule) setSchedule(d.schedule);
      })
      .catch(() => {});
  }, [open, schedule]);

  // Body scroll lock + Esc to close.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open, close]);

  // Reset the form shortly after the modal closes.
  useEffect(() => {
    if (open) return;
    const t = setTimeout(() => {
      setName('');
      setPhone('');
      setDate('');
      setTime('');
      setStatus('idle');
      setErrorMsg('');
    }, 300);
    return () => clearTimeout(t);
  }, [open]);

  const today = localISODate();
  const weekday = date ? new Date(`${date}T00:00:00`).getDay() : null;
  const daySlots: string[] =
    weekday !== null && schedule?.[weekday]?.enabled ? schedule[weekday].slots : [];
  const dayClosed = weekday !== null && (!schedule?.[weekday]?.enabled || daySlots.length === 0);

  const onDateChange = (value: string) => {
    setDate(value);
    setTime('');
  };

  const canSubmit =
    name.trim().length > 0 &&
    phone.trim().length > 0 &&
    !!date &&
    !!time &&
    status !== 'sending';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setStatus('sending');
    setErrorMsg('');
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), phone: phone.trim(), date, time }),
      });
      if (res.ok) {
        setStatus('success');
        return;
      }
      const data = await res.json().catch(() => ({}));
      setErrorMsg(data.error || t.errorGeneric);
      setStatus('error');
    } catch {
      setErrorMsg(t.errorNetwork);
      setStatus('error');
    }
  };

  return (
    <BookingContext.Provider value={{ openBooking }}>
      {children}

      {open && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-hero-fade"
          onClick={close}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={t.title}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[460px] bg-secondary-light rounded-[6px] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.5)] max-h-[92vh] overflow-y-auto"
          >
            {/* Close */}
            <button
              onClick={close}
              aria-label={t.close}
              className="absolute top-[14px] right-[14px] flex h-[36px] w-[36px] items-center justify-center rounded-full text-text-primary/60 hover:bg-black/5 hover:text-text-primary transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
              </svg>
            </button>

            <div className="px-[28px] sm:px-[40px] py-[36px]">
              {status === 'success' ? (
                <div className="flex flex-col items-center text-center gap-[16px] py-[20px]">
                  <span className="flex h-[64px] w-[64px] items-center justify-center rounded-full bg-[#c2a05a]/15 text-[#a07c34]">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <h3 className="text-[26px] text-text-primary" style={{ fontFamily: 'Playfair Display' }}>
                    {t.successTitle}
                  </h3>
                  <p className="text-[15px] leading-relaxed text-text-secondary" style={{ fontFamily: 'Nunito Sans' }}>
                    {t.successText.replace('{date}', date).replace('{time}', time)}
                  </p>
                  <button
                    onClick={close}
                    className="mt-[8px] px-[28px] py-[12px] bg-primary-background text-text-white text-[15px] hover:opacity-90 transition-opacity"
                    style={{ fontFamily: 'Nunito Sans' }}
                  >
                    {t.successClose}
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex flex-col items-center text-center gap-[6px] mb-[24px]">
                    <span className="text-[11px] tracking-[0.32em] uppercase text-[#c2a05a]" style={{ fontFamily: 'Nunito Sans' }}>
                      {t.eyebrow}
                    </span>
                    <h3 className="text-[28px] sm:text-[32px] text-text-primary leading-tight" style={{ fontFamily: 'Playfair Display' }}>
                      {t.title}
                    </h3>
                  </div>

                  <form onSubmit={handleSubmit} className="flex flex-col gap-[16px]">
                    <Field label={t.nameLabel}>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={t.namePlaceholder}
                        required
                        className="w-full px-[14px] py-[11px] rounded-[4px] border border-text-primary/20 bg-white text-[15px] text-text-primary focus:border-[#c2a05a] focus:ring-2 focus:ring-[#c2a05a]/20 transition-colors"
                        style={{ fontFamily: 'Nunito Sans' }}
                      />
                    </Field>

                    <Field label={t.phoneLabel}>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder={t.phonePlaceholder}
                        required
                        dir="ltr"
                        className="w-full px-[14px] py-[11px] rounded-[4px] border border-text-primary/20 bg-white text-[15px] text-text-primary focus:border-[#c2a05a] focus:ring-2 focus:ring-[#c2a05a]/20 transition-colors"
                        style={{ fontFamily: 'Nunito Sans' }}
                      />
                    </Field>

                    <Field label={t.dateLabel}>
                      <input
                        type="date"
                        value={date}
                        min={today}
                        onChange={(e) => onDateChange(e.target.value)}
                        required
                        className="w-full px-[14px] py-[11px] rounded-[4px] border border-text-primary/20 bg-white text-[15px] text-text-primary focus:border-[#c2a05a] focus:ring-2 focus:ring-[#c2a05a]/20 transition-colors"
                        style={{ fontFamily: 'Nunito Sans' }}
                      />
                    </Field>

                    <Field label={t.timeLabel}>
                      {!date ? (
                        <p className="text-[14px] text-text-secondary py-[6px]" style={{ fontFamily: 'Nunito Sans' }}>
                          {t.pickDateFirst}
                        </p>
                      ) : dayClosed ? (
                        <p className="text-[14px] text-text-secondary py-[6px]" style={{ fontFamily: 'Nunito Sans' }}>
                          {t.dayClosed}
                        </p>
                      ) : (
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-[8px]">
                          {daySlots.map((s) => (
                            <button
                              type="button"
                              key={s}
                              onClick={() => setTime(s)}
                              className={`py-[8px] rounded-[4px] text-[14px] border transition-colors ${
                                time === s
                                  ? 'bg-primary-background text-text-white border-primary-background'
                                  : 'bg-white text-text-primary border-text-primary/20 hover:border-[#c2a05a]'
                              }`}
                              style={{ fontFamily: 'Nunito Sans' }}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      )}
                    </Field>

                    {status === 'error' && (
                      <p className="text-[14px] text-red-500 text-center" style={{ fontFamily: 'Nunito Sans' }}>
                        {errorMsg}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={!canSubmit}
                      className="mt-[6px] w-full py-[14px] bg-primary-background text-text-white text-[15px] tracking-[0.05em] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ fontFamily: 'Nunito Sans' }}
                    >
                      {status === 'sending' ? t.sending : t.submit}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </BookingContext.Provider>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-[6px]">
      <span className="text-[13px] font-medium text-text-primary/80" style={{ fontFamily: 'Nunito Sans' }}>
        {label}
      </span>
      {children}
    </label>
  );
}
