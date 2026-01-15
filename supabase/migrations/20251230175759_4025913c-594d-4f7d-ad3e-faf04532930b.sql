-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Approved registrations are publicly viewable" ON public.team_registrations;

-- Create a new policy that only allows public to see limited fields via a function
-- First, create a secure view for public team display (without personal data)
CREATE OR REPLACE VIEW public.public_team_registrations AS
SELECT 
  id,
  event_id,
  team_name,
  status,
  created_at
FROM public.team_registrations
WHERE status = 'approved';

-- Grant select on the view to anon and authenticated
GRANT SELECT ON public.public_team_registrations TO anon, authenticated;

-- The underlying table now only allows admin access for reading all data
-- Public users should use the view instead
-- Keep the existing admin policy which already exists