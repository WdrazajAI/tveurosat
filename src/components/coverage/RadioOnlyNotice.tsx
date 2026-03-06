import { useState } from "react"
import { motion } from "framer-motion"
import { AlertTriangle, Send, Loader2, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { CoverageCheckResult } from "@/types"

interface RadioOnlyNoticeProps {
  result: CoverageCheckResult
  onReset: () => void
}

export default function RadioOnlyNotice({
  result,
  onReset,
}: RadioOnlyNoticeProps) {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !phone) return

    setSubmitting(true)
    // Simulated submission — will be replaced with real backend later
    await new Promise((resolve) => setTimeout(resolve, 800))
    setSubmitting(false)
    setSubmitted(true)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Warning Banner */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
        <AlertTriangle className="h-6 w-6 text-amber-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-amber-700 dark:text-amber-400">
            Ograniczona dostępność
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {result.address.city}
            {result.address.street && `, ${result.address.street}`}{" "}
            {result.address.building}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            {result.message}
          </p>
        </div>
      </div>

      {/* Contact form */}
      {!submitted ? (
        <div className="p-5 rounded-xl bg-card border border-border">
          <h4 className="font-semibold mb-1">Zgłoś zainteresowanie</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Zostaw swoje dane — skontaktujemy się, gdy pojawi się nowa
            technologia w Twojej okolicy.
          </p>
          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setName(e.target.value)
              }
              placeholder="Imię i nazwisko"
              required
            />
            <Input
              type="tel"
              value={phone}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPhone(e.target.value)
              }
              placeholder="Numer telefonu"
              required
            />
            <Input
              type="email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              placeholder="E-mail (opcjonalnie)"
            />
            <Button
              type="submit"
              disabled={submitting || !name || !phone}
              className="w-full"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Wysyłam...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Zgłoś swój adres
                </>
              )}
            </Button>
          </form>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-start gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/20"
        >
          <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-green-700 dark:text-green-400">
              Dziękujemy za zgłoszenie!
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Skontaktujemy się z Tobą, gdy pojawi się nowa technologia pod
              Twoim adresem.
            </p>
          </div>
        </motion.div>
      )}

      {/* Reset */}
      <Button variant="outline" onClick={onReset} className="w-full">
        Sprawdź inny adres
      </Button>
    </motion.div>
  )
}
