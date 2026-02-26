import { useParams, Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Calendar, ArrowLeft, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import PageHero from "@/components/layout/PageHero"
import { getNewsBySlug, getLatestNews, newsCategories } from "@/data/news"
import NewsCard from "@/components/news/NewsCard"

export default function NewsArticlePage() {
  const { slug } = useParams<{ slug: string }>()
  const article = slug ? getNewsBySlug(slug) : undefined

  if (!article) {
    return (
      <>
        <PageHero
          title="Artykuł nie znaleziony"
          breadcrumbs={[
            { label: "Aktualności", href: "/aktualnosci" },
            { label: "Nie znaleziono" },
          ]}
        />
        <div className="text-center py-16">
          <p className="text-muted-foreground mb-6">
            Nie znaleźliśmy szukanego artykułu.
          </p>
          <Button asChild>
            <Link to="/aktualnosci">Wróć do aktualności</Link>
          </Button>
        </div>
      </>
    )
  }

  const otherArticles = getLatestNews(4).filter((a) => a.id !== article.id).slice(0, 3)

  return (
    <>
      <PageHero
        title={article.title}
        breadcrumbs={[
          { label: "Aktualności", href: "/aktualnosci" },
          { label: article.title },
        ]}
      />

      <article className="pt-6 pb-12 sm:pt-8 sm:pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          {/* Meta */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-8 text-sm text-muted-foreground"
          >
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {new Date(article.date).toLocaleDateString("pl-PL", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1.5">
              <Tag className="h-4 w-4" />
              {newsCategories[article.category]}
            </span>
          </motion.div>

          {/* Content - rendered as simple HTML-like markup */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="prose prose-lg max-w-none dark:prose-invert
              prose-headings:font-bold prose-headings:tracking-tight
              prose-p:text-muted-foreground prose-p:leading-relaxed
              prose-li:text-muted-foreground
              prose-strong:text-foreground
              prose-a:text-primary"
          >
            {article.content.split("\n\n").map((paragraph, idx) => {
              if (paragraph.startsWith("## ")) {
                return (
                  <h2 key={idx} className="text-2xl font-bold mt-8 mb-4 text-foreground">
                    {paragraph.replace("## ", "")}
                  </h2>
                )
              }
              if (paragraph.startsWith("- ")) {
                const items = paragraph.split("\n").filter((l) => l.startsWith("- "))
                return (
                  <ul key={idx} className="list-disc pl-6 space-y-1.5 my-4">
                    {items.map((item, i) => (
                      <li key={i} className="text-muted-foreground">
                        {item.replace("- ", "").replace(/\*\*(.*?)\*\*/g, "$1")}
                      </li>
                    ))}
                  </ul>
                )
              }
              if (paragraph.includes("|")) {
                // Simple table rendering
                const rows = paragraph.split("\n").filter((r) => r.includes("|") && !r.includes("---"))
                return (
                  <div key={idx} className="overflow-x-auto my-4">
                    <table className="w-full text-sm border border-border rounded-lg">
                      <tbody>
                        {rows.map((row, ri) => (
                          <tr key={ri} className={ri === 0 ? "font-semibold bg-muted" : "border-t border-border"}>
                            {row.split("|").filter(Boolean).map((cell, ci) => (
                              <td key={ci} className="px-4 py-2">
                                {cell.trim().replace(/\*\*(.*?)\*\*/g, "$1")}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              }
              return (
                <p key={idx} className="text-muted-foreground leading-relaxed my-4">
                  {paragraph.replace(/\*\*(.*?)\*\*/g, "$1")}
                </p>
              )
            })}
          </motion.div>

          {/* Back link */}
          <div className="mt-12 pt-8 border-t border-border">
            <Button variant="outline" asChild>
              <Link to="/aktualnosci" className="inline-flex items-center gap-2 whitespace-nowrap">
                <ArrowLeft className="h-4 w-4 flex-shrink-0" />
                Wróć do aktualności
              </Link>
            </Button>
          </div>
        </div>
      </article>

      {/* Other Articles */}
      {otherArticles.length > 0 && (
        <section className="py-12 bg-muted/30 border-t border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-8">Inne artykuły</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherArticles.map((a, i) => (
                <NewsCard key={a.id} article={a} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
