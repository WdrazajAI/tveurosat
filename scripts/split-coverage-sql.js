/**
 * Dzieli duży plik SQL na mniejsze części
 * Uruchom: node scripts/split-coverage-sql.js
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const INPUT_PATH = join(__dirname, '..', 'supabase', 'coverage-data.sql')
const OUTPUT_DIR = join(__dirname, '..', 'supabase', 'coverage-parts')

// Utwórz folder output
if (!existsSync(OUTPUT_DIR)) {
  mkdirSync(OUTPUT_DIR, { recursive: true })
}

console.log('Czytanie pliku SQL...')
const content = readFileSync(INPUT_PATH, 'utf-8')

// Znajdź wszystkie INSERT statements
const insertRegex = /INSERT INTO coverage.*?;/gs
const matches = content.match(insertRegex)

if (!matches) {
  console.error('Nie znaleziono INSERT statements!')
  process.exit(1)
}

console.log(`Znaleziono ${matches.length} INSERT statements (batches)`)

// Podziel na pliki po 10 batches (10 * 100 = 1000 rekordów)
const batchesPerFile = 10
const files = []

for (let i = 0; i < matches.length; i += batchesPerFile) {
  const fileIndex = Math.floor(i / batchesPerFile) + 1
  const batch = matches.slice(i, i + batchesPerFile)

  const fileContent = `-- Coverage Data Part ${fileIndex}
-- Uruchom w Supabase SQL Editor
-- Część ${fileIndex} z ${Math.ceil(matches.length / batchesPerFile)}

${batch.join('\n\n')}
`

  const fileName = `coverage-data-part-${String(fileIndex).padStart(2, '0')}.sql`
  const filePath = join(OUTPUT_DIR, fileName)

  writeFileSync(filePath, fileContent, 'utf-8')
  files.push(fileName)

  console.log(`✅ Utworzono: ${fileName}`)
}

console.log(`\n🎉 Gotowe! Utworzono ${files.length} plików w: supabase/coverage-parts/`)
console.log('\nKolejność uruchamiania w Supabase SQL Editor:')
files.forEach((f, i) => console.log(`${i + 1}. ${f}`))
