import React, { useState } from "react"
import { motion } from "framer-motion"
import { AlertCircle, Send, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface OutOfCoverageInfoProps {
  message: string
  onReset: () => void
}

export default function OutOfCoverageInfo({ message, onReset }: OutOfCoverageInfoProps) {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [submitted, setSubmitted] = useState(false)

  function handleNotifySubmit(e: React.FormEvent) {
    e.preventDefault()
    // MVP: just show success toast
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
        <AlertCircle className="h-6 w-6 text-amber-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-amber-700 dark:text-amber-400">
            Poza zasięgiem
          </p>
          <p className="text-sm text-muted-foreground mt-1">{message}</p>
        </div>
      </div>

      {/* Notify Me Form */}
      {!submitted ? (
        <div className="p-5 rounded-xl bg-muted/50 border border-border">
          <h4 className="font-semibold mb-1">Powiadomimy Cię!</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Stale rozszerzamy naszą sieć. Zostaw dane kontaktowe, a odezwiemy się gdy pojawi się dostępność w Twojej okolicy.
          </p>
          <form onSubmit={handleNotifySubmit} className="space-y-3">
            <Input
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              placeholder="Imię i nazwisko"
              required
            />
            <Input
              type="tel"
              value={phone}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
              placeholder="Numer telefonu"
              required
            />
            <Button type="submit" className="w-full" disabled={!name || !phone}>
              <Send className="mr-2 h-4 w-4" />
              Powiadom mnie
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
              Dziękujemy!
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Zapisaliśmy Twoje dane. Skontaktujemy się, gdy rozszerzymy sieć w Twojej okolicy.
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
