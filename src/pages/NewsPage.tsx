import { useState } from "react"
import PageHero from "@/components/layout/PageHero"
import NewsCard from "@/components/news/NewsCard"
import { getNewsByCategory, newsCategories } from "@/data/news"
import { cn } from "@/lib/utils"

export default function NewsPage() {
  const [activeCategory, setActiveCategory] = useState("all")
  const articles = getNewsByCategory(activeCategory)

  return (
    <>
      <PageHero
        title="Aktualności"
        subtitle="Bądź na bieżąco z nowościami, promocjami i informacjami o rozwoju naszej sieci."
        breadcrumbs={[{ label: "Aktualności" }]}
      />

      <section className="pt-6 pb-12 sm:pt-8 sm:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-10">
            {Object.entries(newsCategories).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                  activeCategory === key
                    ? "bg-primary text-white"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article, index) => (
              <NewsCard key={article.id} article={article} index={index} />
            ))}
          </div>

          {articles.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              Brak artykułów w tej kategorii.
            </div>
          )}
        </div>
      </section>
    </>
  )
}
