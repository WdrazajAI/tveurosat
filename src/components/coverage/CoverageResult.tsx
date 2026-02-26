import { motion } from "framer-motion"
import { CheckCircle, Radio, Tv } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import type { CoverageResult as CoverageResultType } from "@/types"
import OutOfCoverageInfo from "./OutOfCoverageInfo"

interface CoverageResultProps {
  result: CoverageResultType
  onReset: () => void
}

export default function CoverageResult({ result, onReset }: CoverageResultProps) {
  if (!result.covered) {
    return <OutOfCoverageInfo message={result.message} onReset={onReset} />
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Success Banner */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/20">
        <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-green-700 dark:text-green-400">
            Twój adres jest w zasięgu!
          </p>
          <p className="text-sm text-muted-foreground mt-1">{result.message}</p>
        </div>
      </div>

      {/* Technology Badge */}
      {result.technology === "dvbt_iptv" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-start gap-3 p-4 rounded-xl bg-secondary/10 border border-secondary/20"
        >
          <Tv className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-secondary">
              DVB-T + IPTV dostępne
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              W Twojej lokalizacji dostępna jest zarówno telewizja tradycyjna DVB-T, jak i nowoczesna IPTV. Masz szerszy wybór pakietów!
            </p>
          </div>
        </motion.div>
      )}

      {result.technology === "iptv" && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Radio className="h-4 w-4 text-primary" />
          <span>Technologia: <strong className="text-foreground">IPTV</strong></span>
        </div>
      )}

      {/* Available Speed Tiers */}
      {result.area?.availableSpeedTiers && (
        <div>
          <h4 className="text-sm font-medium mb-3">Dostępne prędkości:</h4>
          <div className="flex flex-wrap gap-2">
            {result.area.availableSpeedTiers.map((tier) => (
              <span
                key={tier}
                className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary"
              >
                {tier === "1000" ? "1 Gb/s" : `${tier} Mb/s`}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button asChild className="flex-1">
          <Link to="/pakiety">Zobacz pakiety</Link>
        </Button>
        <Button variant="outline" onClick={onReset} className="flex-1">
          Sprawdź inny adres
        </Button>
      </div>
    </motion.div>
  )
}
