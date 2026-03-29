import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, ArrowRight, Tv, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import PackageCard from "./PackageCard"
import { useTVPackagesList } from "@/hooks/use-packages"
import { getTVAddonsForType } from "@/data/packages"
import type { TVPackage, TVAddon, ContractPeriod, TVDeliveryType } from "@/types"

interface TVAddonSelectorProps {
  tvDeliveryTypes: TVDeliveryType[]
  onSelect: (pkg: TVPackage, period: ContractPeriod, addons: TVAddon[]) => void
  onSkip?: () => void
  onBack: () => void
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 },
}

export default function TVAddonSelector({
  tvDeliveryTypes,
  onSelect,
  onSkip,
  onBack,
}: TVAddonSelectorProps) {
  const [period, setPeriod] = useState<ContractPeriod>("24m")
  const [selectedPkg, setSelectedPkg] = useState<TVPackage | null>(null)
  const [selectedAddons, setSelectedAddons] = useState<Set<string>>(new Set())
  const { packages: allTVPackages, loading } = useTVPackagesList()

  // Filter by available delivery types and exclude CANAL+ (shown as addon)
  const packages = allTVPackages
    .filter((p) => !p.name.includes("CANAL+"))
    .filter((p) => tvDeliveryTypes.includes(p.type))
    .sort((a, b) => {
      if (a.type !== b.type) return a.type === "dvb_c" ? -1 : 1
      return a.order - b.order
    })

  const handlePackageSelect = (pkg: TVPackage) => {
    setSelectedPkg(pkg)
    setSelectedAddons(new Set())
  }

  const handleAddonToggle = (addonId: string) => {
    setSelectedAddons((prev) => {
      const next = new Set(prev)
      if (next.has(addonId)) {
        next.delete(addonId)
      } else {
        next.add(addonId)
      }
      return next
    })
  }

  const handleConfirm = () => {
    if (!selectedPkg) return
    const deliveryType = selectedPkg.type
    const allAddons = getTVAddonsForType(deliveryType)
    const chosen = allAddons.filter((a) => selectedAddons.has(a.id))
    onSelect(selectedPkg, period, chosen)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-6 w-48 bg-muted rounded animate-pulse" />
            <div className="h-4 w-32 bg-muted rounded mt-2 animate-pulse" />
          </div>
        </div>
        <div className="h-12 bg-muted rounded-xl animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-muted rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  // After selecting a base package — show addons step
  if (selectedPkg) {
    const allAddons = getTVAddonsForType(selectedPkg.type)
    // Premium already includes CANAL+ — don't show it as addon
    const addons = selectedPkg.name === "Premium"
      ? allAddons.filter((a) => !a.name.includes("CANAL+"))
      : allAddons
    const selectedPricing =
      selectedPkg.pricing.find((p) => p.period === period) || selectedPkg.pricing[0]

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Dodatki do telewizji</h3>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">
              Opcjonalnie — dodaj pakiety premium do{" "}
              <span className="font-medium text-foreground">{selectedPkg.name}</span>{" "}
              ({selectedPricing.monthlyPrice} zł/mies.)
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedPkg(null)}
            className="text-muted-foreground"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Zmień pakiet
          </Button>
        </div>

        {/* Addon toggles */}
        <div className="space-y-3">
          {addons.map((addon) => {
            const addonPricing = addon.pricing?.find((p) => p.period === period)
            const price = addonPricing?.monthlyPrice ?? addon.monthlyPrice
            const isSelected = selectedAddons.has(addon.id)

            return (
              <button
                key={addon.id}
                onClick={() => handleAddonToggle(addon.id)}
                className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all text-left ${
                  isSelected
                    ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                    : "border-border bg-card hover:border-primary/40"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                      isSelected
                        ? "border-primary bg-primary"
                        : "border-muted-foreground/30"
                    }`}
                  >
                    {isSelected && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{addon.name}</p>
                    {addon.tagline && (
                      <p className="text-xs text-muted-foreground">
                        {addon.tagline}
                      </p>
                    )}
                  </div>
                </div>
                <span className="font-bold text-primary whitespace-nowrap">
                  +{price} zł/mies.
                </span>
              </button>
            )
          })}
        </div>

        {/* Summary + confirm */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button onClick={handleConfirm} className="flex-1 h-11 rounded-xl">
            {selectedAddons.size > 0 ? "Dalej z dodatkami" : "Dalej bez dodatków"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }

  // Base package selection step
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Tv className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">
              {onSkip ? "Dodaj telewizję" : "Wybierz pakiet telewizji"}
            </h3>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            {onSkip
              ? "Opcjonalnie — możesz też pominąć ten krok"
              : "Kliknij pakiet, aby przejść dalej"}
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="text-muted-foreground"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Wstecz
        </Button>
      </div>

      {/* Contract period toggle */}
      <div className="flex items-center justify-center gap-1 p-1 bg-muted rounded-xl">
        {(
          [
            { key: "24m", label: "24 mies." },
            { key: "12m", label: "12 mies." },
            { key: "indefinite", label: "Bez umowy" },
          ] as const
        ).map((opt) => (
          <button
            key={opt.key}
            onClick={() => setPeriod(opt.key)}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              period === opt.key
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* TV Packages — grouped by delivery type when both available */}
      {tvDeliveryTypes.length > 1 ? (
        // Dual delivery: show sections with headers
        <>
          {(
            [
              { type: "iptv" as const, label: "Telewizja IPTV (przez światłowód)" },
              { type: "dvb_c" as const, label: "Telewizja DVB-C (przez kabel)" },
            ] as const
          )
            .filter((section) => tvDeliveryTypes.includes(section.type))
            .map((section) => {
              const sectionPkgs = packages.filter((p) => p.type === section.type)
              if (sectionPkgs.length === 0) return null
              return (
                <div key={section.type} className="space-y-3">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    {section.label}
                  </h4>
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                  >
                    {sectionPkgs.map((pkg) => (
                      <motion.div key={pkg.id} variants={itemVariants}>
                        <PackageCard
                          pkg={pkg}
                          selectedPeriod={period}
                          onSelect={() => handlePackageSelect(pkg)}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              )
            })}
        </>
      ) : (
        // Single delivery type: flat grid (no headers)
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {packages.map((pkg) => (
            <motion.div key={pkg.id} variants={itemVariants}>
              <PackageCard
                pkg={pkg}
                selectedPeriod={period}
                onSelect={() => handlePackageSelect(pkg)}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Skip button — only shown when TV is optional (Internet+TV flow) */}
      {onSkip && (
        <div className="pt-2">
          <Button
            variant="outline"
            onClick={onSkip}
            className="w-full sm:w-auto"
          >
            Dalej bez telewizji
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
