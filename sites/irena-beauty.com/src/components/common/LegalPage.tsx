'use client';
import Link from 'next/link';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';

interface Section {
  title: string;
  items: (string | { subtitle: string; items: string[] })[];
}

interface LegalPageProps {
  title: string;
  lastUpdated: string;
  intro?: string;
  sections: Section[];
  contact: {
    title: string;
    lines: string[];
  };
}

export default function LegalPage({ title, lastUpdated, intro, sections, contact }: LegalPageProps) {
  return (
    <>
      <Header />
      <main
        dir="rtl"
        className="min-h-screen bg-background-main pt-28 pb-20 px-4 sm:px-6"
        style={{ fontFamily: 'Varela Round, sans-serif' }}
      >
        <div className="max-w-[800px] mx-auto">

          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[13px] text-text-secondary hover:text-text-primary transition-colors mb-8"
          >
            ← חזרה לאתר
          </Link>

          <h1 className="text-3xl sm:text-4xl font-semibold text-text-primary leading-tight mb-3">
            {title}
          </h1>
          <p className="text-[13px] text-text-secondary mb-10">{lastUpdated}</p>

          {intro && (
            <div className="bg-secondary-light border border-secondary-background rounded-xl p-5 mb-10 text-[15px] text-text-primary leading-relaxed">
              {intro}
            </div>
          )}

          <div className="flex flex-col gap-10">
            {sections.map((section, i) => (
              <section key={i}>
                <h2 className="text-xl font-semibold text-text-primary mb-4 pb-2 border-b border-border-muted">
                  {section.title}
                </h2>
                <div className="flex flex-col gap-3">
                  {section.items.map((item, j) =>
                    typeof item === 'string' ? (
                      <p key={j} className="text-[15px] text-text-primary leading-relaxed">
                        {item}
                      </p>
                    ) : (
                      <div key={j}>
                        <p className="text-[15px] font-medium text-text-primary mb-2">{item.subtitle}</p>
                        <ul className="flex flex-col gap-1 pr-4">
                          {item.items.map((li, k) => (
                            <li key={k} className="text-[15px] text-text-primary leading-relaxed list-disc">
                              {li}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )
                  )}
                </div>
              </section>
            ))}

            <section className="bg-secondary-light rounded-xl p-6">
              <h2 className="text-xl font-semibold text-text-primary mb-4">{contact.title}</h2>
              <div className="flex flex-col gap-1">
                {contact.lines.map((line, i) => (
                  <p key={i} className="text-[15px] text-text-primary leading-relaxed">{line}</p>
                ))}
              </div>
            </section>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
