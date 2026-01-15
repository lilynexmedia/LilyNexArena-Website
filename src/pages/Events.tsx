import { useState, useMemo, memo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, Calendar, Trophy, Users, Filter, ArrowRight, Radio } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useEvents } from "@/hooks/useEvents";
import { computeEventStatus } from "@/hooks/useEventStatus";
import { EventStatus } from "@/lib/types";
import { formatDateIST } from "@/lib/timezone";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useIsMobile } from "@/hooks/use-mobile";

const statusConfig: Record<EventStatus, { label: string; className: string; icon: typeof Calendar }> = {
  upcoming: { label: "Upcoming", className: "bg-blue-500/20 text-blue-400 border-blue-500/30", icon: Calendar },
  live: { label: "Live Now", className: "bg-red-500/20 text-red-400 border-red-500/30", icon: Radio },
  past: { label: "Completed", className: "bg-green-500/20 text-green-400 border-green-500/30", icon: Trophy },
  closed: { label: "Closed", className: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30", icon: Calendar },
};

const statusTabs = ["all", "live", "upcoming", "past"] as const;

// Memoized Event Card Skeleton
const EventCardSkeleton = memo(() => (
  <Card variant="iphone-dark" className="h-full overflow-hidden">
    <Skeleton className="h-40 md:h-48 w-full bg-white/5" />
    <CardContent className="p-5 md:p-6 space-y-4">
      <Skeleton className="h-6 w-3/4 bg-white/5" />
      <Skeleton className="h-4 w-full bg-white/5" />
      <Skeleton className="h-4 w-2/3 bg-white/5" />
      <div className="grid grid-cols-2 gap-3">
        <Skeleton className="h-16 bg-white/5 rounded-xl" />
        <Skeleton className="h-16 bg-white/5 rounded-xl" />
      </div>
      <div className="flex justify-between items-center pt-4 border-t border-white/5">
        <Skeleton className="h-8 w-24 bg-white/5" />
        <Skeleton className="h-10 w-10 rounded-full bg-white/5" />
      </div>
    </CardContent>
  </Card>
));
EventCardSkeleton.displayName = "EventCardSkeleton";

// Memoized Event Card
const EventCard = memo(({ event }: { event: any }) => {
  const status = statusConfig[event.computedStatus as EventStatus];
  const StatusIcon = status.icon;

  return (
    <Link to={`/events/${event.slug || event.id}`} className="block group">
      <Card variant="iphone-dark" className="h-full group-hover:border-white/20 overflow-hidden transition-colors">
        <div className="relative h-40 md:h-48 overflow-hidden">
          <img
            src={event.image_url || "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80"}
            alt={event.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
          
          <div className="absolute top-4 left-4">
            <span className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider border backdrop-blur-sm shadow-lg",
              status.className
            )}>
              <StatusIcon className="w-2.5 h-2.5" />
              {status.label}
            </span>
          </div>

          <div className="absolute bottom-4 left-4">
            <div className="px-3 py-1.5 rounded-lg bg-primary text-black text-[9px] font-black uppercase tracking-wider">
              {event.game}
            </div>
          </div>
        </div>

        <CardContent className="p-5 md:p-6">
          <h3 className="font-display text-lg md:text-xl font-black mb-2 group-hover:text-primary transition-colors tracking-tight line-clamp-1 uppercase italic">
            {event.name}
          </h3>
          <p className="text-white/50 text-xs md:text-sm mb-5 line-clamp-2 font-medium leading-relaxed">
            {event.description}
          </p>

          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="p-3 md:p-4 rounded-xl bg-white/5 border border-white/5 group-hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-1.5 mb-1">
                <Trophy className="w-3 h-3 text-primary" />
                <span className="text-[8px] uppercase tracking-wider text-white/40 font-bold">Prize</span>
              </div>
              <div className="text-sm md:text-base font-display font-black text-white tracking-tight">
                {event.prize_pool}
              </div>
            </div>
            <div className="p-3 md:p-4 rounded-xl bg-white/5 border border-white/5 group-hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-1.5 mb-1">
                <Users className="w-3 h-3 text-blue-400" />
                <span className="text-[8px] uppercase tracking-wider text-white/40 font-bold">Slots</span>
              </div>
              <div className="text-sm md:text-base font-display font-black text-white tracking-tight">
                {event.team_slots}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-white/5 pt-4">
            <div className="flex flex-col">
              <span className="text-[8px] uppercase tracking-wider text-white/40 font-bold mb-0.5">Begins</span>
              <span className="text-[11px] font-semibold text-white/70">{formatDateIST(event.start_date)}</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-primary group-hover:text-black transition-all duration-300">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
});
EventCard.displayName = "EventCard";

export default function Events() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const activeTab = (searchParams.get("category") as typeof statusTabs[number]) || "all";
  const { data: events, isLoading } = useEvents();
  const isMobile = useIsMobile();

  // Responsive batch sizes
  const initialCount = isMobile ? 6 : 9;
  const batchSize = isMobile ? 3 : 6;

  const setActiveTab = (tab: typeof statusTabs[number]) => {
    if (tab === "all") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", tab);
    }
    setSearchParams(searchParams);
  };

  const filteredEvents = useMemo(() => {
    if (!events) return [];

    return events
      .map(event => ({
        ...event,
        computedStatus: computeEventStatus(event).status
      }))
      .filter((event) => {
        if (activeTab !== "all" && event.computedStatus !== activeTab) {
          return false;
        }

        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          const searchableFields = [
            event.name,
            event.description || "",
            event.game,
            event.prize_pool,
            ...(event.tags || []),
          ].join(" ").toLowerCase();

          return searchableFields.includes(query);
        }

        return true;
      });
  }, [events, searchQuery, activeTab]);

  const { displayedItems, isLoadingMore, hasMore, sentinelRef } = useInfiniteScroll({
    items: filteredEvents,
    initialCount,
    batchSize,
  });

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-primary/30 overflow-x-hidden">
      <Navbar />
      
      <main className="pt-24 md:pt-32 pb-32 md:pb-32 mb-20 md:mb-0">
        {/* Static Background */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[160px] opacity-50" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-500/10 rounded-full blur-[160px] opacity-30" />
        </div>

        <section className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-10 md:mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl mb-5 shadow-lg">
              <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-white/80">The Arena Awaits</span>
            </div>
            
            <h1 className="font-display text-3xl sm:text-4xl md:text-6xl font-black mb-4 md:mb-6 tracking-tighter leading-none">
              FIND YOUR <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-primary to-primary/50 italic">NEXT BATTLE</span>
            </h1>
            
            <p className="text-white/60 text-sm md:text-base font-medium max-w-xl mx-auto mb-8 leading-relaxed">
              Join elite tournaments across the globe. Compete, win, and dominate.
            </p>

            <div className="relative max-w-lg mx-auto group">
              <div className="relative flex items-center p-1.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-lg overflow-hidden">
                <Search className="absolute left-4 w-4 h-4 text-white/30 group-focus-within:text-primary transition-colors" />
                <Input
                  type="text"
                  placeholder="Search tournaments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10 md:h-11 bg-transparent border-none focus:ring-0 text-sm md:text-base placeholder:text-white/20 font-medium"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-center mb-8 md:mb-10 px-2">
            <div className="flex flex-wrap justify-center p-1 gap-1 bg-white/5 backdrop-blur-xl rounded-full border border-white/10 shadow-lg">
              {statusTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "relative px-4 md:px-6 py-2 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-300",
                    activeTab === tab 
                      ? "text-black bg-primary shadow-md" 
                      : "text-white/50 hover:text-white"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {Array.from({ length: initialCount }).map((_, i) => (
                <EventCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-16 md:py-24 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-xl">
              <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-5">
                <Filter className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display text-xl md:text-2xl font-black mb-2 tracking-tight">NO ARENAS FOUND</h3>
              <p className="text-white/50 text-sm max-w-xs mx-auto font-medium">
                Try adjusting your filters or search terms.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                {displayedItems.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
                
                {/* Loading skeletons while fetching more */}
                {isLoadingMore && Array.from({ length: batchSize }).map((_, i) => (
                  <EventCardSkeleton key={`skeleton-${i}`} />
                ))}
              </div>
              
              {/* Invisible sentinel for infinite scroll trigger */}
              {hasMore && !isLoadingMore && (
                <div ref={sentinelRef} className="h-1 w-full" aria-hidden="true" />
              )}
            </>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}