/**
 * Timezone utilities for Indian Standard Time (IST)
 * IST is UTC+5:30
 * 
 * IMPORTANT: Admin-entered times are in IST. We store in UTC (with proper conversion).
 * All display functions convert back to IST.
 */

/**
 * Convert a datetime-local input value (entered as IST) to ISO string with proper timezone
 * This is used when SAVING admin-entered times
 * 
 * Input: "2025-12-25T19:20" (entered by admin in IST)
 * Output: "2025-12-25T19:20:00+05:30" (ISO with IST timezone)
 */
export function toISOWithIST(datetimeLocalValue: string): string {
  if (!datetimeLocalValue) return datetimeLocalValue;
  
  // If it already has timezone info or is already full ISO, return as-is
  if (datetimeLocalValue.includes('+') || datetimeLocalValue.includes('Z')) {
    return datetimeLocalValue;
  }
  
  // Append IST offset (+05:30) to treat the input as IST
  return `${datetimeLocalValue}:00+05:30`;
}

/**
 * Convert an ISO date string to datetime-local format for input fields
 * This is used when LOADING data into admin forms
 * 
 * Input: "2025-12-25T13:50:00.000Z" (UTC from database)
 * Output: "2025-12-25T19:20" (displayed in IST for admin input)
 */
export function toDatetimeLocalIST(isoString: string): string {
  if (!isoString) return '';
  
  const date = new Date(isoString);
  
  // Format in IST timezone
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  };
  
  const parts = new Intl.DateTimeFormat('en-GB', options).formatToParts(date);
  const getPart = (type: string) => parts.find(p => p.type === type)?.value || '00';
  
  const year = getPart('year');
  const month = getPart('month');
  const day = getPart('day');
  const hour = getPart('hour');
  const minute = getPart('minute');
  
  return `${year}-${month}-${day}T${hour}:${minute}`;
}

/**
 * Format a date in IST timezone for display
 */
export function formatInIST(dateString: string, options: Intl.DateTimeFormatOptions = {}): string {
  const date = new Date(dateString);
  return date.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    ...options
  });
}

/**
 * Format date only in IST
 */
export function formatDateIST(dateString: string): string {
  return formatInIST(dateString, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

/**
 * Format time only in IST
 */
export function formatTimeIST(dateString: string): string {
  return formatInIST(dateString, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}

/**
 * Format full date and time in IST
 */
export function formatDateTimeIST(dateString: string): string {
  return formatInIST(dateString, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}

/**
 * Get current time as a Date object
 * Used for time-based comparisons
 */
export function getNow(): Date {
  return new Date();
}

/**
 * Parse a date string to Date object for comparison
 * The date string should already be in proper ISO format with timezone
 */
export function parseDate(dateString: string): Date {
  return new Date(dateString);
}
