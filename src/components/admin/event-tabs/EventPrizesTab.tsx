import { useState } from 'react';
import { EventWithDetails, PrizeDistribution } from '@/lib/types';
import { useAddPrizeDistribution, useDeletePrizeDistribution, useUpdatePrizeDistribution } from '@/hooks/useEvents';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Plus, Trash2, Trophy, Save, Medal } from 'lucide-react';

interface Props {
  event: EventWithDetails;
  onUpdate: () => void;
}

const getMedalIcon = (position: number) => {
  switch (position) {
    case 1: return '🥇';
    case 2: return '🥈';
    case 3: return '🥉';
    default: return `#${position}`;
  }
};

export const EventPrizesTab = ({ event, onUpdate }: Props) => {
  const addPrize = useAddPrizeDistribution();
  const deletePrize = useDeletePrizeDistribution();
  const updatePrize = useUpdatePrizeDistribution();
  
  const [newPrize, setNewPrize] = useState({ place: '', prize: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<{ place: string; prize: string }>({ place: '', prize: '' });

  // Get existing positions to prevent duplicates
  const existingPositions = new Set(
    event.prizeDistribution?.map(p => p.place.toLowerCase().trim()) || []
  );

  const handleAdd = async () => {
    if (!newPrize.place.trim() || !newPrize.prize.trim()) {
      toast({ title: 'Error', description: 'Both position and prize are required', variant: 'destructive' });
      return;
    }

    // Check for duplicate position
    if (existingPositions.has(newPrize.place.toLowerCase().trim())) {
      toast({ title: 'Error', description: 'This position already exists', variant: 'destructive' });
      return;
    }

    try {
      const sortOrder = extractSortOrder(newPrize.place);
      await addPrize.mutateAsync({
        event_id: event.id,
        place: newPrize.place.trim(),
        prize: newPrize.prize.trim(),
        sort_order: sortOrder,
      });
      setNewPrize({ place: '', prize: '' });
      onUpdate();
      toast({ title: 'Success', description: 'Prize added successfully' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to add prize', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this prize?')) return;
    
    try {
      await deletePrize.mutateAsync({ id, eventId: event.id });
      onUpdate();
      toast({ title: 'Success', description: 'Prize deleted' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete prize', variant: 'destructive' });
    }
  };

  const handleEdit = (prize: PrizeDistribution) => {
    setEditingId(prize.id);
    setEditData({ place: prize.place, prize: prize.prize });
  };

  const handleSaveEdit = async () => {
    if (!editingId || !editData.place.trim() || !editData.prize.trim()) {
      toast({ title: 'Error', description: 'Both position and prize are required', variant: 'destructive' });
      return;
    }

    // Check for duplicate position (excluding current item)
    const currentPrize = event.prizeDistribution?.find(p => p.id === editingId);
    const otherPositions = new Set(
      event.prizeDistribution
        ?.filter(p => p.id !== editingId)
        .map(p => p.place.toLowerCase().trim()) || []
    );
    
    if (otherPositions.has(editData.place.toLowerCase().trim())) {
      toast({ title: 'Error', description: 'This position already exists', variant: 'destructive' });
      return;
    }

    try {
      const sortOrder = extractSortOrder(editData.place);
      await updatePrize.mutateAsync({
        id: editingId,
        eventId: event.id,
        place: editData.place.trim(),
        prize: editData.prize.trim(),
        sort_order: sortOrder,
      });
      setEditingId(null);
      setEditData({ place: '', prize: '' });
      onUpdate();
      toast({ title: 'Success', description: 'Prize updated successfully' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update prize', variant: 'destructive' });
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({ place: '', prize: '' });
  };

  // Extract numeric sort order from place string (e.g., "1st Prize" -> 1)
  const extractSortOrder = (place: string): number => {
    const match = place.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 999;
  };

  const sortedPrizes = [...(event.prizeDistribution || [])].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div className="space-y-6">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            Prize Distribution
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add new prize */}
          <div className="p-4 rounded-lg bg-muted/30 border border-border">
            <h3 className="font-heading font-semibold mb-4">Add New Prize</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Position</Label>
                <Input
                  value={newPrize.place}
                  onChange={(e) => setNewPrize({ ...newPrize, place: e.target.value })}
                  placeholder="e.g., 1st Prize, 2nd Prize"
                />
              </div>
              <div className="space-y-2">
                <Label>Prize Amount/Description</Label>
                <Input
                  value={newPrize.prize}
                  onChange={(e) => setNewPrize({ ...newPrize, prize: e.target.value })}
                  placeholder="e.g., ₹5,000 + Trophy"
                />
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={handleAdd} 
                  disabled={addPrize.isPending || !newPrize.place.trim() || !newPrize.prize.trim()}
                  className="w-full md:w-auto"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Prize
                </Button>
              </div>
            </div>
          </div>

          {/* Prize list */}
          {sortedPrizes.length === 0 ? (
            <div className="text-center py-12">
              <Medal className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">No prizes added yet</p>
              <p className="text-sm text-muted-foreground mt-1">Add prize positions to show on the event page</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedPrizes.map((prize) => (
                <div
                  key={prize.id}
                  className="flex items-center gap-4 p-4 rounded-lg bg-muted/20 border border-border hover:border-primary/30 transition-colors"
                >
                  {editingId === prize.id ? (
                    <>
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          value={editData.place}
                          onChange={(e) => setEditData({ ...editData, place: e.target.value })}
                          placeholder="Position"
                        />
                        <Input
                          value={editData.prize}
                          onChange={(e) => setEditData({ ...editData, prize: e.target.value })}
                          placeholder="Prize"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleSaveEdit} disabled={updatePrize.isPending}>
                          <Save className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={cancelEdit}>
                          Cancel
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-lg">
                        {getMedalIcon(prize.sort_order)}
                      </div>
                      <div className="flex-1">
                        <p className="font-heading font-semibold">{prize.place}</p>
                        <p className="text-sm text-primary">{prize.prize}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => handleEdit(prize)}
                        >
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDelete(prize.id)}
                          disabled={deletePrize.isPending}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
