import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { label: "Usługi", href: "#uslugi" },
    { label: "Pakiety", href: "#pakiety" },
    { label: "O nas", href: "#o-nas" },
    { label: "Kontakt", href: "#kontakt" },
  ]

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
        <div
          className={cn(
            "bg-white/85 backdrop-blur-xl border-b border-border/40 transition-all duration-300",
            scrolled && "shadow-sm"
          )}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              className={cn(
                "flex items-center justify-between transition-all duration-300",
                scrolled ? "h-14 sm:h-16" : "h-16 sm:h-18"
              )}
            >
              {/* Logo */}
              <a href="/" className="flex items-center">
                <span className="text-xl font-extrabold tracking-tight">
                  <span className="text-primary">TV-EURO</span>
                  <span className="text-secondary">-SAT</span>
                </span>
              </a>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-8">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>

              {/* CTA + Mobile Toggle */}
              <div className="flex items-center gap-4">
                <Button
                  size="sm"
                  className="hidden sm:inline-flex"
                  onClick={() =>
                    document
                      .getElementById("cta-section")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  Sprawdź Dostępność
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

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-40 w-full max-w-sm bg-white/95 backdrop-blur-2xl shadow-2xl md:hidden"
          >
            <nav className="flex flex-col items-start gap-6 p-8 pt-24">
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-2xl font-semibold text-foreground hover:text-primary transition-colors duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navLinks.length * 0.1 }}
                className="mt-4 w-full"
              >
                <Button
                  className="w-full"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    document
                      .getElementById("cta-section")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }}
                >
                  Sprawdź Dostępność
                </Button>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
