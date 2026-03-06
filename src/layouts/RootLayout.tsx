import { Outlet } from "react-router-dom"
import { useEffect, useState } from "react"
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

export default function RootLayout() {
  const { theme } = useTheme()
  const particleQuantity = useParticleQuantity()

  return (
    <div className="min-h-screen bg-background text-foreground">
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
      <main className="relative z-[1]">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
