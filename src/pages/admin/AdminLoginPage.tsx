import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Navigate, useNavigate } from "react-router-dom"
import { Loader2, Lock, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/context/AuthContext"
import { loginSchema, type LoginFormData } from "@/lib/admin-schemas"

export default function AdminLoginPage() {
  const { session, loading: authLoading, signIn } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  if (session) {
    return <Navigate to="/admin/dashboard" replace />
  }

  async function onSubmit(data: LoginFormData) {
    setError(null)
    const { error: signInError } = await signIn(data.email, data.password)
    if (signInError) {
      setError("Nieprawidłowy e-mail lub hasło")
    } else {
      navigate("/admin/dashboard", { replace: true })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
        <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Lock className="h-7 w-7 text-primary" />
            </div>
            <h1 className="text-2xl font-bold font-[family-name:var(--font-heading,'Plus_Jakarta_Sans',system-ui)]">
              Panel Admina
            </h1>
            <p className="text-sm text-muted-foreground mt-1">TV-EURO-SAT</p>
          </div>

          {error && (
            <div className="bg-destructive/10 text-destructive text-sm rounded-lg px-4 py-3 mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="admin-email" className="block text-sm font-medium mb-1.5">
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="admin-email"
                  type="email"
                  {...register("email")}
                  placeholder="admin@tveurosat.pl"
                  className="pl-10"
                />
              </div>
              {errors.email && (
                <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="admin-password" className="block text-sm font-medium mb-1.5">
                Hasło
              </label>
              <Input
                id="admin-password"
                type="password"
                {...register("password")}
                placeholder="******"
              />
              {errors.password && (
                <p className="text-sm text-destructive mt-1">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 rounded-xl font-semibold"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logowanie...
                </>
              ) : (
                "Zaloguj się"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
