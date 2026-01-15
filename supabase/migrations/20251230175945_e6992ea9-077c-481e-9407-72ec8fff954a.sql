-- Drop the public policy that exposes all columns
DROP POLICY IF EXISTS "Public can view approved registrations for view" ON public.team_registrations;

-- Drop the security invoker view
DROP VIEW IF EXISTS public.public_team_registrations;

-- Create a security definer function to get only safe team data
CREATE OR REPLACE FUNCTION public.get_approved_teams(p_event_id uuid)
RETURNS TABLE (
  id uuid,
  event_id uuid,
  team_name text,
  created_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    tr.id,
    tr.event_id,
    tr.team_name,
    tr.created_at
  FROM public.team_registrations tr
  WHERE tr.event_id = p_event_id 
    AND tr.status = 'approved'
  ORDER BY tr.created_at;
$$;

-- Grant execute to public
GRANT EXECUTE ON FUNCTION public.get_approved_teams(uuid) TO anon, authenticated;