import { z } from "zod"

export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, "Imię musi mieć co najmniej 2 znaki")
    .max(100, "Imię jest za długie"),
  email: z.string().email("Podaj poprawny adres e-mail"),
  phone: z
    .string()
    .min(9, "Podaj poprawny numer telefonu")
    .max(20, "Numer telefonu jest za długi"),
  subject: z.string().min(1, "Wybierz temat"),
  message: z
    .string()
    .min(10, "Wiadomość musi mieć co najmniej 10 znaków")
    .max(2000, "Wiadomość jest za długa"),
  consent: z.boolean().refine((v) => v === true, {
    message: "Musisz wyrazić zgodę na przetwarzanie danych",
  }),
  honeypot: z.string().max(0).optional(),
})

export type ContactFormData = z.infer<typeof contactFormSchema>

export const contactSubjects = [
  { value: "general", label: "Pytanie ogólne" },
  { value: "technical", label: "Problem techniczny" },
  { value: "billing", label: "Faktura / płatności" },
  { value: "offer", label: "Zapytanie o ofertę" },
  { value: "other", label: "Inny temat" },
]

export const orderFormSchema = z.object({
  packageId: z.string().min(1, "Wybierz pakiet"),
  name: z
    .string()
    .min(2, "Imię musi mieć co najmniej 2 znaki")
    .max(100, "Imię jest za długie"),
  email: z.string().email("Podaj poprawny adres e-mail"),
  phone: z
    .string()
    .min(9, "Podaj poprawny numer telefonu")
    .max(20, "Numer telefonu jest za długi"),
  street: z
    .string()
    .min(3, "Podaj ulicę i numer budynku")
    .max(200, "Adres jest za długi"),
  city: z
    .string()
    .min(2, "Podaj miasto")
    .max(100, "Nazwa miasta jest za długa"),
  postalCode: z
    .string()
    .regex(/^\d{2}-\d{3}$/, "Podaj kod pocztowy w formacie XX-XXX"),
  installationNotes: z.string().max(1000, "Uwagi są za długie").optional(),
  consent: z.boolean().refine((v) => v === true, {
    message: "Musisz wyrazić zgodę na przetwarzanie danych",
  }),
  honeypot: z.string().max(0).optional(),
})

export type OrderFormData = z.infer<typeof orderFormSchema>
