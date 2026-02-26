import type { FAQItem } from "@/types"

export const faqItems: FAQItem[] = [
  // General
  {
    id: "faq-1",
    question: "Jakie usługi oferuje TV-EURO-SAT?",
    answer:
      "Oferujemy szerokopasmowy internet światłowodowy (GPON) o prędkościach od 100 Mb/s do 1 Gb/s, telewizję cyfrową IPTV z ponad 160 kanałami, a w wybranych lokalizacjach również telewizję DVB-T. Dostępne są pakiety łączone internet + TV w atrakcyjnych cenach.",
    category: "general",
    order: 1,
  },
  {
    id: "faq-2",
    question: "Na jakim obszarze działacie?",
    answer:
      "Nasza sieć obejmuje Małkinię Górną i okolice, w tym Prostyń, Kiełczew i przyległe miejscowości. Stale rozszerzamy zasięg — sprawdź dostępność pod swoim adresem na naszej stronie.",
    category: "general",
    order: 2,
  },
  {
    id: "faq-3",
    question: "Czy mogę sprawdzić dostępność usług pod moim adresem?",
    answer:
      'Tak! Skorzystaj z naszego narzędzia "Sprawdź Dostępność" na stronie głównej. Wystarczy wpisać miejscowość, ulicę i numer domu, a pokażemy Ci dostępne pakiety i ceny.',
    category: "general",
    order: 3,
  },

  // Technical
  {
    id: "faq-4",
    question: "Czym jest modem i do czego służy?",
    answer:
      "Modem (ONT) to urządzenie, które konwertuje sygnał światłowodowy na sygnał cyfrowy zrozumiały dla Twojego routera i urządzeń. Jest to pierwszy element w łańcuchu połączenia — światłowód wchodzi do modemu, a z modemu kabel sieciowy łączy się z routerem Wi-Fi.",
    category: "technical",
    order: 1,
  },
  {
    id: "faq-5",
    question: "Czym jest modulator i jak działa?",
    answer:
      "Modulator to urządzenie używane w sieciach telewizji kablowej DVB-T. Przyjmuje sygnał cyfrowy i przekształca go w format, który może być przesyłany kablem koncentrycznym do telewizora. Jest to element infrastruktury budynku — nie musisz go kupować samodzielnie.",
    category: "technical",
    order: 2,
  },
  {
    id: "faq-6",
    question: "Jaka jest różnica między IPTV a DVB-T?",
    answer:
      "IPTV (Internet Protocol Television) to telewizja dostarczana przez internet — wymaga połączenia internetowego, ale oferuje dodatkowe funkcje jak nagrywanie, timeshift czy aplikację mobilną. DVB-T (Digital Video Broadcasting — Terrestrial) to tradycyjna telewizja cyfrowa naziemna, dostarczana kablem antenowym. DVB-T jest prostsza, ale oferuje mniej funkcji.",
    category: "technical",
    order: 3,
  },
  {
    id: "faq-7",
    question: "Czy potrzebuję specjalnego routera?",
    answer:
      "Nie — router Wi-Fi jest wliczony w cenę każdego pakietu internetowego. Dostarczamy nowoczesne routery Wi-Fi 6 (lub Wi-Fi 6E w pakiecie Ultra), które zapewniają stabilny zasięg w całym mieszkaniu. Możesz też użyć własnego routera, jeśli wolisz.",
    category: "technical",
    order: 4,
  },
  {
    id: "faq-8",
    question: "Co to jest GPON i dlaczego jest lepszy?",
    answer:
      "GPON (Gigabit Passive Optical Network) to technologia światłowodowa, która dostarcza internet bezpośrednio włóknem szklanym do Twojego domu. Jest lepsza od kabla miedzianego (DSL), bo oferuje symetryczne prędkości (taki sam upload jak download), stabilność niezależnie od odległości od centrali i brak zakłóceń elektromagnetycznych.",
    category: "technical",
    order: 5,
  },

  // Billing
  {
    id: "faq-9",
    question: "Jakie są metody płatności?",
    answer:
      "Akceptujemy przelewy bankowe, płatności kartą oraz gotówkę w naszym biurze. Faktury wysyłamy elektronicznie na adres e-mail. W przypadku pakietów łączonych otrzymujesz jedną fakturę za wszystkie usługi.",
    category: "billing",
    order: 1,
  },
  {
    id: "faq-10",
    question: "Czy są jakieś ukryte opłaty?",
    answer:
      "Nie. Cena pakietu, którą widzisz na naszej stronie, to cena, którą płacisz. Nie stosujemy ukrytych opłat, dodatkowych kosztów aktywacji ani opłat za sprzęt w trakcie trwania umowy.",
    category: "billing",
    order: 2,
  },
  {
    id: "faq-11",
    question: "Czy wymagana jest umowa na czas określony?",
    answer:
      "Oferujemy zarówno umowy na czas określony (12 lub 24 miesiące) z niższą ceną, jak i umowy bez zobowiązania z miesięcznym okresem wypowiedzenia. Szczegóły dostępne przy wyborze pakietu.",
    category: "billing",
    order: 3,
  },

  // Installation
  {
    id: "faq-12",
    question: "Jak wygląda proces instalacji?",
    answer:
      "Po złożeniu zamówienia nasz technik umawia się na wizytę w dogodnym terminie (zwykle w ciągu 48 godzin). Instalacja trwa od 1 do 3 godzin i obejmuje: doprowadzenie światłowodu, montaż modemu, konfigurację routera Wi-Fi oraz, w przypadku TV, instalację dekodera IPTV.",
    category: "installation",
    order: 1,
  },
  {
    id: "faq-13",
    question: "Czy instalacja jest darmowa?",
    answer:
      "Tak, standardowa instalacja jest bezpłatna przy podpisaniu umowy. Obejmuje doprowadzenie światłowodu do mieszkania, montaż i konfigurację wszystkich urządzeń.",
    category: "installation",
    order: 2,
  },
  {
    id: "faq-14",
    question: "Czy mogę zmienić pakiet po instalacji?",
    answer:
      "Oczywiście! Zmiana pakietu na wyższy jest możliwa w dowolnym momencie i jest bezpłatna. Zmiana na niższy pakiet jest możliwa po zakończeniu okresu minimalnego. Wystarczy skontaktować się z naszym biurem lub zadzwonić pod numer wsparcia.",
    category: "installation",
    order: 3,
  },
]

export const faqCategories: Record<string, string> = {
  general: "Ogólne",
  technical: "Techniczne",
  billing: "Płatności i umowy",
  installation: "Instalacja",
}

export function getFAQByCategory(category?: string): FAQItem[] {
  if (!category || category === "all") return faqItems
  return faqItems
    .filter((item) => item.category === category)
    .sort((a, b) => a.order - b.order)
}
