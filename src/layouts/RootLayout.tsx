import { Outlet } from "react-router-dom"
import { useEffect, useState } from "react"
import { ChevronUp } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import { Particles } from "@/components/ui/particles"
import { useTheme } from "@/context/ThemeContext"

function useParticleQuantity() {
  const [quantity, setQuantity] = useState(80)
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReduced) {
      setQuantity(0)
      return
    }
    const isMobile = window.innerWidth < 768
    setQuantity(isMobile ? 40 : 80)
  }, [])
  return quantity
}

function ScrollToTopButton() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 300)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-40 w-10 h-10 rounded-full bg-primary text-white shadow-lg shadow-primary/25 flex items-center justify-center hover:bg-primary/90 transition-colors"
          aria-label="Przewiń do góry"
        >
          <ChevronUp className="h-5 w-5" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}

export default function RootLayout() {
  const { theme } = useTheme()
  const particleQuantity = useParticleQuantity()

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {particleQuantity > 0 && (
        <Particles
          className="fixed inset-0 z-0"
          quantity={particleQuantity}
          ease={80}
          size={0.5}
          staticity={60}
          color={theme === "dark" ? "#3388FF" : "#5A82BD"}
        />
      )}
      <Header />
      <main className="relative z-[1] flex-1">
        <Outlet />
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  )
}
