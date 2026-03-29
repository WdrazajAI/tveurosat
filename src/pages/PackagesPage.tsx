import { useState, useCallback, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import PageHero from "@/components/layout/PageHero"
import CoverageForm from "@/components/coverage/CoverageForm"
import CoverageResult from "@/components/coverage/CoverageResult"
import OfferProgress from "@/components/packages/OfferProgress"
import TechnologyOverview from "@/components/packages/TechnologyOverview"
import ServiceSelector from "@/components/packages/ServiceSelector"
import type { ServiceChoice } from "@/components/packages/ServiceSelector"
import InternetPackageSelector from "@/components/packages/InternetPackageSelector"
import TVAddonSelector from "@/components/packages/TVAddonSelector"
import OrderSummary from "@/components/packages/OrderSummary"
import { allTVPackages } from "@/data/packages"
import type {
  CoverageCheckResult,
  InternetPackage,
  TVPackage,
  TVAddon,
  ContractPeriod,
} from "@/types"

export type FlowStep =
  | "address"
  | "results"
  | "service"
  | "internet"
  | "tv"
  | "summary"

export default function PackagesPage() {
  const [step, setStep] = useState<FlowStep>("address")
  const [coverageResult, setCoverageResult] =
    useState<CoverageCheckResult | null>(null)
  const [serviceChoice, setServiceChoice] = useState<ServiceChoice>("both")
  const [selectedInternet, setSelectedInternet] =
    useState<InternetPackage | null>(null)
  const [selectedPeriod, setSelectedPeriod] = useState<ContractPeriod>("24m")
  const [selectedTV, setSelectedTV] = useState<TVPackage | null>(null)
  const [selectedTVPeriod, setSelectedTVPeriod] =
    useState<ContractPeriod>("24m")
  const [selectedTVAddons, setSelectedTVAddons] = useState<TVAddon[]>([])

  const location = useLocation()

  const handleCoverageResult = useCallback(
    (result: CoverageCheckResult) => {
      setCoverageResult(result)
      if (result.status === "covered") {
        if (result.technologies.length === 1) {
          setStep("service")
        } else {
          setStep("results")
        }
      }
      // not_covered stays on address step with result shown
    },
    []
  )

  // Auto-advance if coverage data was passed from homepage
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const navState = location.state as { coverageResult?: CoverageCheckResult } | null
    if (navState?.coverageResult) {
      handleCoverageResult(navState.coverageResult)
      window.history.replaceState({}, "", location.pathname)
    }
  }, [])

  const handleReset = useCallback(() => {
    setCoverageResult(null)
    setSelectedInternet(null)
    setSelectedTV(null)
    setSelectedTVAddons([])
    setServiceChoice("both")
    setStep("address")
  }, [])

  const handleProceedFromTech = useCallback(() => {
    setStep("service")
  }, [])

  const handleServiceSelected = useCallback(
    (choice: ServiceChoice) => {
      setServiceChoice(choice)
      if (choice === "internet" || choice === "both") {
        setStep("internet")
      } else {
        // TV only — skip internet
        setSelectedInternet(null)
        setStep("tv")
      }
    },
    []
  )

  const handleInternetSelected = useCallback(
    (pkg: InternetPackage, period: ContractPeriod) => {
      setSelectedInternet(pkg)
      setSelectedPeriod(period)
      if (serviceChoice === "both") {
        setStep("tv")
      } else {
        // Internet only — skip TV
        setSelectedTV(null)
        setStep("summary")
      }
    },
    [serviceChoice]
  )

  const handleTVSelected = useCallback(
    (pkg: TVPackage, period: ContractPeriod, addons: TVAddon[]) => {
      setSelectedTV(pkg)
      setSelectedTVPeriod(period)
      setSelectedTVAddons(addons)
      setStep("summary")
    },
    []
  )

  const handleSkipTV = useCallback(() => {
    setSelectedTV(null)
    setStep("summary")
  }, [])

  // Service availability based on address technology
  const hasTVOptions =
    coverageResult?.status === "covered" &&
    coverageResult.tvAvailable &&
    allTVPackages.length > 0

  const hasInternetOptions =
    coverageResult?.status === "covered" &&
    coverageResult.internetAvailable

  // Determine effective step for progress indicator
  const effectiveStep =
    step === "address" && coverageResult && coverageResult.status !== "covered"
      ? "address"
      : step

  return (
    <>
      <PageHero
        title="Sprawdź Ofertę"
        subtitle="Wprowadź swój adres, aby zobaczyć dostępne pakiety i ceny w Twojej lokalizacji."
        breadcrumbs={[{ label: "Oferta" }]}
      />

      <section className="pt-6 pb-12 sm:pt-8 sm:pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <OfferProgress currentStep={effectiveStep} serviceChoice={serviceChoice} />

          <AnimatePresence mode="wait">
            {/* Step: Address */}
            {step === "address" && (
              <StepWrapper key="address">
                {!coverageResult ? (
                  <div className="max-w-xl mx-auto">
                    <CoverageForm onResult={handleCoverageResult} />
                  </div>
                ) : (
                  <div className="max-w-xl mx-auto">
                    <CoverageResult
                      result={coverageResult}
                      onReset={handleReset}
                    />
                  </div>
                )}
              </StepWrapper>
            )}

            {/* Step: Technology Overview */}
            {step === "results" && coverageResult && (
              <StepWrapper key="results">
                <TechnologyOverview
                  result={coverageResult}
                  onProceed={handleProceedFromTech}
                  onReset={handleReset}
                />
              </StepWrapper>
            )}

            {/* Step: Service Selection */}
            {step === "service" && coverageResult && (
              <StepWrapper key="service">
                <ServiceSelector
                  onSelect={handleServiceSelected}
                  onBack={() =>
                    setStep(
                      coverageResult.technologies.length > 1
                        ? "results"
                        : "address"
                    )
                  }
                  hasTVOptions={hasTVOptions}
                  hasInternetOptions={hasInternetOptions}
                />
              </StepWrapper>
            )}

            {/* Step: Internet Package Selection */}
            {step === "internet" && coverageResult && (
              <StepWrapper key="internet">
                <InternetPackageSelector
                  technologies={coverageResult.technologies}
                  maxSpeeds={coverageResult.maxSpeeds}
                  onSelect={handleInternetSelected}
                  onBack={() => setStep("service")}
                />
              </StepWrapper>
            )}

            {/* Step: TV Selection */}
            {step === "tv" && coverageResult && (
              <StepWrapper key="tv">
                <TVAddonSelector
                  tvDeliveryTypes={coverageResult.tvDeliveryTypes}
                  onSelect={handleTVSelected}
                  onSkip={serviceChoice === "both" ? handleSkipTV : undefined}
                  onBack={() =>
                    serviceChoice === "tv"
                      ? setStep("service")
                      : setStep("internet")
                  }
                />
              </StepWrapper>
            )}

            {/* Step: Summary */}
            {step === "summary" &&
              coverageResult &&
              (selectedInternet || selectedTV) && (
                <StepWrapper key="summary">
                  <OrderSummary
                    address={coverageResult.address}
                    internetPackage={selectedInternet}
                    internetPeriod={selectedPeriod}
                    tvPackage={selectedTV}
                    tvPeriod={selectedTVPeriod}
                    tvAddons={selectedTVAddons}
                    onBack={() =>
                      serviceChoice === "internet"
                        ? setStep("internet")
                        : setStep("tv")
                    }
                    onReset={handleReset}
                  />
                </StepWrapper>
              )}
          </AnimatePresence>
        </div>
      </section>
    </>
  )
}

function StepWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35 }}
    >
      {children}
    </motion.div>
  )
}
