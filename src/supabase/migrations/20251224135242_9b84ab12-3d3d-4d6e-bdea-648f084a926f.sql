-- Add registration_override column
-- Values: NULL = automatic (time-based), 'open' = force open, 'closed' = force closed
ALTER TABLE public.events 
ADD COLUMN IF NOT EXISTS registration_override text DEFAULT NULL;

-- Add comment for documentation
COMMENT ON COLUMN public.events.registration_override IS 'Manual override for registration state. NULL=auto, open=force open, closed=force closed';