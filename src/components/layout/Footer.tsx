import { Facebook, Instagram, Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[hsl(222,47%,11%)] text-[hsl(210,20%,96%)] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1 - Logo & Description */}
          <div>
            <div className="flex items-center mb-4">
              <span className="text-xl font-extrabold tracking-tight">
                <span className="text-primary">TV-EURO</span>
                <span className="text-secondary">-SAT</span>
              </span>
            </div>
            <p className="text-sm text-white/60 leading-relaxed mb-4">
              Dostawca internetu światłowodowego i telewizji kablowej w regionie
              Małkini.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors duration-200"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors duration-200"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Column 2 - Oferta */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-white mb-4">
              Oferta
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#uslugi"
                  className="text-sm text-white/60 hover:text-white transition-colors duration-200"
                >
                  Internet
                </a>
              </li>
              <li>
                <a
                  href="#pakiety"
                  className="text-sm text-white/60 hover:text-white transition-colors duration-200"
                >
                  Telewizja
                </a>
              </li>
              <li>
                <a
                  href="#pakiety"
                  className="text-sm text-white/60 hover:text-white transition-colors duration-200"
                >
                  Pakiety
                </a>
              </li>
              <li>
                <a
                  href="#pakiety"
                  className="text-sm text-white/60 hover:text-white transition-colors duration-200"
                >
                  Cennik
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3 - Firma */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-white mb-4">
              Firma
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#o-nas"
                  className="text-sm text-white/60 hover:text-white transition-colors duration-200"
                >
                  O nas
                </a>
              </li>
              <li>
                <a
                  href="#kontakt"
                  className="text-sm text-white/60 hover:text-white transition-colors duration-200"
                >
                  Kontakt
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-white/60 hover:text-white transition-colors duration-200"
                >
                  Regulamin
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-white/60 hover:text-white transition-colors duration-200"
                >
                  Polityka prywatności
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4 - Kontakt */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-white mb-4">
              Kontakt
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="tel:+48123456789"
                  className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors duration-200"
                >
                  <Phone className="h-4 w-4" />
                  +48 123 456 789
                </a>
              </li>
              <li>
                <a
                  href="mailto:kontakt@tveurosat.pl"
                  className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors duration-200"
                >
                  <Mail className="h-4 w-4" />
                  kontakt@tveurosat.pl
                </a>
              </li>
              <li>
                <div className="flex items-start gap-2 text-sm text-white/60">
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Małkinia Górna, Mazowieckie</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-white/40">
          <p>© {currentYear} TV-EURO-SAT. Wszelkie prawa zastrzeżone.</p>
          <p>Stworzone z pasją w Małkini</p>
        </div>
      </div>
    </footer>
  )
}
