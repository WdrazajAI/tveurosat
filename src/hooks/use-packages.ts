import { useState, useEffect, useCallback } from "react"
import { supabase } from "@/lib/supabase"
import type { InternetPackage, TVPackage, PricingOption } from "@/types"
import { allInternetPackages as staticInternet, allTVPackages as staticTV } from "@/data/packages"

interface InternetRow {
  id: string
  slug: string
  name: string
  technology: string
  tagline: string
  speed_down: number
  speed_up: number
  features: string[]
  pricing: PricingOption[]
  featured: boolean
  order: number
  tariff_code: string | null
  active: boolean
  created_at: string
  updated_at: string
}

interface TVRow {
  id: string
  slug: string
  name: string
  type: string
  tagline: string
  channels: number
  features: string[]
  pricing: PricingOption[]
  featured: boolean
  order: number
  tariff_code: string | null
  active: boolean
  created_at: string
  updated_at: string
}

function mapInternetRow(row: InternetRow): InternetPackage {
  return {
    id: row.id,
    name: row.name,
    technology: row.technology as InternetPackage["technology"],
    tagline: row.tagline,
    speedDown: row.speed_down,
    speedUp: row.speed_up,
    features: row.features,
    pricing: row.pricing,
    featured: row.featured,
    order: row.order,
    tariffCode: row.tariff_code ?? undefined,
  }
}

function mapTVRow(row: TVRow): TVPackage {
  return {
    id: row.id,
    name: row.name,
    type: row.type as TVPackage["type"],
    tagline: row.tagline,
    channels: row.channels,
    features: row.features,
    pricing: row.pricing,
    featured: row.featured,
    order: row.order,
    tariffCode: row.tariff_code ?? undefined,
  }
}

export function useInternetPackagesList() {
  const [packages, setPackages] = useState<InternetPackage[]>([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from("internet_packages")
      .select("*")
      .eq("active", true)
      .order("technology")
      .order("order", { ascending: true })

    if (error || !data) {
      setPackages(staticInternet)
    } else {
      setPackages((data as InternetRow[]).map(mapInternetRow))
    }
    setLoading(false)
  }, [])

  useEffect(() => { fetch() }, [fetch])

  return { packages, loading, refresh: fetch }
}

export function useTVPackagesList() {
  const [packages, setPackages] = useState<TVPackage[]>([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from("tv_packages")
      .select("*")
      .eq("active", true)
      .order("type")
      .order("order", { ascending: true })

    if (error || !data) {
      setPackages(staticTV)
    } else {
      setPackages((data as TVRow[]).map(mapTVRow))
    }
    setLoading(false)
  }, [])

  useEffect(() => { fetch() }, [fetch])

  return { packages, loading, refresh: fetch }
}

export function useInternetPackageItem(id: string | undefined) {
  const [pkg, setPkg] = useState<InternetRow | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) { setLoading(false); return }
    supabase
      .from("internet_packages")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data, error }) => {
        if (!error && data) setPkg(data as InternetRow)
        setLoading(false)
      })
  }, [id])

  return { pkg, loading }
}

export function useTVPackageItem(id: string | undefined) {
  const [pkg, setPkg] = useState<TVRow | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) { setLoading(false); return }
    supabase
      .from("tv_packages")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data, error }) => {
        if (!error && data) setPkg(data as TVRow)
        setLoading(false)
      })
  }, [id])

  return { pkg, loading }
}

export function useInternetPackagesAdmin() {
  const create = async (data: Omit<InternetRow, "id" | "created_at" | "updated_at">) => {
    const { error } = await supabase.from("internet_packages").insert(data)
    return { error: error?.message ?? null }
  }

  const update = async (id: string, data: Partial<InternetRow>) => {
    const { error } = await supabase.from("internet_packages").update(data).eq("id", id)
    return { error: error?.message ?? null }
  }

  const remove = async (id: string) => {
    const { error } = await supabase.from("internet_packages").delete().eq("id", id)
    return { error: error?.message ?? null }
  }

  return { create, update, remove }
}

export function useTVPackagesAdmin() {
  const create = async (data: Omit<TVRow, "id" | "created_at" | "updated_at">) => {
    const { error } = await supabase.from("tv_packages").insert(data)
    return { error: error?.message ?? null }
  }

  const update = async (id: string, data: Partial<TVRow>) => {
    const { error } = await supabase.from("tv_packages").update(data).eq("id", id)
    return { error: error?.message ?? null }
  }

  const remove = async (id: string) => {
    const { error } = await supabase.from("tv_packages").delete().eq("id", id)
    return { error: error?.message ?? null }
  }

  return { create, update, remove }
}
