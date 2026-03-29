import { useState, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import ReCAPTCHA from "react-google-recaptcha"
import { Send, CheckCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { contactFormSchema, contactSubjects, type ContactFormData } from "@/lib/form-schemas"
import { supabase } from "@/lib/supabase"
import { useTheme } from "@/context/ThemeContext"

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const recaptchaRef = useRef<ReCAPTCHA>(null)
  const { theme } = useTheme()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      consent: false,
      honeypot: "",
    },
  })

  async function onSubmit(data: ContactFormData) {
    if (data.honeypot) return
    if (!captchaToken) {
      setSubmitError("Proszę potwierdzić, że nie jesteś robotem.")
      return
    }
    setSubmitError(null)

    try {
      // Save to Supabase
      const { error: dbError } = await supabase.from("contact_messages").insert({
        name: data.name,
        email: data.email,
        phone: data.phone,
        subject: data.subject,
        message: data.message,
      })

      if (dbError) throw new Error(dbError.message)

      // Send email notification to admin via Edge Function
      try {
        await supabase.functions.invoke("send-contact-email", {
          body: {
            name: data.name,
            email: data.email,
            phone: data.phone,
            subject: data.subject,
            message: data.message,
            captchaToken,
          },
        })
      } catch {
        // Email is secondary - don't fail if it doesn't work
        console.warn("Email notification failed, but message was saved")
      }

      setSubmitted(true)
    } catch (err) {
      console.error("Contact form error:", err)
      setSubmitError("Wystąpił błąd podczas wysyłania wiadomości. Spróbuj ponownie.")
      recaptchaRef.current?.reset()
      setCaptchaToken(null)
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-8">
        <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
          <CheckCircle className="h-8 w-8 text-green-500" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Wiadomość wysłana!</h3>
        <p className="text-muted-foreground">
          Dziękujemy za kontakt. Odpowiemy najszybciej jak to możliwe.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Honeypot - hidden from users */}
      <div className="sr-only" aria-hidden="true">
        <input type="text" tabIndex={-1} {...register("honeypot")} />
      </div>

      {/* Row 1: Name + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="contact-name" className="block text-sm font-medium mb-1.5">
            Imię i nazwisko *
          </label>
          <Input
            id="contact-name"
            {...register("name")}
            placeholder="Jan Kowalski"
          />
          {errors.name && (
            <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="contact-email" className="block text-sm font-medium mb-1.5">
            Adres e-mail *
          </label>
          <Input
            id="contact-email"
            type="email"
            {...register("email")}
            placeholder="jan@example.com"
          />
          {errors.email && (
            <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
          )}
        </div>
      </div>

      {/* Row 2: Phone + Subject */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="contact-phone" className="block text-sm font-medium mb-1.5">
            Numer telefonu *
          </label>
          <Input
            id="contact-phone"
            type="tel"
            {...register("phone")}
            placeholder="+48 123 456 789"
          />
          {errors.phone && (
            <p className="text-sm text-destructive mt-1">{errors.phone.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="contact-subject" className="block text-sm font-medium mb-1.5">
            Temat *
          </label>
          <select
            id="contact-subject"
            {...register("subject")}
            className="w-full h-10 px-3 rounded-md border border-input bg-transparent text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none"
          >
            <option value="">Wybierz temat...</option>
            {contactSubjects.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          {errors.subject && (
            <p className="text-sm text-destructive mt-1">{errors.subject.message}</p>
          )}
        </div>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="contact-message" className="block text-sm font-medium mb-1.5">
          Wiadomość *
        </label>
        <Textarea
          id="contact-message"
          {...register("message")}
          placeholder="Opisz swoje pytanie lub problem..."
          rows={5}
        />
        {errors.message && (
          <p className="text-sm text-destructive mt-1">{errors.message.message}</p>
        )}
      </div>

      {/* Consent */}
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          id="contact-consent"
          {...register("consent")}
          className="mt-1 h-4 w-4 rounded border-input accent-primary"
        />
        <label htmlFor="contact-consent" className="text-sm text-muted-foreground leading-relaxed">
          Wyrażam zgodę na przetwarzanie moich danych osobowych w celu obsługi
          zapytania. *
        </label>
      </div>
      {errors.consent && (
        <p className="text-sm text-destructive -mt-3">{errors.consent.message}</p>
      )}

      {/* reCAPTCHA */}
      {import.meta.env.VITE_RECAPTCHA_SITE_KEY && (
        <div className="flex justify-center">
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
            onChange={(token) => setCaptchaToken(token)}
            onExpired={() => setCaptchaToken(null)}
            onErrored={() => setCaptchaToken(null)}
            theme={theme === "dark" ? "dark" : "light"}
          />
        </div>
      )}

      {/* Submit */}
      <Button type="submit" disabled={isSubmitting} className="w-full h-12 rounded-xl font-semibold">
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Wysyłam...
          </>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            Wyślij wiadomość
          </>
        )}
      </Button>

      {submitError && (
        <p className="text-sm text-destructive text-center mt-2">{submitError}</p>
      )}
    </form>
  )
}
