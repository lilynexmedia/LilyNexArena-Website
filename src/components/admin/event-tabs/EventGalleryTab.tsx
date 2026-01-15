import { useState, useRef } from 'react';
import { useAddGalleryImage, useDeleteGalleryImage } from '@/hooks/useEvents';
import { supabase } from '@/integrations/supabase/client';
import { EventWithDetails } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { Image, Upload, Trash2, Link, Plus } from 'lucide-react';

interface Props {
  event: EventWithDetails;
  onUpdate: () => void;
}

export const EventGalleryTab = ({ event, onUpdate }: Props) => {
  const [galleryType, setGalleryType] = useState<'event' | 'result'>('event');
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageCaption, setImageCaption] = useState('');
  const [addingLink, setAddingLink] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addGalleryImage = useAddGalleryImage();
  const deleteGalleryImage = useDeleteGalleryImage();

  const currentGallery = galleryType === 'event' 
    ? event.gallery || []
    : event.resultGallery || [];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploading(true);

    for (const file of Array.from(files)) {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${event.id}/${galleryType}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('event-images')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('event-images')
          .getPublicUrl(fileName);

        await addGalleryImage.mutateAsync({
          event_id: event.id,
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
    onUpdate();
    toast({ title: 'Success', description: 'Images uploaded successfully' });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAddByLink = async () => {
    if (!imageUrl.trim()) {
      toast({ title: 'Error', description: 'Please enter an image URL', variant: 'destructive' });
      return;
    }

    // Basic URL validation
    try {
      new URL(imageUrl);
    } catch {
      toast({ title: 'Error', description: 'Please enter a valid URL', variant: 'destructive' });
      return;
    }

    setAddingLink(true);
    try {
      await addGalleryImage.mutateAsync({
        event_id: event.id,
        image_url: imageUrl.trim(),
        gallery_type: galleryType,
        caption: imageCaption.trim() || null,
      });
      
      setImageUrl('');
      setImageCaption('');
      onUpdate();
      toast({ title: 'Success', description: 'Image added successfully' });
    } catch (error) {
      console.error('Add link error:', error);
      toast({ title: 'Error', description: 'Failed to add image', variant: 'destructive' });
    }
    setAddingLink(false);
  };

  const handleDelete = async (id: string, imageUrl: string) => {
    if (!confirm('Delete this image?')) return;

    try {
      // Only try to delete from storage if it's from our bucket
      const urlParts = imageUrl.split('/event-images/');
      if (urlParts[1] && imageUrl.includes('supabase')) {
        await supabase.storage.from('event-images').remove([urlParts[1]]);
      }

      await deleteGalleryImage.mutateAsync({ id, eventId: event.id });
      onUpdate();
      toast({ title: 'Success', description: 'Image deleted' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete image', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Image className="w-5 h-5 text-primary" />
            Gallery Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={galleryType} onValueChange={(v) => setGalleryType(v as 'event' | 'result')}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <TabsList>
                <TabsTrigger value="event">
                  Event Gallery ({event.gallery?.length || 0})
                </TabsTrigger>
                <TabsTrigger value="result">
                  Result Gallery ({event.resultGallery?.length || 0})
                </TabsTrigger>
              </TabsList>
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
            </div>

            {/* Add by URL Section */}
            <div className="mb-6 p-4 rounded-lg bg-muted/30 border border-border/50">
              <h4 className="font-heading text-sm font-semibold mb-3 flex items-center gap-2">
                <Link className="w-4 h-4 text-primary" />
                Add Image by URL
              </h4>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <Input
                    placeholder="Paste image URL (e.g., https://example.com/image.jpg)"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="bg-background"
                  />
                </div>
                <div className="sm:w-48">
                  <Input
                    placeholder="Caption (optional)"
                    value={imageCaption}
                    onChange={(e) => setImageCaption(e.target.value)}
                    className="bg-background"
                  />
                </div>
                <Button 
                  onClick={handleAddByLink} 
                  disabled={addingLink || !imageUrl.trim()}
                  className="shrink-0"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {addingLink ? 'Adding...' : 'Add Image'}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                You can use any publicly accessible image URL from services like ImageKit, Cloudinary, Imgur, etc.
              </p>
            </div>

            <TabsContent value="event">
              <GalleryGrid 
                images={event.gallery || []} 
                onDelete={handleDelete} 
                emptyMessage="No event photos yet. Upload some to showcase the tournament!"
              />
            </TabsContent>

            <TabsContent value="result">
              <GalleryGrid 
                images={event.resultGallery || []} 
                onDelete={handleDelete}
                emptyMessage="No result images yet. Add photos after the event is completed."
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

const GalleryGrid = ({ 
  images, 
  onDelete, 
  emptyMessage 
}: { 
  images: { id: string; image_url: string; caption: string | null }[];
  onDelete: (id: string, url: string) => void;
  emptyMessage: string;
}) => {
  if (images.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
        <Image className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {images.map((img) => (
        <div key={img.id} className="relative group aspect-square rounded-lg overflow-hidden border border-border">
          <img 
            src={img.image_url} 
            alt={img.caption || 'Gallery image'}
            className="w-full h-full object-cover"
          />
          {img.caption && (
            <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/60 text-white text-xs truncate">
              {img.caption}
            </div>
          )}
          <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button 
              size="icon" 
              variant="destructive"
              onClick={() => onDelete(img.id, img.image_url)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};
