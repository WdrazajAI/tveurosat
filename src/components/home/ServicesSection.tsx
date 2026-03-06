import { motion } from "framer-motion"
import { Wifi, Tv, Package, Zap, Shield, Headphones } from "lucide-react"

const services = [
  {
    icon: Wifi,
    title: "Internet Światłowodowy",
    description:
      "Ultraszybki internet GPON do 1 Gb/s z gwarancją stabilności i niskiego pingu.",
  },
  {
    icon: Tv,
    title: "Telewizja Cyfrowa",
    description:
      "Ponad 150 kanałów HD z dostępem do najlepszych treści rozrywkowych i informacyjnych.",
  },
  {
    icon: Package,
    title: "Pakiety Łączone",
    description:
      "Połącz internet z telewizją i oszczędź. Elastyczne pakiety dopasowane do Twoich potrzeb.",
  },
  {
    icon: Zap,
    title: "Prędkość Bez Kompromisów",
    description:
      "Symetryczny upload i download. Idealne do pracy zdalnej i streamingu w 4K.",
  },
  {
    icon: Shield,
    title: "Bezpieczeństwo Sieci",
    description:
      "Zaawansowana ochrona przed zagrożeniami online dla całej rodziny.",
  },
  {
    icon: Headphones,
    title: "Wsparcie Techniczne",
    description:
      "Dedykowany zespół pomocy technicznej dostępny 7 dni w tygodniu.",
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

export default function ServicesSection() {
  return (
    <section
      id="uslugi"
      className="py-24 sm:py-32 bg-transparent relative overflow-hidden"
    >
      {/* Decorative Geometric Shapes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute bottom-20 left-[3%] w-40 h-40 bg-primary/[0.03] -rotate-12 rounded-2xl" />
        <div className="absolute top-[40%] left-[15%] w-2.5 h-2.5 bg-secondary/60 rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
            Nasze Usługi
          </span>
          <h2 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1]">
            Wszystko, czego potrzebujesz w jednym miejscu
          </h2>
          <p className="mt-4 text-base sm:text-lg leading-relaxed text-muted-foreground">
            Od ultraszybkiego internetu po bogatą ofertę telewizyjną —
            zapewniamy kompleksowe rozwiązania telekomunikacyjne.
          </p>
        </div>

        {/* Services Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {services.map((service, index) => {
            const IconComponent = service.icon
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group relative p-6 sm:p-8 rounded-2xl bg-card border border-border/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 border-l-4 border-l-primary"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                  <IconComponent className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  {service.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
