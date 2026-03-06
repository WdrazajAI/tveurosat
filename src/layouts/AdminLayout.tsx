import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import AdminSidebar from "@/components/admin/AdminSidebar"
import AdminHeader from "@/components/admin/AdminHeader"
import { useState } from "react"

export default function AdminLayout() {
  const { session, loading } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/admin" replace />
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:pl-64">
        <AdminHeader onMenuToggle={() => setSidebarOpen(true)} />
        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
