-- Re-add the policy for the view to work (security_invoker views need base table access)
-- But this time the view only exposes safe columns (team_name, event_id, status, created_at)
CREATE POLICY "Public can view approved registrations for view" 
ON public.team_registrations 
FOR SELECT 
TO anon, authenticated
USING (status = 'approved');