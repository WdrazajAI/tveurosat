import { ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useNewsList } from "@/hooks/use-news"
import NewsCard from "@/components/news/NewsCard"

export default function NewsPreviewSection() {
  const { articles, loading } = useNewsList()
  const latestNews = articles.slice(0, 3)

  if (loading) {
    return (
      <section className="py-16 sm:py-20 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="h-6 w-24 bg-muted rounded-full mx-auto animate-pulse" />
            <div className="h-10 w-64 bg-muted rounded mt-6 mx-auto animate-pulse" />
            <div className="h-6 w-96 bg-muted rounded mt-4 mx-auto animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-muted rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 sm:py-20 bg-transparent">
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
