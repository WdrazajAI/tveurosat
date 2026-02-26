import { motion } from "framer-motion"
import { Lock, FileText, Package, Headphones, ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import PageHero from "@/components/layout/PageHero"

const plannedFeatures = [
  { icon: FileText, label: "Przeglądanie faktur", description: "Dostęp do historii faktur i płatności online" },
  { icon: Package, label: "Zmiana pakietu", description: "Samodzielny upgrade lub zmiana pakietu" },
  { icon: Headphones, label: "Zgłoszenia serwisowe", description: "Składanie i śledzenie zgłoszeń technicznych" },
]

export default function ClientZonePage() {
  return (
    <>
      <PageHero
        title="Strefa Klienta"
        subtitle="Zarządzaj swoim kontem, fakturami i usługami w jednym miejscu."
        breadcrumbs={[{ label: "Strefa Klienta" }]}
      />

      <section className="pt-6 pb-12 sm:pt-8 sm:pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Mock Login Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl bg-card border border-border p-6 sm:p-8"
            >
              <div className="flex flex-col items-center gap-2 mb-6 text-center">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Lock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Logowanie</h2>
                  <p className="text-xs text-muted-foreground">Panel klienta</p>
                </div>
              </div>

              <form
                onSubmit={(e) => e.preventDefault()}
                className="space-y-4"
              >
                <div>
                  <label htmlFor="cz-email" className="block text-sm font-medium mb-1.5">
                    Adres e-mail
                  </label>
                  <Input id="cz-email" type="email" placeholder="jan@example.com" />
                </div>
                <div>
                  <label htmlFor="cz-password" className="block text-sm font-medium mb-1.5">
                    Hasło
                  </label>
                  <Input id="cz-password" type="password" placeholder="Twoje hasło" />
                </div>
                <Button disabled className="w-full h-11 rounded-xl font-semibold opacity-60">
                  Zaloguj się
                </Button>
              </form>

              {/* Coming Soon Banner */}
              <div className="mt-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
                <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">
                  Strefa Klienta jest w przygotowaniu
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Funkcja logowania będzie dostępna wkrótce. Pracujemy nad panelem klienta.
                </p>
              </div>
            </motion.div>

            {/* Planned Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-xl font-bold mb-2">Planowane funkcje</h2>
                <p className="text-muted-foreground text-sm">
                  W Strefie Klienta będziesz mógł samodzielnie zarządzać swoim kontem i usługami:
                </p>
              </div>

              <div className="space-y-4">
                {plannedFeatures.map((feature) => {
                  const Icon = feature.icon
                  return (
                    <div
                      key={feature.label}
                      className="flex items-start gap-4 p-4 rounded-xl bg-card border border-border"
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">{feature.label}</h3>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Contact CTA */}
              <div className="p-5 rounded-xl bg-primary/5 border border-primary/10">
                <p className="text-sm text-muted-foreground mb-3">
                  W międzyczasie, skontaktuj się z nami w sprawach dotyczących Twojego konta:
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/kontakt" className="inline-flex items-center gap-1.5 whitespace-nowrap">
                    Kontakt <ArrowRight className="h-3.5 w-3.5 flex-shrink-0" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}
