import { motion } from "framer-motion"
import { ArrowRight, Zap, Cable, Signal, Router } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

const technologies = [
  {
    icon: Zap,
    label: "Światłowód GPON",
    speed: "do 1 Gb/s",
    description:
      "Bezpośrednie połączenie światłowodowe — najwyższe prędkości i stabilność sygnału. Idealne do streamingu 4K, pracy zdalnej i gier online.",
    highlights: ["Własna infrastruktura", "Symetryczny upload", "Najniższy ping"],
  },
  {
    icon: Cable,
    label: "Światłowód BSA",
    speed: "do 600 Mb/s",
    description:
      "Internet światłowodowy realizowany przez sieć Orange z pełną obsługą TV-EURO-SAT. Dostępny tam, gdzie nie dociera nasza sieć GPON.",
    highlights: ["Sieć Orange", "Szeroki zasięg", "Szybki internet"],
  },
  {
    icon: Router,
    label: "Internet Kablowy",
    speed: "do 250 Mb/s",
    description:
      "Sprawdzony internet kablowy DOCSIS z możliwością podłączenia telewizji kablowej na jednym kablu. Prosta instalacja.",
    highlights: ["Sprawdzona technologia", "TV kablowa w pakiecie", "Łatwa instalacja"],
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
      className="relative py-24 sm:py-32 bg-section-dark-bg text-section-dark-text overflow-hidden"
    >
      {/* Diagonal Top Divider */}
      <div
        className="absolute top-0 left-0 right-0 h-10 bg-background"
        style={{ clipPath: "polygon(0 0, 100% 0, 100% 0%, 0 100%)" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
            Nasze Technologie
          </span>
          <h2 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1] text-white">
            Jak dostarczamy internet
          </h2>
          <p className="mt-4 text-base sm:text-lg leading-relaxed text-white/70">
            Wykorzystujemy różne technologie, aby dotrzeć do każdego klienta.
            Sprawdź, co jest dostępne pod Twoim adresem.
          </p>
        </div>

        {/* Technologies Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-5xl mx-auto mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {technologies.map(({ label, icon: Icon, speed, description, highlights }) => (
            <motion.div
              key={label}
              variants={itemVariants}
              className="relative rounded-2xl bg-white/[0.08] backdrop-blur-sm border border-white/15 p-6 sm:p-8 hover:bg-white/[0.14] transition-all duration-300 shadow-lg shadow-black/10 flex flex-col"
            >
              {/* Icon + Label */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-sm uppercase tracking-widest text-primary font-semibold">
                  {label}
                </h3>
              </div>

              {/* Speed */}
              <div className="text-3xl font-extrabold text-white mb-3">
                {speed}
              </div>

              {/* Description */}
              <p className="text-sm text-white/60 leading-relaxed mb-5">
                {description}
              </p>

              {/* Divider */}
              <div className="h-px bg-white/10 mb-5" />

              {/* Highlights */}
              <ul className="space-y-2.5 flex-1">
                {highlights.map((highlight) => (
                  <li key={highlight} className="flex items-center gap-2.5">
                    <Signal className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                    <span className="text-sm text-white/80">{highlight}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <div className="text-center mt-10">
          <Button
            variant="outline"
            size="lg"
            className="border-white/30 text-white hover:bg-white/20 hover:border-white/50 hover:text-white"
            asChild
          >
            <Link
              to="/pakiety"
              className="inline-flex items-center gap-2 whitespace-nowrap"
            >
              Sprawdź co jest dostępne pod Twoim adresem{" "}
              <ArrowRight className="h-4 w-4 flex-shrink-0" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Diagonal Bottom Divider */}
      <div
        className="absolute bottom-0 left-0 right-0 h-10 bg-background"
        style={{ clipPath: "polygon(0 100%, 100% 0%, 100% 100%)" }}
      />
    </section>
  )
}
