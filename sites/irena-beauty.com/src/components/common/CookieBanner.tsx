'use client';
import { useEffect, useState } from 'react';

const STORAGE_KEY = 'irena-cookies-accepted';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {}
  }, []);

  const accept = () => {
    try { localStorage.setItem(STORAGE_KEY, '1'); } catch {}
    setVisible(false);
  };

  const decline = () => {
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Согласие на использование cookies"
      className="fixed bottom-0 left-0 right-0 z-[160] bg-white border-t border-gray-200 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] px-4 py-4 sm:px-8"
    >
      <div className="max-w-[1140px] mx-auto flex flex-col sm:flex-row items-center gap-4 justify-between">
        <div className="flex items-start gap-3">
          <span className="text-[20px] mt-0.5 shrink-0" aria-hidden>🍪</span>
          <p
            className="text-[13px] sm:text-[14px] leading-relaxed text-gray-600"
          >
            Мы используем файлы cookie, чтобы улучшить ваш опыт на сайте.{' '}
            Продолжая просмотр, вы соглашаетесь с использованием cookies в соответствии с нашей политикой конфиденциальности.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={decline}
            className="text-[13px] text-gray-400 hover:text-gray-600 transition-colors underline underline-offset-2"
          >
            Отклонить
          </button>
          <button
            onClick={accept}
            className="px-5 py-[10px] bg-primary-background text-white text-[13px] sm:text-[14px] rounded-lg hover:opacity-90 active:scale-95 transition-all duration-200 whitespace-nowrap"
          >
            Принять
          </button>
        </div>
      </div>
    </div>
  );
}
