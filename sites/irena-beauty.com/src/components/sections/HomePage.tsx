'use client';
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
import { BookingProvider } from '@/components/booking/BookingContext';

export default function HomePage() {
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
    </BookingProvider>
  )
}