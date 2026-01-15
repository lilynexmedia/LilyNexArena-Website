import { useState, useEffect } from 'react';
import { useSiteSettings, useUpdateSiteSetting } from '@/hooks/useSiteSettings';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';
import { Video, Save, ExternalLink } from 'lucide-react';

export const AdminSettings = () => {
  const { homeVideoUrl, isLoading } = useSiteSettings();
  const updateSetting = useUpdateSiteSetting();
  const [videoUrl, setVideoUrl] = useState('');

  useEffect(() => {
    if (homeVideoUrl) {
      setVideoUrl(homeVideoUrl);
    }
  }, [homeVideoUrl]);

  const handleSave = async () => {
    if (!videoUrl.trim()) {
      toast({ title: 'Error', description: 'Video URL cannot be empty', variant: 'destructive' });
      return;
    }

    try {
      await updateSetting.mutateAsync({ key: 'home_video_url', value: videoUrl });
      toast({ title: 'Success', description: 'Home video URL updated successfully' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update video URL', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Site Settings</h1>
        <p className="text-muted-foreground">Configure global site settings</p>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="w-5 h-5 text-primary" />
            Home Page Background Video
          </CardTitle>
          <CardDescription>
            Set the background video URL for the home page hero section
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="video-url">Video URL</Label>
                <Input
                  id="video-url"
                  placeholder="https://example.com/video.mp4"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="bg-input border-border"
                />
                <p className="text-xs text-muted-foreground">
                  Supports MP4, WebM formats. For best results, use a CDN-hosted video.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Button onClick={handleSave} disabled={updateSetting.isPending}>
                  <Save className="w-4 h-4 mr-2" />
                  {updateSetting.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
                {videoUrl && (
                  <Button variant="outline" asChild>
                    <a href={videoUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Preview
                    </a>
                  </Button>
                )}
              </div>

              {/* Video Preview */}
              {videoUrl && (
                <div className="mt-4">
                  <Label>Current Video Preview</Label>
                  <div className="mt-2 rounded-lg overflow-hidden border border-border aspect-video max-w-xl">
                    <video
                      src={videoUrl}
                      className="w-full h-full object-cover"
                      muted
                      loop
                      autoPlay
                      playsInline
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
