import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Link, NavLink, useLocation } from "react-router-dom"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import ThemeToggle from "@/components/shared/ThemeToggle"
import { cn } from "@/lib/utils"

const navLinks = [
  { label: "Oferta", href: "/pakiety" },
  { label: "Aktualności", href: "/aktualnosci" },
  { label: "FAQ", href: "/faq" },
  { label: "Kontakt", href: "/kontakt" },
  { label: "Strefa Klienta", href: "/strefa-klienta" },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
        <div
          className={cn(
            "bg-background/85 backdrop-blur-xl border-b border-border/40 transition-all duration-300",
            scrolled && "shadow-sm"
          )}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              className={cn(
                "flex items-center justify-between transition-all duration-300",
                scrolled ? "h-14 sm:h-16" : "h-16 sm:h-20"
              )}
            >
              {/* Logo */}
              <Link to="/" className="flex items-center">
                <span className="text-xl font-extrabold tracking-tight">
                  <span className="text-primary">TV-EURO</span>
                  <span className="text-secondary">-SAT</span>
                </span>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-6">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.href}
                    to={link.href}
                    className={({ isActive }) =>
                      cn(
                        "text-sm font-medium transition-colors duration-200",
                        isActive
                          ? "text-primary"
                          : "text-foreground/70 hover:text-primary"
                      )
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
              </nav>

              {/* CTA + Theme Toggle + Mobile Toggle */}
              <div className="flex items-center gap-2 sm:gap-3">
                <ThemeToggle />
                <Button size="sm" className="hidden sm:inline-flex" asChild>
                  <Link to="/sprawdz-dostepnosc">Sprawdź Dostępność</Link>
                </Button>
                <button
                  className="md:hidden p-2"
                  aria-label="Menu"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Backdrop */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-30 bg-black/50 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-40 w-full max-w-sm bg-background/95 backdrop-blur-2xl shadow-2xl md:hidden overflow-y-auto"
          >
            <nav className="flex flex-col items-start gap-6 p-8 pt-24">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <NavLink
                    to={link.href}
                    className={({ isActive }) =>
                      cn(
                        "text-2xl font-semibold transition-colors duration-200",
                        isActive
                          ? "text-primary"
                          : "text-foreground hover:text-primary"
                      )
                    }
                  >
                    {link.label}
                  </NavLink>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navLinks.length * 0.1 }}
                className="mt-4 w-full"
              >
                <Button className="w-full" asChild>
                  <Link to="/sprawdz-dostepnosc">Sprawdź Dostępność</Link>
                </Button>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
