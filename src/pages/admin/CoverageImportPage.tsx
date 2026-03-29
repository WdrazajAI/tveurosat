import { useState, useCallback } from "react"
import { Upload, FileText, AlertTriangle, CheckCircle, Plus, RefreshCw, Loader2, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  useCoverageImport,
  getCoverageStats,
  type CoverageDiff,
  type CSVCoverageRow,
  type UpdatedRow,
} from "@/hooks/use-coverage-admin"

type ImportStep = "upload" | "preview" | "applying" | "done"

// All columns to display in preview tables
const ALL_COLUMNS: { key: keyof CSVCoverageRow; label: string }[] = [
  { key: "address_id", label: "ID adresu" },
  { key: "simc_code", label: "SIMC" },
  { key: "locality", label: "Miejscowość" },
  { key: "teryt_code", label: "TERYT" },
  { key: "street", label: "Ulica" },
  { key: "street_code", label: "Kod ulicy" },
  { key: "building_number", label: "Nr budynku" },
  { key: "latitude", label: "Szer. geo." },
  { key: "longitude", label: "Dł. geo." },
  { key: "medium", label: "Medium" },
  { key: "technology", label: "Technologia" },
  { key: "speed_down", label: "Download" },
  { key: "speed_up", label: "Upload" },
  { key: "speed_type", label: "Typ prędkości" },
  { key: "internet_available", label: "Internet" },
  { key: "tv_available", label: "TV" },
  { key: "operator", label: "Operator" },
]

function formatCellValue(value: string | number | boolean): string {
  if (typeof value === "boolean") return value ? "TAK" : "NIE"
  if (value === null || value === undefined || value === "") return "-"
  return String(value)
}

const PAGE_SIZE = 10
const LOAD_MORE_SIZE = 50

// CP1250 single-byte to Unicode mapping for Polish characters
const CP1250_MAP: Record<number, string> = {
  0x8C: "Ś", 0x8F: "Ź", 0x9C: "ś", 0x9F: "ź",
  0xA3: "Ł", 0xA5: "Ą", 0xAF: "Ż", 0xB3: "ł",
  0xB9: "ą", 0xBF: "ż", 0xC6: "Ć", 0xCA: "Ę",
  0xD1: "Ń", 0xD3: "Ó", 0xE6: "ć", 0xEA: "ę",
  0xF1: "ń", 0xF3: "ó",
}

// Decode a file that has MIXED encoding (some chars UTF-8, some CP1250).
// This is common in Polish telecom CSV exports where capital letters (Ł, Ż, Ś)
// are UTF-8 encoded (2 bytes) but lowercase (ł, ę, ó, ń) are CP1250 (1 byte).
async function detectAndReadFile(file: File): Promise<string> {
  const buffer = await file.arrayBuffer()
  const bytes = new Uint8Array(buffer)

  // First: try pure UTF-8
  const utf8 = new TextDecoder("utf-8", { fatal: true })
  try {
    const result = utf8.decode(bytes)
    // Pure UTF-8 worked — use it
    return result
  } catch {
    // UTF-8 failed — file has non-UTF-8 bytes
  }

  // Hybrid decode: process byte-by-byte, try UTF-8 sequences first,
  // fall back to CP1250 for single bytes in 0x80-0xFF range
  let result = ""
  let i = 0
  while (i < bytes.length) {
    const b = bytes[i]

    // ASCII range — pass through
    if (b < 0x80) {
      result += String.fromCharCode(b)
      i++
      continue
    }

    // Try to decode as UTF-8 multi-byte sequence
    let seqLen = 0
    if ((b & 0xE0) === 0xC0) seqLen = 2      // 110xxxxx = 2-byte
    else if ((b & 0xF0) === 0xE0) seqLen = 3  // 1110xxxx = 3-byte
    else if ((b & 0xF8) === 0xF0) seqLen = 4  // 11110xxx = 4-byte

    if (seqLen > 0 && i + seqLen <= bytes.length) {
      // Check if all continuation bytes are valid (10xxxxxx)
      let validUtf8 = true
      for (let j = 1; j < seqLen; j++) {
        if ((bytes[i + j] & 0xC0) !== 0x80) {
          validUtf8 = false
          break
        }
      }

      if (validUtf8) {
        // Valid UTF-8 sequence — decode it
        const slice = bytes.slice(i, i + seqLen)
        try {
          result += new TextDecoder("utf-8", { fatal: true }).decode(slice)
          i += seqLen
          continue
        } catch {
          // Fall through to CP1250
        }
      }
    }

    // Not valid UTF-8 — decode as CP1250
    if (CP1250_MAP[b]) {
      result += CP1250_MAP[b]
    } else if (b >= 0xA0 && b <= 0xFF) {
      // Latin-1 compatible range
      result += String.fromCharCode(b)
    } else {
      result += "?"
    }
    i++
  }

  return result
}

export default function CoverageImportPage() {
  const [step, setStep] = useState<ImportStep>("upload")
  const [diff, setDiff] = useState<CoverageDiff | null>(null)
  const [result, setResult] = useState<{
    insertedCount: number
    updatedCount: number
  } | null>(null)
  const [stats, setStats] = useState<{
    totalAddresses: number
    localities: number
    technologies: Record<string, number>
  } | null>(null)

  const [newRowsVisible, setNewRowsVisible] = useState(PAGE_SIZE)
  const [updatedRowsVisible, setUpdatedRowsVisible] = useState(PAGE_SIZE)

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

      const content = await detectAndReadFile(file)
      const rows = parseCSV(content)

      if (rows.length === 0) {
        alert("Nie znaleziono poprawnych rekordow w pliku CSV")
        return
      }

      const diffResult = await getDiff(rows)
      if (diffResult) {
        setDiff(diffResult)
        setNewRowsVisible(PAGE_SIZE)
        setUpdatedRowsVisible(PAGE_SIZE)
        setStep("preview")
      }
    },
    [parseCSV, getDiff]
  )

  const handleApply = useCallback(async () => {
    if (!diff) return

    setStep("applying")
    const applyResult = await apply(diff)

    if (applyResult.success) {
      setResult({
        insertedCount: applyResult.insertedCount,
        updatedCount: applyResult.updatedCount,
      })
      setStep("done")
      loadStats()
    } else {
      setStep("preview")
    }
  }, [diff, apply, loadStats])

  const handleReset = useCallback(() => {
    setStep("upload")
    setDiff(null)
    setResult(null)
    setNewRowsVisible(PAGE_SIZE)
    setUpdatedRowsVisible(PAGE_SIZE)
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
            <p className="text-sm text-muted-foreground">Oferty (kolumna K)</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {Object.entries(stats.technologies).map(([medium, count]) => (
                <span
                  key={medium}
                  className="text-xs px-2 py-0.5 bg-muted rounded-full"
                >
                  {medium}: {count}
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
              <li>• Kodowanie: UTF-8, Windows-1250, ISO-8859-2 (auto-detekcja)</li>
            </ul>
          </div>
        </div>
      )}

      {/* Preview step */}
      {step === "preview" && diff && (
        <div className="space-y-6">
          {/* Summary cards - 3 columns */}
          <div className="grid grid-cols-3 gap-4">
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
          </div>

          {/* New rows table */}
          {diff.newRows.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-2 text-green-600">
                Nowe adresy
              </h3>
              <PreviewTable
                rows={diff.newRows.slice(0, newRowsVisible)}
                type="new"
              />
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-muted-foreground">
                  Wyświetlono {Math.min(newRowsVisible, diff.newRows.length)} z {diff.newRows.length}
                </p>
                {newRowsVisible < diff.newRows.length && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setNewRowsVisible((v) => v + LOAD_MORE_SIZE)}
                  >
                    <ChevronDown className="h-4 w-4 mr-1" />
                    Pokaż więcej
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Updated rows table */}
          {diff.updatedRows.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-2 text-blue-600">
                Zaktualizowane adresy
              </h3>
              <PreviewTable
                updatedRows={diff.updatedRows.slice(0, updatedRowsVisible)}
                type="updated"
              />
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-muted-foreground">
                  Wyświetlono {Math.min(updatedRowsVisible, diff.updatedRows.length)} z {diff.updatedRows.length}
                </p>
                {updatedRowsVisible < diff.updatedRows.length && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setUpdatedRowsVisible((v) => v + LOAD_MORE_SIZE)}
                  >
                    <ChevronDown className="h-4 w-4 mr-1" />
                    Pokaż więcej
                  </Button>
                )}
              </div>
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

// Reusable preview table component with all columns and horizontal scroll
function PreviewTable({
  rows,
  updatedRows,
  type,
}: {
  rows?: CSVCoverageRow[]
  updatedRows?: UpdatedRow[]
  type: "new" | "updated"
}) {
  const displayRows = type === "new"
    ? (rows || []).map((row) => ({ row, changedFields: [] as string[] }))
    : (updatedRows || [])

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="min-w-max text-sm">
        <thead className="bg-muted">
          <tr>
            {ALL_COLUMNS.map((col) => (
              <th key={col.key} className="px-3 py-2 text-left whitespace-nowrap font-medium">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {displayRows.map(({ row, changedFields }) => (
            <tr
              key={row.address_id}
              className={
                type === "new"
                  ? "border-t bg-green-50 dark:bg-green-950/20"
                  : "border-t"
              }
            >
              {ALL_COLUMNS.map((col) => {
                const isChanged = type === "updated" && changedFields.includes(col.key)
                return (
                  <td
                    key={col.key}
                    className={`px-3 py-2 whitespace-nowrap ${
                      isChanged ? "bg-blue-100 dark:bg-blue-950/40 font-medium text-blue-700 dark:text-blue-300" : ""
                    }`}
                  >
                    {formatCellValue(row[col.key])}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
