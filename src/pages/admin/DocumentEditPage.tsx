import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, Loader2, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import FileUpload from "@/components/admin/FileUpload"
import { documentSchema, type DocumentFormData } from "@/lib/admin-schemas"
import { useDocumentItem, useDocumentsAdmin } from "@/hooks/use-documents"

const categories = [
  { value: "pricelist", label: "Cennik" },
  { value: "regulation", label: "Regulamin" },
  { value: "form", label: "Formularz" },
  { value: "technical", label: "Dokument techniczny" },
]

export default function DocumentEditPage() {
  const { id } = useParams()
  const isNew = id === "nowy"
  const navigate = useNavigate()
  const { document: doc, loading: loadingItem } = useDocumentItem(isNew ? undefined : id)
  const { create, update } = useDocumentsAdmin()
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DocumentFormData>({
    resolver: zodResolver(documentSchema),
    defaultValues: { category: "pricelist", file_url: "", file_size: "" },
  })

  const fileUrl = watch("file_url")

  useEffect(() => {
    if (doc && !isNew) {
      reset({
        name: doc.name,
        description: doc.description,
        category: doc.category,
        file_url: doc.fileUrl,
        file_size: doc.fileSize,
      })
    }
  }, [doc, isNew, reset])

  async function onSubmit(data: DocumentFormData) {
    setError(null)
    const result = isNew
      ? await create(data)
      : await update(id!, data)

    if (result.error) {
      setError(result.error)
    } else {
      navigate("/admin/dokumenty")
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
        onClick={() => navigate("/admin/dokumenty")}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Powrót do listy
      </button>

      <h2 className="text-2xl font-bold mb-6">
        {isNew ? "Nowy dokument" : "Edytuj dokument"}
      </h2>

      {error && (
        <div className="bg-destructive/10 text-destructive text-sm rounded-lg px-4 py-3 mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1.5">Nazwa *</label>
          <Input {...register("name")} placeholder="Nazwa dokumentu" />
          {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Opis *</label>
          <Textarea {...register("description")} placeholder="Opis dokumentu..." rows={3} />
          {errors.description && <p className="text-sm text-destructive mt-1">{errors.description.message}</p>}
        </div>

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
          <label className="block text-sm font-medium mb-1.5">Plik PDF *</label>
          <FileUpload
            value={fileUrl}
            onChange={(url, size) => {
              setValue("file_url", url, { shouldValidate: true })
              setValue("file_size", size, { shouldValidate: true })
            }}
          />
          {errors.file_url && <p className="text-sm text-destructive mt-1">{errors.file_url.message}</p>}
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={() => navigate("/admin/dokumenty")}>
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
