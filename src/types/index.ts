// === Technology Categories ===
export type TechCategory = "gpon" | "bsa" | "docsis" | "radio"

// === Coverage Types ===
export interface CoverageCity {
  name: string
  normalized: string
  hasStreets: boolean
}

export interface AddressTech {
  t: TechCategory
  d: number // maxDown Mbps
}

export interface CoverageAddress {
  s: string // street display name
  sn: string // street normalized
  b: string // building number
  techs: AddressTech[]
  tc?: string // tariff code (future use)
}

export interface CoverageDatabase {
  version: string
  generatedAt: string
  stats: {
    totalAddresses: number
    cities: number
    technologies: Record<string, number>
    radioOnly: number
  }
  cities: CoverageCity[]
  addresses: Record<string, CoverageAddress[]>
}

export interface CoverageCheckResult {
  status: "covered" | "radio_only" | "not_covered"
  address: {
    city: string
    street: string
    building: string
  }
  technologies: TechCategory[]
  maxSpeeds: Partial<Record<TechCategory, { down: number; up: number }>>
  message: string
}

// === Package Types ===
export type ContractPeriod = "24m" | "12m" | "indefinite"

export interface PricingOption {
  period: ContractPeriod
  periodLabel: string
  monthlyPrice: number
  activationFee: number
  installationFee: number
}

export interface InternetPackage {
  id: string
  name: string
  technology: TechCategory
  tagline: string
  speedDown: number
  speedUp: number
  features: string[]
  pricing: PricingOption[]
  featured: boolean
  order: number
  tariffCode?: string
}

export interface TVPackage {
  id: string
  name: string
  type: "iptv" | "cable"
  tagline: string
  channels: number
  features: string[]
  pricing: PricingOption[]
  featured: boolean
  order: number
  tariffCode?: string
}

// === News types ===
export type NewsCategory = "promotion" | "news" | "expansion" | "maintenance"

export interface NewsArticle {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  date: string
  category: NewsCategory
  image?: string
  featured: boolean
}

// === FAQ types ===
export type FAQCategory = "general" | "technical" | "billing" | "installation"

export interface FAQItem {
  id: string
  question: string
  answer: string
  category: FAQCategory
  order: number
}

// === Document types ===
export type DocumentCategory = "pricelist" | "regulation" | "form" | "technical"

export interface DocumentItem {
  id: string
  name: string
  description: string
  category: DocumentCategory
  fileUrl: string
  fileSize: string
  updatedAt: string
}
