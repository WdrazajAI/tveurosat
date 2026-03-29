import { useState, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import ReCAPTCHA from "react-google-recaptcha"
import { ShoppingCart, Loader2, Wifi, Tv, Check, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { orderFormSchema, type OrderFormData } from "@/lib/form-schemas"
import {
  getInternetPackageById,
  getTVPackageById,
  technologyMeta,
} from "@/data/packages"
import { supabase } from "@/lib/supabase"
import type { ContractPeriod } from "@/types"
import { useTheme } from "@/context/ThemeContext"

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
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const recaptchaRef = useRef<ReCAPTCHA>(null)
  const { theme } = useTheme()

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
    if (!captchaToken) {
      setSubmitError("Proszę potwierdzić, że nie jesteś robotem.")
      return
    }
    setSubmitError(null)

    try {
      const monthlyTotal =
        (internetPricing?.monthlyPrice || 0) + (tvPricing?.monthlyPrice || 0)
      const onetimeTotal =
        (internetPricing?.activationFee || 0) +
        (internetPricing?.installationFee || 0) +
        (tvPricing?.activationFee || 0) +
        (tvPricing?.installationFee || 0)

      const techMeta = internetPkg ? technologyMeta[internetPkg.technology] : null

      const { data: result, error } = await supabase.functions.invoke(
        "create-order",
        {
          body: {
            internetPackageId: internetPkg?.id || null,
            internetPackageName: internetPkg
              ? `${internetPkg.name} (${techMeta?.shortLabel || ""})`
              : null,
            internetPeriod: internetPricing?.period || null,
            internetMonthlyPrice: internetPricing?.monthlyPrice || null,
            internetActivationFee: internetPricing?.activationFee || null,
            internetInstallationFee: internetPricing?.installationFee || null,
            tvPackageId: tvPkg?.id || null,
            tvPackageName: tvPkg?.name || null,
            tvPeriod: tvPricing?.period || null,
            tvMonthlyPrice: tvPricing?.monthlyPrice || null,
            tvActivationFee: tvPricing?.activationFee || null,
            tvInstallationFee: tvPricing?.installationFee || null,
            tvAddons: [],
            monthlyTotal,
            onetimeTotal,
            name: data.name,
            email: data.email,
            phone: data.phone,
            city: data.city,
            street: data.street || "",
            building: data.building,
            postalCode: data.postalCode,
            installationNotes: data.installationNotes || "",
            captchaToken,
          },
        }
      )

      if (error) throw new Error(error.message)
      if (!result?.orderId) throw new Error("Nie udało się złożyć zamówienia")

      // Redirect to success page
      window.location.href = `/zamowienie/sukces?order_id=${result.orderId}`
    } catch (err) {
      console.error("Checkout error:", err)
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Wystąpił błąd podczas składania zamówienia. Spróbuj ponownie."
      )
      recaptchaRef.current?.reset()
      setCaptchaToken(null)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Honeypot */}
      <div className="sr-only" aria-hidden="true">
        <input type="text" tabIndex={-1} {...register("honeypot")} />
      </div>

      {/* Package Selection — static display (no dropdown) */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wide text-center">
          Wybrany pakiet internetu
        </h3>
        <input type="hidden" {...register("internetPackageId")} />
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
        <h3 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wide text-center">
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
        <h3 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wide text-center">
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

      {/* reCAPTCHA */}
      {import.meta.env.VITE_RECAPTCHA_SITE_KEY && (
        <div className="flex justify-center">
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
            onChange={(token) => setCaptchaToken(token)}
            onExpired={() => setCaptchaToken(null)}
            onErrored={() => setCaptchaToken(null)}
            theme={theme === "dark" ? "dark" : "light"}
          />
        </div>
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

      {submitError && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {submitError}
        </div>
      )}
    </form>
  )
}
