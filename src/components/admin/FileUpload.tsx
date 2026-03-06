import { useState, useRef } from "react"
import { Upload, File, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { cn } from "@/lib/utils"

interface FileUploadProps {
  value: string
  onChange: (url: string, size: string) => void
  accept?: string
  maxSizeMB?: number
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function FileUpload({
  value,
  onChange,
  accept = ".pdf",
  maxSizeMB = 10,
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`Plik jest za duży (max ${maxSizeMB} MB)`)
      return
    }

    setError(null)
    setUploading(true)

    const ext = file.name.split(".").pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from("documents")
      .upload(fileName, file)

    if (uploadError) {
      setError("Błąd przesyłania pliku")
      setUploading(false)
      return
    }

    const { data: urlData } = supabase.storage
      .from("documents")
      .getPublicUrl(fileName)

    onChange(urlData.publicUrl, formatFileSize(file.size))
    setUploading(false)

    if (inputRef.current) inputRef.current.value = ""
  }

  return (
    <div>
      {value ? (
        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border border-border">
          <File className="h-5 w-5 text-primary shrink-0" />
          <span className="text-sm truncate flex-1">{value.split("/").pop()}</span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 shrink-0"
            onClick={() => onChange("", "")}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className={cn(
            "w-full p-6 border-2 border-dashed border-border rounded-lg text-center",
            "hover:border-primary/50 hover:bg-muted/30 transition-colors",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            {uploading ? "Przesyłanie..." : "Kliknij, aby wybrać plik"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            PDF, max {maxSizeMB} MB
          </p>
        </button>
      )}

      {error && (
        <p className="text-sm text-destructive mt-1">{error}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleUpload}
        className="hidden"
      />
    </div>
  )
}
