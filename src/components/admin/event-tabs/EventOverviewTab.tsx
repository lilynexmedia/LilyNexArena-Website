import { useState, useMemo } from 'react';
import { useUpdateEvent } from '@/hooks/useEvents';
import { EventWithDetails, RegistrationOverride } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Save, Calendar, Settings2, AlertCircle, Clock, IndianRupee, Gift, CreditCard } from 'lucide-react';
import { EventScheduleEditor } from '../EventScheduleEditor';
import { toDatetimeLocalIST, toISOWithIST, formatDateTimeIST } from '@/lib/timezone';
import { computeEventStatus, getRegistrationStateText } from '@/hooks/useEventStatus';
import { Badge } from '@/components/ui/badge';
import { DateTimePicker } from '@/components/ui/datetime-picker';
import { cn } from '@/lib/utils';

interface Props {
  event: EventWithDetails;
  onUpdate: () => void;
}

interface DateValidationErrors {
  registration_start?: string;
  registration_end?: string;
  start_date?: string;
  end_date?: string;
  entry_amount?: string;
}

export const EventOverviewTab = ({ event, onUpdate }: Props) => {
  const updateEvent = useUpdateEvent();
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  
  // Convert stored UTC dates to IST for display in datetime-local inputs
  const [formData, setFormData] = useState({
    name: event.name,
    slug: event.slug,
    game: event.game,
    description: event.description || '',
    prize_pool: event.prize_pool,
    team_slots: event.team_slots,
    entry_amount: (event as any).entry_amount || 0,
    status: event.status,
    start_date: toDatetimeLocalIST(event.start_date),
    end_date: toDatetimeLocalIST(event.end_date),
    registration_start: toDatetimeLocalIST(event.registration_start),
    registration_end: toDatetimeLocalIST(event.registration_end),
    image_url: event.image_url || '',
    registration_override: (event as any).registration_override as RegistrationOverride || null,
    youtube_stream_id: event.youtube_stream_id || '',
  });

  // Date validation
  const dateErrors = useMemo((): DateValidationErrors => {
    const errors: DateValidationErrors = {};
    
    const regStart = formData.registration_start ? new Date(formData.registration_start) : null;
    const regEnd = formData.registration_end ? new Date(formData.registration_end) : null;
    const eventStart = formData.start_date ? new Date(formData.start_date) : null;
    const eventEnd = formData.end_date ? new Date(formData.end_date) : null;

    // Registration Start < Registration End
    if (regStart && regEnd && regStart >= regEnd) {
      errors.registration_start = "Registration Start must be before Registration End";
      errors.registration_end = "Registration End must be after Registration Start";
    }

    // Registration End ≤ Event Start
    if (regEnd && eventStart && regEnd > eventStart) {
      errors.registration_end = "Registration must end before or when Event starts";
    }

    // Event Start < Event End
    if (eventStart && eventEnd && eventStart >= eventEnd) {
      errors.start_date = "Event Start must be before Event End";
      errors.end_date = "Event End must be after Event Start";
    }

    // Entry amount validation
    if (formData.entry_amount < 0) {
      errors.entry_amount = "Entry fee cannot be negative";
    }

    return errors;
  }, [formData.registration_start, formData.registration_end, formData.start_date, formData.end_date, formData.entry_amount]);

  const hasErrors = Object.keys(dateErrors).length > 0;

  // Compute current auto registration state for display
  const computedStatus = computeEventStatus({
    start_date: event.start_date,
    end_date: event.end_date,
    registration_start: event.registration_start,
    registration_end: event.registration_end,
    status: event.status,
    is_registration_open: event.is_registration_open,
    registration_override: (event as any).registration_override,
  });

  const handleSave = async () => {
    // Block save if validation errors exist
    if (hasErrors) {
      toast({ 
        title: 'Validation Error', 
        description: 'Please fix the date/time errors before saving', 
        variant: 'destructive' 
      });
      return;
    }

    try {
      // Convert IST datetime-local values to proper ISO format with timezone
      await updateEvent.mutateAsync({
        id: event.id,
        ...formData,
        start_date: toISOWithIST(formData.start_date),
        end_date: toISOWithIST(formData.end_date),
        registration_start: toISOWithIST(formData.registration_start),
        registration_end: toISOWithIST(formData.registration_end),
      });
      onUpdate();
      toast({ title: 'Success', description: 'Event updated successfully' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update event', variant: 'destructive' });
    }
  };

  const getOverrideLabel = (value: RegistrationOverride | string) => {
    switch (value) {
      case 'open': return 'Force Open';
      case 'closed': return 'Force Closed';
      default: return 'Automatic (Time-based)';
    }
  };

  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-primary" />
            Event Details
          </CardTitle>
          <Button onClick={handleSave} disabled={updateEvent.isPending || hasErrors}>
            <Save className="w-4 h-4 mr-2" />
            {hasErrors ? "Fix Errors to Save" : "Save Changes"}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Event Name</Label>
              <Input
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input
                value={formData.slug}
                onChange={e => setFormData({ ...formData, slug: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Game</Label>
              <Input
                value={formData.game}
                onChange={e => setFormData({ ...formData, game: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Prize Pool</Label>
              <Input
                value={formData.prize_pool}
                onChange={e => setFormData({ ...formData, prize_pool: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Team Slots</Label>
              <Input
                type="number"
                value={formData.team_slots}
                onChange={e => setFormData({ ...formData, team_slots: parseInt(e.target.value) || 32 })}
              />
            </div>
            {/* Entry Fee - Enhanced UI */}
            <div className="space-y-2 md:col-span-2">
              <Label className="flex items-center gap-2">
                <IndianRupee className="w-4 h-4" />
                Entry Fee (₹)
                <span className="text-destructive">*</span>
              </Label>
              <div className="flex gap-4 items-start">
                <div className="flex-1 max-w-[200px]">
                  <Input
                    type="number"
                    min="0"
                    value={formData.entry_amount}
                    onChange={e => {
                      const val = parseInt(e.target.value);
                      setFormData({ ...formData, entry_amount: isNaN(val) ? 0 : Math.max(0, val) });
                    }}
                    placeholder="0"
                    className={cn(
                      "text-lg font-semibold",
                      dateErrors.entry_amount && "border-destructive focus-visible:ring-destructive"
                    )}
                  />
                  {dateErrors.entry_amount && (
                    <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {dateErrors.entry_amount}
                    </p>
                  )}
                </div>
                
                {/* Visual indicator for Free vs Paid */}
                <div className={cn(
                  "flex-1 rounded-lg p-4 border transition-all",
                  formData.entry_amount === 0 
                    ? "bg-emerald-500/10 border-emerald-500/30" 
                    : "bg-amber-500/10 border-amber-500/30"
                )}>
                  <div className="flex items-center gap-3">
                    {formData.entry_amount === 0 ? (
                      <>
                        <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                          <Gift className="w-5 h-5 text-emerald-500" />
                        </div>
                        <div>
                          <p className="font-semibold text-emerald-500">Free Event</p>
                          <p className="text-xs text-muted-foreground">No payment required for registration</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                          <CreditCard className="w-5 h-5 text-amber-500" />
                        </div>
                        <div>
                          <p className="font-semibold text-amber-500">Paid Event — ₹{formData.entry_amount}</p>
                          <p className="text-xs text-muted-foreground">Razorpay payment required to complete registration</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(v: typeof formData.status) => setFormData({ ...formData, status: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="live">Live</SelectItem>
                  <SelectItem value="past">Past (Completed)</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Banner/Poster Image URL</Label>
              <Input
                value={formData.image_url}
                onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://... (shown in hero section)"
              />
              {formData.image_url && (
                <div className="mt-2 rounded-lg overflow-hidden border border-border">
                  <img src={formData.image_url} alt="Banner preview" className="w-full h-24 object-cover" />
                </div>
              )}
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dates & Registration */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Dates & Registration
            <span className="text-xs text-muted-foreground font-normal ml-2">(All times in IST)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className={cn(dateErrors.start_date && "text-destructive")}>
                Event Start (IST)
              </Label>
              <DateTimePicker
                value={formData.start_date}
                onChange={(v) => setFormData({ ...formData, start_date: v })}
                placeholder="Select event start"
                className={cn(dateErrors.start_date && "border-destructive")}
              />
              {dateErrors.start_date && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {dateErrors.start_date}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label className={cn(dateErrors.end_date && "text-destructive")}>
                Event End (IST)
              </Label>
              <DateTimePicker
                value={formData.end_date}
                onChange={(v) => setFormData({ ...formData, end_date: v })}
                placeholder="Select event end"
                className={cn(dateErrors.end_date && "border-destructive")}
              />
              {dateErrors.end_date && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {dateErrors.end_date}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label className={cn(dateErrors.registration_start && "text-destructive")}>
                Registration Start (IST)
              </Label>
              <DateTimePicker
                value={formData.registration_start}
                onChange={(v) => setFormData({ ...formData, registration_start: v })}
                placeholder="Select registration start"
                className={cn(dateErrors.registration_start && "border-destructive")}
              />
              {dateErrors.registration_start && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {dateErrors.registration_start}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label className={cn(dateErrors.registration_end && "text-destructive")}>
                Registration End (IST)
              </Label>
              <DateTimePicker
                value={formData.registration_end}
                onChange={(v) => setFormData({ ...formData, registration_end: v })}
                placeholder="Select registration end"
                className={cn(dateErrors.registration_end && "border-destructive")}
              />
              {dateErrors.registration_end && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {dateErrors.registration_end}
                </p>
              )}
            </div>
          </div>

          {/* Date Rules Info */}
          {hasErrors && (
            <div className="mt-4 p-3 rounded-lg bg-destructive/10 border border-destructive/30">
              <p className="text-sm font-medium text-destructive flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Please fix the validation errors above before saving
              </p>
              <ul className="mt-2 text-xs text-destructive/80 space-y-1 ml-6 list-disc">
                <li>Registration Start must be before Registration End</li>
                <li>Registration must end before or when Event starts</li>
                <li>Event Start must be before Event End</li>
              </ul>
            </div>
          )}

          {/* Registration Override Control */}
          <div className="mt-6 pt-4 border-t border-border">
            <div className="flex items-start gap-4">
              <div className="flex-1 space-y-2">
                <Label className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Registration Control
                </Label>
                <Select 
                  value={formData.registration_override || 'auto'} 
                  onValueChange={(v) => setFormData({ 
                    ...formData, 
                    registration_override: v === 'auto' ? null : v as RegistrationOverride 
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Automatic (Time-based)</SelectItem>
                    <SelectItem value="open">Force Open (Manual Override)</SelectItem>
                    <SelectItem value="closed">Force Closed (Manual Override)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {formData.registration_override ? (
                    "Manual override is active. Registration will stay " + (formData.registration_override === 'open' ? 'open' : 'closed') + " regardless of dates."
                  ) : (
                    "Status is automatically managed based on registration time window."
                  )}
                </p>
              </div>
              
              {/* Current Status Display */}
              <div className="bg-muted/30 rounded-lg p-4 min-w-[200px]">
                <p className="text-xs text-muted-foreground mb-2">Current Registration Status:</p>
                <Badge 
                  variant={computedStatus.registrationState === 'open' ? 'default' : 'secondary'}
                  className="text-sm"
                >
                  {getRegistrationStateText(computedStatus.registrationState, computedStatus.registrationSource)}
                </Badge>
                {computedStatus.registrationMode === 'auto' && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    Auto-updating based on time
                  </div>
                )}
                {computedStatus.registrationMode === 'manual' && (
                  <div className="mt-2 flex items-center gap-1 text-xs text-amber-500">
                    <AlertCircle className="w-3 h-3" />
                    Manual Override Active
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schedule */}
      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Match Schedule</CardTitle>
          <Button variant="outline" onClick={() => setIsScheduleOpen(true)}>
            Edit Schedule
          </Button>
        </CardHeader>
        <CardContent>
          {event.schedule?.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No schedule items added</p>
          ) : (
            <div className="space-y-2">
              {event.schedule?.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border">
                  <div>
                    <p className="font-medium">{item.phase}</p>
                    <p className="text-sm text-muted-foreground">{item.format}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.date}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Streaming */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Live Stream</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>YouTube Stream ID</Label>
            <Input
              value={formData.youtube_stream_id}
              onChange={e => setFormData({ ...formData, youtube_stream_id: e.target.value })}
              placeholder="e.g., dQw4w9WgXcQ"
            />
            <p className="text-xs text-muted-foreground">
              Enter the YouTube video ID for live stream embed on the event page
            </p>
          </div>
        </CardContent>
      </Card>

      <EventScheduleEditor 
        event={event} 
        open={isScheduleOpen} 
        onClose={() => { setIsScheduleOpen(false); onUpdate(); }} 
      />
    </div>
  );
};
