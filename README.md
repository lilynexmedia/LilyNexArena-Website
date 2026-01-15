# LilyNex Arena

A modern, professional esports tournament management platform built with React, TypeScript, and Supabase. Features event management, team registrations, admin dashboard, live streaming integration, and dynamic galleries.

![LilyNex Esports](https://img.shields.io/badge/LilyNex-Esports-purple?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=flat-square&logo=supabase)

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Local Setup](#local-setup)
- [Environment Variables](#environment-variables)
- [Supabase Setup](#supabase-setup)
- [Row Level Security (RLS)](#row-level-security-rls)
- [Admin Panel Access](#admin-panel-access)
- [Event Logic](#event-logic)
- [Media Handling](#media-handling)
- [Legal Documents](#legal-documents)
- [Deployment](#deployment)
- [Common Issues & Fixes](#common-issues--fixes)
- [Final Notes](#final-notes)

---

## Project Overview

**LilyNex Esports** is a full-featured esports tournament platform designed for organizing and managing competitive gaming events. 

### Key Features

- **Events System** - Create, manage, and display esports tournaments with automatic status updates
- **Admin Panel** - Secure dashboard for event management, registration approval, and content editing
- **Team Registration** - Public registration with approval workflow and slot management
- **Event & Result Galleries** - Premium image galleries with fullscreen lightbox viewing
- **Live Streaming** - YouTube live stream integration with countdown timers
- **Winners Management** - Track and display tournament winners with prize distribution
- **Legal Documents** - Dynamic legal pages (Terms, Privacy Policy, Rules) with admin editing
- **Home Video Background** - Configurable video backgrounds for immersive landing pages

---

## Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18.3 | UI Framework |
| TypeScript | Type Safety |
| Vite | Build Tool & Dev Server |
| Tailwind CSS | Utility-First Styling |
| shadcn/ui | Component Library |
| React Router 6 | Client-Side Routing |
| TanStack Query | Server State Management |
| Lucide React | Icon Library |
| date-fns | Date Manipulation |

### Backend
| Technology | Purpose |
|------------|---------|
| Supabase | Backend-as-a-Service |
| PostgreSQL | Database |
| Supabase Auth | Authentication (Google OAuth) |
| Supabase Storage | File Storage |
| Edge Functions | Serverless Functions |

### Media & Integrations
| Technology | Purpose |
|------------|---------|
| ImageKit | Image CDN & Optimization |
| YouTube API | Video Embeds & Live Streams |

### Deployment Targets
- Vercel
- Netlify
- Cloudflare Pages
- Any static hosting with SPA support

---

## Local Setup

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm, yarn, or bun
- Git
- Supabase account
- Google Cloud Console access (for OAuth)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/lilynex-esports.git
cd lilynex-esports

# Install dependencies
npm install
# or
yarn install
# or
bun install

# Copy environment template
cp .env.example .env

# Start development server
npm run dev
# or
yarn dev
# or
bun dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview  # Preview production build locally
```

---

## Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# Supabase Configuration (Required)
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_SUPABASE_PROJECT_ID=your-project-id

# These are set in Supabase Dashboard > Settings > API
# SUPABASE_SERVICE_ROLE_KEY is for server-side operations only (Edge Functions)
```

### Variable Descriptions

| Variable | Description | Where to Find |
|----------|-------------|---------------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | Supabase Dashboard → Settings → API |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Anon/Public key for client-side operations | Supabase Dashboard → Settings → API |
| `VITE_SUPABASE_PROJECT_ID` | Project reference ID | Supabase Dashboard → Settings → General |

### Supabase Secrets (Edge Functions)

These are configured in Supabase Dashboard → Settings → Edge Functions → Secrets:

| Secret | Description |
|--------|-------------|
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key for admin operations |
| `SUPABASE_DB_URL` | Direct database connection string |
| `SUPABASE_URL` | Project URL (same as VITE_SUPABASE_URL) |

---

## Supabase Setup

### A) Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note your project URL and API keys from Settings → API
3. Wait for the database to be provisioned

### B) Enable Google Authentication

#### Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Navigate to **APIs & Services → OAuth consent screen**
4. Configure consent screen:
   - User Type: External
   - App name: LilyNex Esports
   - Authorized domains: Add `supabase.co` and your production domain
   - Scopes: `email`, `profile`, `openid`

5. Navigate to **APIs & Services → Credentials**
6. Click **Create Credentials → OAuth Client ID**
7. Application type: **Web application**
8. Add Authorized JavaScript origins:
   ```
   http://localhost:5173
   https://your-domain.com
   ```
9. Add Authorized redirect URIs:
   ```
   https://your-project-id.supabase.co/auth/v1/callback
   ```

#### Supabase Auth Configuration

1. In Supabase Dashboard → Authentication → Providers
2. Enable **Google** provider
3. Enter your Google Client ID and Client Secret
4. Save configuration

### C) Database Schema

Execute the following SQL in Supabase SQL Editor (Dashboard → SQL Editor → New Query):

#### Enums

```sql
-- Create custom enums
CREATE TYPE public.event_status AS ENUM ('upcoming', 'live', 'past', 'closed');
CREATE TYPE public.registration_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE public.app_role AS ENUM ('admin', 'user');
```

#### Core Tables

```sql
-- Events table
CREATE TABLE public.events (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    game TEXT NOT NULL,
    prize_pool TEXT NOT NULL DEFAULT '$0',
    team_slots INTEGER NOT NULL DEFAULT 32,
    status event_status NOT NULL DEFAULT 'upcoming',
    is_registration_open BOOLEAN NOT NULL DEFAULT true,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    registration_start TIMESTAMP WITH TIME ZONE NOT NULL,
    registration_end TIMESTAMP WITH TIME ZONE NOT NULL,
    image_url TEXT,
    background_image_url TEXT,
    youtube_stream_id TEXT,
    coming_soon_video_id TEXT,
    rules TEXT[] DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Team Registrations table
CREATE TABLE public.team_registrations (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
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

-- Event Videos table
CREATE TABLE public.event_videos (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    youtube_id TEXT NOT NULL,
    description TEXT,
    video_type TEXT NOT NULL DEFAULT 'match',
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Event Gallery table
CREATE TABLE public.event_gallery (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    caption TEXT,
    gallery_type TEXT NOT NULL DEFAULT 'event',
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Event Winners table
CREATE TABLE public.event_winners (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    team_name TEXT NOT NULL,
    rank INTEGER NOT NULL,
    prize TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Event Schedule table
CREATE TABLE public.event_schedule (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    phase TEXT NOT NULL,
    date TEXT NOT NULL,
    format TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Prize Distribution table
CREATE TABLE public.prize_distribution (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    place TEXT NOT NULL,
    prize TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User Profiles table
CREATE TABLE public.profiles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE,
    email TEXT NOT NULL,
    display_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User Roles table
CREATE TABLE public.user_roles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(user_id, role)
);

-- Allowed Admin Emails table
CREATE TABLE public.allowed_admin_emails (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Legal Documents table
CREATE TABLE public.legal_documents (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    content TEXT NOT NULL,
    is_published BOOLEAN NOT NULL DEFAULT true,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Site Settings table
CREATE TABLE public.site_settings (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    key TEXT NOT NULL UNIQUE,
    value TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
```

#### Database Functions

```sql
-- Function to check if user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = _user_id AND role = _role
    )
$$;

-- Function to get approved team count for an event
CREATE OR REPLACE FUNCTION public.get_approved_team_count(event_uuid UUID)
RETURNS INTEGER
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
    SELECT COUNT(*)::INTEGER
    FROM public.team_registrations
    WHERE event_id = event_uuid AND status = 'approved'
$$;

-- Function to check if registration is open
CREATE OR REPLACE FUNCTION public.is_registration_open(event_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
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

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
    -- Insert profile
    INSERT INTO public.profiles (user_id, email, display_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', split_part(NEW.email, '@', 1)),
        NEW.raw_user_meta_data ->> 'avatar_url'
    )
    ON CONFLICT (user_id) DO UPDATE SET
        email = EXCLUDED.email,
        display_name = COALESCE(EXCLUDED.display_name, profiles.display_name),
        avatar_url = COALESCE(EXCLUDED.avatar_url, profiles.avatar_url),
        updated_at = now();

    -- Auto-assign admin role if email is in allowed list
    IF EXISTS (SELECT 1 FROM public.allowed_admin_emails WHERE LOWER(email) = LOWER(NEW.email)) THEN
        INSERT INTO public.user_roles (user_id, role)
        VALUES (NEW.id, 'admin')
        ON CONFLICT (user_id, role) DO NOTHING;
    END IF;

    RETURN NEW;
END;
$$;
```

#### Triggers

```sql
-- Trigger for new user registration
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Update timestamps triggers
CREATE TRIGGER update_events_updated_at
    BEFORE UPDATE ON public.events
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_team_registrations_updated_at
    BEFORE UPDATE ON public.team_registrations
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_legal_documents_updated_at
    BEFORE UPDATE ON public.legal_documents
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at
    BEFORE UPDATE ON public.site_settings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
```

#### Storage Bucket

```sql
-- Create storage bucket for event images
INSERT INTO storage.buckets (id, name, public)
VALUES ('event-images', 'event-images', true);

-- Storage policies
CREATE POLICY "Public read access for event images"
ON storage.objects FOR SELECT
USING (bucket_id = 'event-images');

CREATE POLICY "Admin upload access for event images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'event-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin update access for event images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'event-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin delete access for event images"
ON storage.objects FOR DELETE
USING (bucket_id = 'event-images' AND public.has_role(auth.uid(), 'admin'));
```

---

## Row Level Security (RLS)

Enable RLS on all tables and apply the following policies:

### Enable RLS

```sql
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_winners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prize_distribution ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.allowed_admin_emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legal_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
```

### Public Read Policies

```sql
-- Events are publicly viewable
CREATE POLICY "Events are publicly viewable"
ON public.events FOR SELECT
USING (true);

-- Event-related data is publicly viewable
CREATE POLICY "Event videos are publicly viewable"
ON public.event_videos FOR SELECT
USING (true);

CREATE POLICY "Event gallery is publicly viewable"
ON public.event_gallery FOR SELECT
USING (true);

CREATE POLICY "Event winners are publicly viewable"
ON public.event_winners FOR SELECT
USING (true);

CREATE POLICY "Event schedule is publicly viewable"
ON public.event_schedule FOR SELECT
USING (true);

CREATE POLICY "Prize distribution is publicly viewable"
ON public.prize_distribution FOR SELECT
USING (true);

-- Only approved registrations are publicly visible
CREATE POLICY "Approved registrations are publicly viewable"
ON public.team_registrations FOR SELECT
USING (status = 'approved');

-- Public profiles are viewable
CREATE POLICY "Public profiles are viewable"
ON public.profiles FOR SELECT
USING (true);

-- Published legal documents are publicly viewable
CREATE POLICY "Published legal documents are publicly viewable"
ON public.legal_documents FOR SELECT
USING (is_published = true);

-- Site settings are publicly readable
CREATE POLICY "Site settings are publicly readable"
ON public.site_settings FOR SELECT
USING (true);
```

### Admin Write Policies

```sql
-- Admin management policies
CREATE POLICY "Admins can manage events"
ON public.events FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage event videos"
ON public.event_videos FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage event gallery"
ON public.event_gallery FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage event winners"
ON public.event_winners FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage event schedule"
ON public.event_schedule FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage prize distribution"
ON public.prize_distribution FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage all registrations"
ON public.team_registrations FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage legal documents"
ON public.legal_documents FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage site settings"
ON public.site_settings FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
ON public.user_roles FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view allowed emails"
ON public.allowed_admin_emails FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));
```

### User-Specific Policies

```sql
-- Anyone can submit registrations
CREATE POLICY "Anyone can submit registrations"
ON public.team_registrations FOR INSERT
WITH CHECK (true);

-- Users can insert own profile
CREATE POLICY "Users can insert own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update own profile
CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id);

-- Users can view their own roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);
```

---

## Admin Panel Access

### Authentication Flow

1. User navigates to `/admin/login`
2. Clicks "Sign in with Google"
3. Authenticates via Google OAuth
4. System checks if user email exists in `allowed_admin_emails` table
5. If whitelisted, user is granted admin role automatically
6. Redirected to `/admin` dashboard

### Admin Routes

| Route | Purpose |
|-------|---------|
| `/admin` | Main dashboard |
| `/admin/login` | Admin login page |
| `/admin/events` | Events management |
| `/admin/events/:id` | Individual event editing |
| `/admin/registrations` | Registration approvals |
| `/admin/winners` | Winners management |
| `/admin/gallery` | Gallery management |
| `/admin/legal` | Legal documents editing |
| `/admin/settings` | Site settings |

### Adding a New Admin

```sql
-- Add email to allowed admin list
INSERT INTO public.allowed_admin_emails (email)
VALUES ('newadmin@example.com');

-- Or manually assign admin role to existing user
INSERT INTO public.user_roles (user_id, role)
VALUES ('user-uuid-here', 'admin');
```

### Removing Admin Access

```sql
-- Remove from allowed emails (prevents future auto-assignment)
DELETE FROM public.allowed_admin_emails
WHERE email = 'admin@example.com';

-- Remove existing admin role
DELETE FROM public.user_roles
WHERE user_id = 'user-uuid-here' AND role = 'admin';
```

---

## Event Logic

### Event Status Computation

Events have automatic status based on dates:

```typescript
type EventStatus = 'upcoming' | 'live' | 'past' | 'closed';

function computeEventStatus(event) {
  const now = new Date();
  const startDate = new Date(event.start_date);
  const endDate = new Date(event.end_date);

  if (event.status === 'closed') return 'closed';
  if (now < startDate) return 'upcoming';
  if (now >= startDate && now <= endDate) return 'live';
  if (now > endDate) return 'past';
  
  return event.status;
}
```

### Registration States

| State | Condition |
|-------|-----------|
| `opening_soon` | Current time < registration_start |
| `open` | registration_start ≤ now ≤ registration_end AND slots available |
| `closed` | now > registration_end OR slots full OR manually closed |

### Registration Approval Workflow

1. Team submits registration → Status: `pending`
2. Admin reviews in dashboard
3. Admin approves → Status: `approved` → Team appears in public list
4. Admin rejects → Status: `rejected` → Team hidden from public

### Featured Events Logic

Featured events on homepage are determined by:
- Status: `upcoming` or `live`
- Ordered by `start_date` ascending
- Limited to 3 events

### Live Stream Visibility

- Live stream embed shows when:
  - Event status is `live`
  - `youtube_stream_id` is set
- Coming soon video shows when:
  - Event status is `upcoming`
  - `coming_soon_video_id` is set

---

## Media Handling

### Gallery Images

Images can be added via:
1. **Direct URLs** - External image URLs (ImageKit, Cloudinary, etc.)
2. **Supabase Storage** - Upload to `event-images` bucket

#### Adding Gallery Images (Admin)

```typescript
// Via URL
await supabase.from('event_gallery').insert({
  event_id: eventId,
  image_url: 'https://example.com/image.jpg',
  caption: 'Match 1 highlights',
  gallery_type: 'event' // or 'result'
});
```

### Gallery Types

| Type | Purpose |
|------|---------|
| `event` | Pre-event and during-event photos |
| `result` | Post-event result/winner photos |

### Video Embedding

Videos are embedded via YouTube ID:

```typescript
await supabase.from('event_videos').insert({
  event_id: eventId,
  title: 'Grand Finals',
  youtube_id: 'dQw4w9WgXcQ', // Just the ID, not full URL
  video_type: 'match' // or 'highlight'
});
```

### ImageKit Integration (Optional)

If using ImageKit for image optimization:

1. Create ImageKit account at [imagekit.io](https://imagekit.io)
2. Upload images to ImageKit
3. Use ImageKit URLs in `image_url` fields

URL format:
```
https://ik.imagekit.io/your-id/path/to/image.jpg
```

---

## Legal Documents

### Storage Format

Legal documents are stored as plain text/markdown in the `legal_documents` table:

| Field | Description |
|-------|-------------|
| `title` | Display title (e.g., "Privacy Policy") |
| `slug` | URL slug (e.g., "privacy-policy") |
| `content` | Markdown content |
| `is_published` | Visibility toggle |
| `sort_order` | Display order in navigation |

### Admin Editing

1. Navigate to `/admin/legal`
2. Select document to edit
3. Edit markdown content
4. Toggle publish status
5. Save changes

### Frontend Rendering

Documents are rendered at `/docs/:slug`:
- `/docs/privacy-policy`
- `/docs/terms-of-service`
- `/docs/rules`

### Adding New Legal Document

```sql
INSERT INTO public.legal_documents (title, slug, content, is_published, sort_order)
VALUES (
  'Cookie Policy',
  'cookie-policy',
  '# Cookie Policy\n\nThis is our cookie policy...',
  true,
  3
);
```

---

## Deployment

### Vercel

1. Push code to GitHub repository

2. Import project in [Vercel Dashboard](https://vercel.com/new)

3. Configure environment variables:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
   VITE_SUPABASE_PROJECT_ID=your-project-id
   ```

4. Deploy

5. Update Google OAuth redirect URLs:
   - Add `https://your-domain.vercel.app` to authorized origins
   - Callback URL remains: `https://your-project.supabase.co/auth/v1/callback`

6. Update Supabase Auth settings:
   - Site URL: `https://your-domain.vercel.app`
   - Redirect URLs: Add your production domain

### Netlify

1. Push code to GitHub repository

2. Import project in [Netlify Dashboard](https://app.netlify.com/start)

3. Build settings:
   ```
   Build command: npm run build
   Publish directory: dist
   ```

4. Add environment variables in Site Settings → Build & Deploy → Environment

5. Add `_redirects` file to `public/` folder:
   ```
   /*    /index.html   200
   ```

6. Deploy and update OAuth URLs as above

### Custom Domain Configuration

1. Add custom domain in hosting provider
2. Update DNS records (A record or CNAME)
3. Update environment variables if needed
4. Update Google OAuth authorized origins
5. Update Supabase redirect URLs
6. Enable HTTPS (usually automatic)

---

## Common Issues & Fixes

### Google Auth Not Working

**Symptoms:** Redirect loops, "Invalid redirect URI" errors

**Solutions:**
1. Verify redirect URI in Google Cloud Console matches exactly:
   ```
   https://your-project-id.supabase.co/auth/v1/callback
   ```
2. Check Site URL in Supabase Auth settings
3. Ensure authorized JavaScript origins include your domain
4. Clear browser cookies and cache

### RLS Blocking Data

**Symptoms:** Empty data responses, 403 errors

**Solutions:**
1. Check if RLS is enabled on the table
2. Verify policies exist for the operation (SELECT, INSERT, etc.)
3. Use Supabase Dashboard → Table Editor → Policies to debug
4. For admin operations, ensure user has admin role:
   ```sql
   SELECT * FROM public.user_roles WHERE user_id = 'your-user-id';
   ```

### Images Not Loading

**Symptoms:** Broken images, 404 errors

**Solutions:**
1. Verify image URLs are correct and accessible
2. For Supabase Storage, check bucket is public:
   ```sql
   SELECT * FROM storage.buckets WHERE id = 'event-images';
   ```
3. Check storage RLS policies
4. For external URLs, ensure CORS is configured

### Events Not Updating Status

**Symptoms:** Events stuck on wrong status

**Solutions:**
1. Status is computed client-side based on dates
2. Verify `start_date` and `end_date` are set correctly
3. Check timezone handling (all dates stored in UTC)
4. Manual override: Update `status` column directly

### Registration Not Submitting

**Symptoms:** Form submission fails silently

**Solutions:**
1. Check browser console for errors
2. Verify RLS policy allows INSERT:
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'team_registrations';
   ```
3. Check required fields are filled
4. Verify event registration is open

### Admin Access Denied

**Symptoms:** User can't access admin panel

**Solutions:**
1. Check if email is in `allowed_admin_emails`:
   ```sql
   SELECT * FROM public.allowed_admin_emails WHERE email = 'user@example.com';
   ```
2. Check if user has admin role:
   ```sql
   SELECT * FROM public.user_roles WHERE role = 'admin';
   ```
3. User may need to log out and back in for role to apply

---

## Final Notes

### Security Best Practices

- **Never** expose `service_role` key in client-side code
- Always use RLS policies for data access control
- Validate all user inputs server-side
- Keep dependencies updated
- Use HTTPS in production
- Implement rate limiting for registration endpoints

### Scalability Considerations

- Use connection pooling for high traffic
- Implement caching for frequently accessed data
- Consider CDN for static assets
- Use database indexes for frequently queried columns:
  ```sql
  CREATE INDEX idx_events_status ON public.events(status);
  CREATE INDEX idx_events_slug ON public.events(slug);
  CREATE INDEX idx_registrations_event_status ON public.team_registrations(event_id, status);
  ```

### Future Enhancements

- [ ] Real-time registration updates via Supabase Realtime
- [ ] Email notifications for registration status changes
- [ ] Tournament bracket generation
- [ ] Player statistics tracking
- [ ] Discord integration for announcements
- [ ] Multi-language support (i18n)
- [ ] Dark/light theme toggle
- [ ] PWA support for mobile

### Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

### License

This project is proprietary software. All rights reserved.

---

**Built with ❤️ for the esports community**
