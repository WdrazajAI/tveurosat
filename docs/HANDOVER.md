# TV-EURO-SAT — Checklist wdrożenia (Wdrażaj.AI)

Dokument wewnętrzny — kroki do wykonania PRZED przekazaniem projektu klientowi.

---

## 1. Supabase — nowa instancja

- [ ] Założyć nowe konto Supabase na dane klienta (email klienta jako owner)
- [ ] Stworzyć nowy projekt (region: EU Central - Frankfurt)
- [ ] Zapisać: **Project URL**, **anon key**, **service role key**

## 2. Migracje bazy danych

Uruchomić w Supabase Dashboard → SQL Editor, **w tej kolejności:**

1. `supabase/migration.sql` — tabele: news, faq, documents
2. `supabase/coverage-migration.sql` — tabela coverage + funkcje wyszukiwania
3. `supabase/migration-channels.sql` — tabele: tv_channel_groups, tv_channels, tv_package_channel_groups + RLS
4. `supabase/migration-channels-seed.sql` — 137 kanałów + 5 grup + powiązania z pakietami
5. `supabase/migration-v2-packages.sql` — tabele: internet_packages, tv_packages
6. `supabase/packages-data.sql` — dane pakietów internetowych i TV
7. `supabase/migration-orders.sql` — tabela orders
8. `supabase/coverage-parts/` — dane coverage (uruchomić pliki po kolei)
9. `supabase/migration-remove-stripe.sql` — usunięcie kolumn Stripe
10. `supabase/migration-channel-categories.sql` — kategorie kanałów (Sport, Filmy, etc.)

## 3. Supabase Storage

- [ ] Bucket `documents` — publiczny odczyt (na dokumenty PDF do pobrania)
- [ ] Bucket `channel-logos` — publiczny odczyt (logotypy kanałów TV)

## 4. Supabase Edge Functions

Deployować z katalogu `supabase/functions/`:

- [ ] `create-order` — tworzenie zamówień + email admina
- [ ] `send-contact-email` — wysyłka formularza kontaktowego

**Secrets do ustawienia** (Supabase Dashboard → Settings → Edge Functions → Secrets):

| Secret | Wartość | Skąd |
|--------|---------|------|
| `RESEND_API_KEY` | klucz API | resend.com — konto klienta lub Wdrażaj.AI |
| `ADMIN_EMAIL` | email na powiadomienia | od klienta |
| `RECAPTCHA_SECRET_KEY` | secret key reCAPTCHA | Google Cloud Console |

## 5. Google reCAPTCHA

- [ ] Utworzyć klucze reCAPTCHA v2 (checkbox) na console.cloud.google.com
- [ ] Dodać domenę: `tveurosat.net` + `www.tveurosat.net`
- [ ] Zapisać: **Site Key** (frontend) i **Secret Key** (backend/edge functions)
- [ ] Na czas testów: użyć testowych kluczy Google (site: `6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI`)

## 6. Dane do importu

- [ ] Coverage CSV — zaimportować przez panel admina `/admin/zasieg`
- [ ] FAQ — już wstawione do bazy (14 pytań), edytowalne w `/admin/faq`
- [ ] Pakiety — już wstawione, edytowalne w `/admin/pakiety`
- [ ] Kanały TV — już seedowane (137 kanałów), edytowalne w `/admin/kanaly`

## 7. Konto admina

- [ ] Utworzyć konto w Supabase Auth (email klienta)
- [ ] Przekazać dane logowania do panelu `/admin`

## 8. Przekazanie technikowi

Technik potrzebuje **3 rzeczy** żeby zbudować i postawić stronę:

1. **Dostęp do repozytorium GitHub** (git clone)
2. **Plik `.env`** z trzema zmiennymi:
   ```
   VITE_SUPABASE_URL=https://<nowy-projekt>.supabase.co
   VITE_SUPABASE_ANON_KEY=<nowy-anon-key>
   VITE_RECAPTCHA_SITE_KEY=<site-key>
   ```
3. **Dokumentacja** `docs/DEPLOYMENT.md` (już w repo)

## 9. Koordynacja przełączenia DNS

- [ ] Potwierdzić z klientem termin przełączenia DNS (tveurosat.net → nowy serwer)
- [ ] Upewnić się że stara strona ma backup
- [ ] Po przełączeniu DNS: zweryfikować SSL (certbot), przetestować wszystkie funkcje

## 10. Test końcowy

- [ ] Strona główna ładuje się na tveurosat.net
- [ ] Sprawdzenie dostępności (adres) działa
- [ ] Formularz kontaktowy + reCAPTCHA działa
- [ ] Formularz zamówienia → sukces (bez Stripe)
- [ ] Panel admina `/admin` — logowanie, edycja FAQ/pakietów/kanałów
- [ ] Lista kanałów — drawer z kategoriami
- [ ] Dokumenty do pobrania
- [ ] Dark mode
- [ ] Mobile responsive

---

## Podział odpowiedzialności

| Kto | Co robi |
|-----|---------|
| **Wdrażaj.AI** | Supabase (nowe konto, migracje, edge functions, secrets), reCAPTCHA, konto admina, repozytorium GitHub, koordynacja DNS |
| **Technik (Marcin)** | VM (postawienie serwera), nginx, SSL, firewall, DNS (rekord A), build i deployment plików |
| **Klient (Bartek)** | Decyzja o terminie przełączenia DNS, dane do konta admina, weryfikacja treści |
