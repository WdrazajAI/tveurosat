import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, Loader2, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { newsSchema, type NewsFormData, generateSlug } from "@/lib/admin-schemas"
import { useNewsItem, useNewsAdmin } from "@/hooks/use-news"

const categories = [
  { value: "promotion", label: "Promocja" },
  { value: "news", label: "Aktualności" },
  { value: "expansion", label: "Rozbudowa sieci" },
  { value: "maintenance", label: "Prace serwisowe" },
]

export default function NewsEditPage() {
  const { id } = useParams()
  const isNew = id === "nowy"
  const navigate = useNavigate()
  const { article, loading: loadingItem } = useNewsItem(isNew ? undefined : id)
  const { create, update } = useNewsAdmin()
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewsFormData>({
    resolver: zodResolver(newsSchema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      featured: false,
      category: "news",
    },
  })

  const title = watch("title")

  useEffect(() => {
    if (article && !isNew) {
      reset({
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        content: article.content,
        date: article.date,
        category: article.category,
        image: article.image,
        featured: article.featured,
      })
    }
  }, [article, isNew, reset])

  function handleTitleBlur() {
    const currentSlug = watch("slug")
    if (!currentSlug && title) {
      setValue("slug", generateSlug(title))
    }
  }

  async function onSubmit(data: NewsFormData) {
    setError(null)
    const payload = {
      slug: data.slug,
      title: data.title,
      excerpt: data.excerpt,
      content: data.content,
      date: data.date,
      category: data.category,
      image: data.image || null,
      featured: data.featured,
    }

    const result = isNew
      ? await create(payload)
      : await update(id!, payload)

    if (result.error) {
      setError(result.error)
    } else {
      navigate("/admin/aktualnosci")
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
        onClick={() => navigate("/admin/aktualnosci")}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Powrót do listy
      </button>

      <h2 className="text-2xl font-bold mb-6">
        {isNew ? "Nowa aktualność" : "Edytuj aktualność"}
      </h2>

      {error && (
        <div className="bg-destructive/10 text-destructive text-sm rounded-lg px-4 py-3 mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Tytuł *</label>
            <Input {...register("title")} onBlur={handleTitleBlur} placeholder="Tytuł aktualności" />
            {errors.title && <p className="text-sm text-destructive mt-1">{errors.title.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Slug *</label>
            <Input {...register("slug")} placeholder="tytul-aktualnosci" />
            {errors.slug && <p className="text-sm text-destructive mt-1">{errors.slug.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Zajawka *</label>
          <Textarea {...register("excerpt")} placeholder="Krótki opis artykułu..." rows={2} />
          {errors.excerpt && <p className="text-sm text-destructive mt-1">{errors.excerpt.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Treść (Markdown) *</label>
          <Textarea {...register("content")} placeholder="Pełna treść artykułu w formacie Markdown..." rows={12} className="font-mono text-sm" />
          {errors.content && <p className="text-sm text-destructive mt-1">{errors.content.message}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
            {errors.category && <p className="text-sm text-destructive mt-1">{errors.category.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Data *</label>
            <Input type="date" {...register("date")} />
            {errors.date && <p className="text-sm text-destructive mt-1">{errors.date.message}</p>}
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 h-10">
              <input
                type="checkbox"
                {...register("featured")}
                className="h-4 w-4 rounded border-input accent-primary"
              />
              <span className="text-sm font-medium">Wyróżniony</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={() => navigate("/admin/aktualnosci")}>
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
