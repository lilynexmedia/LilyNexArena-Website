import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEvents, useCreateEvent, useDeleteEvent } from '@/hooks/useEvents';
import { Event } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Plus, Trash2, Calendar, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { toISOWithIST } from '@/lib/timezone';

type EventFormData = {
  name: string;
  slug: string;
  game: string;
  description: string;
  prize_pool: string;
  team_slots: number;
  start_date: string;
  end_date: string;
  registration_start: string;
  registration_end: string;
  image_url: string;
};

const defaultFormData: EventFormData = {
  name: '',
  slug: '',
  game: '',
  description: '',
  prize_pool: '$0',
  team_slots: 32,
  start_date: '',
  end_date: '',
  registration_start: '',
  registration_end: '',
  image_url: '',
};

const statusColors: Record<string, string> = {
  upcoming: 'bg-primary/20 text-primary',
  live: 'bg-destructive/20 text-destructive',
  past: 'bg-muted text-muted-foreground',
  closed: 'bg-muted/50 text-muted-foreground/50',
};

export const AdminEvents = () => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { data: events, isLoading } = useEvents(statusFilter === 'all' ? undefined : statusFilter);
  const createEvent = useCreateEvent();
  const deleteEvent = useDeleteEvent();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState<EventFormData>(defaultFormData);

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.game || !formData.start_date || !formData.end_date) {
      toast({ title: 'Error', description: 'Please fill in all required fields', variant: 'destructive' });
      return;
    }

    try {
      const newEvent = await createEvent.mutateAsync({
        ...formData,
        slug: formData.slug || generateSlug(formData.name),
        status: 'upcoming',
        is_registration_open: true,
        registration_override: null,
        // Convert IST datetime-local to proper ISO with timezone
        start_date: toISOWithIST(formData.start_date),
        end_date: toISOWithIST(formData.end_date),
        registration_start: toISOWithIST(formData.registration_start),
        registration_end: toISOWithIST(formData.registration_end),
      });
      toast({ title: 'Success', description: 'Event created successfully' });
      setIsFormOpen(false);
      setFormData(defaultFormData);
      navigate(`/admin/events/${newEvent.id}`);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to create event', variant: 'destructive' });
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this event?')) return;
    
    try {
      await deleteEvent.mutateAsync(id);
      toast({ title: 'Success', description: 'Event deleted successfully' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete event', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Events Management</h1>
          <p className="text-muted-foreground">Select an event to manage all its details</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Event
        </Button>
      </div>

      {/* Status Filter */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'upcoming', 'live', 'past', 'closed'].map((status) => (
          <Button
            key={status}
            variant={statusFilter === status ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter(status)}
            className="capitalize"
          >
            {status === 'all' ? 'All Events' : status}
          </Button>
        ))}
      </div>

      {/* Events List */}
      <div className="grid gap-4">
        {isLoading ? (
          [1, 2, 3].map(i => <Skeleton key={i} className="h-24 w-full" />)
        ) : events?.length === 0 ? (
          <Card className="bg-card border-border">
            <CardContent className="py-12 text-center">
              <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No events found</p>
            </CardContent>
          </Card>
        ) : (
          events?.map(event => (
            <Card 
              key={event.id} 
              className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => navigate(`/admin/events/${event.id}`)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {event.image_url && (
                      <img src={event.image_url} alt={event.name} className="w-16 h-16 rounded-lg object-cover" />
                    )}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg">{event.name}</h3>
                        <Badge className={statusColors[event.status]}>{event.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {event.game} • {format(new Date(event.start_date), 'MMM d, yyyy')} • {event.team_slots} teams
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      size="icon" 
                      variant="ghost"
                      onClick={(e) => handleDelete(e, event.id)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Create Event Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Event</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label>Event Name *</Label>
              <Input
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value, slug: generateSlug(e.target.value) })}
                placeholder="Tournament Name"
              />
            </div>
            <div className="space-y-2">
              <Label>Game *</Label>
              <Input
                value={formData.game}
                onChange={e => setFormData({ ...formData, game: e.target.value })}
                placeholder="e.g., BGMI, Valorant"
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
            <div className="space-y-2">
              <Label>Start Date *</Label>
              <Input type="datetime-local" value={formData.start_date} onChange={e => setFormData({ ...formData, start_date: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>End Date *</Label>
              <Input type="datetime-local" value={formData.end_date} onChange={e => setFormData({ ...formData, end_date: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Registration Start</Label>
              <Input type="datetime-local" value={formData.registration_start} onChange={e => setFormData({ ...formData, registration_start: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Registration End</Label>
              <Input type="datetime-local" value={formData.registration_end} onChange={e => setFormData({ ...formData, registration_end: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={createEvent.isPending}>Create Event</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
