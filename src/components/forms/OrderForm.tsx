import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ShoppingCart, CheckCircle, Loader2, Wifi, Tv, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { orderFormSchema, type OrderFormData } from "@/lib/form-schemas"
import { allPackages, getPackageById } from "@/data/packages"

interface OrderFormProps {
  defaultPackageId?: string
}

const typeLabels: Record<string, string> = {
  internet: "Internet",
  tv: "Telewizja",
  combo: "Internet + TV",
}

export default function OrderForm({ defaultPackageId }: OrderFormProps) {
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      packageId: defaultPackageId || "",
      consent: false,
      honeypot: "",
      installationNotes: "",
    },
  })

  const selectedPackageId = watch("packageId")
  const selectedPackage = selectedPackageId ? getPackageById(selectedPackageId) : undefined

  async function onSubmit(data: OrderFormData) {
    if (data.honeypot) return

    // MVP: simulate submission
    await new Promise((resolve) => setTimeout(resolve, 800))
    setSubmitted(true)
  }

  if (submitted) {
    const pkg = selectedPackage
    return (
      <div className="flex flex-col items-center justify-center text-center py-8">
        <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
          <CheckCircle className="h-8 w-8 text-green-500" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Zamowienie przyjete!</h3>
        <p className="text-muted-foreground">
          Dziekujemy za zlozenie zamowienia{pkg ? ` na pakiet ${pkg.name}` : ""}.
          Skontaktujemy sie z Toba w ciagu 24 godzin, aby potwierdzic szczegoly.
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
          Wybrany pakiet
        </h3>
        <select
          id="order-package"
          {...register("packageId")}
          className="w-full h-10 px-3 rounded-md border border-input bg-transparent text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none"
        >
          <option value="">Wybierz pakiet...</option>
          {allPackages.map((pkg) => (
            <option key={pkg.id} value={pkg.id}>
              {pkg.name} ({typeLabels[pkg.type]}) &mdash; {pkg.price} {pkg.priceNote}
            </option>
          ))}
        </select>
        {errors.packageId && (
          <p className="text-sm text-destructive mt-1">{errors.packageId.message}</p>
        )}
      </div>

      {/* Package Summary */}
      {selectedPackage && (
        <div className="flex items-center gap-4 p-4 rounded-xl bg-primary/5 border border-primary/10">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            {selectedPackage.type === "internet" && <Wifi className="h-5 w-5 text-primary" />}
            {selectedPackage.type === "tv" && <Tv className="h-5 w-5 text-primary" />}
            {selectedPackage.type === "combo" && <Package className="h-5 w-5 text-primary" />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-foreground">{selectedPackage.name}</div>
            <div className="text-sm text-muted-foreground">
              {selectedPackage.speed && `${selectedPackage.speed}`}
              {selectedPackage.speed && selectedPackage.channels && " + "}
              {selectedPackage.channels && `${selectedPackage.channels}+ kanałów`}
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <span className="text-xl font-bold text-foreground">{selectedPackage.price}</span>
            <span className="text-sm text-muted-foreground ml-1">{selectedPackage.priceNote}</span>
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
            <label htmlFor="order-name" className="block text-sm font-medium mb-1.5">
              Imie i nazwisko *
            </label>
            <Input
              id="order-name"
              {...register("name")}
              placeholder="Jan Kowalski"
            />
            {errors.name && (
              <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="order-email" className="block text-sm font-medium mb-1.5">
                Adres e-mail *
              </label>
              <Input
                id="order-email"
                type="email"
                {...register("email")}
                placeholder="jan@example.com"
              />
              {errors.email && (
                <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="order-phone" className="block text-sm font-medium mb-1.5">
                Numer telefonu *
              </label>
              <Input
                id="order-phone"
                type="tel"
                {...register("phone")}
                placeholder="+48 123 456 789"
              />
              {errors.phone && (
                <p className="text-sm text-destructive mt-1">{errors.phone.message}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-border" />

      {/* Address */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wide">
          Adres instalacji
        </h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="order-street" className="block text-sm font-medium mb-1.5">
              Ulica i numer budynku/mieszkania *
            </label>
            <Input
              id="order-street"
              {...register("street")}
              placeholder="ul. Przykładowa 1/2"
            />
            {errors.street && (
              <p className="text-sm text-destructive mt-1">{errors.street.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="order-postal" className="block text-sm font-medium mb-1.5">
                Kod pocztowy *
              </label>
              <Input
                id="order-postal"
                {...register("postalCode")}
                placeholder="07-320"
              />
              {errors.postalCode && (
                <p className="text-sm text-destructive mt-1">{errors.postalCode.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="order-city" className="block text-sm font-medium mb-1.5">
                Miasto *
              </label>
              <Input
                id="order-city"
                {...register("city")}
                placeholder="Małkinia Górna"
              />
              {errors.city && (
                <p className="text-sm text-destructive mt-1">{errors.city.message}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-border" />

      {/* Installation Notes */}
      <div>
        <label htmlFor="order-notes" className="block text-sm font-medium mb-1.5">
          Uwagi do instalacji <span className="text-muted-foreground font-normal">(opcjonalnie)</span>
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
        <label htmlFor="order-consent" className="text-sm text-muted-foreground leading-relaxed">
          Wyrazam zgode na przetwarzanie moich danych osobowych w celu realizacji
          zamowienia. *
        </label>
      </div>
      {errors.consent && (
        <p className="text-sm text-destructive -mt-3">{errors.consent.message}</p>
      )}

      {/* Submit */}
      <Button type="submit" disabled={isSubmitting} className="w-full h-12 rounded-xl font-semibold">
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
