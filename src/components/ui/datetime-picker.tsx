import * as React from "react";
import { format, parse } from "date-fns";
import { CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DateTimePickerProps {
  value: string; // Format: "YYYY-MM-DDTHH:MM"
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function DateTimePicker({
  value,
  onChange,
  placeholder = "Pick date & time",
  className,
}: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false);

  // Parse the datetime-local value
  const dateValue = React.useMemo(() => {
    if (!value) return undefined;
    try {
      return new Date(value);
    } catch {
      return undefined;
    }
  }, [value]);

  const timeValue = React.useMemo(() => {
    if (!value) return { hours: "12", minutes: "00" };
    const parts = value.split("T");
    if (parts.length !== 2) return { hours: "12", minutes: "00" };
    const timeParts = parts[1].split(":");
    return {
      hours: timeParts[0] || "12",
      minutes: timeParts[1] || "00",
    };
  }, [value]);

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    const dateStr = format(date, "yyyy-MM-dd");
    const timeStr = `${timeValue.hours}:${timeValue.minutes}`;
    onChange(`${dateStr}T${timeStr}`);
  };

  const handleTimeChange = (type: "hours" | "minutes", val: string) => {
    const datePart = value ? value.split("T")[0] : format(new Date(), "yyyy-MM-dd");
    const newTime = type === "hours" 
      ? `${val}:${timeValue.minutes}`
      : `${timeValue.hours}:${val}`;
    onChange(`${datePart}T${newTime}`);
  };

  // Generate hour options (00-23)
  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"));
  // Generate minute options (00, 15, 30, 45 for quick selection, or all)
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0"));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? (
            <span>
              {format(new Date(value), "dd MMM yyyy")} at {timeValue.hours}:{timeValue.minutes}
            </span>
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={dateValue}
          onSelect={handleDateSelect}
          initialFocus
          className="p-3 pointer-events-auto"
        />
        <div className="border-t border-border p-3">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Time (IST):</span>
            <Select value={timeValue.hours} onValueChange={(v) => handleTimeChange("hours", v)}>
              <SelectTrigger className="w-[70px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-[200px]">
                {hours.map((h) => (
                  <SelectItem key={h} value={h}>
                    {h}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-muted-foreground">:</span>
            <Select value={timeValue.minutes} onValueChange={(v) => handleTimeChange("minutes", v)}>
              <SelectTrigger className="w-[70px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-[200px]">
                {minutes.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="border-t border-border p-2">
          <Button 
            size="sm" 
            className="w-full" 
            onClick={() => setOpen(false)}
          >
            Done
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
