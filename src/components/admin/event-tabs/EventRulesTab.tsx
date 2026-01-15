import { useState } from 'react';
import { useUpdateEvent } from '@/hooks/useEvents';
import { EventWithDetails } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { FileText, Plus, Trash2, Save, GripVertical } from 'lucide-react';

interface Props {
  event: EventWithDetails;
  onUpdate: () => void;
}

export const EventRulesTab = ({ event, onUpdate }: Props) => {
  const updateEvent = useUpdateEvent();
  const [rules, setRules] = useState<string[]>(event.rules || []);
  const [newRule, setNewRule] = useState('');

  const handleAddRule = () => {
    if (!newRule.trim()) return;
    setRules([...rules, newRule.trim()]);
    setNewRule('');
  };

  const handleRemoveRule = (index: number) => {
    setRules(rules.filter((_, i) => i !== index));
  };

  const handleUpdateRule = (index: number, value: string) => {
    const updated = [...rules];
    updated[index] = value;
    setRules(updated);
  };

  const handleSave = async () => {
    try {
      await updateEvent.mutateAsync({
        id: event.id,
        rules: rules.filter(r => r.trim()),
      });
      onUpdate();
      toast({ title: 'Success', description: 'Rules updated successfully' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update rules', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Rules & Regulations
          </CardTitle>
          <Button onClick={handleSave} disabled={updateEvent.isPending}>
            <Save className="w-4 h-4 mr-2" />
            Save Rules
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Add tournament rules that will be displayed on the public event page. 
            Each rule will be shown as a numbered list item.
          </p>

          {/* Current Rules */}
          {rules.length > 0 && (
            <div className="space-y-2">
              {rules.map((rule, index) => (
                <div key={index} className="flex items-start gap-2 group">
                  <div className="flex items-center justify-center w-8 h-10 text-sm text-muted-foreground">
                    {index + 1}.
                  </div>
                  <Textarea
                    value={rule}
                    onChange={(e) => handleUpdateRule(index, e.target.value)}
                    className="flex-1 min-h-[40px] resize-none"
                    rows={1}
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleRemoveRule(index)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Add New Rule */}
          <div className="flex gap-2 pt-4 border-t border-border">
            <Input
              value={newRule}
              onChange={(e) => setNewRule(e.target.value)}
              placeholder="Add a new rule..."
              onKeyDown={(e) => e.key === 'Enter' && handleAddRule()}
            />
            <Button onClick={handleAddRule} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add
            </Button>
          </div>

          {rules.length === 0 && (
            <div className="text-center py-8 border-2 border-dashed border-border rounded-lg">
              <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No rules added yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Add tournament rules for participants to follow
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preview */}
      {rules.length > 0 && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg">Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-invert max-w-none">
              <ol className="space-y-2 list-decimal list-inside">
                {rules.map((rule, index) => (
                  <li key={index} className="text-foreground">
                    {rule}
                  </li>
                ))}
              </ol>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
