-- Create app_role enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table for admin access
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    email TEXT NOT NULL,
    display_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable"
ON public.profiles FOR SELECT
USING (true);

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Create event_status enum
CREATE TYPE public.event_status AS ENUM ('upcoming', 'live', 'past', 'closed');

-- Create events table
CREATE TABLE public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    game TEXT NOT NULL,
    description TEXT,
    prize_pool TEXT NOT NULL DEFAULT '$0',
    team_slots INTEGER NOT NULL DEFAULT 32,
    status event_status NOT NULL DEFAULT 'upcoming',
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    registration_start TIMESTAMP WITH TIME ZONE NOT NULL,
    registration_end TIMESTAMP WITH TIME ZONE NOT NULL,
    rules TEXT[] DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    image_url TEXT,
    youtube_stream_id TEXT,
    coming_soon_video_id TEXT,
    is_registration_open BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Events are publicly viewable"
ON public.events FOR SELECT
USING (true);

CREATE POLICY "Admins can manage events"
ON public.events FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create event_schedule table
CREATE TABLE public.event_schedule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
    phase TEXT NOT NULL,
    date TEXT NOT NULL,
    format TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.event_schedule ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Event schedule is publicly viewable"
ON public.event_schedule FOR SELECT
USING (true);

CREATE POLICY "Admins can manage event schedule"
ON public.event_schedule FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create prize_distribution table
CREATE TABLE public.prize_distribution (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
    place TEXT NOT NULL,
    prize TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.prize_distribution ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Prize distribution is publicly viewable"
ON public.prize_distribution FOR SELECT
USING (true);

CREATE POLICY "Admins can manage prize distribution"
ON public.prize_distribution FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create event_videos table (for match videos)
CREATE TABLE public.event_videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
    youtube_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    video_type TEXT NOT NULL DEFAULT 'match', -- 'match', 'highlight', 'stream'
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.event_videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Event videos are publicly viewable"
ON public.event_videos FOR SELECT
USING (true);

CREATE POLICY "Admins can manage event videos"
ON public.event_videos FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create event_gallery table
CREATE TABLE public.event_gallery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
    image_url TEXT NOT NULL,
    caption TEXT,
    gallery_type TEXT NOT NULL DEFAULT 'event', -- 'event' or 'result'
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.event_gallery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Event gallery is publicly viewable"
ON public.event_gallery FOR SELECT
USING (true);

CREATE POLICY "Admins can manage event gallery"
ON public.event_gallery FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create event_winners table
CREATE TABLE public.event_winners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
    team_name TEXT NOT NULL,
    rank INTEGER NOT NULL,
    prize TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.event_winners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Event winners are publicly viewable"
ON public.event_winners FOR SELECT
USING (true);

CREATE POLICY "Admins can manage event winners"
ON public.event_winners FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create registration_status enum
CREATE TYPE public.registration_status AS ENUM ('pending', 'approved', 'rejected');

-- Create team_registrations table
CREATE TABLE public.team_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
    team_name TEXT NOT NULL,
    captain_name TEXT NOT NULL,
    captain_email TEXT NOT NULL,
    captain_phone TEXT,
    player_names TEXT[] NOT NULL,
    player_emails TEXT[],
    player_discord_ids TEXT[],
    status registration_status NOT NULL DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.team_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Approved registrations are publicly viewable"
ON public.team_registrations FOR SELECT
USING (status = 'approved');

CREATE POLICY "Anyone can submit registrations"
ON public.team_registrations FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can manage all registrations"
ON public.team_registrations FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create legal_documents table
CREATE TABLE public.legal_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.legal_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published legal documents are publicly viewable"
ON public.legal_documents FOR SELECT
USING (is_published = true);

CREATE POLICY "Admins can manage legal documents"
ON public.legal_documents FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create allowed_admin_emails table
CREATE TABLE public.allowed_admin_emails (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.allowed_admin_emails ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view allowed emails"
ON public.allowed_admin_emails FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for timestamp updates
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_events_updated_at
BEFORE UPDATE ON public.events
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_team_registrations_updated_at
BEFORE UPDATE ON public.team_registrations
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_legal_documents_updated_at
BEFORE UPDATE ON public.legal_documents
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for event images
INSERT INTO storage.buckets (id, name, public) VALUES ('event-images', 'event-images', true);

-- Storage policies for event images
CREATE POLICY "Event images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'event-images');

CREATE POLICY "Admins can upload event images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'event-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update event images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'event-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete event images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'event-images' AND public.has_role(auth.uid(), 'admin'));

-- Function to count approved teams for an event
CREATE OR REPLACE FUNCTION public.get_approved_team_count(event_uuid UUID)
RETURNS INTEGER
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT COUNT(*)::INTEGER
    FROM public.team_registrations
    WHERE event_id = event_uuid AND status = 'approved'
$$;

-- Function to check if registration is open
CREATE OR REPLACE FUNCTION public.is_registration_open(event_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT 
        e.is_registration_open 
        AND now() >= e.registration_start 
        AND now() <= e.registration_end
        AND e.status NOT IN ('closed', 'past')
        AND public.get_approved_team_count(event_uuid) < e.team_slots
    FROM public.events e
    WHERE e.id = event_uuid
$$;

-- Insert default legal documents
INSERT INTO public.legal_documents (title, slug, content, sort_order) VALUES
('Privacy Policy', 'privacy-policy', '# Privacy Policy

Last updated: December 2024

## Introduction

LilyNex Esports ("we", "our", or "us") respects your privacy and is committed to protecting your personal data.

## Information We Collect

- **Account Information**: Email, username, and profile details
- **Tournament Data**: Team registrations, match history, and performance statistics
- **Technical Data**: IP address, browser type, and device information

## How We Use Your Information

- To provide and maintain our tournament platform
- To notify you about tournament updates and results
- To improve our services and user experience

## Data Security

We implement appropriate security measures to protect your personal information.

## Contact Us

For privacy-related inquiries, contact us at privacy@lilynex.com', 1),
('Terms of Service', 'terms-of-service', '# Terms of Service

Last updated: December 2024

## Acceptance of Terms

By accessing LilyNex Esports, you agree to these terms and conditions.

## Tournament Participation

- All participants must follow tournament rules
- Cheating or unfair play results in disqualification
- Prize distribution is at the discretion of organizers

## User Conduct

- Respectful behavior is required
- Harassment or hate speech is prohibited
- Accounts may be suspended for violations

## Intellectual Property

All content on this platform is owned by LilyNex Esports unless otherwise stated.

## Limitation of Liability

LilyNex Esports is not liable for any damages arising from platform use.

## Changes to Terms

We reserve the right to modify these terms at any time.', 2),
('Cookie Policy', 'cookie-policy', '# Cookie Policy

Last updated: December 2024

## What Are Cookies

Cookies are small text files stored on your device when you visit our website.

## How We Use Cookies

- **Essential Cookies**: Required for website functionality
- **Analytics Cookies**: Help us understand how visitors use our site
- **Preference Cookies**: Remember your settings and preferences

## Managing Cookies

You can control cookies through your browser settings.

## Contact Us

For questions about our cookie policy, contact us at support@lilynex.com', 3),
('Refund Policy', 'refund-policy', '# Refund Policy

Last updated: December 2024

## Tournament Entry Fees

- Refunds are available up to 48 hours before tournament start
- No refunds after tournament begins
- Disqualified teams are not eligible for refunds

## Prize Distribution

- Prizes are distributed within 14 days of tournament completion
- Winners must provide valid payment information
- Tax obligations are the responsibility of the winner

## Contact Us

For refund inquiries, contact us at billing@lilynex.com', 4);