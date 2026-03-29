# TV-EURO-SAT — Specyfikacja wdrożeniowa dla administratora serwera

**Przygotowane przez:** Wdrażaj.AI
**Dla:** TV-EURO-SAT
**Domena produkcyjna:** tveurosat.net

---

## Aplikacja

| Parametr | Wartość |
|----------|---------|
| Typ | SPA (Single Page Application) — statyczne pliki |
| Stack | Vite + React + TypeScript |
| Output buildu | Folder `dist/` (HTML, JS, CSS, obrazki) |
| Backend | Supabase Cloud (hostowany zewnętrznie — brak konfiguracji po stronie serwera) |
| Rozmiar buildu | ~1.5 MB (gzip ~400 KB) |

## Wymagania serwera

- **OS:** Linux (Ubuntu 22.04+ / Debian 12+ / dowolna dystrybucja)
- **Node.js:** 20.x LTS (potrzebny tylko do buildu)
- **nginx:** dowolna aktualna wersja (serwowanie statycznych plików)
- **certbot:** do certyfikatu SSL (Let's Encrypt)
- **Minimalne zasoby:** 1 CPU, 1 GB RAM, 5 GB dysku

> Aplikacja to statyczne pliki — serwer nie uruchamia żadnego runtime'u, nie potrzebuje PM2 ani Dockera. Nginx serwuje pliki z dysku.

## Build

```bash
git clone <repo-url> && cd tveurosat
npm install
npm run build
```

Output: folder `dist/` — skopiować do lokalizacji nginx (np. `/var/www/tveurosat/dist/`).

**Zmienne środowiskowe (build-time)** — muszą być ustawione w pliku `.env` PRZED buildem:

```
VITE_SUPABASE_URL=<otrzymane od Wdrażaj.AI>
VITE_SUPABASE_ANON_KEY=<otrzymane od Wdrażaj.AI>
VITE_RECAPTCHA_SITE_KEY=<otrzymane od Wdrażaj.AI>
```

> Te zmienne są wbudowywane w bundle podczas buildu. Nie są zmiennymi runtime'owymi serwera.

## Konfiguracja nginx

```nginx
server {
    listen 443 ssl http2;
    server_name tveurosat.net www.tveurosat.net;

    root /var/www/tveurosat/dist;
    index index.html;

    # SPA — wszystkie ścieżki → index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Hashowane assety (Vite) — cache 1 rok
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # index.html — bez cache (żeby nowy deploy działał od razu)
    location = /index.html {
        add_header Cache-Control "no-cache";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # SSL — certbot uzupełni ścieżki
    ssl_certificate /etc/letsencrypt/live/tveurosat.net/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/tveurosat.net/privkey.pem;

    # Gzip
    gzip on;
    gzip_types text/css application/javascript application/json image/svg+xml;
}

# Redirect HTTP → HTTPS
server {
    listen 80;
    server_name tveurosat.net www.tveurosat.net;
    return 301 https://$host$request_uri;
}
```

## Porty (firewall)

| Port | Protokół | Usługa |
|------|----------|--------|
| 22 | TCP | SSH |
| 80 | TCP | HTTP → redirect na 443 |
| 443 | TCP | HTTPS |

Reszta: deny all incoming.

## DNS

Rekord A: `tveurosat.net` → IP nowego serwera
Rekord A lub CNAME: `www.tveurosat.net` → to samo

> **Uwaga:** Zmiana DNS spowoduje przełączenie ze starej strony na nową. Koordynować z Wdrażaj.AI termin przełączenia.

## Backend

Backend (baza danych, API, edge functions) jest hostowany na **Supabase Cloud** — nie wymaga żadnej instalacji ani konfiguracji po stronie serwera klienta. Wszystkie dane i logika biznesowa działają w chmurze Supabase.

Parametry połączenia z Supabase (URL, klucze) zostaną przekazane przez Wdrażaj.AI po skonfigurowaniu nowej instancji.

## Aktualizacja strony

```bash
cd /sciezka/do/repozytorium
git pull
npm install
npm run build
rsync -a --delete dist/ /var/www/tveurosat/dist/
```

Nginx nie wymaga restartu — pliki statyczne podmieniane na żywo.

---

*W razie pytań technicznych: kontakt z Wdrażaj.AI*
