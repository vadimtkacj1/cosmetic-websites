'use client';
import { useEffect } from 'react';
import HeroSection from'./HeroSection';
import UnleashingCreativitySection from'./UnleashingCreativitySection';
import PortfolioSection from'./PortfolioSection';
import PricingSection from'./PricingSection';
import TestimonialsSection from'./TestimonialsSection';
import ContactSection from'./ContactSection';
import Header from'@/components/common/Header';
import Footer from'@/components/common/Footer';
import WhatsAppButton from'@/components/common/WhatsAppButton';
import DiscountPopup from'@/components/common/DiscountPopup';
import CookieBanner from'@/components/common/CookieBanner';
import { BookingProvider } from '@/components/booking/BookingContext';
import { PAGE_LOADED_SESSION_KEY } from '@/hooks/useInView';

export default function HomePage() {
  // After 2 s on page, mark it as "loaded" in sessionStorage.
  // On back-navigation all animated sections will skip the hidden→visible flash.
  useEffect(() => {
    const t = setTimeout(() => {
      try { sessionStorage.setItem(PAGE_LOADED_SESSION_KEY, '1'); } catch {}
    }, 2000);
    return () => clearTimeout(t);
  }, []);

  return (
    <BookingProvider>
      <Header />
      <main>
        <HeroSection />
        <UnleashingCreativitySection />
        <PortfolioSection />
        <PricingSection />
        <TestimonialsSection />
        <ContactSection />
      </main>
      <Footer />
      <WhatsAppButton />
      <DiscountPopup />
      <CookieBanner />
    </BookingProvider>
  )
}