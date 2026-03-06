import { motion } from "framer-motion"
import { CheckCircle, Zap, Cable, Wifi } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { technologyMeta } from "@/data/packages"
import type { CoverageCheckResult, TechCategory } from "@/types"
import OutOfCoverageInfo from "./OutOfCoverageInfo"
import RadioOnlyNotice from "./RadioOnlyNotice"

interface CoverageResultProps {
  result: CoverageCheckResult
  onReset: () => void
}

const techIcons: Record<TechCategory, React.ElementType> = {
  gpon: Zap,
  bsa: Cable,
  docsis: Wifi,
  radio: Wifi,
}

export default function CoverageResult({
  result,
  onReset,
}: CoverageResultProps) {
  const navigate = useNavigate()
  if (result.status === "not_covered") {
    return <OutOfCoverageInfo message={result.message} onReset={onReset} />
  }

  if (result.status === "radio_only") {
    return <RadioOnlyNotice result={result} onReset={onReset} />
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
          <p className="text-sm text-muted-foreground mt-1">
            {result.address.city}
            {result.address.street && `, ${result.address.street}`}{" "}
            {result.address.building}
          </p>
        </div>
      </div>

      {/* Technology Badges */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium">Dostępne technologie:</h4>
        <div className="flex flex-wrap gap-2">
          {result.technologies.map((tech) => {
            const meta = technologyMeta[tech]
            const Icon = techIcons[tech]
            return (
              <motion.span
                key={tech}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary"
              >
                <Icon className="h-3.5 w-3.5" />
                {meta.shortLabel}
              </motion.span>
            )
          })}
        </div>
      </div>

      {/* Max speeds per technology */}
      {Object.entries(result.maxSpeeds).length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Maksymalne prędkości:</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {result.technologies.map((tech) => {
              const speeds = result.maxSpeeds[tech]
              if (!speeds) return null
              const meta = technologyMeta[tech]
              return (
                <div
                  key={tech}
                  className="flex items-center justify-between px-3 py-2 rounded-lg bg-muted/50 text-sm"
                >
                  <span className="text-muted-foreground">
                    {meta.shortLabel}
                  </span>
                  <span className="font-semibold">
                    {speeds.down >= 1000
                      ? `${speeds.down / 1000} Gb/s`
                      : `${speeds.down} Mb/s`}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button
          className="flex-1"
          onClick={() => navigate("/pakiety", { state: { coverageResult: result } })}
        >
          Zobacz pakiety
        </Button>
        <Button variant="outline" onClick={onReset} className="flex-1">
          Sprawdź inny adres
        </Button>
      </div>
    </motion.div>
  )
}
