import { motion } from "framer-motion"
import { Wifi, Tv, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export type ServiceChoice = "internet" | "tv" | "both"

interface ServiceSelectorProps {
  onSelect: (choice: ServiceChoice) => void
  onBack: () => void
  hasTVOptions: boolean
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 },
}

export default function ServiceSelector({
  onSelect,
  onBack,
  hasTVOptions,
}: ServiceSelectorProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Co Cię interesuje?</h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            Wybierz usługi, które chcesz zamówić
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

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        {/* Internet only */}
        <motion.button
          variants={itemVariants}
          onClick={() => onSelect("internet")}
          className="group p-6 rounded-2xl border border-border bg-card text-left hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30 transition-all duration-300"
        >
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
            <Wifi className="h-6 w-6 text-primary" />
          </div>
          <h4 className="text-base font-semibold mb-1">Internet</h4>
          <p className="text-sm text-muted-foreground">
            Szybki internet światłowodowy lub kablowy
          </p>
        </motion.button>

        {/* TV only */}
        {hasTVOptions && (
          <motion.button
            variants={itemVariants}
            onClick={() => onSelect("tv")}
            className="group p-6 rounded-2xl border border-border bg-card text-left hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30 transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
              <Tv className="h-6 w-6 text-primary" />
            </div>
            <h4 className="text-base font-semibold mb-1">Telewizja</h4>
            <p className="text-sm text-muted-foreground">
              Telewizja cyfrowa IPTV lub kablowa
            </p>
          </motion.button>
        )}

        {/* Both */}
        {hasTVOptions && (
          <motion.button
            variants={itemVariants}
            onClick={() => onSelect("both")}
            className="group sm:col-span-2 p-6 rounded-2xl border-2 border-primary/20 bg-primary/[0.03] text-left hover:shadow-xl hover:shadow-primary/5 hover:border-primary/40 transition-all duration-300"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/15 transition-colors">
                <div className="flex -space-x-1">
                  <Wifi className="h-5 w-5 text-primary" />
                  <Tv className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div>
                <h4 className="text-base font-semibold mb-1">
                  Internet + Telewizja
                </h4>
                <p className="text-sm text-muted-foreground">
                  Połącz internet z telewizją w jednym pakiecie
                </p>
              </div>
            </div>
          </motion.button>
        )}
      </motion.div>
    </div>
  )
}
