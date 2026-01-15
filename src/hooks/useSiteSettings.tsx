import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SiteSetting {
  id: string;
  key: string;
  value: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export function useSiteSettings() {
  const { data: settings, isLoading } = useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*');
      
      if (error) throw error;
      return data as SiteSetting[];
    },
  });

  const getSetting = (key: string): string | null => {
    const setting = settings?.find(s => s.key === key);
    return setting?.value ?? null;
  };

  return {
    settings,
    isLoading,
    getSetting,
    homeVideoUrl: getSetting('home_video_url'),
  };
}

export function useUpdateSiteSetting() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      const { data, error } = await supabase
        .from('site_settings')
        .update({ value })
        .eq('key', key)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
      toast({
        title: 'Setting updated',
        description: 'The setting has been saved successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error updating setting',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}
