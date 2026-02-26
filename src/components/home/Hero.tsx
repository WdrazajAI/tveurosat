import { motion } from "framer-motion"
import { ArrowRight, Play, Wifi, Tv, Phone } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center bg-transparent">
      {/* Decorative Geometric Shapes */}
      <div className="absolute top-20 right-[10%] w-64 h-64 border-2 border-primary/10 rotate-45 rounded-3xl z-[1] hidden md:block" />
      <div className="absolute bottom-32 left-[5%] w-48 h-48 bg-primary/[0.03] rotate-12 rounded-2xl z-[1] hidden md:block" />
      <div className="absolute top-1/3 right-[20%] w-3 h-3 bg-secondary rounded-full z-[1]" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-[calc(100vh-6rem)]">
          {/* Left Column - Text */}
          <motion.div
            className="lg:col-span-7"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mt-6 text-4xl sm:text-5xl lg:text-7xl xl:text-8xl font-extrabold tracking-tight leading-[1.05]"
            >
              <span className="block">Szybki Internet</span>
              <span className="block">i Telewizja Kablowa</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-[540px] leading-relaxed"
            >
              Niezawodny internet światłowodowy i nowoczesna telewizja cyfrowa
              dla Twojego domu.
            </motion.p>

            {/* CTAs + Trust Badges wrapper */}
            <div className="mt-8 inline-flex flex-col items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 px-6 sm:px-8 h-12 sm:h-14 text-base font-semibold rounded-xl whitespace-nowrap"
                  asChild
                >
                  <Link to="/sprawdz-dostepnosc" className="inline-flex items-center gap-2">
                    Sprawdź Dostępność <ArrowRight className="h-4 w-4 flex-shrink-0" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-secondary text-secondary hover:bg-secondary/10 px-6 sm:px-8 h-12 sm:h-14 text-base font-semibold rounded-xl whitespace-nowrap"
                  asChild
                >
                  <Link to="/pakiety/telewizja" className="inline-flex items-center gap-2">
                    Zobacz Pakiety TV <Play className="h-4 w-4 flex-shrink-0" />
                  </Link>
                </Button>
              </motion.div>

              {/* Trust Badges */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.6 }}
                className="mt-10 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground"
              >
              <div className="flex items-center gap-2">
                <Wifi className="h-4 w-4 text-primary" /> do 1 Gb/s
              </div>
              <div className="flex items-center gap-2">
                <Tv className="h-4 w-4 text-primary" /> 150+ kanałów
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" /> Wsparcie 24/7
              </div>
            </motion.div>
            </div>
          </motion.div>

          {/* Right Column - Decorative Signal Graphic */}
          <motion.div
            className="lg:col-span-5 relative hidden lg:flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            {/* Concentric Squares */}
            <div className="relative w-80 h-80 flex items-center justify-center">
              <div className="absolute w-80 h-80 border-2 border-primary/30 rotate-45 rounded-3xl" />
              <div className="absolute w-64 h-64 border-2 border-primary/20 rotate-45 rounded-2xl" />
              <div className="absolute w-48 h-48 border-2 border-primary/10 rotate-45 rounded-xl" />

              {/* Center Circle */}
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-full shadow-2xl shadow-primary/30" />

              {/* Floating Speed Badge */}
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-8 right-8 bg-card rounded-2xl shadow-xl p-4 border border-border/50"
              >
                <span className="text-3xl font-extrabold text-primary">
                  1 Gb/s
                </span>
                <span className="block text-xs text-muted-foreground mt-1">
                  Prędkość pobierania
                </span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
