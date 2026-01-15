import { useState, useEffect } from 'react';
import { useLegalDocs, useLegalDoc, useCreateLegalDoc, useUpdateLegalDoc, useDeleteLegalDoc } from '@/hooks/useLegalDocs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';
import { FileText, Plus, Pencil, Trash2, Eye, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';

type DocFormData = {
  title: string;
  slug: string;
  content: string;
  is_published: boolean;
  sort_order: number;
};

const defaultFormData: DocFormData = {
  title: '',
  slug: '',
  content: '',
  is_published: true,
  sort_order: 0,
};

export const AdminLegal = () => {
  const { data: docs, isLoading } = useLegalDocs();
  const createDoc = useCreateLegalDoc();
  const updateDoc = useUpdateLegalDoc();
  const deleteDoc = useDeleteLegalDoc();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [formData, setFormData] = useState<DocFormData>(defaultFormData);

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const handleOpenCreate = () => {
    setFormData(defaultFormData);
    setIsEditing(false);
    setSelectedDocId(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (doc: DocFormData & { id: string }) => {
    setFormData({
      title: doc.title,
      slug: doc.slug,
      content: doc.content,
      is_published: doc.is_published,
      sort_order: doc.sort_order,
    });
    setSelectedDocId(doc.id);
    setIsEditing(true);
    setIsFormOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.content) {
      toast({ title: 'Error', description: 'Title and content are required', variant: 'destructive' });
      return;
    }

    try {
      if (isEditing && selectedDocId) {
        await updateDoc.mutateAsync({
          id: selectedDocId,
          ...formData,
          slug: formData.slug || generateSlug(formData.title),
        });
        toast({ title: 'Success', description: 'Document updated' });
      } else {
        await createDoc.mutateAsync({
          ...formData,
          slug: formData.slug || generateSlug(formData.title),
        });
        toast({ title: 'Success', description: 'Document created' });
      }
      setIsFormOpen(false);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save document', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return;

    try {
      await deleteDoc.mutateAsync(id);
      toast({ title: 'Success', description: 'Document deleted' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete document', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Legal Documents</h1>
          <p className="text-muted-foreground">Manage privacy policy, terms, and other legal pages</p>
        </div>
        <Button onClick={handleOpenCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Create Document
        </Button>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            All Documents
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full" />)}
            </div>
          ) : docs?.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No documents yet. Create your first one!</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {docs?.map(doc => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium">{doc.title}</TableCell>
                      <TableCell className="text-muted-foreground">/docs/{doc.slug}</TableCell>
                      <TableCell>
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          doc.is_published 
                            ? 'bg-green-500/20 text-green-500' 
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {doc.is_published ? 'Published' : 'Draft'}
                        </span>
                      </TableCell>
                      <TableCell>{format(new Date(doc.updated_at), 'MMM d, yyyy')}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button size="icon" variant="ghost" asChild>
                            <a href={`/docs/${doc.slug}`} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </Button>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            onClick={() => handleOpenEdit({ ...doc })}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            onClick={() => handleDelete(doc.id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
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

      {/* Create/Edit Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Document' : 'Create New Document'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Title *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    title: e.target.value,
                    slug: generateSlug(e.target.value)
                  })}
                  placeholder="Privacy Policy"
                />
              </div>
              <div className="space-y-2">
                <Label>Slug</Label>
                <Input
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="privacy-policy"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Content (Markdown) *</Label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="# Privacy Policy&#10;&#10;Your content here..."
                rows={15}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Supports Markdown formatting: headers (#), bold (**text**), lists (-), links, etc.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="published"
                  checked={formData.is_published}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
                />
                <Label htmlFor="published">Published</Label>
              </div>
              <div className="flex items-center gap-2">
                <Label className="text-sm">Sort Order:</Label>
                <Input
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                  className="w-20"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={createDoc.isPending || updateDoc.isPending}>
              {isEditing ? 'Update Document' : 'Create Document'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
