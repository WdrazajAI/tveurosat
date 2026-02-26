import { MapPin, ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"

export default function LocationBanner() {
  return (
    <div className="w-fit mx-auto bg-primary/5 border border-primary/10 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 text-center sm:text-left">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
        <span>
          Sprawdź dostępność usług w Twojej lokalizacji, aby zobaczyć spersonalizowaną ofertę.
        </span>
      </div>
      <Link
        to="/sprawdz-dostepnosc"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline whitespace-nowrap"
      >
        Sprawdź adres
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  )
}
