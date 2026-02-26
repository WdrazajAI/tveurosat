import { ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { getLatestNews } from "@/data/news"
import NewsCard from "@/components/news/NewsCard"

export default function NewsPreviewSection() {
  const latestNews = getLatestNews(3)

  return (
    <section className="py-24 sm:py-32 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
            Aktualności
          </span>
          <h2 className="mt-6 text-3xl sm:text-4xl font-bold tracking-tight leading-[1.1]">
            Co nowego w TV-EURO-SAT?
          </h2>
          <p className="mt-4 text-base sm:text-lg leading-relaxed text-muted-foreground">
            Promocje, nowe podłączenia i informacje o rozwoju naszej sieci.
          </p>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestNews.map((article, index) => (
            <NewsCard key={article.id} article={article} index={index} />
          ))}
        </div>

        {/* See All CTA */}
        <div className="text-center mt-10">
          <Button variant="outline" asChild>
            <Link to="/aktualnosci" className="inline-flex items-center gap-2 whitespace-nowrap">
              Wszystkie aktualności <ArrowRight className="h-4 w-4 flex-shrink-0" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
