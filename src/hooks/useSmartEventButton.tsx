import { useMemo } from "react";
import { useEvents } from "./useEvents";

interface SmartEventButton {
  href: string;
  label: string;
  isLive: boolean;
}

export function useSmartEventButton(): SmartEventButton {
  const { data: events, isLoading } = useEvents();

  return useMemo(() => {
    if (isLoading || !events || events.length === 0) {
      return { href: "/events", label: "Events", isLive: false };
    }

    // Filter live events
    const liveEvents = events.filter((event) => event.status === "live");
    if (liveEvents.length > 0) {
      const randomLive = liveEvents[Math.floor(Math.random() * liveEvents.length)];
      return { href: `/events/${randomLive.slug}`, label: "Live", isLive: true };
    }

    // Filter upcoming events
    const upcomingEvents = events.filter((event) => event.status === "upcoming");
    if (upcomingEvents.length > 0) {
      const randomUpcoming = upcomingEvents[Math.floor(Math.random() * upcomingEvents.length)];
      return { href: `/events/${randomUpcoming.slug}`, label: "Upcoming", isLive: false };
    }

    // Fallback to events page
    return { href: "/events", label: "Events", isLive: false };
  }, [events, isLoading]);
}
