import { motion } from "framer-motion"

const stats = [
  { number: "10+", label: "Lat na rynku" },
  { number: "5 000+", label: "Aktywnych abonentów" },
  { number: "99.9%", label: "Dostępność sieci" },
  { number: "< 5 min", label: "Średni czas reakcji" },
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

export default function StatsSection() {
  return (
    <section className="relative py-24 sm:py-32 bg-[hsl(210,20%,98%)]">
      {/* Diagonal Divider at Top */}
      <div
        className="absolute top-0 left-0 right-0 h-20 bg-[hsl(222,47%,11%)]"
        style={{ clipPath: "polygon(0 0, 100% 0, 0 100%)" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="text-center"
            >
              <div className="text-4xl sm:text-5xl font-extrabold text-primary">
                {stat.number}
              </div>
              <div className="text-sm text-muted-foreground mt-2">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
