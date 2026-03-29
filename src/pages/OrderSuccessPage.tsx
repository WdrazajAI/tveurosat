import { useSearchParams, Link } from "react-router-dom"
import { CheckCircle, Home, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import PageHero from "@/components/layout/PageHero"

export default function OrderSuccessPage() {
  const [searchParams] = useSearchParams()
  const orderId = searchParams.get("order_id")

  return (
    <>
      <PageHero
        title="Zamówienie złożone!"
        subtitle="Dziękujemy za zaufanie"
        breadcrumbs={[
          { label: "Oferta", href: "/pakiety" },
          { label: "Zamówienie", href: "/zamowienie" },
          { label: "Sukces" },
        ]}
      />

      <section className="py-12 sm:py-16">
        <div className="max-w-lg mx-auto px-4 sm:px-6 text-center">
          <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-500" />
          </div>

          <h2 className="text-2xl font-bold mb-3">Zamówienie przyjęte</h2>
          <p className="text-muted-foreground mb-2">
            Twoje zamówienie zostało zarejestrowane w naszym systemie.
          </p>
          <p className="text-muted-foreground mb-8">
            Skontaktujemy się z Tobą w ciągu 24 godzin w celu ustalenia
            szczegółów i terminu instalacji.
          </p>

          {orderId && (
            <p className="text-sm text-muted-foreground mb-8">
              Numer zamówienia:{" "}
              <span className="font-mono font-medium text-foreground">
                #{orderId.slice(0, 8)}
              </span>
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild>
              <Link to="/">
                <Home className="mr-2 h-4 w-4" />
                Strona główna
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/kontakt">
                <Phone className="mr-2 h-4 w-4" />
                Kontakt
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
