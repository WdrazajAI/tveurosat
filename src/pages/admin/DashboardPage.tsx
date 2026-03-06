import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Newspaper, HelpCircle, FileText, Package } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface Stats {
  news: number
  faq: number
  documents: number
  internetPackages: number
  tvPackages: number
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const [stats, setStats] = useState<Stats>({
    news: 0,
    faq: 0,
    documents: 0,
    internetPackages: 0,
    tvPackages: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      const [news, faq, docs, inet, tv] = await Promise.all([
        supabase.from("news").select("id", { count: "exact", head: true }),
        supabase.from("faq").select("id", { count: "exact", head: true }),
        supabase.from("documents").select("id", { count: "exact", head: true }),
        supabase.from("internet_packages").select("id", { count: "exact", head: true }).eq("active", true),
        supabase.from("tv_packages").select("id", { count: "exact", head: true }).eq("active", true),
      ])

      setStats({
        news: news.count ?? 0,
        faq: faq.count ?? 0,
        documents: docs.count ?? 0,
        internetPackages: inet.count ?? 0,
        tvPackages: tv.count ?? 0,
      })
      setLoading(false)
    }
    fetchStats()
  }, [])

  const cards = [
    {
      label: "Aktualności",
      value: stats.news,
      icon: Newspaper,
      to: "/admin/aktualnosci",
      color: "text-blue-500 bg-blue-500/10",
    },
    {
      label: "FAQ",
      value: stats.faq,
      icon: HelpCircle,
      to: "/admin/faq",
      color: "text-amber-500 bg-amber-500/10",
    },
    {
      label: "Dokumenty",
      value: stats.documents,
      icon: FileText,
      to: "/admin/dokumenty",
      color: "text-green-500 bg-green-500/10",
    },
    {
      label: "Pakiety Internet",
      value: stats.internetPackages,
      icon: Package,
      to: "/admin/pakiety",
      color: "text-purple-500 bg-purple-500/10",
    },
    {
      label: "Pakiety TV",
      value: stats.tvPackages,
      icon: Package,
      to: "/admin/pakiety",
      color: "text-rose-500 bg-rose-500/10",
    },
  ]

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {cards.map((card) => (
          <button
            key={card.label}
            onClick={() => navigate(card.to)}
            className="bg-card border border-border rounded-xl p-5 text-left hover:border-primary/30 transition-colors"
          >
            <div className={`w-10 h-10 rounded-lg ${card.color} flex items-center justify-center mb-3`}>
              <card.icon className="h-5 w-5" />
            </div>
            <p className="text-sm text-muted-foreground">{card.label}</p>
            <p className="text-2xl font-bold mt-1">
              {loading ? (
                <span className="inline-block w-8 h-7 bg-muted animate-pulse rounded" />
              ) : (
                card.value
              )}
            </p>
          </button>
        ))}
      </div>
    </div>
  )
}
