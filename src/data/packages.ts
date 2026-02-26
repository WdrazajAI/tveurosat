import type { Package, PackageType } from "@/types"

export const internetPackages: Package[] = [
  {
    id: "net-100",
    name: "Start",
    type: "internet",
    tagline: "Idealny na start — przeglądanie, social media, streaming",
    speed: "100 Mb/s",
    price: 59,
    priceNote: "zł/mies.",
    features: [
      "Prędkość do 100 Mb/s",
      "Router Wi-Fi w cenie",
      "Bez limitu danych",
      "Wsparcie techniczne 24/7",
    ],
    featured: false,
    order: 1,
  },
  {
    id: "net-300",
    name: "Standard",
    type: "internet",
    tagline: "Dla rodziny — streaming 4K, praca zdalna, gry online",
    speed: "300 Mb/s",
    price: 89,
    priceNote: "zł/mies.",
    features: [
      "Prędkość do 300 Mb/s",
      "Router Wi-Fi 6 w cenie",
      "Bez limitu danych",
      "Priorytetowe wsparcie techniczne",
      "Streaming 4K bez buforowania",
    ],
    featured: true,
    order: 2,
  },
  {
    id: "net-600",
    name: "Premium",
    type: "internet",
    tagline: "Dla wymagających — granie, telepraca, wiele urządzeń",
    speed: "600 Mb/s",
    price: 119,
    priceNote: "zł/mies.",
    features: [
      "Prędkość do 600 Mb/s",
      "Router Wi-Fi 6 w cenie",
      "Bez limitu danych",
      "Priorytetowe wsparcie VIP",
      "Symetryczny upload",
      "Idealne do gamingu i streamingu",
    ],
    featured: false,
    order: 3,
  },
  {
    id: "net-1000",
    name: "Ultra",
    type: "internet",
    tagline: "Maksimum mocy — bez kompromisów",
    speed: "1 Gb/s",
    price: 149,
    priceNote: "zł/mies.",
    features: [
      "Prędkość do 1 Gb/s",
      "Router Wi-Fi 6E w cenie",
      "Bez limitu danych",
      "Dedykowany opiekun klienta",
      "Symetryczny upload 1 Gb/s",
      "Gwarancja najniższego pingu",
    ],
    featured: false,
    order: 4,
  },
]

export const tvPackages: Package[] = [
  {
    id: "tv-basic",
    name: "TV Start",
    type: "tv",
    tagline: "Podstawowa rozrywka — wiadomości, sport, filmy",
    channels: 60,
    price: 35,
    priceNote: "zł/mies.",
    features: [
      "60+ kanałów",
      "Kanały HD w pakiecie",
      "TVP, Polsat, TVN i więcej",
      "Przewodnik elektroniczny EPG",
    ],
    featured: false,
    tvTechnology: "iptv",
    order: 1,
  },
  {
    id: "tv-standard",
    name: "TV Rodzinny",
    type: "tv",
    tagline: "Coś dla każdego — rozbudowany pakiet kanałów",
    channels: 110,
    price: 55,
    priceNote: "zł/mies.",
    features: [
      "110+ kanałów",
      "Kanały premium (Canal+, HBO)",
      "Kanały sportowe",
      "Nagrywanie programów (PVR)",
      "Aplikacja mobilna",
    ],
    featured: true,
    tvTechnology: "iptv",
    order: 2,
  },
  {
    id: "tv-premium",
    name: "TV Premium",
    type: "tv",
    tagline: "Pełnia rozrywki — wszystkie kanały, najlepsza jakość",
    channels: 160,
    price: 79,
    priceNote: "zł/mies.",
    features: [
      "160+ kanałów HD i 4K",
      "Wszystkie pakiety premium",
      "Canal+, HBO, Netflix basic",
      "Sport w 4K",
      "Timeshift i nagrywanie",
      "3 urządzenia jednocześnie",
    ],
    featured: false,
    tvTechnology: "iptv",
    order: 3,
  },
  {
    id: "tv-dvbt-basic",
    name: "TV Klasyczna",
    type: "tv",
    tagline: "Tradycyjna telewizja DVB-T — prosta i niezawodna",
    channels: 30,
    price: 25,
    priceNote: "zł/mies.",
    features: [
      "30+ kanałów DVB-T",
      "Jakość cyfrowa HD",
      "Bez potrzeby internetu",
      "Prosty montaż anteny",
    ],
    featured: false,
    tvTechnology: "dvbt",
    locationRestriction: "lesna5",
    order: 4,
  },
]

export const comboPackages: Package[] = [
  {
    id: "combo-start",
    name: "Duo Start",
    type: "combo",
    tagline: "Internet + TV w jednej cenie — oszczędzasz 15 zł/mies.",
    speed: "100 Mb/s",
    channels: 60,
    price: 79,
    priceNote: "zł/mies.",
    features: [
      "Internet 100 Mb/s",
      "60+ kanałów TV",
      "Router Wi-Fi w cenie",
      "Oszczędność 15 zł vs osobne usługi",
      "Jedna faktura",
    ],
    featured: false,
    tvTechnology: "iptv",
    order: 1,
  },
  {
    id: "combo-family",
    name: "Duo Rodzinny",
    type: "combo",
    tagline: "Najczęściej wybierany — internet i TV dla całej rodziny",
    speed: "300 Mb/s",
    channels: 110,
    price: 119,
    priceNote: "zł/mies.",
    features: [
      "Internet 300 Mb/s",
      "110+ kanałów z premium",
      "Router Wi-Fi 6 w cenie",
      "Oszczędność 25 zł vs osobne usługi",
      "Streaming 4K + sport",
      "Jedna faktura",
    ],
    featured: true,
    tvTechnology: "iptv",
    order: 2,
  },
  {
    id: "combo-max",
    name: "Duo Premium",
    type: "combo",
    tagline: "Wszystko bez kompromisów — najszybszy net i pełna TV",
    speed: "600 Mb/s",
    channels: 160,
    price: 169,
    priceNote: "zł/mies.",
    features: [
      "Internet 600 Mb/s",
      "160+ kanałów HD i 4K",
      "Router Wi-Fi 6 w cenie",
      "Oszczędność 29 zł vs osobne usługi",
      "Canal+, HBO, Netflix",
      "Dedykowane wsparcie VIP",
    ],
    featured: false,
    tvTechnology: "iptv",
    order: 3,
  },
]

export const allPackages: Package[] = [
  ...internetPackages,
  ...tvPackages,
  ...comboPackages,
]

export function getPackagesByType(type: PackageType): Package[] {
  switch (type) {
    case "internet":
      return internetPackages
    case "tv":
      return tvPackages
    case "combo":
      return comboPackages
  }
}

export function getPackagesForLocation(
  type: PackageType,
  isLesna5: boolean
): Package[] {
  const packages = getPackagesByType(type)
  if (isLesna5) return packages
  return packages.filter((pkg) => pkg.locationRestriction !== "lesna5")
}

export function getPackageById(id: string): Package | undefined {
  return allPackages.find((pkg) => pkg.id === id)
}
