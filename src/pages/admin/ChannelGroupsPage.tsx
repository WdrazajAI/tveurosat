import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Plus, Pencil, Trash2, Tv } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useChannelGroups, useChannelGroupsAdmin } from "@/hooks/use-channels"

export default function ChannelGroupsPage() {
  const navigate = useNavigate()
  const { groups, loading, refresh } = useChannelGroups()
  const { remove } = useChannelGroupsAdmin()
  const [deleting, setDeleting] = useState<string | null>(null)

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Czy na pewno chcesz usunąć grupę "${name}"?`)) return
    setDeleting(id)
    await remove(id)
    await refresh()
    setDeleting(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Kanały TV</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Zarządzaj grupami kanałów i przypisuj je do pakietów TV
          </p>
        </div>
        <Button onClick={() => navigate("/admin/kanaly/nowy")}>
          <Plus className="mr-2 h-4 w-4" />
          Nowa grupa
        </Button>
      </div>

      {groups.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Tv className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p>Brak grup kanałów. Dodaj pierwszą grupę, aby rozpocząć.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {groups.map((group) => (
            <div
              key={group.id}
              className="border border-border rounded-lg p-4 hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold">{group.name}</h3>
                    <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                      {group.channels.length} kanałów
                    </span>
                  </div>
                  {group.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {group.description}
                    </p>
                  )}
                  {group.channels.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {group.channels.slice(0, 10).map((ch) => (
                        <span
                          key={ch.id}
                          className="inline-flex items-center gap-1.5 text-xs bg-muted/50 px-2 py-1 rounded"
                        >
                          {ch.logoUrl && (
                            <img
                              src={ch.logoUrl}
                              alt={ch.name}
                              className="h-4 w-4 object-contain rounded-sm"
                            />
                          )}
                          {ch.name}
                        </span>
                      ))}
                      {group.channels.length > 10 && (
                        <span className="text-xs text-muted-foreground px-2 py-1">
                          +{group.channels.length - 10} więcej
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(`/admin/kanaly/${group.id}`)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={deleting === group.id}
                    onClick={() => handleDelete(group.id, group.name)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
