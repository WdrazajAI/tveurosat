import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import PackageCard from "./PackageCard"
import { getInternetPackagesForTech, technologyMeta } from "@/data/packages"
import type { TechCategory, InternetPackage, ContractPeriod } from "@/types"

interface InternetPackageSelectorProps {
  technologies: TechCategory[]
  maxSpeeds: Partial<Record<TechCategory, { down: number; up: number }>>
  onSelect: (pkg: InternetPackage, period: ContractPeriod) => void
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

export default function InternetPackageSelector({
  technologies,
  onSelect,
  onBack,
}: InternetPackageSelectorProps) {
  const [period, setPeriod] = useState<ContractPeriod>("24m")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Wybierz pakiet internetu</h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            Kliknij pakiet, aby przejść dalej
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

      {/* Packages by technology */}
      {technologies.map((tech) => {
        const packages = getInternetPackagesForTech(tech)
        const meta = technologyMeta[tech]
        if (packages.length === 0) return null

        return (
          <div key={tech}>
            {technologies.length > 1 && (
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                {meta.label}
              </h4>
            )}
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
                    onSelect={() => onSelect(pkg, period)}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        )
      })}
    </div>
  )
}
