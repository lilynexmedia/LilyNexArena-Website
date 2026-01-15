export type EventStatus = 'upcoming' | 'live' | 'past' | 'closed';
export type RegistrationStatus = 'pending' | 'approved' | 'rejected';
export type RegistrationOverride = 'open' | 'closed' | null;

export interface Event {
  id: string;
  name: string;
  slug: string;
  game: string;
  description: string | null;
  prize_pool: string;
  team_slots: number;
  status: EventStatus;
  start_date: string;
  end_date: string;
  registration_start: string;
  registration_end: string;
  rules: string[];
  tags: string[];
  image_url: string | null;
  youtube_stream_id: string | null;
  coming_soon_video_id: string | null;
  is_registration_open: boolean;
  registration_override: RegistrationOverride;
  created_at: string;
  updated_at: string;
}

export interface EventSchedule {
  id: string;
  event_id: string;
  phase: string;
  date: string;
  format: string;
  sort_order: number;
}

export interface PrizeDistribution {
  id: string;
  event_id: string;
  place: string;
  prize: string;
  sort_order: number;
}

export interface EventVideo {
  id: string;
  event_id: string;
  youtube_id: string;
  title: string;
  description: string | null;
  video_type: 'match' | 'highlight' | 'stream';
  sort_order: number;
}

export interface EventGalleryImage {
  id: string;
  event_id: string;
  image_url: string;
  caption: string | null;
  gallery_type: 'event' | 'result';
  sort_order: number;
}

export interface EventWinner {
  id: string;
  event_id: string;
  team_name: string;
  rank: number;
  prize: string | null;
}

export interface TeamRegistration {
  id: string;
  event_id: string;
  team_name: string;
  captain_name: string;
  captain_email: string;
  captain_phone: string | null;
  player_names: string[];
  player_emails: string[] | null;
  player_discord_ids: string[] | null;
  status: RegistrationStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface LegalDocument {
  id: string;
  title: string;
  slug: string;
  content: string;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface EventWithDetails extends Event {
  schedule: EventSchedule[];
  prizeDistribution: PrizeDistribution[];
  videos: EventVideo[];
  gallery: EventGalleryImage[];
  resultGallery: EventGalleryImage[];
  winners: EventWinner[];
  approvedTeams: TeamRegistration[];
  approvedTeamCount: number;
}
