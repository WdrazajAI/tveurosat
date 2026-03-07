import { useState, useCallback } from "react"
import { Upload, FileText, AlertTriangle, CheckCircle, Plus, RefreshCw, Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  useCoverageImport,
  getCoverageStats,
  type CoverageDiff,
} from "@/hooks/use-coverage-admin"

type ImportStep = "upload" | "preview" | "applying" | "done"

export default function CoverageImportPage() {
  const [step, setStep] = useState<ImportStep>("upload")
  const [diff, setDiff] = useState<CoverageDiff | null>(null)
  const [deleteRemoved, setDeleteRemoved] = useState(false)
  const [result, setResult] = useState<{
    insertedCount: number
    updatedCount: number
    deletedCount: number
  } | null>(null)
  const [stats, setStats] = useState<{
    totalAddresses: number
    localities: number
    technologies: Record<string, number>
  } | null>(null)

  const { parseCSV, getDiff, apply, loading, error } = useCoverageImport()

  // Load initial stats
  const loadStats = useCallback(async () => {
    const data = await getCoverageStats()
    setStats(data)
  }, [])

  // Load stats on mount
  useState(() => {
    loadStats()
  })

  const handleFileUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return

      const content = await file.text()
      const rows = parseCSV(content)

      if (rows.length === 0) {
        alert("Nie znaleziono poprawnych rekordow w pliku CSV")
        return
      }

      // Calculate diff
      const diffResult = await getDiff(rows)
      if (diffResult) {
        setDiff(diffResult)
        setStep("preview")
      }
    },
    [parseCSV, getDiff]
  )

  const handleApply = useCallback(async () => {
    if (!diff) return

    setStep("applying")
    const applyResult = await apply(diff, { deleteRemoved })

    if (applyResult.success) {
      setResult({
        insertedCount: applyResult.insertedCount,
        updatedCount: applyResult.updatedCount,
        deletedCount: applyResult.deletedCount,
      })
      setStep("done")
      loadStats() // Refresh stats
    } else {
      setStep("preview") // Go back to preview on error
    }
  }, [diff, deleteRemoved, apply, loadStats])

  const handleReset = useCallback(() => {
    setStep("upload")
    setDiff(null)
    setResult(null)
    setDeleteRemoved(false)
  }, [])

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Import zasięgu</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Aktualizuj dane zasięgu przez import pliku CSV
          </p>
        </div>
      </div>

      {/* Current stats */}
      {stats && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-card border">
            <p className="text-sm text-muted-foreground">Adresy w bazie</p>
            <p className="text-2xl font-bold">{stats.totalAddresses.toLocaleString()}</p>
          </div>
          <div className="p-4 rounded-xl bg-card border">
            <p className="text-sm text-muted-foreground">Miejscowości</p>
            <p className="text-2xl font-bold">{stats.localities.toLocaleString()}</p>
          </div>
          <div className="p-4 rounded-xl bg-card border">
            <p className="text-sm text-muted-foreground">Technologie</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {Object.entries(stats.technologies).map(([tech, count]) => (
                <span
                  key={tech}
                  className="text-xs px-2 py-0.5 bg-muted rounded-full"
                >
                  {tech}: {count}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Upload step */}
      {step === "upload" && (
        <div className="border-2 border-dashed border-muted rounded-xl p-12 text-center">
          <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Przeciągnij plik CSV</h3>
          <p className="text-sm text-muted-foreground mb-4">
            lub kliknij aby wybrać plik z danymi zasięgu
          </p>
          <label>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
              disabled={loading}
            />
            <Button asChild disabled={loading}>
              <span>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Przetwarzam...
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4 mr-2" />
                    Wybierz plik CSV
                  </>
                )}
              </span>
            </Button>
          </label>

          <div className="mt-8 text-left max-w-md mx-auto">
            <p className="text-sm font-medium mb-2">Format pliku:</p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Separator: średnik (;)</li>
              <li>• Wiersz nagłówka: DI;...</li>
              <li>• Wiersze danych: ZS;address_id;simc;locality;...</li>
              <li>• Kodowanie: UTF-8</li>
            </ul>
          </div>
        </div>
      )}

      {/* Preview step */}
      {step === "preview" && diff && (
        <div className="space-y-6">
          {/* Summary cards */}
          <div className="grid grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
              <div className="flex items-center gap-2 mb-1">
                <Plus className="h-4 w-4 text-green-500" />
                <p className="text-sm font-medium text-green-700 dark:text-green-400">Nowe</p>
              </div>
              <p className="text-2xl font-bold text-green-600">{diff.newRows.length}</p>
            </div>
            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-center gap-2 mb-1">
                <RefreshCw className="h-4 w-4 text-blue-500" />
                <p className="text-sm font-medium text-blue-700 dark:text-blue-400">Zaktualizowane</p>
              </div>
              <p className="text-2xl font-bold text-blue-600">{diff.updatedRows.length}</p>
            </div>
            <div className="p-4 rounded-xl bg-muted border">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-medium">Bez zmian</p>
              </div>
              <p className="text-2xl font-bold">{diff.unchangedCount}</p>
            </div>
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
              <div className="flex items-center gap-2 mb-1">
                <Trash2 className="h-4 w-4 text-red-500" />
                <p className="text-sm font-medium text-red-700 dark:text-red-400">Do usunięcia</p>
              </div>
              <p className="text-2xl font-bold text-red-600">{diff.deletedIds.length}</p>
            </div>
          </div>

          {/* Preview tables */}
          {diff.newRows.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-2 text-green-600">
                Nowe adresy (przykład pierwszych 10)
              </h3>
              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-3 py-2 text-left">Miejscowość</th>
                      <th className="px-3 py-2 text-left">Ulica</th>
                      <th className="px-3 py-2 text-left">Nr</th>
                      <th className="px-3 py-2 text-left">Technologia</th>
                      <th className="px-3 py-2 text-left">Prędkość</th>
                    </tr>
                  </thead>
                  <tbody>
                    {diff.newRows.slice(0, 10).map((row) => (
                      <tr key={row.address_id} className="border-t">
                        <td className="px-3 py-2">{row.locality}</td>
                        <td className="px-3 py-2">{row.street || "-"}</td>
                        <td className="px-3 py-2">{row.building_number}</td>
                        <td className="px-3 py-2">{row.technology}</td>
                        <td className="px-3 py-2">{row.speed_down} Mb/s</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {diff.newRows.length > 10 && (
                <p className="text-xs text-muted-foreground mt-1">
                  ...i {diff.newRows.length - 10} więcej
                </p>
              )}
            </div>
          )}

          {diff.updatedRows.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-2 text-blue-600">
                Zaktualizowane adresy (przykład pierwszych 10)
              </h3>
              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-3 py-2 text-left">Miejscowość</th>
                      <th className="px-3 py-2 text-left">Ulica</th>
                      <th className="px-3 py-2 text-left">Nr</th>
                      <th className="px-3 py-2 text-left">Technologia</th>
                      <th className="px-3 py-2 text-left">Prędkość</th>
                    </tr>
                  </thead>
                  <tbody>
                    {diff.updatedRows.slice(0, 10).map((row) => (
                      <tr key={row.address_id} className="border-t">
                        <td className="px-3 py-2">{row.locality}</td>
                        <td className="px-3 py-2">{row.street || "-"}</td>
                        <td className="px-3 py-2">{row.building_number}</td>
                        <td className="px-3 py-2">{row.technology}</td>
                        <td className="px-3 py-2">{row.speed_down} Mb/s</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {diff.updatedRows.length > 10 && (
                <p className="text-xs text-muted-foreground mt-1">
                  ...i {diff.updatedRows.length - 10} więcej
                </p>
              )}
            </div>
          )}

          {/* Delete option */}
          {diff.deletedIds.length > 0 && (
            <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={deleteRemoved}
                  onChange={(e) => setDeleteRemoved(e.target.checked)}
                  className="mt-1"
                />
                <div>
                  <p className="font-medium text-red-700 dark:text-red-400">
                    Usuń {diff.deletedIds.length} adresów których nie ma w CSV
                  </p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Adresy obecne w bazie, ale nieobecne w importowanym pliku zostaną usunięte.
                    Zaznacz tylko jeśli plik CSV zawiera pełną, aktualną listę adresów.
                  </p>
                </div>
              </label>
            </div>
          )}

          {/* Error display */}
          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <p className="font-medium text-red-700 dark:text-red-400">Błąd</p>
              </div>
              <p className="text-sm text-red-600 mt-1">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleReset}>
              Anuluj
            </Button>
            <Button onClick={handleApply} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Zapisuję...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Zastosuj zmiany
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Applying step */}
      {step === "applying" && (
        <div className="text-center py-12">
          <Loader2 className="h-12 w-12 mx-auto text-primary animate-spin mb-4" />
          <h3 className="text-lg font-semibold">Zapisuję zmiany...</h3>
          <p className="text-sm text-muted-foreground mt-1">
            To może potrwać chwilę przy dużej liczbie rekordów
          </p>
        </div>
      )}

      {/* Done step */}
      {step === "done" && result && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto rounded-full bg-green-500/10 flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Import zakończony!</h3>
          <div className="flex justify-center gap-6 mt-4 mb-6">
            {result.insertedCount > 0 && (
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{result.insertedCount}</p>
                <p className="text-sm text-muted-foreground">dodanych</p>
              </div>
            )}
            {result.updatedCount > 0 && (
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{result.updatedCount}</p>
                <p className="text-sm text-muted-foreground">zaktualizowanych</p>
              </div>
            )}
            {result.deletedCount > 0 && (
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">{result.deletedCount}</p>
                <p className="text-sm text-muted-foreground">usuniętych</p>
              </div>
            )}
          </div>
          <Button onClick={handleReset}>
            <Upload className="h-4 w-4 mr-2" />
            Importuj kolejny plik
          </Button>
        </div>
      )}
    </div>
  )
}
