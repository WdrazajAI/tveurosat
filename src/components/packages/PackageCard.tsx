import { motion } from "framer-motion"
import { Check, Wifi, Tv } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { InternetPackage, TVPackage, ContractPeriod } from "@/types"

interface PackageCardProps {
  pkg: InternetPackage | TVPackage
  selectedPeriod: ContractPeriod
  onSelect: () => void
}

function isInternet(pkg: InternetPackage | TVPackage): pkg is InternetPackage {
  return "speedDown" in pkg
}

export default function PackageCard({
  pkg,
  selectedPeriod,
  onSelect,
}: PackageCardProps) {
  const pricing =
    pkg.pricing.find((p) => p.period === selectedPeriod) || pkg.pricing[0]
  const internet = isInternet(pkg)

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={`relative flex flex-col h-full rounded-2xl border bg-card p-5 sm:p-6 transition-shadow hover:shadow-xl hover:shadow-primary/5 ${
        pkg.featured
          ? "border-primary shadow-md shadow-primary/10 ring-1 ring-primary/20"
          : "border-border"
      }`}
    >
      {/* Featured badge */}
      {pkg.featured && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider bg-secondary text-white rounded-full whitespace-nowrap">
            Najpopularniejszy
          </span>
        </div>
      )}

      {/* Header */}
      <div className="mb-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          {internet ? (
            <Wifi className="h-4 w-4 text-primary" />
          ) : (
            <Tv className="h-4 w-4 text-primary" />
          )}
          <h3 className="text-sm uppercase tracking-widest text-primary font-semibold">
            {pkg.name}
          </h3>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed min-h-[2rem]">
          {pkg.tagline}
        </p>
      </div>

      {/* Speed / Channels */}
      <div className="text-center mb-4">
        {internet ? (
          <div className="text-3xl sm:text-4xl font-extrabold text-foreground">
            {pkg.speedDown >= 1000
              ? `${pkg.speedDown / 1000} Gb/s`
              : `${pkg.speedDown} Mb/s`}
          </div>
        ) : (
          <div className="text-3xl sm:text-4xl font-extrabold text-foreground">
            {(pkg as TVPackage).channels}+{" "}
            <span className="text-lg font-semibold text-muted-foreground">
              kanałów
            </span>
          </div>
        )}
      </div>

      {/* Price */}
      <div className="text-center mb-1">
        <span className="text-3xl sm:text-4xl font-extrabold text-foreground">
          {pricing.monthlyPrice}
        </span>
        <span className="text-base text-muted-foreground ml-1">zł/mies.</span>
      </div>
      <div className="text-center text-[11px] text-muted-foreground mb-4 space-y-0.5">
        <p>{pricing.periodLabel}</p>
        <p>
          Aktywacja:{" "}
          {pricing.activationFee === 0 ? (
            <span className="text-green-600 dark:text-green-400 font-medium">Gratis</span>
          ) : (
            `${pricing.activationFee} zł`
          )}
        </p>
        <p>
          Podłączenie:{" "}
          {pricing.installationFee === 0 ? (
            <span className="text-green-600 dark:text-green-400 font-medium">Gratis</span>
          ) : (
            `${pricing.installationFee} zł`
          )}
        </p>
      </div>

      {/* Divider */}
      <div className="h-px bg-border my-4" />

      {/* Features */}
      <ul className="space-y-2.5 flex-1 inline-flex flex-col items-start self-center">
        {pkg.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5">
            <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
            <span className="text-sm text-muted-foreground text-left">
              {feature}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <div className="mt-auto pt-6">
        <Button
          onClick={onSelect}
          variant={pkg.featured ? "default" : "outline"}
          className="w-full h-11 rounded-xl font-semibold"
        >
          Wybieram
        </Button>
      </div>
    </motion.div>
  )
}
