'use client';
import HeroSection from'./HeroSection';
 import UnleashingCreativitySection from'./UnleashingCreativitySection';
 import WhyChooseUsSection from'./WhyChooseUsSection';
 import PromotionalSection from'./PromotionalSection';
 import PortfolioSection from'./PortfolioSection';
 import PricingSection from'./PricingSection';
 import TestimonialsSection from'./TestimonialsSection';
 import ContactSection from'./ContactSection';
 import Header from'@/components/common/Header';
 import Footer from'@/components/common/Footer';
import { BookingProvider } from '@/components/booking/BookingContext';

export default function HomePage() {
  return (
    <BookingProvider>
      <Header />
      <main>
        <HeroSection />
        <UnleashingCreativitySection />
        <WhyChooseUsSection />
        <PromotionalSection />
        <PortfolioSection />
        <PricingSection />
        <TestimonialsSection />
        <ContactSection />
      </main>
      <Footer />
    </BookingProvider>
  )
}