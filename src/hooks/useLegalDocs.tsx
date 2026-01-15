import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { LegalDocument } from '@/lib/types';

export function useLegalDocs() {
  return useQuery({
    queryKey: ['legal-docs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('legal_documents')
        .select('*')
        .order('sort_order');
      
      if (error) throw error;
      return data as LegalDocument[];
    }
  });
}

export function useLegalDoc(slug: string | undefined) {
  return useQuery({
    queryKey: ['legal-doc', slug],
    queryFn: async () => {
      if (!slug) return null;
      
      const { data, error } = await supabase
        .from('legal_documents')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();
      
      if (error) throw error;
      return data as LegalDocument | null;
    },
    enabled: !!slug
  });
}

export function useCreateLegalDoc() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (doc: Omit<LegalDocument, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('legal_documents')
        .insert([doc])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['legal-docs'] });
    }
  });
}

export function useUpdateLegalDoc() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...doc }: Partial<LegalDocument> & { id: string }) => {
      const { data, error } = await supabase
        .from('legal_documents')
        .update(doc)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['legal-docs'] });
      queryClient.invalidateQueries({ queryKey: ['legal-doc', data.slug] });
    }
  });
}

export function useDeleteLegalDoc() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('legal_documents')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['legal-docs'] });
    }
  });
}
