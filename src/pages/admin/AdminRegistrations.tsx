import { useState } from 'react';
import { useRegistrations, useUpdateRegistration, useEvents } from '@/hooks/useEvents';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Users, Check, X, Eye, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { TeamRegistration } from '@/lib/types';

export const AdminRegistrations = () => {
  const { data: events } = useEvents();
  const [selectedEventId, setSelectedEventId] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedReg, setSelectedReg] = useState<(TeamRegistration & { events?: { name: string } }) | null>(null);

  const { data: registrations, isLoading } = useRegistrations(
    selectedEventId === 'all' ? undefined : selectedEventId
  );
  const updateRegistration = useUpdateRegistration();

  const filteredRegistrations = registrations?.filter(r => 
    statusFilter === 'all' || r.status === statusFilter
  );

  const handleUpdateStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await updateRegistration.mutateAsync({ id, status });
      toast({ 
        title: 'Success', 
        description: `Team ${status === 'approved' ? 'approved' : 'rejected'} successfully` 
      });
      setSelectedReg(null);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update status', variant: 'destructive' });
    }
  };

  const statusCounts = {
    pending: registrations?.filter(r => r.status === 'pending').length || 0,
    approved: registrations?.filter(r => r.status === 'approved').length || 0,
    rejected: registrations?.filter(r => r.status === 'rejected').length || 0,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Team Registrations</h1>
        <p className="text-muted-foreground">Review and manage team registrations</p>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-yellow-500/10 border-yellow-500/30">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-500">Pending</p>
                <p className="text-2xl font-bold text-yellow-500">{statusCounts.pending}</p>
              </div>
              <Users className="w-8 h-8 text-yellow-500/50" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-green-500/10 border-green-500/30">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-500">Approved</p>
                <p className="text-2xl font-bold text-green-500">{statusCounts.approved}</p>
              </div>
              <Check className="w-8 h-8 text-green-500/50" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-destructive/10 border-destructive/30">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-destructive">Rejected</p>
                <p className="text-2xl font-bold text-destructive">{statusCounts.rejected}</p>
              </div>
              <X className="w-8 h-8 text-destructive/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Filter className="w-4 h-4 text-primary" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="w-[200px]">
              <Select value={selectedEventId} onValueChange={setSelectedEventId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Event" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Events</SelectItem>
                  {events?.map(e => (
                    <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-[150px]">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Registrations Table */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Registrations ({filteredRegistrations?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full" />)}
            </div>
          ) : filteredRegistrations?.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No registrations found</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Team</TableHead>
                    <TableHead>Event</TableHead>
                    <TableHead>Captain</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRegistrations?.map(reg => (
                    <TableRow key={reg.id}>
                      <TableCell className="font-medium">{reg.team_name}</TableCell>
                      <TableCell>{reg.events?.name || '-'}</TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{reg.captain_name}</p>
                          <p className="text-xs text-muted-foreground">{reg.captain_email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          reg.status === 'pending' ? 'secondary' :
                          reg.status === 'approved' ? 'default' : 'destructive'
                        } className={
                          reg.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30' :
                          reg.status === 'approved' ? 'bg-green-500/20 text-green-500 hover:bg-green-500/30' :
                          'bg-destructive/20'
                        }>
                          {reg.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{format(new Date(reg.created_at), 'MMM d, HH:mm')}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button size="icon" variant="ghost" onClick={() => setSelectedReg(reg)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          {reg.status === 'pending' && (
                            <>
                              <Button 
                                size="icon" 
                                variant="ghost" 
                                onClick={() => handleUpdateStatus(reg.id, 'approved')}
                                title="Approve"
                              >
                                <Check className="w-4 h-4 text-green-500" />
                              </Button>
                              <Button 
                                size="icon" 
                                variant="ghost" 
                                onClick={() => handleUpdateStatus(reg.id, 'rejected')}
                                title="Reject"
                              >
                                <X className="w-4 h-4 text-destructive" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={!!selectedReg} onOpenChange={() => setSelectedReg(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Team Details</DialogTitle>
          </DialogHeader>
          {selectedReg && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Team Name</p>
                  <p className="font-medium">{selectedReg.team_name}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Event</p>
                  <p className="font-medium">{selectedReg.events?.name || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Captain</p>
                  <p className="font-medium">{selectedReg.captain_name}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="font-medium text-sm">{selectedReg.captain_email}</p>
                </div>
                {selectedReg.captain_phone && (
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="font-medium">{selectedReg.captain_phone}</p>
                  </div>
                )}
              </div>
              
              <div>
                <p className="text-xs text-muted-foreground mb-2">Players</p>
                <div className="space-y-1">
                  {selectedReg.player_names.map((name, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm p-2 rounded bg-muted/30">
                      <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center">
                        {i + 1}
                      </span>
                      <span>{name}</span>
                      {selectedReg.player_discord_ids?.[i] && (
                        <span className="text-muted-foreground text-xs">({selectedReg.player_discord_ids[i]})</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {selectedReg.status === 'pending' && (
                <div className="flex gap-2 pt-4 border-t border-border">
                  <Button 
                    className="flex-1 bg-green-500 hover:bg-green-600"
                    onClick={() => handleUpdateStatus(selectedReg.id, 'approved')}
                    disabled={updateRegistration.isPending}
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Approve Team
                  </Button>
                  <Button 
                    variant="destructive" 
                    className="flex-1"
                    onClick={() => handleUpdateStatus(selectedReg.id, 'rejected')}
                    disabled={updateRegistration.isPending}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
