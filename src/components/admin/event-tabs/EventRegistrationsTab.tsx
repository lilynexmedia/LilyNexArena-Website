import { useState } from 'react';
import { useRegistrations, useUpdateRegistration, useUpdateRegistrationDetails } from '@/hooks/useEvents';
import { EventWithDetails, TeamRegistration } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Users, Check, X, Eye, Lock, Download, FileText, GraduationCap, School, User, Phone, Mail, Calendar, Pencil, Save } from 'lucide-react';
import { format } from 'date-fns';

interface ExtendedTeamRegistration extends TeamRegistration {
  captain_ingame_name?: string | null;
  captain_education_type?: string | null;
  captain_school_name?: string | null;
  captain_school_class?: string | null;
  captain_college_name?: string | null;
  captain_college_year?: string | null;
  captain_college_branch?: string | null;
  player_ingame_names?: string[] | null;
  player_education_details?: Array<{
    type: string;
    schoolName?: string | null;
    schoolClass?: string | null;
    collegeName?: string | null;
    collegeYear?: string | null;
    collegeBranch?: string | null;
  }> | null;
  events?: { name: string };
}

interface Props {
  event: EventWithDetails;
  isReadOnly?: boolean;
}

// Helper to format education details
const formatEducation = (edu: { type: string; schoolName?: string | null; schoolClass?: string | null; collegeName?: string | null; collegeYear?: string | null; collegeBranch?: string | null } | null | undefined): string => {
  if (!edu || !edu.type) return 'Not specified';
  if (edu.type === 'school') {
    return `School: ${edu.schoolName || 'N/A'} (Class ${edu.schoolClass || 'N/A'})`;
  }
  if (edu.type === 'college') {
    return `College: ${edu.collegeName || 'N/A'} (${edu.collegeYear || 'N/A'} Year, ${edu.collegeBranch || 'N/A'})`;
  }
  return 'Not specified';
};

// Generate markdown for a single team
const generateTeamMarkdown = (reg: ExtendedTeamRegistration, eventName: string): string => {
  const lines: string[] = [];
  
  lines.push(`# Team Registration: ${reg.team_name}`);
  lines.push('');
  lines.push(`## Event Details`);
  lines.push(`- **Event:** ${eventName}`);
  lines.push(`- **Registration Date:** ${format(new Date(reg.created_at), 'MMMM d, yyyy HH:mm')}`);
  lines.push(`- **Status:** ${reg.status.charAt(0).toUpperCase() + reg.status.slice(1)}`);
  lines.push('');
  
  lines.push(`## Team Information`);
  lines.push(`- **Team Name:** ${reg.team_name}`);
  lines.push('');
  
  lines.push(`## Captain (Player 1)`);
  lines.push(`- **Full Name:** ${reg.captain_name}`);
  lines.push(`- **In-Game Name:** ${reg.captain_ingame_name || 'N/A'}`);
  lines.push(`- **Email:** ${reg.captain_email}`);
  lines.push(`- **Phone:** ${reg.captain_phone || 'N/A'}`);
  
  if (reg.captain_education_type === 'school') {
    lines.push(`- **Education:** School`);
    lines.push(`  - School Name: ${reg.captain_school_name || 'N/A'}`);
    lines.push(`  - Class: ${reg.captain_school_class || 'N/A'}`);
  } else if (reg.captain_education_type === 'college') {
    lines.push(`- **Education:** College`);
    lines.push(`  - College Name: ${reg.captain_college_name || 'N/A'}`);
    lines.push(`  - Year: ${reg.captain_college_year || 'N/A'}`);
    lines.push(`  - Branch: ${reg.captain_college_branch || 'N/A'}`);
  }
  lines.push('');
  
  // Other players
  const playerLabels = ['Player 2', 'Player 3', 'Player 4', 'Player 5 (Substitute)'];
  
  reg.player_names.slice(1).forEach((name, index) => {
    const label = playerLabels[index] || `Player ${index + 2}`;
    const ingameName = reg.player_ingame_names?.[index + 1] || 'N/A';
    const eduDetails = reg.player_education_details?.[index];
    
    lines.push(`## ${label}`);
    lines.push(`- **Full Name:** ${name}`);
    lines.push(`- **In-Game Name:** ${ingameName}`);
    
    if (eduDetails) {
      if (eduDetails.type === 'school') {
        lines.push(`- **Education:** School`);
        lines.push(`  - School Name: ${eduDetails.schoolName || 'N/A'}`);
        lines.push(`  - Class: ${eduDetails.schoolClass || 'N/A'}`);
      } else if (eduDetails.type === 'college') {
        lines.push(`- **Education:** College`);
        lines.push(`  - College Name: ${eduDetails.collegeName || 'N/A'}`);
        lines.push(`  - Year: ${eduDetails.collegeYear || 'N/A'}`);
        lines.push(`  - Branch: ${eduDetails.collegeBranch || 'N/A'}`);
      }
    }
    lines.push('');
  });
  
  lines.push('---');
  lines.push('');
  
  return lines.join('\n');
};

// Download helper
const downloadMarkdown = (content: string, filename: string) => {
  const blob = new Blob([content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const EventRegistrationsTab = ({ event, isReadOnly }: Props) => {
  const [statusTab, setStatusTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [selectedReg, setSelectedReg] = useState<ExtendedTeamRegistration | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editData, setEditData] = useState<ExtendedTeamRegistration | null>(null);
  
  const { data: registrations, isLoading } = useRegistrations(event.id);
  const updateRegistration = useUpdateRegistration();
  const updateRegistrationDetails = useUpdateRegistrationDetails();

  // Check if event status allows approvals (only upcoming/live events)
  const canManageRegistrations = !isReadOnly && (event.status === 'upcoming' || event.status === 'live');
  const isPastEvent = event.status === 'past' || event.status === 'closed';

  const filteredRegistrations = (registrations as ExtendedTeamRegistration[] | undefined)?.filter(r => r.status === statusTab) || [];

  const statusCounts = {
    pending: registrations?.filter(r => r.status === 'pending').length || 0,
    approved: registrations?.filter(r => r.status === 'approved').length || 0,
    rejected: registrations?.filter(r => r.status === 'rejected').length || 0,
  };

  const handleUpdateStatus = async (id: string, status: 'approved' | 'rejected' | 'pending', registration?: ExtendedTeamRegistration) => {
    if (!canManageRegistrations) {
      toast({ title: 'Not Allowed', description: 'Cannot modify registrations for past/closed events', variant: 'destructive' });
      return;
    }
    
    // Find the registration if not provided
    const reg = registration || (registrations as ExtendedTeamRegistration[] | undefined)?.find(r => r.id === id);
    
    try {
      await updateRegistration.mutateAsync({ 
        id, 
        status,
        previousStatus: reg?.status,
        captainName: reg?.captain_name,
        captainEmail: reg?.captain_email,
        teamName: reg?.team_name,
        eventName: event.name
      });
      const statusLabel = status === 'approved' ? 'approved' : status === 'rejected' ? 'rejected' : 'moved to pending';
      const emailNote = status === 'approved' && reg?.status !== 'approved' ? ' (confirmation email sent)' : '';
      toast({ 
        title: 'Success', 
        description: `Team ${statusLabel} successfully${emailNote}` 
      });
      setSelectedReg(null);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update status', variant: 'destructive' });
    }
  };

  const handleStartEdit = (reg: ExtendedTeamRegistration) => {
    setEditData({ ...reg });
    setIsEditMode(true);
  };

  const handleCancelEdit = () => {
    setEditData(null);
    setIsEditMode(false);
  };

  const handleSaveEdit = async () => {
    if (!editData || !selectedReg) return;
    
    try {
      await updateRegistrationDetails.mutateAsync({
        id: selectedReg.id,
        team_name: editData.team_name,
        captain_name: editData.captain_name,
        captain_ingame_name: editData.captain_ingame_name || undefined,
        captain_email: editData.captain_email,
        captain_phone: editData.captain_phone || undefined,
        captain_education_type: editData.captain_education_type || undefined,
        captain_school_name: editData.captain_school_name || undefined,
        captain_school_class: editData.captain_school_class || undefined,
        captain_college_name: editData.captain_college_name || undefined,
        captain_college_year: editData.captain_college_year || undefined,
        captain_college_branch: editData.captain_college_branch || undefined,
        player_names: editData.player_names,
        player_ingame_names: editData.player_ingame_names || undefined,
        player_education_details: editData.player_education_details || undefined,
      });
      
      toast({ title: 'Success', description: 'Team details updated successfully' });
      setSelectedReg(editData);
      setIsEditMode(false);
      setEditData(null);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update team details', variant: 'destructive' });
    }
  };

  const updatePlayerName = (index: number, value: string) => {
    if (!editData) return;
    const newNames = [...editData.player_names];
    newNames[index] = value;
    setEditData({ ...editData, player_names: newNames });
  };

  const updatePlayerIngameName = (index: number, value: string) => {
    if (!editData) return;
    const newIngameNames = [...(editData.player_ingame_names || [])];
    newIngameNames[index] = value;
    setEditData({ ...editData, player_ingame_names: newIngameNames });
  };

  const updatePlayerEducation = (index: number, field: string, value: string) => {
    if (!editData) return;
    const newEduDetails = [...(editData.player_education_details || [])];
    if (!newEduDetails[index]) {
      newEduDetails[index] = { type: 'school' };
    }
    (newEduDetails[index] as any)[field] = value;
    setEditData({ ...editData, player_education_details: newEduDetails });
  };

  const handleExportSingle = (reg: ExtendedTeamRegistration) => {
    const content = generateTeamMarkdown(reg, event.name);
    const filename = `${reg.team_name.replace(/[^a-zA-Z0-9]/g, '_')}_registration.md`;
    downloadMarkdown(content, filename);
    toast({ title: 'Exported', description: `${reg.team_name} exported as .md file` });
  };

  const handleExportAll = (status: 'pending' | 'approved' | 'rejected') => {
    const regs = (registrations as ExtendedTeamRegistration[] | undefined)?.filter(r => r.status === status) || [];
    if (regs.length === 0) {
      toast({ title: 'No Data', description: `No ${status} registrations to export`, variant: 'destructive' });
      return;
    }
    
    let content = `# ${event.name} - ${status.charAt(0).toUpperCase() + status.slice(1)} Registrations\n\n`;
    content += `**Exported on:** ${format(new Date(), 'MMMM d, yyyy HH:mm')}\n`;
    content += `**Total Teams:** ${regs.length}\n\n`;
    content += '---\n\n';
    
    regs.forEach(reg => {
      content += generateTeamMarkdown(reg, event.name);
    });
    
    const filename = `${event.slug}_${status}_registrations.md`;
    downloadMarkdown(content, filename);
    toast({ title: 'Exported', description: `${regs.length} ${status} registrations exported` });
  };

  const displayReg = isEditMode && editData ? editData : selectedReg;

  return (
    <div className="space-y-6">
      {isPastEvent && (
        <Card className="bg-yellow-500/10 border-yellow-500/30">
          <CardContent className="py-4 flex items-center gap-3">
            <Lock className="w-5 h-5 text-yellow-500" />
            <div>
              <p className="font-medium text-yellow-500">Registrations Locked</p>
              <p className="text-sm text-yellow-500/80">This event has ended. Team approvals/rejections are disabled.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Status Summary */}
      <div className="grid grid-cols-3 gap-4">
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

      {/* Registrations by Status */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Team Registrations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={statusTab} onValueChange={(v) => setStatusTab(v as typeof statusTab)}>
            <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
              <TabsList>
                <TabsTrigger value="pending" className="gap-2">
                  Pending ({statusCounts.pending})
                </TabsTrigger>
                <TabsTrigger value="approved" className="gap-2">
                  Approved ({statusCounts.approved})
                </TabsTrigger>
                <TabsTrigger value="rejected" className="gap-2">
                  Rejected ({statusCounts.rejected})
                </TabsTrigger>
              </TabsList>
              
              {/* Export All Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExportAll(statusTab)}
                disabled={filteredRegistrations.length === 0}
                className="gap-2"
              >
                <Download className="w-4 h-4" />
                Export All {statusTab.charAt(0).toUpperCase() + statusTab.slice(1)}
              </Button>
            </div>

            {['pending', 'approved', 'rejected'].map(status => (
              <TabsContent key={status} value={status}>
                {isLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full" />)}
                  </div>
                ) : filteredRegistrations.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No {status} registrations
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Team</TableHead>
                          <TableHead>Captain</TableHead>
                          <TableHead>Players</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredRegistrations.map(reg => (
                          <TableRow key={reg.id}>
                            <TableCell className="font-medium">{reg.team_name}</TableCell>
                            <TableCell>
                              <div>
                                <p className="text-sm">{reg.captain_name}</p>
                                <p className="text-xs text-muted-foreground">{reg.captain_email}</p>
                              </div>
                            </TableCell>
                            <TableCell>{reg.player_names.length} players</TableCell>
                            <TableCell>{format(new Date(reg.created_at), 'MMM d, HH:mm')}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Button 
                                  size="icon" 
                                  variant="ghost" 
                                  onClick={() => handleExportSingle(reg)}
                                  title="Export as .md"
                                >
                                  <FileText className="w-4 h-4" />
                                </Button>
                                <Button size="icon" variant="ghost" onClick={() => { setSelectedReg(reg); setIsEditMode(false); setEditData(null); }}>
                                  <Eye className="w-4 h-4" />
                                </Button>
                                {canManageRegistrations && (
                                  <Select
                                    value={reg.status}
                                    onValueChange={(value: 'pending' | 'approved' | 'rejected') => handleUpdateStatus(reg.id, value, reg)}
                                  >
                                    <SelectTrigger className="w-[110px] h-8">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="pending">
                                        <span className="flex items-center gap-2 text-yellow-500">
                                          <Users className="w-3 h-3" /> Pending
                                        </span>
                                      </SelectItem>
                                      <SelectItem value="approved">
                                        <span className="flex items-center gap-2 text-green-500">
                                          <Check className="w-3 h-3" /> Approved
                                        </span>
                                      </SelectItem>
                                      <SelectItem value="rejected">
                                        <span className="flex items-center gap-2 text-destructive">
                                          <X className="w-3 h-3" /> Rejected
                                        </span>
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                )}
                                {isPastEvent && (
                                  <span className="text-xs text-muted-foreground ml-2">
                                    <Lock className="w-3 h-3 inline" />
                                  </span>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Detail/Edit Dialog */}
      <Dialog open={!!selectedReg} onOpenChange={() => { setSelectedReg(null); setIsEditMode(false); setEditData(null); }}>
        <DialogContent className="max-w-2xl max-h-[90vh]">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                {isEditMode ? 'Edit Team Details' : 'Team Details'}
              </DialogTitle>
              <div className="flex items-center gap-2">
                {!isEditMode && selectedReg && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStartEdit(selectedReg)}
                      className="gap-2"
                    >
                      <Pencil className="w-4 h-4" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExportSingle(selectedReg)}
                      className="gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Export .md
                    </Button>
                  </>
                )}
                {isEditMode && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSaveEdit}
                      disabled={updateRegistrationDetails.isPending}
                      className="gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Save Changes
                    </Button>
                  </>
                )}
              </div>
            </div>
          </DialogHeader>
          {displayReg && (
            <ScrollArea className="max-h-[70vh] pr-4">
              <div className="space-y-6">
                {/* Team Info */}
                <div className="p-4 rounded-lg bg-muted/30 border border-border">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Users className="w-3 h-3" /> Team Name
                      </p>
                      {isEditMode ? (
                        <Input
                          value={editData?.team_name || ''}
                          onChange={(e) => setEditData(editData ? { ...editData, team_name: e.target.value } : null)}
                          className="mt-1"
                        />
                      ) : (
                        <p className="font-semibold text-lg">{displayReg.team_name}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Registered
                      </p>
                      <p className="font-medium">{format(new Date(displayReg.created_at), 'MMM d, yyyy HH:mm')}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-muted-foreground mb-1">Status</p>
                      {canManageRegistrations && !isEditMode ? (
                        <Select
                          value={displayReg.status}
                          onValueChange={(value: 'pending' | 'approved' | 'rejected') => handleUpdateStatus(displayReg.id, value, displayReg)}
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">
                              <span className="flex items-center gap-2 text-yellow-500">
                                <Users className="w-3 h-3" /> Pending
                              </span>
                            </SelectItem>
                            <SelectItem value="approved">
                              <span className="flex items-center gap-2 text-green-500">
                                <Check className="w-3 h-3" /> Approved
                              </span>
                            </SelectItem>
                            <SelectItem value="rejected">
                              <span className="flex items-center gap-2 text-destructive">
                                <X className="w-3 h-3" /> Rejected
                              </span>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge variant={
                          displayReg.status === 'pending' ? 'secondary' :
                          displayReg.status === 'approved' ? 'default' : 'destructive'
                        } className={
                          displayReg.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                          displayReg.status === 'approved' ? 'bg-green-500/20 text-green-500' :
                          'bg-destructive/20'
                        }>
                          {displayReg.status.charAt(0).toUpperCase() + displayReg.status.slice(1)}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Captain (Player 1) */}
                <div className="p-4 rounded-lg border border-primary/30 bg-primary/5">
                  <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">1</div>
                    Captain (Team Leader)
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <User className="w-3 h-3" /> Full Name
                      </p>
                      {isEditMode ? (
                        <Input
                          value={editData?.captain_name || ''}
                          onChange={(e) => setEditData(editData ? { ...editData, captain_name: e.target.value } : null)}
                          className="mt-1"
                        />
                      ) : (
                        <p className="font-medium">{displayReg.captain_name}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">In-Game Name</p>
                      {isEditMode ? (
                        <Input
                          value={editData?.captain_ingame_name || ''}
                          onChange={(e) => setEditData(editData ? { ...editData, captain_ingame_name: e.target.value } : null)}
                          className="mt-1"
                        />
                      ) : (
                        <p className="font-medium">{displayReg.captain_ingame_name || 'N/A'}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Mail className="w-3 h-3" /> Email
                      </p>
                      {isEditMode ? (
                        <Input
                          value={editData?.captain_email || ''}
                          onChange={(e) => setEditData(editData ? { ...editData, captain_email: e.target.value } : null)}
                          className="mt-1"
                        />
                      ) : (
                        <p className="font-medium">{displayReg.captain_email}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Phone className="w-3 h-3" /> Phone
                      </p>
                      {isEditMode ? (
                        <Input
                          value={editData?.captain_phone || ''}
                          onChange={(e) => setEditData(editData ? { ...editData, captain_phone: e.target.value } : null)}
                          className="mt-1"
                        />
                      ) : (
                        <p className="font-medium">{displayReg.captain_phone || 'N/A'}</p>
                      )}
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                        {displayReg.captain_education_type === 'school' ? <School className="w-3 h-3" /> : <GraduationCap className="w-3 h-3" />}
                        Education
                      </p>
                      {isEditMode ? (
                        <div className="space-y-2">
                          <Select
                            value={editData?.captain_education_type || 'school'}
                            onValueChange={(v) => setEditData(editData ? { ...editData, captain_education_type: v } : null)}
                          >
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="school">School</SelectItem>
                              <SelectItem value="college">College</SelectItem>
                            </SelectContent>
                          </Select>
                          {editData?.captain_education_type === 'school' ? (
                            <div className="grid grid-cols-2 gap-2">
                              <Input
                                placeholder="School Name"
                                value={editData?.captain_school_name || ''}
                                onChange={(e) => setEditData({ ...editData, captain_school_name: e.target.value })}
                              />
                              <Input
                                placeholder="Class"
                                value={editData?.captain_school_class || ''}
                                onChange={(e) => setEditData({ ...editData, captain_school_class: e.target.value })}
                              />
                            </div>
                          ) : (
                            <div className="grid grid-cols-3 gap-2">
                              <Input
                                placeholder="College Name"
                                value={editData?.captain_college_name || ''}
                                onChange={(e) => setEditData(editData ? { ...editData, captain_college_name: e.target.value } : null)}
                              />
                              <Input
                                placeholder="Year"
                                value={editData?.captain_college_year || ''}
                                onChange={(e) => setEditData(editData ? { ...editData, captain_college_year: e.target.value } : null)}
                              />
                              <Input
                                placeholder="Branch"
                                value={editData?.captain_college_branch || ''}
                                onChange={(e) => setEditData(editData ? { ...editData, captain_college_branch: e.target.value } : null)}
                              />
                            </div>
                          )}
                        </div>
                      ) : displayReg.captain_education_type === 'school' ? (
                        <div className="p-2 rounded bg-muted/30 text-sm">
                          <p><span className="text-muted-foreground">School:</span> {displayReg.captain_school_name || 'N/A'}</p>
                          <p><span className="text-muted-foreground">Class:</span> {displayReg.captain_school_class || 'N/A'}</p>
                        </div>
                      ) : displayReg.captain_education_type === 'college' ? (
                        <div className="p-2 rounded bg-muted/30 text-sm">
                          <p><span className="text-muted-foreground">College:</span> {displayReg.captain_college_name || 'N/A'}</p>
                          <p><span className="text-muted-foreground">Year:</span> {displayReg.captain_college_year || 'N/A'}</p>
                          <p><span className="text-muted-foreground">Branch:</span> {displayReg.captain_college_branch || 'N/A'}</p>
                        </div>
                      ) : (
                        <p className="text-muted-foreground">Not specified</p>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Other Players */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-sm">Team Members</h3>
                  {displayReg.player_names.slice(1).map((name, index) => {
                    const isSubstitute = index === 3;
                    const ingameName = displayReg.player_ingame_names?.[index + 1] || 'N/A';
                    const eduDetails = displayReg.player_education_details?.[index];
                    
                    return (
                      <div 
                        key={index}
                        className={`p-4 rounded-lg border ${isSubstitute ? 'border-secondary/30 bg-secondary/5' : 'border-border bg-muted/20'}`}
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isSubstitute ? 'bg-secondary/20 text-secondary' : 'bg-primary/20 text-primary'}`}>
                            {index + 2}
                          </div>
                          <span className="font-medium text-sm">
                            {isSubstitute ? 'Substitute Player' : `Player ${index + 2}`}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className="text-xs text-muted-foreground">Full Name</p>
                            {isEditMode ? (
                              <Input
                                value={editData?.player_names[index + 1] || ''}
                                onChange={(e) => updatePlayerName(index + 1, e.target.value)}
                                className="mt-1"
                              />
                            ) : (
                              <p className="font-medium">{name}</p>
                            )}
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">In-Game Name</p>
                            {isEditMode ? (
                              <Input
                                value={editData?.player_ingame_names?.[index + 1] || ''}
                                onChange={(e) => updatePlayerIngameName(index + 1, e.target.value)}
                                className="mt-1"
                              />
                            ) : (
                              <p className="font-medium">{ingameName}</p>
                            )}
                          </div>
                          <div className="col-span-2">
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                              {eduDetails?.type === 'school' ? <School className="w-3 h-3" /> : <GraduationCap className="w-3 h-3" />}
                              Education
                            </p>
                            {isEditMode ? (
                              <div className="space-y-2">
                                <Select
                                  value={editData?.player_education_details?.[index]?.type || 'school'}
                                  onValueChange={(v) => updatePlayerEducation(index, 'type', v)}
                                >
                                  <SelectTrigger><SelectValue /></SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="school">School</SelectItem>
                                    <SelectItem value="college">College</SelectItem>
                                  </SelectContent>
                                </Select>
                                {editData?.player_education_details?.[index]?.type === 'school' ? (
                                  <div className="grid grid-cols-2 gap-2">
                                    <Input
                                      placeholder="School Name"
                                      value={editData?.player_education_details?.[index]?.schoolName || ''}
                                      onChange={(e) => updatePlayerEducation(index, 'schoolName', e.target.value)}
                                    />
                                    <Input
                                      placeholder="Class"
                                      value={editData?.player_education_details?.[index]?.schoolClass || ''}
                                      onChange={(e) => updatePlayerEducation(index, 'schoolClass', e.target.value)}
                                    />
                                  </div>
                                ) : (
                                  <div className="grid grid-cols-3 gap-2">
                                    <Input
                                      placeholder="College Name"
                                      value={editData?.player_education_details?.[index]?.collegeName || ''}
                                      onChange={(e) => updatePlayerEducation(index, 'collegeName', e.target.value)}
                                    />
                                    <Input
                                      placeholder="Year"
                                      value={editData?.player_education_details?.[index]?.collegeYear || ''}
                                      onChange={(e) => updatePlayerEducation(index, 'collegeYear', e.target.value)}
                                    />
                                    <Input
                                      placeholder="Branch"
                                      value={editData?.player_education_details?.[index]?.collegeBranch || ''}
                                      onChange={(e) => updatePlayerEducation(index, 'collegeBranch', e.target.value)}
                                    />
                                  </div>
                                )}
                              </div>
                            ) : eduDetails?.type === 'school' ? (
                              <div className="p-2 rounded bg-background/50 text-sm">
                                <p><span className="text-muted-foreground">School:</span> {eduDetails.schoolName || 'N/A'}</p>
                                <p><span className="text-muted-foreground">Class:</span> {eduDetails.schoolClass || 'N/A'}</p>
                              </div>
                            ) : eduDetails?.type === 'college' ? (
                              <div className="p-2 rounded bg-background/50 text-sm">
                                <p><span className="text-muted-foreground">College:</span> {eduDetails.collegeName || 'N/A'}</p>
                                <p><span className="text-muted-foreground">Year:</span> {eduDetails.collegeYear || 'N/A'}</p>
                                <p><span className="text-muted-foreground">Branch:</span> {eduDetails.collegeBranch || 'N/A'}</p>
                              </div>
                            ) : (
                              <p className="text-muted-foreground">Not specified</p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Action Buttons */}
                {canManageRegistrations && selectedReg?.status === 'pending' && !isEditMode && (
                  <div className="flex gap-2 pt-4 border-t border-border">
                    <Button 
                      className="flex-1 bg-green-500 hover:bg-green-600"
                      onClick={() => handleUpdateStatus(selectedReg.id, 'approved', selectedReg)}
                      disabled={updateRegistration.isPending}
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Approve Team
                    </Button>
                    <Button 
                      variant="destructive" 
                      className="flex-1"
                      onClick={() => handleUpdateStatus(selectedReg.id, 'rejected', selectedReg)}
                      disabled={updateRegistration.isPending}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                )}
                
                {isPastEvent && selectedReg?.status === 'pending' && !isEditMode && (
                  <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-center">
                    <Lock className="w-5 h-5 text-yellow-500 mx-auto mb-2" />
                    <p className="text-sm text-yellow-500">
                      This event has ended. Team status cannot be changed.
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
