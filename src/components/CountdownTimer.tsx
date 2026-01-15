import { useState, useEffect, useMemo } from 'react';
import { cn } from '@/lib/utils';

interface CountdownTimerProps {
  targetDate: string | Date;
  label?: string;
  onComplete?: () => void;
  className?: string;
  compact?: boolean;
  showSeconds?: boolean;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

function calculateTimeLeft(targetDate: Date): TimeLeft {
  const now = Date.now();
  const target = targetDate.getTime();
  const difference = target - now;

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
    total: difference,
  };
}

export function CountdownTimer({
  targetDate,
  label,
  onComplete,
  className,
  compact = false,
  showSeconds = true,
}: CountdownTimerProps) {
  const target = useMemo(() => new Date(targetDate), [targetDate]);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calculateTimeLeft(target));

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft(target);
      setTimeLeft(newTimeLeft);

      if (newTimeLeft.total <= 0) {
        clearInterval(timer);
        onComplete?.();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [target, onComplete]);

  if (timeLeft.total <= 0) {
    return null;
  }

  if (compact) {
    return (
      <div className={cn("flex items-center gap-1 text-sm font-mono", className)}>
        {label && <span className="text-muted-foreground mr-2">{label}</span>}
        <span className="text-primary font-semibold">
          {timeLeft.days > 0 && `${timeLeft.days}d `}
          {String(timeLeft.hours).padStart(2, '0')}:
          {String(timeLeft.minutes).padStart(2, '0')}
          {showSeconds && `:${String(timeLeft.seconds).padStart(2, '0')}`}
        </span>
      </div>
    );
  }

  return (
    <div className={cn("", className)}>
      {label && (
        <div className="text-sm font-heading uppercase tracking-wider text-muted-foreground mb-3">
          {label}
        </div>
      )}
      <div className="flex gap-3">
        {timeLeft.days > 0 && (
          <TimeUnit value={timeLeft.days} label="Days" />
        )}
        <TimeUnit value={timeLeft.hours} label="Hours" />
        <TimeUnit value={timeLeft.minutes} label="Mins" />
        {showSeconds && <TimeUnit value={timeLeft.seconds} label="Secs" />}
      </div>
    </div>
  );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-14 h-14 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
        <span className="font-display text-2xl font-bold text-primary">
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="text-xs text-muted-foreground mt-1 font-heading uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
}

/**
 * Hook to get a tick value that updates every second
 * Use this with useEventStatus to trigger re-renders
 */
export function useSecondTick(): number {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTick(t => t + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return tick;
}
