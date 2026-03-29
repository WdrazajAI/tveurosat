import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, Loader2, Save, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { internetPackageSchema, type InternetPackageFormData, generateSlug } from "@/lib/admin-schemas"
import { useInternetPackageItem, useInternetPackagesAdmin } from "@/hooks/use-packages"

const technologies = [
  { value: "ftth_dom", label: "FTTH Dom (Światłowód — dom jednorodzinny)" },
  { value: "ftth_blok", label: "FTTH Blok (Światłowód — blok)" },
  { value: "ftth_syntis", label: "FTTH Syntis (Światłowód — infrastruktura operatora)" },
]

const defaultPricing: InternetPackageFormData["pricing"] = [
  { period: "24m", periodLabel: "Umowa 24 mies.", monthlyPrice: 0, activationFee: 0, installationFee: 0 },
  { period: "12m", periodLabel: "Umowa 12 mies.", monthlyPrice: 0, activationFee: 1, installationFee: 0 },
  { period: "indefinite", periodLabel: "Bez umowy", monthlyPrice: 0, activationFee: 49, installationFee: 99 },
]

export default function InternetPackageEditPage() {
  const { id } = useParams()
  const isNew = id === "nowy"
  const navigate = useNavigate()
  const { pkg, loading: loadingItem } = useInternetPackageItem(isNew ? undefined : id)
  const { create, update } = useInternetPackagesAdmin()
  const [error, setError] = useState<string | null>(null)
  const [featureInput, setFeatureInput] = useState("")

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InternetPackageFormData>({
    resolver: zodResolver(internetPackageSchema),
    defaultValues: {
      technology: "ftth_dom",
      features: [],
      pricing: defaultPricing,
      featured: false,
      active: true,
      order: 0,
    },
  })

  const { fields: pricingFields } = useFieldArray({ control, name: "pricing" })
  const features = watch("features")
  const name = watch("name")

  useEffect(() => {
    if (pkg && !isNew) {
      reset({
        slug: pkg.slug,
        name: pkg.name,
        technology: pkg.technology as InternetPackageFormData["technology"],
        tagline: pkg.tagline,
        speed_down: pkg.speed_down,
        speed_up: pkg.speed_up,
        features: pkg.features as string[],
        pricing: pkg.pricing as InternetPackageFormData["pricing"],
        featured: pkg.featured,
        order: pkg.order,
        tariff_code: pkg.tariff_code ?? undefined,
        active: pkg.active,
      })
    }
  }, [pkg, isNew, reset])

  function handleNameBlur() {
    const currentSlug = watch("slug")
    if (!currentSlug && name) {
      setValue("slug", generateSlug(name))
    }
  }

  function addFeature() {
    if (featureInput.trim()) {
      setValue("features", [...features, featureInput.trim()])
      setFeatureInput("")
    }
  }

  function removeFeature(index: number) {
    setValue("features", features.filter((_, i) => i !== index))
  }

  async function onSubmit(data: InternetPackageFormData) {
    setError(null)
    const payload = {
      slug: data.slug,
      name: data.name,
      technology: data.technology,
      tagline: data.tagline,
      speed_down: data.speed_down,
      speed_up: data.speed_up,
      features: data.features,
      pricing: data.pricing,
      featured: data.featured,
      order: data.order,
      tariff_code: data.tariff_code || null,
      active: data.active,
    }

    const result = isNew
      ? await create(payload)
      : await update(id!, payload)

    if (result.error) {
      setError(result.error)
    } else {
      navigate("/admin/pakiety")
    }
  }

  if (loadingItem) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl">
      <button
        onClick={() => navigate("/admin/pakiety")}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Powrót do pakietów
      </button>

      <h2 className="text-2xl font-bold mb-6">
        {isNew ? "Nowy pakiet internetowy" : "Edytuj pakiet internetowy"}
      </h2>

      {error && (
        <div className="bg-destructive/10 text-destructive text-sm rounded-lg px-4 py-3 mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Nazwa *</label>
            <Input {...register("name")} onBlur={handleNameBlur} placeholder="np. Start" />
            {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Slug *</label>
            <Input {...register("slug")} placeholder="np. ftth-dom-start" />
            {errors.slug && <p className="text-sm text-destructive mt-1">{errors.slug.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Opis (tagline) *</label>
          <Input {...register("tagline")} placeholder="Krótki opis pakietu" />
          {errors.tagline && <p className="text-sm text-destructive mt-1">{errors.tagline.message}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Technologia *</label>
            <select
              {...register("technology")}
              className="w-full h-10 px-3 rounded-md border border-input bg-transparent text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none"
            >
              {technologies.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Download (Mb/s) *</label>
            <Input type="number" {...register("speed_down", { valueAsNumber: true })} min={1} />
            {errors.speed_down && <p className="text-sm text-destructive mt-1">{errors.speed_down.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Upload (Mb/s) *</label>
            <Input type="number" {...register("speed_up", { valueAsNumber: true })} min={1} />
            {errors.speed_up && <p className="text-sm text-destructive mt-1">{errors.speed_up.message}</p>}
          </div>
        </div>

        {/* Features */}
        <div>
          <label className="block text-sm font-medium mb-1.5">Cechy pakietu *</label>
          <div className="space-y-2">
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2">
                <span className="text-sm flex-1">{f}</span>
                <button type="button" onClick={() => removeFeature(i)} className="text-muted-foreground hover:text-destructive">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            <div className="flex gap-2">
              <Input
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addFeature() } }}
                placeholder="Dodaj cechę i naciśnij Enter..."
              />
              <Button type="button" variant="outline" size="icon" onClick={addFeature}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {errors.features && <p className="text-sm text-destructive mt-1">{errors.features.message}</p>}
        </div>

        {/* Pricing */}
        <div>
          <label className="block text-sm font-medium mb-3">Cennik *</label>
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="text-left px-3 py-2 font-medium">Okres</th>
                  <th className="text-left px-3 py-2 font-medium">Mies. (zł)</th>
                  <th className="text-left px-3 py-2 font-medium">Aktywacja (zł)</th>
                  <th className="text-left px-3 py-2 font-medium">Instalacja (zł)</th>
                </tr>
              </thead>
              <tbody>
                {pricingFields.map((field, i) => (
                  <tr key={field.id} className="border-b border-border last:border-0">
                    <td className="px-3 py-2 font-medium">
                      {field.periodLabel}
                      <input type="hidden" {...register(`pricing.${i}.period`)} />
                      <input type="hidden" {...register(`pricing.${i}.periodLabel`)} />
                    </td>
                    <td className="px-3 py-2">
                      <Input type="number" {...register(`pricing.${i}.monthlyPrice`, { valueAsNumber: true })} min={0} className="h-8 w-24" />
                    </td>
                    <td className="px-3 py-2">
                      <Input type="number" {...register(`pricing.${i}.activationFee`, { valueAsNumber: true })} min={0} className="h-8 w-24" />
                    </td>
                    <td className="px-3 py-2">
                      <Input type="number" {...register(`pricing.${i}.installationFee`, { valueAsNumber: true })} min={0} className="h-8 w-24" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {errors.pricing && <p className="text-sm text-destructive mt-1">{errors.pricing.message}</p>}
        </div>

        {/* Meta */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Kolejność</label>
            <Input type="number" {...register("order", { valueAsNumber: true })} min={0} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Kod taryfy</label>
            <Input {...register("tariff_code")} placeholder="opcjonalnie" />
          </div>
          <div className="flex items-end gap-6">
            <label className="flex items-center gap-2 h-10">
              <input type="checkbox" {...register("featured")} className="h-4 w-4 rounded border-input accent-primary" />
              <span className="text-sm">Wyróżniony</span>
            </label>
            <label className="flex items-center gap-2 h-10">
              <input type="checkbox" {...register("active")} className="h-4 w-4 rounded border-input accent-primary" />
              <span className="text-sm">Aktywny</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={() => navigate("/admin/pakiety")}>
            Anuluj
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Zapisywanie...</>
            ) : (
              <><Save className="mr-2 h-4 w-4" />{isNew ? "Utwórz" : "Zapisz"}</>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
