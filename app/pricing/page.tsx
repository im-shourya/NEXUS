import PricingSection from "@/components/landing/pricing-section"
import { NexusNav } from "@/components/nexus/nexus-nav"
import { NexusFooter } from "@/components/nexus/nexus-footer"

export default function PricingPage() {
  return (
    <div style={{ background: "var(--nx-bg)" }}>
      <NexusNav />
      <div className="pt-20">
        <PricingSection />
      </div>
      <NexusFooter />
    </div>
  )
}
