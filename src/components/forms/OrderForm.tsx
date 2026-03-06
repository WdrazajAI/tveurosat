import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ShoppingCart, CheckCircle, Loader2, Wifi, Tv, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { orderFormSchema, type OrderFormData } from "@/lib/form-schemas"
import {
  getInternetPackageById,
  getTVPackageById,
  allInternetPackages,
  technologyMeta,
} from "@/data/packages"
import type { ContractPeriod } from "@/types"

interface OrderFormProps {
  defaults: {
    internetPackageId: string
    internetPeriod: string
    tvPackageId: string
    tvPeriod: string
    city: string
    street: string
    building: string
  }
}

export default function OrderForm({ defaults }: OrderFormProps) {
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      internetPackageId: defaults.internetPackageId,
      internetPeriod: defaults.internetPeriod || "24m",
      tvPackageId: defaults.tvPackageId || undefined,
      tvPeriod: defaults.tvPeriod || "24m",
      city: defaults.city,
      street: defaults.street || undefined,
      building: defaults.building,
      consent: false,
      honeypot: "",
      installationNotes: "",
    },
  })

  const selectedInternetId = watch("internetPackageId")
  const selectedPeriod = watch("internetPeriod") as ContractPeriod
  const selectedTVId = watch("tvPackageId")

  const internetPkg = selectedInternetId
    ? getInternetPackageById(selectedInternetId)
    : undefined
  const tvPkg = selectedTVId ? getTVPackageById(selectedTVId) : undefined

  const internetPricing = internetPkg?.pricing.find(
    (p) => p.period === selectedPeriod
  )
  const tvPricing = tvPkg?.pricing.find((p) => p.period === selectedPeriod)

  async function onSubmit(data: OrderFormData) {
    if (data.honeypot) return
    await new Promise((resolve) => setTimeout(resolve, 800))
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-8">
        <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
          <CheckCircle className="h-8 w-8 text-green-500" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Zamowienie przyjete!</h3>
        <p className="text-muted-foreground">
          Dziekujemy za zlozenie zamowienia
          {internetPkg ? ` na pakiet ${internetPkg.name}` : ""}.
          Skontaktujemy sie z Toba w ciagu 24 godzin, aby potwierdzic
          szczegoly.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Honeypot */}
      <div className="sr-only" aria-hidden="true">
        <input type="text" tabIndex={-1} {...register("honeypot")} />
      </div>

      {/* Package Selection */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wide">
          Wybrany pakiet internetu
        </h3>
        <select
          id="order-internet"
          {...register("internetPackageId")}
          className="w-full h-10 px-3 rounded-md border border-input bg-transparent text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none"
        >
          <option value="">Wybierz pakiet...</option>
          {allInternetPackages.map((pkg) => {
            const meta = technologyMeta[pkg.technology]
            const price = pkg.pricing.find((p) => p.period === "24m")
            return (
              <option key={pkg.id} value={pkg.id}>
                {pkg.name} ({meta.shortLabel}) &mdash;{" "}
                {price?.monthlyPrice || pkg.pricing[0].monthlyPrice} zł/mies.
              </option>
            )
          })}
        </select>
        {errors.internetPackageId && (
          <p className="text-sm text-destructive mt-1">
            {errors.internetPackageId.message}
          </p>
        )}
      </div>

      {/* Hidden fields for period and TV */}
      <input type="hidden" {...register("internetPeriod")} />
      {defaults.tvPackageId && (
        <>
          <input type="hidden" {...register("tvPackageId")} />
          <input type="hidden" {...register("tvPeriod")} />
        </>
      )}

      {/* Package Summary */}
      {internetPkg && internetPricing && (
        <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wifi className="h-4 w-4 text-primary" />
              <span className="font-medium">{internetPkg.name}</span>
            </div>
            <span className="font-bold">
              {internetPricing.monthlyPrice} zł/mies.
            </span>
          </div>
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <Check className="h-3 w-3 text-primary" />
            {internetPkg.speedDown >= 1000
              ? `${internetPkg.speedDown / 1000} Gb/s`
              : `${internetPkg.speedDown} Mb/s`}{" "}
            &mdash; {internetPricing.periodLabel}
          </div>

          {tvPkg && tvPricing && (
            <>
              <div className="h-px bg-border" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tv className="h-4 w-4 text-primary" />
                  <span className="font-medium">{tvPkg.name}</span>
                </div>
                <span className="font-bold">
                  {tvPricing.monthlyPrice} zł/mies.
                </span>
              </div>
            </>
          )}

          <div className="h-px bg-border" />
          <div className="flex items-center justify-between font-bold">
            <span>Razem</span>
            <span className="text-primary">
              {internetPricing.monthlyPrice +
                (tvPricing?.monthlyPrice || 0)}{" "}
              zł/mies.
            </span>
          </div>
        </div>
      )}

      {/* Divider */}
      <div className="h-px bg-border" />

      {/* Personal Data */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wide">
          Dane kontaktowe
        </h3>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="order-name"
              className="block text-sm font-medium mb-1.5"
            >
              Imie i nazwisko *
            </label>
            <Input
              id="order-name"
              {...register("name")}
              placeholder="Jan Kowalski"
            />
            {errors.name && (
              <p className="text-sm text-destructive mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="order-email"
                className="block text-sm font-medium mb-1.5"
              >
                Adres e-mail *
              </label>
              <Input
                id="order-email"
                type="email"
                {...register("email")}
                placeholder="jan@example.com"
              />
              {errors.email && (
                <p className="text-sm text-destructive mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="order-phone"
                className="block text-sm font-medium mb-1.5"
              >
                Numer telefonu *
              </label>
              <Input
                id="order-phone"
                type="tel"
                {...register("phone")}
                placeholder="+48 123 456 789"
              />
              {errors.phone && (
                <p className="text-sm text-destructive mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="h-px bg-border" />

      {/* Address */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wide">
          Adres instalacji
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="order-city"
                className="block text-sm font-medium mb-1.5"
              >
                Miejscowość *
              </label>
              <Input
                id="order-city"
                {...register("city")}
                placeholder="Małkinia Górna"
              />
              {errors.city && (
                <p className="text-sm text-destructive mt-1">
                  {errors.city.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="order-street"
                className="block text-sm font-medium mb-1.5"
              >
                Ulica
              </label>
              <Input
                id="order-street"
                {...register("street")}
                placeholder="np. Główna"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="order-building"
                className="block text-sm font-medium mb-1.5"
              >
                Numer budynku *
              </label>
              <Input
                id="order-building"
                {...register("building")}
                placeholder="12A"
              />
              {errors.building && (
                <p className="text-sm text-destructive mt-1">
                  {errors.building.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="order-postal"
                className="block text-sm font-medium mb-1.5"
              >
                Kod pocztowy *
              </label>
              <Input
                id="order-postal"
                {...register("postalCode")}
                placeholder="07-320"
              />
              {errors.postalCode && (
                <p className="text-sm text-destructive mt-1">
                  {errors.postalCode.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="h-px bg-border" />

      {/* Installation Notes */}
      <div>
        <label
          htmlFor="order-notes"
          className="block text-sm font-medium mb-1.5"
        >
          Uwagi do instalacji{" "}
          <span className="text-muted-foreground font-normal">
            (opcjonalnie)
          </span>
        </label>
        <Textarea
          id="order-notes"
          {...register("installationNotes")}
          placeholder="Np. preferowany termin instalacji, dodatkowe informacje o lokalizacji..."
          rows={3}
        />
      </div>

      {/* Consent */}
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          id="order-consent"
          {...register("consent")}
          className="mt-1 h-4 w-4 rounded border-input accent-primary"
        />
        <label
          htmlFor="order-consent"
          className="text-sm text-muted-foreground leading-relaxed"
        >
          Wyrazam zgode na przetwarzanie moich danych osobowych w celu
          realizacji zamowienia. *
        </label>
      </div>
      {errors.consent && (
        <p className="text-sm text-destructive -mt-3">
          {errors.consent.message}
        </p>
      )}

      {/* Submit */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-12 rounded-xl font-semibold"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Składam zamówienie...
          </>
        ) : (
          <>
            <ShoppingCart className="mr-2 h-4 w-4" />
            Złóż zamówienie
          </>
        )}
      </Button>
    </form>
  )
}
