import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import DataTable, { type Column } from "@/components/admin/DataTable"
import ConfirmDialog from "@/components/admin/ConfirmDialog"
import { useDocumentsList, useDocumentsAdmin } from "@/hooks/use-documents"
import { documentCategories } from "@/data/documents"
import type { DocumentItem } from "@/types"

const columns: Column<DocumentItem>[] = [
  {
    header: "Nazwa",
    accessor: (item) => (
      <div>
        <p className="font-medium">{item.name}</p>
        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{item.description}</p>
      </div>
    ),
  },
  {
    header: "Kategoria",
    accessor: (item) => (
      <span className="inline-block px-2 py-0.5 rounded-md bg-muted text-xs font-medium">
        {documentCategories[item.category] ?? item.category}
      </span>
    ),
    className: "w-40",
  },
  {
    header: "Rozmiar",
    accessor: "fileSize",
    className: "w-24",
  },
  {
    header: "Zaktualizowany",
    accessor: "updatedAt",
    className: "w-32",
  },
]

export default function DocumentsListPage() {
  const { documents, loading, refresh } = useDocumentsList()
  const { remove } = useDocumentsAdmin()
  const navigate = useNavigate()
  const [deleteTarget, setDeleteTarget] = useState<DocumentItem | null>(null)
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
        <h2 className="text-2xl font-bold">Dokumenty</h2>
        <Button onClick={() => navigate("/admin/dokumenty/nowy")}>
          <Plus className="h-4 w-4 mr-2" />
          Dodaj
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={documents}
        loading={loading}
        onEdit={(item) => navigate(`/admin/dokumenty/${item.id}`)}
        onDelete={setDeleteTarget}
        emptyMessage="Brak dokumentów"
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Usuń dokument"
        message={`Czy na pewno chcesz usunąć "${deleteTarget?.name}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  )
}
