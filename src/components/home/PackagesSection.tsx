import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"

const packages = [
  {
    name: "Start",
    speed: "100 Mb/s",
    price: 59,
    features: [
      "Prędkość do 100 Mb/s",
      "Router Wi-Fi w cenie",
      "Bez limitu danych",
      "Wsparcie techniczne",
    ],
    featured: false,
  },
  {
    name: "Standard",
    speed: "300 Mb/s",
    price: 89,
    features: [
      "Prędkość do 300 Mb/s",
      "Router Wi-Fi w cenie",
      "Bez limitu danych",
      "Priorytetowe wsparcie",
    ],
    featured: true,
  },
  {
    name: "Premium",
    speed: "600 Mb/s",
    price: 119,
    features: [
      "Prędkość do 600 Mb/s",
      "Router Wi-Fi w cenie",
      "Bez limitu danych",
      "Najwyższa prędkość",
    ],
    featured: false,
  },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
}

export default function PackagesSection() {
  return (
    <section
      id="pakiety"
      className="relative py-24 sm:py-32 bg-[hsl(222,47%,11%)] text-[hsl(210,20%,98%)] overflow-hidden"
    >
      {/* Diagonal Top Divider */}
      <div
        className="absolute top-0 left-0 right-0 h-20 bg-[hsl(210,20%,98%)]"
        style={{ clipPath: "polygon(0 0, 100% 0, 100% 0%, 0 100%)" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
            Pakiety
          </span>
          <h2 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1] text-white">
            Wybierz Swój Pakiet Internetowy
          </h2>
          <p className="mt-4 text-base sm:text-lg leading-relaxed text-white/70">
            Transparentne ceny, brak ukrytych opłat. Każdy pakiet z darmowym
            routerem Wi-Fi.
          </p>
        </div>

        {/* Packages Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-5xl mx-auto mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {packages.map((pkg, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className={`relative rounded-2xl bg-white/[0.06] backdrop-blur-sm border border-white/10 p-8 hover:bg-white/[0.1] transition-all duration-300 ${
                pkg.featured ? "ring-2 ring-primary scale-[1.03]" : ""
              }`}
            >
              {/* Featured Badge */}
              {pkg.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-secondary text-white text-xs font-bold px-4 py-1 rounded-full">
                  Najpopularniejszy
                </div>
              )}

              {/* Package Info */}
              <div className="text-sm uppercase tracking-widest text-primary font-semibold">
                {pkg.name}
              </div>
              <div className="text-4xl font-extrabold text-white mt-2">
                {pkg.speed}
              </div>

              {/* Price */}
              <div className="mt-4">
                <span className="text-4xl font-extrabold text-white">
                  {pkg.price}
                </span>
                <span className="text-lg text-white/60"> zł/mies.</span>
              </div>

              {/* Divider */}
              <div className="h-px bg-white/10 my-6" />

              {/* Features */}
              <ul className="space-y-3">
                {pkg.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="text-sm text-white/80">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Button className="w-full mt-8 bg-primary hover:bg-primary/90 text-white h-12 rounded-xl font-semibold">
                Wybierz Plan
              </Button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
