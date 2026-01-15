-- Add new columns for detailed player information
ALTER TABLE public.team_registrations
ADD COLUMN IF NOT EXISTS captain_ingame_name text,
ADD COLUMN IF NOT EXISTS captain_education_type text CHECK (captain_education_type IN ('school', 'college')),
ADD COLUMN IF NOT EXISTS captain_school_name text,
ADD COLUMN IF NOT EXISTS captain_school_class text,
ADD COLUMN IF NOT EXISTS captain_college_name text,
ADD COLUMN IF NOT EXISTS captain_college_year text,
ADD COLUMN IF NOT EXISTS captain_college_branch text,
ADD COLUMN IF NOT EXISTS player_ingame_names text[],
ADD COLUMN IF NOT EXISTS player_education_details jsonb DEFAULT '[]'::jsonb;

-- Add comments for clarity
COMMENT ON COLUMN public.team_registrations.captain_ingame_name IS 'In-game name of the team captain';
COMMENT ON COLUMN public.team_registrations.captain_education_type IS 'Type of education: school or college';
COMMENT ON COLUMN public.team_registrations.player_ingame_names IS 'Array of in-game names for each player';
COMMENT ON COLUMN public.team_registrations.player_education_details IS 'JSON array of education details for each player';