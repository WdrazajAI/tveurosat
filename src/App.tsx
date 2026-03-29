import { lazy, Suspense } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { ThemeProvider } from "@/context/ThemeContext"
import { AuthProvider } from "@/context/AuthContext"
import ScrollToTop from "@/components/layout/ScrollToTop"
import RootLayout from "@/layouts/RootLayout"
import Index from "@/pages/Index"

// Lazy-loaded public pages
const PackagesPage = lazy(() => import("@/pages/PackagesPage"))
const ContactPage = lazy(() => import("@/pages/ContactPage"))
const NewsPage = lazy(() => import("@/pages/NewsPage"))
const NewsArticlePage = lazy(() => import("@/pages/NewsArticlePage"))
const FAQPage = lazy(() => import("@/pages/FAQPage"))
const DocumentsPage = lazy(() => import("@/pages/DocumentsPage"))
const ClientZonePage = lazy(() => import("@/pages/ClientZonePage"))
const OrderPage = lazy(() => import("@/pages/OrderPage"))
const OrderSuccessPage = lazy(() => import("@/pages/OrderSuccessPage"))
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"))

// Lazy-loaded admin pages
const AdminLoginPage = lazy(() => import("@/pages/admin/AdminLoginPage"))
const AdminLayout = lazy(() => import("@/layouts/AdminLayout"))
const DashboardPage = lazy(() => import("@/pages/admin/DashboardPage"))
const NewsListPage = lazy(() => import("@/pages/admin/NewsListPage"))
const NewsEditPage = lazy(() => import("@/pages/admin/NewsEditPage"))
const FAQListPage = lazy(() => import("@/pages/admin/FAQListPage"))
const FAQEditPage = lazy(() => import("@/pages/admin/FAQEditPage"))
const DocumentsListPage = lazy(() => import("@/pages/admin/DocumentsListPage"))
const DocumentEditPage = lazy(() => import("@/pages/admin/DocumentEditPage"))
const PackagesListPage = lazy(() => import("@/pages/admin/PackagesListPage"))
const InternetPackageEditPage = lazy(() => import("@/pages/admin/InternetPackageEditPage"))
const TVPackageEditPage = lazy(() => import("@/pages/admin/TVPackageEditPage"))
const CoverageImportPage = lazy(() => import("@/pages/admin/CoverageImportPage"))
const OrdersListPage = lazy(() => import("@/pages/admin/OrdersListPage"))
const ChannelGroupsPage = lazy(() => import("@/pages/admin/ChannelGroupsPage"))
const ChannelGroupEditPage = lazy(() => import("@/pages/admin/ChannelGroupEditPage"))

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
    <AuthProvider>
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public site */}
        <Route element={<RootLayout />}>
          <Route path="/" element={<Index />} />
          <Route path="/sprawdz-dostepnosc" element={<Navigate to="/pakiety" replace />} />
          <Route path="/pakiety" element={<PackagesPage />} />
          <Route path="/zamowienie" element={<OrderPage />} />
          <Route path="/zamowienie/sukces" element={<OrderSuccessPage />} />
          <Route path="/kontakt" element={<ContactPage />} />
          <Route path="/aktualnosci" element={<NewsPage />} />
          <Route path="/aktualnosci/:slug" element={<NewsArticlePage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/dokumenty" element={<DocumentsPage />} />
          <Route path="/strefa-klienta" element={<ClientZonePage />} />

          {/* ADD NEW ROUTES ABOVE THE CATCH-ALL */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* Admin panel */}
        <Route path="/admin" element={<AdminLoginPage />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="aktualnosci" element={<NewsListPage />} />
          <Route path="aktualnosci/:id" element={<NewsEditPage />} />
          <Route path="faq" element={<FAQListPage />} />
          <Route path="faq/:id" element={<FAQEditPage />} />
          <Route path="dokumenty" element={<DocumentsListPage />} />
          <Route path="dokumenty/:id" element={<DocumentEditPage />} />
          <Route path="pakiety" element={<PackagesListPage />} />
          <Route path="pakiety/internet/:id" element={<InternetPackageEditPage />} />
          <Route path="pakiety/tv/:id" element={<TVPackageEditPage />} />
          <Route path="kanaly" element={<ChannelGroupsPage />} />
          <Route path="kanaly/:id" element={<ChannelGroupEditPage />} />
          <Route path="zasieg" element={<CoverageImportPage />} />
          <Route path="zamowienia" element={<OrdersListPage />} />
        </Route>
      </Routes>
      </Suspense>
    </BrowserRouter>
    </AuthProvider>
    </ThemeProvider>
  )
}

export default App
