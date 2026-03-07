/**
 * Konwertuje CSV z danymi zasięgu na SQL INSERT statements
 * Uruchom: node scripts/convert-coverage-csv.js
 */

import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Ścieżka do pliku CSV
const CSV_PATH = 'C:\\Users\\flpgl\\Downloads\\Lista (1).csv'
const OUTPUT_PATH = join(__dirname, '..', 'supabase', 'coverage-data.sql')

function parseCSV(content) {
  const lines = content.split('\n').filter(line => line.trim())
  const records = []

  for (const line of lines) {
    const parts = line.split(';')

    // Pomijamy header (DI) i puste linie
    if (parts[0] !== 'ZS') continue

    // Parsujemy dane
    const record = {
      address_id: parts[1] || '',
      simc_code: parts[2] || '',
      locality: (parts[3] || '').replace(/'/g, "''"), // escape quotes
      teryt_code: parts[4] || '',
      street: (parts[5] || '').replace(/'/g, "''"),
      street_code: parts[6] || '',
      building_number: parts[7] || '',
      latitude: parseFloat(parts[8]) || 0,
      longitude: parseFloat(parts[9]) || 0,
      medium: (parts[10] || '').replace(/'/g, "''"),
      technology: parts[11] || '',
      speed_down: parseInt(parts[12]) || 0,
      speed_up: parseInt(parts[13]) || 0,
      speed_type: parts[14] || 'rzeczywisty',
      // Kolumna 15 (index 15) to coś nieznanego - pomijamy
      internet_available: parts[16] === 'TAK',
      tv_available: parts[17] === 'TAK',
      operator: parts[19] || 'TVEUROSAT'
    }

    // Walidacja podstawowa
    if (record.address_id && record.latitude && record.longitude) {
      records.push(record)
    }
  }

  return records
}

function generateSQL(records) {
  const header = `-- TV Eurosat - Coverage Data Import
-- Wygenerowano automatycznie ze skryptu convert-coverage-csv.js
-- ${records.length} rekordów
-- Data: ${new Date().toISOString()}

-- Najpierw wyczyść istniejące dane (opcjonalnie - odkomentuj jeśli chcesz nadpisać)
-- TRUNCATE TABLE coverage;

-- INSERT statements (batched by 100 for performance)
`

  const batchSize = 100
  const batches = []

  for (let i = 0; i < records.length; i += batchSize) {
    const batch = records.slice(i, i + batchSize)

    const values = batch.map(r => {
      const street = r.street ? `'${r.street}'` : 'NULL'
      const streetCode = r.street_code && r.street_code !== '99999' ? `'${r.street_code}'` : 'NULL'
      const terytCode = r.teryt_code ? `'${r.teryt_code}'` : 'NULL'

      return `  ('${r.address_id}', '${r.simc_code}', '${r.locality}', ${terytCode}, ${street}, ${streetCode}, '${r.building_number}', ${r.latitude}, ${r.longitude}, '${r.medium}', '${r.technology}', ${r.speed_down}, ${r.speed_up}, '${r.speed_type}', ${r.internet_available}, ${r.tv_available}, '${r.operator}')`
    }).join(',\n')

    batches.push(`INSERT INTO coverage (address_id, simc_code, locality, teryt_code, street, street_code, building_number, latitude, longitude, medium, technology, speed_down, speed_up, speed_type, internet_available, tv_available, operator)
VALUES
${values}
ON CONFLICT (address_id) DO UPDATE SET
  locality = EXCLUDED.locality,
  street = EXCLUDED.street,
  building_number = EXCLUDED.building_number,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  medium = EXCLUDED.medium,
  technology = EXCLUDED.technology,
  speed_down = EXCLUDED.speed_down,
  speed_up = EXCLUDED.speed_up,
  internet_available = EXCLUDED.internet_available,
  tv_available = EXCLUDED.tv_available,
  updated_at = NOW();
`)
  }

  return header + batches.join('\n')
}

// Main
try {
  console.log('Czytanie pliku CSV...')
  const csvContent = readFileSync(CSV_PATH, 'utf-8')

  console.log('Parsowanie danych...')
  const records = parseCSV(csvContent)
  console.log(`Znaleziono ${records.length} rekordów`)

  // Statystyki
  const technologies = {}
  const localities = new Set()
  records.forEach(r => {
    technologies[r.technology] = (technologies[r.technology] || 0) + 1
    localities.add(r.locality)
  })

  console.log('\nStatystyki:')
  console.log(`- Miejscowości: ${localities.size}`)
  console.log('- Technologie:')
  Object.entries(technologies).forEach(([tech, count]) => {
    console.log(`  - ${tech}: ${count}`)
  })

  console.log('\nGenerowanie SQL...')
  const sql = generateSQL(records)

  writeFileSync(OUTPUT_PATH, sql, 'utf-8')
  console.log(`\n✅ Zapisano do: ${OUTPUT_PATH}`)
  console.log('\nNastępne kroki:')
  console.log('1. Uruchom coverage-migration.sql w Supabase SQL Editor (tworzy tabelę)')
  console.log('2. Uruchom coverage-data.sql w Supabase SQL Editor (importuje dane)')

} catch (error) {
  console.error('Błąd:', error.message)
  process.exit(1)
}
