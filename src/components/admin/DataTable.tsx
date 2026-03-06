import { Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface Column<T> {
  header: string
  accessor: keyof T | ((item: T) => React.ReactNode)
  className?: string
}

interface DataTableProps<T extends { id: string }> {
  columns: Column<T>[]
  data: T[]
  loading?: boolean
  onEdit?: (item: T) => void
  onDelete?: (item: T) => void
  emptyMessage?: string
}

export default function DataTable<T extends { id: string }>({
  columns,
  data,
  loading,
  onEdit,
  onDelete,
  emptyMessage = "Brak danych",
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        {emptyMessage}
      </div>
    )
  }

  return (
    <div className="overflow-x-auto border border-border rounded-lg">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            {columns.map((col, i) => (
              <th
                key={i}
                className={cn(
                  "text-left px-4 py-3 font-medium text-muted-foreground",
                  col.className
                )}
              >
                {col.header}
              </th>
            ))}
            {(onEdit || onDelete) && (
              <th className="text-right px-4 py-3 font-medium text-muted-foreground w-24">
                Akcje
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr
              key={item.id}
              className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
            >
              {columns.map((col, i) => (
                <td key={i} className={cn("px-4 py-3", col.className)}>
                  {typeof col.accessor === "function"
                    ? col.accessor(item)
                    : String(item[col.accessor] ?? "")}
                </td>
              ))}
              {(onEdit || onDelete) && (
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    {onEdit && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(item)}
                        className="h-8 w-8"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(item)}
                        className="h-8 w-8 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
