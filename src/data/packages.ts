import type {
  InternetPackage,
  TVPackage,
  TechCategory,
  PricingOption,
} from "@/types"

// Pricing helper — placeholder prices, Bartek will update later
function pricing(
  monthly24: number,
  monthly12: number,
  monthlyIndef: number,
  activation24 = 0,
  activation12 = 1,
  activationIndef = 49,
  install24 = 0,
  install12 = 0,
  installIndef = 99
): PricingOption[] {
  return [
    {
      period: "24m",
      periodLabel: "Umowa 24 mies.",
      monthlyPrice: monthly24,
      activationFee: activation24,
      installationFee: install24,
    },
    {
      period: "12m",
      periodLabel: "Umowa 12 mies.",
      monthlyPrice: monthly12,
      activationFee: activation12,
      installationFee: install12,
    },
    {
      period: "indefinite",
      periodLabel: "Bez umowy",
      monthlyPrice: monthlyIndef,
      activationFee: activationIndef,
      installationFee: installIndef,
    },
  ]
}

// === GPON (own infrastructure) ===
export const gponPackages: InternetPackage[] = [
  {
    id: "gpon-100",
    name: "Start",
    technology: "gpon",
    tagline: "Idealny na start — przeglądanie, social media, streaming",
    speedDown: 100,
    speedUp: 30,
    features: [
      "Prędkość do 100 Mb/s",
      "Router Wi-Fi w cenie",
      "Bez limitu danych",
      "Wsparcie techniczne 24/7",
    ],
    pricing: pricing(59, 69, 79),
    featured: false,
    order: 1,
  },
  {
    id: "gpon-300",
    name: "Standard",
    technology: "gpon",
    tagline: "Dla rodziny — streaming 4K, praca zdalna, gry online",
    speedDown: 300,
    speedUp: 50,
    features: [
      "Prędkość do 300 Mb/s",
      "Router Wi-Fi 6 w cenie",
      "Bez limitu danych",
      "Priorytetowe wsparcie techniczne",
      "Streaming 4K bez buforowania",
    ],
    pricing: pricing(89, 99, 109),
    featured: true,
    order: 2,
  },
  {
    id: "gpon-600",
    name: "Premium",
    technology: "gpon",
    tagline: "Dla wymagających — granie, telepraca, wiele urządzeń",
    speedDown: 600,
    speedUp: 100,
    features: [
      "Prędkość do 600 Mb/s",
      "Router Wi-Fi 6 w cenie",
      "Bez limitu danych",
      "Priorytetowe wsparcie VIP",
      "Symetryczny upload",
    ],
    pricing: pricing(119, 129, 139),
    featured: false,
    order: 3,
  },
  {
    id: "gpon-1000",
    name: "Ultra",
    technology: "gpon",
    tagline: "Maksimum mocy — bez kompromisów",
    speedDown: 1000,
    speedUp: 500,
    features: [
      "Prędkość do 1 Gb/s",
      "Router Wi-Fi 6E w cenie",
      "Bez limitu danych",
      "Dedykowany opiekun klienta",
      "Symetryczny upload 500 Mb/s",
      "Gwarancja najniższego pingu",
    ],
    pricing: pricing(149, 159, 179),
    featured: false,
    order: 4,
  },
]

// === BSA (via Orange) ===
export const bsaPackages: InternetPackage[] = [
  {
    id: "bsa-100",
    name: "Start BSA",
    technology: "bsa",
    tagline: "Internet światłowodowy przez sieć Orange",
    speedDown: 100,
    speedUp: 20,
    features: [
      "Prędkość do 100 Mb/s",
      "Router Wi-Fi w cenie",
      "Bez limitu danych",
      "Wsparcie techniczne 24/7",
    ],
    pricing: pricing(65, 75, 85),
    featured: false,
    order: 1,
  },
  {
    id: "bsa-300",
    name: "Standard BSA",
    technology: "bsa",
    tagline: "Szybki internet dla rodziny przez sieć Orange",
    speedDown: 300,
    speedUp: 40,
    features: [
      "Prędkość do 300 Mb/s",
      "Router Wi-Fi 6 w cenie",
      "Bez limitu danych",
      "Streaming 4K bez buforowania",
    ],
    pricing: pricing(95, 105, 115),
    featured: true,
    order: 2,
  },
  {
    id: "bsa-600",
    name: "Premium BSA",
    technology: "bsa",
    tagline: "Wydajny internet światłowodowy przez sieć Orange",
    speedDown: 600,
    speedUp: 80,
    features: [
      "Prędkość do 600 Mb/s",
      "Router Wi-Fi 6 w cenie",
      "Bez limitu danych",
      "Priorytetowe wsparcie",
    ],
    pricing: pricing(129, 139, 149),
    featured: false,
    order: 3,
  },
]

// === DOCSIS (Cable) ===
export const docsisPackages: InternetPackage[] = [
  {
    id: "docsis-100",
    name: "Start Kablowy",
    technology: "docsis",
    tagline: "Internet kablowy — sprawdzona technologia",
    speedDown: 100,
    speedUp: 10,
    features: [
      "Prędkość do 100 Mb/s",
      "Router Wi-Fi w cenie",
      "Bez limitu danych",
      "Wsparcie techniczne 24/7",
    ],
    pricing: pricing(55, 65, 75),
    featured: false,
    order: 1,
  },
  {
    id: "docsis-250",
    name: "Standard Kablowy",
    technology: "docsis",
    tagline: "Solidny internet kablowy dla całej rodziny",
    speedDown: 250,
    speedUp: 25,
    features: [
      "Prędkość do 250 Mb/s",
      "Router Wi-Fi w cenie",
      "Bez limitu danych",
      "Streaming HD i 4K",
    ],
    pricing: pricing(79, 89, 99),
    featured: true,
    order: 2,
  },
]

// === TV Packages ===
export const iptvPackages: TVPackage[] = [
  {
    id: "tv-iptv-basic",
    name: "TV Start",
    type: "iptv",
    tagline: "Podstawowa rozrywka — wiadomości, sport, filmy",
    channels: 60,
    features: [
      "60+ kanałów",
      "Kanały HD w pakiecie",
      "TVP, Polsat, TVN i więcej",
      "Przewodnik elektroniczny EPG",
    ],
    pricing: pricing(35, 39, 45),
    featured: false,
    order: 1,
  },
  {
    id: "tv-iptv-standard",
    name: "TV Rodzinny",
    type: "iptv",
    tagline: "Coś dla każdego — rozbudowany pakiet kanałów",
    channels: 110,
    features: [
      "110+ kanałów",
      "Kanały premium (Canal+, HBO)",
      "Kanały sportowe",
      "Nagrywanie programów (PVR)",
      "Aplikacja mobilna",
    ],
    pricing: pricing(55, 59, 65),
    featured: true,
    order: 2,
  },
  {
    id: "tv-iptv-premium",
    name: "TV Premium",
    type: "iptv",
    tagline: "Pełnia rozrywki — wszystkie kanały, najlepsza jakość",
    channels: 160,
    features: [
      "160+ kanałów HD i 4K",
      "Wszystkie pakiety premium",
      "Canal+, HBO, Netflix basic",
      "Sport w 4K",
      "Timeshift i nagrywanie",
      "3 urządzenia jednocześnie",
    ],
    pricing: pricing(79, 85, 95),
    featured: false,
    order: 3,
  },
]

export const cableTVPackages: TVPackage[] = [
  {
    id: "tv-cable-basic",
    name: "TV Kablowa",
    type: "cable",
    tagline: "Tradycyjna telewizja kablowa — prosta i niezawodna",
    channels: 50,
    features: [
      "50+ kanałów",
      "Jakość cyfrowa HD",
      "Bez potrzeby dekodera",
      "Prosty sygnał kablowy",
    ],
    pricing: pricing(30, 35, 40),
    featured: false,
    order: 1,
  },
]

// === Lookup helpers ===
export const allInternetPackages: InternetPackage[] = [
  ...gponPackages,
  ...bsaPackages,
  ...docsisPackages,
]

export const allTVPackages: TVPackage[] = [
  ...iptvPackages,
  ...cableTVPackages,
]

export function getInternetPackagesForTech(
  tech: TechCategory
): InternetPackage[] {
  return allInternetPackages.filter((p) => p.technology === tech)
}

export function getTVPackagesForAddress(
  technologies: TechCategory[]
): TVPackage[] {
  const available = [...iptvPackages]
  if (technologies.includes("docsis")) {
    available.push(...cableTVPackages)
  }
  return available.sort((a, b) => a.order - b.order)
}

export function getInternetPackageById(
  id: string
): InternetPackage | undefined {
  return allInternetPackages.find((p) => p.id === id)
}

export function getTVPackageById(id: string): TVPackage | undefined {
  return allTVPackages.find((p) => p.id === id)
}

// Technology display metadata
export const technologyMeta: Record<
  TechCategory,
  { label: string; shortLabel: string; description: string }
> = {
  gpon: {
    label: "Internet Światłowodowy",
    shortLabel: "Światłowód",
    description:
      "Bezpośrednie połączenie światłowodowe GPON — najwyższe prędkości i stabilność",
  },
  bsa: {
    label: "Internet Światłowodowy BSA",
    shortLabel: "Światłowód BSA",
    description:
      "Internet światłowodowy realizowany przez sieć Orange z obsługą TV-EURO-SAT",
  },
  docsis: {
    label: "Internet Kablowy",
    shortLabel: "Kablowy",
    description:
      "Sprawdzony internet kablowy DOCSIS z możliwością telewizji kablowej",
  },
  radio: {
    label: "Internet Radiowy",
    shortLabel: "Radio",
    description: "Technologia radiowa FWA — w trakcie wycofywania",
  },
}
