import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Plus, Wifi, Tv } from "lucide-react"
import { Button } from "@/components/ui/button"
import DataTable, { type Column } from "@/components/admin/DataTable"
import ConfirmDialog from "@/components/admin/ConfirmDialog"
import {
  useInternetPackagesList,
  useTVPackagesList,
  useInternetPackagesAdmin,
  useTVPackagesAdmin,
} from "@/hooks/use-packages"
import { technologyMeta } from "@/data/packages"
import type { InternetPackage, TVPackage } from "@/types"

const internetColumns: Column<InternetPackage>[] = [
  {
    header: "Nazwa",
    accessor: (item) => (
      <div>
        <p className="font-medium">{item.name}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{item.tagline}</p>
      </div>
    ),
  },
  {
    header: "Technologia",
    accessor: (item) => (
      <span className="inline-block px-2 py-0.5 rounded-md bg-muted text-xs font-medium uppercase">
        {technologyMeta[item.technology]?.shortLabel ?? item.technology}
      </span>
    ),
    className: "w-36",
  },
  {
    header: "Prędkość",
    accessor: (item) => `${item.speedDown}/${item.speedUp} Mb/s`,
    className: "w-36",
  },
  {
    header: "Cena (24m)",
    accessor: (item) => {
      const p = item.pricing.find((x) => x.period === "24m")
      return p ? `${p.monthlyPrice} zł/mies.` : "—"
    },
    className: "w-32",
  },
]

const tvColumns: Column<TVPackage>[] = [
  {
    header: "Nazwa",
    accessor: (item) => (
      <div>
        <p className="font-medium">{item.name}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{item.tagline}</p>
      </div>
    ),
  },
  {
    header: "Typ",
    accessor: (item) => (
      <span className="inline-block px-2 py-0.5 rounded-md bg-muted text-xs font-medium uppercase">
        {item.type}
      </span>
    ),
    className: "w-24",
  },
  {
    header: "Kanały",
    accessor: (item) => `${item.channels}+`,
    className: "w-24",
  },
  {
    header: "Cena (24m)",
    accessor: (item) => {
      const p = item.pricing.find((x) => x.period === "24m")
      return p ? `${p.monthlyPrice} zł/mies.` : "—"
    },
    className: "w-32",
  },
]

export default function PackagesListPage() {
  const { packages: internet, loading: loadingInternet, refresh: refreshInternet } = useInternetPackagesList()
  const { packages: tv, loading: loadingTV, refresh: refreshTV } = useTVPackagesList()
  const { remove: removeInternet } = useInternetPackagesAdmin()
  const { remove: removeTV } = useTVPackagesAdmin()
  const navigate = useNavigate()

  const [deleteInternet, setDeleteInternet] = useState<InternetPackage | null>(null)
  const [deleteTV, setDeleteTV] = useState<TVPackage | null>(null)
  const [deleting, setDeleting] = useState(false)

  async function handleDeleteInternet() {
    if (!deleteInternet) return
    setDeleting(true)
    await removeInternet(deleteInternet.id)
    setDeleteInternet(null)
    setDeleting(false)
    refreshInternet()
  }

  async function handleDeleteTV() {
    if (!deleteTV) return
    setDeleting(true)
    await removeTV(deleteTV.id)
    setDeleteTV(null)
    setDeleting(false)
    refreshTV()
  }

  return (
    <div className="space-y-10">
      {/* Internet Packages */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Wifi className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Pakiety internetowe</h2>
          </div>
          <Button onClick={() => navigate("/admin/pakiety/internet/nowy")}>
            <Plus className="h-4 w-4 mr-2" />
            Dodaj
          </Button>
        </div>

        <DataTable
          columns={internetColumns}
          data={internet}
          loading={loadingInternet}
          onEdit={(item) => navigate(`/admin/pakiety/internet/${item.id}`)}
          onDelete={setDeleteInternet}
          emptyMessage="Brak pakietów internetowych"
        />
      </section>

      {/* TV Packages */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Tv className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Pakiety TV</h2>
          </div>
          <Button onClick={() => navigate("/admin/pakiety/tv/nowy")}>
            <Plus className="h-4 w-4 mr-2" />
            Dodaj
          </Button>
        </div>

        <DataTable
          columns={tvColumns}
          data={tv}
          loading={loadingTV}
          onEdit={(item) => navigate(`/admin/pakiety/tv/${item.id}`)}
          onDelete={setDeleteTV}
          emptyMessage="Brak pakietów TV"
        />
      </section>

      <ConfirmDialog
        open={!!deleteInternet}
        title="Usuń pakiet internetowy"
        message={`Czy na pewno chcesz usunąć "${deleteInternet?.name}"?`}
        onConfirm={handleDeleteInternet}
        onCancel={() => setDeleteInternet(null)}
        loading={deleting}
      />

      <ConfirmDialog
        open={!!deleteTV}
        title="Usuń pakiet TV"
        message={`Czy na pewno chcesz usunąć "${deleteTV?.name}"?`}
        onConfirm={handleDeleteTV}
        onCancel={() => setDeleteTV(null)}
        loading={deleting}
      />
    </div>
  )
}
