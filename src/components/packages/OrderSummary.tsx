import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { Check, ArrowLeft, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { technologyMeta } from "@/data/packages"
import type {
  InternetPackage,
  TVPackage,
  TVAddon,
  ContractPeriod,
} from "@/types"

interface OrderSummaryProps {
  address: { city: string; street: string; building: string }
  internetPackage: InternetPackage | null
  internetPeriod: ContractPeriod
  tvPackage: TVPackage | null
  tvPeriod: ContractPeriod
  tvAddons?: TVAddon[]
  onBack: () => void
  onReset: () => void
}

function getPricing(
  pkg: InternetPackage | TVPackage,
  period: ContractPeriod
) {
  return pkg.pricing.find((p) => p.period === period) || pkg.pricing[0]
}

function formatSpeed(mbps: number): string {
  return mbps >= 1000 ? `${mbps / 1000} Gb/s` : `${mbps} Mb/s`
}

function getAddonPrice(addon: TVAddon, period: ContractPeriod): number {
  if (addon.pricing) {
    const p = addon.pricing.find((pr) => pr.period === period)
    if (p) return p.monthlyPrice
  }
  return addon.monthlyPrice
}

function getAddonActivation(addon: TVAddon, period: ContractPeriod): number {
  if (addon.pricing) {
    const p = addon.pricing.find((pr) => pr.period === period)
    if (p) return p.activationFee
  }
  return 0
}

export default function OrderSummary({
  address,
  internetPackage,
  internetPeriod,
  tvPackage,
  tvPeriod,
  tvAddons = [],
  onBack,
  onReset,
}: OrderSummaryProps) {
  const internetPricing = internetPackage
    ? getPricing(internetPackage, internetPeriod)
    : null
  const tvPricing = tvPackage ? getPricing(tvPackage, tvPeriod) : null

  const addonsMonthly = tvAddons.reduce(
    (sum, a) => sum + getAddonPrice(a, tvPeriod),
    0
  )
  const addonsActivation = tvAddons.reduce(
    (sum, a) => sum + getAddonActivation(a, tvPeriod),
    0
  )

  const monthlyTotal =
    (internetPricing?.monthlyPrice || 0) +
    (tvPricing?.monthlyPrice || 0) +
    addonsMonthly
  const activationTotal =
    (internetPricing?.activationFee || 0) +
    (tvPricing?.activationFee || 0) +
    addonsActivation
  const installationTotal =
    (internetPricing?.installationFee || 0) + (tvPricing?.installationFee || 0)

  const techMeta = internetPackage
    ? technologyMeta[internetPackage.technology]
    : null

  // Build order URL params
  const orderParams = new URLSearchParams({
    city: address.city,
    building: address.building,
  })
  if (address.street) orderParams.set("street", address.street)
  if (internetPackage) {
    orderParams.set("internet", internetPackage.id)
    orderParams.set("period", internetPeriod)
  }
  if (tvPackage) {
    orderParams.set("tv", tvPackage.id)
    orderParams.set("tvPeriod", tvPeriod)
  }
  if (tvAddons.length > 0) {
    orderParams.set("addons", tvAddons.map((a) => a.id).join(","))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-xl mx-auto space-y-6"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Podsumowanie</h3>
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

      {/* Address */}
      <div className="p-4 rounded-xl bg-muted/50 border border-border">
        <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1">
          Adres instalacji
        </p>
        <p className="text-sm font-medium">
          {address.city}
          {address.street && `, ${address.street}`} {address.building}
        </p>
        {techMeta && (
          <p className="text-xs text-muted-foreground mt-0.5">
            {techMeta.label}
          </p>
        )}
      </div>

      {/* Selected services */}
      <div className="space-y-3">
        {/* Internet */}
        {internetPackage && internetPricing && (
          <div className="p-4 rounded-xl bg-card border border-border">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span className="font-semibold text-sm">
                  {internetPackage.name}
                </span>
              </div>
              <span className="font-bold text-primary">
                {internetPricing.monthlyPrice} zł/mies.
              </span>
            </div>
            <div className="text-xs text-muted-foreground space-y-0.5 ml-6">
              <p>
                Internet{" "}
                {formatSpeed(internetPackage.speedDown)}
              </p>
              <p>{internetPricing.periodLabel}</p>
              <p>
                Aktywacja:{" "}
                {internetPricing.activationFee === 0 ? (
                  <span className="text-green-600 dark:text-green-400">Gratis</span>
                ) : (
                  `${internetPricing.activationFee} zł`
                )}
              </p>
              <p>
                Podłączenie:{" "}
                {internetPricing.installationFee === 0 ? (
                  <span className="text-green-600 dark:text-green-400">Gratis*</span>
                ) : (
                  `${internetPricing.installationFee} zł*`
                )}
              </p>
            </div>
          </div>
        )}

        {/* TV */}
        {tvPackage && tvPricing && (
          <div className="p-4 rounded-xl bg-card border border-border">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span className="font-semibold text-sm">{tvPackage.name}</span>
              </div>
              <span className="font-bold text-primary">
                {tvPricing.monthlyPrice} zł/mies.
              </span>
            </div>
            <div className="text-xs text-muted-foreground space-y-0.5 ml-6">
              <p>{tvPackage.channels} kanałów</p>
              <p>{tvPricing.periodLabel}</p>
              <p>
                Aktywacja:{" "}
                {tvPricing.activationFee === 0 ? (
                  <span className="text-green-600 dark:text-green-400">Gratis</span>
                ) : (
                  `${tvPricing.activationFee} zł`
                )}
              </p>
              <p>
                Podłączenie:{" "}
                {tvPricing.installationFee === 0 ? (
                  <span className="text-green-600 dark:text-green-400">Gratis*</span>
                ) : (
                  `${tvPricing.installationFee} zł*`
                )}
              </p>
            </div>
          </div>
        )}

        {/* TV Addons */}
        {tvAddons.map((addon) => {
          const price = getAddonPrice(addon, tvPeriod)
          const activation = getAddonActivation(addon, tvPeriod)
          return (
            <div key={addon.id} className="p-4 rounded-xl bg-card border border-border">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-sm">{addon.name}</span>
                </div>
                <span className="font-bold text-primary">
                  +{price} zł/mies.
                </span>
              </div>
              <div className="text-xs text-muted-foreground ml-6">
                {addon.tagline && <p>{addon.tagline}</p>}
                {activation > 0 && <p>Aktywacja: {activation} zł</p>}
              </div>
            </div>
          )
        })}
      </div>

      {/* Price summary */}
      <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Opłata miesięczna</span>
            <span className="font-bold text-lg text-primary">
              {monthlyTotal} zł/mies.
            </span>
          </div>
          <div className="border-t border-border pt-2 mt-2 space-y-1">
            <p className="text-xs text-muted-foreground font-medium">
              Opłaty jednorazowe:
            </p>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Aktywacja</span>
              {activationTotal === 0 ? (
                <span className="text-green-600 dark:text-green-400 font-medium">Gratis</span>
              ) : (
                <span>{activationTotal} zł</span>
              )}
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Podłączenie*</span>
              {installationTotal === 0 ? (
                <span className="text-green-600 dark:text-green-400 font-medium">Gratis</span>
              ) : (
                <span>{installationTotal} zł</span>
              )}
            </div>
            <p className="text-[10px] text-muted-foreground/70 italic mt-1">
              * Opłata za podłączenie podlega indywidualnej ocenie
            </p>
          </div>
          {/* Total one-time cost */}
          {(activationTotal > 0 || installationTotal > 0) && (
            <div className="border-t border-primary/20 pt-2 mt-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Opłata na start</span>
                <span className="font-bold">
                  {activationTotal + installationTotal} zł
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button asChild className="flex-1">
          <Link to={`/zamowienie?${orderParams.toString()}`}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            Zamów teraz
          </Link>
        </Button>
        <Button variant="outline" onClick={onReset} className="flex-1">
          Zacznij od nowa
        </Button>
      </div>
    </motion.div>
  )
}
