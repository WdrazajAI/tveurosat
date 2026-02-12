import Header from "@/components/layout/Header"
import Hero from "@/components/home/Hero"
import TrustBar from "@/components/home/TrustBar"
import ServicesSection from "@/components/home/ServicesSection"
import PackagesSection from "@/components/home/PackagesSection"
import StatsSection from "@/components/home/StatsSection"
import CTASection from "@/components/home/CTASection"
import Footer from "@/components/layout/Footer"

export default function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <Hero />
        <TrustBar />
        <ServicesSection />
        <PackagesSection />
        <StatsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
