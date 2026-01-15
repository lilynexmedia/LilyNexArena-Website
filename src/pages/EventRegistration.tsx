import { useParams, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, AlertCircle, Users, CheckCircle, ChevronRight, ChevronLeft, Loader2, Sparkles, ShieldCheck, CreditCard, IndianRupee } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { useEvent } from "@/hooks/useEvents";
import { useEventStatus } from "@/hooks/useEventStatus";
import { useSecondTick } from "@/components/CountdownTimer";
import { cn } from "@/lib/utils";
import { RegistrationStep1 } from "@/components/registration/RegistrationStep1";
import { RegistrationStep2 } from "@/components/registration/RegistrationStep2";
import { RegistrationStep3 } from "@/components/registration/RegistrationStep3";
import { useRegistrationForm } from "@/hooks/useRegistrationForm";

export default function EventRegistration() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: event, isLoading } = useEvent(id);
  const tick = useSecondTick();
  const computedStatus = useEventStatus(event, tick);
  
  const [currentStep, setCurrentStep] = useState(1);
  const { formData, updateFormData, submitRegistration, initiatePayment, isSubmitting, errors, validateStep } = useRegistrationForm(event?.id || "");

  const registrationState = computedStatus?.registrationState || 'closed';
  const isRegistrationAllowed = computedStatus?.isRegistrationOpen && 
    event?.status === 'upcoming' &&
    registrationState === 'open';

  // Get entry amount from event
  const entryAmount = (event as any)?.entry_amount || 0;
  const isPaidEvent = entryAmount > 0;

  // Dynamic steps based on whether event is paid
  const STEPS = [
    { id: 1, title: "Identity", description: "Team & Captain" },
    { id: 2, title: "Squad", description: "Teammates 2-5" },
    { id: 3, title: "Review", description: "Terms & Confirm" },
  ];

  const handleNext = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid && currentStep < 3) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    const result = await submitRegistration();
    
    if (result.success && result.registrationId) {
      if (isPaidEvent) {
        // For paid events, initiate payment
        const paymentSuccess = await initiatePayment(result.registrationId, event?.name || "");
        if (paymentSuccess) {
          navigate(`/events/${id}?registered=success&paid=true`);
        } else {
          // Payment failed/cancelled - show pending message
          navigate(`/events/${id}?registered=pending&payment=required`);
        }
      } else {
        // For free events, go directly to success
        navigate(`/events/${id}?registered=success`);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] text-white">
        <Navbar />
        <main className="pt-32 container mx-auto px-4 max-w-3xl">
          <Skeleton className="h-20 w-full mb-10 rounded-3xl bg-white/5" />
          <Skeleton className="h-[500px] w-full rounded-[2.5rem] bg-white/5" />
        </main>
      </div>
    );
  }

  if (!event || !isRegistrationAllowed) {
    return (
      <div className="min-h-screen bg-[#050505] text-white">
        <Navbar />
        <main className="pt-32 flex items-center justify-center min-h-[60vh] container mx-auto px-4">
          <Card variant="iphone-dark" className="max-w-md p-10 text-center border-destructive/20">
            <AlertCircle className="w-20 h-20 text-destructive mx-auto mb-8" />
            <h1 className="font-display text-4xl font-black mb-6 uppercase italic tracking-tighter">LINK ERROR</h1>
            <p className="text-white/40 mb-10 font-medium">
              {!event ? "The designated arena cannot be located." : "The registration channel for this arena is currently offline."}
            </p>
            <Button asChild variant="iphone" size="lg" className="w-full">
              <Link to="/events">RETURN TO HUB</Link>
            </Button>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-primary/30">
      <Navbar />
      
      <main className="pt-32 pb-32">
        {/* Static Background */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 -left-20 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px]" />
          <div className="absolute bottom-1/4 -right-20 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[150px]" />
        </div>

        <section className="container mx-auto px-4 max-w-3xl relative z-10">
          <div className="mb-8">
            <Link to={`/events/${id}`} className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-primary transition-colors group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              ABORT MISSION
            </Link>
          </div>

          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-xl mb-6">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">Secure Channel</span>
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-black italic tracking-tighter uppercase mb-4">
              SQUAD <span className="text-transparent bg-clip-text bg-gradient-to-b from-primary to-primary/50">ENLISTMENT</span>
            </h1>
            <div className="flex items-center gap-4">
              <p className="text-white/40 font-medium text-lg italic">{event.name}</p>
              {isPaidEvent && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-black">
                  <IndianRupee className="w-3 h-3" />
                  {entryAmount} Entry Fee
                </span>
              )}
            </div>
          </div>

          {/* Progress Steps */}
          <div className="mb-16">
            <div className="relative flex justify-between">
              <div className="absolute top-1/2 left-0 w-full h-1 bg-white/5 -translate-y-1/2 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
                />
              </div>
              
              {STEPS.map((step) => (
                <div key={step.id} className="relative flex flex-col items-center z-10">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm border-2 transition-all duration-300",
                      currentStep >= step.id 
                        ? "bg-primary text-black border-primary" 
                        : "bg-white/5 text-white/30 border-white/10"
                    )}
                  >
                    {currentStep > step.id ? <CheckCircle className="w-6 h-6" /> : step.id}
                  </div>
                  <div className="absolute -bottom-8 whitespace-nowrap">
                    <span className={cn(
                      "text-[9px] font-black uppercase tracking-widest transition-colors duration-300",
                      currentStep >= step.id ? "text-primary" : "text-white/20"
                    )}>
                      {step.title}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Card variant="iphone-dark" className="border-white/5 shadow-3xl overflow-hidden mt-20">
            <div className="p-8 md:p-12">
              <div className="transition-opacity duration-300">
                {currentStep === 1 && (
                  <RegistrationStep1
                    formData={formData}
                    updateFormData={updateFormData}
                    errors={errors}
                  />
                )}
                
                {currentStep === 2 && (
                  <RegistrationStep2
                    formData={formData}
                    updateFormData={updateFormData}
                    errors={errors}
                  />
                )}
                
                {currentStep === 3 && (
                  <RegistrationStep3
                    formData={formData}
                    updateFormData={updateFormData}
                    errors={errors}
                    eventName={event.name}
                  />
                )}
              </div>

              {/* Payment Info Banner (Step 3 only for paid events) */}
              {currentStep === 3 && isPaidEvent && (
                <div className="mt-8 p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                  <div className="flex items-center gap-3 mb-2">
                    <CreditCard className="w-5 h-5 text-amber-400" />
                    <span className="text-sm font-black text-amber-400 uppercase tracking-wide">Payment Required</span>
                  </div>
                  <p className="text-white/60 text-sm">
                    After accepting the terms, you'll be redirected to pay <strong className="text-white">₹{entryAmount}</strong> via Razorpay to complete your registration.
                  </p>
                </div>
              )}

              <div className="flex gap-6 mt-12 pt-12 border-t border-white/5">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="iphone"
                    onClick={handleBack}
                    className="flex-1 h-16 text-xs tracking-widest"
                    disabled={isSubmitting}
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    PREVIOUS
                  </Button>
                )}
                
                {currentStep < 3 ? (
                  <Button
                    type="button"
                    variant="action-pulse"
                    onClick={handleNext}
                    className="flex-1 h-16 text-xs tracking-widest font-black"
                  >
                    NEXT PHASE
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="action-pulse"
                    onClick={handleSubmit}
                    className="flex-1 h-16 text-xs tracking-[0.2em] font-black"
                    disabled={isSubmitting || !formData.termsAccepted}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        {isPaidEvent ? "PROCESSING..." : "UPLOADING..."}
                      </>
                    ) : isPaidEvent ? (
                      <>
                        <CreditCard className="w-5 h-5 mr-2" />
                        PAY ₹{entryAmount} & REGISTER
                      </>
                    ) : (
                      <>
                        <Users className="w-5 h-5 mr-2" />
                        SUBMIT REGISTRATION
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </Card>

          <div className="mt-10 p-6 rounded-3xl bg-white/5 border border-white/5 backdrop-blur-xl flex items-start gap-4">
            <ShieldCheck className="w-6 h-6 text-primary shrink-0" />
            <p className="text-xs text-white/30 font-medium leading-relaxed">
              <strong className="text-white/60 uppercase tracking-widest mr-2">Security Protocol:</strong> 
              {isPaidEvent 
                ? "All payment data is processed securely via Razorpay. Your registration will be confirmed upon successful payment."
                : "All transmission data is encrypted. Mission approval will be dispatched via secure link to the Captain's terminal."
              }
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}