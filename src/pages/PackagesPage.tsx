import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import PageHero from "@/components/layout/PageHero"
import PackageTabs from "@/components/packages/PackageTabs"
import PackageCard from "@/components/packages/PackageCard"
import LocationBanner from "@/components/packages/LocationBanner"
import { getPackagesByType } from "@/data/packages"
import type { PackageType } from "@/types"

const tabFromParam: Record<string, PackageType> = {
  internet: "internet",
  telewizja: "tv",
}

const paramFromTab: Record<PackageType, string> = {
  internet: "internet",
  tv: "telewizja",
  combo: "internet", // combo doesn't have its own URL param, defaults
}

export default function PackagesPage() {
  const { tab } = useParams<{ tab?: string }>()
  const navigate = useNavigate()

  const initialTab: PackageType = tab ? (tabFromParam[tab] || "internet") : "internet"
  const [activeTab, setActiveTab] = useState<PackageType>(initialTab)

  useEffect(() => {
    if (tab && tabFromParam[tab]) {
      setActiveTab(tabFromParam[tab])
    }
  }, [tab])

  function handleTabChange(newTab: PackageType) {
    setActiveTab(newTab)
    // Update URL without full navigation
    if (newTab === "combo") {
      navigate("/pakiety", { replace: true })
    } else {
      navigate(`/pakiety/${paramFromTab[newTab]}`, { replace: true })
    }
  }

  const packages = getPackagesByType(activeTab)

  return (
    <>
      <PageHero
        title="Nasza Oferta"
        subtitle="Internet Kablowy GPON i Telewizja Kablowa IPTV — wybierz pakiet dopasowany do Twoich potrzeb."
        breadcrumbs={[{ label: "Pakiety" }]}
      />

      <section className="pt-6 pb-12 sm:pt-8 sm:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Location Banner */}
          <div className="mb-10">
            <LocationBanner />
          </div>

          {/* Tabs */}
          <div className="mb-10">
            <PackageTabs activeTab={activeTab} onTabChange={handleTabChange} />
          </div>

          {/* Packages Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {packages.map((pkg, index) => (
                <PackageCard key={pkg.id} pkg={pkg} index={index} />
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Bottom Note */}
          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground">
              Wszystkie ceny są cenami brutto. Instalacja standardowa w cenie pakietu.
              <br />
              Szczegółowe warunki dostępne w{" "}
              <a href="/dokumenty" className="text-primary hover:underline">
                regulaminie
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
