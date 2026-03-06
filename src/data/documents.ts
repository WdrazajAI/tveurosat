import type { DocumentItem } from "@/types"

export const documents: DocumentItem[] = [
  // Price lists
  {
    id: "doc-1",
    name: "Cennik usług internetowych 2026",
    description:
      "Aktualny cennik pakietów internetowych, opłat za instalację i dodatkowe usługi.",
    category: "pricelist",
    fileUrl: "/documents/cennik-internet-2026.pdf",
    fileSize: "245 KB",
    updatedAt: "2026-01-01",
  },
  {
    id: "doc-2",
    name: "Cennik usług telewizyjnych 2026",
    description:
      "Cennik pakietów telewizji IPTV i DVB-T, dodatków kanałowych i usług premium.",
    category: "pricelist",
    fileUrl: "/documents/cennik-tv-2026.pdf",
    fileSize: "312 KB",
    updatedAt: "2026-01-01",
  },
  {
    id: "doc-3",
    name: "Cennik pakietów łączonych 2026",
    description:
      "Cennik pakietów Internet + TV z wyszczególnieniem oszczędności.",
    category: "pricelist",
    fileUrl: "/documents/cennik-combo-2026.pdf",
    fileSize: "198 KB",
    updatedAt: "2026-01-01",
  },

  // Regulations
  {
    id: "doc-4",
    name: "Regulamin świadczenia usług",
    description:
      "Ogólny regulamin świadczenia usług telekomunikacyjnych przez TV-EURO-SAT.",
    category: "regulation",
    fileUrl: "/documents/regulamin-uslug.pdf",
    fileSize: "524 KB",
    updatedAt: "2025-12-01",
  },
  {
    id: "doc-5",
    name: "Polityka prywatności",
    description:
      "Informacje o przetwarzaniu danych osobowych zgodnie z RODO.",
    category: "regulation",
    fileUrl: "/documents/polityka-prywatnosci.pdf",
    fileSize: "189 KB",
    updatedAt: "2025-12-01",
  },
  {
    id: "doc-6",
    name: 'Regulamin promocji "Wielkanoc 2026"',
    description:
      "Szczegółowe warunki aktualnej promocji wielkanocnej z rabatem 20%.",
    category: "regulation",
    fileUrl: "/documents/regulamin-promocja-wielkanoc-2026.pdf",
    fileSize: "156 KB",
    updatedAt: "2026-02-15",
  },

  // Forms
  {
    id: "doc-7",
    name: "Formularz zamówienia usługi",
    description:
      "Formularz do wypełnienia przy zamawianiu nowej usługi internetowej lub telewizyjnej.",
    category: "form",
    fileUrl: "/documents/formularz-zamowienia.pdf",
    fileSize: "98 KB",
    updatedAt: "2025-06-01",
  },
  {
    id: "doc-8",
    name: "Formularz zmiany pakietu",
    description:
      "Formularz do zmiany aktualnego pakietu na inny (upgrade/downgrade).",
    category: "form",
    fileUrl: "/documents/formularz-zmiana-pakietu.pdf",
    fileSize: "87 KB",
    updatedAt: "2025-06-01",
  },
  {
    id: "doc-9",
    name: "Formularz wypowiedzenia umowy",
    description:
      "Formularz wypowiedzenia umowy o świadczenie usług telekomunikacyjnych.",
    category: "form",
    fileUrl: "/documents/formularz-wypowiedzenie.pdf",
    fileSize: "76 KB",
    updatedAt: "2025-06-01",
  },

  // Technical
  {
    id: "doc-10",
    name: "Instrukcja konfiguracji routera",
    description:
      "Poradnik krok po kroku: jak skonfigurować router Wi-Fi dostarczony przez TV-EURO-SAT.",
    category: "technical",
    fileUrl: "/documents/instrukcja-router.pdf",
    fileSize: "1.2 MB",
    updatedAt: "2025-09-01",
  },
  {
    id: "doc-11",
    name: "Instrukcja obsługi dekodera IPTV",
    description:
      "Poradnik obsługi dekodera telewizyjnego: instalacja, pilot, nagrywanie.",
    category: "technical",
    fileUrl: "/documents/instrukcja-dekoder-iptv.pdf",
    fileSize: "2.1 MB",
    updatedAt: "2025-09-01",
  },
]

export const documentCategories: Record<string, string> = {
  pricelist: "Cenniki",
  regulation: "Regulaminy",
  form: "Formularze",
  technical: "Dokumenty techniczne",
}

export function getDocumentsByCategory(category?: string): DocumentItem[] {
  if (!category || category === "all") return documents
  return documents.filter((doc) => doc.category === category)
}
