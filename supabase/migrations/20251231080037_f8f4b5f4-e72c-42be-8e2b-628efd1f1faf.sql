-- Add entry_amount to events table (default 0 = free event)
ALTER TABLE public.events 
ADD COLUMN IF NOT EXISTS entry_amount INTEGER NOT NULL DEFAULT 0;

-- Add payment-related fields to team_registrations
ALTER TABLE public.team_registrations 
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'not_required',
ADD COLUMN IF NOT EXISTS payment_id TEXT,
ADD COLUMN IF NOT EXISTS razorpay_order_id TEXT,
ADD COLUMN IF NOT EXISTS payment_signature TEXT,
ADD COLUMN IF NOT EXISTS payment_amount INTEGER,
ADD COLUMN IF NOT EXISTS paid_at TIMESTAMP WITH TIME ZONE;

-- Add comment for clarity
COMMENT ON COLUMN public.events.entry_amount IS 'Entry fee in INR. 0 = free event.';
COMMENT ON COLUMN public.team_registrations.payment_status IS 'Payment status: not_required, pending, paid, failed';
COMMENT ON COLUMN public.team_registrations.payment_id IS 'Razorpay payment ID';
COMMENT ON COLUMN public.team_registrations.razorpay_order_id IS 'Razorpay order ID';
COMMENT ON COLUMN public.team_registrations.payment_signature IS 'Razorpay payment signature for verification';
COMMENT ON COLUMN public.team_registrations.payment_amount IS 'Amount paid in INR';

-- Create index for payment lookups
CREATE INDEX IF NOT EXISTS idx_team_registrations_payment_status 
ON public.team_registrations(payment_status);

CREATE INDEX IF NOT EXISTS idx_team_registrations_razorpay_order_id 
ON public.team_registrations(razorpay_order_id);