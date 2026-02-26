import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, MessageCircle } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import PageHero from "@/components/layout/PageHero"
import { getFAQByCategory, faqCategories } from "@/data/faq"
import { cn } from "@/lib/utils"

function FAQItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [open, setOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="border border-border rounded-xl overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-muted/50 transition-colors"
      >
        <span className="font-medium text-foreground">{question}</span>
        <ChevronDown
          className={cn(
            "h-5 w-5 text-muted-foreground flex-shrink-0 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState("all")
  const items = activeCategory === "all" ? getFAQByCategory() : getFAQByCategory(activeCategory)

  return (
    <>
      <PageHero
        title="Często Zadawane Pytania"
        subtitle="Znajdź odpowiedzi na najczęstsze pytania dotyczące naszych usług."
        breadcrumbs={[{ label: "FAQ" }]}
      />

      <section className="pt-6 pb-12 sm:pt-8 sm:pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-10">
            <button
              onClick={() => setActiveCategory("all")}
              className={cn(
                "px-4 py-2.5 rounded-full text-sm font-medium transition-colors",
                activeCategory === "all"
                  ? "bg-primary text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              Wszystkie
            </button>
            {Object.entries(faqCategories).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={cn(
                  "px-4 py-2.5 rounded-full text-sm font-medium transition-colors",
                  activeCategory === key
                    ? "bg-primary text-white"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                {label}
              </button>
            ))}
          </div>

          {/* FAQ Items */}
          <div className="space-y-3">
            {items.map((item, index) => (
              <FAQItem key={item.id} question={item.question} answer={item.answer} index={index} />
            ))}
          </div>

          {/* Contact CTA */}
          <div className="mt-16 text-center p-8 rounded-2xl bg-primary/5 border border-primary/10">
            <MessageCircle className="h-10 w-10 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              Nie znalazłeś odpowiedzi?
            </h3>
            <p className="text-muted-foreground mb-6">
              Skontaktuj się z nami — chętnie odpowiemy na Twoje pytania.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button asChild>
                <Link to="/kontakt">Napisz do nas</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/dokumenty">Cenniki i regulaminy</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
