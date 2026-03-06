import { useState, useEffect, useCallback } from "react"
import { supabase } from "@/lib/supabase"
import type { DocumentItem } from "@/types"
import { documents as staticDocs } from "@/data/documents"

interface DocRow {
  id: string
  name: string
  description: string
  category: string
  file_url: string
  file_size: string
  created_at: string
  updated_at: string
}

function mapRow(row: DocRow): DocumentItem {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    category: row.category as DocumentItem["category"],
    fileUrl: row.file_url,
    fileSize: row.file_size,
    updatedAt: row.updated_at.split("T")[0],
  }
}

export function useDocumentsList() {
  const [documents, setDocuments] = useState<DocumentItem[]>([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .order("category")
      .order("name")

    if (error || !data) {
      setDocuments(staticDocs)
    } else {
      setDocuments((data as DocRow[]).map(mapRow))
    }
    setLoading(false)
  }, [])

  useEffect(() => { fetch() }, [fetch])

  return { documents, loading, refresh: fetch }
}

export function useDocumentItem(id: string | undefined) {
  const [document, setDocument] = useState<DocumentItem | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) { setLoading(false); return }
    supabase
      .from("documents")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data, error }) => {
        if (!error && data) setDocument(mapRow(data as DocRow))
        setLoading(false)
      })
  }, [id])

  return { document, loading }
}

export function useDocumentsAdmin() {
  const create = async (data: Omit<DocRow, "id" | "created_at" | "updated_at">) => {
    const { error } = await supabase.from("documents").insert(data)
    return { error: error?.message ?? null }
  }

  const update = async (id: string, data: Partial<DocRow>) => {
    const { error } = await supabase.from("documents").update(data).eq("id", id)
    return { error: error?.message ?? null }
  }

  const remove = async (id: string) => {
    const { error } = await supabase.from("documents").delete().eq("id", id)
    return { error: error?.message ?? null }
  }

  return { create, update, remove }
}
