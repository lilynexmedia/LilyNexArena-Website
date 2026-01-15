import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEvent, useUpdateEvent } from '@/hooks/useEvents';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Calendar, 
  Users, 
  Image, 
  Trophy, 
  Video, 
  FileText,
  Settings2,
  CheckCircle,
  Medal
} from 'lucide-react';
import { format } from 'date-fns';
import { EventOverviewTab } from '@/components/admin/event-tabs/EventOverviewTab';
import { EventRegistrationsTab } from '@/components/admin/event-tabs/EventRegistrationsTab';
import { EventGalleryTab } from '@/components/admin/event-tabs/EventGalleryTab';
import { EventWinnersTab } from '@/components/admin/event-tabs/EventWinnersTab';
import { EventVideosTab } from '@/components/admin/event-tabs/EventVideosTab';
import { EventRulesTab } from '@/components/admin/event-tabs/EventRulesTab';
import { EventPrizesTab } from '@/components/admin/event-tabs/EventPrizesTab';

const statusColors: Record<string, string> = {
  upcoming: 'bg-primary/20 text-primary',
  live: 'bg-destructive/20 text-destructive',
  past: 'bg-muted text-muted-foreground',
  closed: 'bg-muted/50 text-muted-foreground/50',
};

export const AdminEventDetail = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
  const { data: event, isLoading, refetch } = useEvent(eventId);
  
  const isCompleted = event?.status === 'past' || event?.status === 'closed';
  const isActionable = event?.status === 'upcoming' || event?.status === 'live';

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Event not found</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/admin/events')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Events
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with breadcrumb */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <button 
            onClick={() => navigate('/admin/events')}
            className="hover:text-foreground transition-colors"
          >
            Events
          </button>
          <span>/</span>
          <span className="text-foreground">{event.name}</span>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/admin/events')}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-display font-bold text-foreground">{event.name}</h1>
                <Badge className={statusColors[event.status]}>
                  {event.status}
                </Badge>
              </div>
              <p className="text-muted-foreground text-sm mt-1">
                {event.game} • {format(new Date(event.start_date), 'MMM d, yyyy')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Teams</p>
                <p className="text-xl font-bold">{event.approvedTeamCount}/{event.team_slots}</p>
              </div>
              <Users className="w-6 h-6 text-primary/50" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Prize Pool</p>
                <p className="text-xl font-bold">{event.prize_pool}</p>
              </div>
              <Trophy className="w-6 h-6 text-primary/50" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Videos</p>
                <p className="text-xl font-bold">{event.videos?.length || 0}</p>
              </div>
              <Video className="w-6 h-6 text-primary/50" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Gallery</p>
                <p className="text-xl font-bold">{(event.gallery?.length || 0) + (event.resultGallery?.length || 0)}</p>
              </div>
              <Image className="w-6 h-6 text-primary/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 sm:grid-cols-7 h-auto gap-1 bg-muted/50 p-1">
          <TabsTrigger value="overview" className="gap-2 text-xs sm:text-sm">
            <Settings2 className="w-4 h-4 hidden sm:block" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="registrations" className="gap-2 text-xs sm:text-sm">
            <Users className="w-4 h-4 hidden sm:block" />
            Teams
          </TabsTrigger>
          <TabsTrigger value="prizes" className="gap-2 text-xs sm:text-sm">
            <Medal className="w-4 h-4 hidden sm:block" />
            Prizes
          </TabsTrigger>
          <TabsTrigger value="gallery" className="gap-2 text-xs sm:text-sm">
            <Image className="w-4 h-4 hidden sm:block" />
            Gallery
          </TabsTrigger>
          <TabsTrigger value="videos" className="gap-2 text-xs sm:text-sm">
            <Video className="w-4 h-4 hidden sm:block" />
            Videos
          </TabsTrigger>
          <TabsTrigger value="winners" className="gap-2 text-xs sm:text-sm" disabled={!isCompleted && event.winners?.length === 0}>
            <Trophy className="w-4 h-4 hidden sm:block" />
            Winners
          </TabsTrigger>
          <TabsTrigger value="rules" className="gap-2 text-xs sm:text-sm">
            <FileText className="w-4 h-4 hidden sm:block" />
            Rules
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <EventOverviewTab event={event} onUpdate={refetch} />
        </TabsContent>

        <TabsContent value="registrations">
          <EventRegistrationsTab event={event} isReadOnly={isCompleted} />
        </TabsContent>

        <TabsContent value="prizes">
          <EventPrizesTab event={event} onUpdate={refetch} />
        </TabsContent>

        <TabsContent value="gallery">
          <EventGalleryTab event={event} onUpdate={refetch} />
        </TabsContent>

        <TabsContent value="videos">
          <EventVideosTab event={event} onUpdate={refetch} />
        </TabsContent>

        <TabsContent value="winners">
          <EventWinnersTab event={event} onUpdate={refetch} isDisabled={!isCompleted && event.winners?.length === 0} />
        </TabsContent>

        <TabsContent value="rules">
          <EventRulesTab event={event} onUpdate={refetch} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
