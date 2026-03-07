import { useState, useCallback } from "react"
import { supabase } from "@/lib/supabase"

// Coverage row from database
export interface CoverageRow {
  id?: string
  address_id: string
  simc_code: string
  locality: string
  teryt_code: string | null
  street: string | null
  street_code: string | null
  building_number: string
  latitude: number
  longitude: number
  medium: string
  technology: string
  speed_down: number
  speed_up: number
  speed_type: string
  internet_available: boolean
  tv_available: boolean
  operator: string
}

// CSV row parsed from file
export interface CSVCoverageRow {
  address_id: string
  simc_code: string
  locality: string
  teryt_code: string
  street: string
  street_code: string
  building_number: string
  latitude: number
  longitude: number
  medium: string
  technology: string
  speed_down: number
  speed_up: number
  speed_type: string
  internet_available: boolean
  tv_available: boolean
  operator: string
}

// Diff result for preview
export interface CoverageDiff {
  newRows: CSVCoverageRow[]
  updatedRows: CSVCoverageRow[]
  unchangedCount: number
  deletedIds: string[] // address_ids that are in DB but not in CSV
}

// Parse CSV content (format from UKE/operator data)
export function parseCSVContent(content: string): CSVCoverageRow[] {
  const lines = content.split("\n").filter((line) => line.trim())
  const records: CSVCoverageRow[] = []

  for (const line of lines) {
    const parts = line.split(";")

    // Skip header (DI) and non-data rows
    if (parts[0] !== "ZS") continue

    const record: CSVCoverageRow = {
      address_id: parts[1] || "",
      simc_code: parts[2] || "",
      locality: (parts[3] || "").trim(),
      teryt_code: parts[4] || "",
      street: (parts[5] || "").trim(),
      street_code: parts[6] || "",
      building_number: (parts[7] || "").trim(),
      latitude: parseFloat(parts[8]) || 0,
      longitude: parseFloat(parts[9]) || 0,
      medium: (parts[10] || "").trim(),
      technology: (parts[11] || "").trim(),
      speed_down: parseInt(parts[12]) || 0,
      speed_up: parseInt(parts[13]) || 0,
      speed_type: parts[14] || "rzeczywisty",
      internet_available: parts[16] === "TAK",
      tv_available: parts[17] === "TAK",
      operator: parts[19] || "TVEUROSAT",
    }

    // Basic validation
    if (record.address_id && record.latitude && record.longitude) {
      records.push(record)
    }
  }

  return records
}

// Helper to fetch all records with pagination (Supabase default limit is 1000)
async function fetchAllCoverageRecords<T>(
  selectFields: string
): Promise<T[]> {
  const allRecords: T[] = []
  const pageSize = 1000
  let offset = 0
  let hasMore = true

  while (hasMore) {
    const { data, error } = await supabase
      .from("coverage")
      .select(selectFields)
      .range(offset, offset + pageSize - 1)

    if (error) {
      throw new Error(`Failed to fetch data: ${error.message}`)
    }

    if (data && data.length > 0) {
      allRecords.push(...(data as T[]))
      offset += pageSize
      hasMore = data.length === pageSize
    } else {
      hasMore = false
    }
  }

  return allRecords
}

// Compare CSV with existing database and calculate diff
export async function calculateDiff(
  csvRows: CSVCoverageRow[]
): Promise<CoverageDiff> {
  // Fetch ALL existing records from database (with pagination)
  const existingData = await fetchAllCoverageRecords<{
    address_id: string
    locality: string
    street: string | null
    building_number: string
    technology: string
    speed_down: number
    speed_up: number
    medium: string
  }>("address_id, locality, street, building_number, technology, speed_down, speed_up, medium")

  // Create map of existing records by address_id
  const existingMap = new Map<string, typeof existingData[0]>()
  for (const row of existingData || []) {
    existingMap.set(row.address_id, row)
  }

  // Create set of CSV address_ids
  const csvAddressIds = new Set(csvRows.map((r) => r.address_id))

  const newRows: CSVCoverageRow[] = []
  const updatedRows: CSVCoverageRow[] = []
  let unchangedCount = 0

  // Helper to normalize values for comparison (null, undefined, "" are all equal)
  const normalize = (val: string | number | null | undefined): string | number => {
    if (val === null || val === undefined || val === "") return ""
    return val
  }

  for (const csvRow of csvRows) {
    const existing = existingMap.get(csvRow.address_id)

    if (!existing) {
      // New address
      newRows.push(csvRow)
    } else {
      // Check if anything changed (normalize null/"" differences)
      const hasChanges =
        normalize(existing.locality) !== normalize(csvRow.locality) ||
        normalize(existing.street) !== normalize(csvRow.street) ||
        normalize(existing.building_number) !== normalize(csvRow.building_number) ||
        normalize(existing.technology) !== normalize(csvRow.technology) ||
        normalize(existing.speed_down) !== normalize(csvRow.speed_down) ||
        normalize(existing.speed_up) !== normalize(csvRow.speed_up) ||
        normalize(existing.medium) !== normalize(csvRow.medium)

      if (hasChanges) {
        updatedRows.push(csvRow)
      } else {
        unchangedCount++
      }
    }
  }

  // Find deleted (in DB but not in CSV)
  const deletedIds: string[] = []
  for (const addressId of existingMap.keys()) {
    if (!csvAddressIds.has(addressId)) {
      deletedIds.push(addressId)
    }
  }

  return {
    newRows,
    updatedRows,
    unchangedCount,
    deletedIds,
  }
}

// Apply changes to database using UPSERT (insert or update on conflict)
export async function applyChanges(
  diff: CoverageDiff,
  options: { deleteRemoved: boolean } = { deleteRemoved: false }
): Promise<{ success: boolean; insertedCount: number; updatedCount: number; deletedCount: number; error?: string }> {
  let insertedCount = 0
  let updatedCount = 0
  let deletedCount = 0

  try {
    // Combine new and updated rows - use UPSERT for all
    const allRows = [...diff.newRows, ...diff.updatedRows]

    if (allRows.length > 0) {
      const batchSize = 100
      for (let i = 0; i < allRows.length; i += batchSize) {
        const batch = allRows.slice(i, i + batchSize).map((row) => ({
          address_id: row.address_id,
          simc_code: row.simc_code,
          locality: row.locality,
          teryt_code: row.teryt_code || null,
          street: row.street || null,
          street_code: row.street_code && row.street_code !== "99999" ? row.street_code : null,
          building_number: row.building_number,
          latitude: row.latitude,
          longitude: row.longitude,
          medium: row.medium,
          technology: row.technology,
          speed_down: row.speed_down,
          speed_up: row.speed_up,
          speed_type: row.speed_type,
          internet_available: row.internet_available,
          tv_available: row.tv_available,
          operator: row.operator,
        }))

        // Use upsert with onConflict - if address_id exists, update; otherwise insert
        const { error } = await supabase
          .from("coverage")
          .upsert(batch, {
            onConflict: "address_id",
            ignoreDuplicates: false
          })

        if (error) throw new Error(`Upsert failed: ${error.message}`)
      }

      // Count based on diff classification (approximate - upsert doesn't tell us which were inserts vs updates)
      insertedCount = diff.newRows.length
      updatedCount = diff.updatedRows.length
    }

    // Delete removed rows (only if explicitly requested)
    if (options.deleteRemoved && diff.deletedIds.length > 0) {
      const batchSize = 100
      for (let i = 0; i < diff.deletedIds.length; i += batchSize) {
        const batch = diff.deletedIds.slice(i, i + batchSize)
        const { error } = await supabase
          .from("coverage")
          .delete()
          .in("address_id", batch)

        if (error) throw new Error(`Delete failed: ${error.message}`)
        deletedCount += batch.length
      }
    }

    return { success: true, insertedCount, updatedCount, deletedCount }
  } catch (err) {
    return {
      success: false,
      insertedCount,
      updatedCount,
      deletedCount,
      error: err instanceof Error ? err.message : "Unknown error",
    }
  }
}

// Hook for coverage import operations
export function useCoverageImport() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const parseCSV = useCallback((content: string) => {
    try {
      return parseCSVContent(content)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to parse CSV")
      return []
    }
  }, [])

  const getDiff = useCallback(async (csvRows: CSVCoverageRow[]) => {
    setLoading(true)
    setError(null)
    try {
      const diff = await calculateDiff(csvRows)
      return diff
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to calculate diff")
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const apply = useCallback(
    async (diff: CoverageDiff, options?: { deleteRemoved: boolean }) => {
      setLoading(true)
      setError(null)
      try {
        const result = await applyChanges(diff, options)
        if (!result.success) {
          setError(result.error || "Unknown error")
        }
        return result
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to apply changes")
        return { success: false, insertedCount: 0, updatedCount: 0, deletedCount: 0 }
      } finally {
        setLoading(false)
      }
    },
    []
  )

  return { parseCSV, getDiff, apply, loading, error }
}

// Get coverage statistics
export async function getCoverageStats() {
  try {
    // Fetch ALL records with pagination
    const data = await fetchAllCoverageRecords<{
      technology: string
      locality: string
    }>("technology, locality")

    const technologies: Record<string, number> = {}
    const localities = new Set<string>()

    for (const row of data) {
      technologies[row.technology] = (technologies[row.technology] || 0) + 1
      localities.add(row.locality)
    }

    return {
      totalAddresses: data.length,
      localities: localities.size,
      technologies,
    }
  } catch (error) {
    console.error("Failed to get coverage stats:", error)
    return null
  }
}
