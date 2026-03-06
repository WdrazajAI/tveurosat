import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Plus, ArrowUp, ArrowDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import DataTable, { type Column } from "@/components/admin/DataTable"
import ConfirmDialog from "@/components/admin/ConfirmDialog"
import { useFAQList, useFAQAdmin } from "@/hooks/use-faq"
import { faqCategories } from "@/data/faq"
import type { FAQItem } from "@/types"

export default function FAQListPage() {
  const { items, loading, refresh } = useFAQList()
  const { remove, reorder } = useFAQAdmin()
  const navigate = useNavigate()
  const [deleteTarget, setDeleteTarget] = useState<FAQItem | null>(null)
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    await remove(deleteTarget.id)
    setDeleteTarget(null)
    setDeleting(false)
    refresh()
  }

  async function handleReorder(item: FAQItem, direction: "up" | "down") {
    const sameCategory = items.filter((i) => i.category === item.category)
    const idx = sameCategory.findIndex((i) => i.id === item.id)
    const swapIdx = direction === "up" ? idx - 1 : idx + 1
    if (swapIdx < 0 || swapIdx >= sameCategory.length) return

    const other = sameCategory[swapIdx]
    await Promise.all([
      reorder(item.id, other.order),
      reorder(other.id, item.order),
    ])
    refresh()
  }

  const columns: Column<FAQItem>[] = [
    {
      header: "Kolejność",
      accessor: (item) => (
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); handleReorder(item, "up") }}
            className="p-1 rounded hover:bg-accent"
          >
            <ArrowUp className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleReorder(item, "down") }}
            className="p-1 rounded hover:bg-accent"
          >
            <ArrowDown className="h-3.5 w-3.5" />
          </button>
          <span className="text-xs text-muted-foreground ml-1">{item.order}</span>
        </div>
      ),
      className: "w-28",
    },
    {
      header: "Pytanie",
      accessor: (item) => (
        <p className="font-medium line-clamp-2">{item.question}</p>
      ),
    },
    {
      header: "Kategoria",
      accessor: (item) => (
        <span className="inline-block px-2 py-0.5 rounded-md bg-muted text-xs font-medium">
          {faqCategories[item.category] ?? item.category}
        </span>
      ),
      className: "w-40",
    },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">FAQ</h2>
        <Button onClick={() => navigate("/admin/faq/nowy")}>
          <Plus className="h-4 w-4 mr-2" />
          Dodaj
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={items}
        loading={loading}
        onEdit={(item) => navigate(`/admin/faq/${item.id}`)}
        onDelete={setDeleteTarget}
        emptyMessage="Brak pytań FAQ"
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Usuń pytanie"
        message={`Czy na pewno chcesz usunąć to pytanie?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  )
}
