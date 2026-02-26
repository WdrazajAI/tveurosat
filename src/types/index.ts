// Package types
export type PackageType = "internet" | "tv" | "combo"
export type TVTechnology = "iptv" | "dvbt" | "dvbt_iptv"

export interface Package {
  id: string
  name: string
  type: PackageType
  tagline: string
  speed?: string
  channels?: number
  price: number
  priceNote: string
  features: string[]
  featured: boolean
  tvTechnology?: TVTechnology
  locationRestriction?: string
  order: number
}

// Coverage types
export interface CoverageArea {
  id: string
  city: string
  cityNormalized: string
  street: string
  streetNormalized: string
  buildingRange?: { from: number; to: number }
  specificBuildings?: string[]
  technology: TVTechnology
  zone: string
  availableSpeedTiers: string[]
}

export interface CoverageResult {
  covered: boolean
  area?: CoverageArea
  technology?: TVTechnology
  message: string
}

// News types
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

// FAQ types
export type FAQCategory = "general" | "technical" | "billing" | "installation"

export interface FAQItem {
  id: string
  question: string
  answer: string
  category: FAQCategory
  order: number
}

// Document types
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
