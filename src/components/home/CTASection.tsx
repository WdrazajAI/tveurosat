import { motion } from "framer-motion"
import { ArrowRight, Wrench, FileCheck, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CTASection() {
  return (
    <section
      id="cta-section"
      className="py-24 sm:py-32 bg-white"
    >
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

          {/* Right - Form Area */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl bg-[hsl(210,20%,98%)] border border-border/50 p-8 sm:p-10"
          >
            <h3 className="text-xl font-semibold mb-6">
              Wprowadź swój adres
            </h3>
            <form className="space-y-4">
              <div>
                <label
                  htmlFor="city"
                  className="block text-sm font-medium mb-2"
                >
                  Miejscowość
                </label>
                <input
                  type="text"
                  id="city"
                  placeholder="np. Małkinia Górna"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>
              <div>
                <label
                  htmlFor="street"
                  className="block text-sm font-medium mb-2"
                >
                  Ulica
                </label>
                <input
                  type="text"
                  id="street"
                  placeholder="np. Główna"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>
              <div>
                <label
                  htmlFor="number"
                  className="block text-sm font-medium mb-2"
                >
                  Numer domu
                </label>
                <input
                  type="text"
                  id="number"
                  placeholder="np. 12A"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>
              <Button
                type="submit"
                className="w-full mt-4 h-13 bg-primary text-white font-semibold rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
              >
                Sprawdź Dostępność <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
