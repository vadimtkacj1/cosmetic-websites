'use client';
import { useState, useCallback } from 'react';

type FontSize = 0 | 1 | 2;
type State = { fontSize: FontSize; highContrast: boolean; grayscale: boolean; underlineLinks: boolean };
const INITIAL: State = { fontSize: 0, highContrast: false, grayscale: false, underlineLinks: false };

export default function AccessibilityWidget() {
  const [open, setOpen] = useState(false);
  const [s, setS] = useState<State>(INITIAL);

  const applyFilter = useCallback((contrast: boolean, gray: boolean) => {
    const f: string[] = [];
    if (gray) f.push('grayscale(1)');
    if (contrast) f.push('contrast(1.6) brightness(0.85)');
    document.body.style.filter = f.join(' ');
  }, []);

  const setFontSize = (size: FontSize) => {
    document.documentElement.style.fontSize = size === 0 ? '' : `${[100, 115, 130][size]}%`;
    setS(p => ({ ...p, fontSize: size }));
  };

  const toggleContrast = () =>
    setS(p => { const next = { ...p, highContrast: !p.highContrast }; applyFilter(next.highContrast, next.grayscale); return next; });

  const toggleGrayscale = () =>
    setS(p => { const next = { ...p, grayscale: !p.grayscale }; applyFilter(next.highContrast, next.grayscale); return next; });

  const toggleUnderline = () =>
    setS(p => {
      const next = !p.underlineLinks;
      const el = document.getElementById('a11y-ul');
      if (next && !el) {
        const s = document.createElement('style');
        s.id = 'a11y-ul';
        s.textContent = 'a { text-decoration: underline !important; }';
        document.head.appendChild(s);
      } else if (!next && el) {
        el.remove();
      }
      return { ...p, underlineLinks: next };
    });

  const reset = () => {
    document.documentElement.style.fontSize = '';
    document.body.style.filter = '';
    document.getElementById('a11y-ul')?.remove();
    setS(INITIAL);
  };

  const toggles = [
    { label: 'ניגודיות גבוהה', active: s.highContrast, action: toggleContrast },
    { label: 'גווני אפור', active: s.grayscale, action: toggleGrayscale },
    { label: 'הדגש קישורים', active: s.underlineLinks, action: toggleUnderline },
  ];

  return (
    <div className="fixed bottom-6 left-4 sm:left-6 z-[150] flex flex-col items-start gap-3">
      {open && (
        <div
          dir="rtl"
          className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-5 w-[230px] flex flex-col gap-3 animate-hero-fade origin-bottom-left"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[14px] font-semibold text-gray-900" style={{ fontFamily: 'Nunito Sans' }}>נגישות</span>
            <button
              onClick={() => setOpen(false)}
              aria-label="סגור"
              className="flex h-[26px] w-[26px] items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors text-[16px] leading-none"
            >
              ✕
            </button>
          </div>

          {/* Font size */}
          <div className="flex flex-col gap-[7px]">
            <span className="text-[11px] tracking-wide text-gray-500 uppercase" style={{ fontFamily: 'Nunito Sans' }}>גודל טקסט</span>
            <div className="flex gap-[6px]">
              {([0, 1, 2] as const).map(size => (
                <button
                  key={size}
                  onClick={() => setFontSize(size)}
                  className={`flex-1 py-[7px] rounded-lg text-sm border transition-colors ${s.fontSize === size ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}
                  style={{ fontFamily: 'Nunito Sans' }}
                >
                  {['A', 'A+', 'A++'][size]}
                </button>
              ))}
            </div>
          </div>

          {/* Toggles */}
          {toggles.map(({ label, active, action }) => (
            <button
              key={label}
              onClick={action}
              className={`w-full py-[9px] px-3 rounded-lg text-[13px] text-right border transition-colors ${active ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}
              style={{ fontFamily: 'Nunito Sans' }}
            >
              {label}
            </button>
          ))}

          <button
            onClick={reset}
            className="w-full py-[8px] rounded-lg text-[12px] text-center text-red-500 border border-red-200 hover:bg-red-50 transition-colors"
            style={{ fontFamily: 'Nunito Sans' }}
          >
            איפוס הגדרות
          </button>
        </div>
      )}

      <button
        onClick={() => setOpen(o => !o)}
        aria-label="פתח תפריט נגישות"
        className="h-[52px] w-[52px] rounded-full bg-gray-900 text-white shadow-lg hover:bg-gray-700 active:scale-95 transition-all duration-200 flex items-center justify-center"
      >
        {/* Universal accessibility icon */}
        <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <circle cx="12" cy="4.5" r="2" />
          <path d="M15.5 8.5h-7a.5.5 0 000 1H11v3.6l-2.3 4.6a.5.5 0 00.9.45L12 13.6l2.4 4.55a.5.5 0 00.9-.45L13 13.1V9.5h2.5a.5.5 0 000-1z" />
        </svg>
      </button>
    </div>
  );
}
