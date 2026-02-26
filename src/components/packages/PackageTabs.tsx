import { Wifi, Tv, Package } from "lucide-react"
import { cn } from "@/lib/utils"
import type { PackageType } from "@/types"

interface PackageTabsProps {
  activeTab: PackageType
  onTabChange: (tab: PackageType) => void
}

const tabs: { id: PackageType; label: string; sublabel: string; icon: typeof Wifi }[] = [
  { id: "internet", label: "Internet", sublabel: "Kablowy / GPON", icon: Wifi },
  { id: "tv", label: "Telewizja", sublabel: "Kablowa / IPTV", icon: Tv },
  { id: "combo", label: "Internet + TV", sublabel: "Pakiety łączone", icon: Package },
]

export default function PackageTabs({ activeTab, onTabChange }: PackageTabsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
      {tabs.map((tab) => {
        const Icon = tab.icon
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex items-center gap-3 px-6 py-4 rounded-xl border-2 transition-all duration-200 text-left sm:text-center",
              isActive
                ? "border-primary bg-primary/10 text-primary shadow-sm"
                : "border-border bg-card text-muted-foreground hover:border-primary/30 hover:bg-primary/5"
            )}
          >
            <Icon className={cn("h-5 w-5 flex-shrink-0", isActive ? "text-primary" : "text-muted-foreground")} />
            <div>
              <div className="font-semibold text-sm">{tab.label}</div>
              <div className="text-xs text-muted-foreground">{tab.sublabel}</div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
