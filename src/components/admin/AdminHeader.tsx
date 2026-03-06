import { LogOut, Menu, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"
import { useTheme } from "@/context/ThemeContext"

interface AdminHeaderProps {
  onMenuToggle: () => void
}

export default function AdminHeader({ onMenuToggle }: AdminHeaderProps) {
  const { user, signOut } = useAuth()
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="sticky top-0 z-30 h-16 bg-card/80 backdrop-blur border-b border-border flex items-center justify-between px-4 lg:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-md hover:bg-accent"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-semibold hidden sm:block">
          Panel Administracyjny
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground hidden sm:block">
          {user?.email}
        </span>

        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {theme === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>

        <Button variant="ghost" size="icon" onClick={signOut}>
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  )
}
