-- Part 1 & 3: Add unique constraint for one email per event
-- This ensures database-level protection against duplicate registrations

-- Add unique constraint on event_id + captain_email
ALTER TABLE public.team_registrations 
ADD CONSTRAINT unique_email_per_event UNIQUE (event_id, captain_email);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_team_registrations_event_email 
ON public.team_registrations (event_id, captain_email);

-- Create a table for rate limiting (simple approach)
CREATE TABLE IF NOT EXISTS public.registration_rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address text NOT NULL,
  email text,
  attempt_count integer DEFAULT 1,
  first_attempt_at timestamp with time zone DEFAULT now(),
  last_attempt_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on rate limits table
ALTER TABLE public.registration_rate_limits ENABLE ROW LEVEL SECURITY;

-- Allow insert/update for rate tracking (service role will handle this in edge function)
CREATE POLICY "Service role can manage rate limits"
ON public.registration_rate_limits
FOR ALL
USING (true)
WITH CHECK (true);

-- Create index for efficient rate limit lookups
CREATE INDEX IF NOT EXISTS idx_rate_limits_ip_time 
ON public.registration_rate_limits (ip_address, last_attempt_at);

-- Function to clean up old rate limit entries (older than 1 hour)
CREATE OR REPLACE FUNCTION public.cleanup_old_rate_limits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.registration_rate_limits 
  WHERE last_attempt_at < now() - interval '1 hour';
END;
$$;