import { useState } from 'react';
import { useEvents, useEvent, useAddEventWinner, useDeleteEventWinner, useUpdateEvent } from '@/hooks/useEvents';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';
import { Trophy, Plus, Trash2, Crown, Medal } from 'lucide-react';

const rankIcons: Record<number, { icon: React.ElementType; color: string }> = {
  1: { icon: Crown, color: 'text-yellow-500' },
  2: { icon: Medal, color: 'text-gray-400' },
  3: { icon: Medal, color: 'text-amber-600' },
};

export const AdminWinners = () => {
  const { data: events, isLoading: eventsLoading } = useEvents();
  const [selectedEventId, setSelectedEventId] = useState<string>('');

  const { data: eventDetails, refetch } = useEvent(selectedEventId);
  const addWinner = useAddEventWinner();
  const deleteWinner = useDeleteEventWinner();
  const updateEvent = useUpdateEvent();

  const [newWinner, setNewWinner] = useState({
    team_name: '',
    rank: 1,
    prize: '',
  });

  const handleAddWinner = async () => {
    if (!selectedEventId || !newWinner.team_name) {
      toast({ title: 'Error', description: 'Team name is required', variant: 'destructive' });
      return;
    }

    try {
      await addWinner.mutateAsync({
        event_id: selectedEventId,
        team_name: newWinner.team_name,
        rank: newWinner.rank,
        prize: newWinner.prize || null,
      });
      setNewWinner({ team_name: '', rank: 1, prize: '' });
      refetch();
      toast({ title: 'Success', description: 'Winner added' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to add winner', variant: 'destructive' });
    }
  };

  const handleDeleteWinner = async (id: string) => {
    if (!selectedEventId) return;
    if (!confirm('Remove this winner?')) return;

    try {
      await deleteWinner.mutateAsync({ id, eventId: selectedEventId });
      refetch();
      toast({ title: 'Success', description: 'Winner removed' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to remove winner', variant: 'destructive' });
    }
  };

  const handleMarkAsCompleted = async () => {
    if (!selectedEventId) return;

    try {
      await updateEvent.mutateAsync({
        id: selectedEventId,
        status: 'past',
      });
      refetch();
      toast({ title: 'Success', description: 'Event marked as completed' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update event', variant: 'destructive' });
    }
  };

  const winners = eventDetails?.winners || [];
  const sortedWinners = [...winners].sort((a, b) => a.rank - b.rank);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Winners & Results</h1>
        <p className="text-muted-foreground">Manage event winners and competition results</p>
      </div>

      {/* Event Selection */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg">Select Event</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-end">
            <div className="w-[250px]">
              <Label className="text-xs mb-1 block">Event</Label>
              <Select value={selectedEventId} onValueChange={setSelectedEventId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an event" />
                </SelectTrigger>
                <SelectContent>
                  {eventsLoading ? (
                    <SelectItem value="" disabled>Loading...</SelectItem>
                  ) : (
                    events?.map(e => (
                      <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            {selectedEventId && eventDetails && eventDetails.status !== 'past' && (
              <Button variant="outline" onClick={handleMarkAsCompleted}>
                Mark Event as Completed
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Winners Management */}
      {selectedEventId ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Current Winners */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-primary" />
                Winners ({sortedWinners.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {sortedWinners.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No winners added yet</p>
              ) : (
                <div className="space-y-3">
                  {sortedWinners.map((winner) => {
                    const RankIcon = rankIcons[winner.rank]?.icon || Medal;
                    const rankColor = rankIcons[winner.rank]?.color || 'text-muted-foreground';
                    
                    return (
                      <div 
                        key={winner.id} 
                        className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            winner.rank === 1 ? 'bg-yellow-500/20' :
                            winner.rank === 2 ? 'bg-gray-400/20' :
                            winner.rank === 3 ? 'bg-amber-600/20' : 'bg-muted'
                          }`}>
                            <RankIcon className={`w-5 h-5 ${rankColor}`} />
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{winner.team_name}</p>
                            <p className="text-sm text-muted-foreground">
                              #{winner.rank} {winner.prize && `• ${winner.prize}`}
                            </p>
                          </div>
                        </div>
                        <Button 
                          size="icon" 
                          variant="ghost"
                          onClick={() => handleDeleteWinner(winner.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Add Winner Form */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary" />
                Add Winner
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Team Name *</Label>
                <Input
                  value={newWinner.team_name}
                  onChange={(e) => setNewWinner({ ...newWinner, team_name: e.target.value })}
                  placeholder="Winning team name"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Rank</Label>
                  <Select 
                    value={String(newWinner.rank)} 
                    onValueChange={(v) => setNewWinner({ ...newWinner, rank: parseInt(v) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1st Place</SelectItem>
                      <SelectItem value="2">2nd Place</SelectItem>
                      <SelectItem value="3">3rd Place</SelectItem>
                      <SelectItem value="4">4th Place</SelectItem>
                      <SelectItem value="5">5th Place</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Prize (optional)</Label>
                  <Input
                    value={newWinner.prize}
                    onChange={(e) => setNewWinner({ ...newWinner, prize: e.target.value })}
                    placeholder="$500"
                  />
                </div>
              </div>
              <Button 
                onClick={handleAddWinner} 
                className="w-full"
                disabled={addWinner.isPending}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Winner
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card className="bg-card border-border">
          <CardContent className="py-12">
            <p className="text-muted-foreground text-center">Select an event to manage its winners</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
