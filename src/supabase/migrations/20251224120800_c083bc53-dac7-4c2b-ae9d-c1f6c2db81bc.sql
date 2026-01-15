-- Add background_image_url column to events table
ALTER TABLE public.events 
ADD COLUMN background_image_url text;