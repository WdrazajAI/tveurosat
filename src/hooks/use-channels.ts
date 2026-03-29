import { useState, useEffect, useCallback } from "react"
import { supabase } from "@/lib/supabase"
import type { TVChannelGroup, TVChannel } from "@/types"

interface ChannelGroupRow {
  id: string
  slug: string
  name: string
  description: string | null
  order: number
  active: boolean
}

interface ChannelRow {
  id: string
  name: string
  logo_url: string | null
  group_id: string | null
  order: number
  active: boolean
  category: string | null
}

function mapChannelRow(row: ChannelRow): TVChannel {
  return {
    id: row.id,
    name: row.name,
    logoUrl: row.logo_url ?? undefined,
    groupId: row.group_id ?? "",
    order: row.order,
    category: (row.category as TVChannel["category"]) ?? "Ogólne",
  }
}

function mapGroupRow(row: ChannelGroupRow, channels: TVChannel[]): TVChannelGroup {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description ?? undefined,
    order: row.order,
    channels: channels.filter((ch) => ch.groupId === row.id),
  }
}

// Fetch all channel groups with their channels
export function useChannelGroups() {
  const [groups, setGroups] = useState<TVChannelGroup[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    setLoading(true)

    const [groupsResult, channelsResult] = await Promise.all([
      supabase
        .from("tv_channel_groups")
        .select("*")
        .eq("active", true)
        .order("order", { ascending: true }),
      supabase
        .from("tv_channels")
        .select("*")
        .eq("active", true)
        .order("order", { ascending: true }),
    ])

    if (groupsResult.error || channelsResult.error) {
      setGroups([])
      setLoading(false)
      return
    }

    const channels = (channelsResult.data as ChannelRow[]).map(mapChannelRow)
    const sortedGroupRows = groupsResult.data as ChannelGroupRow[]

    // Build cumulative channel lists per group tier
    const mapped = sortedGroupRows.map((g) => {
      if (g.order >= 5) {
        // CANAL+ addon — only its own channels
        return mapGroupRow(g, channels)
      }
      // Tier groups — cumulative: include channels from all groups with order <= this group's order
      // Premium (order 4) also includes CANAL+ (order 5)
      const includedGroupIds = sortedGroupRows
        .filter((other) => {
          if (other.order <= g.order && other.order < 5) return true
          if (g.order === 4 && other.order === 5) return true // Premium includes CANAL+
          return false
        })
        .map((other) => other.id)
      const cumulativeChannels = channels
        .filter((ch) => includedGroupIds.includes(ch.groupId))
        .sort((a, b) => a.order - b.order)
      return {
        id: g.id,
        slug: g.slug,
        name: g.name,
        description: g.description ?? undefined,
        order: g.order,
        channels: cumulativeChannels,
      }
    })
    setGroups(mapped)
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { groups, loading, refresh: fetchData }
}

// Fetch channels for a specific TV package (accepts slug or UUID)
export function usePackageChannels(packageId: string | undefined) {
  const [groups, setGroups] = useState<TVChannelGroup[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!packageId) {
      setLoading(false)
      return
    }

    async function fetchData() {
      setLoading(true)

      // Resolve package UUID — packageId may be a slug (from local data) or UUID
      let resolvedId = packageId!
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(resolvedId)
      if (!isUUID) {
        const { data: pkgData } = await supabase
          .from("tv_packages")
          .select("id")
          .eq("slug", packageId)
          .single()
        if (pkgData) {
          resolvedId = pkgData.id
        } else {
          setGroups([])
          setLoading(false)
          return
        }
      }

      // Get channel group IDs for this package
      const { data: junctionData, error: junctionError } = await supabase
        .from("tv_package_channel_groups")
        .select("channel_group_id")
        .eq("tv_package_id", resolvedId)

      if (junctionError || !junctionData || junctionData.length === 0) {
        setGroups([])
        setLoading(false)
        return
      }

      const groupIds = junctionData.map((j) => j.channel_group_id)

      // Fetch groups and channels
      const [groupsResult, channelsResult] = await Promise.all([
        supabase
          .from("tv_channel_groups")
          .select("*")
          .in("id", groupIds)
          .eq("active", true)
          .order("order", { ascending: true }),
        supabase
          .from("tv_channels")
          .select("*")
          .in("group_id", groupIds)
          .eq("active", true)
          .order("order", { ascending: true }),
      ])

      if (groupsResult.error || channelsResult.error) {
        setGroups([])
        setLoading(false)
        return
      }

      const channels = (channelsResult.data as ChannelRow[]).map(mapChannelRow)
      const mapped = (groupsResult.data as ChannelGroupRow[]).map((g) =>
        mapGroupRow(g, channels)
      )
      setGroups(mapped)
      setLoading(false)
    }

    fetchData()
  }, [packageId])

  return { groups, loading }
}

// Admin CRUD for channel groups
export function useChannelGroupsAdmin() {
  const create = async (data: { slug: string; name: string; description?: string; order: number }) => {
    const { data: result, error } = await supabase.from("tv_channel_groups").insert(data).select().single()
    return { data: result, error: error?.message ?? null }
  }

  const update = async (id: string, data: Partial<ChannelGroupRow>) => {
    const { error } = await supabase.from("tv_channel_groups").update(data).eq("id", id)
    return { error: error?.message ?? null }
  }

  const remove = async (id: string) => {
    const { error } = await supabase.from("tv_channel_groups").delete().eq("id", id)
    return { error: error?.message ?? null }
  }

  return { create, update, remove }
}

// Admin CRUD for channels
export function useChannelsAdmin() {
  const create = async (data: { name: string; logo_url?: string; group_id: string; order: number }) => {
    const { data: result, error } = await supabase.from("tv_channels").insert(data).select().single()
    return { data: result, error: error?.message ?? null }
  }

  const update = async (id: string, data: Partial<ChannelRow>) => {
    const { error } = await supabase.from("tv_channels").update(data).eq("id", id)
    return { error: error?.message ?? null }
  }

  const remove = async (id: string) => {
    const { error } = await supabase.from("tv_channels").delete().eq("id", id)
    return { error: error?.message ?? null }
  }

  // Upload logo to Supabase Storage
  const uploadLogo = async (file: File, channelId: string) => {
    const ext = file.name.split(".").pop()
    const path = `${channelId}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from("channel-logos")
      .upload(path, file, { upsert: true })

    if (uploadError) return { url: null, error: uploadError.message }

    const { data: urlData } = supabase.storage
      .from("channel-logos")
      .getPublicUrl(path)

    return { url: urlData.publicUrl, error: null }
  }

  return { create, update, remove, uploadLogo }
}

// Admin: manage package-channel group assignments
export function usePackageChannelGroupsAdmin() {
  const setGroupsForPackage = async (packageId: string, groupIds: string[]) => {
    // Delete existing assignments
    const { error: deleteError } = await supabase
      .from("tv_package_channel_groups")
      .delete()
      .eq("tv_package_id", packageId)

    if (deleteError) return { error: deleteError.message }

    if (groupIds.length === 0) return { error: null }

    // Insert new assignments
    const rows = groupIds.map((gid) => ({
      tv_package_id: packageId,
      channel_group_id: gid,
    }))

    const { error: insertError } = await supabase
      .from("tv_package_channel_groups")
      .insert(rows)

    return { error: insertError?.message ?? null }
  }

  return { setGroupsForPackage }
}
