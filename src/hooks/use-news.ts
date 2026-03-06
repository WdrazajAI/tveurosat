import { useState, useEffect, useCallback } from "react"
import { supabase } from "@/lib/supabase"
import type { NewsArticle } from "@/types"
import { newsArticles as staticNews } from "@/data/news"

interface NewsRow {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  date: string
  category: string
  image: string | null
  featured: boolean
  created_at: string
  updated_at: string
}

function mapRow(row: NewsRow): NewsArticle {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    date: row.date,
    category: row.category as NewsArticle["category"],
    image: row.image ?? undefined,
    featured: row.featured,
  }
}

export function useNewsList() {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from("news")
      .select("*")
      .order("date", { ascending: false })

    if (error || !data) {
      setArticles(staticNews)
    } else {
      setArticles((data as NewsRow[]).map(mapRow))
    }
    setLoading(false)
  }, [])

  useEffect(() => { fetch() }, [fetch])

  return { articles, loading, refresh: fetch }
}

export function useNewsItem(id: string | undefined) {
  const [article, setArticle] = useState<NewsArticle | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) { setLoading(false); return }
    supabase
      .from("news")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data, error }) => {
        if (!error && data) setArticle(mapRow(data as NewsRow))
        setLoading(false)
      })
  }, [id])

  return { article, loading }
}

export function useNewsAdmin() {
  const create = async (data: Omit<NewsRow, "id" | "created_at" | "updated_at">) => {
    const { error } = await supabase.from("news").insert(data)
    return { error: error?.message ?? null }
  }

  const update = async (id: string, data: Partial<NewsRow>) => {
    const { error } = await supabase.from("news").update(data).eq("id", id)
    return { error: error?.message ?? null }
  }

  const remove = async (id: string) => {
    const { error } = await supabase.from("news").delete().eq("id", id)
    return { error: error?.message ?? null }
  }

  return { create, update, remove }
}
