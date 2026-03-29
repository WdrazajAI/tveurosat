import { z } from "zod"

// Login
export const loginSchema = z.object({
  email: z.string().email("Podaj poprawny adres e-mail"),
  password: z.string().min(6, "Hasło musi mieć co najmniej 6 znaków"),
})
export type LoginFormData = z.infer<typeof loginSchema>

// News
export const newsSchema = z.object({
  title: z.string().min(3, "Tytuł musi mieć co najmniej 3 znaki").max(200, "Tytuł jest za długi"),
  slug: z
    .string()
    .min(3, "Slug musi mieć co najmniej 3 znaki")
    .max(200, "Slug jest za długi")
    .regex(/^[a-z0-9-]+$/, "Slug może zawierać tylko małe litery, cyfry i myślniki"),
  excerpt: z.string().min(10, "Opis musi mieć co najmniej 10 znaków").max(500, "Opis jest za długi"),
  content: z.string().min(10, "Treść musi mieć co najmniej 10 znaków"),
  date: z.string().min(1, "Podaj datę"),
  category: z.enum(["promotion", "news", "expansion", "maintenance"], "Wybierz kategorię"),
  image: z.string().optional(),
  featured: z.boolean(),
})
export type NewsFormData = z.infer<typeof newsSchema>

// FAQ
export const faqSchema = z.object({
  question: z.string().min(5, "Pytanie musi mieć co najmniej 5 znaków").max(500, "Pytanie jest za długie"),
  answer: z.string().min(10, "Odpowiedź musi mieć co najmniej 10 znaków").max(5000, "Odpowiedź jest za długa"),
  category: z.enum(["general", "technical", "billing", "installation"], "Wybierz kategorię"),
  order: z.number().int().min(0, "Kolejność musi być >= 0"),
})
export type FAQFormData = z.infer<typeof faqSchema>

// Documents
export const documentSchema = z.object({
  name: z.string().min(3, "Nazwa musi mieć co najmniej 3 znaki").max(200, "Nazwa jest za długa"),
  description: z.string().min(5, "Opis musi mieć co najmniej 5 znaków").max(500, "Opis jest za długi"),
  category: z.enum(["pricelist", "regulation", "form", "technical"], "Wybierz kategorię"),
  file_url: z.string().min(1, "Plik jest wymagany"),
  file_size: z.string().min(1, "Rozmiar pliku jest wymagany"),
})
export type DocumentFormData = z.infer<typeof documentSchema>

// Internet Package
const pricingOptionSchema = z.object({
  period: z.enum(["24m", "12m", "indefinite"]),
  periodLabel: z.string(),
  monthlyPrice: z.number().min(0, "Cena musi być >= 0"),
  activationFee: z.number().min(0, "Opłata musi być >= 0"),
  installationFee: z.number().min(0, "Opłata musi być >= 0"),
})

export const internetPackageSchema = z.object({
  slug: z
    .string()
    .min(2, "Slug jest za krótki")
    .regex(/^[a-z0-9-]+$/, "Slug może zawierać tylko małe litery, cyfry i myślniki"),
  name: z.string().min(2, "Nazwa jest za krótka").max(100, "Nazwa jest za długa"),
  technology: z.enum(["ftth_dom", "ftth_blok", "ftth_syntis"], "Wybierz technologię"),
  tagline: z.string().min(5, "Opis jest za krótki").max(200, "Opis jest za długi"),
  speed_down: z.number().int().min(1, "Prędkość musi być > 0"),
  speed_up: z.number().int().min(1, "Prędkość musi być > 0"),
  features: z.array(z.string()).min(1, "Dodaj co najmniej jedną cechę"),
  pricing: z.array(pricingOptionSchema).length(3, "Wymagane 3 opcje cenowe (24m, 12m, bez umowy)"),
  featured: z.boolean(),
  order: z.number().int().min(0),
  tariff_code: z.string().optional(),
  active: z.boolean(),
})
export type InternetPackageFormData = z.infer<typeof internetPackageSchema>

// TV Package
export const tvPackageSchema = z.object({
  slug: z
    .string()
    .min(2, "Slug jest za krótki")
    .regex(/^[a-z0-9-]+$/, "Slug może zawierać tylko małe litery, cyfry i myślniki"),
  name: z.string().min(2, "Nazwa jest za krótka").max(100, "Nazwa jest za długa"),
  type: z.enum(["iptv", "dvb_c"], "Wybierz typ"),
  tagline: z.string().min(5, "Opis jest za krótki").max(200, "Opis jest za długi"),
  channels: z.number().int().min(1, "Liczba kanałów musi być > 0"),
  features: z.array(z.string()).min(1, "Dodaj co najmniej jedną cechę"),
  pricing: z.array(pricingOptionSchema).length(3, "Wymagane 3 opcje cenowe (24m, 12m, bez umowy)"),
  featured: z.boolean(),
  order: z.number().int().min(0),
  tariff_code: z.string().optional(),
  active: z.boolean(),
})
export type TVPackageFormData = z.infer<typeof tvPackageSchema>

// Slug generation helper
export function generateSlug(text: string): string {
  const polishMap: Record<string, string> = {
    ą: "a", ć: "c", ę: "e", ł: "l", ń: "n",
    ó: "o", ś: "s", ź: "z", ż: "z",
    Ą: "a", Ć: "c", Ę: "e", Ł: "l", Ń: "n",
    Ó: "o", Ś: "s", Ź: "z", Ż: "z",
  }
  return text
    .split("")
    .map((char) => polishMap[char] || char)
    .join("")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}
