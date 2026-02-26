import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Wrench, FileCheck, Zap } from "lucide-react"
import CoverageForm from "@/components/coverage/CoverageForm"
import CoverageResult from "@/components/coverage/CoverageResult"
import type { CoverageResult as CoverageResultType } from "@/types"

export default function CTASection() {
  const [result, setResult] = useState<CoverageResultType | null>(null)

  return (
    <section id="cta-section" className="py-24 sm:py-32 bg-card/20 relative overflow-hidden">
      {/* Decorative Geometric Shapes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-16 left-[5%] w-72 h-72 border-2 border-primary/10 rotate-45 rounded-3xl hidden md:block" />
        <div className="absolute bottom-10 right-[10%] w-3 h-3 bg-secondary rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1]">
              Sprawdź Dostępność w Twojej Lokalizacji
            </h2>
            <p className="mt-4 text-base sm:text-lg leading-relaxed text-muted-foreground">
              Wprowadź swój adres, a sprawdzimy czy nasze usługi są dostępne w
              Twojej okolicy. Zajmie to tylko chwilę.
            </p>

            {/* Trust Indicators */}
            <div className="flex flex-col sm:flex-row gap-6 mt-8">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Wrench className="h-5 w-5 text-primary" />
                <span>Darmowy montaż</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileCheck className="h-5 w-5 text-primary" />
                <span>Bez umowy na czas</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Zap className="h-5 w-5 text-primary" />
                <span>Aktywacja w 48h</span>
              </div>
            </div>
          </motion.div>

          {/* Right - Coverage Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl bg-card/80 backdrop-blur-sm border border-border shadow-lg shadow-primary/5 p-6 sm:p-8 lg:p-10"
          >
            <AnimatePresence mode="wait">
              {!result ? (
                <div key="form">
                  <h3 className="text-xl font-semibold mb-6">
                    Wprowadź swój adres
                  </h3>
                  <CoverageForm onResult={setResult} />
                </div>
              ) : (
                <div key="result">
                  <CoverageResult
                    result={result}
                    onReset={() => setResult(null)}
                  />
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
