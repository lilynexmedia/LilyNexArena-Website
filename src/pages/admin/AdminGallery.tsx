import { useState, useRef } from 'react';
import { useEvents, useEvent, useAddGalleryImage, useDeleteGalleryImage } from '@/hooks/useEvents';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';
import { Image, Upload, Trash2, X } from 'lucide-react';

export const AdminGallery = () => {
  const { data: events, isLoading: eventsLoading } = useEvents();
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [galleryType, setGalleryType] = useState<'event' | 'result'>('event');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: eventDetails, refetch } = useEvent(selectedEventId);
  const addGalleryImage = useAddGalleryImage();
  const deleteGalleryImage = useDeleteGalleryImage();

  const currentGallery = galleryType === 'event' 
    ? eventDetails?.gallery || []
    : eventDetails?.resultGallery || [];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !selectedEventId) return;

    setUploading(true);

    for (const file of Array.from(files)) {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${selectedEventId}/${galleryType}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('event-images')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('event-images')
          .getPublicUrl(fileName);

        await addGalleryImage.mutateAsync({
          event_id: selectedEventId,
          image_url: urlData.publicUrl,
          gallery_type: galleryType,
          caption: null,
        });
      } catch (error) {
        console.error('Upload error:', error);
        toast({ title: 'Error', description: `Failed to upload ${file.name}`, variant: 'destructive' });
      }
    }

    setUploading(false);
    refetch();
    toast({ title: 'Success', description: 'Images uploaded successfully' });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDelete = async (id: string, imageUrl: string) => {
    if (!selectedEventId) return;
    if (!confirm('Delete this image?')) return;

    try {
      // Extract path from URL for storage deletion
      const urlParts = imageUrl.split('/event-images/');
      if (urlParts[1]) {
        await supabase.storage.from('event-images').remove([urlParts[1]]);
      }

      await deleteGalleryImage.mutateAsync({ id, eventId: selectedEventId });
      refetch();
      toast({ title: 'Success', description: 'Image deleted' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete image', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Event Gallery</h1>
        <p className="text-muted-foreground">Manage event photos and result images</p>
      </div>

      {/* Event Selection */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg">Select Event</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
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
            <div className="w-[180px]">
              <Label className="text-xs mb-1 block">Gallery Type</Label>
              <Select value={galleryType} onValueChange={(v: 'event' | 'result') => setGalleryType(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="event">Event Gallery</SelectItem>
                  <SelectItem value="result">Result Gallery</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gallery Management */}
      {selectedEventId ? (
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Image className="w-5 h-5 text-primary" />
              {galleryType === 'event' ? 'Event' : 'Result'} Gallery
              <span className="text-sm font-normal text-muted-foreground">
                ({currentGallery.length} images)
              </span>
            </CardTitle>
            <div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                <Upload className="w-4 h-4 mr-2" />
                {uploading ? 'Uploading...' : 'Upload Images'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {currentGallery.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
                <Image className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No images yet. Upload some!</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {currentGallery.map((img) => (
                  <div key={img.id} className="relative group aspect-square rounded-lg overflow-hidden border border-border">
                    <img 
                      src={img.image_url} 
                      alt={img.caption || 'Gallery image'}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button 
                        size="icon" 
                        variant="destructive"
                        onClick={() => handleDelete(img.id, img.image_url)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-card border-border">
          <CardContent className="py-12">
            <p className="text-muted-foreground text-center">Select an event to manage its gallery</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
