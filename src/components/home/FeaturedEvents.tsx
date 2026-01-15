import { useMemo, memo } from "react";
import { Link } from "react-router-dom";
import { Calendar, Trophy, Users, ArrowRight, PlayCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useEvents } from "@/hooks/useEvents";
import { computeEventStatus } from "@/hooks/useEventStatus";
import { EventStatus } from "@/lib/types";
import { formatDateIST } from "@/lib/timezone";

const statusConfig: Record<EventStatus, { label: string; className: string; icon: any }> = {
  upcoming: { label: "Upcoming", className: "bg-blue-500/20 text-blue-400 border-blue-500/30", icon: Clock },
  live: { label: "Live Now", className: "bg-red-500/20 text-red-400 border-red-500/30", icon: PlayCircle },
  past: { label: "Completed", className: "bg-white/10 text-white/40 border-white/5", icon: Trophy },
  closed: { label: "Closed", className: "bg-white/5 text-white/20 border-white/5", icon: Clock },
};

const EventCard = memo(({ event, index }: { event: any; index: number }) => {
  const status = statusConfig[event.computedStatus as EventStatus];
  const StatusIcon = status.icon;
  
  return (
    <div 
      className="animate-fade-in-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <Link to={`/events/${event.slug || event.id}`} className="block group">
        <Card variant="glass-premium" className="h-[380px] sm:h-[420px] p-0 flex flex-col group-hover:translate-y-[-6px] duration-300 overflow-hidden border-white/5 group-hover:border-primary/30">
          {/* Image Header */}
          <div className="relative h-40 sm:h-48 overflow-hidden">
            <img
              src={event.image_url || "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80"}
              alt={event.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
            
            {/* Status Badge */}
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20">
              <div className={cn(
                "flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg backdrop-blur-xl border text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.15em]",
                status.className
              )}>
                <StatusIcon className="w-2.5 sm:w-3 h-2.5 sm:h-3" />
                {status.label}
              </div>
            </div>

            {/* Game Tag */}
            <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-20">
              <div className="px-2.5 sm:px-3 py-1 bg-black/60 backdrop-blur-xl border border-white/10 rounded-lg flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-primary" />
                <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.2em] text-white/80">
                  {event.game}
                </span>
              </div>
            </div>
          </div>

          {/* Content Body */}
          <div className="flex-1 p-4 sm:p-6 flex flex-col relative">
            <div className="absolute top-0 left-4 sm:left-6 right-4 sm:right-6 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            
            <h3 className="font-display text-lg sm:text-xl font-black text-white mb-3 sm:mb-4 line-clamp-2 group-hover:text-primary transition-colors italic tracking-tighter leading-tight">
              {event.name}
            </h3>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="flex flex-col gap-1 p-2.5 sm:p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <span className="text-[7px] sm:text-[8px] uppercase tracking-[0.2em] text-white/30 font-bold">REWARD</span>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Trophy className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-primary" />
                  <span className="font-display text-sm sm:text-base font-bold text-white italic tracking-tight">{event.prize_pool}</span>
                </div>
              </div>
              <div className="flex flex-col gap-1 p-2.5 sm:p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <span className="text-[7px] sm:text-[8px] uppercase tracking-[0.2em] text-white/30 font-bold">SLOTS</span>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Users className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-secondary" />
                  <span className="font-display text-sm sm:text-base font-bold text-white italic tracking-tight">{event.team_slots}</span>
                </div>
              </div>
            </div>

            <div className="mt-auto flex items-center justify-between pt-4 sm:pt-5 border-t border-white/5">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                  <Calendar className="w-4 sm:w-4.5 h-4 sm:h-4.5 text-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[7px] sm:text-[8px] uppercase tracking-[0.2em] text-white/30 font-bold">LAUNCH</span>
                  <span className="text-[10px] sm:text-xs font-bold text-white/80 tracking-wide">{formatDateIST(event.start_date)}</span>
                </div>
              </div>
              
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5 text-primary" />
              </div>
            </div>
          </div>
        </Card>
      </Link>
    </div>
  );
});

EventCard.displayName = 'EventCard';

function FeaturedEventsComponent() {
  const { data: allEvents, isLoading } = useEvents();

  const featuredEvents = useMemo(() => {
    if (!allEvents || allEvents.length === 0) return [];

    const eventsWithStatus = allEvents.map(event => ({
      ...event,
      computedStatus: computeEventStatus(event).status
    }));

    const liveEvents = eventsWithStatus.filter(e => e.computedStatus === 'live');
    const upcomingEvents = eventsWithStatus.filter(e => e.computedStatus === 'upcoming');

    const featured: typeof eventsWithStatus = [];
    
    for (let i = 0; i < Math.min(3, liveEvents.length); i++) {
      featured.push(liveEvents[i]);
    }

    const slotsRemaining = 3 - featured.length;
    if (slotsRemaining > 0 && upcomingEvents.length > 0) {
      const shuffled = [...upcomingEvents].sort(() => Math.random() - 0.5);
      for (let i = 0; i < Math.min(slotsRemaining, shuffled.length); i++) {
        featured.push(shuffled[i]);
      }
    }

    return featured;
  }, [allEvents]);

  return (
    <section className="py-16 md:py-24 relative overflow-hidden bg-black/40">
      {/* Background Atmosphere */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] -translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-5 mb-8 md:mb-12 text-center md:text-left">
          <div className="max-w-xl w-full flex flex-col items-center md:items-start">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-4 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
              <Trophy className="w-3 h-3 text-primary" />
              <span className="text-[8px] md:text-[9px] font-heading font-bold uppercase tracking-[0.2em] text-white/60">
                Arena Spotlights
              </span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl md:text-5xl font-black tracking-tighter text-white leading-tight">
              FEATURED <br />
              <span className="text-primary italic text-glow-cyan">TOURNAMENTS</span>
            </h2>
          </div>
          <Button variant="iphone" size="lg" asChild className="h-10 md:h-11 px-6 group w-full sm:w-auto">
            <Link to="/events" className="flex items-center justify-center gap-2 text-sm">
              Explore All
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-[380px] bg-white/5 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {featuredEvents.map((event, index) => (
              <EventCard key={event.id} event={event} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export const FeaturedEvents = memo(FeaturedEventsComponent);
