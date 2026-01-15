import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Event, EventWithDetails, EventSchedule, PrizeDistribution, EventVideo, EventGalleryImage, EventWinner, TeamRegistration, RegistrationOverride } from '@/lib/types';

export function useEvents(status?: string) {
  return useQuery({
    queryKey: ['events', status],
    queryFn: async () => {
      let query = supabase
        .from('events')
        .select('*')
        .order('start_date', { ascending: true });
      
      if (status && status !== 'all') {
        query = query.eq('status', status as 'upcoming' | 'live' | 'past' | 'closed');
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as unknown as Event[];
    }
  });
}

export function useEvent(idOrSlug: string | undefined) {
  return useQuery({
    queryKey: ['event', idOrSlug],
    queryFn: async () => {
      if (!idOrSlug) return null;

      // Try to find by slug first, then by id
      let eventQuery = supabase
        .from('events')
        .select('*')
        .eq('slug', idOrSlug)
        .maybeSingle();
      
      let { data: event, error } = await eventQuery;
      
      // If not found by slug, try by id
      if (!event && !error) {
        const { data: eventById, error: errorById } = await supabase
          .from('events')
          .select('*')
          .eq('id', idOrSlug)
          .maybeSingle();
        
        event = eventById;
        error = errorById;
      }
      
      if (error) throw error;
      if (!event) return null;

      // Fetch related data in parallel
      const [
        { data: schedule },
        { data: prizeDistribution },
        { data: videos },
        { data: gallery },
        { data: winners },
        { data: approvedTeams }
      ] = await Promise.all([
        supabase.from('event_schedule').select('*').eq('event_id', event.id).order('sort_order'),
        supabase.from('prize_distribution').select('*').eq('event_id', event.id).order('sort_order'),
        supabase.from('event_videos').select('*').eq('event_id', event.id).order('sort_order'),
        supabase.from('event_gallery').select('*').eq('event_id', event.id).order('sort_order'),
        supabase.from('event_winners').select('*').eq('event_id', event.id).order('rank'),
        supabase.rpc('get_approved_teams', { p_event_id: event.id })
      ]);

      const galleryArray = gallery || [];
      const eventGallery = galleryArray.filter((img) => img.gallery_type === 'event');
      const resultGallery = galleryArray.filter((img) => img.gallery_type === 'result');

      return {
        ...event,
        schedule: (schedule || []) as EventSchedule[],
        prizeDistribution: (prizeDistribution || []) as PrizeDistribution[],
        videos: (videos || []) as EventVideo[],
        gallery: eventGallery as EventGalleryImage[],
        resultGallery: resultGallery as EventGalleryImage[],
        winners: (winners || []) as EventWinner[],
        approvedTeams: (approvedTeams || []) as TeamRegistration[],
        approvedTeamCount: approvedTeams?.length || 0
      } as EventWithDetails;
    },
    enabled: !!idOrSlug
  });
}

interface CreateEventData {
  name: string;
  slug: string;
  game: string;
  description?: string;
  prize_pool?: string;
  team_slots?: number;
  status?: 'upcoming' | 'live' | 'past' | 'closed';
  start_date: string;
  end_date: string;
  registration_start: string;
  registration_end: string;
  rules?: string[];
  tags?: string[];
  image_url?: string;
  youtube_stream_id?: string;
  coming_soon_video_id?: string;
  is_registration_open?: boolean;
  registration_override?: RegistrationOverride;
}

export function useCreateEvent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (eventData: CreateEventData) => {
      const { data, error } = await supabase
        .from('events')
        .insert([eventData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    }
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...eventData }: Partial<Event> & { id: string }) => {
      const { data, error } = await supabase
        .from('events')
        .update(eventData as Record<string, unknown>)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['event', data.id] });
      queryClient.invalidateQueries({ queryKey: ['event', data.slug] });
    }
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    }
  });
}

// Team Registration mutations
export function useSubmitRegistration() {
  return useMutation({
    mutationFn: async (registration: Omit<TeamRegistration, 'id' | 'status' | 'created_at' | 'updated_at' | 'notes'>) => {
      const { data, error } = await supabase
        .from('team_registrations')
        .insert([{ ...registration, status: 'pending' as const }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }
  });
}

export function useRegistrations(eventId?: string) {
  return useQuery({
    queryKey: ['registrations', eventId],
    queryFn: async () => {
      let query = supabase
        .from('team_registrations')
        .select('*, events(name)')
        .order('created_at', { ascending: false });
      
      if (eventId) {
        query = query.eq('event_id', eventId);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as unknown as (TeamRegistration & { events: { name: string } })[];
    }
  });
}

export function useUpdateRegistration() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      id, 
      status, 
      previousStatus,
      captainName,
      captainEmail,
      teamName,
      eventName 
    }: { 
      id: string; 
      status: 'approved' | 'rejected' | 'pending';
      previousStatus?: string;
      captainName?: string;
      captainEmail?: string;
      teamName?: string;
      eventName?: string;
    }) => {
      // Update the registration status
      const { data, error } = await supabase
        .from('team_registrations')
        .update({ status })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;

      // Send approval email only when changing TO approved FROM a different status
      if (status === 'approved' && previousStatus !== 'approved' && captainEmail && captainName && teamName && eventName) {
        try {
          const { error: emailError } = await supabase.functions.invoke('send-approval-email', {
            body: {
              captainName,
              captainEmail,
              teamName,
              eventName
            }
          });
          
          if (emailError) {
            console.error('[Approval] Email sending failed:', emailError);
            // Don't throw - approval succeeded, just log email failure
          } else {
            console.log('[Approval] Email sent successfully to:', captainEmail);
          }
        } catch (emailErr) {
          console.error('[Approval] Email sending error:', emailErr);
          // Don't throw - approval succeeded, just log email failure
        }
      }
      
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['registrations'] });
      queryClient.invalidateQueries({ queryKey: ['event', data.event_id] });
    }
  });
}

// Update registration details (for admin editing)
export function useUpdateRegistrationDetails() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updateData }: { 
      id: string; 
      team_name?: string;
      captain_name?: string;
      captain_ingame_name?: string;
      captain_email?: string;
      captain_phone?: string;
      captain_education_type?: string;
      captain_school_name?: string;
      captain_school_class?: string;
      captain_college_name?: string;
      captain_college_year?: string;
      captain_college_branch?: string;
      player_names?: string[];
      player_ingame_names?: string[];
      player_education_details?: Array<{
        type: string;
        schoolName?: string | null;
        schoolClass?: string | null;
        collegeName?: string | null;
        collegeYear?: string | null;
        collegeBranch?: string | null;
      }>;
    }) => {
      const { data, error } = await supabase
        .from('team_registrations')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['registrations'] });
      queryClient.invalidateQueries({ queryKey: ['event', data.event_id] });
    }
  });
}

// Event Videos mutations
export function useEventVideos(eventId: string) {
  return useQuery({
    queryKey: ['event-videos', eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('event_videos')
        .select('*')
        .eq('event_id', eventId)
        .order('sort_order');
      
      if (error) throw error;
      return data as EventVideo[];
    }
  });
}

export function useAddEventVideo() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (video: Omit<EventVideo, 'id' | 'sort_order'> & { sort_order?: number }) => {
      const { data, error } = await supabase
        .from('event_videos')
        .insert([video])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['event-videos', data.event_id] });
      queryClient.invalidateQueries({ queryKey: ['event'] });
    }
  });
}

export function useDeleteEventVideo() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, eventId }: { id: string; eventId: string }) => {
      const { error } = await supabase
        .from('event_videos')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return eventId;
    },
    onSuccess: (eventId) => {
      queryClient.invalidateQueries({ queryKey: ['event-videos', eventId] });
      queryClient.invalidateQueries({ queryKey: ['event'] });
    }
  });
}

// Event Gallery mutations
export function useAddGalleryImage() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (image: Omit<EventGalleryImage, 'id' | 'sort_order'> & { sort_order?: number }) => {
      const { data, error } = await supabase
        .from('event_gallery')
        .insert([image])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['event', data.event_id] });
    }
  });
}

export function useDeleteGalleryImage() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, eventId }: { id: string; eventId: string }) => {
      const { error } = await supabase
        .from('event_gallery')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return eventId;
    },
    onSuccess: (eventId) => {
      queryClient.invalidateQueries({ queryKey: ['event', eventId] });
    }
  });
}

// Event Winners mutations
export function useAddEventWinner() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (winner: Omit<EventWinner, 'id'>) => {
      const { data, error } = await supabase
        .from('event_winners')
        .insert([winner])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['event', data.event_id] });
    }
  });
}

export function useDeleteEventWinner() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, eventId }: { id: string; eventId: string }) => {
      const { error } = await supabase
        .from('event_winners')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return eventId;
    },
    onSuccess: (eventId) => {
      queryClient.invalidateQueries({ queryKey: ['event', eventId] });
    }
  });
}

// Schedule mutations
export function useAddScheduleItem() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (item: Omit<EventSchedule, 'id'>) => {
      const { data, error } = await supabase
        .from('event_schedule')
        .insert([item])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['event', data.event_id] });
    }
  });
}

export function useDeleteScheduleItem() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, eventId }: { id: string; eventId: string }) => {
      const { error } = await supabase
        .from('event_schedule')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return eventId;
    },
    onSuccess: (eventId) => {
      queryClient.invalidateQueries({ queryKey: ['event', eventId] });
    }
  });
}

// Prize distribution mutations
export function useAddPrizeDistribution() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (prize: Omit<PrizeDistribution, 'id'>) => {
      const { data, error } = await supabase
        .from('prize_distribution')
        .insert([prize])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['event', data.event_id] });
    }
  });
}

export function useUpdatePrizeDistribution() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, eventId, ...updateData }: { 
      id: string; 
      eventId: string;
      place?: string;
      prize?: string;
      sort_order?: number;
    }) => {
      const { data, error } = await supabase
        .from('prize_distribution')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return { ...data, eventId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['event', data.eventId] });
    }
  });
}

export function useDeletePrizeDistribution() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, eventId }: { id: string; eventId: string }) => {
      const { error } = await supabase
        .from('prize_distribution')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return eventId;
    },
    onSuccess: (eventId) => {
      queryClient.invalidateQueries({ queryKey: ['event', eventId] });
    }
  });
}
