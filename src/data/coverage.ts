import type {
  CoverageDatabase,
  CoverageCity,
  CoverageCheckResult,
  TechCategory,
} from "@/types"

let db: CoverageDatabase | null = null
let loadingPromise: Promise<CoverageDatabase> | null = null

export async function loadCoverageData(): Promise<CoverageDatabase> {
  if (db) return db
  if (loadingPromise) return loadingPromise

  loadingPromise = fetch("/data/coverage.json")
    .then((res) => {
      if (!res.ok)
        throw new Error(`Failed to load coverage data: ${res.status}`)
      return res.json() as Promise<CoverageDatabase>
    })
    .then((data) => {
      db = data
      return data
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

export async function getCitySuggestions(
  partial: string
): Promise<CoverageCity[]> {
  const data = await loadCoverageData()
  const norm = normalize(partial)
  if (norm.length < 2) return []

  return data.cities
    .filter((c) => c.normalized.includes(norm))
    .slice(0, 10)
}

export async function cityHasStreets(cityName: string): Promise<boolean> {
  const data = await loadCoverageData()
  const norm = normalize(cityName)
  const city = data.cities.find((c) => c.normalized === norm)
  return city?.hasStreets ?? false
}

export async function getStreetSuggestions(
  cityName: string,
  partial: string
): Promise<string[]> {
  const data = await loadCoverageData()
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
  const data = await loadCoverageData()
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
  const data = await loadCoverageData()
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
      message:
        "Niestety, Twój adres nie jest jeszcze w naszym zasięgu. Zostaw dane kontaktowe — powiadomimy Cię, gdy rozszerzymy sieć w Twojej okolicy.",
    }
  }

  const nonRadioTechs = match.techs.filter((t) => t.t !== "radio")
  const hasRadioOnly =
    nonRadioTechs.length === 0 &&
    match.techs.some((t) => t.t === "radio")

  if (hasRadioOnly) {
    return {
      status: "radio_only",
      address: { city, street, building },
      technologies: [],
      maxSpeeds: {},
      message:
        "Pod Twoim adresem dostępna jest jedynie technologia radiowa, która jest wycofywana. Skontaktuj się z nami, aby omówić dostępne opcje.",
    }
  }

  const techCategories = [
    ...new Set(nonRadioTechs.map((t) => t.t)),
  ] as TechCategory[]

  const maxSpeeds: Partial<Record<TechCategory, { down: number; up: number }>> = {}
  for (const tech of nonRadioTechs) {
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
    message: "Twój adres jest w naszym zasięgu! Sprawdź dostępne pakiety.",
  }
}
