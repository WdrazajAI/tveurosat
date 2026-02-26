import { motion } from "framer-motion"
import { Check, Wifi, Tv, Radio } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import type { Package } from "@/types"

interface PackageCardProps {
  pkg: Package
  index: number
}

const technologyLabels: Record<string, { label: string; icon: typeof Wifi }> = {
  iptv: { label: "Telewizja Kablowa / IPTV", icon: Radio },
  dvbt: { label: "DVB-T klasyczna", icon: Tv },
  dvbt_iptv: { label: "DVB-T + IPTV", icon: Tv },
}

export default function PackageCard({ pkg, index }: PackageCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className={`relative rounded-2xl bg-card border border-border p-6 sm:p-8 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 flex flex-col text-center ${
        pkg.featured ? "ring-2 ring-primary scale-[1.02]" : ""
      }`}
    >
      {/* Featured Badge */}
      {pkg.featured && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-secondary text-white text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">
          Najpopularniejszy
        </div>
      )}

      {/* Technology Badge */}
      {pkg.tvTechnology && technologyLabels[pkg.tvTechnology] && (
        <div className="flex items-center justify-center gap-1.5 mb-4">
          {(() => {
            const Icon = technologyLabels[pkg.tvTechnology!].icon
            return <Icon className="h-3.5 w-3.5 text-primary" />
          })()}
          <span className="text-xs font-medium text-primary">
            {technologyLabels[pkg.tvTechnology].label}
          </span>
        </div>
      )}

      {/* Package Name & Tagline */}
      <div className="text-sm uppercase tracking-widest text-primary font-semibold">
        {pkg.name}
      </div>
      <p className="text-xs text-muted-foreground mt-1 leading-relaxed min-h-[2rem]">
        {pkg.tagline}
      </p>

      {/* Speed / Channels */}
      <div className="mt-4 space-y-1">
        {pkg.speed && (
          <div className="text-3xl sm:text-4xl font-extrabold text-foreground">
            {pkg.speed}
          </div>
        )}
        {pkg.channels && (
          <div className="text-3xl sm:text-4xl font-extrabold text-foreground">
            {pkg.channels}+ <span className="text-lg font-semibold text-muted-foreground">kanałów</span>
          </div>
        )}
      </div>

      {/* Price */}
      <div className="mt-4">
        <span className="text-3xl sm:text-4xl font-extrabold text-foreground">
          {pkg.price}
        </span>
        <span className="text-base text-muted-foreground ml-1">{pkg.priceNote}</span>
      </div>

      {/* Divider */}
      <div className="h-px bg-border my-5" />

      {/* Features */}
      <ul className="space-y-2.5 flex-1 inline-flex flex-col items-start self-center">
        {pkg.features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-2.5">
            <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
            <span className="text-sm text-muted-foreground text-left">{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <div className="mt-auto pt-8">
        <Button
          className="w-full h-11 rounded-xl font-semibold"
          asChild
        >
          <Link to={`/zamowienie?pakiet=${pkg.id}`}>Zamów teraz</Link>
        </Button>
      </div>
    </motion.div>
  )
}
