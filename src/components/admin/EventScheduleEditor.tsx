import { useState } from 'react';
import { Event, EventSchedule } from '@/lib/types';
import { useEvent, useAddScheduleItem, useDeleteScheduleItem } from '@/hooks/useEvents';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Plus, Trash2, Calendar } from 'lucide-react';

interface Props {
  event: Event | null;
  open: boolean;
  onClose: () => void;
}

const phases = [
  'Registration',
  'Qualifiers',
  'Quarter Finals',
  'Semi Finals',
  'Finals',
  'Grand Finals',
];

export const EventScheduleEditor = ({ event, open, onClose }: Props) => {
  const { data: eventDetails, refetch } = useEvent(event?.id);
  const addScheduleItem = useAddScheduleItem();
  const deleteScheduleItem = useDeleteScheduleItem();

  const [newItem, setNewItem] = useState({
    phase: 'Qualifiers',
    date: '',
    format: '',
  });

  const handleAdd = async () => {
    if (!event || !newItem.phase || !newItem.date) {
      toast({ title: 'Error', description: 'Phase and date are required', variant: 'destructive' });
      return;
    }

    try {
      await addScheduleItem.mutateAsync({
        event_id: event.id,
        phase: newItem.phase,
        date: newItem.date,
        format: newItem.format || 'TBD',
        sort_order: (eventDetails?.schedule?.length || 0) + 1,
      });
      setNewItem({ phase: 'Qualifiers', date: '', format: '' });
      refetch();
      toast({ title: 'Success', description: 'Schedule item added' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to add schedule item', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!event) return;
    
    try {
      await deleteScheduleItem.mutateAsync({ id, eventId: event.id });
      refetch();
      toast({ title: 'Success', description: 'Schedule item deleted' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete', variant: 'destructive' });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Event Schedule - {event?.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Existing Schedule Items */}
          <div className="space-y-2">
            <Label>Current Schedule</Label>
            {eventDetails?.schedule?.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">No schedule items yet</p>
            ) : (
              <div className="space-y-2">
                {eventDetails?.schedule?.map((item: EventSchedule) => (
                  <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border">
                    <div>
                      <p className="font-medium text-foreground">{item.phase}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.date} • {item.format}
                      </p>
                    </div>
                    <Button size="icon" variant="ghost" onClick={() => handleDelete(item.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add New Item */}
          <div className="border-t border-border pt-4">
            <Label className="mb-3 block">Add Schedule Item</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Phase</Label>
                <Select value={newItem.phase} onValueChange={(v) => setNewItem({ ...newItem, phase: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {phases.map(p => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Date</Label>
                <Input
                  type="text"
                  value={newItem.date}
                  onChange={(e) => setNewItem({ ...newItem, date: e.target.value })}
                  placeholder="Dec 25, 2024"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Format</Label>
                <Input
                  value={newItem.format}
                  onChange={(e) => setNewItem({ ...newItem, format: e.target.value })}
                  placeholder="Best of 3"
                />
              </div>
            </div>
            <Button onClick={handleAdd} className="mt-3" disabled={addScheduleItem.isPending}>
              <Plus className="w-4 h-4 mr-2" />
              Add Schedule Item
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
