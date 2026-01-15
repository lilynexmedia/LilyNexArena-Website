import { useParams, Link } from "react-router-dom";
import { 
  Calendar, Trophy, Users, Clock, ArrowLeft, 
  Radio, CheckCircle, XCircle, AlertCircle,
  Shield, Sparkles, Image as ImageIcon
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useEvent } from "@/hooks/useEvents";
import { useEventStatus, getRegistrationButtonText } from "@/hooks/useEventStatus";
import { CountdownTimer, useSecondTick } from "@/components/CountdownTimer";
import { EventGallery } from "@/components/event/EventGallery";
import { WinnersSection } from "@/components/event/WinnersSection";
import { PrizeDistributionSection } from "@/components/event/PrizeDistributionSection";
import { EventStatus } from "@/lib/types";
import { formatDateIST, formatTimeIST } from "@/lib/timezone";

const statusConfig: Record<EventStatus, { label: string; className: string; icon: typeof Calendar }> = {
  upcoming: { label: "Upcoming", className: "bg-blue-500/20 text-blue-400 border-blue-500/30", icon: Calendar },
  live: { label: "Live Now", className: "bg-red-500/20 text-red-400 border-red-500/30", icon: Radio },
  past: { label: "Completed", className: "bg-green-500/20 text-green-400 border-green-500/30", icon: CheckCircle },
  closed: { label: "Closed", className: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30", icon: XCircle },
};

// Loading Skeleton Component
function EventDetailSkeleton() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      <main className="pt-24 md:pt-32 pb-32 container mx-auto px-4">
        <Skeleton className="h-6 w-32 mb-10 bg-white/5" />
        <Card variant="iphone-dark" className="overflow-hidden border-white/5 mb-16">
          <Skeleton className="aspect-video md:aspect-[21/7] w-full bg-white/5" />
          <div className="p-6 md:p-16">
            <div className="flex gap-4 mb-10 overflow-x-auto">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-10 w-24 rounded-xl bg-white/5 shrink-0" />
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2 space-y-16">
                <div className="space-y-4">
                  <Skeleton className="h-12 w-48 bg-white/5" />
                  <Skeleton className="h-6 w-full bg-white/5" />
                  <Skeleton className="h-6 w-3/4 bg-white/5" />
                  <Skeleton className="h-6 w-1/2 bg-white/5" />
                </div>
                <div className="grid grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <Skeleton className="h-10 w-32 bg-white/5" />
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-12 w-full bg-white/5 rounded-xl" />
                    ))}
                  </div>
                  <div className="space-y-4">
                    <Skeleton className="h-10 w-32 bg-white/5" />
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-6 w-full bg-white/5" />
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <Card variant="iphone-dark" className="p-10 border-white/5 bg-white/5">
                  <div className="space-y-8">
                    <Skeleton className="h-16 w-32 bg-white/10" />
                    <Skeleton className="h-px w-full bg-white/5" />
                    <div className="space-y-4">
                      <Skeleton className="h-8 w-24 bg-white/10" />
                      <Skeleton className="h-3 w-full rounded-full bg-white/10" />
                    </div>
                    <Skeleton className="h-20 w-full rounded-2xl bg-white/10" />
                    <Skeleton className="h-20 w-full rounded-xl bg-white/10" />
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}

export default function EventDetail() {
  const { id } = useParams();
  const { data: event, isLoading } = useEvent(id);
  const tick = useSecondTick();
  const computedStatus = useEventStatus(event, tick);

  if (isLoading) {
    return <EventDetailSkeleton />;
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-[#050505] text-white">
        <Navbar />
        <main className="pt-32 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <h1 className="font-display text-4xl font-black mb-4 uppercase italic">BATTLE NOT FOUND</h1>
            <Button asChild variant="iphone">
              <Link to="/events">RETURN TO HUB</Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const currentStatus = computedStatus?.status || event.status;
  const status = statusConfig[currentStatus];
  const StatusIcon = status.icon;
  
  const slotsAvailable = event.team_slots - (event.approvedTeamCount || 0);
  const registrationState = computedStatus?.registrationState || 'closed';
  const isRegistrationDisabled = !computedStatus?.isRegistrationOpen || slotsAvailable <= 0;
  const registrationButtonText = getRegistrationButtonText(registrationState, slotsAvailable);

  const posterImage = event.image_url || "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&q=80";

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-primary/30 overflow-x-hidden">
      <Navbar />

      <main className="pt-24 md:pt-32 pb-32 md:pb-32 mb-20 md:mb-0">
        {/* Static Background */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[160px] opacity-40" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[160px] opacity-40" />
        </div>

        <section className="container mx-auto px-4 relative z-10">
          <div className="mb-6">
            <Link to="/events" className="inline-flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.2em] text-white/50 hover:text-primary transition-colors group">
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
              BACK TO HUB
            </Link>
          </div>

          <Card variant="iphone-dark" className="overflow-hidden border-white/5 mb-10">
            <div className="relative aspect-video md:aspect-[21/8] overflow-hidden">
              <img src={posterImage} alt={event.name} className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              
              <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={cn(
                      "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[8px] md:text-[9px] font-bold uppercase tracking-wider border backdrop-blur-sm shadow-lg",
                      status.className
                    )}>
                      <StatusIcon className="w-2.5 h-2.5" />
                      {status.label}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-[8px] md:text-[9px] font-bold uppercase tracking-wider bg-primary text-black">
                      {event.game}
                    </span>
                  </div>
                  <h1 className="font-display text-2xl sm:text-3xl md:text-5xl font-black italic uppercase tracking-tighter drop-shadow-xl leading-[0.95]">
                    {event.name}
                  </h1>
                </div>
                
                <div className="flex items-center w-full md:w-auto">
                  <Button 
                    variant={isRegistrationDisabled ? "iphone" : "action-pulse"} 
                    size="xl"
                    disabled={isRegistrationDisabled}
                    asChild={!isRegistrationDisabled}
                    className="h-10 md:h-12 px-5 md:px-8 text-sm md:text-base tracking-[0.15em] font-bold w-full md:w-auto"
                  >
                    {!isRegistrationDisabled ? (
                      <Link to={`/events/${id}/register`}>
                        {registrationButtonText}
                      </Link>
                    ) : (
                      <span>{registrationButtonText}</span>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-4 md:p-8">
              {/* Sticky Filter Bar */}
              <div className="sticky top-[72px] md:top-[88px] z-30 -mx-4 md:-mx-8 px-4 md:px-8 py-3 bg-black/80 backdrop-blur-xl border-b border-white/5 mb-6 md:mb-10 overflow-x-auto no-scrollbar flex items-center gap-3 md:gap-6 scroll-smooth">
                {[
                  { id: 'intel', label: 'Intel', icon: Sparkles },
                  { id: 'prize', label: 'Prize', icon: Trophy },
                  { id: 'rules', label: 'Rules', icon: Shield },
                  ...(event.gallery?.length ? [{ id: 'gallery', label: 'Archives', icon: ImageIcon }] : []),
                  ...(event.winners?.length || currentStatus === 'past' ? [{ id: 'winners', label: 'Champions', icon: Trophy }] : []),
                ].map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[8px] md:text-[9px] font-bold uppercase tracking-widest text-white/50 hover:text-primary hover:border-primary/30 transition-all whitespace-nowrap"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }}
                  >
                    <section.icon className="w-2.5 h-2.5" />
                    {section.label}
                  </a>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10">
                <div className="lg:col-span-2 space-y-10">
                  {/* Live Stream */}
                  {currentStatus === 'live' && event.youtube_stream_id && (
                    <div id="live" className="space-y-4 scroll-mt-32">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-red-500/10 flex items-center justify-center border border-red-500/20">
                          <Radio className="w-4 h-4 text-red-500" />
                        </div>
                        <h2 className="font-display text-xl md:text-2xl font-black uppercase italic tracking-tight">LIVE TRANSMISSION</h2>
                      </div>
                      <div className="aspect-video rounded-xl overflow-hidden border border-white/5 shadow-lg">
                        <iframe
                          src={`https://www.youtube.com/embed/${event.youtube_stream_id}?autoplay=1`}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          loading="lazy"
                        />
                      </div>
                    </div>
                  )}

                  {/* About */}
                  <div id="intel" className="space-y-4 scroll-mt-32">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                        <Sparkles className="w-4 h-4 text-primary" />
                      </div>
                      <h2 className="font-display text-xl md:text-2xl font-black uppercase italic tracking-tight">MISSION INTEL</h2>
                    </div>
                    <p className="text-white/60 text-sm md:text-base font-medium leading-relaxed">
                      {event.description || "The mission details are classified. Awaiting transmission from command."}
                    </p>
                  </div>

                  {/* Prize & Rules */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div id="prize" className="scroll-mt-32">
                      <PrizeDistributionSection prizes={event.prizeDistribution || []} />
                    </div>
                    <div id="rules" className="space-y-4 scroll-mt-32">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                          <Shield className="w-4 h-4 text-blue-400" />
                        </div>
                        <h3 className="font-display text-lg md:text-xl font-black uppercase italic tracking-tight text-blue-400">RULES OF ENGAGEMENT</h3>
                      </div>
                      <ul className="space-y-2">
                        {event.rules?.map((rule, i) => (
                          <li key={i} className="flex gap-2 text-white/60 text-sm font-medium">
                            <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                            {rule}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Gallery */}
                  {event.gallery && event.gallery.length > 0 && (
                    <div id="gallery" className="space-y-4 scroll-mt-32">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                          <ImageIcon className="w-4 h-4 text-purple-400" />
                        </div>
                        <h2 className="font-display text-xl md:text-2xl font-black uppercase italic tracking-tight">VISUAL ARCHIVES</h2>
                      </div>
                      <EventGallery images={event.gallery} title="VISUAL ARCHIVES" />
                    </div>
                  )}

                  <div id="winners" className="scroll-mt-32">
                    <WinnersSection 
                      winners={event.winners || []}
                      resultGallery={event.resultGallery || []}
                      isCompleted={currentStatus === 'past'}
                    />
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  <Card variant="iphone-dark" className="p-5 md:p-6 border-white/5 bg-white/5 backdrop-blur-xl sticky top-32">
                    <div className="space-y-5">
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/30 mb-1">GRAND PRIZE</p>
                        <div className="font-display text-2xl md:text-3xl font-black italic text-primary tracking-tighter">
                          {event.prize_pool}
                        </div>
                      </div>

                      <div className="h-px bg-white/5" />

                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <div className="space-y-0.5">
                            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/30">OPERATORS</p>
                            <p className="text-lg font-bold">{event.approvedTeamCount || 0} / {event.team_slots}</p>
                          </div>
                          <Users className="w-5 h-5 text-white/10" />
                        </div>
                        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary transition-all duration-500"
                            style={{ width: `${((event.approvedTeamCount || 0) / event.team_slots) * 100}%` }}
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                          <Calendar className="w-4 h-4 text-primary mt-0.5" />
                          <div>
                            <p className="text-[9px] font-bold uppercase tracking-widest text-white/30">MISSION START</p>
                            <p className="text-sm font-bold">{formatDateIST(event.start_date)}</p>
                            <p className="text-[9px] font-medium text-white/50">{formatTimeIST(event.start_date)} IST</p>
                          </div>
                        </div>
                        
                        {registrationState === 'open' && (
                          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                            <div className="flex items-center gap-2 mb-2">
                              <Clock className="w-3.5 h-3.5 text-primary" />
                              <p className="text-[9px] font-bold uppercase tracking-widest text-primary">COMM OPEN</p>
                            </div>
                            <CountdownTimer targetDate={event.registration_end} compact />
                          </div>
                        )}
                      </div>

                      <Button 
                        variant={isRegistrationDisabled ? "iphone" : "action-pulse"} 
                        size="lg" 
                        className="w-full h-11 text-sm tracking-wider font-bold uppercase"
                        disabled={isRegistrationDisabled}
                        asChild={!isRegistrationDisabled}
                      >
                        {!isRegistrationDisabled ? (
                          <Link to={`/events/${id}/register`}>
                            INITIATE LINK
                          </Link>
                        ) : (
                          <span>{registrationButtonText}</span>
                        )}
                      </Button>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  );
}