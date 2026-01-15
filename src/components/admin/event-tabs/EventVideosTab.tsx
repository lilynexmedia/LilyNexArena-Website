import { useState } from 'react';
import { useAddEventVideo, useDeleteEventVideo } from '@/hooks/useEvents';
import { EventWithDetails } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Video, Plus, Trash2, Play, ExternalLink } from 'lucide-react';

interface Props {
  event: EventWithDetails;
  onUpdate: () => void;
}

export const EventVideosTab = ({ event, onUpdate }: Props) => {
  const addVideo = useAddEventVideo();
  const deleteVideo = useDeleteEventVideo();

  const [newVideo, setNewVideo] = useState({
    title: '',
    youtube_url: '',
    video_type: 'match' as 'match' | 'highlight' | 'stream',
    description: '',
  });

  const extractYoutubeId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /^([a-zA-Z0-9_-]{11})$/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const handleAddVideo = async () => {
    if (!newVideo.title || !newVideo.youtube_url) {
      toast({ title: 'Error', description: 'Title and YouTube URL are required', variant: 'destructive' });
      return;
    }

    const youtubeId = extractYoutubeId(newVideo.youtube_url);
    if (!youtubeId) {
      toast({ title: 'Error', description: 'Invalid YouTube URL', variant: 'destructive' });
      return;
    }

    try {
      await addVideo.mutateAsync({
        event_id: event.id,
        title: newVideo.title,
        youtube_id: youtubeId,
        video_type: newVideo.video_type,
        description: newVideo.description || null,
      });
      setNewVideo({ title: '', youtube_url: '', video_type: 'match', description: '' });
      onUpdate();
      toast({ title: 'Success', description: 'Video added' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to add video', variant: 'destructive' });
    }
  };

  const handleDeleteVideo = async (id: string) => {
    if (!confirm('Remove this video?')) return;

    try {
      await deleteVideo.mutateAsync({ id, eventId: event.id });
      onUpdate();
      toast({ title: 'Success', description: 'Video removed' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to remove video', variant: 'destructive' });
    }
  };

  const videos = event.videos || [];

  return (
    <div className="space-y-6">
      {/* Add Video Form */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary" />
            Add Match Video
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Video Title *</Label>
              <Input
                value={newVideo.title}
                onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                placeholder="e.g., Semi-Final Match 1"
              />
            </div>
            <div className="space-y-2">
              <Label>YouTube URL *</Label>
              <Input
                value={newVideo.youtube_url}
                onChange={(e) => setNewVideo({ ...newVideo, youtube_url: e.target.value })}
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>
            <div className="space-y-2">
              <Label>Video Type</Label>
              <Select 
                value={newVideo.video_type} 
                onValueChange={(v: 'match' | 'highlight' | 'stream') => setNewVideo({ ...newVideo, video_type: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="match">Match Recording</SelectItem>
                  <SelectItem value="highlight">Highlight</SelectItem>
                  <SelectItem value="stream">Stream VOD</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Description (optional)</Label>
              <Input
                value={newVideo.description}
                onChange={(e) => setNewVideo({ ...newVideo, description: e.target.value })}
                placeholder="Brief description..."
              />
            </div>
          </div>
          <Button 
            onClick={handleAddVideo} 
            className="mt-4"
            disabled={addVideo.isPending}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Video
          </Button>
        </CardContent>
      </Card>

      {/* Videos List */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="w-5 h-5 text-primary" />
            Event Videos ({videos.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {videos.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
              <Video className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No videos added yet</p>
              <p className="text-sm text-muted-foreground mt-1">Add match recordings and highlights above</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {videos.map((video) => (
                <div key={video.id} className="rounded-lg border border-border overflow-hidden bg-muted/20">
                  <div className="relative aspect-video">
                    <img 
                      src={`https://img.youtube.com/vi/${video.youtube_id}/mqdefault.jpg`}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-background/40">
                      <a 
                        href={`https://youtube.com/watch?v=${video.youtube_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 rounded-full bg-destructive flex items-center justify-center hover:bg-destructive/80 transition-colors"
                      >
                        <Play className="w-5 h-5 text-white fill-white" />
                      </a>
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{video.title}</h4>
                        <p className="text-xs text-muted-foreground capitalize">{video.video_type}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <a 
                          href={`https://youtube.com/watch?v=${video.youtube_id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 hover:bg-muted rounded"
                        >
                          <ExternalLink className="w-4 h-4 text-muted-foreground" />
                        </a>
                        <Button 
                          size="icon" 
                          variant="ghost"
                          className="h-7 w-7"
                          onClick={() => handleDeleteVideo(video.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
