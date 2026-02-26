import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Home, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFoundPage() {
  return (
    <section className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <div className="text-6xl sm:text-8xl font-extrabold tracking-tight text-primary/20 mb-4">
          404
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-3">
          Strona nie znaleziona
        </h1>
        <p className="text-muted-foreground mb-8">
          Przepraszamy, strona której szukasz nie istnieje lub została przeniesiona.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild>
            <Link to="/">
              <Home className="h-4 w-4 mr-2" />
              Strona główna
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/kontakt">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kontakt
            </Link>
          </Button>
        </div>
      </motion.div>
    </section>
  )
}
