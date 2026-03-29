import type {
  CoverageDatabase,
  CoverageCity,
  CoverageCheckResult,
  TechCategory,
} from "@/types"
import {
  getCitySuggestionsFromDB,
  cityHasStreetsFromDB,
  getStreetSuggestionsFromDB,
  getBuildingSuggestionsFromDB,
  checkCoverageFromDB,
} from "@/hooks/use-coverage"

// === Fallback: Static JSON data ===
let db: CoverageDatabase | null = null
let loadingPromise: Promise<CoverageDatabase | null> | null = null
let jsonLoadFailed = false

async function loadCoverageData(): Promise<CoverageDatabase | null> {
  if (jsonLoadFailed) return null
  if (db) return db
  if (loadingPromise) return loadingPromise

  loadingPromise = fetch("/data/coverage.json")
    .then((res) => {
      if (!res.ok) {
        jsonLoadFailed = true
        return null
      }
      return res.json() as Promise<CoverageDatabase>
    })
    .then((data) => {
      db = data
      return data
    })
    .catch(() => {
      jsonLoadFailed = true
      return null
    })

  return loadingPromise
}

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

// === Primary: Supabase with fallback to static JSON ===

export async function getCitySuggestions(
  partial: string
): Promise<CoverageCity[]> {
  // Try Supabase first
  try {
    const results = await getCitySuggestionsFromDB(partial)
    if (results.length > 0) return results
  } catch (e) {
    console.warn("Supabase coverage lookup failed, trying fallback:", e)
  }

  // Fallback to static JSON
  const data = await loadCoverageData()
  if (!data) return []

  const norm = normalize(partial)
  if (norm.length < 2) return []

  return data.cities
    .filter((c) => c.normalized.includes(norm))
    .slice(0, 10)
}

export async function cityHasStreets(cityName: string): Promise<boolean> {
  // Try Supabase first
  try {
    return await cityHasStreetsFromDB(cityName)
  } catch (e) {
    console.warn("Supabase cityHasStreets failed, trying fallback:", e)
  }

  // Fallback to static JSON
  const data = await loadCoverageData()
  if (!data) return true

  const norm = normalize(cityName)
  const city = data.cities.find((c) => c.normalized === norm)
  return city?.hasStreets ?? false
}

export async function getStreetSuggestions(
  cityName: string,
  partial: string
): Promise<string[]> {
  // Try Supabase first
  try {
    const results = await getStreetSuggestionsFromDB(cityName, partial)
    if (results.length > 0) return results
  } catch (e) {
    console.warn("Supabase street suggestions failed, trying fallback:", e)
  }

  // Fallback to static JSON
  const data = await loadCoverageData()
  if (!data) return []

  const cityNorm = normalize(cityName)
  const addresses = data.addresses[cityNorm] || []
  const partialNorm = normalize(partial)

  const streets = new Set<string>()
  for (const addr of addresses) {
    if (addr.s && addr.sn.includes(partialNorm)) {
      streets.add(addr.s)
    }
  }
  return Array.from(streets).sort((a, b) => a.localeCompare(b, "pl")).slice(0, 15)
}

export async function getBuildingSuggestions(
  cityName: string,
  streetName: string
): Promise<string[]> {
  // Try Supabase first
  try {
    const results = await getBuildingSuggestionsFromDB(cityName, streetName)
    if (results.length > 0) return results
  } catch (e) {
    console.warn("Supabase building suggestions failed, trying fallback:", e)
  }

  // Fallback to static JSON
  const data = await loadCoverageData()
  if (!data) return []

  const cityNorm = normalize(cityName)
  const streetNorm = normalize(streetName)
  const addresses = data.addresses[cityNorm] || []

  const buildings = new Set<string>()
  for (const addr of addresses) {
    const streetMatch = streetName
      ? addr.sn === streetNorm
      : addr.s === ""
    if (streetMatch) {
      buildings.add(addr.b)
    }
  }

  return Array.from(buildings).sort((a, b) => {
    const numA = parseInt(a, 10)
    const numB = parseInt(b, 10)
    if (!isNaN(numA) && !isNaN(numB)) return numA - numB
    return a.localeCompare(b)
  })
}

export async function checkCoverage(
  city: string,
  street: string,
  building: string
): Promise<CoverageCheckResult> {
  // Try Supabase first
  try {
    const result = await checkCoverageFromDB(city, street, building)
    // Only use Supabase result if it's a match or if we trust it
    if (result.status === "covered") {
      return result
    }
  } catch (e) {
    console.warn("Supabase checkCoverage failed, trying fallback:", e)
  }

  // Fallback to static JSON
  const data = await loadCoverageData()
  if (!data) {
    // No fallback available - return not covered from Supabase result
    return {
      status: "not_covered",
      address: { city, street, building },
      technologies: [],
      maxSpeeds: {},
      internetAvailable: false,
      tvAvailable: false,
      tvDeliveryTypes: [],
      message:
        "Niestety, Twój adres nie jest jeszcze w naszym zasięgu. Zostaw dane kontaktowe — powiadomimy Cię, gdy rozszerzymy sieć w Twojej okolicy.",
    }
  }

  const cityNorm = normalize(city)
  const streetNorm = normalize(street)
  const buildingTrimmed = building.trim()

  const addresses = data.addresses[cityNorm] || []

  const match = addresses.find((addr) => {
    const streetMatch = street
      ? addr.sn === streetNorm
      : addr.s === ""
    return streetMatch && addr.b === buildingTrimmed
  })

  if (!match) {
    return {
      status: "not_covered",
      address: { city, street, building },
      technologies: [],
      maxSpeeds: {},
      internetAvailable: false,
      tvAvailable: false,
      tvDeliveryTypes: [],
      message:
        "Niestety, Twój adres nie jest jeszcze w naszym zasięgu. Zostaw dane kontaktowe — powiadomimy Cię, gdy rozszerzymy sieć w Twojej okolicy.",
    }
  }

  const techCategories = [
    ...new Set(match.techs.map((t) => t.t)),
  ] as TechCategory[]

  if (techCategories.length === 0) {
    return {
      status: "not_covered",
      address: { city, street, building },
      technologies: [],
      maxSpeeds: {},
      internetAvailable: false,
      tvAvailable: false,
      tvDeliveryTypes: [],
      message:
        "Niestety, Twój adres nie jest jeszcze w naszym zasięgu. Zostaw dane kontaktowe — powiadomimy Cię, gdy rozszerzymy sieć w Twojej okolicy.",
    }
  }

  const maxSpeeds: Partial<Record<TechCategory, { down: number; up: number }>> = {}
  for (const tech of match.techs) {
    const existing = maxSpeeds[tech.t]
    if (!existing || tech.d > existing.down) {
      maxSpeeds[tech.t] = { down: tech.d, up: tech.d }
    }
  }

  return {
    status: "covered",
    address: { city, street, building },
    technologies: techCategories,
    maxSpeeds,
    internetAvailable: true,
    tvAvailable: true,
    tvDeliveryTypes: ["iptv"],
    message: "Twój adres jest w naszym zasięgu! Sprawdź dostępne pakiety.",
  }
}
