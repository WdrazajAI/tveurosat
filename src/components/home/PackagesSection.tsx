import { motion } from "framer-motion"
import { Check, ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { internetPackages, tvPackages, comboPackages } from "@/data/packages"

// Show one highlighted package from each category
const previewPackages = [
  { ...internetPackages.find((p) => p.featured)!, categoryLabel: "Internet Kablowy", categoryLink: "/pakiety/internet" },
  { ...tvPackages.find((p) => p.featured)!, categoryLabel: "Telewizja Kablowa", categoryLink: "/pakiety/telewizja" },
  { ...comboPackages.find((p) => p.featured)!, categoryLabel: "Internet + TV", categoryLink: "/pakiety" },
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
            Pakiety
          </span>
          <h2 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1] text-white">
            Internet i Telewizja dla Ciebie
          </h2>
          <p className="mt-4 text-base sm:text-lg leading-relaxed text-white/70">
            Transparentne ceny, brak ukrytych opłat. Internet Kablowy GPON,
            Telewizja Kablowa IPTV i pakiety łączone.
          </p>
        </div>

        {/* Preview Packages Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-5xl mx-auto mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {previewPackages.map((pkg, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="relative rounded-2xl bg-white/[0.08] backdrop-blur-sm border border-white/15 p-6 sm:p-8 hover:bg-white/[0.14] transition-all duration-300 shadow-lg shadow-black/10 text-center flex flex-col"
            >
              {/* Category Label */}
              <div className="text-xs uppercase tracking-widest text-white/50 mb-3">
                {pkg.categoryLabel}
              </div>

              {/* Package Info */}
              <div className="text-sm uppercase tracking-widest text-primary font-semibold">
                {pkg.name}
              </div>

              {/* Speed / Channels — fixed height for alignment */}
              <div className="min-h-[4.5rem] flex flex-col justify-center">
                {pkg.speed && (
                  <div className="text-3xl font-extrabold text-white mt-2">
                    {pkg.speed}
                  </div>
                )}
                {pkg.channels && !pkg.speed && (
                  <div className="text-3xl font-extrabold text-white mt-2">
                    {pkg.channels}+ kanałów
                  </div>
                )}
                {pkg.speed && pkg.channels && (
                  <div className="text-sm text-white/60 mt-1">
                    + {pkg.channels}+ kanałów TV
                  </div>
                )}
              </div>

              {/* Price */}
              <div className="mt-4">
                <span className="text-4xl font-extrabold text-white">
                  {pkg.price}
                </span>
                <span className="text-lg text-white/60"> {pkg.priceNote}</span>
              </div>

              {/* Divider */}
              <div className="h-px bg-white/10 my-5" />

              {/* Features (show first 3) */}
              <ul className="space-y-2.5 inline-flex flex-col items-start flex-1">
                {pkg.features.slice(0, 3).map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="text-sm text-white/80">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA - link to category */}
              <div className="mt-auto pt-6">
                <Button
                  className="w-full bg-primary hover:bg-primary/90 text-white h-11 rounded-xl font-semibold"
                  asChild
                >
                  <Link to={pkg.categoryLink}>Zobacz pakiety</Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* See All CTA */}
        <div className="text-center mt-10">
          <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/20 hover:border-white/50 hover:text-white" asChild>
            <Link to="/pakiety" className="inline-flex items-center gap-2 whitespace-nowrap">
              Zobacz pełną ofertę <ArrowRight className="h-4 w-4 flex-shrink-0" />
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
