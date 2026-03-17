import { NexusNav } from "@/components/nexus/nexus-nav"
import { NexusFooter } from "@/components/nexus/nexus-footer"
import HeroSection from "@/components/landing/hero-section"
import HowItWorksSection from "@/components/landing/how-it-works-section"
import FeaturesSection from "@/components/landing/features-section"
import SportsSection from "@/components/landing/sports-section"
import TestimonialsSection from "@/components/landing/testimonials-section"
import StatsBand from "@/components/landing/stats-band"
import ComparisonSection from "@/components/landing/comparison-section"
import PricingSection from "@/components/landing/pricing-section"
import IndiaMapSection from "@/components/landing/india-map-section"
import RoleValueSections from "@/components/landing/role-value-sections"
import FinalCtaSection from "@/components/landing/final-cta-section"

export default function LandingPage() {
  return (
    <div style={{ background: "var(--nx-bg)" }}>
      <NexusNav />
      <main>
        <HeroSection />
        <StatsBand />
        <RoleValueSections />
        <HowItWorksSection />
        <SportsSection />
        <FeaturesSection />
        <TestimonialsSection />
        <ComparisonSection />
        <IndiaMapSection />
        <PricingSection />
        <FinalCtaSection />
      </main>
      <NexusFooter />
    </div>
  )
}
