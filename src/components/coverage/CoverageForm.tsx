import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, MapPin, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getCitySuggestions, getStreetSuggestions, checkCoverage } from "@/data/coverage"
import type { CoverageResult } from "@/types"

interface CoverageFormProps {
  onResult: (result: CoverageResult) => void
  compact?: boolean
}

export default function CoverageForm({ onResult, compact }: CoverageFormProps) {
  const [city, setCity] = useState("")
  const [street, setStreet] = useState("")
  const [building, setBuilding] = useState("")
  const [loading, setLoading] = useState(false)
  const [citySuggestions, setCitySuggestions] = useState<string[]>([])
  const [streetSuggestions, setStreetSuggestions] = useState<string[]>([])
  const [showCitySuggestions, setShowCitySuggestions] = useState(false)
  const [showStreetSuggestions, setShowStreetSuggestions] = useState(false)

  const cityRef = useRef<HTMLDivElement>(null)
  const streetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (city.length >= 2) {
      setCitySuggestions(getCitySuggestions(city))
    } else {
      setCitySuggestions([])
    }
  }, [city])

  useEffect(() => {
    if (city && street.length >= 1) {
      setStreetSuggestions(getStreetSuggestions(city, street))
    } else {
      setStreetSuggestions([])
    }
  }, [city, street])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (cityRef.current && !cityRef.current.contains(event.target as Node)) {
        setShowCitySuggestions(false)
      }
      if (streetRef.current && !streetRef.current.contains(event.target as Node)) {
        setShowStreetSuggestions(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!city || !street || !building) return

    setLoading(true)
    // Simulate a brief delay for UX
    setTimeout(() => {
      const result = checkCoverage(city, street, building)
      onResult(result)
      setLoading(false)
    }, 600)
  }

  return (
    <form onSubmit={handleSubmit} className={compact ? "space-y-3" : "space-y-4"}>
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
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCity(e.target.value)}
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
                <li key={s}>
                  <button
                    type="button"
                    className="w-full px-4 py-2.5 text-sm text-left hover:bg-accent transition-colors"
                    onClick={() => {
                      setCity(s)
                      setShowCitySuggestions(false)
                    }}
                  >
                    {s}
                  </button>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      {/* Street */}
      <div ref={streetRef} className="relative">
        <label htmlFor="cov-street" className="block text-sm font-medium mb-1.5">
          Ulica
        </label>
        <Input
          id="cov-street"
          value={street}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStreet(e.target.value)}
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
              className="absolute z-20 mt-1 w-full bg-card border border-border rounded-lg shadow-lg overflow-hidden"
            >
              {streetSuggestions.map((s) => (
                <li key={s}>
                  <button
                    type="button"
                    className="w-full px-4 py-2.5 text-sm text-left hover:bg-accent transition-colors"
                    onClick={() => {
                      setStreet(s)
                      setShowStreetSuggestions(false)
                    }}
                  >
                    {s}
                  </button>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      {/* Building number */}
      <div>
        <label htmlFor="cov-building" className="block text-sm font-medium mb-1.5">
          Numer domu
        </label>
        <Input
          id="cov-building"
          value={building}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBuilding(e.target.value)}
          placeholder="np. 12A"
          autoComplete="off"
        />
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={loading || !city || !street || !building}
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
