import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, MapPin, Loader2, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  getCitySuggestions,
  getStreetSuggestions,
  getBuildingSuggestions,
  cityHasStreets,
  checkCoverage,
} from "@/data/coverage"
import type { CoverageCheckResult, CoverageCity } from "@/types"

interface CoverageFormProps {
  onResult: (result: CoverageCheckResult) => void
  compact?: boolean
}

export default function CoverageForm({ onResult, compact }: CoverageFormProps) {
  const [city, setCity] = useState("")
  const [street, setStreet] = useState("")
  const [building, setBuilding] = useState("")
  const [loading, setLoading] = useState(false)

  const [citySuggestions, setCitySuggestions] = useState<CoverageCity[]>([])
  const [streetSuggestions, setStreetSuggestions] = useState<string[]>([])
  const [buildingSuggestions, setBuildingSuggestions] = useState<string[]>([])

  const [showCitySuggestions, setShowCitySuggestions] = useState(false)
  const [showStreetSuggestions, setShowStreetSuggestions] = useState(false)
  const [showBuildingSuggestions, setShowBuildingSuggestions] = useState(false)

  const [hasStreets, setHasStreets] = useState(true)
  const [citySelected, setCitySelected] = useState(false)

  const cityRef = useRef<HTMLDivElement>(null)
  const streetRef = useRef<HTMLDivElement>(null)
  const buildingRef = useRef<HTMLDivElement>(null)
  const streetInputRef = useRef<HTMLInputElement>(null)
  const buildingInputRef = useRef<HTMLInputElement>(null)

  // City autocomplete
  useEffect(() => {
    if (city.length < 2) {
      setCitySuggestions([])
      return
    }
    let cancelled = false
    getCitySuggestions(city).then((results) => {
      if (!cancelled) setCitySuggestions(results)
    })
    return () => { cancelled = true }
  }, [city])

  // Street autocomplete
  useEffect(() => {
    if (!citySelected || !hasStreets || street.length < 1) {
      setStreetSuggestions([])
      return
    }
    let cancelled = false
    getStreetSuggestions(city, street).then((results) => {
      if (!cancelled) setStreetSuggestions(results)
    })
    return () => { cancelled = true }
  }, [city, street, citySelected, hasStreets])

  // Building autocomplete
  useEffect(() => {
    if (!citySelected) {
      setBuildingSuggestions([])
      return
    }
    // For villages without streets, show buildings when city is selected
    // For cities with streets, show buildings when street is entered
    if (hasStreets && !street) {
      setBuildingSuggestions([])
      return
    }
    let cancelled = false
    getBuildingSuggestions(city, hasStreets ? street : "").then((results) => {
      if (!cancelled) setBuildingSuggestions(results)
    })
    return () => { cancelled = true }
  }, [city, street, citySelected, hasStreets])

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (cityRef.current && !cityRef.current.contains(event.target as Node)) {
        setShowCitySuggestions(false)
      }
      if (
        streetRef.current &&
        !streetRef.current.contains(event.target as Node)
      ) {
        setShowStreetSuggestions(false)
      }
      if (
        buildingRef.current &&
        !buildingRef.current.contains(event.target as Node)
      ) {
        setShowBuildingSuggestions(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleCitySelect = useCallback(
    async (selected: CoverageCity) => {
      setCity(selected.name)
      setCitySelected(true)
      setShowCitySuggestions(false)
      setStreet("")
      setBuilding("")

      const streets = await cityHasStreets(selected.name)
      setHasStreets(streets)

      // Focus next field
      if (streets) {
        setTimeout(() => streetInputRef.current?.focus(), 100)
      } else {
        setTimeout(() => buildingInputRef.current?.focus(), 100)
      }
    },
    []
  )

  const handleCityChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setCity(e.target.value)
      setCitySelected(false)
      setHasStreets(true)
      setStreet("")
      setBuilding("")
    },
    []
  )

  const handleStreetSelect = useCallback((selected: string) => {
    setStreet(selected)
    setShowStreetSuggestions(false)
    setBuilding("")
    setTimeout(() => buildingInputRef.current?.focus(), 100)
  }, [])

  const handleBuildingSelect = useCallback((selected: string) => {
    setBuilding(selected)
    setShowBuildingSuggestions(false)
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const canSubmit = city && building && (hasStreets ? street : true)
    if (!canSubmit) return

    setLoading(true)
    try {
      const result = await checkCoverage(
        city,
        hasStreets ? street : "",
        building
      )
      onResult(result)
    } finally {
      setLoading(false)
    }
  }

  const canSubmit = citySelected && building && (hasStreets ? street : true)

  return (
    <form
      onSubmit={handleSubmit}
      className={compact ? "space-y-3" : "space-y-4"}
    >
      {/* City */}
      <div ref={cityRef} className="relative">
        <label htmlFor="cov-city" className="block text-sm font-medium mb-1.5">
          Miejscowość
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="cov-city"
            value={city}
            onChange={handleCityChange}
            onFocus={() => setShowCitySuggestions(true)}
            placeholder="np. Małkinia Górna"
            className="pl-10"
            autoComplete="off"
          />
        </div>
        <AnimatePresence>
          {showCitySuggestions && citySuggestions.length > 0 && (
            <motion.ul
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="absolute z-20 mt-1 w-full bg-card border border-border rounded-lg shadow-lg overflow-hidden"
            >
              {citySuggestions.map((s) => (
                <li key={s.normalized}>
                  <button
                    type="button"
                    className="w-full px-4 py-2.5 text-sm text-left hover:bg-accent transition-colors"
                    onClick={() => handleCitySelect(s)}
                  >
                    {s.name}
                  </button>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      {/* Street — hidden for villages without streets */}
      <AnimatePresence>
        {hasStreets && citySelected && (
          <motion.div
            ref={streetRef}
            className="relative"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <label
              htmlFor="cov-street"
              className="block text-sm font-medium mb-1.5"
            >
              Ulica
            </label>
            <Input
              id="cov-street"
              ref={streetInputRef}
              value={street}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setStreet(e.target.value)
              }
              onFocus={() => setShowStreetSuggestions(true)}
              placeholder="np. Główna"
              autoComplete="off"
            />
            <AnimatePresence>
              {showStreetSuggestions && streetSuggestions.length > 0 && (
                <motion.ul
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="absolute z-20 mt-1 w-full bg-card border border-border rounded-lg shadow-lg overflow-hidden max-h-48 overflow-y-auto"
                >
                  {streetSuggestions.map((s) => (
                    <li key={s}>
                      <button
                        type="button"
                        className="w-full px-4 py-2.5 text-sm text-left hover:bg-accent transition-colors"
                        onClick={() => handleStreetSelect(s)}
                      >
                        {s}
                      </button>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* No street notice */}
      <AnimatePresence>
        {!hasStreets && citySelected && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-xs text-muted-foreground italic"
          >
            Ta miejscowość nie posiada ulic — wpisz numer domu.
          </motion.p>
        )}
      </AnimatePresence>

      {/* Building number */}
      {citySelected && (
        <div ref={buildingRef} className="relative">
          <label
            htmlFor="cov-building"
            className="block text-sm font-medium mb-1.5"
          >
            Numer domu
          </label>
          <div className="relative">
            <Home className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="cov-building"
              ref={buildingInputRef}
              value={building}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setBuilding(e.target.value)
              }
              onFocus={() => setShowBuildingSuggestions(true)}
              placeholder="np. 12A"
              className="pl-10"
              autoComplete="off"
            />
          </div>
          <AnimatePresence>
            {showBuildingSuggestions && buildingSuggestions.length > 0 && (
              <motion.ul
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="absolute z-20 mt-1 w-full bg-card border border-border rounded-lg shadow-lg overflow-hidden max-h-48 overflow-y-auto"
              >
                {buildingSuggestions
                  .filter((b) =>
                    b.toLowerCase().startsWith(building.toLowerCase())
                  )
                  .slice(0, 20)
                  .map((b) => (
                    <li key={b}>
                      <button
                        type="button"
                        className="w-full px-4 py-2.5 text-sm text-left hover:bg-accent transition-colors"
                        onClick={() => handleBuildingSelect(b)}
                      >
                        {b}
                      </button>
                    </li>
                  ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Submit */}
      <Button
        type="submit"
        disabled={loading || !canSubmit}
        className="w-full mt-2 h-12 bg-primary text-white font-semibold rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none disabled:opacity-70"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sprawdzam...
          </>
        ) : (
          <>
            <Search className="mr-2 h-4 w-4" />
            Sprawdź Dostępność
          </>
        )}
      </Button>
    </form>
  )
}
