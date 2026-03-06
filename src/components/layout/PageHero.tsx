import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { ChevronRight, Home } from "lucide-react"

interface Breadcrumb {
  label: string
  href?: string
}

interface PageHeroProps {
  title: string
  subtitle?: string
  breadcrumbs?: Breadcrumb[]
}

export default function PageHero({ title, subtitle, breadcrumbs }: PageHeroProps) {
  return (
    <section className="relative pt-28 pb-8 sm:pt-32 sm:pb-10 bg-transparent overflow-hidden">
      {/* Decorative geometric shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-16 right-[12%] w-52 h-52 border-2 border-primary/10 rotate-45 rounded-3xl hidden md:block" />
        <div className="absolute bottom-8 left-[6%] w-36 h-36 bg-primary/[0.03] rotate-12 rounded-2xl hidden md:block" />
        <div className="absolute top-1/3 right-[25%] w-3 h-3 bg-secondary rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center justify-center gap-1.5 text-sm text-muted-foreground">
              <li>
                <Link
                  to="/"
                  className="flex items-center gap-1 hover:text-primary transition-colors"
                >
                  <Home className="h-3.5 w-3.5" />
                  <span>Strona główna</span>
                </Link>
              </li>
              {breadcrumbs.map((crumb, index) => (
                <li key={index} className="flex items-center gap-1.5">
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
                  {crumb.href ? (
                    <Link
                      to={crumb.href}
                      className="hover:text-primary transition-colors"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-foreground font-medium">{crumb.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground"
        >
          {title}
        </motion.h1>

        {/* Subtitle */}
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </section>
  )
}
