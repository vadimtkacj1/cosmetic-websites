/* Hofit Yehezkel Cosmetics — Tweaks panel wiring.
   Built on tweaks-panel.jsx (useTweaks + Tweak* controls). Applies tweaks to the
   static page via CSS variables, body data-attributes, and section toggles. */

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#ad7d93",
  "heading": "serif",
  "hero": "classic",
  "showMethod": true,
  "showServices": true,
  "showProducts": true,
  "showTestimonials": true,
  "showFaq": true
}/*EDITMODE-END*/;

// accent strong -> soft tint (both from the design-system palettes)
const ACCENT_SOFT = {
  "#ad7d93": "#e4bacd", // rose (brand)
  "#cc9a05": "#fff2cd", // amber
  "#5672ab": "#e1e8f6", // danube blue
  "#619e84": "#e4f3ed"  // de york green
};

function applyTweaks(t) {
  const root = document.documentElement;
  root.style.setProperty('--accent', t.accent);
  root.style.setProperty('--accent-soft', ACCENT_SOFT[t.accent] || 'var(--color-can-can-light)');
  document.body.setAttribute('data-heading', t.heading);
  document.body.setAttribute('data-hero', t.hero);
  const toggle = (id, on) => { const el = document.getElementById(id); if (el) el.hidden = !on; };
  toggle('method', t.showMethod);
  toggle('services', t.showServices);
  toggle('products', t.showProducts);
  toggle('testimonials', t.showTestimonials);
  toggle('faq', t.showFaq);
}

function TweaksApp() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  React.useEffect(() => { applyTweaks(t); }, [t]);
  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Brand" />
      <TweakColor label="Accent" value={t.accent}
                  options={["#ad7d93", "#cc9a05", "#5672ab", "#619e84"]}
                  onChange={(v) => setTweak('accent', v)} />
      <TweakRadio label="Headings" value={t.heading}
                  options={[{ value: 'serif', label: 'Serif' }, { value: 'sans', label: 'Sans' }]}
                  onChange={(v) => setTweak('heading', v)} />

      <TweakSection label="Hero layout" />
      <TweakRadio label="Style" value={t.hero}
                  options={[{ value: 'classic', label: 'Classic' }, { value: 'editorial', label: 'Editorial' }, { value: 'fullbleed', label: 'Full bleed' }]}
                  onChange={(v) => setTweak('hero', v)} />

      <TweakSection label="Sections" />
      <TweakToggle label="Signature method" value={t.showMethod} onChange={(v) => setTweak('showMethod', v)} />
      <TweakToggle label="Studio services" value={t.showServices} onChange={(v) => setTweak('showServices', v)} />
      <TweakToggle label="Products" value={t.showProducts} onChange={(v) => setTweak('showProducts', v)} />
      <TweakToggle label="Testimonials" value={t.showTestimonials} onChange={(v) => setTweak('showTestimonials', v)} />
      <TweakToggle label="FAQ" value={t.showFaq} onChange={(v) => setTweak('showFaq', v)} />
    </TweaksPanel>
  );
}

// Apply defaults immediately (before the panel is ever opened).
applyTweaks(TWEAK_DEFAULTS);

ReactDOM.createRoot(document.getElementById('tweaks-root')).render(<TweaksApp />);
