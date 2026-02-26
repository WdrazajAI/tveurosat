import type { CoverageArea, CoverageResult } from "@/types"

// Placeholder coverage data — will be replaced with real Excel data from client
export const coverageAreas: CoverageArea[] = [
  {
    id: "malkinia-lesna-5",
    city: "Małkinia Górna",
    cityNormalized: "malkinia gorna",
    street: "Leśna",
    streetNormalized: "lesna",
    specificBuildings: ["5"],
    technology: "dvbt_iptv",
    zone: "A",
    availableSpeedTiers: ["100", "300", "600", "1000"],
  },
  {
    id: "malkinia-lesna",
    city: "Małkinia Górna",
    cityNormalized: "malkinia gorna",
    street: "Leśna",
    streetNormalized: "lesna",
    buildingRange: { from: 1, to: 30 },
    technology: "iptv",
    zone: "A",
    availableSpeedTiers: ["100", "300", "600", "1000"],
  },
  {
    id: "malkinia-glowna",
    city: "Małkinia Górna",
    cityNormalized: "malkinia gorna",
    street: "Główna",
    streetNormalized: "glowna",
    buildingRange: { from: 1, to: 50 },
    technology: "iptv",
    zone: "A",
    availableSpeedTiers: ["100", "300", "600", "1000"],
  },
  {
    id: "malkinia-bieganska",
    city: "Małkinia Górna",
    cityNormalized: "malkinia gorna",
    street: "Biegańskiego",
    streetNormalized: "bieganskiego",
    buildingRange: { from: 1, to: 40 },
    technology: "iptv",
    zone: "A",
    availableSpeedTiers: ["100", "300", "600"],
  },
  {
    id: "malkinia-nurska",
    city: "Małkinia Górna",
    cityNormalized: "malkinia gorna",
    street: "Nurska",
    streetNormalized: "nurska",
    buildingRange: { from: 1, to: 60 },
    technology: "iptv",
    zone: "B",
    availableSpeedTiers: ["100", "300", "600"],
  },
  {
    id: "malkinia-ostrowska",
    city: "Małkinia Górna",
    cityNormalized: "malkinia gorna",
    street: "Ostrowska",
    streetNormalized: "ostrowska",
    buildingRange: { from: 1, to: 45 },
    technology: "iptv",
    zone: "B",
    availableSpeedTiers: ["100", "300"],
  },
  {
    id: "malkinia-koscielna",
    city: "Małkinia Górna",
    cityNormalized: "malkinia gorna",
    street: "Kościelna",
    streetNormalized: "koscielna",
    buildingRange: { from: 1, to: 25 },
    technology: "iptv",
    zone: "A",
    availableSpeedTiers: ["100", "300", "600", "1000"],
  },
  {
    id: "malkinia-3maja",
    city: "Małkinia Górna",
    cityNormalized: "malkinia gorna",
    street: "3 Maja",
    streetNormalized: "3 maja",
    buildingRange: { from: 1, to: 35 },
    technology: "iptv",
    zone: "A",
    availableSpeedTiers: ["100", "300", "600"],
  },
  {
    id: "prostynia-centrum",
    city: "Prostyń",
    cityNormalized: "prostyn",
    street: "Centralna",
    streetNormalized: "centralna",
    buildingRange: { from: 1, to: 20 },
    technology: "iptv",
    zone: "C",
    availableSpeedTiers: ["100", "300"],
  },
  {
    id: "kietlanka-wiejska",
    city: "Kiełczew",
    cityNormalized: "kielczew",
    street: "Wiejska",
    streetNormalized: "wiejska",
    buildingRange: { from: 1, to: 15 },
    technology: "iptv",
    zone: "C",
    availableSpeedTiers: ["100", "300"],
  },
]

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

function matchesBuilding(area: CoverageArea, building: string): boolean {
  const num = parseInt(building, 10)
  if (isNaN(num)) return false

  if (area.specificBuildings?.includes(building)) return true
  if (area.buildingRange) {
    return num >= area.buildingRange.from && num <= area.buildingRange.to
  }
  return true
}

export function checkCoverage(
  city: string,
  street: string,
  building: string
): CoverageResult {
  const normalizedCity = normalize(city)
  const normalizedStreet = normalize(street)

  // Special case: Leśna 5 — check first for DVB-T + IPTV
  const lesna5Match = coverageAreas.find(
    (a) =>
      a.id === "malkinia-lesna-5" &&
      normalizedCity.includes(a.cityNormalized) &&
      normalizedStreet.includes(a.streetNormalized) &&
      a.specificBuildings?.includes(building.trim())
  )
  if (lesna5Match) {
    return {
      covered: true,
      area: lesna5Match,
      technology: "dvbt_iptv",
      message:
        "Twój adres jest w naszym zasięgu! Dostępna telewizja DVB-T oraz IPTV.",
    }
  }

  // General search
  const match = coverageAreas.find(
    (a) =>
      a.id !== "malkinia-lesna-5" &&
      normalizedCity.includes(a.cityNormalized) &&
      normalizedStreet.includes(a.streetNormalized) &&
      matchesBuilding(a, building.trim())
  )

  if (match) {
    return {
      covered: true,
      area: match,
      technology: match.technology,
      message: "Twój adres jest w naszym zasięgu! Sprawdź dostępne pakiety.",
    }
  }

  return {
    covered: false,
    message:
      "Niestety, Twój adres nie jest jeszcze w naszym zasięgu. Zostaw dane kontaktowe — powiadomimy Cię, gdy rozszerzymy sieć w Twojej okolicy.",
  }
}

export function getStreetSuggestions(
  city: string,
  partial: string
): string[] {
  const normalizedCity = normalize(city)
  const normalizedPartial = normalize(partial)

  const streets = new Set<string>()
  coverageAreas
    .filter((a) => normalizedCity.includes(a.cityNormalized))
    .filter((a) => a.streetNormalized.includes(normalizedPartial))
    .forEach((a) => streets.add(a.street))

  return Array.from(streets)
}

export function getCitySuggestions(partial: string): string[] {
  const normalizedPartial = normalize(partial)
  const cities = new Set<string>()
  coverageAreas
    .filter((a) => a.cityNormalized.includes(normalizedPartial))
    .forEach((a) => cities.add(a.city))
  return Array.from(cities)
}
