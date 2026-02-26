import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { Calendar, ArrowRight } from "lucide-react"
import type { NewsArticle } from "@/types"
import { newsCategories } from "@/data/news"

interface NewsCardProps {
  article: NewsArticle
  index: number
}

const categoryColors: Record<string, string> = {
  promotion: "bg-green-500/10 text-green-600 dark:text-green-400",
  news: "bg-primary/10 text-primary",
  expansion: "bg-secondary/10 text-secondary",
  maintenance: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
}

export default function NewsCard({ article, index }: NewsCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="h-full"
    >
      <Link
        to={`/aktualnosci/${article.slug}`}
        className="group flex flex-col h-full rounded-2xl bg-card border border-border p-6 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
      >
        {/* Category + Date */}
        <div className="flex items-center gap-3 mb-4">
          <span
            className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
              categoryColors[article.category] || categoryColors.news
            }`}
          >
            {newsCategories[article.category]}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {new Date(article.date).toLocaleDateString("pl-PL", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2 leading-tight line-clamp-2 min-h-[3.5rem]">
          {article.title}
        </h3>

        {/* Excerpt */}
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">
          {article.excerpt}
        </p>

        {/* Read more */}
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:gap-2.5 transition-all mt-auto">
          Czytaj więcej
          <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </Link>
    </motion.article>
  )
}
