import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

interface ConfirmDialogProps {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  onConfirm: () => void
  onCancel: () => void
  loading?: boolean
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Usuń",
  onConfirm,
  onCancel,
  loading,
}: ConfirmDialogProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
      <div className="relative bg-card border border-border rounded-xl p-6 max-w-sm w-full mx-4 shadow-xl">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
            <AlertTriangle className="h-5 w-5 text-destructive" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">{title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{message}</p>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={onCancel} disabled={loading}>
            Anuluj
          </Button>
          <Button
            onClick={onConfirm}
            disabled={loading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {loading ? "Usuwanie..." : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
