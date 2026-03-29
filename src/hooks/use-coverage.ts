import { supabase } from "@/lib/supabase"
import type {
  CoverageCity,
  CoverageCheckResult,
  TechCategory,
  TVDeliveryType,
} from "@/types"

// Map database medium (column K) to frontend TechCategory
// Returns null for DOCSIS-only addresses (TV only, no internet)
function mapTechnology(medium: string): TechCategory | null {
  const m = medium.trim().toUpperCase()
  switch (m) {
    case "GPON":
      return "ftth_dom"
    case "GPON BSA":
      return "ftth_syntis"
    case "GPON BLOK":
      return "ftth_blok"
    case "DOCSIS/GPON BLOK":
      return "ftth_blok"
    case "DOCSIS":
      return null // TV DVB-C only, no internet packages
    default:
      return "ftth_dom"
  }
}

// Map database medium to TV delivery type(s)
function mapTVDeliveryTypes(medium: string): TVDeliveryType[] {
  const m = medium.trim().toUpperCase()
  switch (m) {
    case "GPON":
    case "GPON BSA":
    case "GPON BLOK":
      return ["iptv"]
    case "DOCSIS":
      return ["dvb_c"]
    case "DOCSIS/GPON BLOK":
      return ["iptv", "dvb_c"]
    default:
      return ["iptv"]
  }
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

// Get city suggestions from Supabase
export async function getCitySuggestionsFromDB(
  partial: string
): Promise<CoverageCity[]> {
  const norm = normalize(partial)
  if (norm.length < 2) return []

  const { data, error } = await supabase
    .from("coverage")
    .select("locality")
    .ilike("locality", `%${partial}%`)
    .limit(100)

  if (error || !data) return []

  // Get unique cities
  const uniqueCities = new Map<string, CoverageCity>()
  for (const row of data) {
    const name = row.locality
    const normalized = normalize(name)
    if (!uniqueCities.has(normalized)) {
      uniqueCities.set(normalized, {
        name,
        normalized,
        hasStreets: true, // Will be determined later
      })
    }
  }

  // Sort by relevance (starts with > contains)
  const results = Array.from(uniqueCities.values())
    .sort((a, b) => {
      const aStarts = a.normalized.startsWith(norm)
      const bStarts = b.normalized.startsWith(norm)
      if (aStarts && !bStarts) return -1
      if (!aStarts && bStarts) return 1
      return a.name.localeCompare(b.name, "pl")
    })
    .slice(0, 10)

  return results
}

// Check if city has streets
export async function cityHasStreetsFromDB(cityName: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("coverage")
    .select("street")
    .ilike("locality", cityName)
    .not("street", "is", null)
    .limit(1)

  if (error) return true // Assume has streets on error

  // City has streets if any address has a non-null, non-empty street
  return data?.some((row) => row.street && row.street.trim() !== "") ?? false
}

// Get street suggestions
export async function getStreetSuggestionsFromDB(
  cityName: string,
  partial: string
): Promise<string[]> {
  const { data, error } = await supabase
    .from("coverage")
    .select("street")
    .ilike("locality", cityName)
    .not("street", "is", null)

  if (error || !data) return []

  const partialNorm = normalize(partial)
  const streets = new Set<string>()

  for (const row of data) {
    if (row.street && row.street.trim() !== "") {
      const streetNorm = normalize(row.street)
      if (streetNorm.includes(partialNorm)) {
        streets.add(row.street)
      }
    }
  }

  return Array.from(streets)
    .sort((a, b) => a.localeCompare(b, "pl"))
    .slice(0, 15)
}

// Get building suggestions
export async function getBuildingSuggestionsFromDB(
  cityName: string,
  streetName: string
): Promise<string[]> {
  let query = supabase
    .from("coverage")
    .select("building_number")
    .ilike("locality", cityName)

  if (streetName && streetName.trim() !== "") {
    query = query.ilike("street", streetName)
  } else {
    query = query.or("street.is.null,street.eq.")
  }

  const { data, error } = await query

  if (error || !data) return []

  const buildings = new Set<string>()
  for (const row of data) {
    if (row.building_number) {
      buildings.add(row.building_number)
    }
  }

  return Array.from(buildings).sort((a, b) => {
    const numA = parseInt(a, 10)
    const numB = parseInt(b, 10)
    if (!isNaN(numA) && !isNaN(numB)) return numA - numB
    return a.localeCompare(b)
  })
}

// Check coverage for an address
export async function checkCoverageFromDB(
  city: string,
  street: string,
  building: string
): Promise<CoverageCheckResult> {
  let query = supabase
    .from("coverage")
    .select("*")
    .ilike("locality", city)
    .eq("building_number", building.trim())

  if (street && street.trim() !== "") {
    query = query.ilike("street", street)
  } else {
    query = query.or("street.is.null,street.eq.")
  }

  const { data, error } = await query

  if (error || !data || data.length === 0) {
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

  // Determine internet and TV availability from database rows
  let tvAvailable = false
  let internetAvailable = false
  const tvTypes = new Set<TVDeliveryType>()

  // Group technologies and speeds
  const techMap = new Map<TechCategory, { down: number; up: number }>()

  for (const row of data) {
    // Check TV availability from database column
    if (row.tv_available === true || row.tv_available === "TAK") {
      tvAvailable = true
    }

    // Collect TV delivery types from medium
    for (const dt of mapTVDeliveryTypes(row.medium || "")) {
      tvTypes.add(dt)
    }

    const tech = mapTechnology(row.medium || "")

    // DOCSIS-only = TV only, no internet technology to map
    if (tech === null) continue

    internetAvailable = true

    const existing = techMap.get(tech)
    if (!existing || row.speed_down > existing.down) {
      techMap.set(tech, {
        down: row.speed_down || 0,
        up: row.speed_up || 0,
      })
    }
  }

  const technologies = Array.from(techMap.keys())

  // Address found but no services available (shouldn't happen, but handle gracefully)
  if (!internetAvailable && !tvAvailable) {
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

  const maxSpeeds: Partial<Record<TechCategory, { down: number; up: number }>> =
    {}
  for (const tech of technologies) {
    const speeds = techMap.get(tech)
    if (speeds) {
      maxSpeeds[tech] = speeds
    }
  }

  return {
    status: "covered",
    address: { city, street, building },
    technologies,
    maxSpeeds,
    internetAvailable,
    tvAvailable,
    tvDeliveryTypes: Array.from(tvTypes),
    message: tvAvailable && internetAvailable
      ? "Twój adres jest w naszym zasięgu! Sprawdź dostępne pakiety."
      : tvAvailable
        ? "Pod Twoim adresem dostępna jest telewizja kablowa DVB-C."
        : "Pod Twoim adresem dostępny jest internet światłowodowy.",
  }
}
