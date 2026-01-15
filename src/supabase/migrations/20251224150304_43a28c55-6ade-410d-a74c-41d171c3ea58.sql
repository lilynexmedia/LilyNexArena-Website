-- Remove the background_image_url column since it's no longer used
ALTER TABLE public.events DROP COLUMN IF EXISTS background_image_url;