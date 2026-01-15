import { useState, useEffect } from 'react';
import { useSiteSettings, useUpdateSiteSetting } from '@/hooks/useSiteSettings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Video, Save, ExternalLink, Loader2, Check } from 'lucide-react';

export function AdminVideoSettings() {
  const { homeVideoUrl, isLoading } = useSiteSettings();
  const updateSetting = useUpdateSiteSetting();
  const [videoUrl, setVideoUrl] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (homeVideoUrl) {
      setVideoUrl(homeVideoUrl);
    }
  }, [homeVideoUrl]);

  const handleSave = () => {
    if (videoUrl.trim()) {
      updateSetting.mutate({ key: 'home_video_url', value: videoUrl.trim() });
    }
  };

  const hasChanges = videoUrl !== homeVideoUrl;

  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          <span className="text-muted-foreground">Loading settings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
          <Video className="w-5 h-5 text-cyan-500" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Home Page Video</h3>
          <p className="text-sm text-muted-foreground">Background video for the hero section</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="video-url">Video URL</Label>
          <Input
            id="video-url"
            type="url"
            placeholder="https://example.com/video.mp4"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            className="font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground">
            Enter a direct link to an MP4 video file. Recommended aspect ratio: 16:9
          </p>
        </div>

        {/* Preview Section */}
        {showPreview && videoUrl && (
          <div className="relative aspect-video rounded-lg overflow-hidden bg-muted border border-border">
            <video
              key={videoUrl}
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
            >
              <source src={videoUrl} type="video/mp4" />
              <p className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                Unable to load video preview
              </p>
            </video>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            onClick={() => setShowPreview(!showPreview)}
            disabled={!videoUrl}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            {showPreview ? 'Hide Preview' : 'Preview Video'}
          </Button>

          <Button
            onClick={handleSave}
            disabled={!hasChanges || updateSetting.isPending}
          >
            {updateSetting.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : updateSetting.isSuccess && !hasChanges ? (
              <Check className="w-4 h-4 mr-2" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {updateSetting.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>

        {!hasChanges && homeVideoUrl && (
          <p className="text-xs text-green-500 flex items-center gap-1">
            <Check className="w-3 h-3" />
            Video URL is up to date
          </p>
        )}
      </div>
    </div>
  );
}
