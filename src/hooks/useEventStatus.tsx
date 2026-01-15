import { useMemo } from 'react';
import { EventStatus, RegistrationOverride } from '@/lib/types';

export interface ComputedEventStatus {
  status: EventStatus;
  registrationState: 'opening_soon' | 'open' | 'closed';
  isRegistrationOpen: boolean;
  timeToEventStart: number;
  timeToEventEnd: number;
  timeToRegistrationStart: number;
  timeToRegistrationEnd: number;
  registrationMode: 'auto' | 'manual'; // Which mode is active
  registrationSource: 'auto' | 'manual'; // How the current state was determined
}

/**
 * Computes the real-time status of an event based on current time and event dates.
 * 
 * REGISTRATION LOGIC:
 * - If registration_override is NULL → Automatic mode (time-based)
 * - If registration_override is 'open' or 'closed' → Manual mode (override active)
 * 
 * In AUTOMATIC mode:
 * - current_time < registration_start → "Opening Soon"
 * - current_time >= registration_start AND <= registration_end → "Open"
 * - current_time > registration_end → "Closed"
 * 
 * In MANUAL mode:
 * - registration_override = 'open' → "Open (Manual)"
 * - registration_override = 'closed' → "Closed (Manual)"
 */
export function computeEventStatus(event: {
  start_date: string;
  end_date: string;
  registration_start: string;
  registration_end: string;
  status?: EventStatus;
  is_registration_open?: boolean;
  registration_override?: RegistrationOverride;
}): ComputedEventStatus {
  const now = Date.now();
  const startDate = new Date(event.start_date).getTime();
  const endDate = new Date(event.end_date).getTime();
  const regStart = new Date(event.registration_start).getTime();
  const regEnd = new Date(event.registration_end).getTime();

  // Compute event status based on time
  let status: EventStatus;
  if (now < startDate) {
    status = 'upcoming';
  } else if (now >= startDate && now < endDate) {
    status = 'live';
  } else {
    status = 'past';
  }

  // If admin explicitly set event status to 'closed', respect that
  if (event.status === 'closed') {
    status = 'closed';
  }

  // Determine registration mode and state
  // registration_override: null = Automatic, 'open'/'closed' = Manual
  const isManualMode = event.registration_override === 'open' || event.registration_override === 'closed';
  const registrationMode: 'auto' | 'manual' = isManualMode ? 'manual' : 'auto';
  
  let registrationState: 'opening_soon' | 'open' | 'closed';
  let registrationSource: 'auto' | 'manual';
  
  if (isManualMode) {
    // MANUAL MODE: Use the override value directly
    registrationState = event.registration_override === 'open' ? 'open' : 'closed';
    registrationSource = 'manual';
  } else {
    // AUTOMATIC MODE: Use time-based logic only
    // Ignore is_registration_open flag - purely time-based
    if (now < regStart) {
      registrationState = 'opening_soon';
    } else if (now >= regStart && now <= regEnd) {
      registrationState = 'open';
    } else {
      registrationState = 'closed';
    }
    registrationSource = 'auto';
  }

  // Registration is only actually open if:
  // 1. Registration state is 'open'
  // 2. Event hasn't ended yet (upcoming or live)
  // 3. Event status isn't closed
  const isRegistrationOpen = 
    registrationState === 'open' && 
    (status === 'upcoming' || status === 'live');

  return {
    status,
    registrationState,
    isRegistrationOpen,
    timeToEventStart: startDate - now,
    timeToEventEnd: endDate - now,
    timeToRegistrationStart: regStart - now,
    timeToRegistrationEnd: regEnd - now,
    registrationMode,
    registrationSource,
  };
}

/**
 * Hook to compute and re-compute event status in real-time.
 * Pass a dependency (like a counter) that updates every second for real-time updates.
 */
export function useEventStatus(event: {
  start_date: string;
  end_date: string;
  registration_start: string;
  registration_end: string;
  status?: EventStatus;
  is_registration_open?: boolean;
  registration_override?: RegistrationOverride;
} | null | undefined, tick?: number): ComputedEventStatus | null {
  return useMemo(() => {
    if (!event) return null;
    return computeEventStatus(event);
  }, [
    event?.start_date, 
    event?.end_date, 
    event?.registration_start, 
    event?.registration_end, 
    event?.status, 
    event?.is_registration_open, 
    event?.registration_override,
    tick
  ]);
}

/**
 * Get the display label for an event status
 */
export function getStatusLabel(status: EventStatus): string {
  switch (status) {
    case 'upcoming': return 'Upcoming';
    case 'live': return 'Live Now';
    case 'past': return 'Completed';
    case 'closed': return 'Closed';
    default: return status;
  }
}

/**
 * Get the registration button text based on state
 */
export function getRegistrationButtonText(
  registrationState: 'opening_soon' | 'open' | 'closed',
  slotsAvailable: number
): string {
  if (slotsAvailable <= 0) return 'Fully Booked';
  switch (registrationState) {
    case 'opening_soon': return 'Registration Opens Soon';
    case 'open': return 'Register Now';
    case 'closed': return 'Registration Closed';
    default: return 'Registration Closed';
  }
}

/**
 * Get human-readable text for registration state
 */
export function getRegistrationStateText(
  registrationState: 'opening_soon' | 'open' | 'closed',
  source: 'auto' | 'manual'
): string {
  const suffix = source === 'manual' ? ' (Manual)' : '';
  switch (registrationState) {
    case 'opening_soon': return 'Opening Soon' + suffix;
    case 'open': return 'Open' + suffix;
    case 'closed': return 'Closed' + suffix;
    default: return 'Closed' + suffix;
  }
}
