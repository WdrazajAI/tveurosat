import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import PageHero from "@/components/layout/PageHero"
import CoverageForm from "@/components/coverage/CoverageForm"
import CoverageResult from "@/components/coverage/CoverageResult"
import type { CoverageResult as CoverageResultType } from "@/types"

export default function CoverageCheckerPage() {
  const [result, setResult] = useState<CoverageResultType | null>(null)

  return (
    <>
      <PageHero
        title="Sprawdź Dostępność"
        subtitle="Wprowadź swój adres, a pokażemy Ci dostępne usługi i pakiety w Twojej lokalizacji."
        breadcrumbs={[{ label: "Sprawdź Dostępność" }]}
      />

      <section className="pt-3 pb-16 sm:pt-4 sm:pb-20">
        <div className="max-w-xl mx-auto px-4 sm:px-6">
          <AnimatePresence mode="wait">
            {!result ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <CoverageForm onResult={setResult} />
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <CoverageResult result={result} onReset={() => setResult(null)} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </>
  )
}
