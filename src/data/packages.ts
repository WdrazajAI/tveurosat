import type {
  InternetPackage,
  TVPackage,
  TVAddon,
  TechCategory,
  TVDeliveryType,
  PricingOption,
} from "@/types"

// Pricing helper
function pricing(
  monthly24: number,
  monthly12: number,
  monthlyIndef: number,
  activation24: number,
  activation12: number,
  activationIndef: number,
  install24: number,
  install12: number,
  installIndef: number
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

// === FTTH Dom jednorodzinny ===
export const ftthDomPackages: InternetPackage[] = [
  {
    id: "ftth-dom-start",
    name: "Start",
    technology: "ftth_dom",
    tagline: "Idealny na start — przeglądanie, social media, streaming",
    speedDown: 300,
    speedUp: 100,
    features: [
      "Prędkość do 300 Mb/s",
      "Router Wi-Fi w cenie",
      "Bez limitu danych",
      "Wsparcie techniczne 24/7",
    ],
    pricing: pricing(79, 89, 99, 69, 99, 199, 299, 399, 499),
    featured: false,
    order: 1,
  },
  {
    id: "ftth-dom-standard",
    name: "Standard",
    technology: "ftth_dom",
    tagline: "Dla rodziny — streaming 4K, praca zdalna, gry online",
    speedDown: 600,
    speedUp: 200,
    features: [
      "Prędkość do 600 Mb/s",
      "Router Wi-Fi 6 w cenie",
      "Bez limitu danych",
      "Priorytetowe wsparcie techniczne",
      "Streaming 4K bez buforowania",
    ],
    pricing: pricing(89, 99, 109, 69, 99, 199, 299, 399, 499),
    featured: true,
    order: 2,
  },
  {
    id: "ftth-dom-premium",
    name: "Premium",
    technology: "ftth_dom",
    tagline: "Dla wymagających — granie, telepraca, wiele urządzeń",
    speedDown: 900,
    speedUp: 300,
    features: [
      "Prędkość do 900 Mb/s",
      "Router Wi-Fi 6 w cenie",
      "Bez limitu danych",
      "Priorytetowe wsparcie VIP",
      "Symetryczny upload 300 Mb/s",
    ],
    pricing: pricing(99, 109, 119, 69, 99, 199, 299, 399, 499),
    featured: false,
    order: 3,
  },
]

// === FTTH Blok (wielorodzinny) ===
export const ftthBlokPackages: InternetPackage[] = [
  {
    id: "ftth-blok-standard",
    name: "Standard",
    technology: "ftth_blok",
    tagline: "Szybki internet dla mieszkania — streaming, praca zdalna",
    speedDown: 450,
    speedUp: 200,
    features: [
      "Prędkość do 450 Mb/s",
      "Router Wi-Fi 6 w cenie",
      "Bez limitu danych",
      "Priorytetowe wsparcie techniczne",
      "Streaming 4K bez buforowania",
    ],
    pricing: pricing(64, 74, 84, 49, 99, 199, 1, 199, 199),
    featured: true,
    order: 1,
  },
  {
    id: "ftth-blok-premium",
    name: "Premium",
    technology: "ftth_blok",
    tagline: "Najszybszy internet w bloku — bez kompromisów",
    speedDown: 900,
    speedUp: 450,
    features: [
      "Prędkość do 900 Mb/s",
      "Router Wi-Fi 6 w cenie",
      "Bez limitu danych",
      "Priorytetowe wsparcie VIP",
      "Symetryczny upload 450 Mb/s",
    ],
    pricing: pricing(74, 84, 94, 49, 99, 199, 1, 199, 199),
    featured: false,
    order: 2,
  },
]

// === FTTH Syntis (infrastruktura innego operatora) ===
export const ftthSyntisPackages: InternetPackage[] = [
  {
    id: "ftth-syntis-start",
    name: "Start",
    technology: "ftth_syntis",
    tagline: "Internet światłowodowy przez infrastrukturę operatora",
    speedDown: 300,
    speedUp: 100,
    features: [
      "Prędkość do 300 Mb/s",
      "Router Wi-Fi w cenie",
      "Bez limitu danych",
      "Wsparcie techniczne 24/7",
    ],
    pricing: pricing(79, 94, 109, 69, 99, 199, 299, 399, 499),
    featured: false,
    order: 1,
  },
  {
    id: "ftth-syntis-standard",
    name: "Standard",
    technology: "ftth_syntis",
    tagline: "Szybki internet światłowodowy przez sieć operatora",
    speedDown: 600,
    speedUp: 200,
    features: [
      "Prędkość do 600 Mb/s",
      "Router Wi-Fi 6 w cenie",
      "Bez limitu danych",
      "Streaming 4K bez buforowania",
    ],
    pricing: pricing(89, 104, 119, 69, 99, 199, 299, 399, 499),
    featured: true,
    order: 2,
  },
  {
    id: "ftth-syntis-premium",
    name: "Premium",
    technology: "ftth_syntis",
    tagline: "Wydajny internet światłowodowy przez sieć operatora",
    speedDown: 900,
    speedUp: 300,
    features: [
      "Prędkość do 900 Mb/s",
      "Router Wi-Fi 6 w cenie",
      "Bez limitu danych",
      "Priorytetowe wsparcie",
    ],
    pricing: pricing(99, 114, 129, 69, 99, 199, 299, 399, 499),
    featured: false,
    order: 3,
  },
]

// === TV DVB-C Packages ===
export const dvbcPackages: TVPackage[] = [
  {
    id: "tv-dvbc-mini",
    name: "MINI",
    type: "dvb_c",
    tagline: "Podstawowa telewizja kablowa — najważniejsze kanały",
    channels: 46,
    features: [
      "46 kanałów HD i SD",
      "TVP, Polsat, TVN i więcej",
      "Bez potrzeby internetu",
    ],
    pricing: pricing(35, 45, 55, 99, 99, 99, 1.23, 1.23, 1.23),
    featured: false,
    order: 1,
  },
  {
    id: "tv-dvbc-komfort",
    name: "Komfort",
    type: "dvb_c",
    tagline: "Rozbudowana telewizja — coś dla każdego",
    channels: 113,
    features: [
      "113 kanałów HD i SD",
      "Kanały rozrywkowe i filmowe",
      "Kanały sportowe",
      "Bez potrzeby internetu",
    ],
    pricing: pricing(59, 69, 79, 99, 99, 99, 1.23, 1.23, 1.23),
    featured: true,
    order: 2,
  },
  {
    id: "tv-dvbc-max",
    name: "MAX",
    type: "dvb_c",
    tagline: "Bogaty pakiet kanałów — filmy, sport, rozrywka",
    channels: 130,
    features: [
      "130 kanałów HD i SD",
      "Kanały premium",
      "Sport w HD",
      "Kanały dokumentalne i naukowe",
      "Bez potrzeby internetu",
    ],
    pricing: pricing(79, 89, 99, 99, 99, 99, 1.23, 1.23, 1.23),
    featured: false,
    order: 3,
  },
  {
    id: "tv-dvbc-premium",
    name: "Premium",
    type: "dvb_c",
    tagline: "Pełnia rozrywki — wszystkie kanały w najlepszej jakości",
    channels: 137,
    features: [
      "137 kanałów HD i SD",
      "Pakiet CANAL+ w cenie",
      "Sport w HD",
      "Filmy i seriale",
      "Bez potrzeby internetu",
    ],
    pricing: pricing(119, 129, 139, 99, 99, 99, 1.23, 1.23, 1.23),
    featured: false,
    order: 4,
  },
]

// === TV IPTV Packages ===
export const iptvPackages: TVPackage[] = [
  {
    id: "tv-iptv-mini",
    name: "MINI",
    type: "iptv",
    tagline: "Podstawowa telewizja IPTV — najważniejsze kanały",
    channels: 46,
    features: [
      "46 kanałów HD i SD",
      "TVP, Polsat, TVN i więcej",
      "Przewodnik elektroniczny EPG",
      "Wymagany internet",
    ],
    pricing: pricing(45, 55, 65, 0, 0, 0, 0, 0, 0),
    featured: false,
    order: 1,
  },
  {
    id: "tv-iptv-komfort",
    name: "Komfort",
    type: "iptv",
    tagline: "Rozbudowana telewizja IPTV — coś dla każdego",
    channels: 113,
    features: [
      "113 kanałów HD i SD",
      "Kanały rozrywkowe i filmowe",
      "Kanały sportowe",
      "Nagrywanie programów (PVR)",
      "Wymagany internet",
    ],
    pricing: pricing(69, 79, 89, 0, 0, 0, 0, 0, 0),
    featured: true,
    order: 2,
  },
  {
    id: "tv-iptv-max",
    name: "MAX",
    type: "iptv",
    tagline: "Bogaty pakiet IPTV — filmy, sport, rozrywka",
    channels: 130,
    features: [
      "130 kanałów HD i SD",
      "Kanały premium",
      "Sport w HD",
      "Timeshift i nagrywanie",
      "Wymagany internet",
    ],
    pricing: pricing(89, 99, 109, 0, 0, 0, 0, 0, 0),
    featured: false,
    order: 3,
  },
  {
    id: "tv-iptv-premium",
    name: "Premium",
    type: "iptv",
    tagline: "Pełnia rozrywki IPTV — wszystkie kanały w najlepszej jakości",
    channels: 137,
    features: [
      "137 kanałów HD i SD",
      "Pakiet CANAL+ w cenie",
      "Sport w HD",
      "3 urządzenia jednocześnie",
      "Wymagany internet",
    ],
    pricing: pricing(129, 139, 149, 0, 0, 0, 0, 0, 0),
    featured: false,
    order: 4,
  },
]

// === TV Addons ===
export const tvAddons: TVAddon[] = [
  {
    id: "canal-plus-dvbc",
    name: "CANAL+",
    type: "dvb_c",
    tagline: "7 kanałów CANAL+ — kino, sport, seriale",
    channels: 7,
    monthlyPrice: 49,
    pricing: pricing(49, 59, 69, 99, 99, 99, 0, 0, 0),
  },
  {
    id: "canal-plus-iptv",
    name: "CANAL+",
    type: "iptv",
    tagline: "7 kanałów CANAL+ — kino, sport, seriale",
    channels: 7,
    monthlyPrice: 59,
    pricing: pricing(59, 69, 79, 0, 0, 0, 0, 0, 0),
  },
  {
    id: "multiroom-dvbc",
    name: "Multiroom",
    type: "dvb_c",
    monthlyPrice: 10,
  },
  {
    id: "multiroom-iptv",
    name: "Multiroom",
    type: "iptv",
    monthlyPrice: 15,
  },
]

// === Lookup helpers ===
export const allInternetPackages: InternetPackage[] = [
  ...ftthDomPackages,
  ...ftthBlokPackages,
  ...ftthSyntisPackages,
]

export const allTVPackages: TVPackage[] = [
  ...dvbcPackages,
  ...iptvPackages,
]

export function getInternetPackagesForTech(
  tech: TechCategory
): InternetPackage[] {
  return allInternetPackages.filter((p) => p.technology === tech)
}

export function getTVPackagesForType(
  type: TVDeliveryType
): TVPackage[] {
  return allTVPackages
    .filter((p) => p.type === type)
    .sort((a, b) => a.order - b.order)
}

export function getInternetPackageById(
  id: string
): InternetPackage | undefined {
  return allInternetPackages.find((p) => p.id === id)
}

export function getTVPackageById(id: string): TVPackage | undefined {
  return allTVPackages.find((p) => p.id === id)
}

export function getTVAddonsForType(type: TVDeliveryType): TVAddon[] {
  return tvAddons.filter((a) => a.type === type)
}

/** @deprecated Use getTVAddonsForType instead */
export function getTVAddonForType(type: TVDeliveryType): TVAddon | undefined {
  return tvAddons.find((a) => a.type === type)
}

// Technology display metadata
export const technologyMeta: Record<
  TechCategory,
  { label: string; shortLabel: string; description: string }
> = {
  ftth_dom: {
    label: "Światłowód — Dom jednorodzinny",
    shortLabel: "FTTH Dom",
    description:
      "Bezpośrednie połączenie światłowodowe do domu jednorodzinnego — najwyższe prędkości i stabilność",
  },
  ftth_blok: {
    label: "Światłowód — Budynek wielorodzinny",
    shortLabel: "FTTH Blok",
    description:
      "Internet światłowodowy do budynku wielorodzinnego z atrakcyjnymi cenami",
  },
  ftth_syntis: {
    label: "Światłowód — FTTH Syntis",
    shortLabel: "FTTH Syntis",
    description:
      "Internet światłowodowy realizowany przez infrastrukturę innego operatora",
  },
}
