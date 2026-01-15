import { useState } from 'react';
import { Event, EventVideo } from '@/lib/types';
import { useEventVideos, useAddEventVideo, useDeleteEventVideo } from '@/hooks/useEvents';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Plus, Trash2, Video, ExternalLink } from 'lucide-react';

interface Props {
  event: Event | null;
  open: boolean;
  onClose: () => void;
}

const extractYouTubeId = (url: string): string => {
  const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/s]{11})/);
  return match ? match[1] : url;
};

export const EventVideosEditor = ({ event, open, onClose }: Props) => {
  const { data: videos, refetch } = useEventVideos(event?.id || '');
  const addVideo = useAddEventVideo();
  const deleteVideo = useDeleteEventVideo();

  const [newVideo, setNewVideo] = useState({
    title: '',
    youtube_url: '',
    description: '',
    video_type: 'match' as 'match' | 'highlight' | 'stream',
  });

  const handleAdd = async () => {
    if (!event || !newVideo.title || !newVideo.youtube_url) {
      toast({ title: 'Error', description: 'Title and YouTube URL are required', variant: 'destructive' });
      return;
    }

    const youtubeId = extractYouTubeId(newVideo.youtube_url);
    if (!youtubeId) {
      toast({ title: 'Error', description: 'Invalid YouTube URL', variant: 'destructive' });
      return;
    }

    try {
      await addVideo.mutateAsync({
        event_id: event.id,
        youtube_id: youtubeId,
        title: newVideo.title,
        description: newVideo.description || null,
        video_type: newVideo.video_type,
      });
      setNewVideo({ title: '', youtube_url: '', description: '', video_type: 'match' });
      refetch();
      toast({ title: 'Success', description: 'Video added' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to add video', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!event) return;
    
    try {
      await deleteVideo.mutateAsync({ id, eventId: event.id });
      refetch();
      toast({ title: 'Success', description: 'Video deleted' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete video', variant: 'destructive' });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Video className="w-5 h-5 text-primary" />
            Match Videos - {event?.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Existing Videos */}
          <div className="space-y-2">
            <Label>Current Videos</Label>
            {!videos?.length ? (
              <p className="text-sm text-muted-foreground py-4">No videos added yet</p>
            ) : (
              <div className="space-y-2">
                {videos.map((video: EventVideo) => (
                  <div key={video.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border">
                    <div className="flex items-center gap-3">
                      <img 
                        src={`https://img.youtube.com/vi/${video.youtube_id}/mqdefault.jpg`}
                        alt={video.title}
                        className="w-20 h-12 object-cover rounded"
                      />
                      <div>
                        <p className="font-medium text-foreground">{video.title}</p>
                        <p className="text-xs text-muted-foreground capitalize">{video.video_type}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button size="icon" variant="ghost" asChild>
                        <a href={`https://youtube.com/watch?v=${video.youtube_id}`} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => handleDelete(video.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add New Video */}
          <div className="border-t border-border pt-4">
            <Label className="mb-3 block">Add New Video</Label>
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Video Title *</Label>
                  <Input
                    value={newVideo.title}
                    onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                    placeholder="Match 1 - Team A vs Team B"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Video Type</Label>
                  <Select 
                    value={newVideo.video_type} 
                    onValueChange={(v: 'match' | 'highlight' | 'stream') => setNewVideo({ ...newVideo, video_type: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="match">Match</SelectItem>
                      <SelectItem value="highlight">Highlight</SelectItem>
                      <SelectItem value="stream">Stream</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">YouTube URL *</Label>
                <Input
                  value={newVideo.youtube_url}
                  onChange={(e) => setNewVideo({ ...newVideo, youtube_url: e.target.value })}
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Description (optional)</Label>
                <Textarea
                  value={newVideo.description}
                  onChange={(e) => setNewVideo({ ...newVideo, description: e.target.value })}
                  placeholder="Brief description..."
                  rows={2}
                />
              </div>
              <Button onClick={handleAdd} disabled={addVideo.isPending}>
                <Plus className="w-4 h-4 mr-2" />
                Add Video
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
