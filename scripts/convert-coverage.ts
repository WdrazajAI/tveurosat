/**
 * CSV → JSON conversion script for TV Eurosat coverage data
 *
 * Reads Lista.csv (TERYT address database from UKE) and generates
 * an optimized JSON file for the frontend address lookup.
 *
 * Usage: npx tsx scripts/convert-coverage.ts [path-to-csv]
 * Default CSV path: /Users/rafalmarks/Downloads/Lista.csv
 */

import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// --- Types ---

type TechCategory = "gpon" | "bsa" | "docsis" | "radio"

interface AddressTech {
  t: TechCategory
  d: number // maxDown Mbps
}

interface CoverageAddress {
  s: string // street display name (without "ul."/"pl." prefix)
  sn: string // street normalized
  b: string // building number
  techs: AddressTech[]
}

interface CoverageCity {
  name: string
  normalized: string
  hasStreets: boolean
}

interface CoverageDatabase {
  version: string
  generatedAt: string
  stats: {
    totalAddresses: number
    cities: number
    technologies: Record<string, number>
    radioOnly: number
  }
  cities: CoverageCity[]
  addresses: Record<string, CoverageAddress[]>
}

// --- Helpers ---

function normalize(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/ą/g, "a")
    .replace(/ć/g, "c")
    .replace(/ę/g, "e")
    .replace(/ł/g, "l")
    .replace(/ń/g, "n")
    .replace(/ó/g, "o")
    .replace(/ś/g, "s")
    .replace(/ź/g, "z")
    .replace(/ż/g, "z")
}

function stripStreetPrefix(street: string): string {
  return street
    .replace(/^ul\.\s*/i, "")
    .replace(/^pl\.\s*/i, "")
    .replace(/^al\.\s*/i, "")
    .replace(/^os\.\s*/i, "")
    .trim()
}

function classifyTechnology(
  techType: string,
  techDetail: string,
  ownInfra: string
): TechCategory {
  if (
    techType.includes("kablowe") ||
    techDetail.includes("DOCSIS")
  ) {
    return "docsis"
  }
  if (
    techType.includes("radiowe") ||
    techDetail === "inna"
  ) {
    return "radio"
  }
  // Fiber (GPON or 10GE)
  if (ownInfra === "TAK") {
    return "gpon"
  }
  return "bsa"
}

// --- Main ---

function main() {
  const csvPath =
    process.argv[2] || "/Users/rafalmarks/Downloads/Lista.csv"
  const outputPath = path.resolve(
    __dirname,
    "../public/data/coverage.json"
  )

  console.log(`Reading CSV from: ${csvPath}`)
  const raw = fs.readFileSync(csvPath, "utf-8")
  const lines = raw.split("\n").filter((l) => l.trim().length > 0)

  console.log(`Total lines: ${lines.length}`)

  // Parse CSV rows (skip header line which starts with "DI")
  const addressMap = new Map<
    string,
    { city: string; street: string; building: string; techs: AddressTech[] }
  >()
  const citySet = new Map<string, { name: string; hasStreets: boolean }>()

  let skipped = 0
  let processed = 0

  for (const line of lines) {
    const cols = line.split(";")

    // Skip header rows (type "DI")
    if (cols[0] !== "ZS") {
      skipped++
      continue
    }

    if (cols.length < 18) {
      skipped++
      continue
    }

    const city = cols[3]?.trim() || ""
    const streetRaw = cols[5]?.trim() || ""
    const building = cols[7]?.trim() || ""
    const techType = cols[10]?.trim() || ""
    const techDetail = cols[11]?.trim() || ""
    const maxDown = parseInt(cols[12]?.trim() || "0", 10)
    const ownInfra = cols[17]?.trim() || ""

    if (!city || !building) {
      skipped++
      continue
    }

    const tech = classifyTechnology(techType, techDetail, ownInfra)
    const streetDisplay = stripStreetPrefix(streetRaw)
    const streetNorm = normalize(streetDisplay)
    const cityNorm = normalize(city)

    // Track city info
    const existing = citySet.get(cityNorm)
    if (!existing) {
      citySet.set(cityNorm, { name: city, hasStreets: streetRaw.length > 0 })
    } else if (streetRaw.length > 0) {
      existing.hasStreets = true
    }

    // Unique address key: city + street + building (all normalized)
    const key = `${cityNorm}|${streetNorm}|${building}`

    const addr = addressMap.get(key)
    if (addr) {
      // Check if this tech is already present
      const hasTech = addr.techs.some(
        (t) => t.t === tech && t.d === maxDown
      )
      if (!hasTech) {
        addr.techs.push({ t: tech, d: maxDown })
      }
    } else {
      addressMap.set(key, {
        city: cityNorm,
        street: streetDisplay,
        building,
        techs: [{ t: tech, d: maxDown }],
      })
    }

    processed++
  }

  console.log(`Processed: ${processed}, Skipped: ${skipped}`)

  // Build output structure
  const addressesByCity = new Map<string, CoverageAddress[]>()

  for (const [, addr] of addressMap) {
    const list = addressesByCity.get(addr.city) || []
    list.push({
      s: addr.street,
      sn: normalize(addr.street),
      b: addr.building,
      techs: addr.techs,
    })
    addressesByCity.set(addr.city, list)
  }

  // Sort addresses within each city by street then building number
  for (const [, addrs] of addressesByCity) {
    addrs.sort((a, b) => {
      if (a.s !== b.s) return a.s.localeCompare(b.s, "pl")
      const numA = parseInt(a.b, 10)
      const numB = parseInt(b.b, 10)
      if (!isNaN(numA) && !isNaN(numB)) return numA - numB
      return a.b.localeCompare(b.b)
    })
  }

  // Build cities list sorted alphabetically
  const cities: CoverageCity[] = Array.from(citySet.entries())
    .map(([normalized, info]) => ({
      name: info.name,
      normalized,
      hasStreets: info.hasStreets,
    }))
    .sort((a, b) => a.name.localeCompare(b.name, "pl"))

  // Stats
  const techCounts: Record<string, number> = {}
  let radioOnly = 0
  for (const [, addr] of addressMap) {
    for (const t of addr.techs) {
      techCounts[t.t] = (techCounts[t.t] || 0) + 1
    }
    const nonRadio = addr.techs.filter((t) => t.t !== "radio")
    if (nonRadio.length === 0 && addr.techs.some((t) => t.t === "radio")) {
      radioOnly++
    }
  }

  const db: CoverageDatabase = {
    version: new Date().toISOString().split("T")[0],
    generatedAt: new Date().toISOString(),
    stats: {
      totalAddresses: addressMap.size,
      cities: cities.length,
      technologies: techCounts,
      radioOnly,
    },
    cities,
    addresses: Object.fromEntries(addressesByCity),
  }

  // Write output
  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  fs.writeFileSync(outputPath, JSON.stringify(db), "utf-8")

  const fileSizeKB = (fs.statSync(outputPath).size / 1024).toFixed(1)

  console.log(`\n=== Conversion Report ===`)
  console.log(`Output: ${outputPath}`)
  console.log(`File size: ${fileSizeKB} KB`)
  console.log(`Unique addresses: ${addressMap.size}`)
  console.log(`Cities/villages: ${cities.length}`)
  console.log(`Technology breakdown:`)
  for (const [tech, count] of Object.entries(techCounts).sort(
    (a, b) => b[1] - a[1]
  )) {
    console.log(`  ${tech}: ${count}`)
  }
  console.log(`Radio-only addresses: ${radioOnly}`)
  console.log(
    `Villages without streets: ${cities.filter((c) => !c.hasStreets).length}`
  )
  console.log(`========================\n`)
}

main()
