import { useMemo } from "react"
import { motion } from "framer-motion"
import { MapPin, Layers, ListChecks, Wifi, Tv, ClipboardCheck } from "lucide-react"
import type { ServiceChoice } from "./ServiceSelector"

type FlowStep =
  | "address"
  | "results"
  | "service"
  | "internet"
  | "tv"
  | "summary"

interface OfferProgressProps {
  currentStep: FlowStep
  serviceChoice?: ServiceChoice
}

interface StepDef {
  key: FlowStep
  label: string
  icon: React.ElementType
}

const allSteps: Record<FlowStep, StepDef> = {
  address: { key: "address", label: "Adres", icon: MapPin },
  results: { key: "results", label: "Technologia", icon: Layers },
  service: { key: "service", label: "Usługa", icon: ListChecks },
  internet: { key: "internet", label: "Internet", icon: Wifi },
  tv: { key: "tv", label: "Telewizja", icon: Tv },
  summary: { key: "summary", label: "Podsumowanie", icon: ClipboardCheck },
}

function getStepsForChoice(choice: ServiceChoice): StepDef[] {
  const base: StepDef[] = [allSteps.address, allSteps.results, allSteps.service]

  switch (choice) {
    case "internet":
      return [...base, allSteps.internet, allSteps.summary]
    case "tv":
      return [...base, allSteps.tv, allSteps.summary]
    case "both":
    default:
      return [...base, allSteps.internet, allSteps.tv, allSteps.summary]
  }
}

export default function OfferProgress({
  currentStep,
  serviceChoice = "both",
}: OfferProgressProps) {
  const steps = useMemo(() => getStepsForChoice(serviceChoice), [serviceChoice])
  const stepOrder = useMemo(() => steps.map((s) => s.key), [steps])
  const currentIdx = stepOrder.indexOf(currentStep)

  return (
    <div className="mb-8 sm:mb-10">
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        {steps.map((step, idx) => {
          const isActive = idx === currentIdx
          const isCompleted = idx < currentIdx
          const Icon = step.icon

          return (
            <div key={step.key} className="flex items-center">
              <div className="flex flex-col items-center gap-1.5">
                <motion.div
                  animate={{
                    scale: isActive ? 1.1 : 1,
                    backgroundColor: isActive
                      ? "hsl(var(--primary))"
                      : isCompleted
                        ? "hsl(var(--primary))"
                        : "hsl(var(--muted))",
                  }}
                  transition={{ duration: 0.3 }}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center"
                >
                  <Icon
                    className={`h-4 w-4 sm:h-5 sm:w-5 ${
                      isActive || isCompleted
                        ? "text-white"
                        : "text-muted-foreground"
                    }`}
                  />
                </motion.div>
                <span
                  className={`text-[10px] sm:text-xs font-medium ${
                    isActive
                      ? "text-primary"
                      : isCompleted
                        ? "text-foreground"
                        : "text-muted-foreground"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {/* Connector line */}
              {idx < steps.length - 1 && (
                <div
                  className={`h-0.5 w-6 sm:w-10 lg:w-14 mx-1 sm:mx-2 mb-5 ${
                    idx < currentIdx ? "bg-primary" : "bg-muted"
                  }`}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
