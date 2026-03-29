import { motion } from "framer-motion"
import { Zap, Cable, Network, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { technologyMeta } from "@/data/packages"
import type { CoverageCheckResult, TechCategory } from "@/types"

interface TechnologyOverviewProps {
  result: CoverageCheckResult
  onProceed: () => void
  onReset: () => void
}

const techIcons: Record<TechCategory, React.ElementType> = {
  ftth_dom: Zap,
  ftth_blok: Cable,
  ftth_syntis: Network,
}

const techColors: Record<TechCategory, string> = {
  ftth_dom: "from-blue-500/20 to-blue-600/5 border-blue-500/30",
  ftth_blok: "from-violet-500/20 to-violet-600/5 border-violet-500/30",
  ftth_syntis: "from-emerald-500/20 to-emerald-600/5 border-emerald-500/30",
}

const techIconColors: Record<TechCategory, string> = {
  ftth_dom: "text-blue-500",
  ftth_blok: "text-violet-500",
  ftth_syntis: "text-emerald-500",
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 },
}

export default function TechnologyOverview({
  result,
  onProceed,
  onReset,
}: TechnologyOverviewProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold">
          Dostępne technologie pod adresem
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          {result.address.city}
          {result.address.street && `, ${result.address.street}`}{" "}
          {result.address.building}
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        {result.technologies.map((tech) => {
          const meta = technologyMeta[tech]
          const Icon = techIcons[tech]
          const speeds = result.maxSpeeds[tech]

          return (
            <motion.div
              key={tech}
              variants={itemVariants}
              className={`p-5 rounded-xl bg-gradient-to-br border ${techColors[tech]}`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`w-10 h-10 rounded-lg bg-background/80 flex items-center justify-center ${techIconColors[tech]}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">{meta.label}</h4>
                  {speeds && (
                    <p className="text-xs text-muted-foreground">
                      do{" "}
                      {speeds.down >= 1000
                        ? `${speeds.down / 1000} Gb/s`
                        : `${speeds.down} Mb/s`}
                    </p>
                  )}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                {meta.description}
              </p>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Info about dual TV availability (DOCSIS/GPON BLOK addresses) */}
      {result.tvDeliveryTypes.includes("iptv") &&
        result.tvDeliveryTypes.includes("dvb_c") && (
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="p-4 rounded-xl bg-gradient-to-br from-orange-500/10 to-orange-600/5 border border-orange-500/20"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-background/80 flex items-center justify-center text-orange-500">
                <Cable className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-semibold text-sm">
                  Kabel koncentryczny — telewizja DVB-C
                </h4>
                <p className="text-xs text-muted-foreground">
                  Pod Twoim adresem dostępna jest również telewizja przez kabel koncentryczny (DVB-C) — niezależnie od internetu
                </p>
              </div>
            </div>
          </motion.div>
        )}

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button onClick={onProceed} className="flex-1">
          Wybierz pakiet
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        <Button variant="outline" onClick={onReset} className="flex-1">
          Zmień adres
        </Button>
      </div>
    </div>
  )
}
