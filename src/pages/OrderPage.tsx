import { useSearchParams, Link } from "react-router-dom"
import { motion } from "framer-motion"
import PageHero from "@/components/layout/PageHero"
import OrderForm from "@/components/forms/OrderForm"

export default function OrderPage() {
  const [searchParams] = useSearchParams()
  const packageId = searchParams.get("pakiet") || undefined

  return (
    <>
      <PageHero
        title="Zamów Pakiet"
        subtitle="Wypełnij formularz, a skontaktujemy się z Tobą w celu potwierdzenia zamówienia."
        breadcrumbs={[
          { label: "Pakiety", href: "/pakiety" },
          { label: "Zamówienie" },
        ]}
      />

      <section className="pt-6 pb-12 sm:pt-8 sm:pb-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="rounded-2xl bg-card border border-border p-6 sm:p-8">
              <OrderForm defaultPackageId={packageId} />
            </div>
          </motion.div>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Szczegoly oferty i regulamin dostepne w{" "}
            <Link to="/dokumenty" className="text-primary hover:underline">
              dokumentach
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  )
}
