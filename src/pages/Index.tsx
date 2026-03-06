import Hero from "@/components/home/Hero"
import TrustBar from "@/components/home/TrustBar"
import ServicesSection from "@/components/home/ServicesSection"
import PackagesSection from "@/components/home/PackagesSection"
import NewsPreviewSection from "@/components/home/NewsPreviewSection"
import CTASection from "@/components/home/CTASection"

export default function Index() {
  return (
    <>
      <Hero />
      <TrustBar />
      <ServicesSection />
      <PackagesSection />
      <NewsPreviewSection />
      <CTASection />
    </>
  )
}
