import { motion } from "framer-motion"

const stats = [
  { number: "10+", label: "Lat doświadczenia" },
  { number: "5000+", label: "Zadowolonych klientów" },
  { number: "99.9%", label: "Uptime sieci" },
  { number: "24/7", label: "Wsparcie techniczne" },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
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

export default function TrustBar() {
  return (
    <section className="py-8 border-y border-border/50 bg-white/50">
      <motion.div
        className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-center gap-8 sm:gap-12"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className="flex items-center gap-3"
          >
            <span className="text-2xl font-extrabold text-foreground">
              {stat.number}
            </span>
            <span className="text-sm text-muted-foreground">{stat.label}</span>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
