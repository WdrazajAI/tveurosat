import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, Loader2, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { faqSchema, type FAQFormData } from "@/lib/admin-schemas"
import { useFAQItem, useFAQAdmin } from "@/hooks/use-faq"

const categories = [
  { value: "general", label: "Ogólne" },
  { value: "technical", label: "Techniczne" },
  { value: "billing", label: "Płatności i umowy" },
  { value: "installation", label: "Instalacja" },
]

export default function FAQEditPage() {
  const { id } = useParams()
  const isNew = id === "nowy"
  const navigate = useNavigate()
  const { item, loading: loadingItem } = useFAQItem(isNew ? undefined : id)
  const { create, update } = useFAQAdmin()
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FAQFormData>({
    resolver: zodResolver(faqSchema),
    defaultValues: { category: "general", order: 0 },
  })

  useEffect(() => {
    if (item && !isNew) {
      reset({
        question: item.question,
        answer: item.answer,
        category: item.category,
        order: item.order,
      })
    }
  }, [item, isNew, reset])

  async function onSubmit(data: FAQFormData) {
    setError(null)
    const result = isNew
      ? await create(data)
      : await update(id!, data)

    if (result.error) {
      setError(result.error)
    } else {
      navigate("/admin/faq")
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
        onClick={() => navigate("/admin/faq")}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Powrót do listy
      </button>

      <h2 className="text-2xl font-bold mb-6">
        {isNew ? "Nowe pytanie FAQ" : "Edytuj pytanie FAQ"}
      </h2>

      {error && (
        <div className="bg-destructive/10 text-destructive text-sm rounded-lg px-4 py-3 mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1.5">Pytanie *</label>
          <Textarea {...register("question")} placeholder="Treść pytania..." rows={2} />
          {errors.question && <p className="text-sm text-destructive mt-1">{errors.question.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Odpowiedź *</label>
          <Textarea {...register("answer")} placeholder="Treść odpowiedzi..." rows={6} />
          {errors.answer && <p className="text-sm text-destructive mt-1">{errors.answer.message}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Kategoria *</label>
            <select
              {...register("category")}
              className="w-full h-10 px-3 rounded-md border border-input bg-transparent text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none"
            >
              {categories.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Kolejność</label>
            <Input type="number" {...register("order", { valueAsNumber: true })} min={0} />
            {errors.order && <p className="text-sm text-destructive mt-1">{errors.order.message}</p>}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={() => navigate("/admin/faq")}>
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
