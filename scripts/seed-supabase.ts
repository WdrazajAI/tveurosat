/**
 * Seed script to migrate existing static data to Supabase.
 *
 * Usage:
 *   1. Set SUPABASE_URL and SUPABASE_SERVICE_KEY environment variables
 *   2. Run: npx tsx scripts/seed-supabase.ts
 *
 * NOTE: Uses service role key (not anon key) to bypass RLS for seeding.
 */

import { createClient } from "@supabase/supabase-js"

const url = process.env.SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_KEY

if (!url || !key) {
  console.error("Set SUPABASE_URL and SUPABASE_SERVICE_KEY environment variables")
  process.exit(1)
}

const supabase = createClient(url, key)

// Static data imports (using relative paths for Node execution)
const newsArticles = [
  {
    slug: "nowe-pakiety-swiatlowodowe-2026",
    title: "Nowe pakiety światłowodowe — jeszcze szybciej!",
    excerpt: "Wprowadzamy pakiet Ultra z prędkością do 1 Gb/s. Symetryczny upload, dedykowany opiekun klienta i router Wi-Fi 6E w cenie.",
    content: "Mamy świetne wieści dla mieszkańców Małkini i okolic! Od marca 2026 wprowadzamy nowy pakiet **Ultra** z prędkością aż do **1 Gb/s**.\n\n## Co nowego?\n\n- **Symetryczny upload i download** — 1 Gb/s w obu kierunkach\n- **Router Wi-Fi 6E** w cenie pakietu\n- **Dedykowany opiekun klienta**\n- **Gwarancja najniższego pingu**",
    date: "2026-02-15",
    category: "promotion",
    featured: true,
  },
  {
    slug: "rozbudowa-sieci-nurska",
    title: "Rozbudowa sieci na ulicy Nurskiej — nowe podłączenia!",
    excerpt: "Z przyjemnością informujemy, że zakończyliśmy rozbudowę sieci światłowodowej na ulicy Nurskiej.",
    content: "Z wielką radością informujemy o zakończeniu kolejnego etapu rozbudowy naszej sieci światłowodowej!\n\n## Nowe podłączenia\n\nOd lutego 2026 mieszkańcy **ulicy Nurskiej** w Małkini Górnej (budynki nr 45-60) mogą korzystać z naszych usług.",
    date: "2026-02-10",
    category: "expansion",
    featured: true,
  },
  {
    slug: "planowane-prace-serwisowe-marzec",
    title: "Planowane prace serwisowe — 5 marca 2026",
    excerpt: "Informujemy o planowanych pracach serwisowych w dniu 5 marca w godzinach 2:00-5:00.",
    content: "Szanowni Klienci,\n\nInformujemy o planowanych pracach serwisowych.\n\n## Szczegóły\n\n- **Data**: 5 marca 2026\n- **Godziny**: 2:00 — 5:00 w nocy\n- **Obszar**: Małkinia Górna",
    date: "2026-02-25",
    category: "maintenance",
    featured: false,
  },
  {
    slug: "wielkanocna-promocja-2026",
    title: "Wielkanocna promocja — 3 miesiące taniej!",
    excerpt: "Z okazji Wielkanocy oferujemy specjalne ceny na wszystkie pakiety. Przez pierwsze 3 miesiące płacisz o 20% mniej!",
    content: "Wielkanoc to idealny moment na zmianę dostawcy internetu!\n\n## Promocja\n\n- **20% rabatu** przez pierwsze 3 miesiące\n- **Darmowa instalacja**\n- **Bez umowy na czas**",
    date: "2026-03-01",
    category: "promotion",
    featured: true,
  },
  {
    slug: "nowa-aplikacja-mobilna-tv",
    title: "Nowa aplikacja mobilna TV-EURO-SAT",
    excerpt: "Uruchamiamy aplikację mobilną! Oglądaj telewizję na telefonie i tablecie.",
    content: "Z dumą przedstawiamy naszą nową aplikację mobilną **TV-EURO-SAT Go**!\n\n## Funkcje\n\n- **Telewizja na żywo**\n- **Nagrywanie w chmurze**\n- **Timeshift**",
    date: "2026-01-20",
    category: "news",
    featured: false,
  },
]

const faqItems = [
  { question: "Jakie usługi oferuje TV-EURO-SAT?", answer: "Oferujemy szerokopasmowy internet światłowodowy (GPON) o prędkościach od 100 Mb/s do 1 Gb/s, telewizję cyfrową IPTV z ponad 160 kanałami, a w wybranych lokalizacjach również telewizję DVB-T.", category: "general", order: 1 },
  { question: "Na jakim obszarze działacie?", answer: "Nasza sieć obejmuje Małkinię Górną i okolice, w tym Prostyń, Kiełczew i przyległe miejscowości.", category: "general", order: 2 },
  { question: "Czy mogę sprawdzić dostępność usług pod moim adresem?", answer: "Tak! Skorzystaj z naszego narzędzia \"Sprawdź Dostępność\" na stronie głównej.", category: "general", order: 3 },
  { question: "Czym jest modem i do czego służy?", answer: "Modem (ONT) to urządzenie, które konwertuje sygnał światłowodowy na sygnał cyfrowy zrozumiały dla Twojego routera i urządzeń.", category: "technical", order: 1 },
  { question: "Czym jest modulator i jak działa?", answer: "Modulator to urządzenie używane w sieciach telewizji kablowej DVB-T.", category: "technical", order: 2 },
  { question: "Jaka jest różnica między IPTV a DVB-T?", answer: "IPTV to telewizja dostarczana przez internet. DVB-T to tradycyjna telewizja cyfrowa naziemna.", category: "technical", order: 3 },
  { question: "Czy potrzebuję specjalnego routera?", answer: "Nie — router Wi-Fi jest wliczony w cenę każdego pakietu internetowego.", category: "technical", order: 4 },
  { question: "Co to jest GPON i dlaczego jest lepszy?", answer: "GPON to technologia światłowodowa, która dostarcza internet bezpośrednio włóknem szklanym do Twojego domu.", category: "technical", order: 5 },
  { question: "Jakie są metody płatności?", answer: "Akceptujemy przelewy bankowe, płatności kartą oraz gotówkę w naszym biurze.", category: "billing", order: 1 },
  { question: "Czy są jakieś ukryte opłaty?", answer: "Nie. Cena pakietu, którą widzisz na naszej stronie, to cena, którą płacisz.", category: "billing", order: 2 },
  { question: "Czy wymagana jest umowa na czas określony?", answer: "Oferujemy zarówno umowy na czas określony (12 lub 24 miesiące) jak i umowy bez zobowiązania.", category: "billing", order: 3 },
  { question: "Jak wygląda proces instalacji?", answer: "Po złożeniu zamówienia nasz technik umawia się na wizytę w dogodnym terminie (zwykle w ciągu 48 godzin).", category: "installation", order: 1 },
  { question: "Czy instalacja jest darmowa?", answer: "Tak, standardowa instalacja jest bezpłatna przy podpisaniu umowy.", category: "installation", order: 2 },
  { question: "Czy mogę zmienić pakiet po instalacji?", answer: "Oczywiście! Zmiana pakietu na wyższy jest możliwa w dowolnym momencie i jest bezpłatna.", category: "installation", order: 3 },
]

const documents = [
  { name: "Cennik usług internetowych 2026", description: "Aktualny cennik pakietów internetowych.", category: "pricelist", file_url: "/documents/cennik-internet-2026.pdf", file_size: "245 KB" },
  { name: "Cennik usług telewizyjnych 2026", description: "Cennik pakietów telewizji IPTV i DVB-T.", category: "pricelist", file_url: "/documents/cennik-tv-2026.pdf", file_size: "312 KB" },
  { name: "Cennik pakietów łączonych 2026", description: "Cennik pakietów Internet + TV.", category: "pricelist", file_url: "/documents/cennik-combo-2026.pdf", file_size: "198 KB" },
  { name: "Regulamin świadczenia usług", description: "Ogólny regulamin świadczenia usług telekomunikacyjnych.", category: "regulation", file_url: "/documents/regulamin-uslug.pdf", file_size: "524 KB" },
  { name: "Polityka prywatności", description: "Informacje o przetwarzaniu danych osobowych.", category: "regulation", file_url: "/documents/polityka-prywatnosci.pdf", file_size: "189 KB" },
  { name: "Regulamin promocji \"Wielkanoc 2026\"", description: "Warunki aktualnej promocji wielkanocnej.", category: "regulation", file_url: "/documents/regulamin-promocja-wielkanoc-2026.pdf", file_size: "156 KB" },
  { name: "Formularz zamówienia usługi", description: "Formularz do zamawiania nowej usługi.", category: "form", file_url: "/documents/formularz-zamowienia.pdf", file_size: "98 KB" },
  { name: "Formularz zmiany pakietu", description: "Formularz do zmiany pakietu.", category: "form", file_url: "/documents/formularz-zmiana-pakietu.pdf", file_size: "87 KB" },
  { name: "Formularz wypowiedzenia umowy", description: "Formularz wypowiedzenia umowy.", category: "form", file_url: "/documents/formularz-wypowiedzenie.pdf", file_size: "76 KB" },
  { name: "Instrukcja konfiguracji routera", description: "Poradnik konfiguracji routera Wi-Fi.", category: "technical", file_url: "/documents/instrukcja-router.pdf", file_size: "1.2 MB" },
  { name: "Instrukcja obsługi dekodera IPTV", description: "Poradnik obsługi dekodera telewizyjnego.", category: "technical", file_url: "/documents/instrukcja-dekoder-iptv.pdf", file_size: "2.1 MB" },
]

function pricing(m24: number, m12: number, mi: number, a24 = 0, a12 = 1, ai = 49, i24 = 0, i12 = 0, ii = 99) {
  return [
    { period: "24m", periodLabel: "Umowa 24 mies.", monthlyPrice: m24, activationFee: a24, installationFee: i24 },
    { period: "12m", periodLabel: "Umowa 12 mies.", monthlyPrice: m12, activationFee: a12, installationFee: i12 },
    { period: "indefinite", periodLabel: "Bez umowy", monthlyPrice: mi, activationFee: ai, installationFee: ii },
  ]
}

const internetPackages = [
  { slug: "gpon-100", name: "Start", technology: "gpon", tagline: "Idealny na start", speed_down: 100, speed_up: 30, features: ["Prędkość do 100 Mb/s", "Router Wi-Fi w cenie", "Bez limitu danych", "Wsparcie techniczne 24/7"], pricing: pricing(59, 69, 79), featured: false, order: 1, active: true },
  { slug: "gpon-300", name: "Standard", technology: "gpon", tagline: "Dla rodziny", speed_down: 300, speed_up: 50, features: ["Prędkość do 300 Mb/s", "Router Wi-Fi 6 w cenie", "Bez limitu danych", "Priorytetowe wsparcie", "Streaming 4K"], pricing: pricing(89, 99, 109), featured: true, order: 2, active: true },
  { slug: "gpon-600", name: "Premium", technology: "gpon", tagline: "Dla wymagających", speed_down: 600, speed_up: 100, features: ["Prędkość do 600 Mb/s", "Router Wi-Fi 6 w cenie", "Bez limitu danych", "Priorytetowe wsparcie VIP", "Symetryczny upload"], pricing: pricing(119, 129, 139), featured: false, order: 3, active: true },
  { slug: "gpon-1000", name: "Ultra", technology: "gpon", tagline: "Maksimum mocy", speed_down: 1000, speed_up: 500, features: ["Prędkość do 1 Gb/s", "Router Wi-Fi 6E w cenie", "Bez limitu danych", "Dedykowany opiekun klienta", "Symetryczny upload 500 Mb/s", "Gwarancja najniższego pingu"], pricing: pricing(149, 159, 179), featured: false, order: 4, active: true },
  { slug: "bsa-100", name: "Start BSA", technology: "bsa", tagline: "Internet przez sieć Orange", speed_down: 100, speed_up: 20, features: ["Prędkość do 100 Mb/s", "Router Wi-Fi w cenie", "Bez limitu danych", "Wsparcie techniczne 24/7"], pricing: pricing(65, 75, 85), featured: false, order: 1, active: true },
  { slug: "bsa-300", name: "Standard BSA", technology: "bsa", tagline: "Szybki internet BSA", speed_down: 300, speed_up: 40, features: ["Prędkość do 300 Mb/s", "Router Wi-Fi 6 w cenie", "Bez limitu danych", "Streaming 4K"], pricing: pricing(95, 105, 115), featured: true, order: 2, active: true },
  { slug: "bsa-600", name: "Premium BSA", technology: "bsa", tagline: "Wydajny internet BSA", speed_down: 600, speed_up: 80, features: ["Prędkość do 600 Mb/s", "Router Wi-Fi 6 w cenie", "Bez limitu danych", "Priorytetowe wsparcie"], pricing: pricing(129, 139, 149), featured: false, order: 3, active: true },
  { slug: "docsis-100", name: "Start Kablowy", technology: "docsis", tagline: "Internet kablowy", speed_down: 100, speed_up: 10, features: ["Prędkość do 100 Mb/s", "Router Wi-Fi w cenie", "Bez limitu danych", "Wsparcie techniczne 24/7"], pricing: pricing(55, 65, 75), featured: false, order: 1, active: true },
  { slug: "docsis-250", name: "Standard Kablowy", technology: "docsis", tagline: "Solidny internet kablowy", speed_down: 250, speed_up: 25, features: ["Prędkość do 250 Mb/s", "Router Wi-Fi w cenie", "Bez limitu danych", "Streaming HD i 4K"], pricing: pricing(79, 89, 99), featured: true, order: 2, active: true },
]

const tvPackages = [
  { slug: "tv-iptv-basic", name: "TV Start", type: "iptv", tagline: "Podstawowa rozrywka", channels: 60, features: ["60+ kanałów", "Kanały HD w pakiecie", "TVP, Polsat, TVN i więcej", "Przewodnik EPG"], pricing: pricing(35, 39, 45), featured: false, order: 1, active: true },
  { slug: "tv-iptv-standard", name: "TV Rodzinny", type: "iptv", tagline: "Coś dla każdego", channels: 110, features: ["110+ kanałów", "Kanały premium (Canal+, HBO)", "Kanały sportowe", "Nagrywanie PVR", "Aplikacja mobilna"], pricing: pricing(55, 59, 65), featured: true, order: 2, active: true },
  { slug: "tv-iptv-premium", name: "TV Premium", type: "iptv", tagline: "Pełnia rozrywki", channels: 160, features: ["160+ kanałów HD i 4K", "Wszystkie pakiety premium", "Canal+, HBO, Netflix basic", "Sport w 4K", "Timeshift i nagrywanie", "3 urządzenia jednocześnie"], pricing: pricing(79, 85, 95), featured: false, order: 3, active: true },
  { slug: "tv-cable-basic", name: "TV Kablowa", type: "cable", tagline: "Tradycyjna telewizja kablowa", channels: 50, features: ["50+ kanałów", "Jakość cyfrowa HD", "Bez potrzeby dekodera", "Prosty sygnał kablowy"], pricing: pricing(30, 35, 40), featured: false, order: 1, active: true },
]

async function seed() {
  console.log("Seeding news...")
  const { error: e1 } = await supabase.from("news").upsert(newsArticles, { onConflict: "slug" })
  if (e1) console.error("News error:", e1.message)
  else console.log(`  Inserted ${newsArticles.length} news articles`)

  console.log("Seeding FAQ...")
  const { error: e2 } = await supabase.from("faq").insert(faqItems)
  if (e2) console.error("FAQ error:", e2.message)
  else console.log(`  Inserted ${faqItems.length} FAQ items`)

  console.log("Seeding documents...")
  const { error: e3 } = await supabase.from("documents").insert(documents)
  if (e3) console.error("Documents error:", e3.message)
  else console.log(`  Inserted ${documents.length} documents`)

  console.log("Seeding internet packages...")
  const { error: e4 } = await supabase.from("internet_packages").upsert(internetPackages, { onConflict: "slug" })
  if (e4) console.error("Internet packages error:", e4.message)
  else console.log(`  Inserted ${internetPackages.length} internet packages`)

  console.log("Seeding TV packages...")
  const { error: e5 } = await supabase.from("tv_packages").upsert(tvPackages, { onConflict: "slug" })
  if (e5) console.error("TV packages error:", e5.message)
  else console.log(`  Inserted ${tvPackages.length} TV packages`)

  console.log("\nDone!")
}

seed()
