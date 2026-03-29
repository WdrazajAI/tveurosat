import { useState, useEffect, useCallback } from "react"
import { ShoppingCart, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"

interface OrderRow {
  id: string
  status: string
  customer_name: string
  customer_email: string
  customer_phone: string
  address_city: string
  address_street: string | null
  address_building: string
  internet_package_name: string | null
  tv_package_name: string | null
  monthly_total: number
  onetime_total: number
  created_at: string
  contacted_at: string | null
}

const statusLabels: Record<string, { label: string; color: string }> = {
  pending: { label: "Oczekujące", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" },
  confirmed: { label: "Potwierdzone", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" },
  cancelled: { label: "Anulowane", color: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400" },
}

export default function OrdersListPage() {
  const [orders, setOrders] = useState<OrderRow[]>([])
  const [loading, setLoading] = useState(true)

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })

    if (!error && data) {
      setOrders(data as OrderRow[])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

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
          <h2 className="text-2xl font-bold">Zamówienia</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Lista złożonych zamówień ({orders.length})
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchOrders}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Odśwież
        </Button>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p>Brak zamówień.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const st = statusLabels[order.status] || statusLabels.pending
            const date = new Date(order.created_at).toLocaleDateString("pl-PL", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })

            return (
              <div
                key={order.id}
                className="border border-border rounded-lg p-4 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm">
                        {order.customer_name}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${st.color}`}
                      >
                        {st.label}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-0.5">
                      <p>
                        {order.customer_email} | {order.customer_phone}
                      </p>
                      <p>
                        {order.address_city}
                        {order.address_street
                          ? `, ${order.address_street}`
                          : ""}{" "}
                        {order.address_building}
                      </p>
                      <p>
                        {order.internet_package_name &&
                          `Internet: ${order.internet_package_name}`}
                        {order.internet_package_name &&
                          order.tv_package_name &&
                          " | "}
                        {order.tv_package_name &&
                          `TV: ${order.tv_package_name}`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-primary">
                      {order.monthly_total} zł/mies.
                    </p>
                    {Number(order.onetime_total) > 0 && (
                      <p className="text-xs text-muted-foreground">
                        + {order.onetime_total} zł jedn.
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      {date}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
