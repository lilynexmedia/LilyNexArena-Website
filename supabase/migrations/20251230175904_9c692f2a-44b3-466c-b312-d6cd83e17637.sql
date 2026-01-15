-- Remove the policy that exposes all columns for approved registrations
-- The view handles public access now with only safe columns
DROP POLICY IF EXISTS "Public can view approved team names only" ON public.team_registrations;