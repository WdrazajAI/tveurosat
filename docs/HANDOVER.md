# TV-EURO-SAT — Kompletny checklist wdrożenia (Wdrażaj.AI)

Dokument wewnętrzny — **pełna lista** wszystkiego co trzeba zrobić, skonfigurować i przekazać klientowi.

---

## 1. Supabase — nowa instancja

- [ ] Założyć nowe konto Supabase na dane klienta (email klienta jako owner)
- [ ] Stworzyć nowy projekt (region: EU Central - Frankfurt)
- [ ] Zapisać: **Project URL**, **anon key**, **service role key**
- [ ] Przekazać klientowi dane logowania do Supabase Dashboard (żeby mogli sami zarządzać bazą w przyszłości)

## 2. Migracje bazy danych

Uruchomić w Supabase Dashboard → SQL Editor, **w tej kolejności:**

1. `supabase/migration.sql` — tabele: news, faq, documents, contact_messages
2. `supabase/coverage-migration.sql` — tabela coverage + funkcje wyszukiwania
3. `supabase/migration-channels.sql` — tabele: tv_channel_groups, tv_channels, tv_package_channel_groups + RLS
4. `supabase/migration-channels-seed.sql` — 137 kanałów + 5 grup + powiązania z pakietami
5. `supabase/migration-v2-packages.sql` — tabele: internet_packages, tv_packages
6. `supabase/packages-data.sql` — dane pakietów internetowych i TV
7. `supabase/migration-orders.sql` — tabela orders
8. `supabase/coverage-parts/` — dane coverage (uruchomić pliki po kolei: part-01 do part-08)
9. `supabase/migration-remove-stripe.sql` — usunięcie kolumn Stripe
10. `supabase/migration-channel-categories.sql` — kategorie kanałów (Sport, Filmy, etc.)

- [ ] Zweryfikować po migracjach: `SELECT count(*) FROM coverage` → powinno być ~7500
- [ ] Zweryfikować: `SELECT count(*) FROM tv_channels` → powinno być 137
- [ ] Zweryfikować: `SELECT count(*) FROM faq` → powinno być 14

## 3. Supabase Storage

- [ ] Bucket `documents` — publiczny odczyt (na dokumenty PDF do pobrania)
- [ ] Bucket `channel-logos` — publiczny odczyt (logotypy kanałów TV)
- [ ] Ustawić RLS policies na bucketach (public read, authenticated write)
- [ ] Wgrać ewentualne istniejące dokumenty PDF (cenniki, regulaminy)

## 4. Supabase Edge Functions

Deployować z katalogu `supabase/functions/`:

- [ ] `create-order` — tworzenie zamówień + email do admina
- [ ] `send-contact-email` — wysyłka powiadomienia o nowej wiadomości z formularza kontaktowego

## 5. Email — konfiguracja Resend

Obecnie emaile wysyłane są przez **Resend** (resend.com). Konfiguracja:

- [ ] Konto Resend — założyć lub użyć istniejącego
- [ ] **Domena nadawcy** — KRYTYCZNE: domyślny `onboarding@resend.dev` działa tylko na email właściciela konta Resend. Żeby emaile dochodziły do klientów:
  - [ ] Zweryfikować domenę `tveurosat.net` w Resend (DNS: dodać rekordy SPF, DKIM, DMARC)
  - [ ] Zmienić `from` w edge functions z `onboarding@resend.dev` na `biuro@tveurosat.net` (lub `kontakt@tveurosat.net`)
- [ ] Ustalić z klientem **adres email na powiadomienia** (zamówienia + kontakt) → ustawić jako `ADMIN_EMAIL`
- [ ] Przetestować: złożyć zamówienie i wysłać formularz kontaktowy — sprawdzić czy email dochodzi

**Secrets w Supabase** (Dashboard → Settings → Edge Functions → Secrets):

| Secret | Wartość | Skąd |
|--------|---------|------|
| `RESEND_API_KEY` | klucz API Resend | resend.com → API Keys |
| `ADMIN_EMAIL` | email na powiadomienia (np. biuro@tveurosat.net) | od klienta |
| `RECAPTCHA_SECRET_KEY` | secret key reCAPTCHA v2 | Google Cloud Console |

## 6. Google reCAPTCHA

- [ ] Utworzyć klucze reCAPTCHA v2 (checkbox "Nie jestem robotem") na console.cloud.google.com
- [ ] Dodać dozwolone domeny: `tveurosat.net`, `www.tveurosat.net`
- [ ] Zapisać: **Site Key** → dla technika (do `.env`) i **Secret Key** → do Supabase secrets
- [ ] Na czas testów: można użyć testowych kluczy Google (site: `6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI`)
- [ ] PAMIĘTAJ: zamienić testowe klucze na produkcyjne przed uruchomieniem

## 7. Dane do importu i weryfikacji

- [ ] **Coverage CSV** — zaimportować aktualny plik adresów przez panel admina `/admin/zasieg`
- [ ] **FAQ** — 14 pytań już wstawionych, zweryfikować treść z klientem w `/admin/faq`
- [ ] **Pakiety internetowe** — zweryfikować ceny i prędkości z aktualnym cennikiem w `/admin/pakiety`
- [ ] **Pakiety TV** — zweryfikować ceny i liczbę kanałów w `/admin/pakiety`
- [ ] **Kanały TV** — 137 kanałów już seedowanych, zweryfikować listę w `/admin/kanaly`
- [ ] **Logotypy kanałów** — jeśli klient dostarczy logotypy, wgrać przez admin panel

## 8. Konto admina

- [ ] Utworzyć konto w Supabase Auth (Authentication → Users → Invite) na email klienta
- [ ] Przetestować logowanie na `/admin`
- [ ] Przekazać klientowi: URL panelu admina + dane logowania
- [ ] Pokazać klientowi jak zmienić hasło

## 9. Treść strony — weryfikacja z klientem

- [ ] **Dane kontaktowe** — numery telefonów, email, adres, godziny otwarcia (w `ContactPage.tsx` i `Footer.tsx`)
- [ ] **Social media** — linki Facebook i Instagram w stopce (obecnie `#` — podłączyć realne profile klienta)
- [ ] **Opis firmy** — tekst w stopce i na stronie głównej
- [ ] **FAQ** — klient powinien przejrzeć i zatwierdzić/edytować pytania
- [ ] **Dokumenty do pobrania** — wgrać regulamin, cennik, wzory umów (przez `/admin/dokumenty`)
- [ ] **Aktualności** — dodać pierwszą aktualność (np. "Nowa strona internetowa!")

## 10. SEO i meta tagi

- [ ] **Title** — aktualnie "TV-EURO-SAT | Internet i Telewizja Kablowa w Małkini" (w `index.html`)
- [ ] **Meta description** — zweryfikować opis w `index.html`
- [ ] **Favicon** — zamienić domyślny `vite.svg` na logo TV-EURO-SAT (w `public/`)
- [ ] **Open Graph** — dodać meta tagi OG (og:title, og:description, og:image) do `index.html` dla udostępniania na social media
- [ ] **Logo** — zweryfikować że `public/logo.svg` jest aktualnym logotypem klienta

## 11. Analityka (opcjonalnie)

- [ ] Zapytać klienta czy chce Google Analytics / Plausible / inne
- [ ] Jeśli tak — dodać skrypt tracking do `index.html`
- [ ] Pamiętać o zgodności z RODO (banner cookies jeśli GA)

## 12. Prawne

- [ ] **Regulamin** — klient musi dostarczyć regulamin świadczenia usług
- [ ] **Polityka prywatności** — musi być na stronie (RODO wymaga)
- [ ] **Klauzula informacyjna** — przy formularzach kontaktowym i zamówieniowym (checkbox zgody)
- [ ] Link do regulaminu w stopce i przy formularzach — zweryfikować że prowadzi do `/dokumenty`

## 13. Przekazanie technikowi

Technik potrzebuje **3 rzeczy** żeby zbudować i postawić stronę:

1. **Dostęp do repozytorium GitHub** — dodać jako collaborator lub udostępnić repo
2. **Plik `.env`** z trzema zmiennymi (przesłać bezpiecznie, nie przez email!):
   ```
   VITE_SUPABASE_URL=https://<nowy-projekt>.supabase.co
   VITE_SUPABASE_ANON_KEY=<nowy-anon-key>
   VITE_RECAPTCHA_SITE_KEY=<produkcyjny-site-key>
   ```
3. **Dokumentacja** `docs/DEPLOYMENT.md` (już w repo)

- [ ] Dodać technika do repo GitHub (lub przekazać URL do klonowania)
- [ ] Przekazać `.env` bezpiecznym kanałem (np. szyfrowana wiadomość, nie plaintext email)
- [ ] Umówić termin uruchomienia serwera

## 14. Koordynacja przełączenia DNS

- [ ] Potwierdzić z klientem termin przełączenia DNS (`tveurosat.net` → nowy serwer)
- [ ] Upewnić się że stara strona ma backup
- [ ] Ustalić kto zmienia rekordy DNS (klient? technik? my?)
- [ ] Po przełączeniu: poczekać na propagację DNS (~1-48h)
- [ ] Zweryfikować SSL (certbot) po propagacji

## 15. Test końcowy (po deploy na produkcji)

### Funkcjonalność
- [ ] Strona główna ładuje się na `tveurosat.net`
- [ ] HTTPS działa (kłódka w pasku adresu)
- [ ] Sprawdzenie dostępności — wpisać adres z Małkini, zobaczyć pakiety
- [ ] Wybór pakietu internet → TV → addony → podsumowanie → zamówienie
- [ ] Formularz zamówienia → strona sukcesu "Zamówienie przyjęte"
- [ ] Email z powiadomieniem o zamówieniu dochodzi na `ADMIN_EMAIL`
- [ ] Formularz kontaktowy → wiadomość zapisana + email do admina
- [ ] reCAPTCHA działa (nie testowy klucz!)
- [ ] FAQ — pytania się wyświetlają, rozwijają
- [ ] Dokumenty — pliki do pobrania działają
- [ ] Lista kanałów — drawer otwiera się z kategoriami
- [ ] Panel admina `/admin` — logowanie, CRUD na wszystkich sekcjach

### Wygląd
- [ ] Mobile responsive (telefon, tablet)
- [ ] Dark mode
- [ ] Gwiazdka `*` przy podłączeniu z przypisem
- [ ] Numer stacjonarny `22 473 02 43` bez +48
- [ ] Premium pakiet: "Pakiet CANAL+ w cenie"
- [ ] Logotyp wyświetla się poprawnie
- [ ] Social media linki prowadzą do profili klienta

### Admin panel
- [ ] Import CSV — polskie znaki wyświetlają się poprawnie
- [ ] Edycja FAQ/pakietów/kanałów/dokumentów działa
- [ ] Zamówienia widoczne w `/admin/zamowienia`
- [ ] Wiadomości kontaktowe w `/admin` (contact_messages)

## 16. Po wdrożeniu — przekazanie klientowi

- [ ] Wysłać email podsumowujący do klienta z:
  - URL strony: `tveurosat.net`
  - URL panelu admina: `tveurosat.net/admin`
  - Dane logowania do admina
  - Dane logowania do Supabase Dashboard
  - Krótka instrukcja: jak dodać FAQ, jak edytować pakiety, jak importować adresy
- [ ] Umówić krótki call/szkolenie z klientem (pokazać panel admina)
- [ ] Ustalić kto jest kontaktem na wsparcie techniczne po wdrożeniu

---

## Podział odpowiedzialności

| Kto | Co robi |
|-----|---------|
| **Wdrażaj.AI** | Supabase (nowe konto, migracje, edge functions, secrets, email Resend), reCAPTCHA, konto admina, repo GitHub, konfiguracja danych, koordynacja DNS, test końcowy |
| **Technik (Marcin)** | VM (postawienie serwera), nginx, SSL (certbot), firewall (UFW), DNS (rekord A → IP), build i deployment plików, VPN (opcjonalnie) |
| **Klient (Bartek)** | Termin przełączenia DNS, email na powiadomienia, profile social media, regulamin/polityka prywatności, weryfikacja treści FAQ/pakietów, logotypy kanałów (opcjonalnie) |

---

## Co musisz uzyskać od klienta PRZED wdrożeniem

| Informacja | Status |
|-----------|--------|
| Email na powiadomienia o zamówieniach/kontakcie | [ ] |
| Email do konta admina (login do panelu) | [ ] |
| Linki do Facebook i Instagram | [ ] |
| Regulamin świadczenia usług (PDF) | [ ] |
| Polityka prywatności (PDF lub tekst) | [ ] |
| Logo w wysokiej rozdzielczości (PNG/SVG) | [ ] |
| Potwierdzenie cennika (plik "Segmentacja oferty") | [x] mamy |
| Aktualny plik CSV z adresami coverage | [x] mamy |
| Termin przełączenia DNS | [ ] |
| Kto zarządza DNS domeny tveurosat.net | [ ] |
