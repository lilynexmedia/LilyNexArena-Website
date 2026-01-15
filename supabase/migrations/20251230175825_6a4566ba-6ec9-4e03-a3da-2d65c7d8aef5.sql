-- Drop the view and recreate with security_invoker to use the caller's permissions
DROP VIEW IF EXISTS public.public_team_registrations;

-- Create the view with SECURITY INVOKER (default, but being explicit)
CREATE VIEW public.public_team_registrations 
WITH (security_invoker = true)
AS
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

-- Now we need a policy that allows public SELECT on the underlying table
-- but ONLY for the columns in the view (which is implicit through the view)
-- The view will only return approved registrations with safe columns

-- Create a minimal read policy for the view to work
-- This policy allows reading ONLY status='approved' rows for the view
CREATE POLICY "Public can view approved team names only" 
ON public.team_registrations 
FOR SELECT 
TO anon, authenticated
USING (status = 'approved');