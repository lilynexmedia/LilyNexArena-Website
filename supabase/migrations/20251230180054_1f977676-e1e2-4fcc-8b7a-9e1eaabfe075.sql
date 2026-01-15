-- Fix the registration_rate_limits policy to be service role only
-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Service role can manage rate limits" ON public.registration_rate_limits;

-- Create a more restrictive policy - only service role (via edge functions) can access
-- Since service role bypasses RLS, we just need to ensure anon/authenticated can't access
-- By having no policies that match anon/authenticated, they have no access