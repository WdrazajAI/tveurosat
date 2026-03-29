import { useState, useMemo, useEffect } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import { X, Tv } from "lucide-react"
import { usePackageChannels } from "@/hooks/use-channels"
import type { ChannelCategory, TVChannel } from "@/types"

const ALL_CATEGORIES: ChannelCategory[] = [
  "Ogólne",
  "Filmy i seriale",
  "Informacje",
  "Styl życia",
  "Sport",
  "Dokumenty",
  "Muzyka",
  "Dzieci",
]

interface ChannelListModalProps {
  packageId: string
  packageName: string
  channelCount: number
  isOpen: boolean
  onClose: () => void
}

export default function ChannelListModal({
  packageId,
  packageName,
  channelCount,
  isOpen,
  onClose,
}: ChannelListModalProps) {
  const { groups, loading } = usePackageChannels(isOpen ? packageId : undefined)
  const [activeCategory, setActiveCategory] = useState<"all" | ChannelCategory>("all")

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
      return () => { document.body.style.overflow = "" }
    }
  }, [isOpen])

  // Flatten all channels from all groups (deduplicated)
  const allChannels = useMemo(() => {
    const channelMap = new Map<string, TVChannel>()
    for (const group of groups) {
      for (const ch of group.channels) {
        channelMap.set(ch.id, ch)
      }
    }
    return Array.from(channelMap.values()).sort((a, b) => a.order - b.order)
  }, [groups])

  // Get categories that actually have channels
  const availableCategories = useMemo(() => {
    const cats = new Set<ChannelCategory>()
    for (const ch of allChannels) {
      cats.add(ch.category)
    }
    return ALL_CATEGORIES.filter((c) => cats.has(c))
  }, [allChannels])

  // Count per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: allChannels.length }
    for (const ch of allChannels) {
      counts[ch.category] = (counts[ch.category] || 0) + 1
    }
    return counts
  }, [allChannels])

  // Filter channels by active category
  const filteredChannels = useMemo(() => {
    if (activeCategory === "all") return allChannels
    return allChannels.filter((ch) => ch.category === activeCategory)
  }, [allChannels, activeCategory])

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
          />

          {/* Drawer panel — slides from right */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 z-[60] w-full sm:w-[480px] md:w-[540px] lg:w-[600px] flex flex-col bg-card border-l border-border shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border shrink-0">
              <div>
                <h2 className="text-lg font-bold tracking-tight">Lista kanałów</h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {packageName} — {channelCount} kanałów
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2.5 rounded-xl hover:bg-muted transition-colors -mr-1"
                aria-label="Zamknij"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Category tabs */}
            <div className="px-6 py-3 border-b border-border shrink-0 overflow-x-auto scrollbar-none">
              <div className="flex gap-2 min-w-max">
                <CategoryTab
                  label="Wszystkie"
                  count={categoryCounts.all || 0}
                  active={activeCategory === "all"}
                  onClick={() => setActiveCategory("all")}
                />
                {availableCategories.map((cat) => (
                  <CategoryTab
                    key={cat}
                    label={cat}
                    count={categoryCounts[cat] || 0}
                    active={activeCategory === cat}
                    onClick={() => setActiveCategory(cat)}
                  />
                ))}
              </div>
            </div>

            {/* Channel grid — scrollable */}
            <div className="flex-1 overflow-y-auto p-6">
              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                </div>
              ) : filteredChannels.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                  <Tv className="h-8 w-8 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Brak kanałów w tej kategorii</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {filteredChannels.map((ch) => (
                    <ChannelCard key={ch.id} channel={ch} />
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-border shrink-0 bg-muted/30">
              <p className="text-xs text-muted-foreground text-center">
                {activeCategory === "all"
                  ? `${allChannels.length} kanałów w pakiecie`
                  : `${filteredChannels.length} z ${allChannels.length} kanałów`
                }
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  )
}

function CategoryTab({
  label,
  count,
  active,
  onClick,
}: {
  label: string
  count: number
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
        active
          ? "bg-primary text-primary-foreground shadow-sm"
          : "bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground"
      }`}
    >
      {label}
      <span
        className={`text-[10px] min-w-[20px] text-center px-1.5 py-0.5 rounded-full ${
          active
            ? "bg-primary-foreground/20 text-primary-foreground"
            : "bg-background text-muted-foreground"
        }`}
      >
        {count}
      </span>
    </button>
  )
}

function ChannelCard({ channel }: { channel: TVChannel }) {
  return (
    <div className="flex flex-col items-center gap-2.5 p-3 rounded-xl border border-border bg-background hover:shadow-md hover:border-primary/20 transition-all group">
      <div className="h-10 w-full flex items-center justify-center">
        {channel.logoUrl ? (
          <img
            src={channel.logoUrl}
            alt={channel.name}
            className="h-10 max-w-[64px] object-contain group-hover:scale-105 transition-transform"
            loading="lazy"
          />
        ) : (
          <div className="h-10 w-10 bg-muted rounded-lg flex items-center justify-center">
            <Tv className="h-5 w-5 text-muted-foreground/60" />
          </div>
        )}
      </div>
      <span className="text-[10px] text-muted-foreground text-center leading-tight line-clamp-2 w-full font-medium">
        {channel.name}
      </span>
    </div>
  )
}
