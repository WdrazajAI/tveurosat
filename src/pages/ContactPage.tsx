import { motion } from "framer-motion"
import { Phone, Mail, MapPin, Clock, FileText } from "lucide-react"
import { Link } from "react-router-dom"
import PageHero from "@/components/layout/PageHero"
import ContactForm from "@/components/forms/ContactForm"

const contactInfo = [
  {
    icon: Phone,
    label: "Telefon",
    value: "22 473 02 43",
    href: "tel:224730243",
  },
  {
    icon: Phone,
    label: "Telefon komórkowy",
    value: "+48 604 132 157",
    href: "tel:+48604132157",
  },
  {
    icon: Mail,
    label: "E-mail",
    value: "biuro@tveurosat.net",
    href: "mailto:biuro@tveurosat.net",
  },
  {
    icon: MapPin,
    label: "Adres",
    value: "Małkinia Górna, Mazowieckie",
  },
  {
    icon: Clock,
    label: "Godziny otwarcia",
    value: "Pon-Pt: 8:00-17:00, Sob: 9:00-13:00",
  },
]

export default function ContactPage() {
  return (
    <>
      <PageHero
        title="Kontakt"
        subtitle="Masz pytania? Skontaktuj się z nami — chętnie pomożemy."
        breadcrumbs={[{ label: "Kontakt" }]}
      />

      <section className="pt-8 pb-16 sm:pt-10 sm:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-stretch">
            {/* Left - Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col gap-8"
            >
              <div>
                <h2 className="text-2xl font-bold mb-2">Dane kontaktowe</h2>
                <p className="text-muted-foreground">
                  Skontaktuj się z nami telefonicznie, mailowo lub odwiedź nas osobiście.
                </p>
              </div>

              <div className="space-y-6">
                {contactInfo.map((item) => {
                  const Icon = item.icon
                  return (
                    <div key={item.label} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">
                          {item.label}
                        </div>
                        {item.href ? (
                          <a
                            href={item.href}
                            className="text-foreground hover:text-primary transition-colors font-medium"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <div className="text-foreground font-medium">
                            {item.value}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              <Link
                to="/dokumenty"
                className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
              >
                <FileText className="h-4 w-4" />
                Dokumenty do pobrania
              </Link>
            </motion.div>

            {/* Right - Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className=""
            >
              <div className="rounded-2xl bg-card border border-border p-6 sm:p-8">
                <h2 className="text-2xl font-bold mb-1 text-center">Formularz kontaktowy</h2>
                <p className="text-muted-foreground mb-6 text-center">
                  Wypełnij formularz, a odpowiemy najszybciej jak to możliwe.
                </p>
                <ContactForm />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}
