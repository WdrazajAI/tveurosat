import { motion } from "framer-motion"
import { FileText, Download, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import PageHero from "@/components/layout/PageHero"
import { documents, documentCategories } from "@/data/documents"

export default function DocumentsPage() {
  const categories = Object.entries(documentCategories)

  return (
    <>
      <PageHero
        title="Dokumenty"
        subtitle="Cenniki, regulaminy, formularze i dokumenty techniczne do pobrania."
        breadcrumbs={[{ label: "Dokumenty" }]}
      />

      <section className="pt-6 pb-12 sm:pt-8 sm:pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {categories.map(([categoryKey, categoryLabel]) => {
            const categoryDocs = documents.filter((d) => d.category === categoryKey)
            if (categoryDocs.length === 0) return null

            return (
              <div key={categoryKey} className="mb-12 last:mb-0">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  {categoryLabel}
                </h2>

                <div className="space-y-3">
                  {categoryDocs.map((doc, index) => (
                    <motion.div
                      key={doc.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-card border border-border hover:shadow-sm transition-shadow flex-col sm:flex-row"
                    >
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground">{doc.name}</h3>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {doc.description}
                        </p>
                        <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                          <span>{doc.fileSize}</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(doc.updatedAt).toLocaleDateString("pl-PL")}
                          </span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="flex-shrink-0" asChild>
                        <a href={doc.fileUrl} download>
                          <Download className="h-4 w-4 mr-1.5" />
                          Pobierz
                        </a>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </>
  )
}
