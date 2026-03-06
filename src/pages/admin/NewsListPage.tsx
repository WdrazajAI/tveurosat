import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import DataTable, { type Column } from "@/components/admin/DataTable"
import ConfirmDialog from "@/components/admin/ConfirmDialog"
import { useNewsList, useNewsAdmin } from "@/hooks/use-news"
import { newsCategories } from "@/data/news"
import type { NewsArticle } from "@/types"

const columns: Column<NewsArticle>[] = [
  {
    header: "Tytuł",
    accessor: (item) => (
      <div>
        <p className="font-medium">{item.title}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{item.slug}</p>
      </div>
    ),
  },
  {
    header: "Kategoria",
    accessor: (item) => (
      <span className="inline-block px-2 py-0.5 rounded-md bg-muted text-xs font-medium">
        {newsCategories[item.category] ?? item.category}
      </span>
    ),
    className: "w-36",
  },
  {
    header: "Data",
    accessor: "date",
    className: "w-28",
  },
  {
    header: "Wyróżniony",
    accessor: (item) => (item.featured ? "Tak" : "—"),
    className: "w-28",
  },
]

export default function NewsListPage() {
  const { articles, loading, refresh } = useNewsList()
  const { remove } = useNewsAdmin()
  const navigate = useNavigate()
  const [deleteTarget, setDeleteTarget] = useState<NewsArticle | null>(null)
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    await remove(deleteTarget.id)
    setDeleteTarget(null)
    setDeleting(false)
    refresh()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Aktualności</h2>
        <Button onClick={() => navigate("/admin/aktualnosci/nowy")}>
          <Plus className="h-4 w-4 mr-2" />
          Dodaj
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={articles}
        loading={loading}
        onEdit={(item) => navigate(`/admin/aktualnosci/${item.id}`)}
        onDelete={setDeleteTarget}
        emptyMessage="Brak aktualności"
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Usuń aktualność"
        message={`Czy na pewno chcesz usunąć "${deleteTarget?.title}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  )
}
