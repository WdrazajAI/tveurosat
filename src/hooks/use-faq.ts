import { useState, useEffect, useCallback } from "react"
import { supabase } from "@/lib/supabase"
import type { FAQItem } from "@/types"
import { faqItems as staticFAQ } from "@/data/faq"

interface FAQRow {
  id: string
  question: string
  answer: string
  category: string
  order: number
  created_at: string
  updated_at: string
}

function mapRow(row: FAQRow): FAQItem {
  return {
    id: row.id,
    question: row.question,
    answer: row.answer,
    category: row.category as FAQItem["category"],
    order: row.order,
  }
}

export function useFAQList() {
  const [items, setItems] = useState<FAQItem[]>([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from("faq")
      .select("*")
      .order("category")
      .order("order", { ascending: true })

    if (error || !data) {
      setItems(staticFAQ)
    } else {
      setItems((data as FAQRow[]).map(mapRow))
    }
    setLoading(false)
  }, [])

  useEffect(() => { fetch() }, [fetch])

  return { items, loading, refresh: fetch }
}

export function useFAQItem(id: string | undefined) {
  const [item, setItem] = useState<FAQItem | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) { setLoading(false); return }
    supabase
      .from("faq")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data, error }) => {
        if (!error && data) setItem(mapRow(data as FAQRow))
        setLoading(false)
      })
  }, [id])

  return { item, loading }
}

export function useFAQAdmin() {
  const create = async (data: Omit<FAQRow, "id" | "created_at" | "updated_at">) => {
    const { error } = await supabase.from("faq").insert(data)
    return { error: error?.message ?? null }
  }

  const update = async (id: string, data: Partial<FAQRow>) => {
    const { error } = await supabase.from("faq").update(data).eq("id", id)
    return { error: error?.message ?? null }
  }

  const remove = async (id: string) => {
    const { error } = await supabase.from("faq").delete().eq("id", id)
    return { error: error?.message ?? null }
  }

  const reorder = async (id: string, newOrder: number) => {
    const { error } = await supabase.from("faq").update({ order: newOrder }).eq("id", id)
    return { error: error?.message ?? null }
  }

  return { create, update, remove, reorder }
}
