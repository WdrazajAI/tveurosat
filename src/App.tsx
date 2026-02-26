import { lazy, Suspense } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "@/context/ThemeContext"
import ScrollToTop from "@/components/layout/ScrollToTop"
import RootLayout from "@/layouts/RootLayout"
import Index from "@/pages/Index"

// Lazy-loaded pages for code splitting
const CoverageCheckerPage = lazy(() => import("@/pages/CoverageCheckerPage"))
const PackagesPage = lazy(() => import("@/pages/PackagesPage"))
const ContactPage = lazy(() => import("@/pages/ContactPage"))
const NewsPage = lazy(() => import("@/pages/NewsPage"))
const NewsArticlePage = lazy(() => import("@/pages/NewsArticlePage"))
const FAQPage = lazy(() => import("@/pages/FAQPage"))
const DocumentsPage = lazy(() => import("@/pages/DocumentsPage"))
const ClientZonePage = lazy(() => import("@/pages/ClientZonePage"))
const OrderPage = lazy(() => import("@/pages/OrderPage"))
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"))

function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={<Index />} />
          <Route path="/sprawdz-dostepnosc" element={<CoverageCheckerPage />} />
          <Route path="/pakiety" element={<PackagesPage />} />
          <Route path="/pakiety/:tab" element={<PackagesPage />} />
          <Route path="/zamowienie" element={<OrderPage />} />
          <Route path="/kontakt" element={<ContactPage />} />
          <Route path="/aktualnosci" element={<NewsPage />} />
          <Route path="/aktualnosci/:slug" element={<NewsArticlePage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/dokumenty" element={<DocumentsPage />} />
          <Route path="/strefa-klienta" element={<ClientZonePage />} />

          {/* ADD NEW ROUTES ABOVE THE CATCH-ALL */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
      </Suspense>
    </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
