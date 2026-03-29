import { NavLink } from "react-router-dom"
import {
  LayoutDashboard,
  Newspaper,
  HelpCircle,
  FileText,
  Package,
  MapPin,
  Tv,
  ShoppingCart,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/aktualnosci", label: "Aktualności", icon: Newspaper },
  { to: "/admin/faq", label: "FAQ", icon: HelpCircle },
  { to: "/admin/dokumenty", label: "Dokumenty", icon: FileText },
  { to: "/admin/pakiety", label: "Pakiety", icon: Package },
  { to: "/admin/kanaly", label: "Kanały TV", icon: Tv },
  { to: "/admin/zasieg", label: "Zasięg", icon: MapPin },
  { to: "/admin/zamowienia", label: "Zamówienia", icon: ShoppingCart },
]

interface AdminSidebarProps {
  open: boolean
  onClose: () => void
}

export default function AdminSidebar({ open, onClose }: AdminSidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 bg-card border-r border-border transition-transform duration-200",
          "lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-border">
          <div>
            <h2 className="font-bold text-lg">TV-EURO-SAT</h2>
            <p className="text-xs text-muted-foreground">Panel administracyjny</p>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-md hover:bg-accent"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )
              }
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  )
}
