import { useEffect, useState, useRef } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, Loader2, Save, Plus, X, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { supabase } from "@/lib/supabase"
import {
  useChannelGroupsAdmin,
  useChannelsAdmin,
} from "@/hooks/use-channels"
import { generateSlug } from "@/lib/admin-schemas"
import type { TVChannel } from "@/types"

interface GroupData {
  id: string
  slug: string
  name: string
  description: string | null
  order: number
}

export default function ChannelGroupEditPage() {
  const { id } = useParams()
  const isNew = id === "nowy"
  const navigate = useNavigate()
  const { create: createGroup, update: updateGroup } = useChannelGroupsAdmin()
  const { create: createChannel, update: updateChannel, remove: removeChannel, uploadLogo } = useChannelsAdmin()

  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Group fields
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [description, setDescription] = useState("")
  const [order, setOrder] = useState(0)

  // Channels in this group
  const [channels, setChannels] = useState<TVChannel[]>([])
  const [newChannelName, setNewChannelName] = useState("")
  const [uploadingFor, setUploadingFor] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [pendingUploadChannelId, setPendingUploadChannelId] = useState<string | null>(null)

  // Load existing group
  useEffect(() => {
    if (isNew) return
    async function load() {
      const { data: groupData, error: groupError } = await supabase
        .from("tv_channel_groups")
        .select("*")
        .eq("id", id)
        .single()

      if (groupError || !groupData) {
        setError("Nie znaleziono grupy")
        setLoading(false)
        return
      }

      const g = groupData as GroupData
      setName(g.name)
      setSlug(g.slug)
      setDescription(g.description || "")
      setOrder(g.order)

      // Load channels
      const { data: channelsData } = await supabase
        .from("tv_channels")
        .select("*")
        .eq("group_id", id)
        .order("order", { ascending: true })

      if (channelsData) {
        setChannels(
          channelsData.map((ch) => ({
            id: ch.id,
            name: ch.name,
            logoUrl: ch.logo_url ?? undefined,
            groupId: ch.group_id ?? "",
            order: ch.order,
            category: ch.category ?? "Ogólne",
          }))
        )
      }

      setLoading(false)
    }
    load()
  }, [id, isNew])

  function handleNameBlur() {
    if (!slug && name) {
      setSlug(generateSlug(name))
    }
  }

  async function handleSaveGroup() {
    setError(null)
    setSaving(true)

    if (!name.trim() || !slug.trim()) {
      setError("Nazwa i slug są wymagane")
      setSaving(false)
      return
    }

    if (isNew) {
      const result = await createGroup({
        slug,
        name: name.trim(),
        description: description.trim() || undefined,
        order,
      })
      if (result.error) {
        setError(result.error)
        setSaving(false)
        return
      }
      // Navigate to edit page of new group
      if (result.data) {
        navigate(`/admin/kanaly/${result.data.id}`, { replace: true })
      } else {
        navigate("/admin/kanaly")
      }
    } else {
      const result = await updateGroup(id!, {
        slug,
        name: name.trim(),
        description: description.trim() || null,
        order,
      })
      if (result.error) {
        setError(result.error)
      }
    }
    setSaving(false)
  }

  async function handleAddChannel() {
    if (!newChannelName.trim() || isNew) return

    const result = await createChannel({
      name: newChannelName.trim(),
      group_id: id!,
      order: channels.length,
    })

    if (result.data) {
      setChannels([
        ...channels,
        {
          id: result.data.id,
          name: result.data.name,
          logoUrl: result.data.logo_url ?? undefined,
          groupId: result.data.group_id ?? "",
          order: result.data.order,
          category: result.data.category ?? "Ogólne",
        },
      ])
      setNewChannelName("")
    }
  }

  async function handleRemoveChannel(channelId: string) {
    await removeChannel(channelId)
    setChannels(channels.filter((ch) => ch.id !== channelId))
  }

  function handleUploadClick(channelId: string) {
    setPendingUploadChannelId(channelId)
    fileInputRef.current?.click()
  }

  async function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !pendingUploadChannelId) return

    setUploadingFor(pendingUploadChannelId)
    const { url, error: uploadError } = await uploadLogo(file, pendingUploadChannelId)

    if (uploadError) {
      setError(uploadError)
    } else if (url) {
      await updateChannel(pendingUploadChannelId, { logo_url: url })
      setChannels(
        channels.map((ch) =>
          ch.id === pendingUploadChannelId ? { ...ch, logoUrl: url } : ch
        )
      )
    }

    setUploadingFor(null)
    setPendingUploadChannelId(null)
    e.target.value = ""
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl">
      <button
        onClick={() => navigate("/admin/kanaly")}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Powrót do kanałów
      </button>

      <h2 className="text-2xl font-bold mb-6">
        {isNew ? "Nowa grupa kanałów" : `Edytuj: ${name}`}
      </h2>

      {error && (
        <div className="bg-destructive/10 text-destructive text-sm rounded-lg px-4 py-3 mb-6">
          {error}
        </div>
      )}

      {/* Group details */}
      <div className="space-y-4 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Nazwa grupy *</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={handleNameBlur}
              placeholder="np. Podstawowe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Slug *</label>
            <Input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="np. podstawowe"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Opis</label>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Krótki opis grupy kanałów"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Kolejność</label>
            <Input
              type="number"
              value={order}
              onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
              min={0}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSaveGroup} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Zapisywanie...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {isNew ? "Utwórz grupę" : "Zapisz grupę"}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Channels section — only for existing groups */}
      {!isNew && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Kanały w grupie</h3>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelected}
          />

          {channels.length > 0 && (
            <div className="space-y-2 mb-4">
              {channels.map((ch) => (
                <div
                  key={ch.id}
                  className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg"
                >
                  {/* Logo */}
                  <div className="w-10 h-10 rounded bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
                    {ch.logoUrl ? (
                      <img
                        src={ch.logoUrl}
                        alt={ch.name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </div>

                  {/* Name */}
                  <span className="flex-1 text-sm font-medium">{ch.name}</span>

                  {/* Upload logo */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleUploadClick(ch.id)}
                    disabled={uploadingFor === ch.id}
                  >
                    {uploadingFor === ch.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-1" />
                        Logo
                      </>
                    )}
                  </Button>

                  {/* Remove */}
                  <button
                    onClick={() => handleRemoveChannel(ch.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add channel */}
          <div className="flex gap-2">
            <Input
              value={newChannelName}
              onChange={(e) => setNewChannelName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  handleAddChannel()
                }
              }}
              placeholder="Nazwa kanału..."
            />
            <Button variant="outline" onClick={handleAddChannel}>
              <Plus className="h-4 w-4 mr-1" />
              Dodaj
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
